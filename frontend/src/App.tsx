import { BrowserRouter, Route, Routes } from "react-router-dom";

import { NervousBreakdownPage } from "@/pages/NervousBreakdownPage.tsx";
import { Test } from "@/pages/Test.tsx";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NervousBreakdownPage />} path={"/"} />
        <Route element={<Test />} path={"/test"} />
      </Routes>
    </BrowserRouter>
  );
};
