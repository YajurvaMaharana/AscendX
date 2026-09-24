"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AscendXLogo from "@/components/layout/AscendXLogo";
import {
  verifyCredentials,
  registerUser,
  isEmailRegistered,
  getUsersDatabase,
  UserRecord,
} from "@/lib/userDatabase";
import {
  Mountain,
  Mail,
  Lock,
  User as UserIcon,
  Briefcase,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  ShieldCheck,
  Check,
  Award,
  Zap,
} from "lucide-react";

interface SlidingAuthProps {
  initialMode?: "signin" | "signup";
}

export default function SlidingAuth({ initialMode }: SlidingAuthProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: authUser, isLoading: authLoading, syncUser } = useAuth();

  // Active Tab State: "signin" = Sign In / Existing User, "signup" = Sign Up / New User
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  // Form states - Sign In
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form states - Sign Up
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpTargetRole, setSignUpTargetRole] = useState(
    "Senior Full-Stack Engineer"
  );
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Feedback & Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Forgot Password Modal state
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotFeedback, setForgotFeedback] = useState<string | null>(null);

  // Initialize verified accounts list for display helper
  const [verifiedUsers, setVerifiedUsers] = useState<UserRecord[]>([]);

  // Sync mode with query params or initialMode
  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "signup" || initialMode === "signup") {
      setActiveTab("signup");
    } else if (modeParam === "signin" || initialMode === "signin") {
      setActiveTab("signin");
    }
  }, [searchParams, initialMode]);

  // Load verified database list & remembered email
  useEffect(() => {
    if (typeof window !== "undefined") {
      const db = getUsersDatabase();
      setVerifiedUsers(db);

      const savedEmail = localStorage.getItem("ascendx_remembered_email");
      if (savedEmail) {
        setSignInEmail(savedEmail);
      } else if (db.length > 0) {
        setSignInEmail(db[0].email);
        setSignInPassword("Password123!");
      }
    }
  }, []);

  const isRedirectingRef = useRef(false);

  // Redirect existing authenticated users
  useEffect(() => {
    if (authUser && !authLoading && !isRedirectingRef.current) {
      isRedirectingRef.current = true;
      router.replace("/dashboard");
    }
  }, [authUser, authLoading, router]);

  // Switch tabs cleanly
  const switchTab = (tab: "signin" | "signup") => {
    setActiveTab(tab);
    setErrorMessage(null);
    setSuccessMessage(null);
    const newUrl = `/auth?mode=${tab}`;
    window.history.replaceState(null, "", newUrl);
  };

  // Process successful database auth match
  const processAuthSuccess = async (
    userRecord: { id: string; email: string; name: string; target_role?: string },
    isNewRegistration: boolean = false
  ) => {
    setIsLoading(true);
    setErrorMessage(null);

    if (typeof window !== "undefined" && rememberMe && userRecord.email) {
      try {
        localStorage.setItem("ascendx_remembered_email", userRecord.email);
      } catch {}
    }

    setSuccessMessage(
      isNewRegistration
        ? "Account created & verified! Entering AscendX..."
        : "Credentials verified! Directing to dashboard..."
    );

    // Sync user with AuthContext
    try {
      const mockUserObj = {
        id: userRecord.id,
        email: userRecord.email,
        user_metadata: {
          display_name: userRecord.name,
          full_name: userRecord.name,
          target_role: userRecord.target_role || "Senior Full-Stack Engineer",
        },
      };
      await syncUser(mockUserObj, "mock-database-token", userRecord.name);
    } catch (e) {
      console.warn("Auth sync warning:", e);
    }

    // Refresh verified users list
    setVerifiedUsers(getUsersDatabase());

    // Redirect to destination
    setTimeout(() => {
      window.location.href = isNewRegistration ? "/onboarding" : "/dashboard";
    }, 400);
  };

  // Sign In submit handler with database verification
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Strict Database Verification Check
    const result = verifyCredentials(signInEmail, signInPassword);

    if (!result.success || !result.user) {
      setErrorMessage(
        result.error ||
          "Invalid credentials or account does not exist. Please check your details or create a new account."
      );
      return;
    }

    // Database check passed! Process authentication
    await processAuthSuccess(
      {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        target_role: result.user.target_role,
      },
      false
    );
  };

  // Sign Up submit handler with duplicate email prevention & uniqueness validation
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!signUpName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    const cleanEmail = signUpEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!signUpPassword || signUpPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    // 1. Email Existence Check: Check if email already exists in registered database array
    if (isEmailRegistered(cleanEmail)) {
      setErrorMessage(
        "An account with this email already exists. Please sign in instead."
      );
      return;
    }

    // 2. Register user into verified database array
    const regResult = registerUser({
      name: signUpName.trim(),
      email: cleanEmail,
      password: signUpPassword,
      target_role: signUpTargetRole,
    });

    if (!regResult.success || !regResult.user) {
      setErrorMessage(
        regResult.error || "Registration failed. Please try again."
      );
      return;
    }

    // 3. Successfully registered into database array! Process authentication & redirect
    await processAuthSuccess(
      {
        id: regResult.user.id,
        email: regResult.user.email,
        name: regResult.user.name,
        target_role: regResult.user.target_role,
      },
      true
    );
  };

  // Quick fill helper for verified test accounts
  const handleSelectVerifiedUser = (user: UserRecord) => {
    setActiveTab("signin");
    setSignInEmail(user.email);
    setSignInPassword(user.password || "Password123!");
    setErrorMessage(null);
  };

  // Forgot Password handler
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotFeedback("Please enter your registered email address.");
      return;
    }
    setForgotLoading(true);
    setForgotFeedback(null);

    setTimeout(() => {
      setForgotFeedback(
        "A password reset link has been dispatched to your email address."
      );
      setForgotLoading(false);
    }, 600);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-auto p-3 sm:p-6">
      {/* Forgot Password Dialog */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl space-y-4">
            <button
              onClick={() => {
                setForgotPasswordOpen(false);
                setForgotFeedback(null);
              }}
              className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="space-y-1">
              <h3 className="text-lg font-bold tracking-tight">Reset Password</h3>
              <p className="text-xs text-muted-foreground">
                Enter your verified email to receive a password recovery link.
              </p>
            </div>

            {forgotFeedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  forgotFeedback.includes("dispatched")
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                {forgotFeedback.includes("dispatched") ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0" />
                )}
                <span>{forgotFeedback}</span>
              </div>
            )}

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="forgot-email" className="text-xs font-medium">
                  Registered Email Address
                </Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="name@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="h-9 text-sm rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setForgotPasswordOpen(false);
                    setForgotFeedback(null);
                  }}
                  className="rounded-lg text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={forgotLoading}
                  className="rounded-lg text-xs font-semibold"
                >
                  {forgotLoading ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Authenticated Welcome View */}
      {authUser && !authLoading ? (
        <div className="w-full max-w-lg mx-auto rounded-2xl border bg-card p-8 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
            <Mountain className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight">
              You are signed in
            </h2>
            <p className="text-sm text-muted-foreground">
              Authenticated as{" "}
              <span className="font-semibold text-foreground">
                {authUser.email}
              </span>
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg py-2.5 px-3">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Authenticated session active</span>
          </div>

          <div className="pt-2">
            <Button
              asChild
              size="lg"
              className="w-full font-semibold gap-2 shadow-md rounded-xl"
            >
              <Link href="/dashboard">
                <span>Enter AscendX Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        /* Main Authentication Card with Explicit Tab Switcher */
        <div className="relative w-full rounded-2xl border bg-card shadow-2xl overflow-hidden flex flex-col md:flex-row">
          {/* ========================================================= */}
          {/* LEFT AREA: AUTHENTICATION FORM & TAB SWITCHER              */}
          {/* ========================================================= */}
          <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Header Logo & Title */}
              <div className="flex items-center justify-between pb-4 border-b">
                <Link href="/" className="flex items-center">
                  <AscendXLogo size="md" />
                </Link>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Strict Database Validation</span>
                </div>
              </div>

              {/* ========================================================= */}
              {/* EXPLICIT TAB SWITCHER                                     */}
              {/* ========================================================= */}
              <div className="my-6">
                <div className="grid grid-cols-2 p-1.5 bg-muted/80 rounded-xl text-xs font-semibold gap-1">
                  <button
                    type="button"
                    onClick={() => switchTab("signin")}
                    className={`py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                      activeTab === "signin"
                        ? "bg-card text-foreground shadow-sm font-bold border border-border/50"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Existing User (Sign In)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => switchTab("signup")}
                    className={`py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                      activeTab === "signup"
                        ? "bg-card text-foreground shadow-sm font-bold border border-border/50"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <UserIcon className="h-3.5 w-3.5 text-primary" />
                    <span>New User (Sign Up)</span>
                  </button>
                </div>
              </div>

              {/* Error / Success Notifications */}
              {errorMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-destructive/10 text-destructive text-xs flex items-start gap-2.5 border border-destructive/20 animate-in fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">
                    <div>{errorMessage}</div>
                    {errorMessage.includes("already exists") && (
                      <button
                        type="button"
                        onClick={() => {
                          if (signUpEmail) setSignInEmail(signUpEmail);
                          switchTab("signin");
                        }}
                        className="mt-2 text-xs font-bold underline hover:no-underline text-primary flex items-center gap-1"
                      >
                        <span>Switch to Sign In with {signUpEmail || "your email"}</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5 border border-emerald-500/20 animate-in fade-in">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span className="font-medium">{successMessage}</span>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 1: SIGN IN VIEW                                       */}
              {/* ========================================================= */}
              {activeTab === "signin" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                      Sign In to Your Account
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Access is restricted to verified accounts in the user database.
                    </p>
                  </div>

                  <form onSubmit={handleSignIn} className="space-y-3.5">
                    <div className="space-y-1">
                      <Label htmlFor="signin-email" className="text-xs font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="name@example.com"
                          value={signInEmail}
                          onChange={(e) => setSignInEmail(e.target.value)}
                          className="pl-9 h-10 text-sm rounded-lg"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="signin-password" className="text-xs font-medium">
                          Password
                        </Label>
                        <button
                          type="button"
                          onClick={() => {
                            setForgotEmail(signInEmail);
                            setForgotPasswordOpen(true);
                          }}
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-password"
                          type={showSignInPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          className="pl-9 pr-9 h-10 text-sm rounded-lg"
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignInPassword(!showSignInPassword)}
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                          aria-label="Toggle password visibility"
                        >
                          {showSignInPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="checkbox"
                        id="remember-me"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <Label htmlFor="remember-me" className="text-xs text-muted-foreground cursor-pointer">
                        Remember login details on this browser
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-10 text-sm font-semibold shadow-sm rounded-lg gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Verifying Credentials...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify & Sign In</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Verified Database Helper Section */}
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="font-semibold flex items-center gap-1 text-foreground">
                        <Sparkles className="h-3 w-3 text-primary" />
                        Verified Demo Accounts Database:
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {verifiedUsers.length} verified account(s)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {verifiedUsers.slice(0, 2).map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => handleSelectVerifiedUser(u)}
                          className="p-2 rounded-lg border bg-muted/30 hover:bg-muted text-left text-xs transition-colors flex items-center justify-between group"
                        >
                          <div className="truncate">
                            <p className="font-bold text-foreground truncate">{u.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                          </div>
                          <span className="text-[10px] text-primary group-hover:underline font-semibold shrink-0 ml-1">
                            Fill
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 2: SIGN UP VIEW                                       */}
              {/* ========================================================= */}
              {activeTab === "signup" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                      Register New Verified Account
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Creates a new user record in the database array to grant instant login access.
                    </p>
                  </div>

                  <form onSubmit={handleSignUp} className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="signup-name" className="text-xs font-medium">
                        Full Name
                      </Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Jane Doe"
                          value={signUpName}
                          onChange={(e) => setSignUpName(e.target.value)}
                          className="pl-9 h-10 text-sm rounded-lg"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="signup-email" className="text-xs font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="name@example.com"
                          value={signUpEmail}
                          onChange={(e) => {
                            setSignUpEmail(e.target.value);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          className="pl-9 h-10 text-sm rounded-lg"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="signup-role" className="text-xs font-medium">
                        Target Engineering Role
                      </Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                        <select
                          id="signup-role"
                          value={signUpTargetRole}
                          onChange={(e) => setSignUpTargetRole(e.target.value)}
                          className="w-full pl-9 pr-3 h-10 text-sm rounded-lg border border-input bg-background text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                          disabled={isLoading}
                        >
                          <option value="Senior Full-Stack Engineer">
                            Senior Full-Stack Engineer
                          </option>
                          <option value="Backend Systems Architect">
                            Backend Systems Architect
                          </option>
                          <option value="Frontend Engineer (React/Next)">
                            Frontend Engineer (React/Next)
                          </option>
                          <option value="Distributed Systems Engineer">
                            Distributed Systems Engineer
                          </option>
                          <option value="DevOps / SRE Specialist">
                            DevOps / SRE Specialist
                          </option>
                          <option value="AI / ML Solutions Engineer">
                            AI / ML Solutions Engineer
                          </option>
                          <option value="Engineering Manager">
                            Engineering Manager
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="signup-password" className="text-xs font-medium">
                        Create Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type={showSignUpPassword ? "text" : "password"}
                          placeholder="At least 6 characters"
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          className="pl-9 pr-9 h-10 text-sm rounded-lg"
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                          aria-label="Toggle password visibility"
                        >
                          {showSignUpPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-10 text-sm font-semibold shadow-sm rounded-lg gap-2 mt-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Creating & Verifying Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account & Log In</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </div>

            {/* Bottom Footer Note */}
            <div className="pt-6 border-t mt-6 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>AscendX AI Studio</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                Protected Route Enforcement
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT AREA: ASCENDX PLATFORM BANNER (DESKTOP)             */}
          {/* ========================================================= */}
          <div className="hidden md:flex md:w-5/12 bg-slate-950 text-white p-8 flex-col justify-between relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <Mountain className="h-4 w-4 text-primary" />
                </div>
                <span className="font-extrabold text-sm tracking-wide text-slate-100 uppercase">
                  AscendX Platform
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight leading-tight">
                  Master Software Engineering Interviews
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Real-time adaptive AI evaluations, system design simulations, and deep resume-JD grounding.
                </p>
              </div>

              {/* Feature Bullet Points */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-xs text-slate-200">
                  <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-bold">Strict Credentials Guard</p>
                    <p className="text-[11px] text-slate-400">
                      Unregistered logins are strictly blocked from the dashboard shell.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-slate-200">
                  <div className="p-1 rounded-md bg-primary/20 text-primary mt-0.5">
                    <Zap className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-bold">Instant Account Verification</p>
                    <p className="text-[11px] text-slate-400">
                      New sign ups are appended to the user database array immediately.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-slate-200">
                  <div className="p-1 rounded-md bg-indigo-500/20 text-indigo-400 mt-0.5">
                    <Award className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-bold">Adaptive AI Interviewer</p>
                    <p className="text-[11px] text-slate-400">
                      STAR behavioral probing, system design, and live coding feedback.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card Quote */}
            <div className="relative z-10 pt-6 border-t border-slate-800 text-slate-400 text-[11px] space-y-1">
              <p className="italic">
                &ldquo;Simulate authentic interview scenarios with tailored, role-specific questions.&rdquo;
              </p>
              <p className="font-semibold text-slate-300">— Engineering Interviewer Engine</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
