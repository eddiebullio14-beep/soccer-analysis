import { useState } from "react";
import { Upload, Video, Target, BarChart3, Clock, Trophy, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Game } from "@/types";

// Mock data for demonstration
const recentGames: Game[] = [
  {
    id: "1",
    date: "2024-01-15",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    videoFile: "arsenal-vs-chelsea.mp4",
    duration: 5400, // 90 minutes
    status: "completed",
    processedAt: "2024-01-15T16:30:00Z",
    thumbnail: "/api/placeholder/320/180"
  },
  {
    id: "2", 
    date: "2024-01-12",
    homeTeam: "Liverpool",
    awayTeam: "Manchester City",
    videoFile: "liverpool-vs-city.mp4",
    duration: 5580,
    status: "processing",
    thumbnail: "/api/placeholder/320/180"
  },
  {
    id: "3",
    date: "2024-01-10", 
    homeTeam: "Tottenham",
    awayTeam: "Newcastle",
    videoFile: "spurs-vs-newcastle.mp4",
    duration: 5220,
    status: "completed",
    processedAt: "2024-01-10T21:45:00Z",
    thumbnail: "/api/placeholder/320/180"
  }
];

const stats = {
  totalGames: 24,
  totalEvents: 1847,
  avgAccuracy: 94.2,
  processingTime: "2.3 min"
};

export function Dashboard() {
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
            <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
              <Upload className="h-5 w-5 mr-2" />
              Upload New Video
            </Button>
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
              <div className="text-3xl font-bold text-foreground">{stats.totalGames}</div>
              <p className="text-sm text-success">+3 this week</p>
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
              <div className="text-3xl font-bold text-foreground">{stats.totalEvents.toLocaleString()}</div>
              <p className="text-sm text-success">+127 today</p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                AI Accuracy
              </CardTitle>
              <BarChart3 className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.avgAccuracy}%</div>
              <p className="text-sm text-success">+1.2% this month</p>
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
              <div className="text-3xl font-bold text-foreground">{stats.processingTime}</div>
              <p className="text-sm text-success">-0.3 min faster</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentGames.map((game) => (
                <Card key={game.id} className="shadow-sm border-border/30 hover:shadow-tactical transition-all duration-300 cursor-pointer group">
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
                        <Badge variant={game.status === 'completed' ? 'default' : game.status === 'processing' ? 'secondary' : 'destructive'}>
                          {game.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {new Date(game.date).toLocaleDateString()}
                      </div>
                      
                      {game.status === 'processing' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Processing...</span>
                            <span className="text-accent">67%</span>
                          </div>
                          <Progress value={67} className="h-2" />
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
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card border-border/50 hover:shadow-tactical transition-all duration-300 cursor-pointer group">
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

          <Card className="shadow-card border-border/50 hover:shadow-tactical transition-all duration-300 cursor-pointer group">
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
                  <h3 className="font-semibold text-foreground">Performance</h3>
                  <p className="text-sm text-muted-foreground">Track player statistics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}