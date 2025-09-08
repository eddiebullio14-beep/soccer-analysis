import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Event } from '@/types';

export function useEvents(gameId: string) {
  return useQuery({
    queryKey: ['events', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('game_id', gameId)
        .order('timestamp_seconds', { ascending: true });

      if (error) throw error;
      
      return data.map(event => ({
        id: event.id,
        gameId: event.game_id,
        timestamp: event.timestamp_seconds,
        type: event.type as Event['type'],
        playerId: event.player_id || '',
        playerName: event.player_name || '',
        team: event.team,
        startPosition: [event.start_position_x || 0, event.start_position_y || 0] as [number, number],
        endPosition: event.end_position_x && event.end_position_y 
          ? [event.end_position_x, event.end_position_y] as [number, number] 
          : undefined,
        outcome: event.outcome as Event['outcome'],
        confidence: event.confidence || 0,
        clipPath: event.clip_path,
        autoFlag: event.auto_flag as Event['autoFlag'],
        coachNote: event.coach_note
      })) as Event[];
    },
    enabled: !!gameId
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      eventId, 
      updates 
    }: { 
      eventId: string; 
      updates: Partial<Pick<Event, 'autoFlag' | 'coachNote'>> 
    }) => {
      const { error } = await supabase
        .from('events')
        .update({
          auto_flag: updates.autoFlag,
          coach_note: updates.coachNote
        })
        .eq('id', eventId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });
}