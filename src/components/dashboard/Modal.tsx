import { useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string; // e.g. 'max-w-2xl' — defaults to a size that fits most forms
}

// A generic modal shell: dimmed backdrop, centered card, closes on Escape or
// backdrop click. Content (the form, its own header actions, etc.) is
// entirely up to the caller — this component only owns the "is it open,
// how do you close it" mechanics.
export default function Modal({ open, onClose, title, subtitle, children, maxWidth = 'max-w-3xl' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    // Prevent the page behind the modal from scrolling while it's open.
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-[6vh]"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)]`}
        onClick={(e) => e.stopPropagation()} // don't close when clicking inside the card
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#EEEDE6]">
          <div>
            <p className="text-[15px] font-semibold text-[#1A1A1A]">{title}</p>
            {subtitle && <p className="text-[12.5px] text-[#9A9890] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#9A9890] hover:bg-[#FAFAF7] hover:text-[#1A1A1A] transition-colors text-[18px]"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}