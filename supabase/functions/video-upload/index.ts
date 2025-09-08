import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid user' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'POST') {
      const formData = await req.formData()
      const videoFile = formData.get('video') as File
      const gameInfoStr = formData.get('gameInfo') as string
      const videoUrl = formData.get('videoUrl') as string

      if (!videoFile && !videoUrl) {
        return new Response(
          JSON.stringify({ error: 'No video file or URL provided' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      let gameInfo
      try {
        gameInfo = JSON.parse(gameInfoStr || '{}')
      } catch {
        gameInfo = {}
      }

      // Validate required game info
      if (!gameInfo.homeTeam || !gameInfo.awayTeam || !gameInfo.date) {
        return new Response(
          JSON.stringify({ error: 'Missing required game information (homeTeam, awayTeam, date)' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Create game record
      const { data: game, error: gameError } = await supabase
        .from('games')
        .insert({
          home_team: gameInfo.homeTeam,
          away_team: gameInfo.awayTeam,
          date: gameInfo.date,
          status: 'uploaded',
          user_id: user.id,
          video_url: videoUrl || null
        })
        .select()
        .single()

      if (gameError) {
        console.error('Error creating game:', gameError)
        return new Response(
          JSON.stringify({ error: 'Failed to create game record' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      let videoPath = null

      // Handle file upload if provided
      if (videoFile) {
        // Validate file size (max 2GB)
        if (videoFile.size > 2 * 1024 * 1024 * 1024) {
          return new Response(
            JSON.stringify({ error: 'File size exceeds 2GB limit' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Validate file type
        const allowedTypes = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo']
        if (!allowedTypes.includes(videoFile.type)) {
          return new Response(
            JSON.stringify({ error: 'Invalid file type. Only MP4, AVI, and MOV files are allowed' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Upload to storage
        const fileName = `${user.id}/${game.id}/${videoFile.name}`
        const { error: uploadError } = await supabase.storage
          .from('match-videos')
          .upload(fileName, videoFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('Error uploading video:', uploadError)
          return new Response(
            JSON.stringify({ error: 'Failed to upload video file' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        videoPath = fileName
      }

      // Update game with video file path
      if (videoPath) {
        await supabase
          .from('games')
          .update({ video_file: videoPath })
          .eq('id', game.id)
      }

      // Create processing job
      const { error: jobError } = await supabase
        .from('processing_jobs')
        .insert({
          game_id: game.id,
          stage: 'uploading',
          progress: 0,
          user_id: user.id
        })

      if (jobError) {
        console.error('Error creating processing job:', jobError)
      }

      // Trigger video processing (background task)
      EdgeRuntime.waitUntil(
        triggerVideoProcessing(game.id, videoPath, videoUrl, user.id)
      )

      return new Response(
        JSON.stringify({ 
          gameId: game.id, 
          status: 'uploaded',
          message: 'Video uploaded successfully, processing started' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in video-upload function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function triggerVideoProcessing(gameId: string, videoPath: string | null, videoUrl: string | null, userId: string) {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Update processing status
    await supabase
      .from('processing_jobs')
      .update({ stage: 'processing', progress: 10 })
      .eq('game_id', gameId)

    // Call video processor function
    const { error } = await supabase.functions.invoke('video-processor', {
      body: { gameId, videoPath, videoUrl, userId }
    })

    if (error) {
      console.error('Error triggering video processor:', error)
      await supabase
        .from('processing_jobs')
        .update({ 
          stage: 'failed', 
          progress: 0, 
          error_message: 'Failed to start video processing' 
        })
        .eq('game_id', gameId)
    }

  } catch (error) {
    console.error('Error in triggerVideoProcessing:', error)
  }
}