export type IssueStatus =
  | 'open'
  | 'under_review'
  | 'planned'
  | 'in_progress'
  | 'resolved'
  | 'hidden';

export type DedupeStatus = 'unique' | 'candidate' | 'duplicate' | 'merged';

export interface ScoreBreakdown {
  community_demand: number;
  infrastructure_gap: number;
  ai_urgency: number;
  vulnerability: number;
  recency: number;
}

export interface IssueRecord {
  id: string;
  title: string;
  raw_text?: string;
  normalized_text?: string;
  summary: string;
  language: string;
  category: string;
  sub_category?: string;
  source_channel: 'web' | 'pwa' | 'whatsapp' | 'sms' | 'admin';
  reporter_hash: string;
  location_name: string;
  ward?: string;
  district?: string;
  state?: string;
  lat: number;
  lng: number;
  dedupe_status: DedupeStatus;
  duplicate_of?: string | null;
  duplicate_confidence?: number | null;
  ai_urgency_score: number;
  priority_score: number;
  upvote_count: number;
  comment_count: number;
  unique_supporter_count: number;
  status: IssueStatus;
  visibility: 'public' | 'staff_only' | 'hidden';
  media_url?: string | null;
  created_at: string;
  updated_at: string;
  score_breakdown: ScoreBreakdown;
  distance_km?: number; // Optional distance from location queries
}

export interface CommentRecord {
  id: string;
  issue_id: string;
  text: string;
  raw_text?: string;
  normalized_text?: string;
  language: string;
  voice_url?: string | null;
  image_url?: string | null;
  author_hash: string;
  ai_note?: string | null;
  created_at: string;
}

export interface UpvoteRecord {
  id: string;
  issue_id: string;
  citizen_hash: string;
  created_at: string;
}

export interface PublicAreaProfile {
  id: string;
  name: string;
  district: string;
  state: string;
  population_estimate: number;
  vulnerability_index: number;
  road_condition_index: number;
  water_points_count: number;
  phc_count: number;
  lat: number;
  lng: number;
}
