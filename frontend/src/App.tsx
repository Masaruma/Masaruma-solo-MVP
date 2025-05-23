import { BrowserRouter, Route, Routes } from "react-router-dom";

import { StartPage } from "@/pages/StartPage.tsx";
import { Test } from "@/pages/Test.tsx";
import { GameMain } from "@/components/GameMain.tsx";
import { ProtectedRoute } from "@/Layout/ProtectedRoute.tsx";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<StartPage />} path={"/"} />
        <Route
          element={
            <ProtectedRoute>
              <GameMain />
            </ProtectedRoute>
          }
          path={"/nervousbreakdown"}
        />
        <Route element={<Test />} path={"/test"} />
      </Routes>
    </BrowserRouter>
  );
};
