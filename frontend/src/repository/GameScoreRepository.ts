import axios from "axios";

import { culcurateGameLevel } from "@/utils/culcurateGameLevel.ts";

export type GetGameScoreType = {
  createdAt: string;
  gameLevel: number;
  gameScore: number;
  id: number;
  user: string;
};

export type PostGameScoreType = {
  gameLevel: number;
  gameMode: string;
  gameScore: number;
  user: string;
};

export const getGameScores = async (
  gameMode: string,
  cardRowsCols: [number, number]
): Promise<GetGameScoreType[]> => {
  const response = await axios.get(`/api/score`, {
    params: {
      gameMode: gameMode,
      gameLevel: culcurateGameLevel(cardRowsCols),
    },
  });
  return response.data;
};

export const postGameScore = async (body: PostGameScoreType) => {
  const response = await axios.post("/api/score", { ...body });
  return response.status;
};
