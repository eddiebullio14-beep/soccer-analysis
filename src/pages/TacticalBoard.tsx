import { useState, useRef, useEffect } from "react";
import { Save, Download, Upload, RotateCcw, Palette, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PlayerPosition {
  id: string;
  name: string;
  position: [number, number];
  role: string;
  team: 'home' | 'away';
}

interface Formation {
  name: string;
  players: PlayerPosition[];
}

const formations: Record<string, PlayerPosition[]> = {
  "4-3-3": [
    // Home team (blue)
    { id: "h1", name: "GK", position: [0.1, 0.5], role: "Goalkeeper", team: "home" },
    { id: "h2", name: "RB", position: [0.25, 0.15], role: "Right Back", team: "home" },
    { id: "h3", name: "CB", position: [0.25, 0.35], role: "Center Back", team: "home" },
    { id: "h4", name: "CB", position: [0.25, 0.65], role: "Center Back", team: "home" },
    { id: "h5", name: "LB", position: [0.25, 0.85], role: "Left Back", team: "home" },
    { id: "h6", name: "CDM", position: [0.4, 0.5], role: "Defensive Midfielder", team: "home" },
    { id: "h7", name: "CM", position: [0.55, 0.3], role: "Central Midfielder", team: "home" },
    { id: "h8", name: "CM", position: [0.55, 0.7], role: "Central Midfielder", team: "home" },
    { id: "h9", name: "RW", position: [0.75, 0.2], role: "Right Winger", team: "home" },
    { id: "h10", name: "ST", position: [0.8, 0.5], role: "Striker", team: "home" },
    { id: "h11", name: "LW", position: [0.75, 0.8], role: "Left Winger", team: "home" },
    
    // Away team (red)
    { id: "a1", name: "GK", position: [0.9, 0.5], role: "Goalkeeper", team: "away" },
    { id: "a2", name: "LB", position: [0.75, 0.15], role: "Left Back", team: "away" },
    { id: "a3", name: "CB", position: [0.75, 0.35], role: "Center Back", team: "away" },
    { id: "a4", name: "CB", position: [0.75, 0.65], role: "Center Back", team: "away" },
    { id: "a5", name: "RB", position: [0.75, 0.85], role: "Right Back", team: "away" },
    { id: "a6", name: "CDM", position: [0.6, 0.5], role: "Defensive Midfielder", team: "away" },
    { id: "a7", name: "CM", position: [0.45, 0.3], role: "Central Midfielder", team: "away" },
    { id: "a8", name: "CM", position: [0.45, 0.7], role: "Central Midfielder", team: "away" },
    { id: "a9", name: "LW", position: [0.25, 0.2], role: "Left Winger", team: "away" },
    { id: "a10", name: "ST", position: [0.2, 0.5], role: "Striker", team: "away" },
    { id: "a11", name: "RW", position: [0.25, 0.8], role: "Right Winger", team: "away" },
  ] as PlayerPosition[],
  "4-4-2": [
    // Home team
    { id: "h1", name: "GK", position: [0.1, 0.5], role: "Goalkeeper", team: "home" },
    { id: "h2", name: "RB", position: [0.25, 0.15], role: "Right Back", team: "home" },
    { id: "h3", name: "CB", position: [0.25, 0.35], role: "Center Back", team: "home" },
    { id: "h4", name: "CB", position: [0.25, 0.65], role: "Center Back", team: "home" },
    { id: "h5", name: "LB", position: [0.25, 0.85], role: "Left Back", team: "home" },
    { id: "h6", name: "RM", position: [0.5, 0.2], role: "Right Midfielder", team: "home" },
    { id: "h7", name: "CM", position: [0.5, 0.4], role: "Central Midfielder", team: "home" },
    { id: "h8", name: "CM", position: [0.5, 0.6], role: "Central Midfielder", team: "home" },
    { id: "h9", name: "LM", position: [0.5, 0.8], role: "Left Midfielder", team: "home" },
    { id: "h10", name: "ST", position: [0.75, 0.4], role: "Striker", team: "home" },
    { id: "h11", name: "ST", position: [0.75, 0.6], role: "Striker", team: "home" },
  ] as PlayerPosition[]
};

export function TacticalBoard() {
  const [selectedFormation, setSelectedFormation] = useState<keyof typeof formations>("4-3-3");
  const [players, setPlayers] = useState<PlayerPosition[]>(formations["4-3-3"]);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerPosition | null>(null);
  const [draggedPlayer, setDraggedPlayer] = useState<PlayerPosition | null>(null);
  const [tacticalNotes, setTacticalNotes] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw soccer pitch
    ctx.fillStyle = 'hsl(var(--pitch))';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pitch markings
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);

    // Outer boundary
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    
    // Center line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 40);
    ctx.lineTo(canvas.width / 2, canvas.height - 40);
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, 2 * Math.PI);
    ctx.stroke();

    // Goal areas
    const goalWidth = 100;
    const goalHeight = 200;
    const penaltyWidth = 160;
    const penaltyHeight = 300;

    // Left goal and penalty area
    ctx.strokeRect(40, (canvas.height - goalHeight) / 2, 30, goalHeight);
    ctx.strokeRect(40, (canvas.height - penaltyHeight) / 2, penaltyWidth, penaltyHeight);

    // Right goal and penalty area  
    ctx.strokeRect(canvas.width - 70, (canvas.height - goalHeight) / 2, 30, goalHeight);
    ctx.strokeRect(canvas.width - 200, (canvas.height - penaltyHeight) / 2, penaltyWidth, penaltyHeight);

    // Penalty spots
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(40 + 110, canvas.height / 2, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width - 40 - 110, canvas.height / 2, 4, 0, 2 * Math.PI);
    ctx.fill();

    // Draw players
    players.forEach(player => {
      const x = 40 + player.position[0] * (canvas.width - 80);
      const y = 40 + player.position[1] * (canvas.height - 80);

      // Player circle
      ctx.fillStyle = player.team === 'home' ? 'hsl(var(--team-home))' : 'hsl(var(--team-away))';
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, 2 * Math.PI);
      ctx.fill();

      // Selection highlight
      if (selectedPlayer?.id === player.id) {
        ctx.strokeStyle = 'hsl(var(--accent))';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Player name
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(player.name, x, y + 4);
    });

    // Draw formation lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // Group players by x position for formation lines
    const homeByX = players.filter(p => p.team === 'home').reduce((acc, player) => {
      const xGroup = Math.round(player.position[0] * 10);
      if (!acc[xGroup]) acc[xGroup] = [];
      acc[xGroup].push(player);
      return acc;
    }, {} as Record<number, PlayerPosition[]>);

    Object.values(homeByX).forEach(group => {
      if (group.length > 1) {
        const avgX = 40 + (group.reduce((sum, p) => sum + p.position[0], 0) / group.length) * (canvas.width - 80);
        ctx.beginPath();
        ctx.moveTo(avgX, 40);
        ctx.lineTo(avgX, canvas.height - 40);
        ctx.stroke();
      }
    });
  }, [players, selectedPlayer]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert to canvas coordinates
    const canvasX = (x / rect.width) * canvas.width;
    const canvasY = (y / rect.height) * canvas.height;

    // Check if clicked on a player
    const clickedPlayer = players.find(player => {
      const playerX = 40 + player.position[0] * (canvas.width - 80);
      const playerY = 40 + player.position[1] * (canvas.height - 80);
      const distance = Math.sqrt((canvasX - playerX) ** 2 + (canvasY - playerY) ** 2);
      return distance <= 20;
    });

    if (clickedPlayer) {
      setSelectedPlayer(clickedPlayer);
    } else if (selectedPlayer) {
      // Move selected player to clicked position
      const newX = (canvasX - 40) / (canvas.width - 80);
      const newY = (canvasY - 40) / (canvas.height - 80);
      
      // Clamp to field boundaries
      const clampedX = Math.max(0, Math.min(1, newX));
      const clampedY = Math.max(0, Math.min(1, newY));

      setPlayers(prev => prev.map(p => 
        p.id === selectedPlayer.id 
          ? { ...p, position: [clampedX, clampedY] }
          : p
      ));
    }
  };

  const changeFormation = (formation: keyof typeof formations) => {
    setSelectedFormation(formation);
    setPlayers(formations[formation]);
    setSelectedPlayer(null);
  };

  const resetFormation = () => {
    setPlayers(formations[selectedFormation]);
    setSelectedPlayer(null);
  };

  const exportFormation = () => {
    const formationData = {
      formation: selectedFormation,
      players: players,
      notes: tacticalNotes,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(formationData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formation-${selectedFormation}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-field">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">
                Tactical Board
              </h1>
              <p className="text-lg text-muted-foreground">
                Design and analyze team formations
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={resetFormation}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={exportFormation}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="bg-gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                Save Formation
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tactical Board */}
          <div className="lg:col-span-3">
            <Card className="shadow-tactical border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-xl">
                    <Users className="h-6 w-6 mr-2 text-accent" />
                    Formation: {selectedFormation}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-team-home text-white">Home</Badge>
                    <Badge variant="outline" className="bg-team-away text-white">Away</Badge>
                  </div>
                </div>
                <CardDescription>
                  Click on players to select them, then click on the field to move them
                </CardDescription>
              </CardHeader>
              <CardContent>
                <canvas
                  ref={canvasRef}
                  width={900}
                  height={600}
                  className="w-full border border-border/30 rounded-lg cursor-pointer bg-pitch"
                  onClick={handleCanvasClick}
                />
              </CardContent>
            </Card>
          </div>

          {/* Controls Panel */}
          <div className="space-y-4">
            {/* Formation Selector */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Formation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedFormation} onValueChange={(value: keyof typeof formations) => changeFormation(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4-3-3">4-3-3</SelectItem>
                    <SelectItem value="4-4-2">4-4-2</SelectItem>
                  </SelectContent>
                </Select>

                <div className="text-sm text-muted-foreground">
                  Popular formations used in modern football
                </div>
              </CardContent>
            </Card>

            {/* Selected Player Info */}
            {selectedPlayer && (
              <Card className="shadow-card border-accent/30 bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-lg">Selected Player</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      selectedPlayer.team === 'home' ? 'bg-team-home' : 'bg-team-away'
                    }`}>
                      {selectedPlayer.name}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{selectedPlayer.role}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedPlayer.team === 'home' ? 'Home Team' : 'Away Team'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="text-muted-foreground">Position</div>
                    <div className="font-mono text-foreground">
                      ({selectedPlayer.position[0].toFixed(2)}, {selectedPlayer.position[1].toFixed(2)})
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tactical Notes */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Tactical Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  placeholder="Add your tactical observations and strategies..."
                  value={tacticalNotes}
                  onChange={(e) => setTacticalNotes(e.target.value)}
                  className="w-full h-24 p-3 text-sm border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Load Formation
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Palette className="h-4 w-4 mr-2" />
                  Change Colors
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}