import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Settings, Eye, Target, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Event, Formation } from "@/types";

// Mock data for demonstration
const mockEvents: Event[] = [
  {
    id: "1",
    gameId: "game1",
    timestamp: 245,
    type: "pass",
    playerId: "p1",
    playerName: "Kevin De Bruyne",
    team: "Manchester City",
    startPosition: [0.3, 0.5],
    endPosition: [0.7, 0.3],
    outcome: "successful",
    confidence: 0.95,
    autoFlag: "good"
  },
  {
    id: "2",
    gameId: "game1", 
    timestamp: 267,
    type: "shot",
    playerId: "p2",
    playerName: "Erling Haaland",
    team: "Manchester City",
    startPosition: [0.8, 0.4],
    outcome: "successful",
    confidence: 0.88,
    autoFlag: "good"
  },
  {
    id: "3",
    gameId: "game1",
    timestamp: 312,
    type: "tackle",
    playerId: "p3", 
    playerName: "Declan Rice",
    team: "Arsenal",
    startPosition: [0.4, 0.6],
    outcome: "successful",
    confidence: 0.92,
    autoFlag: "good"
  },
  {
    id: "4",
    gameId: "game1",
    timestamp: 445,
    type: "pass",
    playerId: "p4",
    playerName: "Martin Ødegaard",
    team: "Arsenal", 
    startPosition: [0.6, 0.4],
    endPosition: [0.2, 0.6],
    outcome: "failed",
    confidence: 0.78,
    autoFlag: "bad"
  }
];

const mockFormation: Formation = {
  id: "f1",
  gameId: "game1",
  timestamp: 300,
  formation: "4-3-3",
  players: [
    { playerId: "p1", playerName: "Ederson", position: [0.1, 0.5], role: "GK" },
    { playerId: "p2", playerName: "Walker", position: [0.2, 0.2], role: "RB" },
    { playerId: "p3", playerName: "Stones", position: [0.2, 0.4], role: "CB" },
    { playerId: "p4", playerName: "Dias", position: [0.2, 0.6], role: "CB" },
    { playerId: "p5", playerName: "Cancelo", position: [0.2, 0.8], role: "LB" },
    { playerId: "p6", playerName: "Rodri", position: [0.4, 0.5], role: "CDM" },
    { playerId: "p7", playerName: "De Bruyne", position: [0.5, 0.3], role: "CM" },
    { playerId: "p8", playerName: "Silva", position: [0.5, 0.7], role: "CM" },
    { playerId: "p9", playerName: "Mahrez", position: [0.7, 0.2], role: "RW" },
    { playerId: "p10", playerName: "Haaland", position: [0.8, 0.5], role: "ST" },
    { playerId: "p11", playerName: "Foden", position: [0.7, 0.8], role: "LW" }
  ],
  confidence: 0.91
};

export function VideoAnalysis() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(245); // Start at first event
  const [duration] = useState(5400); // 90 minutes
  const [volume, setVolume] = useState(75);
  const [showOverlays, setShowOverlays] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw tactical overlays
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !showOverlays) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw soccer pitch
    ctx.strokeStyle = 'hsl(var(--primary))';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);

    // Pitch outline
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
    
    // Center line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 50);
    ctx.lineTo(canvas.width / 2, canvas.height - 50);
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw players
    mockFormation.players.forEach((player, index) => {
      const x = 50 + player.position[0] * (canvas.width - 100);
      const y = 50 + player.position[1] * (canvas.height - 100);

      // Player circle
      ctx.fillStyle = index < 11 ? 'hsl(var(--team-home))' : 'hsl(var(--team-away))';
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, 2 * Math.PI);
      ctx.fill();

      // Player number
      ctx.fillStyle = 'white';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText((index + 1).toString(), x, y + 4);
    });

    // Draw events near current time
    const nearbyEvents = mockEvents.filter(
      event => Math.abs(event.timestamp - currentTime) < 30
    );

    nearbyEvents.forEach(event => {
      const x = 50 + event.startPosition[0] * (canvas.width - 100);
      const y = 50 + event.startPosition[1] * (canvas.height - 100);

      // Event marker
      ctx.fillStyle = event.autoFlag === 'good' ? 'hsl(var(--success))' : 'hsl(var(--destructive))';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Draw pass trajectory
      if (event.endPosition) {
        const endX = 50 + event.endPosition[0] * (canvas.width - 100);
        const endY = 50 + event.endPosition[1] * (canvas.height - 100);

        ctx.strokeStyle = event.outcome === 'successful' ? 'hsl(var(--success))' : 'hsl(var(--destructive))';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  }, [currentTime, showOverlays]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'pass': return '⚽';
      case 'shot': return '🎯';
      case 'tackle': return '🛡️';
      case 'dribble': return '⚡';
      case 'foul': return '⚠️';
      default: return '📍';
    }
  };

  const jumpToEvent = (event: Event) => {
    setCurrentTime(event.timestamp);
    setSelectedEvent(event);
  };

  return (
    <div className="min-h-screen bg-gradient-field">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">
                Video Analysis
              </h1>
              <p className="text-lg text-muted-foreground">
                Manchester City vs Arsenal • Premier League
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowOverlays(!showOverlays)}
                className={showOverlays ? "bg-accent text-accent-foreground" : ""}
              >
                <Eye className="h-4 w-4 mr-2" />
                Overlays
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-tactical border-border/50">
              <CardContent className="p-0">
                {/* Video Display */}
                <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={450}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* Play/Pause Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="bg-black/50 hover:bg-black/70 text-white border-none h-16 w-16 rounded-full"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="h-8 w-8" />
                      ) : (
                        <Play className="h-8 w-8 ml-1" />
                      )}
                    </Button>
                  </div>

                  {/* Time Display */}
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                {/* Video Controls */}
                <div className="p-4 space-y-4">
                  {/* Timeline */}
                  <div className="space-y-2">
                    <Slider
                      value={[currentTime]}
                      onValueChange={(value) => setCurrentTime(value[0])}
                      max={duration}
                      step={1}
                      className="w-full"
                    />
                    
                    {/* Event markers on timeline */}
                    <div className="relative h-2">
                      {mockEvents.map(event => (
                        <div
                          key={event.id}
                          className={`absolute w-2 h-2 rounded-full cursor-pointer ${
                            event.autoFlag === 'good' ? 'bg-success' : 'bg-destructive'
                          }`}
                          style={{ left: `${(event.timestamp / duration) * 100}%` }}
                          onClick={() => jumpToEvent(event)}
                          title={`${event.type} - ${event.playerName}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="bg-gradient-primary"
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                      <Slider
                        value={[volume]}
                        onValueChange={(value) => setVolume(value[0])}
                        max={100}
                        step={1}
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Panel */}
          <div className="space-y-4">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Target className="h-5 w-5 mr-2 text-accent" />
                  Live Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="events" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="events" className="space-y-3">
                    <ScrollArea className="h-64">
                      {mockEvents.map(event => (
                        <div
                          key={event.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                            selectedEvent?.id === event.id 
                              ? 'border-accent bg-accent/10' 
                              : 'border-border/50 hover:border-accent/50'
                          }`}
                          onClick={() => jumpToEvent(event)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{getEventIcon(event.type)}</span>
                              <Badge variant={event.autoFlag === 'good' ? 'default' : 'destructive'}>
                                {event.type}
                              </Badge>
                            </div>
                            <span className="text-sm text-muted-foreground font-mono">
                              {formatTime(event.timestamp)}
                            </span>
                          </div>
                          <div className="text-sm">
                            <div className="font-medium text-foreground">{event.playerName}</div>
                            <div className="text-muted-foreground">{event.team}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {(event.confidence * 100).toFixed(0)}% confidence
                              </Badge>
                              <Badge variant={event.outcome === 'successful' ? 'default' : 'secondary'} className="text-xs">
                                {event.outcome}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="stats" className="space-y-3">
                    <div className="space-y-3">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Formation</div>
                        <div className="text-lg font-semibold text-foreground">{mockFormation.formation}</div>
                        <div className="text-xs text-muted-foreground">{(mockFormation.confidence * 100).toFixed(0)}% confidence</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                          <div className="text-2xl font-bold text-foreground">73%</div>
                          <div className="text-xs text-muted-foreground">Possession</div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                          <div className="text-2xl font-bold text-foreground">94%</div>
                          <div className="text-xs text-muted-foreground">Pass Accuracy</div>
                        </div>
                      </div>

                      <div className="p-3 bg-gradient-success/10 rounded-lg border border-success/20">
                        <div className="text-sm font-medium text-success">AI Insight</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Strong passing network through midfield. Consider exploiting left flank weakness.
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}