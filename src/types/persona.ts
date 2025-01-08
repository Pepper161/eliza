// src/types/persona.ts
export type Persona = {
    name: string;
    role: string;
    tone: 'professional' | 'friendly' | 'playful';
    traits: string[];
    language: string;
  };
  
  // src/lib/personas.ts
  export const defaultPersona: Persona = {
    name: 'Eliza',
    role: 'AI Assistant',
    tone: 'professional',
    traits: ['helpful', 'knowledgeable', 'empathetic'],
    language: 'Japanese'
  };
  