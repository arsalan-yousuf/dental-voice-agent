"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type CallStatus = "idle" | "connecting" | "active" | "ended";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? "";
const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ?? "";

const isConfigured = Boolean(PUBLIC_KEY && ASSISTANT_ID);

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function VapiVoiceDemo() {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);
  const vapiRef = useRef<{ start: (id: string) => void; stop: () => void; setMuted: (m: boolean) => void; on: (e: string, fn: (...args: unknown[]) => void) => void } | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Call timer: run when status === "active"
  useEffect(() => {
    if (status !== "active") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (status === "ended" || status === "idle" || status === "connecting") {
        setCallDurationSeconds(0);
      }
      return;
    }
    setCallDurationSeconds(0);
    timerRef.current = setInterval(() => {
      setCallDurationSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status]);

  // Load VAPI SDK only in the browser and create client
  useEffect(() => {
    if (!isConfigured || typeof window === "undefined") return;
    let cancelled = false;
    (async () => {
      try {
        const { default: Vapi } = await import("@vapi-ai/web");
        if (cancelled) return;
        const vapi = new Vapi(PUBLIC_KEY);

        vapi.on("call-start", () => setStatus("active"));
        vapi.on("call-end", () => {
          setStatus("ended");
          setVolume(0);
        });
        vapi.on("volume-level", (level: number) => setVolume(level ?? 0));
        vapi.on("error", (e: unknown) => {
          setError(e instanceof Error ? e.message : "Something went wrong");
          setStatus("idle");
        });

        vapiRef.current = vapi;
        setSdkReady(true);
      } catch (err) {
        if (!cancelled) setError("Failed to load voice SDK");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const startCall = useCallback(() => {
    if (!vapiRef.current || !isConfigured) return;
    setError(null);
    setStatus("connecting");
    try {
      vapiRef.current.start(ASSISTANT_ID);
    } catch (err) {
      setError("Failed to start call");
      setStatus("idle");
    }
  }, []);

  const endCall = useCallback(() => {
    if (!vapiRef.current) return;
    vapiRef.current.stop();
    setStatus("ended");
  }, []);

  const toggleMute = useCallback(() => {
    if (!vapiRef.current) return;
    const next = !muted;
    vapiRef.current.setMuted(next);
    setMuted(next);
  }, [muted]);

  if (!isConfigured) {
    return (
      <div className="rounded-xl border border-amber-400/40 bg-amber-500/20 px-4 py-3 text-sm text-amber-100 backdrop-blur-xl">
        <p className="font-medium">Voice demo not configured</p>
        <p className="mt-1 text-amber-200/90">
          Set <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_VAPI_PUBLIC_KEY</code> and{" "}
          <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_VAPI_ASSISTANT_ID</code> in{" "}
          <code className="rounded bg-white/10 px-1">.env.local</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-400/40 bg-red-500/20 px-4 py-3 text-sm text-red-100 backdrop-blur-xl">
          {error}
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        {status === "idle" && (
          <button
            type="button"
            onClick={startCall}
            disabled={!sdkReady}
            className="w-full rounded-xl border border-white/30 bg-emerald-500/90 px-8 py-4 text-base font-semibold text-white shadow-lg backdrop-blur-xl transition hover:bg-emerald-500 disabled:opacity-50"
          >
            {sdkReady ? "Start call" : "Loading…"}
          </button>
        )}

        {(status === "connecting" || status === "active") && (
          <>
            <div className="flex w-full flex-col items-center gap-3 rounded-xl border border-white/25 bg-white/15 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div
                  className="h-2.5 w-14 overflow-hidden rounded-full bg-white/30"
                  role="progressbar"
                  aria-valuenow={volume}
                  aria-valuemin={0}
                  aria-valuemax={1}
                >
                  <div
                    className="h-full bg-emerald-400 transition-all duration-150"
                    style={{ width: `${Math.min(100, volume * 100)}%` }}
                  />
                </div>
                {status === "active" && (
                  <span
                    className="tabular-nums font-medium text-white"
                    aria-live="polite"
                  >
                    {formatDuration(callDurationSeconds)}
                  </span>
                )}
                <span className="text-sm text-white/80">
                  {status === "connecting" ? "Connecting…" : "On call"}
                </span>
              </div>
            </div>
            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={toggleMute}
                className="flex-1 rounded-xl border border-white/25 bg-white/15 py-3 text-sm font-medium text-white backdrop-blur-xl transition hover:bg-white/25"
              >
                {muted ? "Unmute" : "Mute"}
              </button>
              <button
                type="button"
                onClick={endCall}
                className="flex-1 rounded-xl border border-red-400/40 bg-red-500/80 py-3 text-sm font-medium text-white backdrop-blur-xl transition hover:bg-red-500/90"
              >
                End call
              </button>
            </div>
          </>
        )}

        {status === "ended" && (
          <>
            <p className="text-sm text-white/80">Call ended.</p>
            <button
              type="button"
              onClick={startCall}
              className="w-full rounded-xl border border-white/30 bg-emerald-500/90 px-8 py-4 text-base font-semibold text-white shadow-lg backdrop-blur-xl transition hover:bg-emerald-500"
            >
              Start new call
            </button>
          </>
        )}
      </div>
    </div>
  );
}
