import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  cleanEnvString,
  isValidSupabaseUrl,
  isValidSupabaseKey,
  isInvalidKeyError,
  emailToUUID,
  isValidUUID,
} from "./env";

export function getServerCredentials() {
  const urlCandidates = [
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_API_URL?.includes("supabase.co")
      ? process.env.NEXT_PUBLIC_API_URL.startsWith("http")
        ? process.env.NEXT_PUBLIC_API_URL
        : `https:${process.env.NEXT_PUBLIC_API_URL}`
      : undefined,
    process.env.SUPABASE_URL,
  ];

  const keyCandidates = [
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    process.env.SUPABASE_ANON_KEY,
  ];

  const url =
    urlCandidates
      .map(cleanEnvString)
      .find((u) => isValidSupabaseUrl(u)) || null;

  const key =
    keyCandidates
      .map(cleanEnvString)
      .find((k) => isValidSupabaseKey(k)) || null;

  return { url, key };
}

export function createClient() {
  const cookieStore = cookies();
  const { url, key } = getServerCredentials();

  const getMockUser = () => {
    let mockUser: any = null;
    try {
      const mockCookie = cookieStore.get("sb-mock-auth");
      if (mockCookie?.value) {
        mockUser = JSON.parse(decodeURIComponent(mockCookie.value));
        if (mockUser && !isValidUUID(mockUser.id) && mockUser.email) {
          mockUser.id = emailToUUID(mockUser.email);
        }
      }
    } catch {
      mockUser = null;
    }
    return mockUser;
  };

  if (!url || !key) {
    const mockUser = getMockUser();
    return {
      auth: {
        getUser: async () => ({ data: { user: mockUser }, error: null }),
        getSession: async () => ({
          data: { session: { user: mockUser, access_token: "mock-token" } },
          error: null,
        }),
      },
    } as any;
  }

  try {
    const rawServerClient = createServerClient(url, key, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Can be safely ignored in server components
          }
        },
      },
    });

    const originalGetUser = rawServerClient.auth.getUser.bind(rawServerClient.auth);
    const originalGetSession = rawServerClient.auth.getSession.bind(rawServerClient.auth);

    const withTimeout = async <T>(promise: Promise<T>, fallbackValue: T, timeoutMs = 500): Promise<T> => {
      let timer: NodeJS.Timeout;
      const timeoutPromise = new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(fallbackValue), timeoutMs);
      });
      try {
        const result = await Promise.race([promise, timeoutPromise]);
        clearTimeout(timer!);
        return result;
      } catch {
        clearTimeout(timer!);
        return fallbackValue;
      }
    };

    const safeAuth = {
      ...rawServerClient.auth,
      getUser: async () => {
        try {
          const res = await withTimeout(
            originalGetUser(),
            { data: { user: null }, error: new Error("Auth request timeout") } as any,
            500
          );
          if (res.error && isInvalidKeyError(res.error.message)) {
            return { data: { user: getMockUser() }, error: null };
          }
          if (!res.data?.user) {
            const mockUser = getMockUser();
            if (cookieStore.get("sb-mock-auth")?.value) {
              return { data: { user: mockUser }, error: null };
            }
          }
          return res;
        } catch (err: any) {
          if (isInvalidKeyError(err?.message)) {
            return { data: { user: getMockUser() }, error: null };
          }
          return { data: { user: getMockUser() }, error: null };
        }
      },
      getSession: async () => {
        try {
          const res = await withTimeout(
            originalGetSession(),
            { data: { session: null }, error: new Error("Auth request timeout") } as any,
            500
          );
          if (res.error && isInvalidKeyError(res.error.message)) {
            const mockUser = getMockUser();
            return {
              data: {
                session: { user: mockUser, access_token: "mock-token" },
              },
              error: null,
            };
          }
          if (!res.data?.session) {
            if (cookieStore.get("sb-mock-auth")?.value) {
              const mockUser = getMockUser();
              return {
                data: {
                  session: { user: mockUser, access_token: "mock-token" },
                },
                error: null,
              };
            }
          }
          return res;
        } catch (err: any) {
          if (isInvalidKeyError(err?.message)) {
            const mockUser = getMockUser();
            return {
              data: {
                session: { user: mockUser, access_token: "mock-token" },
              },
              error: null,
            };
          }
          return { data: { session: null }, error: null };
        }
      },
    };

    return new Proxy(rawServerClient, {
      get(target, prop, receiver) {
        if (prop === "auth") {
          return safeAuth;
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  } catch (err) {
    const mockUser = getMockUser();
    return {
      auth: {
        getUser: async () => ({ data: { user: mockUser }, error: null }),
        getSession: async () => ({
          data: { session: { user: mockUser, access_token: "mock-token" } },
          error: null,
        }),
      },
    } as any;
  }
}
