import { Item } from '../types';

export function calculateMatchScore(lostItem: Item, foundItem: Item): number {
  if (lostItem.category !== foundItem.category) return 0;

  let score = 40; // Misma categoría da 40 pts iniciales

  // Coincidencia de ubicación (subcadena o exacta)
  const loc1 = lostItem.location.toLowerCase().trim();
  const loc2 = foundItem.location.toLowerCase().trim();
  if (loc1 === loc2 || loc1.includes(loc2) || loc2.includes(loc1)) {
    score += 30;
  }

  // Coincidencia de palabras clave en título y descripción
  const text1 = `${lostItem.title} ${lostItem.description}`.toLowerCase();
  const text2 = `${foundItem.title} ${foundItem.description}`.toLowerCase();

  const words1 = text1.split(/\s+/).filter(w => w.length > 3);
  const words2 = new Set(text2.split(/\s+/).filter(w => w.length > 3));

  let matchedWords = 0;
  words1.forEach(word => {
    if (words2.has(word)) matchedWords++;
  });

  if (words1.length > 0) {
    const keywordScore = Math.min(30, Math.round((matchedWords / words1.length) * 30));
    score += keywordScore;
  }

  return score;
}
