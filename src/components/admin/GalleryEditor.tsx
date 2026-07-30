"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin/auth";

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
};

export function GalleryEditor({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFilesSelected(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    const next = [...value];

    try {
      for (const file of Array.from(files)) {
        const prep = await adminFetch("/uploads", {
          method: "POST",
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type || "application/octet-stream",
          }),
        });
        const data = (await prep.json()) as {
          uploadUrl?: string;
          publicUrl?: string;
          error?: string;
        };
        if (!prep.ok || !data.uploadUrl || !data.publicUrl) {
          throw new Error(data.error ?? "Could not create upload URL");
        }

        const put = await fetch(data.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
          body: file,
        });
        if (!put.ok) throw new Error("S3 upload failed");
        next.push(data.publicUrl);
      }
      onChange(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="gallery-editor">
      <div className="gallery-editor__head">
        <span>Photo gallery</span>
        <label className="gallery-editor__upload btn btn--ghost">
          {uploading ? "Uploading…" : "Add photos"}
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={uploading}
            onChange={(e) => {
              void onFilesSelected(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {value.length === 0 ? (
        <p className="gallery-editor__empty">No photos yet.</p>
      ) : (
        <ul className="gallery-editor__grid">
          {value.map((url, index) => (
            <li key={`${url}-${index}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" />
              <button type="button" onClick={() => removeAt(index)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      {error ? <p className="admin-error">{error}</p> : null}
    </div>
  );
}
