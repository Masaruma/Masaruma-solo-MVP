import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { GameModeType } from "@/pages/StartPage.tsx";
import * as GameScoreRepository from "@/repository/GameScoreRepository.ts";
import { GetGameScoreType } from "@/repository/GameScoreRepository.ts";

interface RankingProps {
  gameLevelId: number;
  gameMode: GameModeType;
  selectedNumberOfCard: number;
}
export const Ranking = ({
  gameLevelId,
  gameMode,
  selectedNumberOfCard,
}: RankingProps) => {
  const [getGameScores, setGetGameScores] = useState<GetGameScoreType[]>([]);

  useEffect(() => {
    void (async () => {
      const getScoreResult = await GameScoreRepository.getGameScores(
        gameMode === "irasutoya" ? 1 : 2,
        selectedNumberOfCard,
        gameLevelId
      );
      setGetGameScores(getScoreResult);
    })();
  }, [selectedNumberOfCard, gameMode, gameLevelId]);

  return (
    <div
      className={`
        grid w-full
        [&>div]:max-h-[300px] [&>div]:rounded [&>div]:border
      `}
    >
      <Table>
        <TableHeader>
          <TableRow
            className={`
              bg-background sticky top-0
              after:bg-border after:absolute after:inset-x-0 after:bottom-0
              after:h-px after:content-['']
              [&>*]:whitespace-nowrap
            `}
          >
            <TableHead className={"pl-2"}>No</TableHead>
            <TableHead>日付</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>time</TableHead>
            <TableHead>miss</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={"overflow-hidden"}>
          {getGameScores.map((getGameScore, tableIndex) => (
            <TableRow
              className={`
                odd:bg-muted/50
                [&>*]:whitespace-nowrap
              `}
              key={getGameScore.id}
            >
              <TableCell className={"pl-2"}>{tableIndex + 1}</TableCell>
              <TableCell className={"font-medium"}>
                {new Date(getGameScore.createdAt).toLocaleDateString("ja-JP", {
                  year: "2-digit",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </TableCell>
              <TableCell>{getGameScore.user}</TableCell>
              <TableCell>{getGameScore.elapsedTimeMillis / 1000}秒</TableCell>
              <TableCell>{getGameScore.missCount}ミス</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
