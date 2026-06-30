function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export default function CircleGauge({
  value,
  max,
  percent,
  color,
  trackColor = 'var(--border-color)',
  strokeWidth = 9,
  size = 120,
  className = '-rotate-90',
  ariaLabel = 'Circular progress indicator',
}) {
  const ratio =
    typeof percent === 'number'
      ? percent
      : typeof value === 'number' && typeof max === 'number' && max > 0
      ? value / max
      : 0

  const normalizedRatio = clamp(ratio, 0, 1)
  const radius = 50 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  const filled = normalizedRatio * circumference

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      <circle cx="50" cy="50" r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${filled} ${circumference}`}
        strokeLinecap="round"
      />
    </svg>
  )
}
