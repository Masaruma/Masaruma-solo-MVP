import { BrowserRouter, Route, Routes } from "react-router-dom";

import { NervousbreakdownPage } from "@/pages/NervousbreakdownPage.tsx";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NervousbreakdownPage />} path={"/"} />
      </Routes>
    </BrowserRouter>
  );
};
