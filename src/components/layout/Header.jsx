import { ArrowLeft, MoreVertical } from 'lucide-react';

export default function Header({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  transparent = false,
}) {
  return (
    <header
      className={`sticky top-0 z-30 px-4 py-3 flex items-center gap-3 ${
        transparent
          ? 'bg-transparent'
          : 'bg-cream border-b border-cream-dark/40'
      }`}
    >
      {showBack && (
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 border border-gray-100 shadow-sm -ml-1 flex-shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft size={18} className="text-forest" />
        </button>
      )}

      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold text-forest leading-tight truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-gray-500 leading-tight mt-0.5">{subtitle}</p>
        )}
      </div>

      {rightAction && (
        <div className="flex-shrink-0">{rightAction}</div>
      )}
    </header>
  );
}
