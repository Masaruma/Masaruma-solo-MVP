import { BrowserRouter, Route, Routes } from "react-router-dom";

import { GameMain } from "@/components/GameMain.tsx";
import { ProtectedRoute } from "@/Layout/ProtectedRoute.tsx";
import { StartPage } from "@/pages/StartPage.tsx";
import { Test } from "@/pages/Test.tsx";

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
