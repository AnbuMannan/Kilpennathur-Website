"use client";

export function CopyUrlInput({ value }: { value: string }) {
  return (
    <input
      type="text"
      readOnly
      value={value}
      className="mt-1 w-full text-[10px] p-1 bg-muted rounded border-0 truncate"
      onClick={(e) => (e.target as HTMLInputElement).select()}
    />
  );
}
