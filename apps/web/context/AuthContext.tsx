"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isValidUUID, emailToUUID } from "@/lib/supabase/env";
import { isUserProfileCompleted, markUserProfileCompleted } from "@/lib/userDatabase";

export interface NormalizedUser {
  id: string;
  email?: string;
  display_name?: string;
  avatar_url?: string | null;
  bio?: string;
  target_role?: string;
  skills?: string[];
  experience_level?: string;
  preferred_interview_type?: string;
  preferred_language?: string;
  interview_goals?: string[] | string;
  target_companies?: string[];
  resume_url?: string | null;
  resume_filename?: string | null;
  resume_parsed_at?: string | null;
  resume_data?: any | null;
  user_metadata?: {
    display_name?: string;
    full_name?: string;
    bio?: string;
    target_role?: string;
    skills?: string[];
    experience_level?: string;
    avatar_url?: string | null;
    preferred_interview_type?: string;
    preferred_language?: string;
    interview_goals?: string[] | string;
    target_companies?: string[];
    resume_url?: string | null;
    resume_filename?: string | null;
    resume_parsed_at?: string | null;
    resume_data?: any | null;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface UploadedResumeState {
  data: any;
  filename: string;
  fileName?: string;
  url?: string | null;
  parsedAt?: string | null;
  headline?: string | null;
  summary?: string | null;
  skills?: string[] | null;
  rawText?: string | null;
  [key: string]: any;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | NormalizedUser | null;
  session: Session | null;
  isLoading: boolean;
  uploadedResume: UploadedResumeState | null;
  setUploadedResume: (resume: UploadedResumeState | null) => void;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  resetPasswordEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  syncUser: (
    rawUser: any,
    accessToken?: string,
    displayNameOverride?: string
  ) => Promise<{ id: string; email: string; display_name: string }>;
  updateUserProfile: (updates: {
    display_name?: string;
    bio?: string;
    target_role?: string;
    skills?: string[];
    experience_level?: string;
    avatar_url?: string | null;
    preferred_interview_type?: string;
    preferred_language?: string;
    interview_goals?: string[] | string;
    target_companies?: string[];
    resume_url?: string | null;
    resume_filename?: string | null;
    resume_parsed_at?: string | null;
    resume_data?: any | null;
  }) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Default state initialization: user is strictly null by default -> isAuthenticated starts strictly as false
  const [user, setUser] = useState<User | NormalizedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isSigningOutRef = useRef(false);

  // Global Unified Resume State Store
  const [uploadedResume, setUploadedResumeState] = useState<UploadedResumeState | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("ascendx_uploaded_resume");
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return null;
  });

  const setUploadedResume = useCallback((resume: UploadedResumeState | null) => {
    setUploadedResumeState(resume);
    if (typeof window !== "undefined") {
      try {
        if (resume) {
          localStorage.setItem("ascendx_uploaded_resume", JSON.stringify(resume));
        } else {
          localStorage.removeItem("ascendx_uploaded_resume");
        }
      } catch {}
    }
  }, []);

  // Synchronize uploadedResume whenever user profile changes
  useEffect(() => {
    const resume = (user as any)?.resume_data || (user as any)?.user_metadata?.resume_data;
    if (resume) {
      const filename =
        (user as any)?.resume_filename ||
        (user as any)?.user_metadata?.resume_filename ||
        "Candidate_Resume.pdf";
      const url =
        (user as any)?.resume_url || (user as any)?.user_metadata?.resume_url || null;
      const parsedAt =
        (user as any)?.resume_parsed_at ||
        (user as any)?.user_metadata?.resume_parsed_at ||
        null;
      const constructed: UploadedResumeState = {
        ...resume,
        data: resume,
        filename,
        fileName: filename,
        url,
        parsedAt,
        headline: resume.headline || (user as any)?.target_role || null,
        skills: resume.skills || [],
      };
      setUploadedResumeState(constructed);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("ascendx_uploaded_resume", JSON.stringify(constructed));
        } catch {}
      }
    }
  }, [user]);

  // Synchronize user to public.users table and local persistence
  const syncUser = useCallback(
    async (
      rawUser: any,
      accessToken?: string,
      displayNameOverride?: string
    ) => {
      if (!rawUser) {
        throw new Error("Cannot sync null user");
      }

      const email = (rawUser.email || "").trim().toLowerCase();
      const id =
        rawUser.id && isValidUUID(rawUser.id)
          ? rawUser.id
          : emailToUUID(email || "candidate@example.com");

      const displayName =
        displayNameOverride ||
        rawUser.user_metadata?.display_name ||
        rawUser.user_metadata?.full_name ||
        rawUser.display_name ||
        (email.includes("@") ? email.split("@")[0] : "Candidate");

      const bio = rawUser.bio || rawUser.user_metadata?.bio || "";
      const targetRole = rawUser.target_role || rawUser.user_metadata?.target_role || "Full-Stack Software Engineer";
      const avatarUrl = rawUser.avatar_url || rawUser.user_metadata?.avatar_url || null;
      const skills = rawUser.skills || rawUser.user_metadata?.skills || null;
      const experienceLevel = rawUser.experience_level || rawUser.user_metadata?.experience_level || null;
      const preferredInterviewType = rawUser.preferred_interview_type || rawUser.user_metadata?.preferred_interview_type || null;
      const preferredLanguage = rawUser.preferred_language || rawUser.user_metadata?.preferred_language || null;
      const interviewGoals = rawUser.interview_goals || rawUser.user_metadata?.interview_goals || null;
      const targetCompanies = rawUser.target_companies || rawUser.user_metadata?.target_companies || null;

      const profileCompleted =
        rawUser.profile_completed !== undefined
          ? Boolean(rawUser.profile_completed)
          : rawUser.user_metadata?.profile_completed !== undefined
          ? Boolean(rawUser.user_metadata.profile_completed)
          : isUserProfileCompleted(email || id);

      const isNewUser = !profileCompleted;

      const userPayload = {
        id,
        email,
        display_name: displayName,
        avatar_url: avatarUrl,
        bio,
        target_role: targetRole,
        skills,
        experience_level: experienceLevel,
        preferred_interview_type: preferredInterviewType,
        preferred_language: preferredLanguage,
        interview_goals: interviewGoals,
        target_companies: targetCompanies,
        profile_completed: profileCompleted,
        is_new_user: isNewUser,
        user_metadata: {
          display_name: displayName,
          full_name: displayName,
          bio,
          target_role: targetRole,
          avatar_url: avatarUrl,
          skills,
          experience_level: experienceLevel,
          preferred_interview_type: preferredInterviewType,
          preferred_language: preferredLanguage,
          interview_goals: interviewGoals,
          target_companies: targetCompanies,
          profile_completed: profileCompleted,
          is_new_user: isNewUser,
          ...(rawUser.user_metadata || {}),
        },
      };

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("sb-mock-user", JSON.stringify(userPayload));
          document.cookie = `sb-mock-auth=${encodeURIComponent(
            JSON.stringify(userPayload)
          )}; path=/; max-age=604800; SameSite=Lax`;
        } catch {}
      }

      const supabase = createClient();
      try {
        const dbPayload: Record<string, any> = {
          id,
          email,
          display_name: displayName,
          avatar_url: userPayload.avatar_url,
          bio,
          target_role: targetRole,
          updated_at: new Date().toISOString(),
        };
        if (skills) dbPayload.skills = skills;
        if (experienceLevel) dbPayload.experience_level = experienceLevel;
        if (preferredInterviewType) dbPayload.preferred_interview_type = preferredInterviewType;
        if (preferredLanguage) dbPayload.preferred_language = preferredLanguage;
        if (interviewGoals) dbPayload.interview_goals = interviewGoals;
        if (targetCompanies) dbPayload.target_companies = targetCompanies;

        await Promise.allSettled([
          supabase.from("users").upsert(dbPayload, { onConflict: "id" }),
          fetch("/api/auth/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: userPayload,
              accessToken: accessToken || "mock-token",
            }),
          }),
        ]);
      } catch (e) {
        console.warn("[AuthContext] Background sync notice:", e);
      }

      setUser(userPayload as any);
      return { id, email, display_name: displayName };
    },
    []
  );

  // Fetch full user record from Supabase users table
  const fetchUserProfileFromDb = useCallback(async (userId: string, currentSessionUser?: any) => {
    if (!userId) return null;
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (!error && data) {
        const mergedUser: NormalizedUser = {
          ...(currentSessionUser || {}),
          id: data.id,
          email: data.email || currentSessionUser?.email,
          display_name: data.display_name,
          bio: data.bio,
          target_role: data.target_role,
          avatar_url: data.avatar_url,
          skills: data.skills,
          experience_level: data.experience_level,
          preferred_interview_type: data.preferred_interview_type,
          preferred_language: data.preferred_language,
          interview_goals: data.interview_goals,
          target_companies: data.target_companies,
          resume_url: data.resume_url,
          resume_filename: data.resume_filename,
          resume_parsed_at: data.resume_parsed_at,
          resume_data: data.resume_data,
          user_metadata: {
            ...(currentSessionUser?.user_metadata || {}),
            display_name: data.display_name,
            full_name: data.display_name,
            bio: data.bio,
            target_role: data.target_role,
            avatar_url: data.avatar_url,
            skills: data.skills,
            experience_level: data.experience_level,
            preferred_interview_type: data.preferred_interview_type,
            preferred_language: data.preferred_language,
            interview_goals: data.interview_goals,
            target_companies: data.target_companies,
            resume_url: data.resume_url,
            resume_filename: data.resume_filename,
            resume_parsed_at: data.resume_parsed_at,
            resume_data: data.resume_data,
          },
        };
        setUser(mergedUser);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("sb-mock-user", JSON.stringify(mergedUser));
          } catch {}
        }
        return mergedUser;
      }
    } catch (err) {
      console.warn("[AuthContext] fetchUserProfileFromDb error:", err);
    }
    return null;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchUserProfileFromDb(user.id, user);
    }
  }, [user, fetchUserProfileFromDb]);

  // Update candidate profile
  const updateUserProfile = useCallback(
    async (updates: {
      display_name?: string;
      bio?: string;
      target_role?: string;
      skills?: string[];
      experience_level?: string;
      avatar_url?: string | null;
      preferred_interview_type?: string;
      preferred_language?: string;
      interview_goals?: string[] | string;
      target_companies?: string[];
      resume_url?: string | null;
      resume_filename?: string | null;
      resume_parsed_at?: string | null;
      resume_data?: any | null;
    }): Promise<boolean> => {
      if (!user?.id) return false;

      const currentId = user.id;
      const currentEmail = user.email || "candidate@example.com";
      const u = user as any;
      const newDisplayName = updates.display_name !== undefined ? updates.display_name : u.display_name || "Candidate";
      const newBio = updates.bio !== undefined ? updates.bio : u.bio || "";
      const newRole = updates.target_role !== undefined ? updates.target_role : u.target_role || "Full-Stack Software Engineer";
      const newAvatar = updates.avatar_url !== undefined ? updates.avatar_url : u.avatar_url || null;
      const newSkills = updates.skills !== undefined ? updates.skills : u.skills || null;
      const newExpLevel = updates.experience_level !== undefined ? updates.experience_level : u.experience_level || null;
      const newPrefInterviewType = updates.preferred_interview_type !== undefined ? updates.preferred_interview_type : u.preferred_interview_type || null;
      const newPrefLanguage = updates.preferred_language !== undefined ? updates.preferred_language : u.preferred_language || null;
      const newGoals = updates.interview_goals !== undefined ? updates.interview_goals : u.interview_goals || null;
      const newTargetCompanies = updates.target_companies !== undefined ? updates.target_companies : u.target_companies || null;
      const newResumeUrl = updates.resume_url !== undefined ? updates.resume_url : (u.resume_url || null);
      const newResumeFilename = updates.resume_filename !== undefined ? updates.resume_filename : (u.resume_filename || null);
      const newResumeParsedAt = updates.resume_parsed_at !== undefined ? updates.resume_parsed_at : (u.resume_parsed_at || null);
      const newResumeData = updates.resume_data !== undefined ? updates.resume_data : (u.resume_data || null);

      markUserProfileCompleted(currentEmail);
      markUserProfileCompleted(currentId);

      const updatedUserPayload: NormalizedUser = {
        ...user,
        id: currentId,
        email: currentEmail,
        display_name: newDisplayName,
        bio: newBio,
        target_role: newRole,
        avatar_url: newAvatar,
        skills: newSkills || undefined,
        experience_level: newExpLevel || undefined,
        preferred_interview_type: newPrefInterviewType || undefined,
        preferred_language: newPrefLanguage || undefined,
        interview_goals: newGoals || undefined,
        target_companies: newTargetCompanies || undefined,
        resume_url: newResumeUrl,
        resume_filename: newResumeFilename,
        resume_parsed_at: newResumeParsedAt,
        resume_data: newResumeData,
        profile_completed: true,
        is_new_user: false,
        user_metadata: {
          ...(user.user_metadata || {}),
          display_name: newDisplayName,
          full_name: newDisplayName,
          bio: newBio,
          target_role: newRole,
          avatar_url: newAvatar,
          skills: newSkills || undefined,
          experience_level: newExpLevel || undefined,
          preferred_interview_type: newPrefInterviewType || undefined,
          preferred_language: newPrefLanguage || undefined,
          interview_goals: newGoals || undefined,
          target_companies: newTargetCompanies || undefined,
          resume_url: newResumeUrl,
          resume_filename: newResumeFilename,
          resume_parsed_at: newResumeParsedAt,
          resume_data: newResumeData,
          profile_completed: true,
          is_new_user: false,
        },
      };

      setUser(updatedUserPayload);
      if (updates.resume_data) {
        const filename = updates.resume_filename || "Candidate_Resume.pdf";
        const constructed: UploadedResumeState = {
          ...updates.resume_data,
          data: updates.resume_data,
          filename,
          fileName: filename,
          url: updates.resume_url || null,
          parsedAt: updates.resume_parsed_at || new Date().toISOString(),
          headline: updates.resume_data.headline || updates.target_role || null,
          skills: updates.resume_data.skills || [],
        };
        setUploadedResumeState(constructed);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("ascendx_uploaded_resume", JSON.stringify(constructed));
          } catch {}
        }
      }
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("sb-mock-user", JSON.stringify(updatedUserPayload));
          document.cookie = `sb-mock-auth=${encodeURIComponent(
            JSON.stringify(updatedUserPayload)
          )}; path=/; max-age=604800; SameSite=Lax`;
        } catch {}
      }

      const supabase = createClient();
      try {
        const dbPayload: Record<string, any> = {
          id: currentId,
          email: currentEmail,
          display_name: newDisplayName,
          bio: newBio,
          target_role: newRole,
          avatar_url: newAvatar,
          updated_at: new Date().toISOString(),
        };
        if (newSkills) dbPayload.skills = newSkills;
        if (newExpLevel) dbPayload.experience_level = newExpLevel;
        if (newPrefInterviewType) dbPayload.preferred_interview_type = newPrefInterviewType;
        if (newPrefLanguage) dbPayload.preferred_language = newPrefLanguage;
        if (newGoals) dbPayload.interview_goals = newGoals;
        if (newTargetCompanies) dbPayload.target_companies = newTargetCompanies;
        if (newResumeUrl !== undefined) dbPayload.resume_url = newResumeUrl;
        if (newResumeFilename !== undefined) dbPayload.resume_filename = newResumeFilename;
        if (newResumeParsedAt !== undefined) dbPayload.resume_parsed_at = newResumeParsedAt;
        if (newResumeData !== undefined) dbPayload.resume_data = newResumeData;

        await Promise.allSettled([
          supabase.from("users").upsert(dbPayload, { onConflict: "id" }),
          supabase.auth.updateUser({
            data: {
              display_name: newDisplayName,
              full_name: newDisplayName,
              bio: newBio,
              target_role: newRole,
              avatar_url: newAvatar,
              skills: newSkills,
              experience_level: newExpLevel,
              preferred_interview_type: newPrefInterviewType,
              preferred_language: newPrefLanguage,
              interview_goals: newGoals,
              target_companies: newTargetCompanies,
              resume_url: newResumeUrl,
              resume_filename: newResumeFilename,
              resume_parsed_at: newResumeParsedAt,
              resume_data: newResumeData,
            },
          }),
          fetch("/api/user/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: currentId,
              email: currentEmail,
              display_name: newDisplayName,
              bio: newBio,
              target_role: newRole,
              avatar_url: newAvatar,
              skills: newSkills,
              experience_level: newExpLevel,
              preferred_interview_type: newPrefInterviewType,
              preferred_language: newPrefLanguage,
              interview_goals: newGoals,
              target_companies: newTargetCompanies,
              resume_url: newResumeUrl,
              resume_filename: newResumeFilename,
              resume_parsed_at: newResumeParsedAt,
              resume_data: newResumeData,
            }),
          }),
        ]);
        return true;
      } catch (err) {
        console.warn("[AuthContext] Profile update background error:", err);
        return true;
      }
    },
    [user]
  );

  // Password Update
  const updatePassword = useCallback(async (newPassword: string) => {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: true };
    }
  }, []);

  // Password Reset Email Request
  const resetPasswordEmail = useCallback(async (email: string) => {
    if (!email) {
      return { success: false, error: "Please provide a valid email address." };
    }
    const supabase = createClient();
    try {
      const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/auth?reset=true` : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: true };
    }
  }, []);

  // Delete Candidate Account
  const deleteAccount = useCallback(async (): Promise<boolean> => {
    if (!user?.id) return false;
    isSigningOutRef.current = true;
    const userId = user.id;

    try {
      await fetch("/api/user/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
    } catch (err) {
      console.warn("[AuthContext] deleteAccount api call notice:", err);
    }

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("sb-mock-user");
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("sb-") || key.includes("supabase")) {
            localStorage.removeItem(key);
          }
        });
        sessionStorage.clear();
        document.cookie = "sb-mock-auth=; path=/; max-age=0; SameSite=Lax";
      } catch {}
    }

    const supabase = createClient();
    try {
      await supabase.auth.signOut();
    } catch {}

    setUser(null);
    setSession(null);

    if (typeof window !== "undefined") {
      window.location.href = "/auth";
    }
    return true;
  }, [user]);

  // Clean, single initialization on mount without auto-logging in stored mock users
  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    // 1. Check existing session from active Supabase auth instance
    supabase.auth
      .getSession()
      .then(async ({ data }: { data: { session: Session | null } }) => {
        if (!isMounted || isSigningOutRef.current) return;
        if (data?.session?.user && !data.session.access_token?.includes("mock-token")) {
          setSession(data.session);
          setUser(data.session.user);
          await fetchUserProfileFromDb(data.session.user.id, data.session.user);
        } else {
          // Strictly boot up displaying the sign-in / authentication view first
          setUser(null);
          setSession(null);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (isMounted) {
          setUser(null);
          setSession(null);
          setIsLoading(false);
        }
      });

    // 2. Single subscription to auth state changes
    const {
      data: { subscription },
    } = (supabase.auth.onAuthStateChange as any)(
      async (_event: string, newSession: Session | null) => {
        if (!isMounted || isSigningOutRef.current) return;

        const nextUser = newSession?.user ?? null;
        setSession(newSession ?? null);

        if (nextUser) {
          setUser(nextUser);
          await fetchUserProfileFromDb(nextUser.id, nextUser);
        } else {
          setUser(null);
        }

        setIsLoading(false);
      }
    ) as { data: { subscription: { unsubscribe: () => void } } };

    return () => {
      isMounted = false;
      try {
        subscription?.unsubscribe?.();
      } catch {}
    };
  }, [fetchUserProfileFromDb]);

  // Bulletproof Sign Out
  const signOut = useCallback(async () => {
    isSigningOutRef.current = true;
    const supabase = createClient();

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("sb-mock-user");
        localStorage.removeItem("ascendx_uploaded_resume");
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("sb-") || key.includes("supabase")) {
            localStorage.removeItem(key);
          }
        });
        sessionStorage.clear();
        document.cookie = "sb-mock-auth=; path=/; max-age=0; SameSite=Lax";
      } catch {}
    }

    setUser(null);
    setSession(null);
    setUploadedResumeState(null);

    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("[AuthContext] Sign out notice:", e);
    }

    isSigningOutRef.current = false;

    if (typeof window !== "undefined") {
      window.location.href = "/auth?mode=signin";
    }
  }, []);

  // Strict isAuthenticated boolean derivation initialized to false by default
  const isAuthenticated = Boolean(user !== null);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    session,
    isLoading,
    uploadedResume,
    setUploadedResume,
    signOut,
    deleteAccount,
    updatePassword,
    resetPasswordEmail,
    syncUser,
    updateUserProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      isAuthenticated: false,
      user: null,
      session: null,
      isLoading: true,
      uploadedResume: null,
      setUploadedResume: () => {},
      signOut: async () => {},
      deleteAccount: async () => false,
      updatePassword: async () => ({ success: false, error: 'Not initialized' }),
      resetPasswordEmail: async () => ({ success: false, error: 'Not initialized' }),
      syncUser: async () => ({ id: '', email: '', display_name: '' }),
      updateUserProfile: async () => false,
      refreshProfile: async () => {},
    };
  }
  return context;
}

export function useResume() {
  const { uploadedResume, setUploadedResume } = useAuth();
  return { uploadedResume, setUploadedResume };
}
