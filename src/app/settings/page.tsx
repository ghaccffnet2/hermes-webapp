"use client";

import { useState } from "react";

function Toggle({
  enabled,
  onChange,
  label,
  description,
}: {
  enabled: boolean;
  onChange: () => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-[#e4e4e7]">{label}</p>
        {description && <p className="text-xs text-[#71717a] mt-0.5">{description}</p>}
      </div>
      <button
        onClick={onChange}
        className={`w-11 h-6 rounded-full transition-colors relative ${
          enabled ? "bg-[#6c5ce7]" : "bg-[#71717a]"
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
            enabled ? "translate-x-5.5" : "translate-x-0.5"
          }`}
          style={{ transform: enabled ? "translateX(22px)" : "translateX(2px)" }}
        />
      </button>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  label: string;
}) {
  return (
    <div className="py-3">
      <p className="text-sm font-medium text-[#e4e4e7] mb-2">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-[#e4e4e7] focus:outline-none focus:border-[#6c5ce7] transition-colors"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

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
        <h1 className="text-2xl font-bold text-[#e4e4e7]">Settings</h1>
        <p className="text-[#71717a] mt-1">Configure your Hermes AI agent</p>
      </div>

      {/* Model Configuration */}
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#e4e4e7] mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#6c5ce7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Model
        </h2>
        <div className="divide-y divide-[#1e1e2e]">
          <Select
            value={model}
            onChange={setModel}
            label="Primary Model"
            options={[
              { label: "Mimo-hermes", value: "mimo-hermes" },
              { label: "Claude 3.5 Sonnet", value: "claude" },
              { label: "GPT-4o", value: "gpt4" },
              { label: "Gemini 2.0", value: "gemini" },
            ]}
          />
          <Select
            value={fallbackModel}
            onChange={setFallbackModel}
            label="Fallback Model"
            options={[
              { label: "Claude 3.5 Sonnet", value: "claude" },
              { label: "GPT-4o", value: "gpt4" },
              { label: "Mimo-hermes", value: "mimo-hermes" },
              { label: "None", value: "none" },
            ]}
          />
        </div>
      </div>

      {/* Streaming & Compression */}
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#e4e4e7] mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#6c5ce7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Streaming & Compression
        </h2>
        <div className="divide-y divide-[#1e1e2e]">
          <Toggle
            enabled={streaming}
            onChange={() => setStreaming(!streaming)}
            label="Enable Streaming"
            description="Stream responses token by token instead of waiting for completion"
          />
          <Select
            value={transport}
            onChange={setTransport}
            label="Transport"
            options={[
              { label: "Server-Sent Events (SSE)", value: "sse" },
              { label: "WebSocket", value: "ws" },
              { label: "Polling", value: "polling" },
            ]}
          />
          <Toggle
            enabled={compressionEnabled}
            onChange={() => setCompressionEnabled(!compressionEnabled)}
            label="Context Compression"
            description="Compress conversation history to save tokens"
          />
          {compressionEnabled && (
            <div className="py-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-[#e4e4e7]">Compression Threshold</p>
                <span className="text-sm text-[#6c5ce7] font-mono">{compressionThreshold.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={compressionThreshold}
                onChange={(e) => setCompressionThreshold(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#1e1e2e] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#6c5ce7] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-xs text-[#71717a] mt-1">
                <span>0.0</span>
                <span>1.0</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Voice / TTS */}
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#e4e4e7] mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#6c5ce7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          Voice / TTS
        </h2>
        <div className="divide-y divide-[#1e1e2e]">
          <Select
            value={ttsProvider}
            onChange={setTtsProvider}
            label="TTS Provider"
            options={[
              { label: "Edge TTS (Free)", value: "edge" },
              { label: "OpenAI", value: "openai" },
              { label: "ElevenLabs", value: "elevenlabs" },
              { label: "xAI", value: "xai" },
            ]}
          />
          <Select
            value={voice}
            onChange={setVoice}
            label="Voice"
            options={[
              { label: "Guy (Male, US)", value: "en-US-GuyNeural" },
              { label: "Jenny (Female, US)", value: "en-US-JennyNeural" },
              { label: "Aria (Female, US)", value: "en-US-AriaNeural" },
              { label: "Davis (Male, US)", value: "en-US-DavisNeural" },
            ]}
          />
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#e4e4e7]">Test Voice</p>
              <p className="text-xs text-[#71717a] mt-0.5">Play a sample to hear the selected voice</p>
            </div>
            <button
              onClick={handleTestVoice}
              disabled={testing}
              className="px-4 py-2 bg-[#6c5ce7]/10 text-[#6c5ce7] text-sm font-medium rounded-lg hover:bg-[#6c5ce7]/20 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {testing ? (
                <div className="w-4 h-4 border-2 border-[#6c5ce7] border-t-transparent rounded-full spin-slow" />
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
              {testing ? "Testing..." : "Test"}
            </button>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#e4e4e7] mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#6c5ce7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Theme
        </h2>
        <Toggle
          enabled={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          label="Dark Mode"
          description="Use dark theme throughout the dashboard"
        />
      </div>

      {/* Gateway */}
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#e4e4e7] mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#6c5ce7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
          </svg>
          Gateway
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#e4e4e7]">Health Status</p>
              <p className="text-xs text-[#71717a] mt-0.5">Current gateway health</p>
            </div>
            <span className={`flex items-center gap-2 text-sm ${gatewayRunning ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
              <span className={`w-2 h-2 rounded-full ${gatewayRunning ? "bg-[#22c55e]" : "bg-[#ef4444]"}`} />
              {gatewayRunning ? "Healthy" : "Down"}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRestart}
              disabled={restartLoading}
              className="px-4 py-2 bg-[#6c5ce7] hover:bg-[#7c6cf7] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {restartLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full spin-slow" />
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              {restartLoading ? "Restarting..." : "Restart Gateway"}
            </button>
            <button className="px-4 py-2 bg-[#12121a] border border-[#1e1e2e] text-[#71717a] text-sm font-medium rounded-lg hover:text-[#e4e4e7] transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Logs
            </button>
          </div>
        </div>
      </div>

      {/* Backup */}
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#e4e4e7] mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#6c5ce7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Backup
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#e4e4e7]">Last Backup</p>
              <p className="text-xs text-[#71717a] mt-0.5">{lastBackup}</p>
            </div>
            <button
              onClick={handleBackup}
              disabled={backupLoading}
              className="px-4 py-2 bg-[#6c5ce7] hover:bg-[#7c6cf7] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {backupLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full spin-slow" />
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              )}
              {backupLoading ? "Backing up..." : "Trigger Backup"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
