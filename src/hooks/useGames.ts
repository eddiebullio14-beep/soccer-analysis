import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Game } from '@/types';

export function useGames() {
  return useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(game => ({
        id: game.id,
        date: game.date,
        homeTeam: game.home_team,
        awayTeam: game.away_team,
        videoFile: game.video_file || '',
        duration: game.duration || 0,
        status: game.status as Game['status'],
        processedAt: game.processed_at,
        thumbnail: game.thumbnail
      })) as Game[];
    }
  });
}

export function useGame(gameId: string) {
  return useQuery({
    queryKey: ['games', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        date: data.date,
        homeTeam: data.home_team,
        awayTeam: data.away_team,
        videoFile: data.video_file || '',
        duration: data.duration || 0,
        status: data.status as Game['status'],
        processedAt: data.processed_at,
        thumbnail: data.thumbnail
      } as Game;
    },
    enabled: !!gameId
  });
}

export function useUploadVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      videoFile, 
      videoUrl, 
      gameInfo 
    }: { 
      videoFile?: File; 
      videoUrl?: string; 
      gameInfo: { homeTeam: string; awayTeam: string; date: string } 
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const formData = new FormData();
      if (videoFile) {
        formData.append('video', videoFile);
      }
      if (videoUrl) {
        formData.append('videoUrl', videoUrl);
      }
      formData.append('gameInfo', JSON.stringify(gameInfo));

      const response = await supabase.functions.invoke('video-upload', {
        body: formData
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    }
  });
}

export function useProcessingStatus(gameId: string) {
  return useQuery({
    queryKey: ['processing-status', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('processing_jobs')
        .select('*')
        .eq('game_id', gameId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!gameId,
    refetchInterval: (query) => {
      // Stop polling when processing is complete or failed
      const data = query.state.data;
      if (data?.stage === 'complete' || data?.stage === 'failed') {
        return false;
      }
      return 2000; // Poll every 2 seconds during processing
    }
  });
}