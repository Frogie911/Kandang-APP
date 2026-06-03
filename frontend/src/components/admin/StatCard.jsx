import { useCallback } from "react";

/**
 * StatCard - Komponen reusable untuk menampilkan KPI / statistik ringkasan
 *
 * Props:
 *   icon        : string — nama icon Material Symbols
 *   label       : string — judul KPI
 *   value       : string | number — nilai yang ditampilkan
 *   color       : string — warna icon & value (primary, secondary, error, tertiary, on-surface)
 *   badge       : { text: string, color: string } — badge opsional
 *   fillIcon    : boolean — true = icon penuh
 *   onClick     : function — handler saat card di-tap
 *   className   : string — class tambahan
 */

const colorMap = {
  primary: { icon: "text-primary", value: "text-primary" },
  secondary: { icon: "text-secondary", value: "text-secondary" },
  error: { icon: "text-error", value: "text-error" },
  tertiary: { icon: "text-tertiary", value: "text-tertiary" },
  "on-surface": { icon: "text-on-surface", value: "text-on-surface" },
};

const badgeColorMap = {
  "error-container": "bg-error-container text-on-error-container",
  "primary-fixed": "bg-primary-fixed text-on-primary-fixed",
  "secondary-container": "bg-secondary-container text-on-secondary-container",
  "surface-variant": "bg-surface-variant text-on-surface-variant",
  "surface-container": "bg-surface-container text-primary",
};

export default function StatCard({
  icon,
  label,
  value,
  color = "primary",
  badge,
  fillIcon = false,
  onClick,
  className = "",
}) {
  const handleClick = useCallback(
    (e) => {
      if (onClick) {
        e.currentTarget.classList.add("scale-[0.98]");
        setTimeout(() => e.currentTarget.classList.remove("scale-[0.98]"), 100);
        onClick(e);
      }
    },
    [onClick],
  );

  const iconStyle = fillIcon
    ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
    : { fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" };

  const colors = colorMap[color] || colorMap.primary;

  return (
    <div
      onClick={handleClick}
      className={`
        bg-surface-container-lowest border border-outline-variant rounded-xl p-4 
        flex flex-col gap-2 transition-transform
        ${onClick ? "cursor-pointer active:scale-[0.98]" : ""}
        ${className}
      `}
    >
      {/* Header: Icon + Badge */}
      <div className="flex justify-between items-start">
        <span
          className={`material-symbols-outlined ${colors.icon}`}
          style={iconStyle}
        >
          {icon}
        </span>
        {badge && (
          <span
            className={`${badgeColorMap[badge.color] || badgeColorMap["surface-variant"]} px-2 py-0.5 rounded text-[10px] font-bold`}
          >
            {badge.text}
          </span>
        )}
      </div>

      {/* Value + Label */}
      <div className="mt-auto">
        <p className="text-on-surface-variant font-label-md">{label}</p>
        <p className={`font-headline-sm text-headline-sm ${colors.value}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
