import { Route, Routes, useLocation } from "react-router-dom";

import { ProtectedRoute } from "@/Layout/ProtectedRoute.tsx";
import { GameMainPage } from "@/pages/GameMainPage.tsx";
import { StartPage } from "@/pages/StartPage.tsx";
import "@/App.css";
import { GameSoundProvider } from "@/Layout/GameSoundProvider.tsx";

const GameMainPageWithKey = () => {
  const location = useLocation();
  return (
    <ProtectedRoute>
      <GameMainPage key={location.key} />
    </ProtectedRoute>
  );
};
export const App = () => {
  return (
    <GameSoundProvider>
      <Routes>
        <Route element={<StartPage />} path={"/"} />
        <Route element={<GameMainPageWithKey />} path={"/nervousbreakdown"} />
      </Routes>
    </GameSoundProvider>
  );
};
