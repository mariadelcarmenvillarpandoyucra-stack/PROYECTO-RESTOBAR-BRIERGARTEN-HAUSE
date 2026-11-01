import type { ReactNode } from "react";
import { Icon } from "../../lib/icons";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  widthClass?: string;
}

export function Modal({ title, onClose, children, widthClass = "max-w-md" }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/65 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`card w-full ${widthClass} max-h-[88vh] overflow-y-auto p-5`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg text-cream">{title}</h3>
          <button className="text-cream-dim hover:text-cream p-1" onClick={onClose} aria-label="Cerrar">
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
