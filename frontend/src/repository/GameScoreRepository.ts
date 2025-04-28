import axios from "axios";

export type GetGameScoreType = {
  createdAt: string;
  gameScore: number;
  id: number;
  user: string;
};

export type PostGameScoreType = {
  gameMode: string;
  gameScore: number;
  user: string;
};

export const getGameScores = async (
  gameMode: string
): Promise<GetGameScoreType[]> => {
  const response = await axios.get(`/api/score/${gameMode}`);
  return response.data;
};

export const postGameScore = async (body: PostGameScoreType) => {
  const response = await axios.post("/api/score", { ...body });
  return response.status;
};
