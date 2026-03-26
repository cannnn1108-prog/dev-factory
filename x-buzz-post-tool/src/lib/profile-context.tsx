"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

interface Profile {
  id: string;
  display_name: string;
  x_username?: string;
}

interface ProfileContextType {
  profileId: string | null;
  userEmail: string | null;
  loading: boolean;
  profiles: Profile[];
  currentProfile: Profile | null;
  switchProfile: (id: string) => void;
  signOut: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType>({
  profileId: null,
  userEmail: null,
  loading: true,
  profiles: [],
  currentProfile: null,
  switchProfile: () => {},
  signOut: async () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    async function init() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        setUserEmail(user.email || null);

        // Fetch all profiles
        const { data: allProfiles } = await supabase
          .from("profiles")
          .select("id, display_name, x_username")
          .order("created_at", { ascending: true });

        if (allProfiles && allProfiles.length > 0) {
          setProfiles(allProfiles);

          // Check localStorage for last used profile
          const lastUsed = localStorage.getItem("buzz_active_profile_id");
          const validProfile = allProfiles.find((p) => p.id === lastUsed);

          if (validProfile) {
            setProfileId(validProfile.id);
          } else {
            // Default to profile matching user email, or first profile
            const { data: emailProfile } = await supabase
              .from("profiles")
              .select("id")
              .eq("email", user.email)
              .limit(1);

            if (emailProfile && emailProfile.length > 0) {
              setProfileId(emailProfile[0].id);
              localStorage.setItem("buzz_active_profile_id", emailProfile[0].id);
            } else {
              setProfileId(allProfiles[0].id);
              localStorage.setItem("buzz_active_profile_id", allProfiles[0].id);
            }
          }
        } else {
          // Create profile for this user
          const { data: created } = await supabase
            .from("profiles")
            .insert({
              display_name: user.email?.split("@")[0] || "ユーザー",
              email: user.email,
              plan: "free",
            })
            .select("id, display_name, x_username")
            .single();
          if (created) {
            setProfileId(created.id);
            setProfiles([created]);
            localStorage.setItem("buzz_active_profile_id", created.id);
          }
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
        setProfiles([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const switchProfile = (id: string) => {
    setProfileId(id);
    localStorage.setItem("buzz_active_profile_id", id);
  };

  const signOut = async () => {
    localStorage.removeItem("buzz_active_profile_id");
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const currentProfile = profiles.find((p) => p.id === profileId) || null;

  return (
    <ProfileContext.Provider value={{ profileId, userEmail, loading, profiles, currentProfile, switchProfile, signOut }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
