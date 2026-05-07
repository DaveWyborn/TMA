type WordmarkProps = {
  size?: number;
  inverted?: boolean;
  showSubhead?: boolean;
  className?: string;
};

export default function Wordmark({
  size = 26,
  inverted = false,
  showSubhead = true,
  className = "",
}: WordmarkProps) {
  const fg = inverted ? "var(--paper)" : "var(--ink)";
  const pieSize = Math.round(size * 0.72);
  const subSize = Math.max(8, Math.round(size * 0.34));
  const ruleWidth = Math.max(14, Math.round(size * 0.9));

  return (
    <span
      className={`inline-flex flex-col items-center leading-none ${className}`}
      aria-label="Tailor Made Analytics"
    >
      <span
        className="inline-flex items-center"
        style={{
          fontFamily: "var(--font-orbitron), sans-serif",
          fontWeight: 700,
          letterSpacing: "0.02em",
          fontSize: `${size}px`,
          color: fg,
          gap: "0.05em",
        }}
      >
        <span>Tail</span>
        <svg
          width={pieSize}
          height={pieSize}
          viewBox="0 0 110 110"
          style={{ display: "inline-block", verticalAlign: "-0.1em" }}
          aria-hidden="true"
        >
          <circle
            cx="55"
            cy="55"
            r="36"
            fill="none"
            stroke={fg}
            strokeWidth="22"
            strokeDasharray="169.6 226.2"
            strokeDashoffset="-56.6"
            transform="rotate(-90 55 55)"
          />
          <g transform="translate(7, -7)">
            <circle
              cx="55"
              cy="55"
              r="36"
              fill="none"
              stroke="var(--signal)"
              strokeWidth="22"
              strokeDasharray="56.6 226.2"
              transform="rotate(-90 55 55)"
            />
          </g>
        </svg>
        <span>r&nbsp;Made</span>
      </span>

      {showSubhead && (
        <span
          className="inline-flex items-center"
          style={{
            fontFamily: "var(--font-orbitron), sans-serif",
            fontWeight: 500,
            fontSize: `${subSize}px`,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: fg,
            marginTop: "6px",
            gap: "12px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              height: "1px",
              width: `${ruleWidth}px`,
              background: "currentColor",
              opacity: 0.7,
            }}
          />
          <span>Analytics</span>
          <span
            style={{
              display: "inline-block",
              height: "1px",
              width: `${ruleWidth}px`,
              background: "currentColor",
              opacity: 0.7,
            }}
          />
        </span>
      )}
    </span>
  );
}
