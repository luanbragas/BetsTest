import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import type { AuthState, ToastState } from "./types";

const sessionKey = "wilili.session";

function App() {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    const saved = localStorage.getItem(sessionKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as AuthState;
      if (parsed.session?.access_token) setAuth(parsed);
    } catch {
      localStorage.removeItem(sessionKey);
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function handleAuth(nextAuth: AuthState, remember: boolean) {
    setAuth(nextAuth);
    if (remember) localStorage.setItem(sessionKey, JSON.stringify(nextAuth));
    else localStorage.removeItem(sessionKey);
  }

  function logout() {
    localStorage.removeItem(sessionKey);
    setAuth(null);
  }

  return (
    <>
      {toast && (
        <div
          className={`fixed left-4 right-4 top-4 z-50 rounded-lg border px-4 py-3 text-sm shadow-premium sm:left-auto sm:max-w-sm ${
            toast.type === "error" ? "border-danger/30 bg-danger/15 text-white" : "border-gain/30 bg-panel text-slate-100"
          }`}
        >
          {toast.message}
        </div>
      )}

      {auth ? (
        <DashboardPage auth={auth} onLogout={logout} onToast={setToast} />
      ) : (
        <AuthPage onAuth={handleAuth} onToast={setToast} />
      )}
    </>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
