import { useState } from "react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";
import { logoOnly } from "@/lib/theme-logos";

export default function ResetPasswordPage() {
  const [, navigate] = useLocation();
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token") || "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newPassword = fd.get("password") as string;
    const confirmPassword = fd.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }

    if (newPassword.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
      toast({ title: "Password reset successfully" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col font-sans" style={{ background: "var(--theme-page-bg)", color: "var(--theme-heading-text)" }}>
        <Navigation />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md" style={{ background: "var(--theme-card-bg)", borderColor: "var(--theme-card-border)" }} data-testid="card-reset-invalid">
            <CardContent className="pt-8 pb-8 px-8 text-center">
              <p style={{ color: "var(--theme-body-text)" }} data-testid="text-invalid-token">Invalid or missing reset token. Please request a new password reset.</p>
              <Button onClick={() => navigate("/login")} className="mt-4 rounded-full" style={{ background: "var(--theme-primary)", color: "var(--theme-primary-foreground)" }} data-testid="button-go-login">
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: "var(--theme-page-bg)", color: "var(--theme-heading-text)" }}>
      <Navigation />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border shadow-xl" style={{ background: "var(--theme-card-bg)", borderColor: "var(--theme-card-border)" }} data-testid="card-reset-password">
          <CardContent className="pt-8 pb-8 px-8">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <img src={logoOnly} alt="NurseNest" className="h-16 w-16 object-contain" data-testid="img-reset-logo" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--theme-heading-text)" }} data-testid="text-reset-title">
                {success ? "Password Reset" : "Set New Password"}
              </h1>
            </div>

            {success ? (
              <div className="text-center space-y-4" data-testid="text-reset-success">
                <p className="text-sm" style={{ color: "var(--theme-body-text)" }}>
                  Your password has been reset successfully. You can now log in with your new password.
                </p>
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full rounded-full"
                  style={{ background: "var(--theme-primary)", color: "var(--theme-primary-foreground)" }}
                  data-testid="button-login-after-reset"
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-password" style={{ color: "var(--theme-heading-text)" }}>New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4" style={{ color: "var(--theme-muted-text)" }} />
                    <Input id="reset-password" name="password" type="password" placeholder="Enter new password" className="pl-10 auth-input" required minLength={6} data-testid="input-reset-password" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reset-confirm" style={{ color: "var(--theme-heading-text)" }}>Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4" style={{ color: "var(--theme-muted-text)" }} />
                    <Input id="reset-confirm" name="confirmPassword" type="password" placeholder="Confirm new password" className="pl-10 auth-input" required minLength={6} data-testid="input-reset-confirm" />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-full shadow-md"
                  style={{ background: "var(--theme-primary)", color: "var(--theme-primary-foreground)" }}
                  disabled={isLoading}
                  data-testid="button-reset-submit"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
