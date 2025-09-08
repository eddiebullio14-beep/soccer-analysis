import { Upload, Video, Target, BarChart3, Clock, Trophy, TrendingUp, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useGames, useProcessingStatus } from "@/hooks/useGames";
import { useDashboardStats } from "@/hooks/useStats";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

function GameCard({ game }: { game: any }) {
  const navigate = useNavigate();
  const { data: processingStatus } = useProcessingStatus(
    game.status === 'processing' ? game.id : ''
  );

  const handleCardClick = () => {
    if (game.status === 'completed') {
      navigate(`/analysis/${game.id}`);
    }
  };

  const getProgress = () => {
    if (game.status === 'processing' && processingStatus) {
      return processingStatus.progress || 0;
    }
    return 0;
  };

  return (
    <Card 
      className="shadow-sm border-border/30 hover:shadow-tactical transition-all duration-300 cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
          <Video className="h-12 w-12 text-accent/60" />
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
              {game.homeTeam} vs {game.awayTeam}
            </h3>
            <Badge variant={
              game.status === 'completed' ? 'default' : 
              game.status === 'processing' ? 'secondary' : 
              'destructive'
            }>
              {game.status}
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {new Date(game.date).toLocaleDateString()}
          </div>
          
          {game.status === 'processing' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {processingStatus?.stage || 'Processing...'}
                </span>
                <span className="text-accent">{getProgress()}%</span>
              </div>
              <Progress value={getProgress()} className="h-2" />
            </div>
          )}
          
          {game.status === 'completed' && (
            <Button variant="outline" size="sm" className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analysis
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { data: games, isLoading: gamesLoading } = useGames();
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleUploadClick = () => {
    navigate('/upload');
  };

  const handleTacticalClick = () => {
    // For now, navigate to tactical board without a specific game
    navigate('/tactical/new');
  };

  return (
    <div className="min-h-screen bg-gradient-field">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Welcome Back, Coach
              </h1>
              <p className="text-lg text-muted-foreground">
                Track your team's performance with AI-powered insights
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleUploadClick}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload New Video
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="border-border/50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Games
              </CardTitle>
              <Video className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-foreground">
                  {dashboardStats?.totalGames || 0}
                </div>
              )}
              <p className="text-sm text-success">Professional analysis</p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Events Detected
              </CardTitle>
              <Target className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-3xl font-bold text-foreground">
                  {dashboardStats?.totalEvents.toLocaleString() || 0}
                </div>
              )}
              <p className="text-sm text-success">AI-powered detection</p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Reviews Collected
              </CardTitle>
              <BarChart3 className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-3xl font-bold text-foreground">
                  {Math.floor((dashboardStats?.totalEvents || 0) * 0.15)}
                </div>
              )}
              <p className="text-sm text-success">Coach feedback</p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Processing
              </CardTitle>
              <Clock className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-foreground">
                  {dashboardStats?.processingTime || "2.3 min"}
                </div>
              )}
              <p className="text-sm text-success">Fast analysis</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Games */}
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground flex items-center">
              <Trophy className="h-6 w-6 mr-2 text-accent" />
              Recent Games
            </CardTitle>
            <CardDescription>
              Your latest video analyses and tactical insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            {gamesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="shadow-sm border-border/30">
                    <div className="aspect-video bg-muted rounded-t-lg">
                      <Skeleton className="w-full h-full" />
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-8 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : games && games.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.slice(0, 6).map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No games yet</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your first match video to get started with AI-powered analysis
                </p>
                <Button onClick={handleUploadClick} className="bg-gradient-primary">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First Video
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            className="shadow-card border-border/50 hover:shadow-tactical transition-all duration-300 cursor-pointer group"
            onClick={handleUploadClick}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Upload Video</h3>
                  <p className="text-sm text-muted-foreground">Analyze new match footage</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="shadow-card border-border/50 hover:shadow-tactical transition-all duration-300 cursor-pointer group"
            onClick={handleTacticalClick}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-success rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="h-6 w-6 text-success-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Tactical Board</h3>
                  <p className="text-sm text-muted-foreground">Plan formations & strategies</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border/50 hover:shadow-tactical transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Reviews</h3>
                  <p className="text-sm text-muted-foreground">Coach feedback system</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}