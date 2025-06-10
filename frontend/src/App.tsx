import { Route, Routes } from "react-router-dom";

import { GameSoundProvider } from "@/Layout/GameSoundProvider.tsx";
import { MusicLayout } from "@/Layout/MusicLayout.tsx";
import { ProtectedRoute } from "@/Layout/ProtectedRoute.tsx";
import { GameMainPage } from "@/pages/GameMainPage.tsx";
import { StartPage } from "@/pages/StartPage.tsx";
import "@/App.css";

export const App = () => {
  return (
    <GameSoundProvider>
      <MusicLayout>
        <Routes>
          <Route element={<StartPage />} path={"/"} />
          <Route
            element={
              <ProtectedRoute>
                <GameMainPage />
              </ProtectedRoute>
            }
            path={"/nervousbreakdown"}
          />
        </Routes>
      </MusicLayout>
    </GameSoundProvider>
  );
};
//カードはリセットされる。
//クリア判定 ミス回数 手数 時間 ゲームオーバー判定
