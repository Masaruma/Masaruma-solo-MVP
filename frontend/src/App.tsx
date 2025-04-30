import { BrowserRouter, Route, Routes } from "react-router-dom";

import { NervousBreakdownPage } from "@/pages/NervousBreakdownPage.tsx";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NervousBreakdownPage />} path={"/"} />
      </Routes>
    </BrowserRouter>
  );
};
