"use client";

type PreviewField = {
  label: string;
  value: string;
};

type FormPreviewCardProps = {
  title: string;
  subtitle?: string;
  image?: string;
  statusLabel?: string;
  statusColor?: string;
  fields?: PreviewField[];
};

export function FormPreviewCard({
  title,
  subtitle,
  image,
  statusLabel,
  statusColor = "bg-amber-100 text-amber-700",
  fields,
}: FormPreviewCardProps) {
  return (
    <div className="space-y-3">
      {/* Image area */}
      {image ? (
        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
          <img src={image} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="aspect-video rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
          <span className="text-xs text-gray-400">No image</span>
        </div>
      )}

      {/* Status badge */}
      {statusLabel && (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusColor}`}>
          {statusLabel}
        </span>
      )}

      {/* Title */}
      <h3 className="font-bold text-base leading-tight text-gray-900 dark:text-white">
        {title || "Untitled"}
      </h3>

      {/* Subtitle (Tamil) */}
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* Fields */}
      {fields && fields.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
          {fields.map((f) => (
            <div key={f.label} className="flex justify-between text-xs">
              <span className="text-gray-400">{f.label}</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[60%] text-right">
                {f.value || "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
