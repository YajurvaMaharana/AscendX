"use client";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password?: string;
  target_role: string;
  createdAt: string;
  verified: boolean;
  profile_completed?: boolean;
  is_new_user?: boolean;
}

const STORAGE_KEY = "ascendx_user_database";

// Seed accounts for instant testing & demo
const SEED_USERS: UserRecord[] = [
  {
    id: "user-seed-1",
    name: "Alex Mercer",
    email: "alex.dev@ascendx.io",
    password: "Password123!",
    target_role: "Senior Full-Stack Engineer",
    createdAt: new Date().toISOString(),
    verified: true,
    profile_completed: true,
    is_new_user: false,
  },
  {
    id: "user-seed-2",
    name: "Valentin Fine",
    email: "valentinine14feb@gmail.com",
    password: "Password123!",
    target_role: "Senior Full-Stack Engineer",
    createdAt: new Date().toISOString(),
    verified: true,
    profile_completed: true,
    is_new_user: false,
  },
];

/**
 * Get all registered user records from database storage
 */
export function getUsersDatabase(): UserRecord[] {
  if (typeof window === "undefined") return SEED_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure seed users are always present
      let updated = [...parsed];
      let changed = false;
      for (const seed of SEED_USERS) {
        if (!updated.some((u) => u.email.toLowerCase() === seed.email.toLowerCase())) {
          updated.push(seed);
          changed = true;
        }
      }
      if (changed) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    }
  } catch (e) {
    console.warn("Failed to load user database from localStorage:", e);
  }
  return SEED_USERS;
}

/**
 * Check if an email address is already registered in the user database array
 */
export function isEmailRegistered(email: string): boolean {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  const db = getUsersDatabase();
  return db.some((u) => u.email.toLowerCase() === cleanEmail);
}

/**
 * Verify user credentials against stored database array
 */
export function verifyCredentials(
  email: string,
  pass: string
): { success: boolean; user?: UserRecord; error?: string } {
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPass = (pass || "").trim();

  if (!cleanEmail || !cleanPass) {
    return {
      success: false,
      error: "Please enter both your email address and password.",
    };
  }

  const db = getUsersDatabase();
  const existingUser = db.find(
    (u) => u.email.toLowerCase() === cleanEmail
  );

  if (!existingUser) {
    return {
      success: false,
      error: "Invalid credentials or account does not exist. Please check your email or create a new account.",
    };
  }

  if (existingUser.password && existingUser.password !== cleanPass) {
    return {
      success: false,
      error: "Invalid password for this account. Please try again or reset your password.",
    };
  }

  return {
    success: true,
    user: existingUser,
  };
}

/**
 * Register a new user into the database array with duplicate email prevention
 */
export function registerUser(input: {
  name: string;
  email: string;
  password?: string;
  target_role?: string;
}): { success: boolean; user?: UserRecord; error?: string } {
  const cleanName = (input.name || "").trim();
  const cleanEmail = (input.email || "").trim().toLowerCase();
  const cleanPass = (input.password || "").trim();
  const targetRole = input.target_role || "Senior Full-Stack Engineer";

  if (!cleanName || !cleanEmail || !cleanPass) {
    return {
      success: false,
      error: "Please complete all required fields (Name, Email, and Password).",
    };
  }

  if (cleanPass.length < 6) {
    return {
      success: false,
      error: "Password must be at least 6 characters long.",
    };
  }

  // Duplicate Email Prevention & Uniqueness Validation
  if (isEmailRegistered(cleanEmail)) {
    return {
      success: false,
      error: "An account with this email already exists. Please sign in instead.",
    };
  }

  const newUser: UserRecord = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: cleanName,
    email: cleanEmail,
    password: cleanPass,
    target_role: targetRole,
    createdAt: new Date().toISOString(),
    verified: true,
    profile_completed: false,
    is_new_user: true,
  };

  const db = getUsersDatabase();
  const updatedDb = [...db, newUser];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDb));
    } catch (e) {
      console.warn("Failed to save user to user database:", e);
    }
  }

  return {
    success: true,
    user: newUser,
  };
}

/**
 * Mark a user's profile setup as completed in the database
 */
export function markUserProfileCompleted(emailOrId: string): void {
  if (!emailOrId || typeof window === "undefined") return;
  const cleanKey = emailOrId.trim().toLowerCase();
  const db = getUsersDatabase();
  let changed = false;
  const updatedDb = db.map((user) => {
    if (
      user.id === emailOrId ||
      user.email.toLowerCase() === cleanKey
    ) {
      changed = true;
      return {
        ...user,
        profile_completed: true,
        is_new_user: false,
      };
    }
    return user;
  });

  if (changed) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDb));
    } catch (e) {
      console.warn("Failed to update user profile completed status:", e);
    }
  }
}

/**
 * Check if a user has completed their profile setup
 */
export function isUserProfileCompleted(emailOrId: string): boolean {
  if (!emailOrId) return false;
  const cleanKey = emailOrId.trim().toLowerCase();
  const db = getUsersDatabase();
  const found = db.find(
    (u) => u.id === emailOrId || u.email.toLowerCase() === cleanKey
  );
  if (!found) return false;
  if (found.profile_completed !== undefined) {
    return Boolean(found.profile_completed);
  }
  if (found.is_new_user !== undefined) {
    return !found.is_new_user;
  }
  return true;
}
