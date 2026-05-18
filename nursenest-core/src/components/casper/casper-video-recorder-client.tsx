"use client";

import { useEffect, useRef, useState } from "react";

type CasperVideoRecorderClientProps = {
  disabled?: boolean;
  maxSeconds: number;
  onRecordingReady?: (blob: Blob) => void;
};

export function CasperVideoRecorderClient({
  disabled = false,
  maxSeconds,
  onRecordingReady,
}: CasperVideoRecorderClientProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function prepareMedia() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setIsReady(true);
      } catch {
        setPermissionError(
          "Camera or microphone access was not granted. You can still continue with typed practice, but video-response recording requires media permissions.",
        );
      }
    }

    void prepareMedia();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (!isRecording) return;

    if (elapsedSeconds >= maxSeconds) {
      recorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const interval = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [elapsedSeconds, isRecording, maxSeconds]);

  function startRecording() {
    if (disabled || !videoRef.current?.srcObject) return;

    const stream = videoRef.current.srcObject as MediaStream;
    chunksRef.current = [];
    setElapsedSeconds(0);

    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      onRecordingReady?.(blob);
    };

    recorder.start();
    setIsRecording(true);
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setIsRecording(false);
  }

  return (
    <div className="rounded-[2rem] border border-dashed border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-secondary)] p-6">
      <div className="overflow-hidden rounded-[1.5rem] border border-[var(--semantic-border-primary)] bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="aspect-video w-full object-cover"
        />
      </div>

      {permissionError ? (
        <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-800">
          {permissionError}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--semantic-text-secondary)]">
            Video response timer
          </p>
          <p className="mt-1 text-2xl font-semibold text-[var(--semantic-text-primary)]">
            {elapsedSeconds}s / {maxSeconds}s
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={disabled || !isReady || isRecording}
            onClick={startRecording}
            className="rounded-2xl bg-[var(--theme-primary)] px-5 py-3 font-semibold text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start recording
          </button>

          <button
            type="button"
            disabled={!isRecording}
            onClick={stopRecording}
            className="rounded-2xl border border-[var(--semantic-border-primary)] px-5 py-3 font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-surface-primary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}
