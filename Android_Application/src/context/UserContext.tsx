import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";
import { BACKEND_URL } from "@/chat/config";

// Types
export type UserData = {
  id: string;
  clerkuserid: string;
  name: string;
  email: string;
  imageUrl: string;
  healthScore?: number;
  created_at?: string;
  updated_at?: string;
};

type RegisterPayload = {
  clerkUserId: string;
  name: string;
  email: string;
  imageUrl: string;
};

type UserContextType = {
  userData: UserData | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
};

// Create context
const UserContext = createContext<UserContextType>({
  userData: null,
  isLoading: true,
  refreshUser: async () => {},
});

// Provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncUser = async () => {
    if (!user) return;
    setIsLoading(true);
    // console.log(user);

    try {
      const payload: RegisterPayload = {
        clerkUserId: user.id,
        name:
          user.fullName ||
          `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
          user.primaryEmailAddress?.emailAddress?.split("@")[0] ||
          "",
        email: user.primaryEmailAddress?.emailAddress ?? "",
        imageUrl: user.imageUrl,
      };

      const response = await axios.post<{ user: UserData }>(
        `${BACKEND_URL}/api/register`,
        payload
      );

      setUserData(response.data.user);
    } catch (err) {
      console.error("Error syncing user:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) syncUser();
  }, [user]);

  return (
    <UserContext.Provider
      value={{ userData, isLoading, refreshUser: syncUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the context
export function useUserContext() {
  return useContext(UserContext);
}
