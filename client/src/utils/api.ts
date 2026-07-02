const API_BASE = "http://127.0.0.1:8000/api";

const SESSION_KEY = 'pp_session';

// Get the auth token from localStorage session
const getAuthToken = (): string | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw)?.token || null;
  } catch { /* ignore */ }
  return null;
};

// Fetch or generate an anonymous reporter/citizen hash for upvote dedup
export const getCitizenHash = (): string => {
  let hash = localStorage.getItem("pp_citizen_hash");
  if (!hash) {
    hash = "anon_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("pp_citizen_hash", hash);
  }
  return hash;
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText || "API Request failed");
  }

  return response.json();
};

export const uploadMedia = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}/upload`, { method: "POST", body: formData, headers });
  if (!response.ok) throw new Error("File upload failed");

  const data = await response.json();
  return data.url;
};

// ── Issues ──────────────────────────────────────────

export const checkDuplicates = async (
  text: string,
  lat: number,
  lng: number,
  locationName: string,
  category?: string,
) => {
  return apiFetch("/issues/check-duplicate", {
    method: "POST",
    body: JSON.stringify({
      text,
      lat,
      lng,
      location_name: locationName,   // ← Fixed: was missing, causing 422
      source_channel: "web",
      category,
    }),
  });
};

export const createIssue = async (payload: {
  text?: string;
  location_name: string;
  lat: number;
  lng: number;
  voice_url?: string;
  image_urls?: string[];
  source_channel?: string;
}) => {
  return apiFetch("/issues/create", {
    method: "POST",
    body: JSON.stringify({ ...payload, source_channel: payload.source_channel || "web" }),
  });
};

export const getNearbyIssues = async (lat: number, lng: number, radiusKm = 10.0) => {
  return apiFetch(`/issues/nearby?lat=${lat}&lng=${lng}&radius_km=${radiusKm}`);
};

export const getIssueDetail = async (id: string) => {
  const citizenHash = getCitizenHash();
  return apiFetch(`/issues/${id}?citizen_hash=${citizenHash}`);
};

export const upvoteIssue = async (id: string) => {
  const citizenHash = getCitizenHash();
  return apiFetch(`/issues/${id}/upvote`, {
    method: "POST",
    body: JSON.stringify({ citizen_hash: citizenHash }),
  });
};

export const addComment = async (id: string, text: string, voiceUrl?: string, imageUrl?: string) => {
  const citizenHash = getCitizenHash();
  return apiFetch(`/issues/${id}/comment`, {
    method: "POST",
    body: JSON.stringify({ text, citizen_hash: citizenHash, voice_url: voiceUrl, image_url: imageUrl }),
  });
};

// ── Dashboard ────────────────────────────────────────

export const getDashboardIssues = async (filters: {
  category?: string;
  ward?: string;
  status?: string;
  sort_by?: string;
} = {}) => {
  const params = new URLSearchParams();
  if (filters.category) params.append("category", filters.category);
  if (filters.ward) params.append("ward", filters.ward);
  if (filters.status) params.append("status", filters.status);
  if (filters.sort_by) params.append("sort_by", filters.sort_by);
  return apiFetch(`/dashboard/issues?${params.toString()}`);
};

export const getHotspots = async () => apiFetch("/dashboard/hotspots");

export const updateIssueStatus = async (id: string, status: string, note?: string) => {
  return apiFetch(`/issues/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, note }),
  });
};

export const mergeIssues = async (sourceId: string, parentId: string) => {
  return apiFetch(`/issues/${sourceId}/merge`, {
    method: "POST",
    body: JSON.stringify({ parent_issue_id: parentId }),
  });
};
