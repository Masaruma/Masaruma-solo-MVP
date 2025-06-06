import { useCallback, useState } from "react";

import { CardImageType, CardsWithMatchKeyType } from "@/pages/GameMainPage.tsx";
import { irasutoyaImages } from "@/utils/irasutoyaImageArray.ts";
const SPRITE_BASE_URL = import.meta.env.VITE_SPRITE_BASE_URL;

// todo ここのテスト作成
export const useInitializeGame = (
  gameMode: string,
  selectedNumberOfCard: number
) => {
  const [cards, setCards] = useState<CardsWithMatchKeyType[]>([]);
  // ?randomな重複なしな数値をもった配列を生成するヘルパー関数 pokemon用
  const randomArray = useCallback(() => {
    const intRandom = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;
    const randoms: number[] = [];
    const min = 1,
      max = 1025;
    const count = selectedNumberOfCard / 2;
    while (randoms.length < count) {
      const tmp = intRandom(min, max);
      if (!randoms.includes(tmp)) randoms.push(tmp);
    }
    return randoms;
  }, [selectedNumberOfCard]);

  const initializeNervousBreakdownCards = useCallback(async () => {
    let images: CardImageType[] = [];
    if (gameMode === "irasutoya") {
      images = irasutoyaImages
        .sort(() => Math.random() - 0.5)
        .slice(0, selectedNumberOfCard / 2);
    } else if (gameMode === "pokemon") {
      const randoms = randomArray();
      let i = 1;
      const loadImages = randoms.map(async (n) => {
        const getPokemonSpriteUrl = (n: number, shinyRate = 0.3) => {
          const isShiny = Math.random() < shinyRate;

          // バリエーション候補を作る
          const candidates = [];

          // 世代ごとに可能なバリエーションを配列に追加
          if (n <= 151) {
            candidates.push(
              `${SPRITE_BASE_URL}/sprites/pokemon/versions/generation-i/yellow/${n}.png`
            );
          }
          if (n <= 251) {
            candidates.push(
              `${SPRITE_BASE_URL}/sprites/pokemon/versions/generation-ii/crystal/${isShiny ? "shiny/" : ""}${n}.png`
            );
          }
          if (n <= 649) {
            candidates.push(
              `${SPRITE_BASE_URL}/sprites/pokemon/versions/generation-v/black-white/animated/${isShiny ? "shiny/" : ""}${n}.gif`
            );
          }
          // 常に通常のスプライトも
          candidates.push(
            `${SPRITE_BASE_URL}/sprites/pokemon/${isShiny ? "shiny/" : ""}${n}.png`
          );

          // 候補からランダムに1つ選ぶ
          return candidates[Math.floor(Math.random() * candidates.length)];
        };
        const pokemonSprite = getPokemonSpriteUrl(n);
        const imgElement = new Image();
        imgElement.src = pokemonSprite;
        await new Promise<void>((resolve) => {
          imgElement.onload = () => {
            images.push({ id: i, img: imgElement.src });
            i++;
            resolve();
          };
        });
      });
      await Promise.all(loadImages);
    }

    // ダブル＆シャッフル
    const doubleImages = [...images, ...images];
    const shuffled = doubleImages
      .map((obj, idx) => ({
        ...obj,
        idx,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
  }, [gameMode, selectedNumberOfCard, randomArray]);

  const initializeGame = useCallback(async () => {
    await initializeNervousBreakdownCards();
  }, [initializeNervousBreakdownCards]);

  return {
    cards,
    initializeGame,
    setCards,
  };
};
