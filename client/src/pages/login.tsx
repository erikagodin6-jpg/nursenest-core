import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { Mail, Lock, User, Ticket, Gift } from "lucide-react";
import { logoOnly } from "@/lib/theme-logos";
import { trackEvent } from "@/lib/analytics";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { login, register, forgotPassword } = useAuth();
  const { toast } = useToast();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const refCodeFromUrl = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref") || "";
    if (ref) {
      sessionStorage.setItem("nursenest-ref", ref);
      return ref;
    }
    return sessionStorage.getItem("nursenest-ref") || "";
  }, []);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await login(fd.get("username") as string, fd.get("password") as string);
      trackEvent("login_success");
      toast({ title: t("login.welcomeBack") });
      navigate("/lessons");
    } catch (err: any) {
      trackEvent("login_failure");
      toast({ title: t("login.loginFailed"), description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const refCode = (fd.get("referralCode") as string) || refCodeFromUrl || undefined;
      await register(fd.get("username") as string, fd.get("password") as string, fd.get("email") as string, (fd.get("inviteCode") as string) || undefined, refCode);
      toast({ title: t("login.accountCreated") });
      navigate("/lessons");
    } catch (err: any) {
      toast({ title: t("login.registrationFailed"), description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgotPassword() {
    setShowForgotPassword(true);
  }

  async function handleForgotSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPassword(forgotEmail);
      setForgotSent(true);
      toast({ title: "Reset link sent", description: "Check your email for a password reset link." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: "var(--theme-page-bg)", color: "var(--theme-heading-text)" }}>
      <Navigation />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card
          className="w-full max-w-md border shadow-xl overflow-hidden"
          style={{
            background: "var(--theme-card-bg)",
            borderColor: "var(--theme-card-border)",
          }}
          data-testid="card-auth"
        >
          <CardContent className="pt-8 pb-8 px-8">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <img
                  src={logoOnly}
                  alt="NurseNest"
                  className="h-16 w-16 object-contain"
                  data-testid="img-auth-logo"
                />
              </div>
              <h1
                className="text-2xl font-bold tracking-tight"
                style={{ color: "var(--theme-heading-text)" }}
                data-testid="text-auth-title"
              >
                {showForgotPassword ? "Reset Password" : (activeTab === "login" ? t("login.welcome") : t("login.signupTitle"))}
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--theme-muted-text)" }}
                data-testid="text-auth-subtitle"
              >
                {showForgotPassword
                  ? "Enter your email to receive a reset link"
                  : (activeTab === "login"
                    ? t("login.welcomeSubtitle")
                    : t("login.signupSubtitle"))}
              </p>
            </div>

            {showForgotPassword ? (
              <div className="space-y-4">
                {forgotSent ? (
                  <div className="text-center space-y-4" data-testid="text-forgot-success">
                    <p className="text-sm" style={{ color: "var(--theme-body-text)" }}>
                      If an account exists with that email, we've sent a password reset link. Please check your inbox.
                    </p>
                    <Button
                      onClick={() => { setShowForgotPassword(false); setForgotSent(false); setForgotEmail(""); }}
                      className="w-full rounded-full"
                      style={{ background: "var(--theme-primary)", color: "var(--theme-primary-foreground)" }}
                      data-testid="button-back-to-login"
                    >
                      Back to Login
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email" style={{ color: "var(--theme-heading-text)" }}>Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4" style={{ color: "var(--theme-muted-text)" }} />
                        <Input
                          id="forgot-email"
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="pl-10 auth-input"
                          required
                          data-testid="input-forgot-email"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full rounded-full shadow-md"
                      style={{ background: "var(--theme-primary)", color: "var(--theme-primary-foreground)" }}
                      disabled={isLoading}
                      data-testid="button-send-reset"
                    >
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                    <p className="text-center text-xs" style={{ color: "var(--theme-muted-text)" }}>
                      <a
                        href="mailto:support@nursenest.ca?subject=NurseNest%20account%20recovery%20-%20forgot%20email"
                        className="font-medium hover:underline"
                        style={{ color: "var(--theme-primary)" }}
                        data-testid="link-forgot-email-from-reset"
                      >
                        {t("login.forgotEmailHelp")}
                      </a>
                      {" · "}
                      {t("login.forgotEmailHelpTitle")}
                    </p>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => { setShowForgotPassword(false); setForgotEmail(""); }}
                        className="text-sm font-medium hover:underline"
                        style={{ color: "var(--theme-primary)" }}
                        data-testid="link-back-to-login"
                      >
                        Back to Login
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (

            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList
                className="grid w-full grid-cols-2 mb-6 rounded-full p-1"
                style={{
                  background: "var(--theme-secondary)",
                }}
              >
                <TabsTrigger
                  value="login"
                  data-testid="tab-login"
                  className="rounded-full text-sm font-medium transition-all data-[state=active]:shadow-sm"
                  style={{
                    color: activeTab === "login" ? "var(--theme-primary-foreground)" : "var(--theme-body-text)",
                    background: activeTab === "login" ? "var(--theme-primary)" : "transparent",
                  }}
                >
                  {t("login.signIn")}
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  data-testid="tab-register"
                  className="rounded-full text-sm font-medium transition-all data-[state=active]:shadow-sm"
                  style={{
                    color: activeTab === "register" ? "var(--theme-primary-foreground)" : "var(--theme-body-text)",
                    background: activeTab === "register" ? "var(--theme-primary)" : "transparent",
                  }}
                >
                  {t("login.createAccount")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username" style={{ color: "var(--theme-heading-text)" }}>Username or Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4" style={{ color: "var(--theme-muted-text)" }} />
                      <Input
                        id="login-username"
                        name="username"
                        placeholder="Enter username or email"
                        className="pl-10 auth-input"
                        required
                        data-testid="input-login-username"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" style={{ color: "var(--theme-heading-text)" }}>{t("login.password")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4" style={{ color: "var(--theme-muted-text)" }} />
                      <Input
                        id="login-password"
                        name="password"
                        type="password"
                        placeholder={t("login.passwordPlaceholder")}
                        className="pl-10 auth-input"
                        required
                        data-testid="input-login-password"
                      />
                    </div>
                    <div className="text-right space-y-1">
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs font-medium hover:underline transition-colors block w-full"
                        style={{ color: "var(--theme-primary)" }}
                        data-testid="link-forgot-password"
                      >
                        {t("login.forgotPassword")}
                      </button>
                      <a
                        href="mailto:support@nursenest.ca?subject=NurseNest%20account%20recovery%20-%20forgot%20email"
                        className="text-xs font-medium hover:underline transition-colors inline-block"
                        style={{ color: "var(--theme-muted-text)" }}
                        data-testid="link-forgot-email-help"
                      >
                        {t("login.forgotEmailHelp")}
                      </a>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-full shadow-md hover:shadow-lg transition-shadow"
                    style={{
                      background: "var(--theme-primary)",
                      color: "var(--theme-primary-foreground)",
                      borderColor: "var(--theme-primary)",
                    }}
                    disabled={isLoading}
                    data-testid="button-login"
                  >
                    {isLoading ? t("login.signingIn") : t("login.signIn")}
                  </Button>
                  <div className="text-center mt-4 pt-4" style={{ borderTop: "1px solid var(--theme-border)" }}>
                    <p className="text-sm" style={{ color: "var(--theme-body-text)" }}>
                      {t("login.noAccount")}{" "}
                      <button
                        type="button"
                        className="font-semibold border-none bg-transparent cursor-pointer hover:underline underline-offset-2"
                        style={{ color: "var(--theme-primary)" }}
                        onClick={() => setActiveTab("register")}
                        data-testid="link-signup-footer"
                      >
                        {t("login.signUpNow")}
                      </button>
                    </p>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-username" style={{ color: "var(--theme-heading-text)" }}>{t("login.username")}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4" style={{ color: "var(--theme-muted-text)" }} />
                      <Input id="reg-username" name="username" placeholder={t("login.chooseUsername")} className="pl-10 auth-input" required data-testid="input-register-username" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email" style={{ color: "var(--theme-heading-text)" }}>{t("login.email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4" style={{ color: "var(--theme-muted-text)" }} />
                      <Input id="reg-email" name="email" type="email" placeholder={t("login.emailPlaceholder")} className="pl-10 auth-input" required data-testid="input-register-email" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password" style={{ color: "var(--theme-heading-text)" }}>{t("login.password")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4" style={{ color: "var(--theme-muted-text)" }} />
                      <Input id="reg-password" name="password" type="password" placeholder={t("login.createPassword")} className="pl-10 auth-input" required data-testid="input-register-password" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-invite" className="text-xs" style={{ color: "var(--theme-muted-text)" }}>{t("pages.login.inviteCodeOptional")}</Label>
                    <div className="relative">
                      <Ticket className="absolute left-3 top-3 w-4 h-4" style={{ color: "var(--theme-muted-text)" }} />
                      <Input id="reg-invite" name="inviteCode" placeholder={t("pages.login.enterBetaInviteCode")} className="pl-10 auth-input" data-testid="input-register-invite-code" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-referral" className="text-xs" style={{ color: "var(--theme-muted-text)" }}>{t("pages.login.referralCodeOptional")}</Label>
                    <div className="relative">
                      <Gift className="absolute left-3 top-3 w-4 h-4" style={{ color: "var(--theme-muted-text)" }} />
                      <Input id="reg-referral" name="referralCode" placeholder={t("pages.login.nnrefxxxxxx")} defaultValue={refCodeFromUrl} className="pl-10 auth-input" data-testid="input-register-referral-code" />
                    </div>
                    {refCodeFromUrl && (
                      <p className="text-xs font-medium" style={{ color: "var(--theme-primary)" }}>{t("pages.login.referralCodeAppliedYoullGet")}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-full shadow-md hover:shadow-lg transition-shadow"
                    style={{
                      background: "var(--theme-primary)",
                      color: "var(--theme-primary-foreground)",
                      borderColor: "var(--theme-primary)",
                    }}
                    disabled={isLoading}
                    data-testid="button-register"
                  >
                    {isLoading ? t("login.creatingAccount") : t("login.createAccount")}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
