interface ReceiptAvatarProps {
  initials: string;
  color?: string;
  size?: number;
  /** "circle" (par défaut) ou "square" (coins arrondis, cf. avatar client de la Caisse). */
  shape?: "circle" | "square";
  /** Taille de police explicite (px). Si omise, calculée proportionnellement à `size`. */
  fontSize?: number;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function ReceiptAvatar({ initials, color = "#0B8F68", size = 28, shape = "circle", fontSize }: ReceiptAvatarProps) {
  return (
    <div
      className={`flex items-center justify-center text-white font-bold flex-shrink-0 ${
        shape === "square" ? "rounded-lg" : "rounded-full"
      }`}
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: fontSize ?? size * 0.36,
      }}
    >
      {initials}
    </div>
  );
}

export { getInitials as getReceiptInitials };
