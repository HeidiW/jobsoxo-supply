import type { ReactElement } from "react";

interface Palette {
  background: string;
  foreground: string;
  accent: string;
}

const palettes: Record<string, Palette> = {
  trowels: { background: "#2b3238", foreground: "#ffffff", accent: "#f28c18" },
  plaster: { background: "#e7e1d3", foreground: "#1c2126", accent: "#b45f06" },
  stilts: { background: "#34506a", foreground: "#ffffff", accent: "#f7b267" },
  miscellaneous: { background: "#5e6b5a", foreground: "#ffffff", accent: "#f7c873" },
};

function TrowelIcon({ color, accent }: { color: string; accent: string }) {
  return (
    <svg width="460" height="460" viewBox="0 0 240 240">
      <path d="M30 160h160l24 26H54z" fill={color} />
      <path d="M118 160v-44" stroke={color} strokeWidth="12" fill="none" />
      <rect x="66" y="88" width="108" height="28" rx="14" fill={accent} />
    </svg>
  );
}

function BagIcon({ color, accent }: { color: string; accent: string }) {
  return (
    <svg width="460" height="460" viewBox="0 0 240 240">
      <path d="M66 44h108l12 22v130l-12 14H66l-12-14V66z" fill={color} />
      <rect x="54" y="104" width="132" height="46" fill={accent} />
    </svg>
  );
}

function StiltsIcon({ color, accent }: { color: string; accent: string }) {
  return (
    <svg width="460" height="460" viewBox="0 0 240 240">
      <path d="M84 40v150M156 40v150" stroke={color} strokeWidth="14" fill="none" />
      <path d="M58 200h52M130 200h52" stroke={color} strokeWidth="16" fill="none" />
      <rect x="66" y="56" width="36" height="20" fill={accent} />
      <rect x="138" y="56" width="36" height="20" fill={accent} />
      <rect x="66" y="120" width="36" height="14" fill={accent} />
      <rect x="138" y="120" width="36" height="14" fill={accent} />
    </svg>
  );
}

function TapeIcon({ color, accent }: { color: string; accent: string }) {
  return (
    <svg width="460" height="460" viewBox="0 0 240 240">
      <path d="M120 190h90v20h-90z" fill={color} />
      <circle cx="120" cy="120" r="90" fill={color} />
      <circle cx="120" cy="120" r="44" fill={accent} />
    </svg>
  );
}

const icons = {
  trowels: TrowelIcon,
  plaster: BagIcon,
  stilts: StiltsIcon,
  miscellaneous: TapeIcon,
};

export interface PlaceholderArtProps {
  categorySlug: string;
  categoryName: string;
  label?: string;
}

/** Rendered by next/og, so only inline styles and flexbox are available. */
export function PlaceholderArt({
  categorySlug,
  categoryName,
  label,
}: PlaceholderArtProps): ReactElement {
  const palette = palettes[categorySlug] ?? palettes.trowels;
  const Icon = icons[categorySlug as keyof typeof icons] ?? TrowelIcon;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 72,
        backgroundColor: palette.background,
        color: palette.foreground,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 36,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        <span>{categoryName}</span>
        <span style={{ color: palette.accent }}>JobsOxo</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Icon color={palette.foreground} accent={palette.accent} />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {label && (
          <div style={{ display: "flex", fontSize: 56, lineHeight: 1.15 }}>
            {label}
          </div>
        )}
        <div style={{ display: "flex", marginTop: 16, fontSize: 28, opacity: 0.75 }}>
          Placeholder image
        </div>
      </div>
    </div>
  );
}
