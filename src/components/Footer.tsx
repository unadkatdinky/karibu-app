export default function Footer() {
  return (
    <footer className="bg-green-deep text-cream py-12 px-6 md:px-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Left: Branding */}
        <div className="text-center md:text-left">
          <h3 className="font-serif text-[28px] font-semibold tracking-wide mb-1 text-cream">
            Karibu <span className="font-sans text-[22px]">🇹🇿</span>
          </h3>
          <p className="text-[11px] text-green-light uppercase tracking-wider">
            East Africa, through the eyes of someone who grew up there
          </p>
        </div>

        {/* Center: Links */}
        <div className="flex gap-8 text-[12px] uppercase font-medium tracking-widest">
          <a href="#" className="text-green-light hover:text-gold transition-colors">GitHub</a>
          <a href="#" className="text-green-light hover:text-gold transition-colors">LinkedIn</a>
          <a href="#" className="text-green-light hover:text-gold transition-colors">Contact</a>
        </div>

        {/* Right: Credits */}
        <div className="text-center md:text-right text-[11px] text-green-light/60 leading-relaxed tracking-wide">
          Built with React, Go & 17 years of memories<br/>
          by <span className="text-cream font-medium">Dinky Unadkat</span>
        </div>

      </div>
    </footer>
  );
}