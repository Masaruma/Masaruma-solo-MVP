import axios from "axios";

export type GetGameScoreType = {
  createdAt: string;
  elapsedTimeMillis: number;
  gameScore: number;
  id: number;
  missCount: number;
  numberOfCard: number;
  user: string;
};

export type PostGameScoreType = {
  elapsedTimeMillis: number;
  gameLevelId: number;
  gameModeId: number;
  gameScore: number;
  missCount: number;
  numberOfCard: number;
  user: string;
};

export const getGameScores = async (
  gameModeId: number,
  selectedNumberOfCard: number,
  gameLevelId: number
): Promise<GetGameScoreType[]> => {
  const response = await axios.get(`/api/score`, {
    params: {
      gameModeId: gameModeId,
      numberOfCard: selectedNumberOfCard,
      gameLevelId: gameLevelId,
    },
  });
  return response.data;
};

export const postGameScore = async (body: PostGameScoreType) => {
  const response = await axios.post("/api/score", { ...body });
  return response.status;
};
