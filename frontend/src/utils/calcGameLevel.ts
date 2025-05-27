export const calcGameLevel = (cardRowsCols: [number, number]): number =>
  cardRowsCols[0] * cardRowsCols[1];

export const calcGameSeconds = (cardRowsCols: [number, number]) => {
  const numCards = cardRowsCols[0] * cardRowsCols[1];
  if (numCards < 4) return 10;
  return 10 + ((numCards - 4) / 2) * 10;
};

export const calcAllowMissCount = (cardRowsCols: [number, number]) => {
  const numCards = cardRowsCols[0] * cardRowsCols[1];
  return numCards / 2;
};
