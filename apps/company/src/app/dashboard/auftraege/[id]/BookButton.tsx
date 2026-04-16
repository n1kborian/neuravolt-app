"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { bookOrder } from "../actions";

export function BookButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null);
  const router = useRouter();

  function handleBook() {
    startTransition(async () => {
      const res = await bookOrder(orderId);
      setResult(res);
      if (res.ok) router.refresh();
    });
  }

  if (result?.ok) {
    return (
      <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background text-green-700 text-sm font-semibold">
        <CheckCircle2 className="h-4 w-4" />
        Erfolgreich gebucht
      </span>
    );
  }

  return (
    <div>
      <button
        onClick={handleBook}
        disabled={isPending}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background text-foreground text-sm font-semibold hover:bg-background/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Wird gebucht …" : "Verbindlich buchen"}
        {!isPending && <ArrowRight className="h-4 w-4" />}
      </button>
      {result && !result.ok && (
        <div className="mt-2 flex items-start gap-2 text-sm text-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{result.error}</span>
        </div>
      )}
    </div>
  );
}
