import { Outlet } from "react-router-dom";
import { EditorialShell } from "../editorial/EditorialShell";
import { SiteNav } from "./SiteNav";

export function QuizLayout() {
  return (
    <EditorialShell calm>
      <SiteNav variant="quiz" />
      <Outlet />
    </EditorialShell>
  );
}
