"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Monitor,
  Zap,
  Volume2,
  Palette,
  Server,
  Upload,
  Play,
  FileText,
  RefreshCw,
} from "lucide-react";

export default function SettingsPage() {
  const [model, setModel] = useState("mimo-hermes");
  const [fallbackModel, setFallbackModel] = useState("claude");
  const [streaming, setStreaming] = useState(true);
  const [transport, setTransport] = useState("sse");
  const [compressionEnabled, setCompressionEnabled] = useState(true);
  const [compressionThreshold, setCompressionThreshold] = useState(0.7);
  const [ttsProvider, setTtsProvider] = useState("edge");
  const [voice, setVoice] = useState("en-US-GuyNeural");
  const [darkMode, setDarkMode] = useState(true);
  const [gatewayRunning, setGatewayRunning] = useState(true);
  const [lastBackup, setLastBackup] = useState("3 hours ago");
  const [backupLoading, setBackupLoading] = useState(false);
  const [restartLoading, setRestartLoading] = useState(false);
  const [testing, setTesting] = useState(false);

  const handleBackup = () => {
    setBackupLoading(true);
    setTimeout(() => {
      setBackupLoading(false);
      setLastBackup("just now");
    }, 2000);
  };

  const handleRestart = () => {
    setRestartLoading(true);
    setTimeout(() => {
      setRestartLoading(false);
      setGatewayRunning(true);
    }, 3000);
  };

  const handleTestVoice = () => {
    setTesting(true);
    setTimeout(() => setTesting(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your Hermes AI agent</p>
      </div>

      {/* Model Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            Model
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Primary Model</label>
            <Select value={model} onValueChange={(v) => { if (v !== null) setModel(v) }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mimo-hermes">Mimo-hermes</SelectItem>
                <SelectItem value="claude">Claude 3.5 Sonnet</SelectItem>
                <SelectItem value="gpt4">GPT-4o</SelectItem>
                <SelectItem value="gemini">Gemini 2.0</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Fallback Model</label>
            <Select value={fallbackModel} onValueChange={(v) => { if (v !== null) setFallbackModel(v) }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="claude">Claude 3.5 Sonnet</SelectItem>
                <SelectItem value="gpt4">GPT-4o</SelectItem>
                <SelectItem value="mimo-hermes">Mimo-hermes</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Streaming & Compression */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Streaming & Compression
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Enable Streaming</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Stream responses token by token instead of waiting for completion
              </p>
            </div>
            <Switch checked={streaming} onCheckedChange={setStreaming} />
          </div>
          <Separator />
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Transport</label>
            <Select value={transport} onValueChange={(v) => { if (v !== null) setTransport(v) }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sse">Server-Sent Events (SSE)</SelectItem>
                <SelectItem value="ws">WebSocket</SelectItem>
                <SelectItem value="polling">Polling</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Context Compression</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Compress conversation history to save tokens
              </p>
            </div>
            <Switch checked={compressionEnabled} onCheckedChange={setCompressionEnabled} />
          </div>
          {compressionEnabled && (
            <>
              <Separator />
              <div className="py-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">Compression Threshold</p>
                  <span className="text-sm text-primary font-mono">
                    {compressionThreshold.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={compressionThreshold}
                  onChange={(e) => setCompressionThreshold(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0.0</span>
                  <span>1.0</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Voice / TTS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" />
            Voice / TTS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">TTS Provider</label>
            <Select value={ttsProvider} onValueChange={(v) => { if (v !== null) setTtsProvider(v) }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="edge">Edge TTS (Free)</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                <SelectItem value="xai">xAI</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Voice</label>
            <Select value={voice} onValueChange={(v) => { if (v !== null) setVoice(v) }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US-GuyNeural">Guy (Male, US)</SelectItem>
                <SelectItem value="en-US-JennyNeural">Jenny (Female, US)</SelectItem>
                <SelectItem value="en-US-AriaNeural">Aria (Female, US)</SelectItem>
                <SelectItem value="en-US-DavisNeural">Davis (Male, US)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Test Voice</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Play a sample to hear the selected voice
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleTestVoice}
              disabled={testing}
              className="gap-2"
            >
              {testing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {testing ? "Testing..." : "Test"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Dark Mode</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Use dark theme throughout the dashboard
              </p>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </CardContent>
      </Card>

      {/* Gateway */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            Gateway
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Health Status</p>
              <p className="text-xs text-muted-foreground mt-0.5">Current gateway health</p>
            </div>
            <span
              className={`flex items-center gap-2 text-sm ${
                gatewayRunning ? "text-green-500" : "text-red-500"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  gatewayRunning ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {gatewayRunning ? "Healthy" : "Down"}
            </span>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRestart} disabled={restartLoading} className="gap-2">
              {restartLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {restartLoading ? "Restarting..." : "Restart Gateway"}
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              View Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Backup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Last Backup</p>
              <p className="text-xs text-muted-foreground mt-0.5">{lastBackup}</p>
            </div>
            <Button onClick={handleBackup} disabled={backupLoading} className="gap-2">
              {backupLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {backupLoading ? "Backing up..." : "Trigger Backup"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
