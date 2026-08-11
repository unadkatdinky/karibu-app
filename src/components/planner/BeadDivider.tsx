export default function BeadDivider() {
  return (
    <div
      className="h-[6px] w-full my-6 rounded-full"
      style={{
        backgroundImage:
          'repeating-linear-gradient(90deg, #C4522A 0px, #C4522A 6px, transparent 6px, transparent 11px, #D4A853 11px, #D4A853 17px, transparent 17px, transparent 22px, #2D5A3D 22px, #2D5A3D 28px, transparent 28px, transparent 33px)',
        opacity: 0.55,
      }}
    />
  );
}
