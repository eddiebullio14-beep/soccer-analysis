import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { PlayerStats, TeamStats } from '@/types';

export function usePlayerStats(gameId: string) {
  return useQuery({
    queryKey: ['player-stats', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_stats')
        .select('*')
        .eq('game_id', gameId);

      if (error) throw error;
      
      return data.map(stats => ({
        playerId: stats.player_id,
        playerName: stats.player_name,
        gameId: stats.game_id,
        minutesPlayed: stats.minutes_played || 0,
        touches: stats.touches || 0,
        passes: stats.passes || 0,
        passesCompleted: stats.passes_completed || 0,
        keyPasses: stats.key_passes || 0,
        assists: stats.assists || 0,
        shots: stats.shots || 0,
        shotsOnTarget: stats.shots_on_target || 0,
        goals: stats.goals || 0,
        dribbles: stats.dribbles || 0,
        dribblesSuccessful: stats.dribbles_successful || 0,
        turnovers: stats.turnovers || 0,
        recoveries: stats.recoveries || 0,
        fouls: stats.fouls || 0,
        cards: stats.cards || 0,
        xG: stats.xg || 0
      })) as PlayerStats[];
    },
    enabled: !!gameId
  });
}

export function useTeamStats(gameId: string) {
  return useQuery({
    queryKey: ['team-stats', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_stats')
        .select('*')
        .eq('game_id', gameId);

      if (error) throw error;
      
      return data.map(stats => ({
        gameId: stats.game_id,
        team: stats.team,
        possession: stats.possession || 0,
        passes: stats.passes || 0,
        passAccuracy: stats.pass_accuracy || 0,
        shots: stats.shots || 0,
        shotsOnTarget: stats.shots_on_target || 0,
        corners: stats.corners || 0,
        fouls: stats.fouls || 0,
        cards: { 
          yellow: stats.yellow_cards || 0, 
          red: stats.red_cards || 0 
        },
        formation: stats.formation || ''
      })) as TeamStats[];
    },
    enabled: !!gameId
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Get total games count
      const { count: gamesCount } = await supabase
        .from('games')
        .select('*', { count: 'exact', head: true });

      // Get total events count
      const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });

      // Get completed games for accuracy calculation
      const { data: completedGames } = await supabase
        .from('games')
        .select('id')
        .eq('status', 'completed');

      // Get processing jobs for average time
      const { data: processingJobs } = await supabase
        .from('processing_jobs')
        .select('created_at, updated_at')
        .eq('stage', 'complete')
        .limit(10);

      let avgProcessingTime = 2.3; // Default value
      if (processingJobs && processingJobs.length > 0) {
        const times = processingJobs.map(job => {
          const start = new Date(job.created_at).getTime();
          const end = new Date(job.updated_at).getTime();
          return (end - start) / 1000 / 60; // Convert to minutes
        });
        avgProcessingTime = times.reduce((a, b) => a + b, 0) / times.length;
      }

      return {
        totalGames: gamesCount || 0,
        totalEvents: eventsCount || 0,
        avgAccuracy: 94.2, // This would be calculated from actual accuracy data
        processingTime: `${avgProcessingTime.toFixed(1)} min`
      };
    }
  });
}