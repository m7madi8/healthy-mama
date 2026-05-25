import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PageViewPing } from "./components/analytics/PageViewPing";
import { RequireAuth } from "./components/auth/RequireAuth";
import { RequirePurchase } from "./components/auth/RequirePurchase";
import { PublicLayout } from "./components/layout/PublicLayout";
import { QuizLayout } from "./components/layout/QuizLayout";
import { AdminPage } from "./pages/AdminPage";
import { BookPage } from "./pages/BookPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { LibraryPage } from "./pages/LibraryPage";
import { QuizPage } from "./pages/QuizPage";
import { ReaderPage } from "./pages/ReaderPage";
import { ThankYouPage } from "./pages/ThankYouPage";
import { BookPreviewPage } from "./pages/BookPreviewPage";

export default function App() {
  useEffect(() => {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
  }, []);

  return (
    <>
      <PageViewPing />
    <Routes>
      <Route path="quiz" element={<QuizLayout />}>
        <Route index element={<QuizPage />} />
      </Route>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="books/:slug" element={<BookPage />} />
        {import.meta.env.DEV ? <Route path="preview/:bookId" element={<BookPreviewPage />} /> : null}
        <Route path="thank-you" element={<ThankYouPage />} />
        <Route
          path="dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="library"
          element={
            <RequireAuth>
              <LibraryPage />
            </RequireAuth>
          }
        />
        <Route
          path="reader/:bookId"
          element={
            <RequireAuth>
              <RequirePurchase>
                <ReaderPage />
              </RequirePurchase>
            </RequireAuth>
          }
        />
      </Route>
      <Route path="admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}
