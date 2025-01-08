// src/components/PersonaSelector.tsx
'use client';

import { useState } from 'react';
import { defaultPersona, Persona } from '../types/persona';

export default function PersonaSelector({
  onSelect
}: {
  onSelect: (persona: Persona) => void;
}) {
  const [selectedTone, setSelectedTone] = useState<Persona['tone']>('professional');

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">AIペルソナ設定</h3>
      <select 
        value={selectedTone}
        onChange={(e) => {
          const tone = e.target.value as Persona['tone'];
          setSelectedTone(tone);
          onSelect({
            ...defaultPersona,
            tone
          });
        }}
        className="w-full p-2 border rounded"
      >
        <option value="professional">プロフェッショナル</option>
        <option value="friendly">フレンドリー</option>
        <option value="playful">カジュアル</option>
      </select>
    </div>
  );
}
