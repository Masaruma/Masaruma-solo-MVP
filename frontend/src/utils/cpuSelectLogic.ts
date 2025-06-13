import { CardsWithMatchKeyType } from "@/pages/GameMainPage.tsx";

export const randomSelectLogic = (chosenCards: CardsWithMatchKeyType[]) => {
  return chosenCards[Math.floor(Math.random() * chosenCards.length)];
};
