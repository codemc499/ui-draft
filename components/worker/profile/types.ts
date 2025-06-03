// --- Interface Definitions ---
export interface ServiceItemData {
  id: string; // Added ID based on mock data usage
  image: string;
  title: string;
  rating: number;
  reviewCount: number;
  price: number;
}

export interface WorkItemData {
  id?: string;
  title: string;
  description: string;
  genres: string[];
  duration: string;
  bpm: string;
}

export interface ReviewItemData {
  id: string;
  reviewer: string;
  reviewerAvatar: string;
  rating: number;
  date: string;
  contractTitle: string;
  content: string;
  price: number;
}

// Potentially add other profile-related types here later
