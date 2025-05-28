export const calcGameSeconds = (selectedNumberOfCard: number) => {
  if (selectedNumberOfCard < 4) return 10;
  return 10 + ((selectedNumberOfCard - 4) / 2) * 10;
};

export const calcAllowMissCount = (selectedNumberOfCard: number) => {
  return selectedNumberOfCard / 2;
};

export const calcGridTemplateColumns = (selectedNumberOfCard: number) => {
  let gridTemplateColumns: number;

  if (selectedNumberOfCard === 4) {
    gridTemplateColumns = 2;
  } else if (selectedNumberOfCard <= 12) {
    gridTemplateColumns = 3;
  } else if (selectedNumberOfCard <= 20) {
    gridTemplateColumns = 4;
  } else if (selectedNumberOfCard <= 30) {
    gridTemplateColumns = 5;
  } else if (selectedNumberOfCard <= 36) {
    gridTemplateColumns = 6;
  } else if (selectedNumberOfCard <= 49) {
    gridTemplateColumns = 7;
  } else if (selectedNumberOfCard <= 56) {
    gridTemplateColumns = 8;
  } else if (selectedNumberOfCard <= 63) {
    gridTemplateColumns = 9;
  } else {
    gridTemplateColumns = 10;
  }

  return gridTemplateColumns;
};
