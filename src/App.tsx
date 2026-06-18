/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Edit, 
  Printer, 
  Save, 
  Check, 
  X, 
  PhoneCall, 
  Gift, 
  Map, 
  Lock, 
  Info,
  Clock,
  Briefcase,
  Share2,
  RefreshCw,
  Search,
  BookOpen,
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Wind,
  Thermometer,
  ChevronDown,
  ChevronUp,
  Umbrella,
  Eye,
  EyeOff,
  Unlock,
  MoreVertical,
  Menu,
  Mail,
  Send,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { TourPackage, Booking, Customer, GalleryItem } from './types.js';
// @ts-ignore
import sheenoraHeroImg from './assets/images/sheenora_hero_1781313712781.jpg';

// --- Direct API Endpoint Helper ---
export const getApiBaseUrl = () => {
  // 1. Check for standard local or production overrides
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }

  // 2. Intelligently determine base URL based on host environment
  const host = window.location.hostname;
  
  // If running locally
  if (host === 'localhost' || host === '127.0.0.1') {
    // If running in Vite development server (port 5173), direct queries to Express backend running on 3000
    if (window.location.port === '5173') {
      return 'http://localhost:3000';
    }
    return '';
  }

  // 3. Fallback for headless Netlify, Vercel, or custom static page hosts to connect live with pre-production backend
  if (host.includes('netlify.app') || host.includes('vercel.app') || host.includes('github.io')) {
    return 'https://ais-pre-rghhbuvxchifkxpazmoffn-399257180795.europe-west1.run.app';
  }

  // Same-origin default for built Express single-deploy environments
  return '';
};

// --- Weather Helper Utilities & Icons ---
const WeatherIcon = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case 'Sun': return <Sun className={className} />;
    case 'CloudSun': return <Cloud className={`${className} text-amber-300`} />;
    case 'CloudFog': return <CloudFog className={className} />;
    case 'CloudDrizzle': return <CloudDrizzle className={className} />;
    case 'CloudRain': return <CloudRain className={className} />;
    case 'Snowflake': return <Snowflake className={className} />;
    case 'CloudLightning': return <CloudLightning className={className} />;
    default: return <Cloud className={className} />;
  }
};

const getWeatherInfo = (code: number, temp: number, lang: 'EN' | 'HI' = 'EN'): { label: string; advice: string; iconName: string } => {
  const isHi = lang === 'HI';
  if (code === 0) {
    return {
      label: isHi ? 'साफ धूप' : 'Clear Sunny',
      advice: temp > 18 
        ? (isHi ? 'कश्मीर में सुहावना और धूप वाला दिन! डल झील में खूबसूरत शिकारा सैर 🛶 या पहलगाम में घुड़सवारी के लिए आदर्श।' : 'Sunny days in Kashmir! Ideal for a beautiful Dal Lake Shikara ride 🛶 or trekking in Baisaran.') 
        : (isHi ? 'धूप खिली है पर ठंड है! मुग़ल उद्यानों का भ्रमण करने और बेहतरीन तस्वीरें 📸 खींचने के लिए बहुत बढ़िया समय।' : 'Chilly but sunny day! Great time for exploring Mughal gardens and taking photos 📸.'),
      iconName: 'Sun'
    };
  } else if (code >= 1 && code <= 3) {
    return {
      label: isHi ? 'आंशिक रूप से बादल' : 'Mainly Clear / Partly Cloudy',
      advice: isHi 
        ? 'हल्के बादल छाए हुए हैं। गुलमार्ग गोंडोला लिफ्ट टिकट 🚠 और पर्वत दृश्यों के सुंदर दृश्यों के लिए अनुकूल रोशनी की स्थिति।' 
        : 'Mild cloud cover. Perfect light conditions for the Gulmarg Gondola lift ticket 🚠 and mountain landscape sights.',
      iconName: 'CloudSun'
    };
  } else if (code === 45 || code === 48) {
    return {
      label: isHi ? 'कोहरे से ढकी वादियाँ' : 'Foggy Meadows',
      advice: isHi 
        ? 'पहाड़ी राजमार्गों पर रहस्यमयी धुंध और कोहरा है। सुरक्षित रहें; कश्मीरी केसर कहवा ☕ पीने के लिए बिल्कुल सही समय।' 
        : 'Mystic mist & fog on mountain highways. Stay safe; perfect for sipping warm Kashmiri Saffron Kahwa ☕.',
      iconName: 'CloudFog'
    };
  } else if ((code >= 51 && code <= 57) || (code >= 80 && code <= 82)) {
    return {
      label: isHi ? 'बूंदाबांदी / हल्की बौछार' : 'Drizzle / Light Showers',
      advice: isHi 
        ? 'हल्की बौछारें सक्रिय हैं। छाता ले जाने की सलाह दी जाती है ☔। हाउसबोट में आराम करें या कश्मीरी व्यंजनों का आनंद लें।' 
        : 'Slight showers active. Handheld umbrellas recommended ☔. Cozy up in houseboats or join standard wood dining runs.',
      iconName: 'CloudDrizzle'
    };
  } else if (code >= 61 && code <= 67) {
    return {
      label: isHi ? 'लगातार बारिश' : 'Continuous Rain',
      advice: isHi 
        ? 'घाटियों में बारिश हो रही है। स्वादिष्ट स्थानीय भोजन वाज़वान का आनंद लेने और हस्तशिल्प की ख़रीदारी करने का बेहतरीन दिन।' 
        : 'Valleys receiving rain showers. Ideal day to enjoy standard local cuisine Wazwan buffer and wooden crafts shopping.',
      iconName: 'CloudRain'
    };
  } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return {
      label: isHi ? 'मनमोहक हिमपात' : 'Enchanting Snowfall',
      advice: temp < 0 
        ? (isHi ? 'परियों की कहानियों जैसी भारी सर्दियों की बर्फबारी! गुलमार्ग में स्कीइंग और स्लेजिंग करने का अद्भुत मौका।' : 'Fairy-tale heavy winter snow! Extreme beauty. Absolute magical skiing and sledding window in Gulmarg')
        : (isHi ? 'ऊंचे इलाकों में ताजा बर्फबारी! सुंदर दृश्य। गर्म ऊनी फेरन पहनें और शानदार बर्फ सफारी का आनंद लें।' : 'Scenic fresh woolly snowfall in high regions! Bundle up in wool phorans and step into standard snow tours.'),
      iconName: 'Snowflake'
    };
  } else if (code >= 95) {
    return {
      label: isHi ? 'आंधी-तूफान की चेतावनी' : 'Thunderstorm Warning',
      advice: isHi 
        ? 'आंधी-तूफान की चेतावनी सक्रिय है। आलीशान होटलों या तैरते हुए सुइट्स के अंदर सुरक्षित और गर्म रहें।' 
        : 'Thunderstorm alertness active. Stay warm indoors under luxurious pinewood hotel spaces or floating suites.',
      iconName: 'CloudLightning'
    };
  }
  return {
    label: isHi ? 'सुहावनी घाटी की हवाएं' : 'Pleasant Valley Airs',
    advice: isHi 
      ? 'घाटियों में खूबसूरत हवाएँ चल रही हैं। शानदार योजना बनाने का अवसर! हमारी टीम के साथ संपर्क करें।' 
      : 'Beautiful breezes across the valleys. Golden planning window! Speak with Sheenorans to coordinate transfers.',
    iconName: 'Cloud'
  };
};

// --- Mock Translation Dictionary for English and Hindi ---
const translations = {
  EN: {
    tourPackages: 'Our Tour Packages',
    customItineraries: 'Custom Itineraries',
    kashmiriCulture: 'Kashmiri Culture',
    bookingStream: 'Live Booking Stream',
    adminPanelCms: 'Admin Panel CMS',
    exitAdminMode: 'Exit Admin Mode',
    formulateCustomTrip: 'Formulate Custom Trip',
    seoOptimized: 'SEO Optimized',
    heritagePartner: 'Jammu & Kashmir Heritage Tourism Partner',
    unmatchedElegance: 'Unmatched Elegance Since 1994',
    heavenOnEarth: 'The Heaven',
    onEarth: 'On Earth.',
    heroDescription: 'Discover the pristine soul of Jammu & Kashmir through ultra-fast mobile optimized digital booking, royal hospitality heritage, and locally-curated offbeat retreats.',
    securedViaRazorpay: 'Secured via Razorpay',
    localSupport: 'Local Support 24/7',
    srinagarGulmarg: 'Srinagar & Gulmarg',
    exploreCollections: 'Explore Collections',
    preBookedRoutes: 'Pre-booked Tour Routes',
    tailorMade: 'Tailor-Made',
    multiStepCustomizer: 'Multi-step Customizer',
    houseboatHighlight: 'Traditional Luxury Pine-Wood Houseboats',
    houseboatDesc: 'Premium walnut finish dining tables, royal carpets, and direct sunrise views of standard snow mounts.',
    srinagarMasterpiece: 'Srinagar Masterpiece',
    explorers: 'Explorers',
    realTimeClimates: 'Real-Time Alpine Climates',
    compareWeatherTitle: 'Compare Weather for Optimal Travel Dates',
    compareWeatherSubtitle: 'Monitor live updates across Srinagar, Gulmarg, and Pahalgam to synchronize stays, choose scenic shikara routes, or ski periods.',
    refreshClimateFeeds: 'Refresh Climate Feeds',
    plannerCalendar: '5-Day Planner Calendar',
    plannerDesc: 'Analyze day-by-day temperatures to lock in your custom itinerary:',
    today: 'Today',
    coordinationNotice: 'Coordinate your activities according to current climates. Our design assistants can synchronize transfers!',
    formulateRouteBtn: 'Formulate Best Route',
    retryBtn: 'Retry Connection',
    failureNote: 'We are fetching climate backups. High mountain stations might have delays.',
    hidePlanner: 'Hide Planner Grid',
    planChoice: 'Plan Choice Dates (5-Day)',
    clearSunny: 'Clear Sunny',
    partlyCloudy: 'Mainly Clear / Partly Cloudy',
    foggyMeadows: 'Foggy Meadows',
    drizzleLight: 'Drizzle / Light Showers',
    continuousRain: 'Continuous Rain',
    enchantingSnowfall: 'Enchanting Snowfall',
    thunderstormWarning: 'Thunderstorm Warning',
    pleasantBreezes: 'Pleasant Valley Airs',
    catAll: 'All',
    catLuxury: 'Luxury',
    catHoneymoon: 'Honeymoon',
    catAdventure: 'Adventure',
    catOffbeat: 'Offbeat',
    catPilgrimage: 'Pilgrimage',
    exploreHeader: 'Explore J&K Tour Packages',
    exploreSub: 'Each catalog includes experienced mountain drivers, heritage garden permits, pre-booked Gondola slots, and luxury lake retreats. Fully dynamic with real database storage.',
    searchPlaceholder: 'Search valleys, houseboat numbers, snow treks...',
    high: 'High',
    low: 'Low',
    wind: 'Wind',
  },
  HI: {
    tourPackages: 'हमारे टूर पैकेज',
    customItineraries: 'कस्टम यात्रा कार्यक्रम',
    kashmiriCulture: 'कश्मीरी संस्कृति',
    bookingStream: 'लाइव बुकिंग स्ट्रीम',
    adminPanelCms: 'एडम‍िन पैनल सीएमएस',
    exitAdminMode: 'एडमिन मोड से बाहर निकलें',
    formulateCustomTrip: 'कस्टम यात्रा बनाएं',
    seoOptimized: 'एसईओ अनुकूलित',
    heritagePartner: 'जम्मू और कश्मीर विरासत पर्यटन भागीदार',
    unmatchedElegance: '१९९४ से बेजोड़ कश्मीरी लालित्य',
    heavenOnEarth: 'धरती का',
    onEarth: 'स्वर्ग।',
    heroDescription: 'अल्ट्रा-फास्ट मोबाइल अनुकूलित डिजिटल बुकिंग, शाही आतिथ्य विरासत और स्थानीय रूप से क्यूरेटेड ऑफबीट रिट्रीट के माध्यम से जम्मू और कश्मीर की शुद्ध आत्मा की खोज करें।',
    securedViaRazorpay: 'रेज़रपे द्वारा सुरक्षित',
    localSupport: 'स्थानीय सहायता 24/7',
    srinagarGulmarg: 'श्रीनगर और गुलमार्ग',
    exploreCollections: 'यात्राओं का अन्वेषण करें',
    preBookedRoutes: 'प्री-बुक किए गए टूर रूट',
    tailorMade: 'कस्टम निर्मित',
    multiStepCustomizer: 'बहु-चरण कस्टमाइज़र',
    houseboatHighlight: 'पारंपरिक विलासिता देवदार की लकड़ी के हाउसबोट',
    houseboatDesc: 'प्रीमियम अखरोट फिनिश डाइनिंग टेबल, शाही कालीन और बर्फ के पहाड़ों के सीधे सूर्योदय के दृश्य।',
    srinagarMasterpiece: 'श्रीनगर उत्कृष्ट कृति',
    explorers: 'यात्री',
    realTimeClimates: 'वास्तविक समय अल्पाइन जलवायु',
    compareWeatherTitle: 'इष्टतम यात्रा तिथियों के लिए मौसम की तुलना करें',
    compareWeatherSubtitle: 'श्रीनगर, गुलमार्ग, और पहलगाम में लाइव अपडेट की निगरानी करें ताकि रुकना, सुंदर शिकारा मार्ग चुनना, या स्की अवधि को सिंक किया जा सके।',
    refreshClimateFeeds: 'जलवायु फ़ीड रीफ़्रेश करें',
    plannerCalendar: '५-दिवसीय योजनाकार कैलेंडर',
    plannerDesc: 'अपने कस्टम यात्रा कार्यक्रम को सुरक्षित करने के लिए दिन-ब-दिन के तापमान का विश्लेषण करें:',
    today: 'आज',
    coordinationNotice: 'वर्तमान जलवायु के अनुसार अपनी व्यावसायिक गतिविधियों का समन्वय करें। हमारे स्थानीय विशेषज्ञ आपकी सहायता कर सकते हैं!',
    formulateRouteBtn: 'सर्वोत्तम मार्ग तैयार करें',
    retryBtn: 'कनेक्शन पुनः प्रयास करें',
    failureNote: 'हम जलवायु बैकअप ला रहे हैं। ऊंचे पर्वतीय केंद्रों से लाइव अपडेट मिलने में देरी हो सकती है।',
    hidePlanner: 'योजनाकार ग्रिड छुपाएं',
    planChoice: 'चुनिंदा तिथियों की योजना (5-दिवसीय)',
    clearSunny: 'साफ धूप वाला मौसम',
    partlyCloudy: 'आंशिक रूप से बादल छाए रहेंगे',
    foggyMeadows: 'कोहरे वाली वादियाँ',
    drizzleLight: 'बूंदाबांदी या हल्की बौछारें',
    continuousRain: 'लगातार बारिश',
    enchantingSnowfall: 'मनमोहक बर्फबारी',
    thunderstormWarning: 'आंधी-तूफान की चेतावनी',
    pleasantBreezes: 'सुखद घाटी की हवाएं',
    catAll: 'सभी',
    catLuxury: 'लक्जरी',
    catHoneymoon: 'हनीमून',
    catAdventure: 'रोमांच',
    catOffbeat: 'ऑफबीट',
    catPilgrimage: 'तीर्थयात्रा',
    exploreHeader: 'श्रीनगर और कश्मीर टूर पैकेज',
    exploreSub: 'प्रत्येक कैटलॉग में अनुभवी पर्वतीय ड्राइवर, हेरिटेज गार्डन परमिट, प्री-बुक किए गए गोंडोला स्लॉट और लक्जरी लेक रिट्रीट शामिल हैं।',
    searchPlaceholder: 'घाटियों, हाउसबोट नंबरों, बर्फ की ट्रेक को खोजें...',
    high: 'अधिकतम',
    low: 'न्यूनतम',
    wind: 'हवा',
  }
};

export const KASHMIR_GALLERY = [
  {
    title: "Dal Lake Houseboat Twilight",
    url: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80",
    tags: ["Srinagar", "Houseboat", "Waterways", "Savor"],
    location: "Dal Lake, Srinagar",
    altitude: "1,585 meters",
    lore: "Floating timber castles carved in aromatic Himalayan cedar. Watch the golden rays bounce off peaceful waters from your private hand-carved balcony."
  },
  {
    title: "Shikara Ride & Floating Markets",
    url: "https://images.unsplash.com/photo-1598325492994-01369c0d11c0?auto=format&fit=crop&w=800&q=80",
    tags: ["Srinagar", "Shikara", "Culture", "Waterways"],
    location: "Nigeen & Dal Lakes",
    altitude: "1,586 meters",
    lore: "Traditional wooden boats carrying vibrant flowers, fresh local produce, and warm saffron tea. An ancient marketplace humming peacefully at sunrise."
  },
  {
    title: "Gulmarg Gondola & Peak Snow",
    url: "https://images.unsplash.com/photo-1621532408376-78b17a6cfd74?auto=format&fit=crop&w=800&q=80",
    tags: ["Gulmarg", "Snow", "Adventure", "Peaks"],
    location: "Apharwat Peak, Gulmarg",
    altitude: "4,390 meters",
    lore: "The highest cable car in Asia rising through thick pine forests into deep pristine snow fields. A paradise for skiing fanatics and visual seekers."
  },
  {
    title: "Gulmarg Meadows in Summer",
    url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80",
    tags: ["Gulmarg", "Meadows", "Green", "Nature"],
    location: "Gulmarg Highlands",
    altitude: "2,650 meters",
    lore: "A majestic highland meadow blanketed in vibrant wild lupines, daisies, and bluebells. Surrounded by the snow-capped Pir Panjal mountain range."
  },
  {
    title: "Sonamarg Glacier Waters",
    url: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&w=800&q=80",
    tags: ["Sonamarg", "Glacier", "River", "Peaks"],
    location: "Thajiwas Glacier, Sonamarg",
    altitude: "2,740 meters",
    lore: "Where emerald gushing alpine rivers meet ancient frozen glacial ice. Translated literally as the 'Meadow of Gold' due to golden autumn leaves."
  },
  {
    title: "Pahalgam Valley & Lidder River",
    url: "https://images.unsplash.com/photo-1616036740257-9449ea1f6605?auto=format&fit=crop&w=800&q=80",
    tags: ["Pahalgam", "Valley", "River", "Nature"],
    location: "Lidder Valley, Pahalgam",
    altitude: "2,200 meters",
    lore: "Crystal clear glacier streams cascading through towering pine valleys. A timeless shelter of pristine cedarwood paths and gentle mountain wind."
  },
  {
    title: "Autumn Chinar Foliage",
    url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80",
    tags: ["Chinar", "Autumn", "Srinagar", "Nature"],
    location: "Nishat Bagh Mughal Garden",
    altitude: "1,595 meters",
    lore: "Centuries-old giant Chinar trees turning an intense, fiery crimson in November. The crown jewel of royal Kashmiri autumn landscapes."
  },
  {
    title: "Pari Mahal Mughal Gardens",
    url: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80",
    tags: ["Srinagar", "Garden", "Heritage", "Culture"],
    location: "Zabarwan Range, Srinagar",
    altitude: "1,680 meters",
    lore: "The 'Palace of Fairies', a terraced seven-level garden complex built by ancient prince Dara Shikoh. Showcasing breathtaking panoramic observatory lake vistas."
  },
  {
    title: "Amarnath Sacred Peaks",
    url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80",
    tags: ["Pilgrimage", "Peaks", "Trekking", "Adventure"],
    location: "Amarnath Mountain Cave Range",
    altitude: "3,888 meters",
    lore: "A holy glacial sanctuary nestled inside snow-creased rocky mountain canyons, accessed via steep epic trails of high devotion and natural wonder."
  },
  {
    title: "Doodhpathri Valley of Milk",
    url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80",
    tags: ["Doodhpathri", "River", "Meadows", "Nature"],
    location: "Doodhpathri Highlands",
    altitude: "2,730 meters",
    lore: "Gushing crystalline rivers crashing against grey pebbles, creating foam that resembles rich creamy milk. A quiet, pristine pasture land of sheep."
  },
  {
    title: "Yusmarg Hidden Pine Forests",
    url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
    tags: ["Yusmarg", "Forest", "Offbeat", "Nature"],
    location: "Yusmarg Meadows",
    altitude: "2,396 meters",
    lore: "The 'Meadow of Jesus', believed to be one of the most serene pine-shrouded valleys where mountain silence is broken only by musical stream birds."
  },
  {
    title: "Gurez Valley Borderland Forts",
    url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
    tags: ["Gurez", "Cabins", "Offbeat", "Adventure"],
    location: "Dawr, Gurez Valley",
    altitude: "2,400 meters",
    lore: "A spectacular ultra-offbeat valley protected by the mighty Habba Khatoon peak. Home to ancestral wooden log cabins and remote Dardic culture vibes."
  }
];

export default function App() {
  // --- States ---
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>(KASHMIR_GALLERY);
  const [galleryLoading, setGalleryLoading] = useState<boolean>(true);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [showAddGalleryModal, setShowAddGalleryModal] = useState<boolean>(false);
  const [newGalleryItem, setNewGalleryItem] = useState<Omit<GalleryItem, 'id'>>({
    title: '',
    url: '',
    tags: [],
    location: '',
    altitude: '',
    lore: ''
  });
  const [newGalleryTagsInput, setNewGalleryTagsInput] = useState<string>('');
  const [crmActiveTab, setCrmActiveTab] = useState<'bookings' | 'customers'>('bookings');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerSearchQuery, setCustomerSearchQuery] = useState<string>('');
  const [showThreeDotsMenu, setShowThreeDotsMenu] = useState<boolean>(false);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState<boolean>(false);
  
  // Real-time weather state variables
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [selectedWeatherLoc, setSelectedWeatherLoc] = useState<string | null>(null);
  
  // Filtering packages
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Public Photo Album state variables
  const [activePhoto, setActivePhoto] = useState<any | null>(null);
  const [photoFilter, setPhotoFilter] = useState<string>('All');
  const [photoSearch, setPhotoSearch] = useState<string>('');

  // Photo Album helper calculations & handlers
  const filteredPhotos = gallery.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(photoSearch.toLowerCase()) || 
      p.tags.some(t => t.toLowerCase().includes(photoSearch.toLowerCase())) ||
      (p.location && p.location.toLowerCase().includes(photoSearch.toLowerCase()));
    
    if (photoFilter === 'All') return matchesSearch;
    return matchesSearch && p.tags.some(t => t.toLowerCase() === photoFilter.toLowerCase());
  });

  const handleNextPhoto = () => {
    if (!activePhoto) return;
    const currentIndex = gallery.findIndex(p => p.url === activePhoto.url);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % gallery.length;
    setActivePhoto(gallery[nextIndex]);
  };

  const handlePrevPhoto = () => {
    if (!activePhoto) return;
    const currentIndex = gallery.findIndex(p => p.url === activePhoto.url);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + gallery.length) % gallery.length;
    setActivePhoto(gallery[prevIndex]);
  };

  const handlePhotoInquire = (photo: any) => {
    const region = photo.tags[0] || "Srinagar";
    if (!customForm.destinations.includes(region)) {
      setCustomForm({
        ...customForm,
        destinations: [...customForm.destinations, region]
      });
    }
    const element = document.getElementById('trip-formulator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setActivePhoto(null);
    triggerNotification(`Destination ${region} has been added to your Custom Quote planner!`, 'success');
  };

  // Currency switching state and helper function (1 USD = 83.5 INR mockup)
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const USD_EXCHANGE_RATE = 83.5;

  const formatPrice = (priceInINR: number): string => {
    if (currency === 'USD') {
      const priceInUSD = Math.round(priceInINR / USD_EXCHANGE_RATE);
      return `$${priceInUSD.toLocaleString('en-US')}`;
    }
    return `₹${priceInINR.toLocaleString('en-IN')}`;
  };

  // Language state and translation helper
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');

  const t = (key: keyof typeof translations['EN']): string => {
    return translations[language][key] || translations['EN'][key];
  };
  
  // Custom Trip Formulator
  const [step, setStep] = useState<number>(1);
  const [customForm, setCustomForm] = useState({
    destinations: [] as string[],
    travelDate: '',
    guestsCount: 2,
    customRequirements: '',
    estimatedBudget: 35000,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    panCard: '',
    nationality: 'Indian' as 'Indian' | 'Foreign',
    aadhaarNumber: '',
    passportNumber: '',
    hasInfants: false,
    infantDetails: '',
    otherTravelers: [] as { name: string; gender: string }[]
  });

  const [formSubmittedDetails, setFormSubmittedDetails] = useState<any | null>(null);

  // checkout state
  const [activeCheckoutPackage, setActiveCheckoutPackage] = useState<TourPackage | null>(null);
  const [checkoutForm, setCheckoutForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    panCard: '',
    travelDate: '',
    guestsCount: 2,
    customRequirements: '',
    nationality: 'Indian' as 'Indian' | 'Foreign',
    aadhaarNumber: '',
    passportNumber: '',
    hasInfants: false,
    infantDetails: '',
    otherTravelers: [] as { name: string; gender: string }[]
  });

  // Razorpay Checkout Simulation Process
  const [paymentStep, setPaymentStep] = useState<'Idle' | 'CreatingOrder' | 'Verifying' | 'Success' | 'Failed'>('Idle');
  const [paymentLog, setPaymentLog] = useState<string[]>([]);
  const [activeBookingResult, setActiveBookingResult] = useState<Booking | null>(null);

  // Active tour details modal (for day to day view)
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null);
  
  // CMS state
  const [cmsMode, setCmsMode] = useState<boolean>(false);
  const [showAddPackageForm, setShowAddPackageForm] = useState<boolean>(false);
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [newPackage, setNewPackage] = useState({
    title: '',
    duration: '5 Nights / 6 Days',
    price: 25000,
    originalPrice: 32000,
    rating: 5.0,
    reviewsCount: 15,
    category: 'Luxury' as 'Luxury' | 'Adventure' | 'Honeymoon' | 'Pilgrimage' | 'Offbeat',
    highlights: [] as string[],
    newHighlightInput: '',
    seoDescription: '',
    image: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80',
    inclusions: ['Luxury Stay', 'Daily Wazwan Buffet Breakfast', 'Private Cab Sightseeing'] as string[],
    newInclusionInput: '',
    exclusions: ['Flights or High Altitude Permits'] as string[],
    newExclusionInput: '',
    itinerary: [
      { day: 1, title: 'Arrival & Welcome Dinner', details: 'Private reception from airport host, welcome Kahwa tea toast, traditional Kashmiri home dinner.' },
      { day: 2, title: 'Local Srinagar Explorer', details: 'Savor historical gardens, old wooden bridges, floating flower market shikara row.' },
      { day: 3, title: 'Gulmarg Heights', details: 'Check-in to premium heated woodland cottage, enjoy guided snowball tours.' }
    ] as { day: number; title: string; details: string }[]
  });

  // CMS Edit Modals State
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // My Bookings lookup states
  const [searchBookingId, setSearchBookingId] = useState<string>('');
  const [searchedBooking, setSearchedBooking] = useState<any | null>(null);
  const [searchedBookingGuide, setSearchedBookingGuide] = useState<any | null>(null);
  const [isSearchingBooking, setIsSearchingBooking] = useState<boolean>(false);
  const [bookingSearchError, setBookingSearchError] = useState<string>('');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Notification Banner
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Trigger feedback
  const triggerNotification = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(null);
    }, 6000);
  };

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      triggerNotification(
        language === 'HI' 
          ? 'कृपया एक वैध ईमेल पता दर्ज करें।' 
          : 'Please enter a valid email address.', 
        'error'
      );
      return;
    }

    setNewsletterSubmitting(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerNotification(data.message, 'success');
        setNewsletterEmail('');
        fetchBookings();
        fetchCustomers();
      } else {
        triggerNotification(data.error || 'Failed to register subscription.', 'error');
      }
    } catch (err) {
      triggerNotification('Connection error while registering subscription.', 'error');
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  const handleAdminToggle = () => {
    if (cmsMode) {
      setCmsMode(false);
      triggerNotification(language === 'HI' ? 'एडम‍िन मोड बंद कर दिया गया।' : 'Admin panel deactivated.', 'info');
    } else {
      setShowAdminPasswordModal(true);
      setAdminPasswordInput('');
      setPasswordError('');
      setShowPassword(false);
    }
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === 'Aaqibmir33') {
      setCmsMode(true);
      setShowAdminPasswordModal(false);
      triggerNotification(language === 'HI' ? 'एडमिन मोड अधिकृत! स्वागत है, आविक।' : 'Admin mode authorized! Welcome back, Aaqib.', 'success');
    } else {
      setPasswordError(language === 'HI' ? 'अमान्य पासवर्ड। कृपया पुनः प्रयास करें।' : 'Invalid password. Please try again.');
    }
  };

  const handleUpdatePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/packages/${editingPackage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingPackage)
      });
      if (res.ok) {
        triggerNotification(
          language === 'HI' ? 'यात्रा पैकेज विवरण सफलतापूर्वक अपडेट किया गया!' : 'Tour package details updated successfully!',
          'success'
        );
        setEditingPackage(null);
        fetchPackages();
      } else {
        triggerNotification('Failed to save tour package details.', 'error');
      }
    } catch (err) {
      triggerNotification('Network error updating dynamic package details.', 'error');
    }
  };

  const handleUpdateBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/bookings/${editingBooking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingBooking)
      });
      if (res.ok) {
        triggerNotification(
          language === 'HI' ? 'बुकिंग लीड विवरण सफलतापूर्वक अपडेट किया गया!' : 'Booking lead details updated successfully!',
          'success'
        );
        setEditingBooking(null);
        fetchBookings();
      } else {
        triggerNotification('Failed to save booking details.', 'error');
      }
    } catch (err) {
      triggerNotification('Network status error updating booking session.', 'error');
    }
  };

  // --- Fetch API Data ---
  const fetchWeather = async () => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/weather`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setWeatherData(data.weather);
        } else {
          setWeatherError(data.error || "Failed to load location weather.");
        }
      } else {
        setWeatherError("Failed to fetch fresh J&K climate data.");
      }
    } catch (e) {
      setWeatherError("Kashmiri weather router offline.");
    } finally {
      setWeatherLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/packages`);
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch (e) {
      console.error("Failed to fetch packages from server", e);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/bookings`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (e) {
      console.error("Failed to fetch bookings list", e);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/customers`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (e) {
      console.error("Failed to fetch customers list", e);
    }
  };

  const fetchGallery = async () => {
    try {
      setGalleryLoading(true);
      const res = await fetch(`${getApiBaseUrl()}/api/gallery`);
      if (res.ok) {
        const data = await res.json();
        setGallery(data);
      }
    } catch (e) {
      console.error("Failed to fetch gallery from server", e);
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleCreateGalleryItem = async (newItem: Omit<GalleryItem, 'id'>) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (res.ok) {
        const data = await res.json();
        setGallery(prev => [...prev, data]);
        triggerNotification('Photo added to gallery successfully.', 'success');
        return true;
      } else {
        const err = await res.json();
        triggerNotification(err.error || 'Failed to add photo.', 'error');
        return false;
      }
    } catch (e) {
      console.error(e);
      triggerNotification('Network error adding photo.', 'error');
      return false;
    }
  };

  const handleUpdateGalleryItem = async (id: string, updatedFields: Partial<GalleryItem>) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      if (res.ok) {
        const data = await res.json();
        setGallery(prev => prev.map(item => item.id === id ? data : item));
        triggerNotification('Gallery photo updated successfully.', 'success');
        return true;
      } else {
        const err = await res.json();
        triggerNotification(err.error || 'Failed to update photo.', 'error');
        return false;
      }
    } catch (e) {
      console.error(e);
      triggerNotification('Network error updating photo.', 'error');
      return false;
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/gallery/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setGallery(prev => prev.filter(item => item.id !== id));
        triggerNotification('Gallery photo removed successfully.', 'success');
        return true;
      } else {
        const err = await res.json();
        triggerNotification(err.error || 'Failed to delete photo.', 'error');
        return false;
      }
    } catch (e) {
      console.error(e);
      triggerNotification('Network error deleting photo.', 'error');
      return false;
    }
  };

  const exportCustomersToExcel = () => {
    const headers = [
      "Customer ID",
      "Customer Name",
      "Email Address",
      "Contact Phone",
      "PAN Card Verification",
      "Total Bookings Completed",
      "Lifetime Revenue (INR)",
      "Last Active Date",
      "Private CRM Preference Notes"
    ];

    const rows = customers.map(c => [
      c.id,
      c.name,
      c.email,
      c.phone,
      c.panCard || "N/A",
      c.totalBookings.toString(),
      c.totalRevenue.toString(),
      new Date(c.lastActive).toLocaleDateString(),
      c.notes || ""
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Sheenora_Journeys_Customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerNotification(
      language === 'HI' ? 'ग्राहक निर्देशिका एक्सेल स्प्रेडशीट डाउनलोड शुरू हुई!' : 'Customer directory Excel compatibility file download initiated!',
      'success'
    );
  };

  const exportBookingsToExcel = () => {
    const headers = [
      "Booking ID",
      "Selected Package Itinerary",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "PAN Verification ID",
      "Scheduled Travel Date",
      "Guests Count",
      "Total Dynamic Order Price (INR)",
      "Escrow Payment Status",
      "Zoho CRM Sync Status",
      "Traveler Custom Requests",
      "Creation Timestamp"
    ];

    const rows = bookings.map(b => [
      b.id,
      b.packageName,
      b.customerName,
      b.customerEmail,
      b.customerPhone,
      b.panCard || "N/A",
      b.travelDate,
      b.guestsCount.toString(),
      b.totalPrice.toString(),
      b.paymentStatus,
      b.leadStatus,
      b.customRequirements || "",
      b.createdAt
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Sheenora_Journeys_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerNotification(
      language === 'HI' ? 'बुकिंग लेजर एक्सेल स्प्रेडशीट डाउनलोड शुरू हुआ!' : 'Bookings ledger Excel compatibility file download initiated!',
      'success'
    );
  };

  const updateCustomer = async (cust: Customer) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/customers/${cust.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cust)
      });
      if (res.ok) {
        triggerNotification(
          language === 'HI' ? 'ग्राहक प्रोफाइल सफलतापूर्वक अपडेट हो गया।' : 'Customer profile updated successfully.',
          'success'
        );
        fetchCustomers();
        setEditingCustomer(null);
      } else {
        triggerNotification('Failed to update customer details.', 'error');
      }
    } catch (e) {
      triggerNotification('CRM gateway timeout during customer edit.', 'error');
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/customers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerNotification(
          language === 'HI' ? 'ग्राहक प्रोफ़ाइल को सुरक्षित रूप से हटा दिया गया।' : 'Customer profile removed from the secure ledger.',
          'success'
        );
        fetchCustomers();
      } else {
        triggerNotification('Could not purge customer record.', 'error');
      }
    } catch (e) {
      triggerNotification('Server communication failure during deletion.', 'error');
    }
  };

  const syncLeadToZoho = async (bookingId: string) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/bookings/${bookingId}/sync`, { method: 'POST' });
      if (res.ok) {
        triggerNotification(
          language === 'HI' ? 'कस्टमर लीड को जोहो सीआरएम के साथ सफलतापूर्वक सिंक कर दिया गया है!' : 'Customer lead dossier synchronized with Zoho CRM successfully!', 
          'success'
        );
        fetchBookings();
      } else {
        triggerNotification(
          language === 'HI' ? 'जोहो सीआरएम सिंक विफल रहा।' : 'Could not synchronize lead with Zoho CRM database.', 
          'error'
        );
      }
    } catch (e) {
      triggerNotification('CRM cloud gateway connection error.', 'error');
    }
  };

  const deleteBookingLead = async (bookingId: string) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/bookings/${bookingId}`, { method: 'DELETE' });
      if (res.ok) {
        triggerNotification(
          language === 'HI' ? 'बुकिंग रिकॉर्ड सुरक्षित रूप से हटा दिया गया।' : 'Booking record successfully purged from server memory.', 
          'success'
        );
        fetchBookings();
      } else {
        triggerNotification(
          language === 'HI' ? 'रिकॉर्ड हटाने में विफलता।' : 'Could not delete booking record from server.', 
          'error'
        );
      }
    } catch (e) {
      triggerNotification('Local storage synchronization failure.', 'error');
    }
  };

  const handleBookingLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const idToSearch = searchBookingId.trim();
    if (!idToSearch) {
      setBookingSearchError(language === 'HI' ? 'कृपया एक मान्य बुकिंग या पूछताछ आईडी दर्ज करें।' : 'Please enter a valid Booking ID.');
      return;
    }

    setIsSearchingBooking(true);
    setBookingSearchError('');
    setSearchedBooking(null);
    setSearchedBookingGuide(null);

    try {
      const res = await fetch(`${getApiBaseUrl()}/api/bookings-lookup/${idToSearch}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setSearchedBooking(data.booking);
        setSearchedBookingGuide(data.assignedGuide);
        triggerNotification(
          language === 'HI' ? 'बुकिंग इतिहास सफलतापूर्वक लोड हुआ!' : 'Booking itinerary loaded successfully!', 
          'success'
        );
      } else {
        setBookingSearchError(data.error || (language === 'HI' ? 'दी गई आईडी के लिए कोई बुकिंग नहीं मिली।' : 'No booking record found for the provided ID. Please verify your receipt or contact customer service.'));
        triggerNotification(
          language === 'HI' ? 'अभिलेख नहीं मिला' : 'Booking dossier not found', 
          'error'
        );
      }
    } catch (err) {
      setBookingSearchError(language === 'HI' ? 'कक्षा नेटवर्क कनेक्शन त्रुटि।' : 'Network connection failure. Please try again.');
      triggerNotification('CRM Gateway offline.', 'error');
    } finally {
      setIsSearchingBooking(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchBookings();
    fetchCustomers();
    fetchGallery();
    fetchWeather();
  }, []);

  // --- Handling formulator steps ---
  const handleDestinationToggle = (dest: string) => {
    const prev = [...customForm.destinations];
    if (prev.includes(dest)) {
      setCustomForm({ ...customForm, destinations: prev.filter(d => d !== dest) });
    } else {
      setCustomForm({ ...customForm, destinations: [...prev, dest] });
    }
  };

  const handleCustomFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      panCard, 
      travelDate, 
      guestsCount, 
      customRequirements,
      nationality,
      aadhaarNumber,
      passportNumber,
      hasInfants,
      infantDetails,
      otherTravelers,
      estimatedBudget,
      destinations
    } = customForm;

    if (!customerName || !customerEmail || !customerPhone) {
      triggerNotification("Please fill in your name, email and contact phone number.", "error");
      return;
    }

    // National Identity Regulatory Checks for J&K Border Security Protocol
    if (nationality === 'Indian') {
      const cleanAadhaar = (aadhaarNumber || '').replace(/[\s-]/g, '');
      if (!cleanAadhaar) {
        triggerNotification("Primary traveler's Aadhaar Card is compulsory for Indian Nationals under J&K safety regulations.", "error");
        return;
      }
      if (cleanAadhaar.length !== 12 || !/^\d+$/.test(cleanAadhaar)) {
        triggerNotification("Invalid Aadhaar format. It must be a 12-digit number (e.g. 1234 5678 9012).", "error");
        return;
      }
      if (guestsCount > 1) {
        // Family booking: Validate names and genders for guestsCount - 1 extra travelers
        for (let i = 0; i < guestsCount - 1; i++) {
          const traveler = otherTravelers[i];
          if (!traveler || !traveler.name || !traveler.name.trim()) {
            triggerNotification(`Please provide the Full Name of Companion Traveler ${i + 2} in the family checklist.`, "error");
            return;
          }
          if (!traveler.gender) {
            triggerNotification(`Please specify the Gender of Companion Traveler ${i + 2}.`, "error");
            return;
          }
        }
      }
    } else {
      // Foreign National
      if (!passportNumber || !passportNumber.trim()) {
        triggerNotification("Primary traveler's Passport Number is compulsory for Foreign Nationals visiting J&K territory.", "error");
        return;
      }
      if (passportNumber.trim().length < 5) {
        triggerNotification("Please enter a valid Passport Number (must be at least 5 characters).", "error");
        return;
      }
    }

    // Infant Safety check
    if (hasInfants) {
      if (!infantDetails || !infantDetails.trim()) {
        triggerNotification("Please let us know about the infants traveling with you in the infant details section, so we can prepare customized winter blankets & safety cribs.", "error");
        return;
      }
    }

    try {
      const res = await fetch(`${getApiBaseUrl()}/api/custom-trip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          panCard,
          travelDate,
          guestsCount,
          customRequirements: `Destinations: ${destinations.join(', ')}. Details: ${customRequirements}`,
          estimatedBudget,
          nationality,
          aadhaarNumber,
          passportNumber,
          hasInfants,
          infantDetails,
          otherTravelers: otherTravelers.slice(0, guestsCount - 1)
        })
      });

      if (res.ok) {
        const result = await res.json();
        setFormSubmittedDetails(result.booking);
        triggerNotification("Your majestic customized travel plan has been recorded!", "success");
        fetchBookings();
        setStep(3); // success view
      } else {
        triggerNotification("Error submitting your custom plan. Please try again.", "error");
      }
    } catch (err) {
      triggerNotification("Connection failed. Saved offline.", "info");
    }
  };

  // --- Razorpay Payment simulation process ---
  const initiatePrebookingCheckout = (pack: TourPackage) => {
    setActiveCheckoutPackage(pack);
    setCheckoutForm({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      panCard: '',
      travelDate: '',
      guestsCount: 2,
      customRequirements: '',
      nationality: 'Indian',
      aadhaarNumber: '',
      passportNumber: '',
      hasInfants: false,
      infantDetails: '',
      otherTravelers: []
    });
    setPaymentStep('Idle');
    setPaymentLog([]);
  };

  const handleLiveRazorpayPaymentSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      panCard, 
      travelDate, 
      guestsCount, 
      customRequirements,
      nationality,
      aadhaarNumber,
      passportNumber,
      hasInfants,
      infantDetails,
      otherTravelers
    } = checkoutForm;
    
    if (!customerName || !customerEmail || !customerPhone) {
      triggerNotification("Please provide key contact details for your reservation.", "error");
      return;
    }

    // Indian PAN validation regex: 5 Letters, 4 Digits, 1 Letter
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/i;
    if (!panCard) {
      triggerNotification("PAN Card is required due to international travel & high-value tourism regulations in J&K.", "error");
      return;
    }
    if (!panRegex.test(panCard.trim())) {
      triggerNotification("Invalid Indian PAN Card format. Must correspond to standard pattern (e.g., ABCDE1234F).", "error");
      return;
    }

    // National Identity Regulatory Checks for J&K Border Security Protocol
    if (nationality === 'Indian') {
      const cleanAadhaar = (aadhaarNumber || '').replace(/[\s-]/g, '');
      if (!cleanAadhaar) {
        triggerNotification("Primary traveler's Aadhaar Card is compulsory for Indian Nationals under J&K safety regulations.", "error");
        return;
      }
      if (cleanAadhaar.length !== 12 || !/^\d+$/.test(cleanAadhaar)) {
        triggerNotification("Invalid Aadhaar format. It must be a 12-digit number (e.g. 1234 5678 9012).", "error");
        return;
      }
      if (guestsCount > 1) {
        // Family booking: Validate names and genders for guestsCount - 1 extra travelers
        for (let i = 0; i < guestsCount - 1; i++) {
          const traveler = otherTravelers[i];
          if (!traveler || !traveler.name || !traveler.name.trim()) {
            triggerNotification(`Please provide the Full Name of Companion Traveler ${i + 2} in the family checklist.`, "error");
            return;
          }
          if (!traveler.gender) {
            triggerNotification(`Please specify the Gender of Companion Traveler ${i + 2}.`, "error");
            return;
          }
        }
      }
    } else {
      // Foreign National
      if (!passportNumber || !passportNumber.trim()) {
        triggerNotification("Primary traveler's Passport Number is compulsory for Foreign Nationals visiting J&K territory.", "error");
        return;
      }
      if (passportNumber.trim().length < 5) {
        triggerNotification("Please enter a valid Passport Number (must be at least 5 characters).", "error");
        return;
      }
    }

    // Infant Safety check
    if (hasInfants) {
      if (!infantDetails || !infantDetails.trim()) {
        triggerNotification("Please let us know about the infants traveling with you in the infant details section, so we can prepare customized winter blankets & safety cribs.", "error");
        return;
      }
    }

    if (!activeCheckoutPackage) return;

    setPaymentStep('CreatingOrder');
    setPaymentLog(["Sending pre-reservation payload with Border Permit credentials to Sheenora Secure Server...", "Generating custom itinerary invoice with J&K state tax breaks..."]);
    
    try {
      const orderRes = await fetch(`${getApiBaseUrl()}/api/payment/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: activeCheckoutPackage.id,
          packageName: activeCheckoutPackage.title,
          customerName,
          customerEmail,
          customerPhone,
          panCard: panCard.toUpperCase().trim(),
          guestsCount,
          travelDate,
          totalPrice: activeCheckoutPackage.price * guestsCount,
          customRequirements,
          nationality,
          aadhaarNumber,
          passportNumber,
          hasInfants,
          infantDetails,
          otherTravelers: otherTravelers.slice(0, guestsCount - 1)
        })
      });

      if (!orderRes.ok) {
        throw new Error("Unable to establish reservation order session");
      }

      const orderData = await orderRes.json();
      
      setPaymentLog(prev => [
        ...prev,
        `Payment order verified successfully. Order ID: ${orderData.orderId}`,
        "Launching secure Razorpay Payment Gateway modal (Simulating transaction)...",
        `Assigned Test Razorpay Key: ${orderData.keyId}`,
        "Customer accepting payment terms...",
        "Waiting for Razorpay security callback handshake..."
      ]);

      setPaymentStep('Verifying');

      // Wait 3 seconds to simulate user interacting with Razorpay popup
      setTimeout(async () => {
        try {
          const verifyRes = await fetch(`${getApiBaseUrl()}/api/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId: orderData.bookingId,
              razorpayOrderId: orderData.orderId,
              razorpayPaymentId: `pay_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
              razorpaySignature: "simulated_secure_signature_sheenora_j&k_travel",
              simulation: true
            })
          });

          if (verifyRes.ok) {
            const verifyData = await verifyRes.json();
            setPaymentLog(prev => [
              ...prev,
              "Razorpay verified signature secure hash!",
              "Payment authorized successfully! INR Amount received.",
              "Booking successfully stored in secure local datastore!",
              "✓ Ready for Kashmiri local guide assignment!"
            ]);
            setActiveBookingResult(verifyData.booking);
            setPaymentStep('Success');
            triggerNotification(`Booking Completed! Your Kashmiri retreat code is ${orderData.bookingId}`, "success");
            fetchBookings();
          } else {
            setPaymentStep('Failed');
          }
        } catch (error) {
          setPaymentStep('Failed');
        }
      }, 3000);

    } catch (err: any) {
      setPaymentStep('Failed');
      setPaymentLog(prev => [...prev, `Critical error: ${err.message}`]);
    }
  };

  // --- CMS Pack Submission ---
  const handleAddNewPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackage.title) {
      triggerNotification("Provide a descriptive title for this Jammu & Kashmir tour series.", "error");
      return;
    }

    try {
      const res = await fetch(`${getApiBaseUrl()}/api/packages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPackage.title,
          duration: newPackage.duration,
          price: newPackage.price,
          originalPrice: newPackage.originalPrice,
          rating: newPackage.rating || 5.0,
          reviewsCount: newPackage.reviewsCount || 10,
          category: newPackage.category,
          highlights: newPackage.highlights,
          seoDescription: newPackage.seoDescription || `Finest custom tour of Jammu & Kashmir. Premium accommodations in ${newPackage.category} style.`,
          image: newPackage.image,
          inclusions: newPackage.inclusions,
          exclusions: newPackage.exclusions,
          featured: true,
          itinerary: newPackage.itinerary
        })
      });

      if (res.ok) {
        triggerNotification("Sourced new J&K itinerary to CRM and packages directory!", "success");
        setShowAddPackageForm(false);
        setNewPackage({
          title: '',
          duration: '5 Nights / 6 Days',
          price: 25000,
          originalPrice: 32000,
          rating: 5.0,
          reviewsCount: 15,
          category: 'Luxury',
          highlights: [],
          newHighlightInput: '',
          seoDescription: '',
          image: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80',
          inclusions: ['Luxury Stay', 'Daily Wazwan Buffet Breakfast', 'Private Cab Sightseeing'],
          newInclusionInput: '',
          exclusions: ['Flights or High Altitude Permits'],
          newExclusionInput: '',
          itinerary: [
            { day: 1, title: 'Arrival & Welcome Dinner', details: 'Private reception from airport host, welcome Kahwa tea toast, traditional Kashmiri home dinner.' },
            { day: 2, title: 'Local Srinagar Explorer', details: 'Savor historical gardens, old wooden bridges, floating flower market shikara row.' },
            { day: 3, title: 'Gulmarg Heights', details: 'Check-in to premium heated woodland cottage, enjoy guided snowball tours.' }
          ]
        });
        fetchPackages();
      } else {
        triggerNotification("Failed to save tour package details.", "error");
      }
    } catch (err) {
      triggerNotification("Network connection failure during CMS update.", "error");
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm("Are you sure you would like to delete this Jammu & Kashmir itinerary from Sheenora's database?")) return;
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/packages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerNotification("Package removed from tour catalog.", "info");
        fetchPackages();
      }
    } catch (err) {
      triggerNotification("Error reaching database server.", "error");
    }
  };

  // --- Helpers to add/remove dynamic fields in CMS additions ---
  const addHighlightItem = () => {
    if (newPackage.newHighlightInput.trim()) {
      setNewPackage({
        ...newPackage,
        highlights: [...newPackage.highlights, newPackage.newHighlightInput.trim()],
        newHighlightInput: ''
      });
    }
  };

  const removeHighlightItem = (idx: number) => {
    setNewPackage({
      ...newPackage,
      highlights: newPackage.highlights.filter((_, i) => i !== idx)
    });
  };

  const addInclusionItem = () => {
    if (newPackage.newInclusionInput.trim()) {
      setNewPackage({
        ...newPackage,
        inclusions: [...newPackage.inclusions, newPackage.newInclusionInput.trim()],
        newInclusionInput: ''
      });
    }
  };

  const removeInclusionItem = (idx: number) => {
    setNewPackage({
      ...newPackage,
      inclusions: newPackage.inclusions.filter((_, i) => i !== idx)
    });
  };

  const addExclusionItem = () => {
    if (newPackage.newExclusionInput.trim()) {
      setNewPackage({
        ...newPackage,
        exclusions: [...newPackage.exclusions, newPackage.newExclusionInput.trim()],
        newExclusionInput: ''
      });
    }
  };

  const removeExclusionItem = (idx: number) => {
    setNewPackage({
      ...newPackage,
      exclusions: newPackage.exclusions.filter((_, i) => i !== idx)
    });
  };

  // Filter & Search results
  const filteredPackages = packages.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.seoDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div id="sheenora-portal" className="min-h-screen bg-transparent text-slate-900 font-sans leading-relaxed selection:bg-orange-500 selection:text-white relative">
      
      {/* Immersive Kashmir Full-Website Persistent Background Image */}
      <div className="fixed inset-0 -z-10 pointer-events-none select-none" id="kashmir-website-backdrop">
        <img 
          src="https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=1920&q=80" 
          alt="Showing Kashmir Full Backdrop" 
          className="w-full h-full object-cover opacity-25 filter blur-[2px]" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc]/95 via-[#f1f5f9]/90 to-[#e2e8f0]/95"></div>
      </div>

      {/* Decorative Traditional Kashmiri Saffron Header Top Pattern */}
      <div className="h-2 bg-[#F4C430] w-full relative z-40" id="heritage-border"></div>

      {/* Dynamic Notification Popup */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce max-w-md w-full px-4">
          <div className={`p-4 rounded-xl shadow-2xl flex items-center gap-3 border ${
            notification.type === 'success' ? 'bg-[#002366] text-white border-[#F4C430]' :
            notification.type === 'error' ? 'bg-red-900 text-white border-red-500' : 'bg-amber-100 text-[#002366] border-[#F4C430]/50'
          }`}>
            {notification.type === 'success' ? <Sparkles className="text-[#F4C430] shrink-0" /> : <AlertCircle className="text-red-300 shrink-0" />}
            <span className="text-sm font-semibold">{notification.text}</span>
          </div>
        </div>
      )}

      {/* NAVIGATION BAR - Sleek "Three Dots Menu Only" Luxurious Style */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md z-45 border-b border-[#F4C430]/20 shadow-lg relative" id="main-nav-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Logo Brand on Left */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#002366] rounded-full flex items-center justify-center text-[#F4C430] font-sans font-bold text-xl border-2 border-[#F4C430] shadow-md shrink-0">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-tight text-[#002366]">
                  Sheenora <span className="text-[#F4C430]">Journeys</span>
                </span>
                <span className="hidden sm:inline-block bg-orange-100 text-orange-850 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest border border-[#F4C430]/50 font-mono uppercase">
                  {t('seoOptimized')}
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-550 font-mono">
                {t('heritagePartner')}
              </p>
            </div>
          </div>

          {/* Three Dots Menu & Settings Trigger on Right */}
          <div className="relative">
            <button
              id="three-dots-btn"
              type="button"
              onClick={() => setShowThreeDotsMenu(!showThreeDotsMenu)}
              className="p-3 bg-[#002366] hover:bg-[#F4C430] text-[#F4C430] hover:text-[#002366] rounded-full shadow-lg border border-[#F4C430]/30 transition-all cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#F4C430]"
              title="Toggle Menu"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Floating Dropdown Dialog with animation */}
            <AnimatePresence>
              {showThreeDotsMenu && (
                <>
                  {/* Backdrop Click Shield */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowThreeDotsMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-3 bg-white/95 backdrop-blur-xl border border-[#F4C430]/40 rounded-2xl shadow-2xl p-6 w-80 z-50 text-slate-850 font-sans space-y-5"
                  >
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#002366] font-mono">
                        {language === 'HI' ? 'मेनू और सेटिंग्स' : 'Navigation & Settings'}
                      </h4>
                      <button 
                        onClick={() => setShowThreeDotsMenu(false)}
                        className="text-slate-400 hover:text-slate-650 p-1 rounded-full hover:bg-slate-50"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Navigation Direct Anchors */}
                    <nav className="flex flex-col gap-2">
                      <a 
                        href="#discover-packages" 
                        onClick={() => setShowThreeDotsMenu(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold uppercase text-slate-700 hover:text-white hover:bg-[#002366] transition-all"
                      >
                        <MapPin className="w-4 h-4 text-[#F4C430] shrink-0" />
                        {t('tourPackages')}
                      </a>
                      <a 
                        href="#trip-formulator" 
                        onClick={() => setShowThreeDotsMenu(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold uppercase text-slate-700 hover:text-white hover:bg-[#002366] transition-all"
                      >
                        <Compass className="w-4 h-4 text-[#F4C430] shrink-0" />
                        {t('customItineraries')}
                      </a>
                      <a 
                        href="#scenic-photo-album" 
                        onClick={() => setShowThreeDotsMenu(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold uppercase text-slate-700 hover:text-white hover:bg-[#002366] transition-all"
                      >
                        <svg className="w-4 h-4 text-[#F4C430] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {language === 'HI' ? 'दर्शनीय फोटो एलबम' : 'Scenic Photo Album'}
                      </a>
                      <a 
                        href="#heritage-diaries" 
                        onClick={() => setShowThreeDotsMenu(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold uppercase text-slate-700 hover:text-white hover:bg-[#002366] transition-all"
                      >
                        <Sparkles className="w-4 h-4 text-[#F4C430] shrink-0" />
                        {t('kashmiriCulture')}
                      </a>
                      <a 
                        href="#my-bookings" 
                        onClick={() => setShowThreeDotsMenu(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold uppercase text-slate-700 hover:text-white hover:bg-[#002366] transition-all font-sans"
                      >
                        <Briefcase className="w-4 h-4 text-[#F4C430] shrink-0" />
                        {language === 'HI' ? 'मेरी बुकिंग' : 'My Bookings'}
                      </a>
                      <a 
                        href="#leads-board" 
                        onClick={() => setShowThreeDotsMenu(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold uppercase text-slate-700 hover:text-white hover:bg-[#002366] transition-all"
                      >
                        <Clock className="w-4 h-4 text-[#F4C430] shrink-0" />
                        {t('bookingStream')}
                      </a>
                    </nav>

                    <hr className="border-slate-100" />

                    {/* Integrated Controls (Currency) */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                        {language === 'HI' ? 'मुद्रा कनवर्टर' : 'Currency Selector'}
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-150">
                        <button
                          type="button"
                          onClick={() => { setCurrency('INR'); setShowThreeDotsMenu(false); }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all cursor-pointer ${
                            currency === 'INR' 
                              ? 'bg-[#002366] text-white shadow-sm' 
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          ₹ INR
                        </button>
                        <button
                          type="button"
                          onClick={() => { setCurrency('USD'); setShowThreeDotsMenu(false); }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all cursor-pointer ${
                            currency === 'USD' 
                              ? 'bg-[#002366] text-white shadow-sm' 
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          $ USD
                        </button>
                      </div>
                    </div>

                    {/* Integrated Controls (Language) */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                        {language === 'HI' ? 'भाषा चुनें' : 'Language Setup'}
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-150">
                        <button
                          type="button"
                          onClick={() => { setLanguage('EN'); setShowThreeDotsMenu(false); }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all cursor-pointer ${
                            language === 'EN' 
                              ? 'bg-[#002366] text-white shadow-sm' 
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          EN (Eng)
                        </button>
                        <button
                          type="button"
                          onClick={() => { setLanguage('HI'); setShowThreeDotsMenu(false); }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all cursor-pointer ${
                            language === 'HI' 
                              ? 'bg-[#002366] text-white shadow-sm' 
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          हिन्दी
                        </button>
                      </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Dynamic CRM toggle */}
                    <button 
                      type="button"
                      onClick={() => { handleAdminToggle(); setShowThreeDotsMenu(false); }} 
                      className={`w-full py-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer ${
                        cmsMode 
                          ? 'bg-[#F4C430] text-[#002366] border-[#002366]' 
                          : 'bg-slate-50 hover:bg-[#002366] hover:text-white border-slate-200 text-[#002366]'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      {cmsMode ? t('exitAdminMode') : t('adminPanelCms')}
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

        </div>
      </header>

      {/* HERO SECTION - Featuring Beautiful Kashmiri Scenery & Star Motif */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#001130] via-[#002366] to-[#011c4e] text-white py-20 lg:py-28" id="home-hero">
        {/* Ambient radial blur backdrops for boutique-agency editorial aesthetics */}
        <div className="absolute top-12 left-12 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-8 right-12 w-96 h-96 bg-[#F4C430]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: "radial-gradient(#F4C430 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
        
        {/* Exquisite subtle geometric rotating star icon overlay */}
        <div className="absolute right-0 top-6 w-1/3 h-full opacity-[0.08] flex justify-center items-center pointer-events-none select-none">
          <svg width="450" height="450" viewBox="0 0 100 100" fill="currentColor" className="text-[#F4C430] animate-spin-slow">
            <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          
          <motion.div 
            className="lg:col-span-7 space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-[#F4C430]/15 border border-[#F4C430]/35 rounded-full px-4 py-1.5 backdrop-blur-md animate-fade-in">
              <Sparkles className="w-4 h-4 text-[#F4C430]" />
              <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-[#F4C430] font-mono">{t('unmatchedElegance')}</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold tracking-tight leading-[1.05] text-white">
              {t('heavenOnEarth')}<br />
              <span className="text-[#F4C430] bg-clip-text text-transparent bg-gradient-to-r from-[#F4C430] to-amber-300 drop-shadow-sm">{t('onEarth')}</span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-200 font-serif italic max-w-xl border-l-4 border-[#F4C430] pl-6 py-2 leading-relaxed">
              "{t('heroDescription')}"
            </p>

            <div className="flex flex-wrap gap-3 text-[10px] sm:text-xs font-mono text-slate-300">
              <span className="bg-slate-950/65 border border-slate-800/80 px-3.5 py-2 rounded-xl flex items-center gap-2 backdrop-blur-sm shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#F4C430]" /> {t('securedViaRazorpay')}
              </span>
              <span className="bg-slate-950/65 border border-slate-800/80 px-3.5 py-2 rounded-xl flex items-center gap-2 backdrop-blur-sm shadow-sm">
                <Users className="w-4 h-4 text-[#F4C430]" /> {t('localSupport')}
              </span>
              <span className="bg-slate-950/65 border border-slate-800/80 px-3.5 py-2 rounded-xl flex items-center gap-2 backdrop-blur-sm shadow-sm">
                <MapPin className="w-4 h-4 text-[#F4C430]" /> {t('srinagarGulmarg')}
              </span>
            </div>

            {/* Quick luxurious interactive CTA cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl pt-2">
              <a href="#discover-packages" className="flex items-center justify-between bg-white text-[#002366] hover:bg-[#F4C430] hover:text-[#002366] p-5 rounded-2xl font-bold font-serif transition-all duration-300 shadow-xl hover:-translate-y-1 group">
                <div>
                  <span className="text-[10px] uppercase block text-slate-500 font-mono font-bold tracking-widest mb-0.5">{t('exploreCollections')}</span>
                  <span className="text-base font-extrabold tracking-tight">{t('preBookedRoutes')}</span>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform text-slate-400 group-hover:text-[#002366]" />
              </a>

              <a href="#trip-formulator" className="flex items-center justify-between bg-gradient-to-r from-[#F4C430] to-amber-400 text-[#002366] hover:brightness-110 p-5 rounded-2xl font-bold font-serif transition-all duration-300 shadow-xl hover:-translate-y-1 shadow-[#F4C430]/10 group">
                <div>
                  <span className="text-[10px] uppercase block text-[#002366]/75 font-mono font-bold tracking-widest mb-0.5">{t('tailorMade')}</span>
                  <span className="text-base font-extrabold tracking-tight">{t('multiStepCustomizer')}</span>
                </div>
                <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform shrink-0" />
              </a>
            </div>
          </motion.div>

          {/* Interactive Hero Media Card Stack / Layered Glass Photo */}
          <motion.div 
            className="lg:col-span-5 relative mt-8 lg:mt-0"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {/* Soft decorative shadow circle underneath card */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-[#F4C430] to-transparent rounded-3xl opacity-20 blur-2xl"></div>
            
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#F4C430] shadow-2xl bg-slate-900/40 p-2.5 backdrop-blur-md">
              <div className="relative rounded-xl overflow-hidden group">
                <img 
                  src={sheenoraHeroImg} 
                  alt="Majestic Dal Lake Kashmir" 
                  className="w-full h-80 sm:h-96 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                />
                {/* Visual shade gradient overlay over photo */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
              </div>

              <div className="p-4 text-white font-serif">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono uppercase bg-white/10 text-white px-2.5 py-1 font-bold rounded-lg border border-white/20 backdrop-blur-md">
                    {t('srinagarMasterpiece')}
                  </span>
                  <span className="flex items-center text-[#F4C430] gap-0.5 text-xs">
                    <Star className="fill-[#F4C430] w-3.5 h-3.5" />
                    <Star className="fill-[#F4C430] w-3.5 h-3.5" />
                    <Star className="fill-[#F4C430] w-3.5 h-3.5" />
                    <Star className="fill-[#F4C430] w-3.5 h-3.5" />
                    <Star className="fill-[#F4C430] w-3.5 h-3.5" />
                    <span className="text-slate-300 font-mono text-[10px] ml-1">(4.9/5)</span>
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white leading-tight">{t('houseboatHighlight')}</h3>
                <p className="text-xs text-slate-300 mt-1.5 italic font-sans">
                  {t('houseboatDesc')}
                </p>
              </div>
            </div>

            {/* Float badge with double border and government registry tags */}
            <div className="absolute -bottom-6 sm:-left-6 left-4 bg-white text-[#002366] p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 border-2 border-[#F4C430] animate-bounce-slow">
              <div className="text-center bg-[#F4C430]/15 px-3 py-1.5 rounded-xl border border-[#F4C430]/30 shrink-0">
                <span className="text-xl font-extrabold block font-mono text-[#002366] leading-none mb-1">1.2k+</span>
                <span className="text-[8px] uppercase tracking-widest font-extrabold font-mono text-[#002366]">{t('explorers')}</span>
              </div>
              <div className="text-xs text-left">
                <p className="font-bold text-[#002366] flex items-center gap-1">🛡️ Govt. Verified</p>
                <p className="text-[9px] text-slate-500 font-semibold font-mono tracking-wide mt-0.5">J&K Tourism Regd No: 2942/JK</p>
              </div>
            </div>
          </motion.div>
{/* Real-Time J&K Travel Weather Planner */}
          <div className="lg:col-span-12 mt-12 pt-10 border-t border-white/10" id="hero-weather-planner">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-[#F4C430] flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-[#F4C430]" /> {t('realTimeClimates')}
                  </h4>
                </div>
                <h3 className="text-2xl font-serif font-bold text-white">{t('compareWeatherTitle')}</h3>
                <p className="text-xs text-slate-300 max-w-2xl">
                  {t('compareWeatherSubtitle')}
                </p>
              </div>
              
              <button 
                onClick={fetchWeather}
                disabled={weatherLoading}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-mono font-bold transition-all disabled:opacity-50 shrink-0 self-start md:self-center"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#F4C430] ${weatherLoading ? 'animate-spin' : ''}`} />
                {t('refreshClimateFeeds')}
              </button>
            </div>

            {weatherLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 h-48 animate-pulse flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-700 w-1/3 rounded"></div>
                      <div className="h-3 bg-slate-800 w-2/3 rounded"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-10 bg-slate-700 w-16 rounded flex items-center justify-center">N/A</div>
                      <div className="h-8 bg-slate-800 w-8 rounded-full"></div>
                    </div>
                    <div className="h-6 bg-slate-700 w-full rounded"></div>
                  </div>
                ))}
              </div>
            ) : weatherError ? (
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center text-slate-350">
                <AlertCircle className="w-8 h-8 text-[#F4C430] mx-auto mb-2" />
                <p className="text-sm font-semibold">{weatherError}</p>
                <p className="text-xs text-slate-500 mt-1 mb-4">{t('failureNote')}</p>
                <button 
                  onClick={fetchWeather}
                  className="px-4 py-2 bg-[#F4C430] text-[#002366] text-xs font-bold font-mono rounded-lg hover:bg-white transition-colors"
                >
                  {t('retryBtn')}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 3 Columns Locations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {weatherData.map((loc) => {
                    const wInfo = getWeatherInfo(loc.weathercode, loc.temperature, language);
                    const isSelected = selectedWeatherLoc === loc.name;
                    
                    return (
                      <div 
                        key={loc.name}
                        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                          isSelected 
                            ? 'bg-slate-900/80 border-[#F4C430] shadow-xl shadow-[#F4C430]/5 scale-[1.01]' 
                            : 'bg-slate-900/40 border-white/5 hover:border-white/15'
                        }`}
                      >
                        {/* Climate Accent Bar */}
                        <div className={`h-1.5 w-full ${
                          loc.name === 'Gulmarg' ? 'bg-sky-450' :
                          loc.name === 'Pahalgam' ? 'bg-emerald-550' : 'bg-amber-450'
                        }`}></div>

                        <div className="p-5 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-base font-bold text-white flex items-center gap-1.5 font-serif">
                                <MapPin className="w-4 h-4 text-[#F4C430] shrink-0" />
                                {loc.name}
                              </h4>
                              <span className="text-[10px] font-semibold text-slate-400 font-mono">
                                {loc.name === 'Srinagar' ? 'Mughal Valleys & Dal Lake 🛶' :
                                 loc.name === 'Gulmarg' ? 'High Gondolas & Snow Sports ❄️' :
                                 'Baisaran Pines & Rivers 🏔️'}
                              </span>
                            </div>
                            
                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#F4C430]">
                              <WeatherIcon name={wInfo.iconName} className="w-6 h-6" />
                            </div>
                          </div>

                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="text-4xl font-bold text-white tracking-tight font-mono">
                                {loc.temperature !== null ? `${loc.temperature.toFixed(1)}°` : 'N/A'}
                              </span>
                              <span className="text-base font-semibold text-[#F4C430] ml-1 font-mono">C</span>
                              <p className="text-xs font-semibold text-slate-300 mt-1">{wInfo.label}</p>
                            </div>

                            <div className="text-slate-400 text-[11px] font-mono text-right space-y-0.5">
                              <p className="flex items-center gap-1 justify-end">
                                <Thermometer className="w-3.5 h-3.5 text-red-400" />
                                {t('high')}: {loc.tempMax !== null ? `${loc.tempMax.toFixed(0)}°` : 'N/A'}
                              </p>
                              <p className="flex items-center gap-1 justify-end">
                                <Thermometer className="w-3.5 h-3.5 text-sky-400" />
                                {t('low')}: {loc.tempMin !== null ? `${loc.tempMin.toFixed(0)}°` : 'N/A'}
                              </p>
                              <p className="flex items-center gap-1 justify-end">
                                <Wind className="w-3.5 h-3.5 text-[#F4C430]" />
                                {t('wind')}: {loc.windspeed !== null ? `${loc.windspeed.toFixed(0)} km/h` : 'N/A'}
                              </p>
                            </div>
                          </div>

                          {/* Advice Widget */}
                          <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                            loc.name === 'Gulmarg' ? 'bg-sky-950/40 text-sky-200 border border-sky-800/30' :
                            loc.name === 'Pahalgam' ? 'bg-emerald-950/40 text-emerald-200 border border-emerald-800/30' :
                            'bg-amber-950/40 text-amber-200 border border-amber-850/30'
                          }`}>
                            <Umbrella className="w-4 h-4 shrink-0 mt-0.5" />
                            <p className="leading-snug">{wInfo.advice}</p>
                          </div>

                          {/* View Planner Tool */}
                          <button
                            onClick={() => setSelectedWeatherLoc(isSelected ? null : loc.name)}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 border ${
                              isSelected
                                ? 'bg-[#F4C430] text-[#002366] border-[#F4C430]'
                                : 'bg-white/5 text-slate-200 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            {isSelected ? t('hidePlanner') : t('planChoice')}
                            {isSelected ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 5-Day Chronometer Planner Block */}
                {selectedWeatherLoc && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="bg-slate-900/60 border border-[#F4C430]/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4">
                      <button 
                        onClick={() => setSelectedWeatherLoc(null)}
                        className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <h5 className="text-base font-bold text-white mb-2 font-serif flex items-center gap-2">
                      <Calendar className="text-[#F4C430] w-4 h-4" />
                      5-Day Planner Calendar: {selectedWeatherLoc}
                    </h5>
                    <p className="text-xs text-slate-400 mb-6 font-mono max-w-xl">
                      Analyze day-by-day temperatures in {selectedWeatherLoc} to lock in your custom itinerary:
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      {weatherData.find(loc => loc.name === selectedWeatherLoc)?.dailyForecasts.map((day: any, dIdx: number) => {
                        const dayWInfo = getWeatherInfo(day.weathercode, day.tempMax);
                        const dateObj = new Date(day.date);
                        const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                        
                        const isToday = dIdx === 0;

                        return (
                          <div 
                            key={day.date}
                            className={`p-4 rounded-xl text-center border space-y-3 transition-colors ${
                              isToday ? 'bg-[#F4C430]/10 border-[#F4C430]' : 'bg-white/5 border-white/5'
                            }`}
                          >
                            <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                              {formattedDate}
                              {isToday && <span className="block text-[9px] text-[#F4C430] font-sans font-extrabold uppercase tracking-widest mt-0.5">Today</span>}
                            </p>

                            <div className="flex justify-center text-[#F4C430]">
                              <WeatherIcon name={dayWInfo.iconName} className="w-8 h-8" />
                            </div>

                            <div className="font-mono space-y-0.5">
                              <p className="text-sm font-bold text-white">{day.tempMax?.toFixed(0)}°C</p>
                              <p className="text-[10px] text-slate-400 font-semibold">Low: {day.tempMin?.toFixed(0)}°C</p>
                            </div>

                            <hr className="border-white/10" />

                            <div>
                              <span className="text-[10px] font-bold text-slate-300 block mb-1">
                                {dayWInfo.label}
                              </span>
                              <span className="text-[9px] text-slate-400 block leading-tight font-sans italic">
                                {day.weathercode === 0 ? 'Optimal Travel Day' :
                                 day.weathercode <= 3 ? 'Clear Travel Window' :
                                 day.weathercode <= 57 ? 'Mild Rain/Slight Drizzle' :
                                 day.weathercode <= 67 ? 'Heavy rain - stay warm' :
                                 day.weathercode <= 86 ? 'Scenic Snow Day! ❄' : 'Indoor Day'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 p-4 rounded-xl bg-[#001c52]/80 border border-[#F4C430]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-serif text-slate-200">
                      <p className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#F4C430] shrink-0" />
                        <span>Coordinate your activities according to current climates. Our design assistants can synchronize transfers!</span>
                      </p>
                      <a 
                        href="#trip-formulator"
                        onClick={() => setSelectedWeatherLoc(null)}
                        className="px-4 py-2 rounded-lg bg-[#F4C430] hover:bg-white text-[#002366] font-mono font-bold uppercase tracking-wider text-[11px] transition-all shrink-0 text-center"
                      >
                        Formulate Best Route
                      </a>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16" id="main-content">

        {/* SECTION: MULTI-STEP TRIP FORMULATOR */}
        <section id="trip-formulator" className="scroll-mt-24">
          <div className="bg-[#002366] text-white rounded-3xl overflow-hidden shadow-2xl border-2 border-[#F4C430] relative grid grid-cols-1 lg:grid-cols-12">
            
            {/* Background design accents */}
            <div className="absolute inset-0 opacity-5 bg-kashmiri-grid pointer-events-none"></div>

            {/* STEP INFO SIDEBAR - Luxurious Left Banner (35% columns) */}
            <div className="lg:col-span-4 p-8 sm:p-12 bg-[#001c52] border-b lg:border-b-0 lg:border-r border-[#F4C430]/30 flex flex-col justify-between relative">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-xl bg-[#F4C430]/10 flex items-center justify-center text-[#F4C430] border border-[#F4C430]/30">
                  <Compass className="w-6 h-6" />
                </div>
                
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#F4C430] font-bold">Kashmir Heritage Builder</span>
                  <h2 className="text-3xl font-serif font-semibold mt-1">
                    Design Your Legacy J&K Itinerary
                  </h2>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed font-serif italic pr-4">
                  "No automated generic template fits the diverse wonders of the Kashmir valley. Settle locations, configure estimated budget, submit details and watch your design synchronized directly to our certified local desk."
                </p>
              </div>

              {/* Progress Steps Indicators visually */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-colors ${
                    step >= 1 ? 'bg-[#F4C430] text-[#002366] border-[#F4C430]' : 'border-slate-500 text-slate-400'
                  }`}>1</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">Step 1: Destinations</p>
                    <p className="text-[10px] text-slate-400 font-mono">Select scenic valleys & meadows</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-colors ${
                    step >= 2 ? 'bg-[#F4C430] text-[#002366] border-[#F4C430]' : 'border-slate-600 text-slate-500'
                  }`}>2</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">Step 2: Traveler Specs</p>
                    <p className="text-[10px] text-slate-400 font-mono">Dates, Guests & Indian PAN verification</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-colors ${
                    step >= 3 ? 'bg-[#F4C430] text-[#002366] border-[#F4C430]' : 'border-slate-600 text-slate-500'
                  }`}>3</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">Step 3: Custom Quote Proposal</p>
                    <p className="text-[10px] text-slate-400 font-mono">Print ticket & reserve local slot</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-[10px] text-slate-400 font-mono">
                <span>Sheenora Secure Formulator v4.1</span>
              </div>
            </div>

            {/* FORM CARD (8 cols) */}
            <div className="lg:col-span-8 p-8 sm:p-12 bg-white text-[#002366]">
              {step === 1 && (
                <motion.div 
                  initial={{ opacity: 0, x: 15 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="space-y-6"
                >
                  <div>
                    <span className="text-xs uppercase font-mono font-bold bg-[#F4C430]/10 text-orange-700 px-3 py-1 rounded">Interactive Step 1 of 2</span>
                    <h3 className="text-2xl font-serif font-bold mt-2 text-[#002366]">Which valleys would you like to explore?</h3>
                    <p className="text-sm text-slate-500 mt-1">Configure your destination wishlist. You can pick multiple regions.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {[
                      { id: 'sri', label: 'Srinagar & Lakes', desc: 'Floating gardens, wooden bridges, Mughal fountains.' },
                      { id: 'gul', label: 'Gulmarg Heights', desc: 'Highest cable car Gondola, snow sports.' },
                      { id: 'pah', label: 'Pahalgam Rivers', desc: 'Baisaran pine hike, rushing Lidder waters.' },
                      { id: 'son', label: 'Sonamarg Meadows', desc: 'Permanent Thajiwas glaciers, golden peaks.' },
                      { id: 'off', label: 'Offbeat Gurez Border', desc: 'Habba Khatoon mountain, Dardic wood homes.' },
                      { id: 'lol', label: 'Prisital Lolab Valley', desc: 'Ancient Kalaroos rock caves, pure cedar.' }
                    ].map((item) => {
                      const isSelected = customForm.destinations.includes(item.label);
                      return (
                        <div 
                          key={item.id}
                          onClick={() => handleDestinationToggle(item.label)}
                          className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${
                            isSelected ? 'bg-orange-50/50 border-[#F4C430] shadow-sm' : 'border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-sm block">{item.label}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'bg-[#F4C430] border-[#F4C430] text-[#002366]' : 'border-slate-300'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                          <span className="text-xs text-slate-500 block leading-snug">{item.desc}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-mono">
                      Selected: <strong className="text-[#002366]">{customForm.destinations.length} destinations</strong>
                    </span>
                    <button
                      onClick={() => {
                        if (customForm.destinations.length === 0) {
                          triggerNotification("Please select at least one spectacular J&K destination to continue.", "info");
                          return;
                        }
                        setStep(2);
                      }}
                      className="bg-[#002366] hover:bg-[#F4C430] hover:text-[#002366] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
                    >
                      Next Step <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.form 
                  onSubmit={handleCustomFormSubmit} 
                  initial={{ opacity: 0, x: 15 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="space-y-6"
                >
                  <div>
                    <span className="text-xs uppercase font-mono font-bold bg-[#F4C430]/10 text-orange-700 px-3 py-1 rounded">Interactive Step 2 of 2</span>
                    <h3 className="text-2xl font-serif font-bold mt-2 text-[#002366]">Fill Traveler Specifications</h3>
                    <p className="text-sm text-slate-500 mt-1">We link your requirements to our local Kashmir guide desks instantly.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Primary client logs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#002366]/60 tracking-wider block mb-1">Full Name *</label>
                        <input 
                          type="text" 
                          required
                          value={customForm.customerName}
                          onChange={(e) => setCustomForm({ ...customForm, customerName: e.target.value })}
                          placeholder="Your complete name" 
                          className="w-full border-b-2 border-slate-200 focus:border-[#F4C430] py-2 focus:outline-none text-sm transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#002366]/60 tracking-wider block mb-1">Email Address *</label>
                        <input 
                          type="email" 
                          required
                          value={customForm.customerEmail}
                          onChange={(e) => setCustomForm({ ...customForm, customerEmail: e.target.value })}
                          placeholder="name@destination.com" 
                          className="w-full border-b-2 border-slate-200 focus:border-[#F4C430] py-2 focus:outline-none text-sm transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#002366]/60 tracking-wider block mb-1">WhatsApp Mobile *</label>
                        <input 
                          type="tel" 
                          required
                          value={customForm.customerPhone}
                          onChange={(e) => setCustomForm({ ...customForm, customerPhone: e.target.value })}
                          placeholder="+91 XXXXX XXXXX" 
                          className="w-full border-b-2 border-slate-200 focus:border-[#F4C430] py-2 focus:outline-none text-sm transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#002366]/60 tracking-wider block mb-1">Travel Date</label>
                        <input 
                          type="date" 
                          required
                          value={customForm.travelDate}
                          onChange={(e) => setCustomForm({ ...customForm, travelDate: e.target.value })}
                          className="w-full border-b-2 border-slate-200 focus:border-[#F4C430] py-2 focus:outline-none text-sm transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#002366]/60 tracking-wider block mb-1">Guests Count</label>
                        <input 
                          type="number" 
                          min={1} 
                          max={30}
                          value={customForm.guestsCount}
                          onChange={(e) => setCustomForm({ ...customForm, guestsCount: Number(e.target.value) })}
                          className="w-full border-b-2 border-slate-200 focus:border-[#F4C430] py-2 focus:outline-none text-sm transition-colors"
                        />
                      </div>
                    </div>

                    {/* Estimated Pricing Budget */}
                    <div>
                      <div className="flex justify-between text-xs font-mono font-bold mb-1">
                        <span className="text-[#002366]/60">ESTIMATED TOUR BUDGET LIMIT ({currency})</span>
                        <span className="text-orange-600">{formatPrice(customForm.estimatedBudget)}</span>
                      </div>
                      <input 
                        type="range" 
                        min={15000} 
                        max={150000} 
                        step={5000}
                        value={customForm.estimatedBudget}
                        onChange={(e) => setCustomForm({ ...customForm, estimatedBudget: Number(e.target.value) })}
                        className="w-full accent-orange-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Saffron Border Panel: Razorpay compliance PAN Field */}
                    <div className="bg-slate-50 p-4 border border-dashed border-[#F4C430] rounded-xl">
                      <div className="flex gap-2 items-start mb-2">
                        <Info className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold uppercase text-[#002366]">Indian PAN Card (Optional for Customized Quotes)</p>
                          <p className="text-[10px] text-slate-500">Provide for instantaneous automatic billing generation and digital verification certificates.</p>
                        </div>
                      </div>
                      <input 
                        type="text"
                        maxLength={10}
                        value={customForm.panCard}
                        onChange={(e) => setCustomForm({ ...customForm, panCard: e.target.value.toUpperCase() })}
                        placeholder="ABCDE1234F" 
                        className="w-full max-w-xs border-b border-slate-300 py-1 bg-transparent focus:outline-none focus:border-[#F4C430] text-sm tracking-wider uppercase font-mono font-bold"
                      />
                    </div>

                    {/* Nationality and Personal Identification Section */}
                    <div className="bg-[#002366]/5 p-5 rounded-2xl border border-slate-200 space-y-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#002366]/70 tracking-wider block mb-2 font-mono">Select Nationality *</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setCustomForm({ ...customForm, nationality: 'Indian' })}
                            className={`py-2 px-3 text-xs font-bold rounded-xl border-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              customForm.nationality === 'Indian' 
                                ? 'border-[#002366] bg-[#001c52]/10 text-[#002366]' 
                                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                            }`}
                          >
                            <span>🇮🇳</span> Indian National
                          </button>
                          <button
                            type="button"
                            onClick={() => setCustomForm({ ...customForm, nationality: 'Foreign' })}
                            className={`py-2 px-3 text-xs font-bold rounded-xl border-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              customForm.nationality === 'Foreign' 
                                ? 'border-[#002366] bg-[#001c52]/10 text-[#002366]' 
                                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                            }`}
                          >
                            <span>🏳️</span> Foreign National
                          </button>
                        </div>
                      </div>

                      {/* Dynamic fields based on nationality */}
                      {customForm.nationality === 'Indian' ? (
                        <div>
                          <label className="text-[10px] uppercase font-bold text-[#002366]/80 block mb-1">Primary Traveler Aadhaar Number *</label>
                          <input 
                            type="text"
                            required
                            maxLength={14}
                            value={customForm.aadhaarNumber}
                            onChange={(e) => {
                              // Auto formatting for 12 digits Aadhaar: XXXX XXXX XXXX
                              let raw = e.target.value.replace(/\D/g, '').slice(0, 12);
                              let parts = [];
                              for (let i = 0; i < raw.length; i += 4) {
                                parts.push(raw.slice(i, i + 4));
                              }
                              setCustomForm({ ...customForm, aadhaarNumber: parts.join(' ') });
                            }}
                            placeholder="1234 5678 9012"
                            className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono tracking-wider focus:outline-none focus:border-[#F4C430]"
                          />
                          <p className="text-[9px] text-slate-450 mt-1">Required for secure border checks in J&K territory.</p>
                        </div>
                      ) : (
                        <div>
                          <label className="text-[10px] uppercase font-bold text-[#002366]/80 block mb-1">Primary Traveler Passport Number *</label>
                          <input 
                            type="text"
                            required
                            value={customForm.passportNumber}
                            onChange={(e) => setCustomForm({ ...customForm, passportNumber: e.target.value.toUpperCase() })}
                            placeholder="E.g., Z1234567"
                            className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#F4C430]"
                          />
                          <p className="text-[9px] text-slate-450 mt-1">Required for foreign registration logs and high-altitude safety clearance.</p>
                        </div>
                      )}

                      {/* Family validation segment */}
                      {customForm.guestsCount > 1 && (
                        <div className="border-t border-slate-200 pt-3 space-y-3">
                          <div className="flex items-center gap-1">
                            <span className="text-xs">👨‍👩‍👦</span>
                            <span className="text-[10px] font-bold text-[#002366] uppercase tracking-wider">Family Companion Roster</span>
                          </div>
                          <p className="text-[9px] text-slate-500 italic leading-snug">
                            Only one primary traveler Aadhaar is mandatory for national safety. Please list details of other companion travelers below:
                          </p>

                          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                            {Array.from({ length: customForm.guestsCount - 1 }).map((_, idx) => {
                              const companion = customForm.otherTravelers[idx] || { name: '', gender: 'Male' };
                              return (
                                <div key={idx} className="p-3 bg-white border border-slate-100 rounded-xl space-y-2">
                                  <span className="text-[9px] font-bold font-mono text-orange-600 uppercase">Passenger #{idx + 2}</span>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[9px] font-bold text-slate-400 block mb-0.5">FULL NAME *</label>
                                      <input
                                        type="text"
                                        required
                                        value={companion.name}
                                        onChange={(e) => {
                                          const list = [...customForm.otherTravelers];
                                          if (!list[idx]) list[idx] = { name: '', gender: 'Male' };
                                          list[idx] = { ...list[idx], name: e.target.value };
                                          setCustomForm({ ...customForm, otherTravelers: list });
                                        }}
                                        placeholder={`Guest ${idx + 2} Name`}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 flex-1 text-xs text-slate-950 focus:outline-none focus:border-[#002366]"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-bold text-slate-400 block mb-0.5">GENDER *</label>
                                      <select
                                        value={companion.gender}
                                        onChange={(e) => {
                                          const list = [...customForm.otherTravelers];
                                          if (!list[idx]) list[idx] = { name: '', gender: 'Male' };
                                          list[idx] = { ...list[idx], gender: e.target.value };
                                          setCustomForm({ ...customForm, otherTravelers: list });
                                        }}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-950 focus:outline-none focus:border-[#002366]"
                                      >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Infant specifications toggle and field */}
                      <div className="border-t border-slate-200 pt-3">
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700 select-none">
                          <input 
                            type="checkbox"
                            checked={customForm.hasInfants}
                            onChange={(e) => setCustomForm({ ...customForm, hasInfants: e.target.checked })}
                            className="rounded text-[#002366] focus:ring-[#002366]"
                          />
                          <span>Traveling with infants (under 2 years)?</span>
                        </label>
                        
                        {customForm.hasInfants && (
                          <div className="mt-2 text-left bg-amber-50/50 p-2.5 rounded-lg border border-amber-200 space-y-1 animate-fade-in">
                            <label className="text-[9px] font-bold text-amber-800 uppercase block">Please let us know infants' details:</label>
                            <textarea
                              rows={2}
                              required
                              value={customForm.infantDetails}
                              onChange={(e) => setCustomForm({ ...customForm, infantDetails: e.target.value })}
                              placeholder="E.g., Baby Kabir, 10 months old, needs hot milk flasks and safety cot during Srinagar houseboat stay."
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-[#002366]"
                            />
                            <p className="text-[8.5px] text-amber-700 leading-normal">
                              We make sure that child safety accessories, flasks, and proper vehicle configurations are set up.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#002366]/60 tracking-wider block mb-1">Custom Leisure Requests / Hotel Preferences (optional)</label>
                      <textarea 
                        rows={2}
                        value={customForm.customRequirements}
                        onChange={(e) => setCustomForm({ ...customForm, customRequirements: e.target.value })}
                        placeholder="E.g., Private butler at Dal Lake houseboat, vegetarian Satvik cuisine request, or high altitude oxygen kits for aging family members..."
                        className="w-full border-2 border-slate-100 focus:border-[#F4C430] rounded-xl p-3 focus:outline-none text-xs transition-colors"
                      />
                    </div>

                  </div>

                  <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end items-center">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-slate-100 text-slate-600 hover:bg-slate-200 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-[#002366] hover:bg-[#F4C430] hover:text-[#002366] text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-md"
                    >
                      Process & Sync Wishlist
                    </button>
                  </div>
                </motion.form>
              )}

              {step === 3 && formSubmittedDetails && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="space-y-6 py-6 text-center"
                >
                  <div className="w-16 h-16 bg-[#002366] text-[#F4C430] rounded-full mx-auto flex items-center justify-center border-2 border-[#F4C430]">
                    <Sparkles className="w-8 h-8 animate-spin-slow" />
                  </div>

                  <div>
                    <h3 className="text-3xl font-serif font-bold text-[#002366]">J&K Custom Itinerary Registered!</h3>
                    <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
                      Greetings from the Land of Saffron! Your customization has locked and synced securely into our client stream index.
                    </p>
                  </div>

                  {/* Summary ticket */}
                  <div className="bg-[#002366] text-[#F4C430] max-w-md mx-auto p-6 rounded-2xl text-left shadow-lg relative border-b-8 border-orange-500">
                    <div className="flex justify-between items-center border-b border-[#F4C430]/20 pb-2 mb-4">
                      <span className="text-[10px] font-mono tracking-widest text-[#F4C430] font-bold">Booking / Inquiry ID</span>
                      <span className="text-[10px] font-mono font-bold bg-[#F4C430] text-[#002366] px-2 py-0.5 rounded uppercase">
                        {formSubmittedDetails.id}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-mono text-white text-wrap">
                      <p><span className="text-[#F4C430]">Lead Name:</span> {formSubmittedDetails.customerName}</p>
                      <p><span className="text-[#F4C430]">Email Address:</span> {formSubmittedDetails.customerEmail}</p>
                      <p><span className="text-[#F4C430]">Contact Mobile:</span> {formSubmittedDetails.customerPhone}</p>
                      <p><span className="text-[#F4C430]">Est. Budget:</span> {formatPrice(formSubmittedDetails.totalPrice)}</p>
                      <p><span className="text-[#F4C430]">Travel Date:</span> {formSubmittedDetails.travelDate}</p>
                      <p><span className="text-[#F4C430]">CRM Sync Status:</span> 
                        <span className="ml-1 bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                          {formSubmittedDetails.leadStatus}
                        </span>
                      </p>
                    </div>

                    {/* Pre-packaged WhatsApp Quick Draft message link generation */}
                    <div className="mt-6 border-t border-[#F4C430]/20 pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
                      <a 
                        target="_blank"
                        rel="noreferrer"
                        href={`https://wa.me/917006770665?text=Hello%20Sheenora%20Journeys!%20I%27ve%20just%20designed%20my%20Kashmir%20trip%20online.%20My%20Inquiry%20ID%20is%20${formSubmittedDetails.id}.%20Traveler%20Name%3A%20${encodeURIComponent(formSubmittedDetails.customerName)}.%20Please%20assign%20me%20a%20local%20Wazwan%20expert.`}
                        className="inline-flex items-center gap-2 bg-green-550 border border-green-600 hover:bg-green-600 text-white font-sans font-bold text-xs uppercase px-4 py-2.5 rounded-xl transition-all shadow-md w-full sm:w-auto justify-center"
                      >
                        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.431 2.5 1.157 3.476l-.758 2.766 2.842-.746c.937.518 2.012.81 3.159.812 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.768-5.766zm3.435 8.163c-.14.394-.714.717-1.127.765-.369.043-.848.068-1.556-.162-.977-.317-1.894-.972-2.578-1.638-.684-.665-1.309-1.602-1.579-2.593-.194-.712-.132-1.185.088-1.428.188-.207.411-.335.549-.475.14-.14.187-.235.281-.422.095-.187.047-.35-.024-.492-.07-.142-.239-.569-.379-.906-.115-.274-.246-.3-.375-.3-.117-.004-.251-.005-.386-.005-.375 0-.986.141-1.396.586-.41.445-1.57 1.535-1.57 3.743 0 2.207 1.607 4.337 1.83 4.64.223.303 3.163 4.83 7.661 6.77 1.07.461 1.905.736 2.557.943 1.075.342 2.054.293 2.827.178.861-.129 2.65-.119 3.023-.119.373 0 .741-.121.984-.187v.004z"/>
                        </svg>
                        Export ticket to WhatsApp Desk
                      </a>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 bg-[#F4C430] hover:bg-amber-400 text-[#002366] font-sans font-bold text-xs uppercase px-4 py-2.5 rounded-xl transition-all shadow-md w-full sm:w-auto justify-center cursor-pointer border border-[#F4C430]"
                      >
                        <Printer className="w-4 h-4" />
                        Print Itinerary Voucher
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setStep(1);
                        setFormSubmittedDetails(null);
                        setCustomForm({
                          destinations: [],
                          travelDate: '',
                          guestsCount: 2,
                          customRequirements: '',
                          estimatedBudget: 35000,
                          customerName: '',
                          customerEmail: '',
                          customerPhone: '',
                          panCard: '',
                        });
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-bold font-mono text-xs uppercase transition-colors"
                    >
                      Design Another Itinerary
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

          </div>
        </section>

        {/* SECTION: MAIN DIRECTORY & DYNAMIC CMS SEARCH/FILTER */}
        <section id="discover-packages" className="scroll-mt-24 space-y-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest font-bold text-[#F4C430] bg-[#002366]/90 px-3 py-1 rounded inline-block font-mono">
              {t('seoOptimized')}
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-semibold text-[#002366]">{t('exploreHeader')}</h2>
            <p className="text-sm text-slate-500 font-semibold">
              {t('exploreSub')}
            </p>
          </div>

          {/* General Inclusions Guarantee - "What you will get" is 100% transparent and stunning! */}
          <div className="bg-[#002366]/95 text-white rounded-3xl p-6 sm:p-8 border-2 border-[#F4C430] relative overflow-hidden shadow-2xl backdrop-blur-md max-w-7xl mx-auto" id="inclusions-guarantee-banner">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4C430]/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-4 space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-[#F4C430]/20 text-[#F4C430] border border-[#F4C430]/30 px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-widest">
                  <ShieldCheck className="w-3.5 h-3.5" /> Luxury J&K Guaranteed
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-extrabold tracking-tight">
                  What You Get with <span className="text-[#F4C430]">Sheenora</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  We maintain direct local tie-ups with premium walnut-finish houseboats, certified 4-Star heated mountain suites, and private high-rated tourist chauffeurs. Every booking is completely automated, 100% secure, and backed by 24/7 on-ground assistance.
                </p>
              </div>

              <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#F4C430]/15 flex items-center justify-center text-[#F4C430]">
                    <Map className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#F4C430] text-[11px] uppercase tracking-wider font-mono">Bespoke Itinerary</h4>
                    <p className="text-[10px] text-slate-300 mt-1 leading-snug">Private customizable sightseeing in Srinagar, Gulmarg, Pahalgam & Sonamarg.</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-emerald-450 text-[11px] uppercase tracking-wider font-mono">Premium Stays</h4>
                    <p className="text-[10px] text-slate-300 mt-1 leading-snug">Luxury Devdar-pine floating suites & 4-Star centrally heated resort rooms.</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#F4C430]/15 flex items-center justify-center text-[#F4C430]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#F4C430] text-[11px] uppercase tracking-wider font-mono">Private Chauffeur</h4>
                    <p className="text-[10px] text-slate-300 mt-1 leading-snug">Safe personal SUV for family/honeymoon tours led by expert mountain drivers.</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-2.5">
                  <div className="w-9 h-9 rounded-full bg-blue-500/15 flex items-center justify-center text-blue-400">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-blue-400 text-[11px] uppercase tracking-wider font-mono">Local Delights</h4>
                    <p className="text-[10px] text-slate-300 mt-1 leading-snug">Daily buffet breakfast & traditional multi-course Wazwan dinners included in full.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Catalog Controls Grid */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-200 pb-6">
            
            {/* Horizontal Scroll categories list */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {['All', 'Luxury', 'Honeymoon', 'Adventure', 'Offbeat', 'Pilgrimage'].map((category) => {
                const translationKey = category === 'All' ? 'catAll' :
                                      category === 'Luxury' ? 'catLuxury' :
                                      category === 'Honeymoon' ? 'catHoneymoon' :
                                      category === 'Adventure' ? 'catAdventure' :
                                      category === 'Offbeat' ? 'catOffbeat' : 'catPilgrimage';
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="relative px-4 py-2 rounded-xl text-xs uppercase font-bold tracking-wider shrink-0 transition-all font-mono cursor-pointer outline-none focus:ring-1 focus:ring-[#F4C430]"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryPill"
                        className="absolute inset-0 bg-[#002366] rounded-xl border-2 border-[#F4C430] z-0 shadow-md"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 transition-colors duration-200 ${
                      isActive ? 'text-[#F4C430]' : 'text-slate-600 hover:text-slate-900'
                    }`}>
                      {t(translationKey as any)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Live Search bar */}
            <div className="relative w-full md:w-80 shrink-0">
               <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder={t('searchPlaceholder')} 
                 className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#F4C430] focus:ring-1 focus:ring-[#F4C430]"
               />
               {searchQuery && (
                 <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-red-500">
                   <X className="w-4 h-4" />
                 </button>
               )}
            </div>

          </div>
          {cmsMode && (
            <div className="bg-orange-50 border-2 border-[#F4C430] rounded-2xl p-6 sm:p-8 space-y-6 shadow-md">
              <div className="flex justify-between items-center bg-[#002366] text-[#F4C430] -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 px-6 py-4 rounded-t-xl border-b border-[#F4C430]/30 shadow-sm">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#F4C430]" />
                  <span className="font-mono font-bold uppercase text-xs tracking-wider">Sheenora CRM Core Database Node: CMS Active</span>
                </div>
                <button 
                  onClick={() => setShowAddPackageForm(!showAddPackageForm)}
                  className="bg-[#F4C430] text-[#002366] hover:bg-white hover:text-[#002366] px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {showAddPackageForm ? "Hide Form" : "Create New Tour Itinerary"}
                </button>
              </div>

              {!showAddPackageForm ? (
                <div className="text-center py-4 space-y-1 text-xs">
                  <p className="font-bold text-[#002366] text-sm">✓ Current Active Database Entries: {packages.length} Packages</p>
                  <p className="text-slate-500 font-medium">You can edit prices, change photos from the local gallery, manage inclusions, customize day-by-day itineraries or instantly purge packages below.</p>
                </div>
              ) : (
                <form onSubmit={handleAddNewPackage} className="space-y-5 pt-2">
                  <h3 className="text-lg font-bold font-serif text-[#002366] border-b border-orange-200 pb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#F4C430] fill-[#F4C430]" />
                    Publish New Premium Destination Route
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1 font-mono">Package Title (Clear & Commercial) *</label>
                      <input 
                        type="text" 
                        required
                        value={newPackage.title}
                        onChange={(e) => setNewPackage({ ...newPackage, title: e.target.value })}
                        placeholder="E.g., Pristine Sonamarg Trout Adventure & Angler Camp"
                        className="w-full bg-white border border-slate-205 rounded-xl p-3 text-xs focus:outline-none focus:border-[#F4C430] font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1 font-mono">Duration *</label>
                        <input 
                          type="text" 
                          required
                          value={newPackage.duration}
                          onChange={(e) => setNewPackage({ ...newPackage, duration: e.target.value })}
                          placeholder="5 Nights / 6 Days"
                          className="w-full bg-white border border-slate-205 rounded-xl p-3 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1 font-mono">Price (INR) *</label>
                        <input 
                          type="number" 
                          required
                          value={newPackage.price}
                          onChange={(e) => setNewPackage({ ...newPackage, price: Number(e.target.value) })}
                          className="w-full bg-white border border-slate-205 rounded-xl p-3 text-xs focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1 font-mono">Orig Price (INR)</label>
                        <input 
                          type="number" 
                          value={newPackage.originalPrice}
                          onChange={(e) => setNewPackage({ ...newPackage, originalPrice: Number(e.target.value) })}
                          className="w-full bg-white border border-slate-205 rounded-xl p-3 text-xs focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1 font-mono">Category Tag *</label>
                      <select 
                        value={newPackage.category}
                        onChange={(e) => setNewPackage({ ...newPackage, category: e.target.value as any })}
                        className="w-full bg-white border border-slate-205 rounded-xl p-3 text-xs focus:outline-none"
                      >
                        <option value="Luxury">Luxury</option>
                        <option value="Honeymoon">Honeymoon</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Offbeat">Offbeat</option>
                        <option value="Pilgrimage">Pilgrimage</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1 font-mono">Landscape Image URL *</label>
                      <input 
                        type="url" 
                        required
                        value={newPackage.image}
                        onChange={(e) => setNewPackage({ ...newPackage, image: e.target.value })}
                        className="w-full bg-white border border-slate-205 rounded-xl p-3 text-xs focus:outline-none font-mono"
                        placeholder="Type image address or click gallery thumbnail below..."
                      />
                    </div>
                  </div>

                  {/* KASHMIR HERITAGE IMAGE GALLERY PICKER (DOCKABLE) */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-inner space-y-2">
                    <span className="text-[10px] font-bold text-slate-600 uppercase block font-mono flex items-center gap-1">
                      🖼️ Quick Imagery Picker (Pick Beautiful Pre-configured Kashmiri Photographs)
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-9 gap-2.5 max-h-36 overflow-y-auto pr-1">
                      {gallery.map((g) => (
                        <button
                          key={g.url}
                          type="button"
                          className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all group ${
                            newPackage.image === g.url
                              ? 'border-[#002366] ring-2 ring-[#F4C430]'
                              : 'border-slate-250 hover:border-slate-400'
                          }`}
                          onClick={() => setNewPackage({ ...newPackage, image: g.url })}
                          title={`${g.title} (${g.tags.join(', ')})`}
                        >
                          <img src={g.url} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-[7px] text-white font-sans font-bold leading-tight text-center truncate px-0.5">{g.title}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    {newPackage.image && (
                      <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl text-[10px] text-slate-500 font-mono">
                        <span className="font-bold text-[#002366]">Selected URL:</span>
                        <span className="truncate flex-1 max-w-xs">{newPackage.image}</span>
                        <img src={newPackage.image} alt="Preview thumbnail" className="w-10 h-7 rounded object-cover border border-slate-200" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1 font-mono">Rating (1-5) *</label>
                      <input 
                        type="number" 
                        required
                        min={1}
                        max={5}
                        step={0.1}
                        value={newPackage.rating}
                        onChange={(e) => setNewPackage({ ...newPackage, rating: Number(e.target.value) })}
                        placeholder="E.g., 4.9"
                        className="w-full bg-white border border-slate-205 rounded-xl p-3 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1 font-mono">Reviews Verified Count *</label>
                      <input 
                        type="number" 
                        required
                        value={newPackage.reviewsCount}
                        onChange={(e) => setNewPackage({ ...newPackage, reviewsCount: Number(e.target.value) })}
                        placeholder="E.g., 18"
                        className="w-full bg-white border border-slate-205 rounded-xl p-3 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1 font-mono">SEO Tagline & Meta Description *</label>
                      <textarea 
                        rows={1}
                        required
                        value={newPackage.seoDescription}
                        onChange={(e) => setNewPackage({ ...newPackage, seoDescription: e.target.value })}
                        placeholder="E.g., Book Pahalgam luxury suite, Baisaran tour, best drivers..."
                        className="w-full bg-white border border-slate-205 rounded-xl p-3 text-xs focus:outline-none focus:border-[#F4C430]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Key Highlights list creator */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                      <label className="text-[10px] uppercase font-bold text-[#002366] block font-mono border-b border-slate-100 pb-1">★ Tour Highlights ({newPackage.highlights.length})</label>
                      <div className="flex gap-1.5">
                        <input 
                          type="text" 
                          id="new-package-hl-input"
                          placeholder="Ex: Private bonfire & wazwan cook sessions"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = e.currentTarget.value.trim();
                              if (val) {
                                setNewPackage(prev => ({ ...prev, highlights: [...prev.highlights, val] }));
                                e.currentTarget.value = '';
                              }
                            }
                          }}
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            const input = document.getElementById('new-package-hl-input') as HTMLInputElement;
                            if (input && input.value.trim()) {
                              setNewPackage(prev => ({ ...prev, highlights: [...prev.highlights, input.value.trim()] }));
                              input.value = '';
                            }
                          }}
                          className="bg-[#002366] text-white px-3 rounded-lg text-xs font-bold"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                        {newPackage.highlights.map((h, i) => (
                          <span key={i} className="bg-amber-50 border border-amber-200 text-[#002366] pl-2 pr-1 py-0.5 rounded text-[10px] flex items-center gap-1 font-sans">
                            {h}
                            <button type="button" onClick={() => removeHighlightItem(i)} className="text-red-500 hover:text-red-700 font-bold">×</button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Inclusions list creator */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                      <label className="text-[10px] uppercase font-bold text-[#002366] block font-mono border-b border-slate-100 pb-1 font-semibold text-green-700">✓ Inclusions list ({newPackage.inclusions.length})</label>
                      <div className="flex gap-1.5">
                        <input 
                          type="text" 
                          id="new-package-inc-input"
                          placeholder="Ex: Luxury houseboat stay, SUV transfer"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = e.currentTarget.value.trim();
                              if (val) {
                                setNewPackage(prev => ({ ...prev, inclusions: [...prev.inclusions, val] }));
                                e.currentTarget.value = '';
                              }
                            }
                          }}
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            const input = document.getElementById('new-package-inc-input') as HTMLInputElement;
                            if (input && input.value.trim()) {
                              setNewPackage(prev => ({ ...prev, inclusions: [...prev.inclusions, input.value.trim()] }));
                              input.value = '';
                            }
                          }}
                          className="bg-[#002366] text-white px-3 rounded-lg text-xs font-bold"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                        {newPackage.inclusions.map((inc, i) => (
                          <span key={i} className="bg-green-50 border border-green-200 text-green-800 pl-2 pr-1 py-0.5 rounded text-[10px] flex items-center gap-1">
                            {inc}
                            <button type="button" onClick={() => removeInclusionItem(i)} className="text-red-500 hover:text-red-700 font-bold">×</button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Exclusions list creator */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 font-semibold">
                      <label className="text-[10px] uppercase font-bold text-[#002366] block font-mono border-b border-slate-100 pb-1 text-red-700">✗ Exclusions list ({newPackage.exclusions.length})</label>
                      <div className="flex gap-1.5">
                        <input 
                          type="text" 
                          id="new-package-exc-input"
                          placeholder="Ex: Flights, Gondola Phase 2 tickets"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = e.currentTarget.value.trim();
                              if (val) {
                                setNewPackage(prev => ({ ...prev, exclusions: [...prev.exclusions, val] }));
                                e.currentTarget.value = '';
                              }
                            }
                          }}
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            const input = document.getElementById('new-package-exc-input') as HTMLInputElement;
                            if (input && input.value.trim()) {
                              setNewPackage(prev => ({ ...prev, exclusions: [...prev.exclusions, input.value.trim()] }));
                              input.value = '';
                            }
                          }}
                          className="bg-[#002366] text-white px-3 rounded-lg text-xs font-bold"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1 font-normal text-slate-800">
                        {newPackage.exclusions.map((exc, i) => (
                          <span key={i} className="bg-red-50 border border-red-250 text-red-750 pl-2 pr-1 py-0.5 rounded text-[10px] flex items-center gap-1">
                            {exc}
                            <button type="button" onClick={() => removeExclusionItem(i)} className="text-red-500 hover:text-red-700 font-bold">×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Daily plans sequence builder */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                    <label className="text-[10px] uppercase font-bold text-[#002366] block font-mono border-b border-slate-100 pb-1">🕒 Day-to-Day Plan Setup ({newPackage.itinerary.length} Days)</label>
                    <div className="space-y-3 max-h-60 overflow-y-auto p-1 bg-slate-50 rounded-xl border">
                      {newPackage.itinerary.map((dayItem, dIndex) => (
                        <div key={dIndex} className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 relative shadow-xs">
                          <button
                            type="button"
                            onClick={() => {
                              const updatedItin = [...newPackage.itinerary];
                              updatedItin.splice(dIndex, 1);
                              // Re-index days
                              const alignedItin = updatedItin.map((item, index) => ({
                                ...item,
                                day: index + 1
                              }));
                              setNewPackage(prev => ({ ...prev, itinerary: alignedItin }));
                            }}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer"
                          >
                            Remove Day
                          </button>
                          <p className="text-xs font-bold text-[#002366] font-mono">Day {dayItem.day}</p>
                          <div className="space-y-1.5">
                            <input
                              type="text"
                              value={dayItem.title}
                              onChange={(e) => {
                                const updatedItin = [...newPackage.itinerary];
                                updatedItin[dIndex] = { ...dayItem, title: e.target.value };
                                setNewPackage(prev => ({ ...prev, itinerary: updatedItin }));
                              }}
                              placeholder="Day Title (e.g., Shikara ride at Sunset)"
                              className="w-full px-2 py-1 rounded border text-xs text-slate-900 bg-white"
                            />
                            <textarea
                              rows={2}
                              value={dayItem.details}
                              onChange={(e) => {
                                const updatedItin = [...newPackage.itinerary];
                                updatedItin[dIndex] = { ...dayItem, details: e.target.value };
                                setNewPackage(prev => ({ ...prev, itinerary: updatedItin }));
                              }}
                              placeholder="Sightseeing info..."
                              className="w-full px-2 py-1 rounded border text-xs text-slate-900 bg-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedItin = [...newPackage.itinerary];
                        const nextDay = updatedItin.length + 1;
                        updatedItin.push({
                          day: nextDay,
                          title: `Day ${nextDay} Sightseeing`,
                          details: 'Private bespoke transport arrangements with our local mountain guide through lush pine forests and iconic landscapes.'
                        });
                        setNewPackage(prev => ({ ...prev, itinerary: updatedItin }));
                      }}
                      className="w-full bg-[#002366]/5 hover:bg-[#002366] text-[#002366] hover:text-white py-2 rounded-lg border border-dashed border-[#002366]/40 text-xs font-semibold cursor-pointer"
                    >
                      + Append Next Day (Day {newPackage.itinerary.length + 1})
                    </button>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#002366] text-[#F4C430] py-4 rounded-xl font-bold text-xs uppercase tracking-widest border border-[#F4C430] hover:bg-orange-600 hover:text-white transition-colors cursor-pointer shadow-md"
                  >
                    Commit Dynamic Itinerary to Global Databases
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TOUR CARDS GRID LAYER */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <Compass className="w-12 h-12 text-slate-300 mx-auto animate-pulse" />
                <p className="font-bold text-slate-500">No Kashmiri itineraries found matching "{searchQuery}"</p>
                <button 
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                  className="bg-slate-100 hover:bg-slate-250 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredPackages.map((pack) => {
                const isExpanded = expandedPackageId === pack.id;
                return (
                  <motion.article 
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    key={pack.id} 
                    id={`package-${pack.id}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-2xl hover:-translate-y-2 hover:border-amber-400/30 transition-all duration-500 relative flex flex-col justify-between"
                  >
                    {/* Image section with relative Tag */}
                    <div className="relative h-60 overflow-hidden">
                      <img 
                        src={pack.image} 
                        alt={pack.title} 
                        className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                      
                      {/* Tag floating top left */}
                      <span className="absolute top-4 left-4 bg-white text-[#002366] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-[#F4C430] font-mono shadow-sm">
                        {pack.category}
                      </span>

                      {/* Code floating top right */}
                      <span className="absolute top-4 right-4 bg-slate-900/65 text-[#F4C430] px-2 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider">
                        {pack.id}
                      </span>

                      {/* Title embedded over gradient at bottom of picture */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="text-[10px] font-mono tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded uppercase font-bold mb-1.5 inline-block">
                          {pack.duration}
                        </span>
                        <h3 className="text-xl font-serif font-bold text-white tracking-tight drop-shadow-md">
                          {pack.title}
                        </h3>
                      </div>
                    </div>

                    {/* Body contents */}
                    <div className="p-5 space-y-4 flex-1">
                      
                      {/* Interactive SEO text hook */}
                      <p className="text-xs text-slate-500 italic line-clamp-2">
                        "{pack.seoDescription}"
                      </p>

                      {/* Dynamic Inclusions - Extremely easy to understand what they get! */}
                      <div className="bg-emerald-50/70 border border-emerald-500/10 rounded-xl p-3.5 space-y-2">
                        <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-800 block font-sans">
                          ✓ Guaranteed Booking Inclusions
                        </span>
                        <ul className="grid grid-cols-1 gap-1.5 text-xs text-slate-750 font-sans">
                          {pack.inclusions && pack.inclusions.length > 0 ? (
                            pack.inclusions.slice(0, 4).map((inc, i) => (
                              <li key={i} className="flex items-start gap-2 text-[11px] font-semibold text-emerald-950 leading-tight">
                                <span className="text-emerald-600 font-extrabold shrink-0">✦</span>
                                <span>{inc}</span>
                              </li>
                            ))
                          ) : (
                            <>
                              <li className="flex items-start gap-2 text-[11px] font-semibold text-emerald-950 leading-tight">
                                <span className="text-emerald-600 font-extrabold shrink-0">✦</span>
                                <span>Luxury J&K Central Heated Hotel Suites</span>
                              </li>
                              <li className="flex items-start gap-2 text-[11px] font-semibold text-emerald-950 leading-tight">
                                <span className="text-emerald-600 font-extrabold shrink-0">✦</span>
                                <span>Private SUV Innova Transits & Sightseeing</span>
                              </li>
                              <li className="flex items-start gap-2 text-[11px] font-semibold text-emerald-950 leading-tight">
                                <span className="text-emerald-600 font-extrabold shrink-0">✦</span>
                                <span>Royal Wazwan Dynamic Guided Dining Run</span>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>

                      {/* Highlights list */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block font-mono">Immersive Experiences Included</span>
                        <ul className="space-y-1">
                          {pack.highlights.slice(0, 3).map((item, idx) => (
                            <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#F4C430] shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Display Rating & Reviews count */}
                      <div className="flex justify-between items-center text-xs border-y border-slate-100 py-3">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="font-mono font-bold">{pack.duration}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-slate-500">
                          <Star className="w-3.5 h-3.5 fill-[#F4C430] stroke-none" />
                          <span className="font-mono font-bold text-[#002366]">{pack.rating}</span>
                          <span>({pack.reviewsCount} verified)</span>
                        </div>
                      </div>

                      {/* Toggleable Day to Day Itinerary View */}
                      {isExpanded && (
                        <div className="space-y-3 pt-2 animate-fade-in border-b border-slate-100 pb-4">
                          <span className="text-[9px] uppercase font-bold tracking-widest text-[#002366] block font-mono">Detailed Day-to-Day Plan</span>
                          {pack.itinerary && pack.itinerary.map((dayItem) => (
                            <div key={dayItem.day} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                              <p className="text-xs font-bold font-serif text-[#002366]">Day {dayItem.day}: {dayItem.title}</p>
                              <p className="text-[11px] text-slate-550 mt-0.5 leading-relaxed">{dayItem.details}</p>
                            </div>
                          ))}

                          <div className="grid grid-cols-2 gap-4 text-[11px] pt-2">
                            <div>
                              <p className="font-bold text-[#002366] uppercase tracking-widest text-[9px] mb-1 font-mono text-green-750">INCLUSIONS</p>
                              <ul className="space-y-0.5 list-disc list-inside text-slate-600">
                                {pack.inclusions.slice(0, 3).map((inc, i) => (
                                  <li key={i}>{inc}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-bold text-red-750 uppercase tracking-widest text-[9px] mb-1 font-mono">EXCLUSIONS</p>
                              <ul className="space-y-0.5 list-disc list-inside text-slate-600">
                                {pack.exclusions.slice(0, 3).map((exc, i) => (
                                  <li key={i}>{exc}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Footer / CTA segment */}
                    <div className="px-6 pb-6 pt-0 space-y-4">
                      
                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="text-[9px] text-slate-400 block font-semibold font-mono">ESTIMATED DIRECT PRICE</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-2xl font-bold font-sans text-[#002366]">
                              {formatPrice(pack.price)}
                            </span>
                            <span className="text-xs text-slate-400 line-through">
                              {formatPrice(pack.originalPrice)}
                            </span>
                          </div>
                        </div>

                        {/* Expand Details Button */}
                        <button
                          onClick={() => setExpandedPackageId(isExpanded ? null : pack.id)}
                          className="text-xs font-bold text-[#002366] hover:text-orange-600 font-mono flex items-center gap-1 select-none"
                        >
                          {isExpanded ? "Hide Plan" : "View Day-to-Day"}
                        </button>
                      </div>

                      {/* Direct prebooking / Booking action triggers Razorpay */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => initiatePrebookingCheckout(pack)}
                          className="flex-1 bg-[#002366] hover:bg-[#F4C430] hover:text-[#002366] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest border border-transparent hover:border-[#002366] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <CreditCard className="w-3.5 h-3.5" /> Direct Booking
                        </button>

                        <a 
                          target="_blank"
                          rel="noreferrer"
                          href={`https://wa.me/917006770665?text=Hello%20Sheenora%2521%20I%20am%20interested%20in%20the%2520%2522${encodeURIComponent(pack.title)}%2522%20trip.%20Please%20send%20quote.`}
                          className="bg-green-100 hover:bg-green-500 text-green-800 hover:text-white p-3 rounded-xl transition-all border border-green-200"
                          title="Chat with local Kashmiri guides on WhatsApp"
                        >
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.891 11.891-11.891 3.181 0 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.481 8.403 0 6.556-5.332 11.891-11.891 11.891-2.003 0-3.976-.505-5.718-1.464l-6.275 1.682zm6.216-3.864c1.554.922 3.111 1.409 4.737 1.409 5.452 0 9.891-4.439 9.891-9.891 0-2.64-1.028-5.122-2.894-6.99s-4.35-2.891-6.997-2.891c-5.451 0-9.891 4.439-9.891 9.891 0 1.748.461 3.45 1.334 4.931l-1.02 3.725 3.84-.984z"/>
                          </svg>
                        </a>

                        {cmsMode && (
                          <>
                            <button
                              onClick={() => setEditingPackage(pack)}
                              className="bg-blue-50 text-blue-700 hover:bg-[#002366] hover:text-[#F4C430] p-3 rounded-xl transition-colors cursor-pointer border border-blue-200"
                              title="Edit price, pictures, duration, or titles"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePackage(pack.id)}
                              className="bg-red-50 text-red-650 hover:bg-red-600 hover:text-white p-3 rounded-xl transition-colors cursor-pointer border border-red-200"
                              title="Delete this itinerary from Sheenora local catalog"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>

                    </div>
                  </motion.article>
                );
              })
            )}
          </div>
        </section>

        {/* SECTION: RAZORPAY SECURE PAYMENT SLIDEOVER / DIALOG MODAL */}
        {activeCheckoutPackage && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full border-2 border-[#F4C430] p-1 accent-orange-500 animate-fade-in relative">
              <button 
                onClick={() => setActiveCheckoutPackage(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-[#002366] bg-slate-100 rounded-full p-1.5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                
                {/* Left reservation summary context */}
                <div className="md:col-span-5 bg-[#001c52] text-white p-6 justify-between flex flex-col relative">
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono uppercase bg-[#F4C430] text-[#002366] px-2.5 py-1 font-bold rounded">
                      ITINERARY INVOICE
                    </span>
                    <h3 className="text-xl font-serif font-bold text-white mt-1 pr-2">
                      {activeCheckoutPackage.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-mono">
                      {language === 'HI' ? 'चयनित टियर:' : 'Selected Tier:'} {language === 'HI' ? (
                        activeCheckoutPackage.category === 'Luxury' ? 'लक्जरी' :
                        activeCheckoutPackage.category === 'Honeymoon' ? 'हनीमून' :
                        activeCheckoutPackage.category === 'Adventure' ? 'रोमांच' :
                        activeCheckoutPackage.category === 'Offbeat' ? 'ऑफबीट' : 'तीर्थयात्रा'
                      ) : activeCheckoutPackage.category} {language === 'HI' ? 'पैकेज' : 'Package'}
                    </p>
                    <div className="text-xs border-t border-slate-600 pt-3 space-y-1">
                      <p><strong className="text-[#F4C430]">{language === 'HI' ? 'रूट कोड:' : 'Route Code:'}</strong> {activeCheckoutPackage.id}</p>
                      <p><strong className="text-[#F4C430]">{language === 'HI' ? 'कीमत (प्रति अतिथि बेस):' : 'Price (Base per guest):'}</strong> {formatPrice(activeCheckoutPackage.price)}</p>
                      <p><strong className="text-[#F4C430]">{language === 'HI' ? 'जीएसटी (शामिल):' : 'GST (Included):'}</strong> {language === 'HI' ? '५% सीजीएसटी/एसजीएसटी शामिल' : '5% CGST/SGST Included'}</p>
                    </div>
                  </div>

                  <div className="bg-[#002366] border border-[#F4C430]/20 p-3 rounded-lg mt-6">
                    <div className="flex gap-2 items-center">
                      <Lock className="w-4 h-4 text-[#F4C430]" />
                      <span className="text-[10px] uppercase font-bold text-slate-300">{language === 'HI' ? 'रेज़रपे सुरक्षित' : 'RAZORPAY SECURE'}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                      {language === 'HI' ? 'संसाधित धन जम्मू-कश्मीर राज्य द्वारा मान्यता प्राप्त बैंकिंग केंद्रों के पास एस्क्रो में सुरक्षित रहता है।' : 'Funds processed remain in direct escrow with J&K state recognized banking hubs.'}
                    </p>
                  </div>
                </div>

                {/* Right payment and checkout form */}
                <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
                  {paymentStep === 'Idle' && (
                    <form onSubmit={handleLiveRazorpayPaymentSimulation} className="space-y-4">
                      <div>
                        <h4 className="text-lg font-serif font-bold text-[#002366]">{language === 'HI' ? 'यात्री विवरण सत्यापित करें' : 'Verify Traveler Details'}</h4>
                        <p className="text-xs text-slate-500">{language === 'HI' ? 'स्थानीय सीमा परमिट और नियामक रजिस्टरों के साथ सुरक्षित सत्यापन।' : 'Secure validation with local border permits and regulatory registers.'}</p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Full Primary Guest Name *</label>
                          <input 
                            type="text" 
                            required
                            value={checkoutForm.customerName}
                            onChange={(e) => setCheckoutForm({ ...checkoutForm, customerName: e.target.value })}
                            placeholder="Full name as matches Identity ID"
                            className="w-full border-b border-slate-200 py-1.5 focus:outline-none focus:border-[#F4C430] text-xs font-semibold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Email *</label>
                            <input 
                              type="email" 
                              required
                              value={checkoutForm.customerEmail}
                              onChange={(e) => setCheckoutForm({ ...checkoutForm, customerEmail: e.target.value })}
                              placeholder="client@mail.com"
                              className="w-full border-b border-slate-200 py-1.5 focus:outline-none text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">WhatsApp phone *</label>
                            <input 
                              type="tel" 
                              required
                              value={checkoutForm.customerPhone}
                              onChange={(e) => setCheckoutForm({ ...checkoutForm, customerPhone: e.target.value })}
                              placeholder="+91 Mobile"
                              className="w-full border-b border-slate-200 py-1.5 focus:outline-none text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Travel Date *</label>
                            <input 
                              type="date" 
                              required
                              value={checkoutForm.travelDate}
                              onChange={(e) => setCheckoutForm({ ...checkoutForm, travelDate: e.target.value })}
                              className="w-full border-b border-slate-200 py-1.5 focus:outline-none text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Guests *</label>
                            <input 
                              type="number" 
                              min={1} 
                              max={20}
                              value={checkoutForm.guestsCount}
                              onChange={(e) => setCheckoutForm({ ...checkoutForm, guestsCount: Number(e.target.value) })}
                              className="w-full border-b border-slate-200 py-1.5 focus:outline-none text-xs"
                            />
                          </div>
                        </div>

                        {/* Nationality and Personal Identification Section */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-[#002366]/70 tracking-wider block mb-1.5 font-mono">Select Nationality *</label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setCheckoutForm({ ...checkoutForm, nationality: 'Indian' })}
                                className={`py-2 px-3 text-xs font-bold rounded-lg border-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                  checkoutForm.nationality === 'Indian' 
                                    ? 'border-[#002366] bg-[#001c52]/10 text-[#002366]' 
                                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                                }`}
                              >
                                <span>🇮🇳</span> Indian National
                              </button>
                              <button
                                type="button"
                                onClick={() => setCheckoutForm({ ...checkoutForm, nationality: 'Foreign' })}
                                className={`py-2 px-3 text-xs font-bold rounded-lg border-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                  checkoutForm.nationality === 'Foreign' 
                                    ? 'border-[#002366] bg-[#001c52]/10 text-[#002366]' 
                                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                                }`}
                              >
                                <span>🏳️</span> Foreign National
                              </button>
                            </div>
                          </div>

                          {/* Dynamic fields based on nationality */}
                          {checkoutForm.nationality === 'Indian' ? (
                            <div>
                              <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Primary Traveler Aadhaar Number *</label>
                              <input 
                                type="text"
                                required
                                maxLength={14}
                                value={checkoutForm.aadhaarNumber}
                                onChange={(e) => {
                                  // Auto formatting for 12 digits Aadhaar: XXXX XXXX XXXX
                                  let raw = e.target.value.replace(/\D/g, '').slice(0, 12);
                                  let parts = [];
                                  for (let i = 0; i < raw.length; i += 4) {
                                    parts.push(raw.slice(i, i + 4));
                                  }
                                  setCheckoutForm({ ...checkoutForm, aadhaarNumber: parts.join(' ') });
                                }}
                                placeholder="1234 5678 9012"
                                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-900 font-mono tracking-wider focus:outline-none focus:border-[#F4C430]"
                              />
                              <p className="text-[9px] text-slate-400 mt-1">Required for local secure checkposts in Jammu & Kashmir.</p>
                            </div>
                          ) : (
                            <div>
                              <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Primary Traveler Passport Number *</label>
                              <input 
                                type="text"
                                required
                                value={checkoutForm.passportNumber}
                                onChange={(e) => setCheckoutForm({ ...checkoutForm, passportNumber: e.target.value.toUpperCase() })}
                                placeholder="E.g., Z1234567"
                                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#F4C430]"
                              />
                              <p className="text-[9px] text-slate-400 mt-1">Compulsory for inner-line permits and foreign registry logs due to high-altitude border security.</p>
                            </div>
                          )}

                          {/* Family booking section: If guestsCount > 1, show details for remaining guests */}
                          {checkoutForm.guestsCount > 1 && (
                            <div className="border-t border-slate-200 pt-3 space-y-3">
                              <div className="flex items-center gap-1">
                                <span className="text-xs">👨‍👩‍👦</span>
                                <span className="text-[11px] font-bold text-[#002366] uppercase tracking-wider">Family/Companion Details</span>
                              </div>
                              <p className="text-[9px] text-slate-500 italic leading-snug">
                                As per J&K Tourism directives, only 1 traveler's Aadhaar/Passport is required. Please declare other companion names and genders below:
                              </p>

                              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                {Array.from({ length: checkoutForm.guestsCount - 1 }).map((_, idx) => {
                                  const companion = checkoutForm.otherTravelers[idx] || { name: '', gender: 'Male' };
                                  return (
                                    <div key={idx} className="p-2.5 bg-white border border-slate-100 rounded-lg space-y-2">
                                      <span className="text-[10px] uppercase font-mono font-bold text-orange-600">Companion #{idx + 2}</span>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="text-[9px] font-bold text-slate-400 block mb-0.5">FULL NAME *</label>
                                          <input
                                            type="text"
                                            required
                                            value={companion.name}
                                            onChange={(e) => {
                                              const list = [...checkoutForm.otherTravelers];
                                              if (!list[idx]) list[idx] = { name: '', gender: 'Male' };
                                              list[idx] = { ...list[idx], name: e.target.value };
                                              setCheckoutForm({ ...checkoutForm, otherTravelers: list });
                                            }}
                                            placeholder={`Guest ${idx + 2} Name`}
                                            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-950 focus:outline-none focus:border-[#002366]"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-[9px] font-bold text-slate-400 block mb-0.5">GENDER *</label>
                                          <select
                                            value={companion.gender}
                                            onChange={(e) => {
                                              const list = [...checkoutForm.otherTravelers];
                                              if (!list[idx]) list[idx] = { name: '', gender: 'Male' };
                                              list[idx] = { ...list[idx], gender: e.target.value };
                                              setCheckoutForm({ ...checkoutForm, otherTravelers: list });
                                            }}
                                            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-950 focus:outline-none focus:border-[#002366]"
                                          >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Infant specifications panel */}
                          <div className="border-t border-slate-200 pt-3">
                            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-705 select-none text-slate-700">
                              <input 
                                type="checkbox"
                                checked={checkoutForm.hasInfants}
                                onChange={(e) => setCheckoutForm({ ...checkoutForm, hasInfants: e.target.checked })}
                                className="rounded text-[#002366] focus:ring-[#002366]"
                              />
                              <span>Traveling with infants (under 2 years)?</span>
                            </label>
                            
                            {checkoutForm.hasInfants && (
                              <div className="mt-2 text-left bg-amber-50/55 p-2.5 rounded-lg border border-amber-200 space-y-1 animate-fade-in">
                                <label className="text-[9px] font-bold text-amber-800 uppercase block">Please let us know infants' details:</label>
                                <textarea
                                  rows={2}
                                  required
                                  value={checkoutForm.infantDetails}
                                  onChange={(e) => setCheckoutForm({ ...checkoutForm, infantDetails: e.target.value })}
                                  placeholder="E.g., Baby Kabir, 10 months old, needs hot milk flasks and safety cot during Srinagar houseboat stay."
                                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                                />
                                <p className="text-[8.5px] text-amber-700 leading-normal">
                                  Our team provides hot flasks, room heating adjustments, and child safety accessories complimentary.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* HIGH PRIORITY: Mandatory Indian PAN Card validation for financial audit checks in high risk J&K border territory */}
                        <div className="p-3 bg-orange-50 border border-[#F4C430] rounded-xl space-y-1.5">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] uppercase font-bold text-[#002366] flex items-center gap-1 font-mono">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#F4C430]" /> Mandatory Indian PAN Card *
                            </label>
                            <span className="text-[9px] font-mono text-slate-500">Regulated Tourism Act</span>
                          </div>
                          <input 
                            type="text" 
                            required
                            maxLength={10}
                            value={checkoutForm.panCard}
                            onChange={(e) => setCheckoutForm({ ...checkoutForm, panCard: e.target.value.toUpperCase() })}
                            placeholder="ABCDE1234F"
                            className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-900 font-bold uppercase tracking-wider font-mono focus:outline-none focus:border-[#F4C430]"
                          />
                          <p className="text-[8.5px] text-slate-550 leading-relaxed font-serif">
                            Indian Income Tax clause requires tour booking operators to log customer PAN details. Format: 5 alphabet characters followed by 4 digits and 1 alphabet.
                          </p>
                        </div>
                      </div>

                      {/* Display final estimated sum */}
                      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold font-mono">{language === 'HI' ? 'अनुमानित कुल देय राशि' : 'ESTIMATED PAYABLE GRAND SUM'}</span>
                          <span className="text-xl font-bold text-[#002366]">
                            {formatPrice(activeCheckoutPackage.price * checkoutForm.guestsCount)}
                          </span>
                        </div>
                        <div className="text-right text-[10px] text-slate-500">
                          <p>{formatPrice(activeCheckoutPackage.price)} x {checkoutForm.guestsCount} {language === 'HI' ? 'अतिथि' : 'guests'}</p>
                          <p className="font-semibold text-green-700">{language === 'HI' ? 'जीएसटी पूरी तरह शामिल' : 'GST Fully Included'}</p>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#002366] text-[#F4C430] py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] border border-[#F4C430] hover:bg-orange-600 hover:text-white transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                      >
                        <Lock className="w-4 h-4" /> {language === 'HI' ? 'सुरक्षित भुगतान शुरू करें' : 'Initialize Secure Payment'}
                      </button>
                    </form>
                  )}

                  {/* ACTIVE SIMULATION OVERLAY SCREEN */}
                  {(paymentStep === 'CreatingOrder' || paymentStep === 'Verifying') && (
                    <div className="space-y-6 py-8 text-center bg-slate-50/50 rounded-2xl p-6">
                      <div className="flex justify-center items-center gap-3">
                        <div className="w-3.5 h-3.5 bg-orange-500 rounded-full animate-ping"></div>
                        <span className="text-sm font-semibold text-[#002366] font-mono animate-pulse">
                          {paymentStep === 'CreatingOrder' ? "Contacting Razorpay APIs..." : "Interactive Handshake with Sec-Server..."}
                        </span>
                      </div>

                      <div className="bg-[#002366] text-[#F4C430] p-4 rounded-xl text-left max-h-48 overflow-y-auto font-mono text-[10px] space-y-1.5 scrollbar-thin">
                        <p className="text-[9px] text-[#F4C430]/70 uppercase font-bold pb-1 border-b border-[#F4C430]/10 tracking-widest block mb-2">LIVE BANK TRANSACTION STREAM LOGGER</p>
                        {paymentLog.map((log, idx) => (
                          <div key={idx} className="flex gap-2">
                            <span className="text-slate-450 text-[8px]">{idx + 1}.</span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>

                      <div className="text-xs text-slate-500 italic max-w-sm mx-auto leading-normal">
                        "Your safety is primary. Sheenora security integrates automated Indian PAN validation against standard databases."
                      </div>
                    </div>
                  )}

                  {/* TRANSACTION SUCCESS */}
                  {paymentStep === 'Success' && activeBookingResult && (
                    <div className="text-center py-6 space-y-5 animate-fade-in text-slate-900">
                      <div className="w-16 h-16 bg-green-50 rounded-full mx-auto flex items-center justify-center border-2 border-green-500 text-green-600">
                        <Check className="w-8 h-8 stroke-[3]" />
                      </div>

                      <div>
                        <h4 className="text-2xl font-serif font-bold text-green-700">Wazwan-infused J&K Greeting!</h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                          Payment verified. Saffron tour itinerary has been generated online and dispatched. Your Kashmiri guide represents your safety.
                        </p>
                      </div>

                      <div className="bg-slate-50 p-4 border border-dashed rounded-xl max-w-sm mx-auto text-left space-y-1 text-xs font-mono text-[#002366]">
                        <p className="font-bold border-b pb-1 mb-2">PASS RESERVATION VOUCHER</p>
                        <p><strong>Customer Name:</strong> {activeBookingResult.customerName}</p>
                        <p><strong>Tour Target:</strong> {activeBookingResult.packageName}</p>
                        <p><strong>Total Guests:</strong> {activeBookingResult.guestsCount}</p>
                        <p><strong>Escrow Paid sum:</strong> {formatPrice(activeBookingResult.totalPrice)}</p>
                        <p><strong>PAN Registered:</strong> {activeBookingResult.panCard}</p>
                        <p><strong>Date of Arrival:</strong> {activeBookingResult.travelDate}</p>
                        <p><strong>Lead Status:</strong> <span className="p-1 text-[9px] ml-1 rounded bg-green-500 text-white font-bold">{activeBookingResult.leadStatus}</span></p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                        <a 
                          target="_blank"
                          rel="noreferrer"
                          href={`https://wa.me/917006770665?text=Hello%20Sheenora%20Journeys!%20My%20deposit%20is%20processed!%20Reservation%20ID%3A%20${activeBookingResult.id}.`}
                          className="bg-green-650 hover:bg-green-600 text-white text-xs font-bold font-sans uppercase px-5 py-2.5 rounded-xl block transition-all shadow-md text-center"
                        >
                          Send WhatsApp Voucher Receipt
                        </a>
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="bg-amber-500 hover:bg-amber-600 text-[#002366] hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition-colors inline-flex items-center gap-1.5 justify-center cursor-pointer border border-amber-500"
                        >
                          <Printer className="w-4 h-4" />
                          Print Voucher
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveCheckoutPackage(null)}
                          className="bg-[#002366] text-[#F4C430] hover:bg-[#F4C430] hover:text-[#002366] px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition-colors text-center cursor-pointer"
                        >
                          Close Receipt Window
                        </button>
                      </div>
                    </div>
                  )}

                  {paymentStep === 'Failed' && (
                    <div className="text-center py-8 space-y-4">
                      <div className="w-16 h-16 bg-red-50 rounded-full mx-auto flex items-center justify-center border-2 border-red-500 text-red-600">
                        <X className="w-8 h-8 stroke-[3]" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold font-serif text-red-700">Financial Order Refused</h4>
                        <p className="text-xs text-slate-500 mt-2">
                          Your standard signature check did not clear with Sheenora J&K server, or Indian PAN card registry failed format check. Details logged online.
                        </p>
                      </div>
                      <button
                        onClick={() => setPaymentStep('Idle')}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-bold font-mono text-xs uppercase"
                      >
                        Adjust PAN Card & Retry
                      </button>
                    </div>
                  )}

                </div>

              </div>

            </div>
          </div>
        )}

        {/* SECTION: SCENIC KASHMIR PHOTO ALBUM */}
        <section id="scenic-photo-album" className="scroll-mt-24 space-y-8 relative z-10 bg-[#002366]/5 p-6 sm:p-10 rounded-3xl border border-slate-200/60">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase bg-[#002366]/10 text-[#002366] px-3 py-1 rounded inline-block font-bold border border-[#002366]/10">
                ✨ {language === 'HI' ? 'कश्मीर फोटोग्राफी एल्बम' : 'Kashmir Scenic Photo Album'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#002366] tracking-tight">
                {language === 'HI' ? 'अतुल्य दृश्य और सांस्कृतिक डायरी' : 'Unveiling Kashmir’s Visual Majesty'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                {language === 'HI' 
                  ? 'श्रीनगर की शांत झीलों से लेकर गुलमर्ग की बर्फीली चोटियों तक, हमारे कश्मीरी स्थानीय गाइडों द्वारा कैप्चर किए गए सबसे जादुई कोनों की खोज करें।'
                  : 'From the sapphire waterways of Dal Lake to the snow-creased colossal peaks of Apharwat, tour the absolute scenic best of Kashmir through our immersive photography vault.'}
              </p>
            </div>

            {/* Photo Search and Filter Pill Container */}
            <div className="relative w-full sm:w-80 shrink-0">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder={language === 'HI' ? 'जगह या टैग द्वारा खोजें...' : 'Filter photos by tag or spot...'}
                value={photoSearch}
                onChange={(e) => setPhotoSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002366]/20 font-sans shadow-sm"
              />
              {photoSearch && (
                <button 
                  onClick={() => setPhotoSearch('')} 
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {cmsMode && (
            <div className="bg-orange-50 border-2 border-[#F4C430] rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#002366]">
                  <Lock className="w-4 h-4 text-[#002366]" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">Sheenora Interactive Photo Gallery Manager Active</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">As Admin, you can add new photographs, edit titles, locations, altitudes, and historical lore inline, or permanently purge photos without editing any code.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewGalleryItem({ title: '', url: '', tags: [], location: '', altitude: '', lore: '' });
                  setNewGalleryTagsInput('');
                  setShowAddGalleryModal(true);
                }}
                className="bg-[#002366] text-[#F4C430] hover:bg-white hover:text-[#002366] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-[#002366]/25 shadow-xs whitespace-nowrap self-end md:self-auto"
              >
                <Plus className="w-4 h-4 text-[#F4C430]" />
                Add Photograph
              </button>
            </div>
          )}

          {/* Tag Filter Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-200">
            {['All', 'Srinagar', 'Gulmarg', 'Pahalgam', 'Nature', 'Culture', 'Offbeat'].map((tag) => {
              const isActive = photoFilter === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setPhotoFilter(tag)}
                  className={`px-4 py-1.5 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#002366] text-[#F4C430] shadow-md scale-[1.03]'
                      : 'bg-white hover:bg-slate-250 text-slate-600 border border-slate-200'
                  }`}
                >
                  {tag === 'All' ? (language === 'HI' ? 'सभी एल्बम' : 'All Spots') : tag}
                </button>
              );
            })}
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredPhotos.map((photo) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={photo.url}
                  onClick={() => setActivePhoto(photo)}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:border-[#F4C430] cursor-pointer"
                >
                  <div className="relative aspect-video sm:aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />
                    
                    {/* Location Tag */}
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-slate-900/85 backdrop-blur-md rounded-lg text-[9px] text-white font-mono font-medium border border-white/10 uppercase">
                      <MapPin className="w-2.5 h-2.5 text-[#F4C430]" />
                      {photo.location ? photo.location.split(',')[0] : 'Kashmir'}
                    </div>

                    {/* Admin Actions Overlay */}
                    {cmsMode && (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingGalleryItem(photo);
                          }}
                          className="p-1.5 bg-white/95 text-[#002366] hover:bg-[#F4C430] hover:text-[#002366] rounded-lg transition-colors shadow-sm border border-slate-205 cursor-pointer"
                          title="Edit Photo Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(language === 'HI' ? 'क्या आप वाकई इस तस्वीर को हटाना चाहते हैं?' : 'Are you sure you want to permanently delete this photo from the gallery?')) {
                              handleDeleteGalleryItem(photo.id);
                            }
                          }}
                          className="p-1.5 bg-white/95 text-red-650 hover:bg-red-600 hover:text-white rounded-lg transition-colors shadow-sm border border-red-200 cursor-pointer"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    
                    {/* Visual Hover Explore Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="px-4 py-2 bg-white/95 text-[#002366] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg border border-[#F4C430] flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <Sparkles className="w-3.5 h-3.5 text-[#F4C430]" />
                        {language === 'HI' ? 'अन्वेषण करें' : 'Details'}
                      </span>
                    </div>

                    {/* Meta info Overlay always visible on bottom */}
                    <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                      <p className="font-serif font-semibold text-sm tracking-tight drop-shadow-md truncate">{photo.title}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono">
                        <span>{photo.altitude || 'Himalayas'}</span>
                        <span className="text-orange-300 text-[9px] font-bold uppercase py-0.5 px-1.5 rounded bg-white/10 border border-white/5">{photo.tags[0]}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredPhotos.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-350 text-slate-400 space-y-3">
                <Compass className="w-12 h-12 mx-auto text-slate-300 animate-spin-slow stroke-[1.2]" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-700">{language === 'HI' ? 'कोई मेल खाने वाले फोटो नहीं मिले।' : 'No matches found in our kashmiri scenic diaries.'}</p>
                  <p className="text-xs text-slate-400">Try checking different spellings or selecting another quick pill filter.</p>
                </div>
                <button 
                  onClick={() => { setPhotoSearch(''); setPhotoFilter('All'); }}
                  className="bg-[#002366]/5 hover:bg-[#002366]/10 text-[#002366] px-4 py-2 rounded-xl text-xs font-bold border border-[#002366]/10 transition-colors"
                >
                  Clear search filters
                </button>
              </div>
            )}
          </div>

          {/* LIGHTBOX SLIDER MODAL */}
          <AnimatePresence>
            {activePhoto && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
              >
                {/* Backdrop Click */}
                <div className="absolute inset-0" onClick={() => setActivePhoto(null)} />

                <motion.div
                  initial={{ scale: 0.95, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 15 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                  className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-5xl w-full shadow-2xl relative z-10 grid grid-cols-1 md:grid-cols-12"
                >
                  {/* Left Column: Visual Saffron Sized Photo Media Frame */}
                  <div className="md:col-span-7 relative aspect-video md:aspect-auto md:h-[500px] bg-black group/lightbox">
                    <img
                      src={activePhoto.url}
                      alt={activePhoto.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Absolute navigation arrows on overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handlePrevPhoto(); }}
                        className="pointer-events-auto bg-black/75 hover:bg-[#F4C430] text-white hover:text-slate-950 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer group-hover/lightbox:scale-105"
                      >
                        <span className="font-sans font-black text-sm">◀</span>
                      </button>
                      
                      <div className="bg-slate-950/85 text-[10px] text-slate-300 px-3 py-1 rounded-full font-mono border border-white/5">
                        {gallery.findIndex(p => p.url === activePhoto.url) + 1} / {gallery.length}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleNextPhoto(); }}
                        className="pointer-events-auto bg-black/75 hover:bg-[#F4C430] text-white hover:text-slate-950 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer group-hover/lightbox:scale-105"
                      >
                        <span className="font-sans font-black text-sm">▶</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Information, Lore, Coordinates & customized trigger action */}
                  <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between text-white space-y-6">
                    <div className="space-y-4">
                      {/* Top closing option */}
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono uppercase bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg">
                          🏞️ Kashmiri Scenic Diaries
                        </span>
                        <button
                          type="button"
                          onClick={() => setActivePhoto(null)}
                          className="w-7 h-7 rounded-full bg-slate-800 hover:bg-red-500 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xl sm:text-2xl font-serif font-black text-white tracking-tight leading-snug">{activePhoto.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                          <span className="flex items-center gap-1 leading-tight">
                            <MapPin className="w-3.5 h-3.5 text-[#F4C430]" />
                            {activePhoto.location || 'Kashmir'}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-b border-slate-800 py-3.5 space-y-2">
                        <p className="text-[10px] font-mono text-[#F4C430] uppercase tracking-wider font-bold">Heritage Lore & Guide Insights:</p>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans font-light">
                          {activePhoto.lore || 'One of the most picturesque, peaceful territories nestled inside the majestic Himalayas. A timeless retreat of mountain beauty.'}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
                        <div className="bg-slate-800/40 p-2.5 border border-slate-800 rounded-xl space-y-0.5">
                          <span className="text-slate-500 block uppercase font-bold text-[8px]">Scenic Altitude</span>
                          <span className="text-[#F4C430] font-sans font-medium">{activePhoto.altitude || 'Mountain Peak'}</span>
                        </div>
                        <div className="bg-slate-800/40 p-2.5 border border-slate-800 rounded-xl space-y-0.5">
                          <span className="text-slate-500 block uppercase font-bold text-[8px]">Photo Category</span>
                          <span className="text-emerald-400 font-sans font-medium uppercase font-bold text-[9px]">{activePhoto.tags ? activePhoto.tags[0] : 'Kashmir'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 space-y-2">
                      <button
                        type="button"
                        onClick={() => handlePhotoInquire(activePhoto)}
                        className="w-full py-3 bg-[#F4C430] hover:bg-[#F4C430]/90 text-slate-900 font-sans font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Compass className="w-4 h-4 shrink-0" />
                        {language === 'HI' ? 'इस जगह के लिए टूर प्लान करें' : 'Plan Trip To This Spot'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActivePhoto(null)}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-sans text-xs uppercase rounded-xl transition-all cursor-pointer"
                      >
                        {language === 'HI' ? 'वापस जाएँ' : 'Back to Diaries'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* SECTION: KASHMIRI ENRICHING HERITAGE DIARIES */}
        <section id="heritage-diaries" className="bg-white rounded-3xl p-8 sm:p-12 shadow-md border border-slate-200/80 scroll-mt-24 space-y-8 relative overflow-hidden">
          
          {/* Subtle star elements */}
          <div className="absolute right-0 bottom-0 opacity-5">
            <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor" className="text-[#002366]">
              <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
            </svg>
          </div>

          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-mono uppercase bg-[#F4C430]/10 text-orange-600 px-3 py-1 rounded inline-block font-bold">Kashmiri Culture Guides</span>
            <h2 className="text-3xl font-serif font-semibold text-[#002366]">The Essence of Kashmiri Art & Life</h2>
            <p className="text-xs text-slate-500">
              Immerse yourself in ancient Himalayan legacies, majestic culinary creations, and centuries of warm mountain hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            
            <div className="p-5 rounded-2xl bg-orange-50/50 border border-[#F4C430]/30 space-y-3 hover:translate-y-[-4px] transition-transform">
              <div className="w-10 h-10 rounded-xl bg-orange-150 flex items-center justify-center text-orange-700">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-base text-[#002366]">The Kahwa Tradition</h4>
              <p className="text-xs text-slate-550 leading-relaxed">
                Green tea leaves boiled with precious saffron filaments, dry crushed almonds, green cardamoms, and real cinnamon bark. Toast of kings.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#002366]/5 border border-slate-200 space-y-3 hover:translate-y-[-4px] transition-transform">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#002366]">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-base text-[#002366]">Cedar Lake Houseboats</h4>
              <p className="text-xs text-slate-550 leading-relaxed">
                Made of solid cedar wood logs that never decay in lake waters, decorated with delicate Pinjra Kari geometric lattice screens.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-orange-50/50 border border-[#F4C430]/30 space-y-3 hover:translate-y-[-4px] transition-transform">
              <div className="w-10 h-10 rounded-xl bg-orange-150 flex items-center justify-center text-orange-700">
                <Map className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-base text-[#002366]">Wazwan Heritage Feast</h4>
              <p className="text-xs text-slate-550 leading-relaxed">
                The grand 36-course gourmet banquet, prepared ceremonially overnight by master chefs known as Vastas. Infused with wild Kashmiri cockscomb flowers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#002366]/5 border border-slate-200 space-y-3 hover:translate-y-[-4px] transition-transform">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#002366]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-base text-[#002366]">Pashmina hand weavers</h4>
              <p className="text-xs text-slate-550 leading-relaxed">
                Finest raw wool sheared from specific Changthangi high altitude mountain goats, manually spun and intricately embroidered cleanly.
              </p>
            </div>

          </div>
        </section>

        {/* SECTION: GOOGLE MAPS EMBED & CONTACT DESK */}
        <section id="contact-desk" className="grid grid-cols-1 lg:grid-cols-12 gap-8 scroll-mt-24">
          
          {/* Left panel contact information */}
          <div className="lg:col-span-4 bg-[#002366] text-white p-8 sm:p-10 rounded-3xl border-2 border-[#F4C430] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 bg-kashmiri-grid pointer-events-none"></div>

            <div className="space-y-6 relative z-10">
              <span className="text-[9px] font-mono uppercase bg-[#F4C430] text-[#002366] px-2.5 py-1 font-bold rounded">
                Sheenora Hospitality Desk
              </span>
              <h3 className="text-2xl font-serif font-bold">Contact Our Kashmiri Local Guides</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Have a customized requirement or need local weather forecasts, winter clothing advice, or private SUV permits? Contact us anytime.
              </p>

              <div className="space-y-4 pt-4 text-xs font-mono text-slate-200">
                <div className="flex gap-3 items-start">
                  <MapPin className="w-4 h-4 text-[#F4C430] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#F4C430] uppercase text-[9px] tracking-wider">Head Office Address</p>
                    <p className="not-italic">Singhpora, Jammu & Kashmir, PIN 193121</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <PhoneCall className="w-4 h-4 text-[#F4C430] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#F4C430] uppercase text-[9px] tracking-wider">Emergency Help / WhatsApp Desk</p>
                    <p className="font-sans font-bold text-sm">+91 70067 70665</p>
                    <p className="text-[9px] text-slate-400">Available 24 Hours / 7 Days a week</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-700 text-xs font-serif italic text-slate-300 mt-6 relative z-10">
              "We provide custom traditional papier-mâché artifacts as welcome tokens for all families arriving at our Singhpora office."
            </div>
          </div>

          {/* Right panel Google Maps Embed Frame */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md p-2 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-slate-900 text-sm">Interactive Jammu & Kashmir Destination Map</h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Head Office: Singhpora, PIN 193121</p>
              </div>
              <span className="bg-slate-100 text-[#002366] px-2.5 py-1 rounded text-[10px] font-bold font-mono border border-[#002366]/10 uppercase">
                Singhpora Office
              </span>
            </div>

            <div className="flex-1 min-h-80 bg-slate-100 rounded-2xl overflow-hidden relative">
              {/* iframe embedding singhpora map */}
              <iframe 
                title="Singhpora, Jammu & Kashmir Tourism Location Map"
                src="https://maps.google.com/maps?q=Singhpora%20193121%20Jammu%20and%20Kashmir&t=&z=14&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                className="absolute inset-0"
              />
            </div>
          </div>

        </section>

        {/* SECTION: USER DIRECT TRIP TRACKER & ASSIGNED GUIDE DIRECTORY */}
        <section id="my-bookings" className="bg-gradient-to-br from-slate-900 to-[#002366] text-white rounded-3xl p-6 sm:p-10 border border-slate-700/60 scroll-mt-24 space-y-8">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <span className="bg-[#F4C430] text-[#002366] px-3.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-widest inline-block select-none">
              {language === 'HI' ? 'अतिथि ट्रैकर' : 'Direct Traveler Dossier'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
              {language === 'HI' ? 'अपनी कश्मीर यात्रा ट्रैक करें' : 'Track Your Kashmir Journey'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              {language === 'HI' 
                ? 'अपनी अद्वितीय बुकिंग आईडी या संपर्क पूछताछ रसीद (जैसे bk-1718...) दर्ज करें। वास्तविक समय की स्थिति की समीक्षा करें और अपने स्थानीय कश्मीरी रिसोर्स गाइड से संपर्क करें।'
                : 'Enter your custom Booking ID or inquiry receipt (e.g. bk-... or bk-cust-...) to access instant status logs, verify payment escrows, and reach your certified local companion.'}
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-slate-950/40 p-4 sm:p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md">
            <form onSubmit={handleBookingLookup} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  required
                  placeholder={language === 'HI' ? 'अपनी आईडी दर्ज करें (जैसे: bk-1718029381023)' : 'Enter Booking ID (e.g. bk-1718...)'}
                  value={searchBookingId}
                  onChange={(e) => setSearchBookingId(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 hover:border-slate-500 text-white rounded-xl py-3 pl-11 pr-4 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#F4C430] transition-colors uppercase"
                />
              </div>
              <button
                type="submit"
                disabled={isSearchingBooking}
                className="bg-[#F4C430] text-[#002366] hover:bg-white hover:text-[#002366] active:scale-95 px-6 py-3 rounded-xl text-xs font-bold font-sans uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 font-semibold disabled:opacity-50 select-none shrink-0"
              >
                {isSearchingBooking ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    {language === 'HI' ? 'सर्च हो रहा है...' : 'Searching...'}
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    {language === 'HI' ? 'ट्रैक यात्रा कार्यक्रम' : 'Track Itinerary'}
                  </>
                )}
              </button>
            </form>

            {bookingSearchError && (
              <div className="mt-4 p-3.5 rounded-xl bg-red-950/40 border border-red-900/60 text-red-200 text-xs font-mono flex items-center gap-2.5 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{bookingSearchError}</span>
              </div>
            )}
          </div>

          {searchedBooking && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 animate-fade-in text-slate-800">
              {/* Left Column: Booking Status and Ledger */}
              <div className="lg:col-span-7 bg-slate-950/50 rounded-2xl border border-slate-700/40 p-6 space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
                      {language === 'HI' ? 'डिजिटल चालान' : 'Digital Electronic Receipt'}
                    </span>
                    <h3 className="text-base font-bold font-mono text-[#F4C430] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#F4C430]" />
                      {searchedBooking.id}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-widest ${
                    searchedBooking.paymentStatus === 'Paid' 
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' 
                      : searchedBooking.paymentStatus === 'Failed'
                      ? 'bg-red-950/80 text-red-300 border border-red-800'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                  }`}>
                    {searchedBooking.paymentStatus === 'Paid' ? (language === 'HI' ? 'भुगतान पूर्ण ●' : 'Paid ● Live') : 
                     searchedBooking.paymentStatus === 'Failed' ? (language === 'HI' ? 'विफल' : 'Failed') : 
                     (language === 'HI' ? 'प्रतिसाद लंबित' : 'Pending Quotes')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-left">
                  <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/40 space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{language === 'HI' ? 'पंजीकृत यात्री' : 'Registered Lead'}</p>
                    <p className="text-white font-sans font-bold text-sm">{searchedBooking.customerName}</p>
                  </div>
                  <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/40 space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{language === 'HI' ? 'प्रस्थान तिथि' : 'Scheduled Departure'}</p>
                    <p className="text-[#F4C430] font-bold text-sm">{searchedBooking.travelDate}</p>
                  </div>
                  <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/40 space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{language === 'HI' ? 'अतिथि संख्या' : 'Travel Group Size'}</p>
                    <p className="text-white text-sm font-bold">{searchedBooking.guestsCount} {searchedBooking.guestsCount === 1 ? 'Traveler' : 'Travelers'}</p>
                  </div>
                  <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/40 space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{language === 'HI' ? 'एस्क्रो जमा' : 'Secured Escrow Deposit'}</p>
                    <p className="text-emerald-400 text-sm font-bold font-serif">{searchedBooking.totalPrice > 0 ? formatPrice(searchedBooking.totalPrice) : (language === 'HI' ? 'कस्टम कोट' : 'Custom Quoting')}</p>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                  <p className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#F4C430]" />
                    {language === 'HI' ? 'चयनित यात्रा कार्यक्रम' : 'Confirmed Saffron Route'}
                  </p>
                  <p className="text-xs text-white font-semibold font-sans leading-relaxed">
                    {searchedBooking.packageName}
                  </p>
                </div>

                {searchedBooking.customRequirements && (
                  <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-800 text-slate-400 text-[11px] leading-relaxed text-left">
                    <strong>{language === 'HI' ? 'कस्टम आवश्यकताएँ:' : 'Custom traveler notes:'}</strong> {searchedBooking.customRequirements}
                  </div>
                )}

                {/* Dynamic Nationality Security Logs inside search status */}
                <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800 text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#F4C430]" /> Border Permit Intelligence Log
                    </span>
                    <span className="text-[9px] font-mono font-bold text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded border border-orange-850">Verified</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">NATIONALITY STATUS</p>
                      <p className="text-white font-sans font-semibold">
                        {searchedBooking.nationality === 'Foreign' ? '🏳️ Foreign National' : '🇮🇳 Indian National'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">SECURED IDENTITY PERMIT ID</p>
                      <p className="text-white font-mono font-bold font-semibold">
                        {searchedBooking.nationality === 'Foreign' 
                          ? `Passport: ${searchedBooking.passportNumber || 'N/A'}` 
                          : `Aadhaar: ${searchedBooking.aadhaarNumber || 'N/A'}`}
                      </p>
                    </div>
                  </div>

                  {/* Companion travelers roster if any */}
                  {searchedBooking.otherTravelers && searchedBooking.otherTravelers.length > 0 && (
                    <div className="border-t border-slate-800/60 pt-3 space-y-2">
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Companion Manifest ({searchedBooking.otherTravelers.length})</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {searchedBooking.otherTravelers.map((traveler: any, index: number) => (
                          <div key={index} className="bg-slate-950/40 p-2 rounded-lg border border-slate-900 flex justify-between items-center text-[11px]">
                            <span className="text-white truncate max-w-[120px] font-sans font-medium">{traveler.name}</span>
                            <span className="text-[#F4C430] text-[10px] uppercase font-mono bg-[#002366] px-1.5 py-0.5 rounded-md font-bold">{traveler.gender}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Infant Travel log */}
                  {searchedBooking.hasInfants && (
                    <div className="border-t border-slate-800/60 pt-3 space-y-1 bg-amber-950/15 p-2 rounded-lg border border-amber-900/30">
                      <p className="text-[10px] font-mono text-amber-500 uppercase font-bold tracking-wider flex items-center gap-1">
                        🍼 High-Altitude Infant Travel Care Active
                      </p>
                      <p className="text-slate-300 text-[11px] leading-relaxed font-sans mt-1">
                        {searchedBooking.infantDetails || 'Infants accompanying travel log initiated.'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 text-[10px] text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>{language === 'HI' ? 'एस्क्रो निधि बैंक स्तर एन्क्रिप्शन द्वारा सुरक्षित' : 'Active booking instance validated. 256-bit Secure direct verification keys match.'}</span>
                </div>
              </div>

              {/* Right Column: Dynamic Assigned Guide Dossier */}
              {searchedBookingGuide && (
                <div className="lg:col-span-5 bg-gradient-to-b from-[#112F6C] to-slate-950 p-6 rounded-2xl border-2 border-[#F4C430] space-y-5 flex flex-col justify-between text-left">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img 
                          src={searchedBookingGuide.avatar} 
                          alt={searchedBookingGuide.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-[#F4C430] shadow-md animate-fade-in"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 text-[8px] font-bold border border-slate-900 flex items-center justify-center w-5 h-5 shadow-sm" title="Online & On duty">
                          ●
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-base font-bold text-white font-serif">{searchedBookingGuide.name}</h4>
                          <span className="text-[10px] text-[#F4C430] font-bold font-mono bg-slate-900/40 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            ★ {searchedBookingGuide.rating}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#F4C430] font-semibold uppercase tracking-wider font-mono">
                          {searchedBookingGuide.role}
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed italic">
                      "{searchedBookingGuide.bio}"
                    </p>

                    <div className="space-y-1.5 pt-1.5 border-t border-slate-800 text-[11px] font-mono text-left">
                      <p><strong className="text-slate-400">{language === 'HI' ? 'बोली जाने वाली भाषाएं:' : 'Languages:'}</strong> {searchedBookingGuide.languages}</p>
                      <p><strong className="text-slate-400">{language === 'HI' ? 'असाइनमेंट स्टेटस:' : 'Assignment Status:'}</strong> <span className="text-emerald-400 font-bold">Confirmed Tour Lead</span></p>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800 text-[10px] text-slate-300 leading-normal">
                      🛡️ <strong>Safety Mandate:</strong> Your assigned guide is licensed with J&K Forest Department & Tourism Council, fully equipped with emergency medical kits and satellite-synced track mapping.
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <a 
                        href={`tel:${searchedBookingGuide.phone.replace(/\+/g, '').replace(/\s+/g, '')}`} 
                        className="bg-slate-900 hover:bg-[#F4C430] text-white hover:text-[#002366] font-bold uppercase text-[10px] py-3 rounded-xl tracking-wider text-center flex items-center justify-center gap-1.5 border border-slate-705 transition-all cursor-pointer"
                      >
                        📞 Call Guide
                      </a>
                      <a 
                        href={`https://wa.me/${searchedBookingGuide.phone.replace(/\+/g, '').replace(/\s+/g, '')}?text=Hello%20${encodeURIComponent(searchedBookingGuide.name)},%20I%20am%20tracking%2520my%20Sheenora%20booking%20ID%2520${encodeURIComponent(searchedBooking.id)}.%20Please%20verify%20our%20assigned%20route.`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase text-[10px] py-3 rounded-xl tracking-wider text-center flex items-center justify-center gap-1.5 border border-emerald-500 transition-all cursor-pointer"
                      >
                        💬 WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* SECTION: ACTIVE REAL-TIME BOOKINGS & INQUIRIES STREAM */}
        <section id="leads-board" className="bg-slate-100 rounded-3xl p-6 sm:p-8 border border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-350 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="font-mono font-bold uppercase text-[10px] tracking-widest text-[#002366]">{language === 'HI' ? 'रियल-टाइम बुकिंग लॉग' : 'Real-Time Booking Log'}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#002366] mt-1">{language === 'HI' ? 'लाइव पूछताछ एवं लीड बोर्ड' : 'Live Inquiry & Lead Board'}</h3>
              <p className="text-xs text-slate-550 font-semibold">{language === 'HI' ? 'प्राप्त अनुरोधों, पंजीकरण सूचियों और सक्रिय यात्रा पोर्टफोलियो को तुरंत सत्यापित करें।' : 'Verify received requests, registration lists, and active custom traveler portfolios instantly.'}</p>
            </div>

            <button 
              onClick={fetchBookings}
              className="bg-white hover:bg-slate-150 text-slate-700 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-colors inline-flex items-center gap-1.5 border border-slate-300 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> {language === 'HI' ? 'बोर्ड रिफ्रेश करें' : 'Refresh live board'}
            </button>
          </div>

          {!cmsMode ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm my-6">
              <div className="w-16 h-16 bg-amber-50 rounded-full mx-auto flex items-center justify-center border-2 border-[#F4C430] text-[#002366] animate-pulse">
                <Lock className="w-8 h-8 stroke-[2]" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold font-serif text-[#002366]">
                  {language === 'HI' ? 'ग्राहक अभिलेख सुरक्षा लॉक (PII सुरक्षित)' : 'Traveler Registry Secured (PII Protected)'}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {language === 'HI' 
                    ? 'यह रीयल-टाइम लीड स्ट्रीम कश्मीरी यात्रियों के व्यक्तिगत पहचान विवरण (PII), संपर्क जानकारी, और वित्तीय एस्क्रो भुगतानों को सुरक्षित रखती है। विवरण देखने, सिंक करने या संपादित करने के लिए कृपया प्रशासक कुंजी सत्यापित करें।' 
                    : 'This active traveler dossier is locked for privacy compliance. Customer names, communication coordinates, specific prebooking itineraries, and real-time transits are fully encrypted. Please authenticate as Administrator to launch live synchronizations, export lists, and edit elements.'}
                </p>
              </div>
              <button 
                onClick={handleAdminToggle}
                className="bg-[#002366] hover:bg-[#F4C430] text-[#F4C430] hover:text-[#002366] px-6 py-3 rounded-xl text-xs font-bold font-sans uppercase tracking-wider border border-[#F4C430] shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                {language === 'HI' ? 'अभिलेख बोर्ड अनलॉक करें' : 'Unlock Leads Board'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tab Selector & Data Export */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-2">
                <div className="flex gap-6">
                  <button
                    type="button"
                    onClick={() => { setCrmActiveTab('bookings'); fetchBookings(); }}
                    className={`pb-2 px-1 text-xs uppercase font-bold tracking-wider relative transition-colors cursor-pointer outline-none ${
                      crmActiveTab === 'bookings' ? 'text-[#002366]' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {language === 'HI' ? 'सक्रिय बुकिंग एवं लीड्स' : 'Active Bookings & Leads'}
                    {crmActiveTab === 'bookings' && (
                      <motion.div layoutId="activeCrmTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#002366]" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCrmActiveTab('customers'); fetchCustomers(); }}
                    className={`pb-2 px-1 text-xs uppercase font-bold tracking-wider relative transition-colors cursor-pointer outline-none ${
                      crmActiveTab === 'customers' ? 'text-[#002366]' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {language === 'HI' ? 'ग्राहक निर्देशिका (CRM)' : 'Customer Directory (CRM)'}
                    {crmActiveTab === 'customers' && (
                      <motion.div layoutId="activeCrmTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#002366]" />
                    )}
                  </button>
                </div>

                {/* Excel Export Action */}
                <button
                  type="button"
                  onClick={crmActiveTab === 'bookings' ? exportBookingsToExcel : exportCustomersToExcel}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-bold shadow transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer self-start sm:self-auto"
                  title="Download and open in Excel"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  {language === 'HI' 
                    ? (crmActiveTab === 'bookings' ? 'बुकिंग एक्सेल निर्यात' : 'ग्राहक एक्सेल निर्यात') 
                    : (crmActiveTab === 'bookings' ? 'Export Bookings to Excel' : 'Export Directory to Excel')}
                </button>
              </div>

              {crmActiveTab === 'bookings' ? (
                <div className="overflow-x-auto rounded-xl bg-white border border-slate-200/80 animate-fade-in">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#002366]/4 prose text-slate-600 font-mono border-b border-slate-200">
                        <th className="p-4 uppercase tracking-wider font-bold">{language === 'HI' ? 'पूछताछ आईडी' : 'ID'}</th>
                        <th className="p-4 uppercase tracking-wider font-bold">{language === 'HI' ? 'ग्राहक विवरण' : 'Client Dossier'}</th>
                        <th className="p-4 uppercase tracking-wider font-bold">{language === 'HI' ? 'यात्रा कार्यक्रम' : 'Selected Itinerary'}</th>
                        <th className="p-4 uppercase tracking-wider font-bold">{language === 'HI' ? 'यात्रा विवरण' : 'Trip Details'}</th>
                        <th className="p-4 uppercase tracking-wider font-bold">{language === 'HI' ? 'एस्क्रो पेड' : 'Escrow Paid'}</th>
                        <th className="p-4 uppercase tracking-wider font-bold text-center">{language === 'HI' ? 'पैन' : 'PAN'}</th>
                        <th className="p-4 uppercase tracking-wider font-bold text-center">{language === 'HI' ? 'जोहो सीआरएम' : 'Zoho CRM'}</th>
                        <th className="p-4 uppercase tracking-wider font-bold text-right">{language === 'HI' ? 'नियंत्रण' : 'Control'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-slate-755">
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-450 italic">
                            {language === 'HI' ? 'अभी तक कोई ग्राहक लीड या भुगतान संसाधित नहीं किया गया है।' : 'No customer leads or payments processed yet.'}
                          </td>
                        </tr>
                      ) : (
                        bookings.map((bk) => (
                          <tr key={bk.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-bold text-[#002366]">{bk.id}</td>
                            <td className="p-4 font-sans">
                              <p className="font-bold text-slate-900 text-xs">{bk.customerName}</p>
                              <div className="text-[10px] text-slate-500 font-mono mt-1 space-y-0.5">
                                <p className="flex items-center gap-1">✉ {bk.customerEmail}</p>
                                <p className="flex items-center gap-1">📞 {bk.customerPhone}</p>
                              </div>
                            </td>
                            <td className="p-4 max-w-xs truncate font-sans text-[11px] font-semibold text-slate-650" title={bk.packageName}>
                              {bk.packageName}
                            </td>
                            <td className="p-4 font-sans">
                              <p className="text-xs font-bold text-slate-800">{bk.travelDate}</p>
                              <p className="text-[9px] text-slate-400 font-mono mt-0.5 uppercase tracking-wider">
                                {bk.guestsCount} {bk.guestsCount === 1 ? 'Guest' : 'Guests'}
                              </p>
                            </td>
                            <td className="p-4 font-sans">
                              <p className="font-bold text-emerald-700 text-xs">{formatPrice(bk.totalPrice)}</p>
                              <span className="block text-[8px] font-mono font-bold uppercase mt-1">
                                {bk.paymentStatus === 'Paid' ? (
                                  <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">● Live Escrow</span>
                                ) : (
                                  <span className="text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">● Custom Lead</span>
                                )}
                              </span>
                            </td>
                            <td className="p-4 text-center font-bold tracking-wider font-mono text-xs">{bk.panCard || 'N/A'}</td>
                            <td className="p-4 text-center">
                              <div className="flex flex-col gap-1.5 items-center">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                                  bk.leadStatus === 'Synced with Zoho CRM' 
                                    ? 'bg-blue-50 text-blue-800 border border-blue-250' 
                                    : 'bg-amber-50 text-amber-800 border border-amber-250'
                                }`}>
                                  {language === 'HI' 
                                    ? (bk.leadStatus === 'Synced with Zoho CRM' ? 'जोहो सिंक' : 'लोकल कैप्चर') 
                                    : bk.leadStatus}
                                </span>
                                {bk.leadStatus !== 'Synced with Zoho CRM' && (
                                  <button
                                    onClick={() => syncLeadToZoho(bk.id)}
                                    className="text-[9px] font-bold text-[#002366] hover:text-[#F4C430] underline cursor-pointer font-sans uppercase tracking-wider flex items-center gap-1 justify-center"
                                  >
                                    <RefreshCw className="w-2.5 h-2.5" /> Force Sync
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex gap-1.5 justify-end">
                                <button
                                  onClick={() => setEditingBooking(bk)}
                                  className="bg-blue-50 text-blue-700 hover:bg-[#002366] hover:text-[#F4C430] p-2.5 rounded-xl transition-colors cursor-pointer border border-blue-150"
                                  title="Edit traveler parameters"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteBookingLead(bk.id)}
                                  className="bg-red-50 text-red-650 hover:bg-red-600 hover:text-white p-2.5 rounded-xl transition-colors cursor-pointer border border-red-150"
                                  title="Purge booking record securely"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  {/* Inline Customer Editor Overlay */}
                  {editingCustomer && (
                    <div className="bg-amber-50/50 border border-[#F4C430]/40 rounded-2xl p-5 relative animate-fade-in font-sans">
                      <div className="flex justify-between items-center mb-3 border-b border-amber-200/50 pb-2">
                        <h4 className="text-xs font-bold text-[#002366] uppercase tracking-wider">
                          {language === 'HI' ? 'ग्राहक प्रोफ़ाइल व प्राथमिकता विवरण संपादित करें' : 'Edit Customer Profile & Safe PII Prefs'}
                        </h4>
                        <button 
                          onClick={() => setEditingCustomer(null)}
                          className="text-slate-400 hover:text-slate-600 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Full Name</label>
                          <input 
                            type="text" 
                            value={editingCustomer.name} 
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#002366] font-sans" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Phone Coordinate</label>
                          <input 
                            type="text" 
                            value={editingCustomer.phone} 
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#002366] font-sans" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">PAN Card Verification</label>
                          <input 
                            type="text" 
                            value={editingCustomer.panCard || ''} 
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, panCard: e.target.value })}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#002366] font-sans" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Private Safe CRM Notes</label>
                          <textarea 
                            value={editingCustomer.notes || ''} 
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, notes: e.target.value })}
                            rows={2}
                            placeholder="Preferences, high-priority diet choices, vegetarian, Kashmir Kahwa specifications, etc."
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#002366] font-sans" 
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end mt-4">
                        <button 
                          onClick={() => setEditingCustomer(null)}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-pointer font-sans"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => updateCustomer(editingCustomer)}
                          className="px-4 py-1.5 bg-[#002366] text-[#F4C430] rounded-lg text-xs font-bold border border-[#F4C430] hover:bg-[#002366]/90 cursor-pointer tracking-wider uppercase font-sans"
                        >
                          Save Secure Profile
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Customer Search & Filters */}
                  <div className="flex items-center gap-2.5 bg-white rounded-xl border border-slate-200 px-3.5 py-2 w-full max-w-md">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input 
                      type="text"
                      value={customerSearchQuery}
                      onChange={(e) => setCustomerSearchQuery(e.target.value)}
                      placeholder={language === 'HI' ? 'ग्राहकों को नाम, फ़ोन या ईमेल द्वारा खोजें...' : 'Search customers by name, phone, email...'}
                      className="bg-transparent border-none text-xs text-slate-800 outline-none w-full font-sans"
                    />
                    {customerSearchQuery && (
                      <button onClick={() => setCustomerSearchQuery('')} className="text-slate-400 hover:text-slate-650 shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Customer Table */}
                  <div className="overflow-x-auto rounded-xl bg-white border border-slate-200/80">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#002366]/4 text-slate-600 font-mono border-b border-slate-200">
                          <th className="p-4 uppercase tracking-wider font-bold">Customer ID</th>
                          <th className="p-4 uppercase tracking-wider font-bold">Client Contact Details</th>
                          <th className="p-4 uppercase tracking-wider font-bold">Security (PAN)</th>
                          <th className="p-4 uppercase tracking-wider font-bold">Bookings & Value</th>
                          <th className="p-4 uppercase tracking-wider font-bold">Private Notes / Preferences</th>
                          <th className="p-4 uppercase tracking-wider font-bold text-right font-mono">Controls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono text-slate-755">
                        {customers.filter(c => 
                          c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
                          c.email.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
                          c.phone.includes(customerSearchQuery)
                        ).length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-450 italic font-sans text-xs">
                              {language === 'HI' ? 'कोई ग्राहक मिलान नहीं मिला या निर्देशिका खाली है।' : 'No customer matches found or directory is currently empty.'}
                            </td>
                          </tr>
                        ) : (
                          customers.filter(c => 
                            c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
                            c.email.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
                            c.phone.includes(customerSearchQuery)
                          ).map((cust) => (
                            <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 font-bold text-[#002366]">{cust.id}</td>
                              <td className="p-4 font-sans">
                                <p className="font-bold text-slate-900 text-xs">{cust.name}</p>
                                <div className="text-[10px] text-slate-500 font-mono mt-1 space-y-0.5">
                                  <p>✉ {cust.email}</p>
                                  <p>📞 {cust.phone}</p>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-750 tracking-wider">
                                  {cust.panCard || 'N/A'}
                                </span>
                                <p className="text-[9px] text-slate-400 mt-1">Last Active: {new Date(cust.lastActive).toLocaleDateString()}</p>
                              </td>
                              <td className="p-4 font-sans">
                                <p className="text-xs font-mono font-bold text-slate-800">{cust.totalBookings} reservation{cust.totalBookings === 1 ? '' : 's'}</p>
                                <p className="text-xs font-bold text-emerald-700 font-sans mt-0.5">{formatPrice(cust.totalRevenue)} spent</p>
                              </td>
                              <td className="p-4 font-sans text-[11px] text-slate-600 max-w-xs leading-relaxed" title={cust.notes || ''}>
                                {cust.notes || <span className="text-slate-400 italic">No notes added.</span>}
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex gap-1.5 justify-end">
                                  <button
                                    onClick={() => setEditingCustomer(cust)}
                                    className="bg-blue-50 text-blue-700 hover:bg-[#002366] hover:text-[#F4C430] p-2.5 rounded-xl transition-colors cursor-pointer border border-blue-150"
                                    title="Edit safe preferences notes"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to securely purge the PII data of ${cust.name}? This operation is irreversible.`)) {
                                        deleteCustomer(cust.id);
                                      }
                                    }}
                                    className="bg-red-50 text-red-650 hover:bg-red-600 hover:text-white p-2.5 rounded-xl transition-colors cursor-pointer border border-red-150"
                                    title="Purge customer profile securely"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex gap-2 items-center text-[10px] text-slate-500 justify-end font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F4C430]" /> Certify Code: 256-bit Secure TLS Encryption Active
          </div>

        </section>

        {/* SECTION: NEWSLETTER & VIP MAIL SIGN UP */}
        <section id="mail-signup" className="relative scroll-mt-24">
          <div className="relative overflow-hidden rounded-3xl border border-[#F4C430]/40 bg-gradient-to-br from-[#002366] via-[#001c52] to-slate-900 text-white p-8 sm:p-12 shadow-2xl">
            {/* Ambient visual background glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F4C430]/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4C430]/10 border border-[#F4C430]/20 rounded-full text-xs font-mono text-[#F4C430] uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                {language === 'HI' ? 'अल्ट्रा-विशेष विशेषाधिकार' : 'Exclusive VIP Privileges'}
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white leading-tight">
                {language === 'HI' ? 'कश्मीरी डायरीज़ की सदस्यता लें' : 'Subscribe to Kashmiri Diaries'}
              </h2>
              
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                {language === 'HI' 
                  ? 'क्यूरेटेड मौसमी यात्रा कार्यक्रम, शुरुआती-बर्ड हाउसबोट सौदों और सीधे श्रीनगर होटल छूट अलर्ट के साथ कश्मीर के जादू का अनुभव करने वाले पहले व्यक्ति बनें।'
                  : 'Be the first to unlock curated seasonal itineraries, early-bird luxury houseboat openings, and direct Srinagar flight discount alerts delivered with warm saffron hospitality.'}
              </p>

              <form onSubmit={handleNewsletterSubscribe} className="max-w-xl mx-auto mt-6" id="newsletter-form">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      id="newsletter-email-input"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder={language === 'HI' ? 'अपना ईमेल पता यहाँ दर्ज करें...' : 'Enter your email address here...'}
                      className="block w-full pl-11 pr-4 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F4C430] focus:border-transparent transition-all font-sans text-sm"
                      required
                      disabled={newsletterSubmitting}
                    />
                  </div>
                  <button
                    type="submit"
                    id="newsletter-submit-btn"
                    disabled={newsletterSubmitting}
                    className="relative px-8 py-4 bg-[#F4C430] text-[#002366] hover:bg-white rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-w-[140px] shrink-0"
                  >
                    {newsletterSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        {language === 'HI' ? 'सदस्यता ली जा रही है...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {language === 'HI' ? 'सदस्यता लें' : 'Subscribe'}
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Decorative trust highlights */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-400 font-sans" id="newsletter-trust-badges">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span>{language === 'HI' ? 'कोई स्पैम नहीं। कभी भी रद्द करें' : 'Zero Spam. Opt out anytime.'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span>{language === 'HI' ? '₹1,500 की बुकिंग कूपन उपहार' : '₹1,500 Instant Welcome Credit'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span>{language === 'HI' ? '100% सुरक्षित डेटा' : 'Safe 256-bit Secure TLS'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER BRACE - Polished with trust badges and Srinagar offsets */}
      <footer className="relative z-10 bg-[#002366] text-white py-12 border-t-8 border-[#F4C430]" id="sheenora-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Column 1 info */}
            <div className="space-y-4">
              <span className="text-xl font-serif font-bold tracking-tight uppercase text-white">
                Sheenora <span className="text-[#F4C430]">Journeys</span>
              </span>
              <p className="text-xs text-slate-300 leading-normal font-serif italic">
                "Where centuries-old Kashmiri hospitality blends seamlessly with premium bespoke transport arrangements."
              </p>
              <div className="text-[10px] opacity-70 font-mono text-slate-400">
                <p>© 2026 Sheenora Journeys Ltd.</p>
                <p>All Saffron trademarks protected.</p>
              </div>
            </div>

            {/* Column 2 office coordinates */}
            <div className="md:col-span-2 space-y-2">
              <p className="text-[10px] uppercase font-bold text-[#F4C430] tracking-wider mb-2 font-mono">Head Office Address</p>
              <address className="text-xs text-slate-350 not-italic space-y-1 font-sans">
                <p className="font-semibold text-white">Sheenora Journeys Ltd.</p>
                <p>Singhpora, Baramulla</p>
                <p>Jammu & Kashmir - 193121</p>
              </address>
            </div>

            {/* Column 4 trust figures */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase font-bold text-[#F4C430] tracking-wider mb-2 font-mono">Verified trust stats</p>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-[#002366] text-[#002366] flex items-center justify-center text-xs font-bold font-mono" title="Approved by Govt.">G</div>
                  <div className="w-10 h-10 rounded-full bg-[#F4C430] border-2 border-[#002366] text-[#002366] flex items-center justify-center text-xs font-bold font-mono" title="TripAdvisor Excellence">TA</div>
                  <div className="w-10 h-10 rounded-full bg-[#001c52] border-2 border-[#002366] text-white flex items-center justify-center text-xs font-bold font-mono" title="5 Star Ratings">5★</div>
                </div>
                <div>
                  <p className="text-sm font-bold block font-sans">1200+ Happy Guests</p>
                  <p className="text-[10px] text-slate-400">Zero cancellation complaints</p>
                </div>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-700 pt-6 text-center text-[10px] text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span>Approved J&K Tour operator license: <strong>Reg-JK-2942/Tourism</strong></span>
            </div>
            <div className="flex gap-4">
              <a href="#discover-packages" className="hover:text-white">Tour Packages</a>
              <span>•</span>
              <a href="#trip-formulator" className="hover:text-white">Customizer</a>
              <span>•</span>
              <a href="#scenic-photo-album" className="hover:text-white font-semibold text-[#F4C430]">Scenic Photo Album</a>
              <span>•</span>
              <a href="#contact-desk" className="hover:text-white">Google Maps Desk</a>
            </div>
          </div>

        </div>
      </footer>

      {/* SECTION: ADMIN PASSWORD AUTHORIZATION DIALOG MODAL */}
      {showAdminPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full border-2 border-[#F4C430] p-6 text-slate-900 relative animate-fade-in">
            <button 
              onClick={() => setShowAdminPasswordModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-[#002366] bg-slate-100 rounded-full p-1.5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-amber-50 rounded-full mx-auto flex items-center justify-center border-2 border-[#F4C430] text-[#002366]">
                <Lock className="w-6 h-6 stroke-[2]" />
              </div>

              <div>
                <h4 className="text-xl font-bold font-serif text-[#002366]">
                  {language === 'HI' ? 'एडमिन सुरक्षा सत्यापन' : 'Admin Security Verification'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'HI' ? 'अतिरिक्त सीएमएस नियंत्रणों और लीड डेटा को अनलॉक करने के लिए क्रेडेंशियल प्रदान करें।' : 'Please provide the administration credentials to access dynamic CMS and client lead tools.'}
                </p>
              </div>

              <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-left pt-2">
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider mb-1.5">
                    {language === 'HI' ? 'प्रशासक सुरक्षा पासकोड' : 'ADMINISTRATOR SECURE PASSCODE'}
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      autoFocus
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#002366] focus:border-transparent transition-all pr-10 text-slate-900 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-[11px] text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {passwordError}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdminPasswordModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-705 py-3 rounded-xl text-xs font-bold font-sans uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {language === 'HI' ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#002366] text-[#F4C430] hover:bg-[#F4C430] hover:text-[#002366] hover:border-[#002366] py-3 rounded-xl text-xs font-bold font-sans uppercase tracking-wider border border-[#F4C430] shadow-md transition-all cursor-pointer"
                  >
                    {language === 'HI' ? 'सत्यापित करें' : 'Verify'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: ADMIN EDIT TOUR PACKAGE DETAILS MODAL */}
      {editingPackage && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full border-2 border-[#002366] p-6 text-slate-900 relative animate-fade-in my-8 max-h-[90vh] overflow-y-auto">
            <button 
              type="button"
              onClick={() => setEditingPackage(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-red-500 bg-slate-100 rounded-full p-1.5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="p-2 bg-blue-50 text-[#002366] rounded-xl border border-blue-200">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-serif text-[#002366]">
                    {language === 'HI' ? 'यात्रा पैकेज विवरण संपादित करें' : 'Edit Tour Itinerary Details'}
                  </h4>
                  <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
                    ID: {editingPackage.id}
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpdatePackageSubmit} className="space-y-4 text-left">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      {language === 'HI' ? 'यात्रा पैकेज का नाम' : 'Package Title *'}
                    </label>
                    <input 
                      type="text" 
                      required
                      value={editingPackage.title}
                      onChange={(e) => setEditingPackage({ ...editingPackage, title: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#002366] text-slate-900 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                        {language === 'HI' ? 'कीमत (INR)' : 'Price (INR) *'}
                      </label>
                      <input 
                        type="number" 
                        required
                        value={editingPackage.price}
                        onChange={(e) => setEditingPackage({ ...editingPackage, price: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                        {language === 'HI' ? 'मूल कीमत (INR)' : 'Original Price (INR) *'}
                      </label>
                      <input 
                        type="number" 
                        required
                        value={editingPackage.originalPrice}
                        onChange={(e) => setEditingPackage({ ...editingPackage, originalPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                        {language === 'HI' ? 'अवधि' : 'Duration *'}
                      </label>
                      <input 
                        type="text" 
                        required
                        value={editingPackage.duration}
                        onChange={(e) => setEditingPackage({ ...editingPackage, duration: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                        {language === 'HI' ? 'श्रेणी' : 'Category Tag *'}
                      </label>
                      <select 
                        value={editingPackage.category}
                        onChange={(e) => setEditingPackage({ ...editingPackage, category: e.target.value as any })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                      >
                        <option value="Luxury">Luxury</option>
                        <option value="Honeymoon">Honeymoon</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Offbeat">Offbeat</option>
                        <option value="Pilgrimage">Pilgrimage</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      {language === 'HI' ? 'पैकेज छवि URL' : 'Package Picture URL *'}
                    </label>
                    <input 
                      type="url" 
                      required
                      value={editingPackage.image}
                      onChange={(e) => setEditingPackage({ ...editingPackage, image: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white font-mono"
                    />
                    {editingPackage.image && (
                      <div className="mt-2 text-center">
                        <span className="text-[9px] text-slate-400 block mb-1 font-semibold uppercase font-mono">Image Preview</span>
                        <img 
                          src={editingPackage.image} 
                          alt="Package edit preview" 
                          referrerPolicy="no-referrer"
                          className="w-full h-32 object-cover rounded-xl border border-slate-205 mx-auto"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      {language === 'HI' ? 'एसईओ विवरण' : 'SEO Meta Description *'}
                    </label>
                    <textarea 
                      rows={2}
                      required
                      value={editingPackage.seoDescription}
                      onChange={(e) => setEditingPackage({ ...editingPackage, seoDescription: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#002366] text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingPackage(null)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold font-sans uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {language === 'HI' ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#002366] text-[#F4C430] hover:bg-[#F4C430] hover:text-[#002366] py-3 rounded-xl text-xs font-bold font-sans uppercase tracking-wider border border-[#F4C430] shadow-md transition-all cursor-pointer"
                  >
                    {language === 'HI' ? 'सहजें' : 'Save Itinerary'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: ADMIN EDIT BOOKING LEAD DETAILS MODAL */}
      {editingBooking && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full border-2 border-[#002366] p-6 text-slate-900 relative animate-fade-in my-8 max-h-[90vh] overflow-y-auto">
            <button 
              type="button"
              onClick={() => setEditingBooking(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-red-500 bg-slate-100 rounded-full p-1.5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="p-2 bg-blue-50 text-[#002366] rounded-xl border border-blue-200">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-serif text-[#002366]">
                    {language === 'HI' ? 'यात्री लीड विवरण संपादित करें' : 'Edit Traveler Lead & Booking'}
                  </h4>
                  <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
                    ID: {editingBooking.id}
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpdateBookingSubmit} className="space-y-4 text-left">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                        {language === 'HI' ? 'अतिथि का नाम' : 'Client Name *'}
                      </label>
                      <input 
                        type="text" 
                        required
                        value={editingBooking.customerName}
                        onChange={(e) => setEditingBooking({ ...editingBooking, customerName: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#002366] text-slate-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                        {language === 'HI' ? 'पैन कार्ड कोड' : 'PAN ID Code'}
                      </label>
                      <input 
                        type="text" 
                        value={editingBooking.panCard || ''}
                        onChange={(e) => setEditingBooking({ ...editingBooking, panCard: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white font-mono uppercase"
                        placeholder="ABCDE1234F"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                        {language === 'HI' ? 'ईमेल' : 'Email Coordinates *'}
                      </label>
                      <input 
                        type="email" 
                        required
                        value={editingBooking.customerEmail}
                        onChange={(e) => setEditingBooking({ ...editingBooking, customerEmail: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                        {language === 'HI' ? 'मोबाइल नंबर' : 'Phone Connection *'}
                      </label>
                      <input 
                        type="tel" 
                        required
                        value={editingBooking.customerPhone}
                        onChange={(e) => setEditingBooking({ ...editingBooking, customerPhone: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                        {language === 'HI' ? 'यात्रा की तारीख' : 'Travel Date *'}
                      </label>
                      <input 
                        type="date" 
                        required
                        value={editingBooking.travelDate}
                        onChange={(e) => setEditingBooking({ ...editingBooking, travelDate: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                        {language === 'HI' ? 'अतिथियों की संख्या' : 'Guests Count *'}
                      </label>
                      <input 
                        type="number" 
                        required
                        min={1}
                        value={editingBooking.guestsCount}
                        onChange={(e) => setEditingBooking({ ...editingBooking, guestsCount: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                        {language === 'HI' ? 'कुल एस्क्रो मूल्य (INR)' : 'Total Price paid (INR)'}
                      </label>
                      <input 
                        type="number" 
                        required
                        value={editingBooking.totalPrice}
                        onChange={(e) => setEditingBooking({ ...editingBooking, totalPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                        {language === 'HI' ? 'भुगतान स्थिति' : 'Payment Status *'}
                      </label>
                      <select 
                        value={editingBooking.paymentStatus}
                        onChange={(e) => setEditingBooking({ ...editingBooking, paymentStatus: e.target.value as any })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      {language === 'HI' ? 'कस्टम आवश्यकताएं' : 'Custom Itinerary Notes'}
                    </label>
                    <textarea 
                      rows={2}
                      value={editingBooking.customRequirements || ''}
                      onChange={(e) => setEditingBooking({ ...editingBooking, customRequirements: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#002366] text-slate-900 bg-white"
                      placeholder="Special cab support, extra local Wazwan diet, etc..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingBooking(null)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold font-sans uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {language === 'HI' ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#002366] text-[#F4C430] hover:bg-[#F4C430] hover:text-[#002366] py-3 rounded-xl text-xs font-bold font-sans uppercase tracking-wider border border-[#F4C430] shadow-md transition-all cursor-pointer"
                  >
                    {language === 'HI' ? 'सहेजें' : 'Save Traveller File'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-ONLY SECTION OVERLAY & STYLES */}
      {(() => {
        const pDetails = activeBookingResult ? {
          id: activeBookingResult.id,
          customerName: activeBookingResult.customerName,
          customerEmail: activeBookingResult.customerEmail,
          customerPhone: activeBookingResult.customerPhone,
          panCard: activeBookingResult.panCard || '',
          travelDate: activeBookingResult.travelDate,
          guestsCount: activeBookingResult.guestsCount,
          packageName: activeBookingResult.packageName || 'Kashmir Scenic Premium Escape',
          totalPrice: activeBookingResult.totalPrice,
          customRequirements: activeBookingResult.customRequirements || 'Pre-arranged premium scenic trails, high-altitude heating logistics, and comfortable deluxe SUV charters.',
          leadStatus: activeBookingResult.leadStatus
        } : formSubmittedDetails ? {
          id: formSubmittedDetails.id,
          customerName: formSubmittedDetails.customerName,
          customerEmail: formSubmittedDetails.customerEmail,
          customerPhone: formSubmittedDetails.customerPhone,
          panCard: formSubmittedDetails.panCard || '',
          travelDate: formSubmittedDetails.travelDate,
          guestsCount: formSubmittedDetails.guestsCount || 2,
          packageName: 'Tailored Kashmiri Itinerary Custom Package',
          totalPrice: formSubmittedDetails.totalPrice || formSubmittedDetails.estimatedBudget || 35000,
          customRequirements: formSubmittedDetails.customRequirements || 'Complete customized Kashmir itinerary with certified local chauffeurs and premier heritage wooden houseboat stays.',
          leadStatus: formSubmittedDetails.leadStatus
        } : null;

        if (!pDetails) return null;

        return (
          <>
            {/* Inline stylesheet that restricts page print layout to ONLY this section when printing is active */}
            <style dangerouslySetInnerHTML={{ __html: `
              @media print {
                /* Complete reset of UI for physical paper */
                html, body {
                  background: #ffffff !important;
                  color: #0f172a !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  font-family: ui-sans-serif, system-ui, sans-serif !important;
                }
                /* Hide everything */
                #root, body > div:not(.voucher-print-only), header, footer, nav, aside, section, main, button, .modal, .no-print, [role="dialog"], .fixed {
                  display: none !important;
                  height: 0 !important;
                  overflow: hidden !important;
                  visibility: hidden !important;
                }
                /* Expose ONLY print container */
                .voucher-print-only {
                  display: block !important;
                  visibility: visible !important;
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 40px !important;
                  border: none !important;
                  box-shadow: none !important;
                  background: #ffffff !important;
                }
                /* Print specific page breaks and spacing */
                @page {
                  size: A4 portrait;
                  margin: 1.5cm;
                }
              }
            `}} />

            <div className="hidden print:block voucher-print-only bg-white text-slate-900 p-10 max-w-4xl mx-auto border-2 border-[#002366] rounded-2xl space-y-8 font-sans">
              
              {/* BRAND HEADER */}
              <div className="flex justify-between items-center border-b-2 border-[#002366]/20 pb-6">
                <div>
                  <h1 className="text-3xl font-serif font-bold text-[#002366] tracking-tight">SHEENORA JOURNEYS</h1>
                  <p className="text-xs text-amber-600 font-mono font-bold uppercase tracking-widest mt-0.5">Jammu & Kashmir Premium Travel Escrow</p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Regd No: JK-TOUR-2026-88F9 | Local Kashmiri Host Network | Support: +91 7006770665
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-[#002366] text-white px-5 py-3 rounded-xl text-center inline-block">
                    <p className="text-[8px] uppercase tracking-wider font-mono text-[#F4C430] font-bold">Voucher Type</p>
                    <p className="text-sm font-bold font-mono">
                      {activeBookingResult ? "DEPOSIT RECEIPT" : "TRIP INQUIRY"}
                    </p>
                  </div>
                </div>
              </div>

              {/* TICKET DETAILS MATRIX */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Reference Code</span>
                  <span className="text-xs font-mono font-bold text-[#002366] break-all">{pDetails.id}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Issue Date</span>
                  <span className="text-xs font-mono font-bold text-[#002366]">{new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">CRM Synced Status</span>
                  <span className="text-xs font-mono font-bold text-green-700">✓ {pDetails.leadStatus}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Wazwan Welcome</span>
                  <span className="text-xs font-mono font-bold text-amber-600 font-sans">INCLUDED IN REGISTRATION</span>
                </div>
              </div>

              {/* PRIMARY PASSENGER BLOCK */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold tracking-widest text-[#002366] border-b pb-1 font-mono">1. Primary Passenger Information</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 text-xs">
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Passenger Name</span>
                    <strong className="text-slate-800 font-sans text-sm">{pDetails.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Email Address</span>
                    <strong className="text-slate-800 font-sans">{pDetails.customerEmail}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Contact Phone</span>
                    <strong className="text-slate-800 font-mono">{pDetails.customerPhone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px] uppercase">PAN Identification Number</span>
                    <strong className="text-slate-800 font-mono text-[11px]">{pDetails.panCard || 'REG-PENDING'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Expected Date of Arrival</span>
                    <strong className="text-slate-800 font-mono text-[11px]">{pDetails.travelDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Registered Travelers Limit</span>
                    <strong className="text-slate-800 font-sans">{pDetails.guestsCount} Pax</strong>
                  </div>
                </div>
              </div>

              {/* PACKAGE DETAILS BLOCK */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold tracking-widest text-[#002366] border-b pb-1 font-mono">2. Kashmir Tour Route Details</h3>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <h4 className="text-base font-bold text-[#002366] font-serif">{pDetails.packageName}</h4>
                      <p className="text-xs text-slate-600 mt-2 max-w-2xl leading-relaxed whitespace-pre-line">
                        {pDetails.customRequirements}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 block font-mono uppercase">Estimated Voucher Fare</span>
                      <span className="text-xl font-serif font-bold text-amber-600 block mt-1">{formatPrice(pDetails.totalPrice)}</span>
                      <span className="text-[9px] text-slate-400 block italic font-mono mt-0.5">Local tax exemptions computed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ESSENTIAL ADVISORIES */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold tracking-widest text-[#002366] border-b pb-1 font-mono">3. Essential Regional Advisories for Jammu & Kashmir</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] text-slate-600 leading-relaxed">
                  <div className="bg-amber-50/70 p-4 rounded-lg border border-amber-200 space-y-1.5">
                    <span className="font-bold text-amber-800 font-mono uppercase text-[10.5px]">🛜 Cellular Connectivity Regulation:</span>
                    <p>
                      Pre-paid mobile phone SIM cards issued outside Jammu & Kashmir do not work in the territory due to federal telecommunication rules. 
                      You must ensure you are carrying a post-paid cellular connection (Airtel, Jio, or BSNL Postpaid) to remain connected.
                    </p>
                  </div>
                  <div className="bg-blue-50/70 p-4 rounded-lg border border-blue-200 space-y-1.5">
                    <span className="font-bold text-[#002366] font-mono uppercase text-[10.5px]">🏔️ Temperature & Altitude Guidelines:</span>
                    <p>
                      Gulmarg peaks and Sonamarg mountain passes exceed 8,000 feet and require heavy thermal woolens all seasons. 
                      Complimentary saffron-infused Kahwa tea will be served at the lounge during check-in.
                    </p>
                  </div>
                </div>
              </div>

              {/* AUTHORIZATION FOOTER */}
              <div className="pt-8 border-t-2 border-dashed border-slate-200 flex justify-between items-center text-xs text-slate-900">
                <div className="text-center w-40">
                  <div className="h-10 flex items-center justify-center italic text-[#002366] font-serif font-semibold text-sm">M. Aaqib Mir</div>
                  <div className="border-t border-slate-300 pt-1 text-[9px] uppercase font-bold text-slate-500 font-mono">Liaison Officer, Sheenora</div>
                </div>
                <div className="text-center bg-slate-50 px-4 py-2 border rounded-lg font-mono text-[9px] text-[#002366]">
                  <div className="font-bold uppercase text-[9px] mb-0.5">Secure Escrow Protection</div>
                  <div>VALIDATED SECURE CODES</div>
                  <div className="text-[8px] text-slate-400 mt-0.5">
                    VERIFIED ENCRYPTED VOUCHER
                  </div>
                </div>
                <div className="text-center w-40 font-slate-900">
                  <div className="h-10"></div>
                  <div className="border-t border-slate-300 pt-1 text-[9px] uppercase font-bold text-slate-500 font-mono">Passenger Signature</div>
                </div>
              </div>

            </div>
          </>
        );
      })()}

      {/* WHATSAPP FLOATING HELP DESK - Preconfigured widget with active ping */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
        <a 
          target="_blank"
          rel="noreferrer"
          href="https://wa.me/917006770665?text=Hello%20Sheenora%20Journeys!%20I%20am%2520viewing%20your%20Jammu%20%26%20Kashmir%20Tourism%20website.%20Please%20suggest%20a%206-day%20Luxury%20Valley%20retreat."
          className="group flex flex-col items-end gap-2"
        >
          <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-[#F4C430]/40 text-[#002366] text-[10.5px] font-bold uppercase transition-all scale-0 group-hover:scale-100 origin-bottom-right">
            Chat with local Kashmir Experts
          </div>

          <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl relative cursor-pointer hover:scale-110 active:scale-100 transition-all border-2 border-white hover:bg-green-600">
            {/* Live active green radar point */}
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border border-white animate-pulse"></span>
            
            <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
              <path d="M19.005 3.175C17.252 1.22 14.757 0 12.003 0 5.378 0 .012 5.366.012 11.99c0 2.116.551 4.18 1.597 6.0l-1.697 6.2 6.35-1.664c1.76.96 3.737 1.464 5.735 1.464 6.621 0 11.987-5.367 11.987-11.99 0-3.21-1.25-6.23-3.033-8.35c.123 0-.044-.225.048-.075zm-3.41 12.28c-.14.39-.71.71-1.12.76-.36.04-.84.07-1.55-.16-.97-.31-1.89-.97-2.57-1.63-.68-.67-1.3-1.61-1.57-2.6-.19-.71-.13-1.18.08-1.42.19-.21.41-.34.55-.48.14-.14.18-.23.28-.42.1-.19.05-.35-.02-.49-.07-.15-.24-.57-.38-.91-.12-.27-.25-.3-.38-.3-.12 0-.25-.01-.39-.01-.37 0-.98.14-1.39.59-.41.44-1.57 1.53-1.57 3.74 0 2.2 1.6 4.33 1.83 4.64.22.3 3.16 4.83 7.66 6.77 1.07.46 1.9.73 2.55.94 1.08.34 2.05.29 2.83.18.86-.13 2.65-.12 3.02-.12.37 0 .74-.12.98-.19.24-.06.4-.1.4-.1.08-.03.11.02.1.08l-.13.3c.01-.01-.01 0 0 0z" />
            </svg>
          </div>
        </a>
      </div>

      {/* SECTION: ADMIN ADD PHOTO MODAL */}
      {showAddGalleryModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full border-2 border-[#002366] p-6 text-slate-900 relative animate-fade-in my-8 max-h-[90vh] overflow-y-auto">
            <button 
              type="button"
              onClick={() => setShowAddGalleryModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-red-500 bg-slate-100 rounded-full p-1.5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="p-2 bg-[#002366]/5 text-[#002366] rounded-xl border border-[#002366]/10">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-serif text-[#002366] text-left">
                    {language === 'HI' ? 'नया गैलरी चित्र जोड़ें' : 'Add New Photograph to Gallery'}
                  </h4>
                  <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 text-left">
                    SaaS Destination Management Module
                  </p>
                </div>
              </div>

              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const tagsArr = newGalleryTagsInput.split(',').map(t => t.trim()).filter(Boolean);
                  const success = await handleCreateGalleryItem({
                    ...newGalleryItem,
                    tags: tagsArr
                  });
                  if (success) {
                    setShowAddGalleryModal(false);
                  }
                }} 
                className="space-y-4 text-left"
              >
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      {language === 'HI' ? 'तस्वीर का शीर्षक' : 'Photo Title *'}
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Majestic Sunset over Shalimar Bagh"
                      value={newGalleryItem.title}
                      onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#002366]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      {language === 'HI' ? 'चित्र यूआरएल' : 'Unsplash / Image URL *'}
                    </label>
                    <input 
                      type="url" 
                      required
                      placeholder="e.g. https://images.unsplash.com/photo-..."
                      value={newGalleryItem.url}
                      onChange={(e) => setNewGalleryItem({ ...newGalleryItem, url: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#002366] font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                        {language === 'HI' ? 'सटीक स्थान' : 'Exact Location'}
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Shalimar Bagh, Srinagar"
                        value={newGalleryItem.location}
                        onChange={(e) => setNewGalleryItem({ ...newGalleryItem, location: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#002366]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                        {language === 'HI' ? 'ऊंचाई' : 'Altitude (Elevation)'}
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. 1,620 meters"
                        value={newGalleryItem.altitude}
                        onChange={(e) => setNewGalleryItem({ ...newGalleryItem, altitude: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#002366]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      {language === 'HI' ? 'टैग (अल्पविराम से अलग करें)' : 'Spill Spot Tags (Comma Separated) *'}
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Srinagar, Garden, Culture, Nature"
                      value={newGalleryTagsInput}
                      onChange={(e) => setNewGalleryTagsInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#002366]"
                    />
                    <p className="text-[9px] text-slate-400 mt-1">Suggested key spot categories: Srinagar, Gulmarg, Pahalgam, Nature, Culture, Offbeat.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      {language === 'HI' ? 'ऐतिहासिक और सांस्कृतिक विवरण' : 'Heritage Lore & Cultural Story'}
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Write a charming paragraph describing this location's history, sights, flora, or sensory experiences..."
                      value={newGalleryItem.lore}
                      onChange={(e) => setNewGalleryItem({ ...newGalleryItem, lore: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#002366] resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setShowAddGalleryModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-[#002366] hover:bg-[#002366]/90 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Publish Photograph
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: ADMIN EDIT PHOTO MODAL */}
      {editingGalleryItem && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full border-2 border-[#002366] p-6 text-slate-900 relative animate-fade-in my-8 max-h-[90vh] overflow-y-auto">
            <button 
              type="button"
              onClick={() => setEditingGalleryItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-red-500 bg-slate-100 rounded-full p-1.5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="p-2 bg-[#002366]/5 text-[#002366] rounded-xl border border-[#002366]/10">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-serif text-[#002366] text-left">
                    {language === 'HI' ? 'चित्र विवरण संपादित करें' : 'Edit Photograph Metadata'}
                  </h4>
                  <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 text-left">
                    ID Reference: {editingGalleryItem.id}
                  </p>
                </div>
              </div>

              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const success = await handleUpdateGalleryItem(editingGalleryItem.id, editingGalleryItem);
                  if (success) {
                    setEditingGalleryItem(null);
                  }
                }} 
                className="space-y-4 text-left"
              >
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      {language === 'HI' ? 'शीर्षक' : 'Photo Title'}
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Scenic Chinar Canopy"
                      value={editingGalleryItem.title}
                      onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#002366]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      {language === 'HI' ? 'चित्र यूआरएल' : 'Unsplash / Image URL'}
                    </label>
                    <input 
                      type="url" 
                      required
                      placeholder="e.g. https://images.unsplash.com/photo-..."
                      value={editingGalleryItem.url}
                      onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, url: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#002366] font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                        {language === 'HI' ? 'स्थान' : 'Location'}
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Dal Lake, Srinagar"
                        value={editingGalleryItem.location}
                        onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, location: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#002366]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                        {language === 'HI' ? 'ऊंचाई' : 'Altitude'}
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. 1,585 meters"
                        value={editingGalleryItem.altitude}
                        onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, altitude: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#002366]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      {language === 'HI' ? 'टैग (अल्पविराम से संयोजित)' : 'Tags (Comma Separated)'}
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Srinagar, Houseboat, Waterways"
                      value={Array.isArray(editingGalleryItem.tags) ? editingGalleryItem.tags.join(', ') : editingGalleryItem.tags}
                      onChange={(e) => setEditingGalleryItem({ 
                        ...editingGalleryItem, 
                        tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) 
                      })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#002366]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      {language === 'HI' ? 'ऐतिहासिक और सांस्कृतिक विवरण' : 'Heritage Lore & Insights'}
                    </label>
                    <textarea 
                      rows={4}
                      placeholder="Description of the location..."
                      value={editingGalleryItem.lore || ''}
                      onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, lore: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#002366] resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setEditingGalleryItem(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-[#002366] hover:bg-[#002366]/90 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Metadata Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
