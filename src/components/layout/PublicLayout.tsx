import { Outlet } from "react-router-dom";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";
import { ScrollToHash } from "./ScrollToHash";

export function PublicLayout() {
  return (
    <>
      <ScrollToHash />
      <SiteNav variant="full" />
      <Outlet />
      <SiteFooter />
    </>
  );
}
