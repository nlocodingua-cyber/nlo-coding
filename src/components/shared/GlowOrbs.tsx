/**
 * Ambient glow orbs — pure SSR/CSS, no client needed.
 * Three circular blur gradients positioned at different depths.
 */
export function GlowOrbs() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: "40vw",
          height: "40vw",
          left: "-10vw",
          top: "-10vh",
          background: "radial-gradient(circle, rgba(0,240,255,0.12) 0%, rgba(0,240,255,0) 70%)",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: "45vw",
          height: "45vw",
          right: "-15vw",
          top: "20vh",
          background: "radial-gradient(circle, rgba(124,58,237,0.14) 0%, rgba(124,58,237,0) 70%)",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: "35vw",
          height: "35vw",
          left: "25vw",
          bottom: "-10vh",
          background: "radial-gradient(circle, rgba(236,72,153,0.08) 0%, rgba(236,72,153,0) 70%)",
        }}
      />
    </div>
  );
}
