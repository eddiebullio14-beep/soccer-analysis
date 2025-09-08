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

    const { gameId, videoPath, videoUrl, userId } = await req.json()

    console.log(`Starting video processing for game ${gameId}`)

    // Update processing status
    await updateProcessingStatus(supabase, gameId, 'processing', 20, 'Starting video analysis...')

    // Simulate video processing steps
    await processVideoSteps(supabase, gameId, videoPath, videoUrl, userId)

    return new Response(
      JSON.stringify({ success: true, gameId }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in video-processor function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function updateProcessingStatus(supabase: any, gameId: string, stage: string, progress: number, message?: string) {
  await supabase
    .from('processing_jobs')
    .update({ 
      stage, 
      progress,
      error_message: message 
    })
    .eq('game_id', gameId)
}

async function processVideoSteps(supabase: any, gameId: string, videoPath: string | null, videoUrl: string | null, userId: string) {
  try {
    // Step 1: Video Download/Preparation (if URL provided)
    await updateProcessingStatus(supabase, gameId, 'processing', 30, 'Preparing video...')
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing time

    // Step 2: Frame Extraction
    await updateProcessingStatus(supabase, gameId, 'analyzing', 40, 'Extracting frames...')
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Step 3: Player Detection (simulated)
    await updateProcessingStatus(supabase, gameId, 'analyzing', 50, 'Detecting players...')
    await simulatePlayerDetection(supabase, gameId, userId)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Step 4: Event Detection
    await updateProcessingStatus(supabase, gameId, 'analyzing', 65, 'Analyzing events...')
    await simulateEventDetection(supabase, gameId, userId)
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Step 5: Formation Analysis
    await updateProcessingStatus(supabase, gameId, 'analyzing', 80, 'Analyzing formations...')
    await simulateFormationAnalysis(supabase, gameId, userId)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Step 6: Statistics Calculation
    await updateProcessingStatus(supabase, gameId, 'analyzing', 90, 'Calculating statistics...')
    await simulateStatisticsCalculation(supabase, gameId, userId)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Step 7: Complete
    await updateProcessingStatus(supabase, gameId, 'complete', 100, 'Processing complete!')
    
    // Update game status
    await supabase
      .from('games')
      .update({ 
        status: 'completed',
        processed_at: new Date().toISOString(),
        duration: 5400 // 90 minutes in seconds
      })
      .eq('id', gameId)

    console.log(`Video processing completed for game ${gameId}`)

  } catch (error) {
    console.error('Error in video processing steps:', error)
    await updateProcessingStatus(supabase, gameId, 'failed', 0, `Processing failed: ${error.message}`)
    
    await supabase
      .from('games')
      .update({ status: 'failed' })
      .eq('id', gameId)
  }
}

async function simulatePlayerDetection(supabase: any, gameId: string, userId: string) {
  // Create sample players for both teams
  const players = [
    // Home team players
    { name: "John Doe", position: "GK", team: "home", jerseyNumber: 1 },
    { name: "Mike Smith", position: "CB", team: "home", jerseyNumber: 4 },
    { name: "David Johnson", position: "CB", team: "home", jerseyNumber: 5 },
    { name: "Alex Brown", position: "LB", team: "home", jerseyNumber: 3 },
    { name: "Chris Wilson", position: "RB", team: "home", jerseyNumber: 2 },
    { name: "Robert Taylor", position: "CM", team: "home", jerseyNumber: 6 },
    { name: "Kevin Davis", position: "CM", team: "home", jerseyNumber: 8 },
    { name: "Steven Miller", position: "LW", team: "home", jerseyNumber: 11 },
    { name: "Ryan Anderson", position: "RW", team: "home", jerseyNumber: 7 },
    { name: "Mark Garcia", position: "ST", team: "home", jerseyNumber: 9 },
    { name: "James Martinez", position: "ST", team: "home", jerseyNumber: 10 },
    
    // Away team players
    { name: "Carlos Lopez", position: "GK", team: "away", jerseyNumber: 1 },
    { name: "Luis Rodriguez", position: "CB", team: "away", jerseyNumber: 4 },
    { name: "Diego Hernandez", position: "CB", team: "away", jerseyNumber: 5 },
    { name: "Pablo Gonzalez", position: "LB", team: "away", jerseyNumber: 3 },
    { name: "Miguel Perez", position: "RB", team: "away", jerseyNumber: 2 },
    { name: "Fernando Sanchez", position: "CDM", team: "away", jerseyNumber: 6 },
    { name: "Manuel Ramirez", position: "CM", team: "away", jerseyNumber: 8 },
    { name: "Alejandro Torres", position: "LW", team: "away", jerseyNumber: 11 },
    { name: "Jorge Flores", position: "RW", team: "away", jerseyNumber: 7 },
    { name: "Antonio Morales", position: "ST", team: "away", jerseyNumber: 9 },
    { name: "Ricardo Jimenez", position: "CAM", team: "away", jerseyNumber: 10 }
  ]

  // Insert players
  for (const player of players) {
    await supabase
      .from('players')
      .insert({
        name: player.name,
        position: player.position,
        team: player.team,
        jersey_number: player.jerseyNumber,
        user_id: userId
      })
  }
}

async function simulateEventDetection(supabase: any, gameId: string, userId: string) {
  // Get players for this game
  const { data: players } = await supabase
    .from('players')
    .select('*')
    .eq('user_id', userId)

  if (!players || players.length === 0) return

  // Generate realistic soccer events
  const events = []
  const gameLength = 5400 // 90 minutes in seconds
  
  // Generate events throughout the game
  for (let i = 0; i < 200; i++) {
    const timestamp = Math.random() * gameLength
    const player = players[Math.floor(Math.random() * players.length)]
    const eventTypes = ['pass', 'shot', 'dribble', 'tackle']
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    
    let outcome = 'successful'
    let confidence = 0.7 + Math.random() * 0.3
    
    // Adjust success rates by event type
    if (eventType === 'shot') {
      outcome = Math.random() < 0.2 ? 'successful' : 'failed' // 20% shot success
    } else if (eventType === 'tackle') {
      outcome = Math.random() < 0.6 ? 'successful' : 'failed' // 60% tackle success
    } else if (eventType === 'pass') {
      outcome = Math.random() < 0.85 ? 'successful' : 'failed' // 85% pass success
    }

    events.push({
      game_id: gameId,
      timestamp_seconds: timestamp,
      type: eventType,
      player_id: player.id,
      player_name: player.name,
      team: player.team,
      start_position_x: Math.random(),
      start_position_y: Math.random(),
      end_position_x: Math.random(),
      end_position_y: Math.random(),
      outcome,
      confidence,
      auto_flag: confidence > 0.9 && outcome === 'successful' ? 'good' : 
                confidence < 0.5 || outcome === 'failed' ? 'bad' : null,
      user_id: userId
    })
  }

  // Insert events in batches
  const batchSize = 50
  for (let i = 0; i < events.length; i += batchSize) {
    const batch = events.slice(i, i + batchSize)
    await supabase.from('events').insert(batch)
  }
}

async function simulateFormationAnalysis(supabase: any, gameId: string, userId: string) {
  // Get players for this game
  const { data: players } = await supabase
    .from('players')
    .select('*')
    .eq('user_id', userId)

  if (!players || players.length === 0) return

  const homePlayers = players.filter(p => p.team === 'home').slice(0, 11)
  const awayPlayers = players.filter(p => p.team === 'away').slice(0, 11)

  // Generate formation snapshots every 30 seconds
  const formations = []
  const formationTypes = ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2']
  
  for (let timestamp = 0; timestamp < 5400; timestamp += 1800) { // Every 30 minutes
    // Home team formation
    const homeFormation = formationTypes[Math.floor(Math.random() * formationTypes.length)]
    const { data: homeFormationData } = await supabase
      .from('formations')
      .insert({
        game_id: gameId,
        timestamp_seconds: timestamp,
        formation: homeFormation,
        confidence: 0.8 + Math.random() * 0.2,
        user_id: userId
      })
      .select()
      .single()

    // Generate player positions for home team
    const homePositions = generateFormationPositions(homeFormation, homePlayers, 'home')
    for (const pos of homePositions) {
      await supabase
        .from('formation_players')
        .insert({
          formation_id: homeFormationData.id,
          player_id: pos.player_id,
          player_name: pos.player_name,
          position_x: pos.position_x,
          position_y: pos.position_y,
          role: pos.role
        })
    }

    // Away team formation
    const awayFormation = formationTypes[Math.floor(Math.random() * formationTypes.length)]
    const { data: awayFormationData } = await supabase
      .from('formations')
      .insert({
        game_id: gameId,
        timestamp_seconds: timestamp,
        formation: awayFormation,
        confidence: 0.8 + Math.random() * 0.2,
        user_id: userId
      })
      .select()
      .single()

    // Generate player positions for away team
    const awayPositions = generateFormationPositions(awayFormation, awayPlayers, 'away')
    for (const pos of awayPositions) {
      await supabase
        .from('formation_players')
        .insert({
          formation_id: awayFormationData.id,
          player_id: pos.player_id,
          player_name: pos.player_name,
          position_x: pos.position_x,
          position_y: pos.position_y,
          role: pos.role
        })
    }
  }
}

function generateFormationPositions(formation: string, players: any[], team: string) {
  const positions = []
  
  // Basic 4-3-3 formation positions (normalized 0-1)
  const formationPositions = {
    'GK': { x: team === 'home' ? 0.1 : 0.9, y: 0.5 },
    'CB': [
      { x: team === 'home' ? 0.25 : 0.75, y: 0.3 },
      { x: team === 'home' ? 0.25 : 0.75, y: 0.7 }
    ],
    'LB': { x: team === 'home' ? 0.25 : 0.75, y: 0.1 },
    'RB': { x: team === 'home' ? 0.25 : 0.75, y: 0.9 },
    'CM': [
      { x: team === 'home' ? 0.45 : 0.55, y: 0.3 },
      { x: team === 'home' ? 0.45 : 0.55, y: 0.5 },
      { x: team === 'home' ? 0.45 : 0.55, y: 0.7 }
    ],
    'LW': { x: team === 'home' ? 0.7 : 0.3, y: 0.2 },
    'RW': { x: team === 'home' ? 0.7 : 0.3, y: 0.8 },
    'ST': { x: team === 'home' ? 0.8 : 0.2, y: 0.5 }
  }

  let cbIndex = 0, cmIndex = 0

  for (const player of players) {
    let pos
    if (player.position === 'CB' && cbIndex < 2) {
      pos = formationPositions.CB[cbIndex++]
    } else if (player.position === 'CM' && cmIndex < 3) {
      pos = formationPositions.CM[cmIndex++]
    } else {
      pos = formationPositions[player.position as keyof typeof formationPositions]
    }

    if (pos) {
      positions.push({
        player_id: player.id,
        player_name: player.name,
        position_x: pos.x + (Math.random() - 0.5) * 0.1, // Add some variation
        position_y: pos.y + (Math.random() - 0.5) * 0.1,
        role: player.position
      })
    }
  }

  return positions
}

async function simulateStatisticsCalculation(supabase: any, gameId: string, userId: string) {
  // Get players and events for this game
  const { data: players } = await supabase
    .from('players')
    .select('*')
    .eq('user_id', userId)

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('game_id', gameId)

  if (!players || !events) return

  // Calculate player statistics
  for (const player of players) {
    const playerEvents = events.filter(e => e.player_id === player.id)
    
    const passes = playerEvents.filter(e => e.type === 'pass')
    const passesCompleted = passes.filter(e => e.outcome === 'successful').length
    const shots = playerEvents.filter(e => e.type === 'shot')
    const shotsOnTarget = shots.filter(e => e.outcome === 'successful').length
    const dribbles = playerEvents.filter(e => e.type === 'dribble')
    const dribblesSuccessful = dribbles.filter(e => e.outcome === 'successful').length
    const tackles = playerEvents.filter(e => e.type === 'tackle')

    await supabase
      .from('player_stats')
      .insert({
        player_id: player.id,
        player_name: player.name,
        game_id: gameId,
        minutes_played: 90,
        touches: playerEvents.length,
        passes: passes.length,
        passes_completed: passesCompleted,
        key_passes: Math.floor(Math.random() * 5),
        assists: Math.floor(Math.random() * 2),
        shots: shots.length,
        shots_on_target: shotsOnTarget,
        goals: Math.floor(Math.random() * 3),
        dribbles: dribbles.length,
        dribbles_successful: dribblesSuccessful,
        turnovers: Math.floor(Math.random() * 5),
        recoveries: tackles.length,
        fouls: Math.floor(Math.random() * 3),
        cards: Math.floor(Math.random() * 2),
        xg: Math.random() * 2,
        user_id: userId
      })
  }

  // Calculate team statistics
  const homeEvents = events.filter(e => e.team === 'home')
  const awayEvents = events.filter(e => e.team === 'away')

  for (const [team, teamEvents] of [['home', homeEvents], ['away', awayEvents]]) {
    const passes = teamEvents.filter(e => e.type === 'pass')
    const passesCompleted = passes.filter(e => e.outcome === 'successful').length
    const shots = teamEvents.filter(e => e.type === 'shot')
    const shotsOnTarget = shots.filter(e => e.outcome === 'successful').length

    await supabase
      .from('team_stats')
      .insert({
        game_id: gameId,
        team,
        possession: team === 'home' ? 55 + Math.random() * 20 : 45 + Math.random() * 20,
        passes: passes.length,
        pass_accuracy: passes.length > 0 ? (passesCompleted / passes.length) * 100 : 0,
        shots: shots.length,
        shots_on_target: shotsOnTarget,
        corners: Math.floor(Math.random() * 8) + 2,
        fouls: Math.floor(Math.random() * 15) + 5,
        yellow_cards: Math.floor(Math.random() * 3),
        red_cards: Math.floor(Math.random() * 1),
        formation: '4-3-3',
        user_id: userId
      })
  }
}