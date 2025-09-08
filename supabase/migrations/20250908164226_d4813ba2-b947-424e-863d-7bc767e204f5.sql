-- Create enum types for better data integrity
CREATE TYPE public.game_status AS ENUM ('uploaded', 'processing', 'completed', 'failed');
CREATE TYPE public.player_position AS ENUM ('GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST');
CREATE TYPE public.event_type AS ENUM ('pass', 'shot', 'dribble', 'tackle', 'foul', 'goal', 'card');
CREATE TYPE public.event_outcome AS ENUM ('successful', 'failed');
CREATE TYPE public.auto_flag AS ENUM ('good', 'bad');
CREATE TYPE public.processing_stage AS ENUM ('uploading', 'processing', 'analyzing', 'complete', 'failed');

-- Games table
CREATE TABLE public.games (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    date DATE NOT NULL,
    home_team TEXT NOT NULL,
    away_team TEXT NOT NULL,
    video_file TEXT,
    video_url TEXT,
    duration INTEGER DEFAULT 0,
    status game_status NOT NULL DEFAULT 'uploaded',
    processed_at TIMESTAMP WITH TIME ZONE,
    thumbnail TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Players table
CREATE TABLE public.players (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    position player_position NOT NULL,
    team TEXT NOT NULL,
    jersey_number INTEGER NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    UNIQUE(team, jersey_number, user_id)
);

-- Events table
CREATE TABLE public.events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
    timestamp_seconds NUMERIC NOT NULL,
    type event_type NOT NULL,
    player_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
    player_name TEXT,
    team TEXT NOT NULL,
    start_position_x NUMERIC CHECK (start_position_x >= 0 AND start_position_x <= 1),
    start_position_y NUMERIC CHECK (start_position_y >= 0 AND start_position_y <= 1),
    end_position_x NUMERIC CHECK (end_position_x >= 0 AND end_position_x <= 1),
    end_position_y NUMERIC CHECK (end_position_y >= 0 AND end_position_y <= 1),
    outcome event_outcome NOT NULL,
    confidence NUMERIC CHECK (confidence >= 0 AND confidence <= 1) DEFAULT 0,
    clip_path TEXT,
    auto_flag auto_flag,
    coach_note TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Formations table
CREATE TABLE public.formations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
    timestamp_seconds NUMERIC NOT NULL,
    formation TEXT NOT NULL, -- e.g., "4-3-3", "4-4-2"
    confidence NUMERIC CHECK (confidence >= 0 AND confidence <= 1) DEFAULT 0,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Formation players junction table
CREATE TABLE public.formation_players (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    formation_id UUID REFERENCES public.formations(id) ON DELETE CASCADE NOT NULL,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    player_name TEXT NOT NULL,
    position_x NUMERIC CHECK (position_x >= 0 AND position_x <= 1) NOT NULL,
    position_y NUMERIC CHECK (position_y >= 0 AND position_y <= 1) NOT NULL,
    role TEXT NOT NULL
);

-- Player stats table
CREATE TABLE public.player_stats (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
    player_name TEXT NOT NULL,
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
    minutes_played NUMERIC DEFAULT 0,
    touches INTEGER DEFAULT 0,
    passes INTEGER DEFAULT 0,
    passes_completed INTEGER DEFAULT 0,
    key_passes INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    shots INTEGER DEFAULT 0,
    shots_on_target INTEGER DEFAULT 0,
    goals INTEGER DEFAULT 0,
    dribbles INTEGER DEFAULT 0,
    dribbles_successful INTEGER DEFAULT 0,
    turnovers INTEGER DEFAULT 0,
    recoveries INTEGER DEFAULT 0,
    fouls INTEGER DEFAULT 0,
    cards INTEGER DEFAULT 0,
    xg NUMERIC DEFAULT 0, -- Expected Goals
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Team stats table
CREATE TABLE public.team_stats (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
    team TEXT NOT NULL,
    possession NUMERIC DEFAULT 0,
    passes INTEGER DEFAULT 0,
    pass_accuracy NUMERIC DEFAULT 0,
    shots INTEGER DEFAULT 0,
    shots_on_target INTEGER DEFAULT 0,
    corners INTEGER DEFAULT 0,
    fouls INTEGER DEFAULT 0,
    yellow_cards INTEGER DEFAULT 0,
    red_cards INTEGER DEFAULT 0,
    formation TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Reviews table for coach feedback
CREATE TABLE public.reviews (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    coach_recommendation TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Processing jobs table
CREATE TABLE public.processing_jobs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
    stage processing_stage NOT NULL DEFAULT 'uploading',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    error_message TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formation_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for games
CREATE POLICY "Users can view their own games" ON public.games
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own games" ON public.games
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own games" ON public.games
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own games" ON public.games
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for players
CREATE POLICY "Users can view their own players" ON public.players
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own players" ON public.players
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own players" ON public.players
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own players" ON public.players
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for events
CREATE POLICY "Users can view their own events" ON public.events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own events" ON public.events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events" ON public.events
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events" ON public.events
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for formations
CREATE POLICY "Users can view their own formations" ON public.formations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own formations" ON public.formations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own formations" ON public.formations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own formations" ON public.formations
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for formation_players (inherit from formation)
CREATE POLICY "Users can view formation players" ON public.formation_players
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.formations 
            WHERE formations.id = formation_players.formation_id 
            AND formations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create formation players" ON public.formation_players
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.formations 
            WHERE formations.id = formation_players.formation_id 
            AND formations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update formation players" ON public.formation_players
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.formations 
            WHERE formations.id = formation_players.formation_id 
            AND formations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete formation players" ON public.formation_players
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.formations 
            WHERE formations.id = formation_players.formation_id 
            AND formations.user_id = auth.uid()
        )
    );

-- RLS Policies for player_stats
CREATE POLICY "Users can view their own player stats" ON public.player_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own player stats" ON public.player_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own player stats" ON public.player_stats
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own player stats" ON public.player_stats
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for team_stats
CREATE POLICY "Users can view their own team stats" ON public.team_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own team stats" ON public.team_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own team stats" ON public.team_stats
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own team stats" ON public.team_stats
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for reviews
CREATE POLICY "Users can view their own reviews" ON public.reviews
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for processing_jobs
CREATE POLICY "Users can view their own processing jobs" ON public.processing_jobs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own processing jobs" ON public.processing_jobs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own processing jobs" ON public.processing_jobs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own processing jobs" ON public.processing_jobs
    FOR DELETE USING (auth.uid() = user_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('match-videos', 'match-videos', false),
('processed-videos', 'processed-videos', false),
('thumbnails', 'thumbnails', true);

-- Storage policies for match-videos bucket
CREATE POLICY "Users can upload their own match videos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'match-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own match videos" ON storage.objects
    FOR SELECT USING (bucket_id = 'match-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own match videos" ON storage.objects
    FOR UPDATE USING (bucket_id = 'match-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own match videos" ON storage.objects
    FOR DELETE USING (bucket_id = 'match-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for processed-videos bucket
CREATE POLICY "Users can upload their own processed videos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'processed-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own processed videos" ON storage.objects
    FOR SELECT USING (bucket_id = 'processed-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own processed videos" ON storage.objects
    FOR UPDATE USING (bucket_id = 'processed-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own processed videos" ON storage.objects
    FOR DELETE USING (bucket_id = 'processed-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for thumbnails bucket (public)
CREATE POLICY "Anyone can view thumbnails" ON storage.objects
    FOR SELECT USING (bucket_id = 'thumbnails');

CREATE POLICY "Users can upload their own thumbnails" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own thumbnails" ON storage.objects
    FOR UPDATE USING (bucket_id = 'thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own thumbnails" ON storage.objects
    FOR DELETE USING (bucket_id = 'thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_games_updated_at
    BEFORE UPDATE ON public.games
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_processing_jobs_updated_at
    BEFORE UPDATE ON public.processing_jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_games_user_id ON public.games(user_id);
CREATE INDEX idx_games_status ON public.games(status);
CREATE INDEX idx_events_game_id ON public.events(game_id);
CREATE INDEX idx_events_timestamp ON public.events(timestamp_seconds);
CREATE INDEX idx_formations_game_id ON public.formations(game_id);
CREATE INDEX idx_formations_timestamp ON public.formations(timestamp_seconds);
CREATE INDEX idx_player_stats_game_id ON public.player_stats(game_id);
CREATE INDEX idx_processing_jobs_game_id ON public.processing_jobs(game_id);
CREATE INDEX idx_processing_jobs_stage ON public.processing_jobs(stage);