import { useState, useCallback } from "react";
import { Upload, Link, Video, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadProgress } from "@/types";

export function VideoUpload() {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [videoUrl, setVideoUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [gameInfo, setGameInfo] = useState({
    homeTeam: '',
    awayTeam: '',
    date: new Date().toISOString().split('T')[0],
    competition: 'Premier League'
  });

  // Simulate upload progress
  const simulateUpload = useCallback(() => {
    setUploadProgress({ loaded: 0, total: 100, percentage: 0, stage: 'uploading' });
    
    const stages = [
      { stage: 'uploading' as const, duration: 3000 },
      { stage: 'processing' as const, duration: 4000 },
      { stage: 'analyzing' as const, duration: 5000 },
      { stage: 'complete' as const, duration: 1000 }
    ];

    let currentStage = 0;
    let progress = 0;

    const updateProgress = () => {
      const stage = stages[currentStage];
      const stageProgress = Math.min(progress + Math.random() * 15, 100);
      
      setUploadProgress({
        loaded: stageProgress,
        total: 100,
        percentage: stageProgress,
        stage: stage.stage
      });

      if (stageProgress >= 100) {
        if (currentStage < stages.length - 1) {
          currentStage++;
          progress = 0;
          setTimeout(updateProgress, 500);
        }
      } else {
        progress = stageProgress;
        setTimeout(updateProgress, stage.duration / 10);
      }
    };

    updateProgress();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));
    
    if (videoFile) {
      simulateUpload();
    }
  }, [simulateUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateUpload();
    }
  }, [simulateUpload]);

  const handleUrlUpload = () => {
    if (videoUrl) {
      simulateUpload();
    }
  };

  const getStageText = (stage: UploadProgress['stage']) => {
    switch (stage) {
      case 'uploading': return 'Uploading video file...';
      case 'processing': return 'Processing video frames...';
      case 'analyzing': return 'AI analyzing tactics...';
      case 'complete': return 'Analysis complete!';
    }
  };

  const getStageIcon = (stage: UploadProgress['stage']) => {
    switch (stage) {
      case 'uploading': return <Upload className="h-5 w-5 text-accent animate-pulse" />;
      case 'processing': return <Video className="h-5 w-5 text-accent animate-spin" />;
      case 'analyzing': return <Clock className="h-5 w-5 text-accent animate-pulse" />;
      case 'complete': return <CheckCircle className="h-5 w-5 text-success" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-field">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Upload Match Video
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload your match footage for AI-powered tactical analysis
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Progress */}
          {uploadProgress && (
            <Card className="shadow-glow border-accent/30 bg-gradient-to-r from-card to-accent/5">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStageIcon(uploadProgress.stage)}
                      <span className="font-medium text-foreground">
                        {getStageText(uploadProgress.stage)}
                      </span>
                    </div>
                    <Badge variant={uploadProgress.stage === 'complete' ? 'default' : 'secondary'}>
                      {Math.round(uploadProgress.percentage)}%
                    </Badge>
                  </div>
                  <Progress value={uploadProgress.percentage} className="h-3" />
                  
                  {uploadProgress.stage === 'complete' && (
                    <div className="mt-4 p-4 bg-success/10 rounded-lg border border-success/20">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span className="font-medium text-success">
                          Video uploaded and analyzed successfully!
                        </span>
                      </div>
                      <Button className="mt-3 bg-gradient-success">
                        View Analysis Results
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Upload Card */}
          <Card className="shadow-tactical border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-foreground">
                Upload Options
              </CardTitle>
              <CardDescription>
                Choose your preferred method to upload match videos for analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={uploadMethod} onValueChange={(value) => setUploadMethod(value as 'file' | 'url')} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="file" className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>File Upload</span>
                  </TabsTrigger>
                  <TabsTrigger value="url" className="flex items-center space-x-2">
                    <Link className="h-4 w-4" />
                    <span>URL Upload</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="file" className="space-y-6">
                  {/* Drag & Drop Area */}
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
                      dragActive 
                        ? 'border-accent bg-accent/10 shadow-glow' 
                        : 'border-border hover:border-accent/50 hover:bg-accent/5'
                    }`}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <Upload className={`mx-auto h-16 w-16 mb-4 ${dragActive ? 'text-accent scale-110' : 'text-muted-foreground'} transition-all`} />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Drop your video file here
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      or click to browse files
                    </p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" className="pointer-events-none">
                      Select Video File
                    </Button>
                    <div className="mt-4 text-sm text-muted-foreground">
                      Supports MP4, AVI, MOV • Max size: 2GB
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="url" className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="video-url" className="text-base font-medium">
                      Video URL
                    </Label>
                    <Input
                      id="video-url"
                      type="url"
                      placeholder="https://example.com/match-video.mp4"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="text-base"
                    />
                    <Button 
                      onClick={handleUrlUpload}
                      disabled={!videoUrl}
                      className="w-full bg-gradient-primary"
                    >
                      <Link className="h-5 w-5 mr-2" />
                      Upload from URL
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Game Information */}
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">
                Match Information
              </CardTitle>
              <CardDescription>
                Provide details about the match for better analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="home-team">Home Team</Label>
                  <Input
                    id="home-team"
                    placeholder="e.g., Arsenal"
                    value={gameInfo.homeTeam}
                    onChange={(e) => setGameInfo(prev => ({ ...prev, homeTeam: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="away-team">Away Team</Label>
                  <Input
                    id="away-team"
                    placeholder="e.g., Chelsea"
                    value={gameInfo.awayTeam}
                    onChange={(e) => setGameInfo(prev => ({ ...prev, awayTeam: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="match-date">Match Date</Label>
                  <Input
                    id="match-date"
                    type="date"
                    value={gameInfo.date}
                    onChange={(e) => setGameInfo(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="competition">Competition</Label>
                  <Input
                    id="competition"
                    placeholder="e.g., Premier League"
                    value={gameInfo.competition}
                    onChange={(e) => setGameInfo(prev => ({ ...prev, competition: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Requirements */}
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-warning" />
                Upload Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-foreground mb-3">Supported Formats</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• MP4 (recommended)</li>
                    <li>• AVI</li>
                    <li>• MOV</li>
                    <li>• WebM</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-3">Video Quality</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Minimum: 720p (HD)</li>
                    <li>• Recommended: 1080p (Full HD)</li>
                    <li>• Frame rate: 24-60 FPS</li>
                    <li>• Maximum file size: 2GB</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}