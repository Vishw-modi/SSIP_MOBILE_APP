import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useUser } from "@clerk/clerk-expo";
import { BACKEND_URL } from "@/chat/config";

// Payload sent to backend
export interface RegisterPayload {
  clerkUserId: string;
  name: string;
  email: string;
  imageUrl: string;
}

// Structure of user returned from backend
export interface UserData {
  id: string;
  clerkuserid: string; // Note: Supabase columns are lowercase by default
  name: string;
  email: string;
  imageurl: string;
  created_at?: string;
}

// Hook to sync Clerk user with Supabase
export function useSyncUser() {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user || userData || isSyncing) return;

    const syncUser = async () => {
      setIsSyncing(true);
      try {
        const payload: RegisterPayload = {
          clerkUserId: user.id,
          name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          email: user.primaryEmailAddress?.emailAddress ?? "",
          imageUrl: user.imageUrl ?? "",
        };

        const response = await axios.post<{ user: UserData }>(
          `${BACKEND_URL}/api/register`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setUserData(response.data.user);
      } catch (err) {
        const error = err as AxiosError;
        console.error(
          "❌ Error syncing user:",
          error.response?.data || error.message
        );
      } finally {
        setIsSyncing(false);
      }
    };

    syncUser();
  }, [user, isLoaded, userData, isSyncing]);

  return { userData, isSyncing };
}
