"use client";

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label?: string;
}

export function Toggle({ checked, onChange, disabled, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className="flex-shrink-0 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        width: 40,
        height: 22,
        background: checked ? "rgb(11, 143, 104)" : "rgb(209, 213, 219)",
      }}
    >
      <span
        className="block rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{
          width: 16,
          height: 16,
          marginTop: 3,
          transform: `translateX(${checked ? 21 : 3}px)`,
        }}
      />
    </button>
  );
}
