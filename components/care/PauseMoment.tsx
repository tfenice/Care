"use client";

import { useEffect, useCallback } from "react";

interface Props {
  heading?: string;
  body?: string;
  onContinue: () => void;
  durationMs?: number;
}

export default function PauseMoment({
  heading = "หายใจลึก ๆ สักครั้ง",
  body = "แล้วค่อยรับข้อความสำหรับวันนี้",
  onContinue,
  durationMs = 2500,
}: Props) {
  const advance = useCallback(() => onContinue(), [onContinue]);

  useEffect(() => {
    const t = setTimeout(advance, durationMs);
    return () => clearTimeout(t);
  }, [advance, durationMs]);

  return (
    <div
      className="fixed inset-0 bg-cream flex items-center justify-center cursor-pointer z-50"
      onClick={advance}
      role="button"
      aria-label="แตะเพื่อดำเนินการต่อ"
    >
      <div className="text-center space-y-10 px-10">
        {/* Breathing circle */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-full border border-brown/20 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-3 rounded-full border border-brown/40 animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-6 rounded-full bg-brown/15" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-light text-ink leading-loose">{heading}</h1>
          {body && <p className="text-muted font-light leading-8">{body}</p>}
        </div>
      </div>
    </div>
  );
}
