"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getOrCreateProfile } from "./db";

interface ProfileContextType {
  profileId: string | null;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextType>({ profileId: null, loading: true });

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrCreateProfile()
      .then((profile) => {
        if (profile) setProfileId(profile.id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProfileContext.Provider value={{ profileId, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
