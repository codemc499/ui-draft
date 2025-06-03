import React from 'react';

interface ChatButtonProps {
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left';
  label?: string;
  hasUnread?: boolean;
}

export default function ChatButton({
  onClick,
  position = 'bottom-right',
  label = 'Chat',
  hasUnread = false,
}: ChatButtonProps) {
  const positionClass = position === 'bottom-right'
    ? 'bottom-4 right-4'
    : 'bottom-4 left-4';

  return (
    <button
      onClick={onClick}
      className={`fixed ${positionClass} z-50 flex items-center space-x-2 rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 shadow-lg transition-all duration-300`}
    >
      <span>{label}</span>
      {hasUnread && (
        <span className="flex h-3 w-3">
          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
          <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
        </span>
      )}
    </button>
  );
} 