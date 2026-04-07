import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface SocialAccount {
  id: number;
  userId: number;
  platform: string;
  accountName: string;
  accountHandle: string | null;
  credentialType: string;
  status: string;
  lastVerified: string | null;
  lastError: string | null;
  metadata: any;
  hasCredentials: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateSocialAccountData {
  platform: string;
  accountName: string;
  accountHandle?: string;
  apiKey?: string;
  accessToken?: string;
  credentialType?: string;
  metadata?: any;
}

interface UpdateSocialAccountData {
  accountName?: string;
  accountHandle?: string;
  apiKey?: string;
  accessToken?: string;
  status?: string;
  metadata?: any;
}

// Fetch all social accounts for current user
export function useSocialAccounts() {
  return useQuery<SocialAccount[]>({
    queryKey: ["/api/social-accounts"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch social accounts filtered by platform
export function useSocialAccountsByPlatform(platform: string | undefined) {
  return useQuery<SocialAccount[]>({
    queryKey: ["/api/social-accounts/platform", platform],
    queryFn: async () => {
      if (!platform) return [];
      const response = await apiRequest("GET", `/api/social-accounts/platform/${platform}`);
      return response.json();
    },
    enabled: !!platform,
    staleTime: 1000 * 60 * 5,
  });
}

// Create a new social account
export function useCreateSocialAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSocialAccountData) => {
      const response = await apiRequest("POST", "/api/social-accounts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-accounts"] });
    },
  });
}

// Update an existing social account
export function useUpdateSocialAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateSocialAccountData }) => {
      const response = await apiRequest("PUT", `/api/social-accounts/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-accounts"] });
    },
  });
}

// Delete a social account
export function useDeleteSocialAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/social-accounts/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
    },
  });
}

// Verify a social account connection
export function useVerifySocialAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/social-accounts/${id}/verify`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-accounts"] });
    },
  });
}

// Get bots linked to a social account
export function useSocialAccountBots(accountId: number | undefined) {
  return useQuery({
    queryKey: ["/api/social-accounts", accountId, "bots"],
    queryFn: async () => {
      if (!accountId) return [];
      const response = await apiRequest("GET", `/api/social-accounts/${accountId}/bots`);
      return response.json();
    },
    enabled: !!accountId,
  });
}

// Platform display info helper
export const platformInfo: Record<string, { name: string; icon: string; color: string }> = {
  instagram: { name: "Instagram", icon: "camera", color: "#E1306C" },
  tiktok: { name: "TikTok", icon: "music", color: "#000000" },
  facebook: { name: "Facebook", icon: "facebook", color: "#1877F2" },
  twitter: { name: "Twitter/X", icon: "twitter", color: "#1DA1F2" },
  youtube: { name: "YouTube", icon: "youtube", color: "#FF0000" },
};
