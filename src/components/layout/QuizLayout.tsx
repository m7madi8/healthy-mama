import { Outlet } from "react-router-dom";
import { SiteNav } from "./SiteNav";

export function QuizLayout() {
  return (
    <>
      <SiteNav variant="quiz" />
      <Outlet />
    </>
  );
}
