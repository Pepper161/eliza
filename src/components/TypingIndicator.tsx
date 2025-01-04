'use client';

import { useEffect, useState } from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 text-gray-500 text-sm p-2">
      <div className="flex gap-1">
        <span className="typing-dot animate-bounce">.</span>
        <span className="typing-dot animate-bounce delay-100">.</span>
        <span className="typing-dot animate-bounce delay-200">.</span>
      </div>
      <span>相手が入力中です</span>
    </div>
  );
}
