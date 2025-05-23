import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "@/Layout/ProtectedRoute.tsx";
import { GameMainPage } from "@/pages/GameMainPage.tsx";
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
              <GameMainPage />
            </ProtectedRoute>
          }
          path={"/nervousbreakdown"}
        />
        <Route element={<Test />} path={"/test"} />
      </Routes>
    </BrowserRouter>
  );
};
