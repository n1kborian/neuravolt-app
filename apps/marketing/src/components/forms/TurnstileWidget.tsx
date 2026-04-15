"use client";
import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile — invisible/managed challenge widget.
 *
 * Loads the Turnstile script once per page (idempotent) and renders the widget
 * into an internal div. Token changes are reported via the `onToken` callback.
 *
 * Implementation notes:
 * - We keep a ref to `onToken` so re-renders of the parent don't tear down the
 *   widget. The callback used by Turnstile reads the latest ref on every fire.
 * - On error/expire we report an empty string so the parent can disable submit.
 * - If `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is not set, the widget renders nothing
 *   and reports a sentinel "dev" token so local development without Turnstile
 *   credentials still works.
 */

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "flexible";
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          "timeout-callback"?: () => void;
        },
      ) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback&render=explicit";

interface TurnstileWidgetProps {
  onToken: (token: string) => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact" | "flexible";
}

export function TurnstileWidget({ onToken, theme = "auto", size = "flexible" }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    // Dev fallback — no site key, signal a sentinel token so submit isn't blocked.
    if (!siteKey) {
      onTokenRef.current("dev-no-turnstile");
      return;
    }

    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !window.turnstile || !containerRef.current) return;
      // Avoid double-render
      if (widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme,
        size,
        callback: (token: string) => onTokenRef.current(token),
        "error-callback": () => onTokenRef.current(""),
        "expired-callback": () => onTokenRef.current(""),
        "timeout-callback": () => onTokenRef.current(""),
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const existing = document.getElementById(SCRIPT_ID);
      if (!existing) {
        window.onloadTurnstileCallback = renderWidget;
        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      } else {
        // Script tag exists but turnstile global may not be ready yet.
        const interval = window.setInterval(() => {
          if (window.turnstile) {
            window.clearInterval(interval);
            renderWidget();
          }
        }, 100);
        // Safety stop after 10 seconds.
        window.setTimeout(() => window.clearInterval(interval), 10_000);
      }
    }

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, theme, size]);

  if (!siteKey) {
    return null;
  }

  return <div ref={containerRef} className="cf-turnstile flex justify-center" />;
}
