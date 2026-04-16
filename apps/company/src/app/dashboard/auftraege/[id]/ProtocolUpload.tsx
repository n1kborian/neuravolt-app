"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@neuravolt/auth/client";
import { Upload, FileText, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";

interface ProtocolUploadProps {
  orderId: string;
  existingPath: string | null;
  uploadedAt: string | null;
}

export function ProtocolUpload({ orderId, existingPath, uploadedAt }: ProtocolUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("Datei ist größer als 10 MB.");
      return;
    }

    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(file.type)) {
      setError("Nur PDF, JPG und PNG erlaubt.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const ext = file.name.split(".").pop() ?? "pdf";
      const path = `${orderId}/protokoll-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("protocols")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { error: updateError } = await supabase
        .from("orders")
        .update({
          protocol_path: path,
          protocol_uploaded_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleDownload() {
    if (!existingPath) return;
    const supabase = getSupabaseBrowserClient();
    const { data, error: dlError } = await supabase.storage
      .from("protocols")
      .createSignedUrl(existingPath, 60 * 5);

    if (dlError || !data?.signedUrl) {
      setError("Download-Link konnte nicht erstellt werden.");
      return;
    }
    window.open(data.signedUrl, "_blank");
  }

  return (
    <div className="rounded-2xl border border-border bg-background/80 p-6">
      <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Prüfprotokoll
      </h2>

      {existingPath ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-green-800">Protokoll hochgeladen</p>
              <p className="text-xs text-green-600 truncate">{existingPath.split("/").pop()}</p>
              {uploadedAt && (
                <p className="text-xs text-green-600 mt-0.5">
                  {new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(uploadedAt))}
                </p>
              )}
            </div>
            <button
              onClick={handleDownload}
              className="shrink-0 px-4 py-2 rounded-full border border-border text-sm font-medium text-foreground hover:bg-muted transition"
            >
              Herunterladen
            </button>
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Neues Protokoll hochladen (ersetzt das aktuelle)</label>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleUpload}
              disabled={uploading}
              className="block w-full text-sm text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-full file:border file:border-border file:text-sm file:font-semibold file:bg-background file:text-foreground hover:file:bg-muted file:transition file:cursor-pointer disabled:opacity-50"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl border-2 border-dashed border-border p-8 text-center">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">Prüfprotokoll hochladen</p>
            <p className="text-xs text-muted-foreground mb-4">PDF, JPG oder PNG · max. 10 MB</p>
            <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition cursor-pointer">
              <Upload className="h-4 w-4" />
              {uploading ? "Wird hochgeladen …" : "Datei auswählen"}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleUpload}
                disabled={uploading}
                className="sr-only"
              />
            </label>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && !existingPath && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Protokoll erfolgreich hochgeladen.
        </div>
      )}
    </div>
  );
}
