interface DestinationTileProps {
  name: string;
  color: string;
  image?: string;
  onClick?: () => void;
}

export default function DestinationTile({ name, color, image, onClick }: DestinationTileProps) {
  return (
    <button
      onClick={onClick}
      className="relative h-[110px] rounded-2xl overflow-hidden bg-cover bg-center text-left"
      style={{ backgroundColor: color, backgroundImage: image ? `url(${image})` : undefined }}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(28,58,46,0.85), transparent 60%)' }}
      />
      <span className="absolute bottom-2.5 left-3 font-serif text-[13px] font-semibold text-white z-10">
        {name}
      </span>
    </button>
  );
}