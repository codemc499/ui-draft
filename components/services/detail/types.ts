// --- Interface Definitions ---
export interface RelatedService {
  id: string; // Added ID based on mock data usage
  title: string;
  rating: number;
  reviews: number;
  price: number;
  // Add image property if needed
}

export interface ReviewUser {
  name: string;
  avatar: string;
  rating: number;
}

export interface Review {
  id: string; // Added ID based on mock data usage
  user: ReviewUser;
  date: string;
  text: string;
  amount: number;
}

// Add other service detail related types if necessary
