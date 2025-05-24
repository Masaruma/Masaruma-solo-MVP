import axios from "axios";

import { culcGameLevel } from "@/utils/culcGameLevel.ts";

export type GetGameScoreType = {
  createdAt: string;
  elapsedTimeMillis: number;
  gameLevel: number;
  gameScore: number;
  id: number;
  missCount: number;
  user: string;
};

export type PostGameScoreType = {
  elapsedTimeMillis: number;
  gameLevel: number;
  gameMode: string;
  gameScore: number;
  missCount: number;
  user: string;
};

export const getGameScores = async (
  gameMode: string,
  cardRowsCols: [number, number]
): Promise<GetGameScoreType[]> => {
  const response = await axios.get(`/api/score`, {
    params: {
      gameMode: gameMode,
      gameLevel: culcGameLevel(cardRowsCols),
    },
  });
  return response.data;
};

export const postGameScore = async (body: PostGameScoreType) => {
  const response = await axios.post("/api/score", { ...body });
  return response.status;
};
