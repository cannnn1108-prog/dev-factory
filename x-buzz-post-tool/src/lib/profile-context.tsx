"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

interface ProfileContextType {
  profileId: string | null;
  userEmail: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType>({
  profileId: null,
  userEmail: null,
  loading: true,
  signOut: async () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        setUserEmail(user.email || null);

        // Check for existing profile
        const { data: existing } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", user.email)
          .limit(1);

        if (existing && existing.length > 0) {
          setProfileId(existing[0].id);
        } else {
          // Create profile for this user
          const { data: created } = await supabase
            .from("profiles")
            .insert({
              display_name: user.email?.split("@")[0] || "ユーザー",
              email: user.email,
              plan: "free",
            })
            .select("id")
            .single();
          if (created) setProfileId(created.id);
        }
      } catch (e) {
        console.error("Profile init error:", e);
      } finally {
        setLoading(false);
      }
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setProfileId(null);
        setUserEmail(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <ProfileContext.Provider value={{ profileId, userEmail, loading, signOut }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
