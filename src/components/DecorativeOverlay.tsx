export function DecorativeOverlay() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:42px_42px] opacity-20" />
      <div className="pointer-events-none absolute inset-0 panel-grid opacity-20" />
      <div className="hazard-band pointer-events-none absolute inset-x-0 top-0 h-8 opacity-80" />
      <div className="scanlines pointer-events-none absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,90,31,.2),transparent_35%),radial-gradient(circle_at_80%_100%,rgba(255,69,56,.18),transparent_32%),radial-gradient(circle_at_10%_100%,rgba(124,255,136,.12),transparent_28%)]" />
    </>
  )
}
