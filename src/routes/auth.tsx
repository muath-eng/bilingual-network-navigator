import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "حساب الطالب — Network Master" },
      { name: "description", content: "إنشاء حساب طالب أو تسجيل الدخول إلى Network Master." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError) setError(sessionError.message);
      setSignedInEmail(data.session?.user.email ?? null);
      setCheckingSession(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setSignedInEmail(session?.user.email ?? null);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { display_name: name.trim() },
            emailRedirectTo: `${window.location.origin}/auth`,
          },
        });
        if (authError) throw authError;
        if (data.session) {
          await navigate({ to: "/profile" });
        } else {
          setNotice(
            t(
              "تم إنشاء الحساب مبدئياً. افتح بريدك الإلكتروني واضغط رابط التأكيد، ثم سجّل الدخول.",
              "Your account was created. Check your email and confirm the link, then sign in.",
            ),
          );
          setMode("signin");
          setPassword("");
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;
        await navigate({ to: "/profile" });
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : t(
              "تعذر إكمال العملية. حاول مرة أخرى.",
              "Could not complete the request. Please try again.",
            ),
      );
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.signOut();
    if (authError) setError(authError.message);
    setLoading(false);
  };

  if (checkingSession) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-4">
        <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
        <span className="ms-2 text-sm text-muted-foreground">
          {t("جارٍ التحقق من الجلسة...", "Checking session...")}
        </span>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center px-4 py-10">
      <section className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LockKeyhole className="h-6 w-6" />
        </div>
        {signedInEmail ? (
          <>
            <h1 className="font-display text-2xl font-bold">
              {t("أنت مسجّل الدخول", "You are signed in")}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">{signedInEmail}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/profile"
                className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                {t("الانتقال إلى ملفي", "Open my profile")}
              </Link>
              <button
                onClick={() => void signOut()}
                disabled={loading}
                className="rounded-lg border border-border px-4 py-3 text-sm font-semibold disabled:opacity-60"
              >
                {t("تسجيل الخروج", "Sign out")}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="font-mono text-xs tracking-widest text-primary">
              NETWORK MASTER / ACCOUNT
            </p>
            <h1 className="mt-3 font-display text-2xl font-bold">
              {mode === "signin"
                ? t("مرحباً بعودتك", "Welcome back")
                : t("أنشئ حساب الطالب", "Create your learner account")}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t(
                "سجّل الدخول لحفظ ملفك التعليمي وتقدمك ومزامنتهما بين أجهزتك.",
                "Sign in to save your learner profile and progress and sync them across devices.",
              )}
            </p>
            <div className="mt-6 grid grid-cols-2 rounded-lg bg-secondary p-1 text-sm">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError("");
                  setNotice("");
                }}
                className={`rounded-md px-3 py-2 font-medium transition ${mode === "signin" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              >
                {t("تسجيل الدخول", "Sign in")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError("");
                  setNotice("");
                }}
                className={`rounded-md px-3 py-2 font-medium transition ${mode === "signup" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              >
                {t("إنشاء حساب", "Create account")}
              </button>
            </div>
            <form onSubmit={submit} className="mt-6 space-y-4">
              {mode === "signup" && (
                <label className="block text-sm font-medium">
                  {t("الاسم", "Display name")}
                  <span className="relative mt-2 block">
                    <UserRound className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value.slice(0, 60))}
                      required
                      maxLength={60}
                      autoComplete="name"
                      className="w-full rounded-lg border border-input bg-background py-3 pe-3 ps-10"
                      placeholder={t("اسمك", "Your name")}
                    />
                  </span>
                </label>
              )}
              <label className="block text-sm font-medium">
                {t("البريد الإلكتروني", "Email address")}
                <span className="relative mt-2 block">
                  <Mail className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="email"
                    className="w-full rounded-lg border border-input bg-background py-3 pe-3 ps-10"
                    placeholder="name@example.com"
                    dir="ltr"
                  />
                </span>
              </label>
              <label className="block text-sm font-medium">
                {t("كلمة المرور", "Password")}
                <span className="relative mt-2 block">
                  <LockKeyhole className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={6}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    className="w-full rounded-lg border border-input bg-background py-3 pe-3 ps-10"
                    placeholder={t("6 أحرف على الأقل", "At least 6 characters")}
                    dir="ltr"
                  />
                </span>
              </label>
              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                >
                  {error}
                </p>
              )}
              {notice && (
                <p
                  role="status"
                  className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm text-foreground"
                >
                  {notice}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {mode === "signin"
                  ? t("دخول إلى حسابي", "Sign in to my account")
                  : t("إنشاء حساب الطالب", "Create learner account")}
                {!loading && <ArrowLeft className="h-4 w-4" />}
              </button>
            </form>
          </>
        )}
        {error && signedInEmail && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
          >
            {error}
          </p>
        )}
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {t("العودة للرئيسية", "Back to home")}
        </Link>
      </section>
    </main>
  );
}
