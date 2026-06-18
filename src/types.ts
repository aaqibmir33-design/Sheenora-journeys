export interface TourPackage {
  id: string;
  title: string;
  duration: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  category: 'Luxury' | 'Adventure' | 'Honeymoon' | 'Pilgrimage' | 'Offbeat';
  highlights: string[];
  itinerary: { day: number; title: string; details: string }[];
  inclusions: string[];
  exclusions: string[];
  featured: boolean;
  seoDescription: string;
}

export interface Booking {
  id: string;
  packageId?: string;
  packageName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  panCard: string;
  travelDate: string;
  guestsCount: number;
  totalPrice: number;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  customRequirements?: string;
  leadStatus: 'Local Captured' | 'Synced with Zoho CRM' | 'Failed to Sync';
  assignedGuide?: {
    name: string;
    phone: string;
    vehicle: string;
    badgeNumber: string;
  };
  adminNotes?: string;
  createdAt: string;
  // Dynamic nationality and traveler breakdown details
  nationality?: 'Indian' | 'Foreign';
  aadhaarNumber?: string;
  passportNumber?: string;
  hasInfants?: boolean;
  infantDetails?: string;
  otherTravelers?: { name: string; gender: string }[];
}

export interface LeadEnquiry {
  name: string;
  email: string;
  phone: string;
  packageName?: string;
  travelDate: string;
  guestsCount: number;
  customRequirements?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  panCard?: string;
  notes?: string;
  totalBookings: number;
  totalRevenue: number;
  lastActive: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  url: string;
  tags: string[];
  location: string;
  altitude: string;
  lore: string;
}
