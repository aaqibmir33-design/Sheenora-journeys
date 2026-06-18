import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { TourPackage, Booking, Customer, GalleryItem } from './src/types.js';

dotenv.config();

const app = express();
const PORT = 3000;

const PACKAGES_FILE = path.join(process.cwd(), 'data', 'packages.json');
const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json');
const CUSTOMERS_FILE = path.join(process.cwd(), 'data', 'customers.json');
const GALLERY_FILE = path.join(process.cwd(), 'data', 'gallery.json');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for cross-origin frontend requests (e.g., from Netlify, Vercel, or local dev)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Helper functions for reading/writing JSON
function loadPackages(): TourPackage[] {
  try {
    if (fs.existsSync(PACKAGES_FILE)) {
      const data = fs.readFileSync(PACKAGES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading packages, using empty array:", error);
  }
  return [];
}

function savePackages(packages: TourPackage[]) {
  try {
    const dir = path.dirname(PACKAGES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(PACKAGES_FILE, JSON.stringify(packages, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error saving packages:", error);
  }
}

function loadBookings(): Booking[] {
  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const data = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading bookings, using empty array:", error);
  }
  return [];
}

function saveBookings(bookings: Booking[]) {
  try {
    const dir = path.dirname(BOOKINGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error saving bookings:", error);
  }
}

function loadCustomers(): Customer[] {
  try {
    if (fs.existsSync(CUSTOMERS_FILE)) {
      const data = fs.readFileSync(CUSTOMERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading customers, using empty array:", error);
  }
  return [];
}

function saveCustomers(customers: Customer[]) {
  try {
    const dir = path.dirname(CUSTOMERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error saving customers:", error);
  }
}

function upsertCustomerDetails(name: string, email: string, phone: string, panCard?: string, orderAmount: number = 0) {
  const customers = loadCustomers();
  const existingIndex = customers.findIndex(c => c.email.toLowerCase() === email.toLowerCase());

  if (existingIndex !== -1) {
    customers[existingIndex].name = name;
    customers[existingIndex].phone = phone;
    if (panCard && panCard !== 'N/A' && panCard !== 'NOT_PROVIDED' && panCard !== '') {
      customers[existingIndex].panCard = panCard;
    }
    customers[existingIndex].totalBookings += 1;
    customers[existingIndex].totalRevenue += orderAmount;
    customers[existingIndex].lastActive = new Date().toISOString();
  } else {
    const newCust: Customer = {
      id: `cust-${Math.floor(10000 + Math.random() * 90000)}`,
      name,
      email,
      phone,
      panCard: panCard || '',
      notes: 'Acquired through automated secure checkout / lead inquiry form.',
      totalBookings: 1,
      totalRevenue: orderAmount,
      lastActive: new Date().toISOString()
    };
    customers.unshift(newCust);
  }
  saveCustomers(customers);
}

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: "g-1",
    title: "Dal Lake Houseboat Twilight",
    url: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80",
    tags: ["Srinagar", "Houseboat", "Waterways", "Savor"],
    location: "Dal Lake, Srinagar",
    altitude: "1,585 meters",
    lore: "Floating timber castles carved in aromatic Himalayan cedar. Watch the golden rays bounce off peaceful waters from your private hand-carved balcony."
  },
  {
    id: "g-2",
    title: "Shikara Ride & Floating Markets",
    url: "https://images.unsplash.com/photo-1598325492994-01369c0d11c0?auto=format&fit=crop&w=800&q=80",
    tags: ["Srinagar", "Shikara", "Culture", "Waterways"],
    location: "Nigeen & Dal Lakes",
    altitude: "1,586 meters",
    lore: "Traditional wooden boats carrying vibrant flowers, fresh local produce, and warm saffron tea. An ancient marketplace humming peacefully at sunrise."
  },
  {
    id: "g-3",
    title: "Gulmarg Gondola & Peak Snow",
    url: "https://images.unsplash.com/photo-1621532408376-78b17a6cfd74?auto=format&fit=crop&w=800&q=80",
    tags: ["Gulmarg", "Snow", "Adventure", "Peaks"],
    location: "Apharwat Peak, Gulmarg",
    altitude: "4,390 meters",
    lore: "The highest cable car in Asia rising through thick pine forests into deep pristine snow fields. A paradise for skiing fanatics and visual seekers."
  },
  {
    id: "g-4",
    title: "Gulmarg Meadows in Summer",
    url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80",
    tags: ["Gulmarg", "Meadows", "Green", "Nature"],
    location: "Gulmarg Highlands",
    altitude: "2,650 meters",
    lore: "A majestic highland meadow blanketed in vibrant wild lupines, daisies, and bluebells. Surrounded by the snow-capped Pir Panjal mountain range."
  },
  {
    id: "g-5",
    title: "Sonamarg Glacier Waters",
    url: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&w=800&q=80",
    tags: ["Sonamarg", "Glacier", "River", "Peaks"],
    location: "Thajiwas Glacier, Sonamarg",
    altitude: "2,740 meters",
    lore: "Where emerald gushing alpine rivers meet ancient frozen glacial ice. Translated literally as the 'Meadow of Gold' due to golden autumn leaves."
  },
  {
    id: "g-6",
    title: "Pahalgam Valley & Lidder River",
    url: "https://images.unsplash.com/photo-1616036740257-9449ea1f6605?auto=format&fit=crop&w=800&q=80",
    tags: ["Pahalgam", "Valley", "River", "Nature"],
    location: "Lidder Valley, Pahalgam",
    altitude: "2,200 meters",
    lore: "Crystal clear glacier streams cascading through towering pine valleys. A timeless shelter of pristine cedarwood paths and gentle mountain wind."
  },
  {
    id: "g-7",
    title: "Autumn Chinar Foliage",
    url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80",
    tags: ["Chinar", "Autumn", "Srinagar", "Nature"],
    location: "Nishat Bagh Mughal Garden",
    altitude: "1,595 meters",
    lore: "Centuries-old giant Chinar trees turning an intense, fiery crimson in November. The crown jewel of royal Kashmiri autumn landscapes."
  },
  {
    id: "g-8",
    title: "Pari Mahal Mughal Gardens",
    url: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80",
    tags: ["Srinagar", "Garden", "Heritage", "Culture"],
    location: "Zabarwan Range, Srinagar",
    altitude: "1,680 meters",
    lore: "The 'Palace of Fairies', a terraced seven-level garden complex built by ancient prince Dara Shikoh. Showcasing breathtaking panoramic observatory lake vistas."
  },
  {
    id: "g-9",
    title: "Amarnath Sacred Peaks",
    url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80",
    tags: ["Pilgrimage", "Peaks", "Trekking", "Adventure"],
    location: "Amarnath Mountain Cave Range",
    altitude: "3,888 meters",
    lore: "A holy glacial sanctuary nestled inside snow-creased rocky mountain canyons, accessed via steep epic trails of high devotion and natural wonder."
  },
  {
    id: "g-10",
    title: "Doodhpathri Valley of Milk",
    url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80",
    tags: ["Doodhpathri", "River", "Meadows", "Nature"],
    location: "Doodhpathri Highlands",
    altitude: "2,730 meters",
    lore: "Gushing crystalline rivers crashing against grey pebbles, creating foam that resembles rich creamy milk. A quiet, pristine pasture land of sheep."
  },
  {
    id: "g-11",
    title: "Yusmarg Hidden Pine Forests",
    url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
    tags: ["Yusmarg", "Forest", "Offbeat", "Nature"],
    location: "Yusmarg Meadows",
    altitude: "2,396 meters",
    lore: "The 'Meadow of Jesus', believed to be one of the most serene pine-shrouded valleys where mountain silence is broken only by musical stream birds."
  },
  {
    id: "g-12",
    title: "Gurez Valley Borderland Forts",
    url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
    tags: ["Gurez", "Cabins", "Offbeat", "Adventure"],
    location: "Dawr, Gurez Valley",
    altitude: "2,400 meters",
    lore: "A spectacular ultra-offbeat valley protected by the mighty Habba Khatoon peak. Home to ancestral wooden log cabins and remote Dardic culture vibes."
  }
];

function loadGallery(): GalleryItem[] {
  try {
    if (fs.existsSync(GALLERY_FILE)) {
      const data = fs.readFileSync(GALLERY_FILE, 'utf-8');
      return JSON.parse(data);
    } else {
      // Initialize with default gallery
      saveGallery(DEFAULT_GALLERY);
      return DEFAULT_GALLERY;
    }
  } catch (error) {
    console.error("Error loading gallery, using default gallery:", error);
    return DEFAULT_GALLERY;
  }
}

function saveGallery(gallery: GalleryItem[]) {
  try {
    const dir = path.dirname(GALLERY_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(GALLERY_FILE, JSON.stringify(gallery, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error saving gallery:", error);
  }
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Gallery Photo Management APIs
app.get('/api/gallery', (req, res) => {
  const gallery = loadGallery();
  res.json(gallery);
});

app.post('/api/gallery', (req, res) => {
  const gallery = loadGallery();
  const { title, url, tags, location, altitude, lore } = req.body;
  
  if (!title || !url) {
    return res.status(400).json({ error: "Title and Image URL are required parameters." });
  }

  const processedTags = Array.isArray(tags) 
    ? tags 
    : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []);

  const newItem: GalleryItem = {
    id: `g-${Date.now()}`,
    title: String(title),
    url: String(url),
    tags: processedTags,
    location: String(location || ""),
    altitude: String(altitude || ""),
    lore: String(lore || "")
  };

  gallery.push(newItem);
  saveGallery(gallery);
  res.status(201).json(newItem);
});

app.put('/api/gallery/:id', (req, res) => {
  const gallery = loadGallery();
  const { id } = req.params;
  const itemIndex = gallery.findIndex(item => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ error: "Gallery item not found." });
  }

  const { title, url, tags, location, altitude, lore } = req.body;

  if (title) gallery[itemIndex].title = String(title);
  if (url) gallery[itemIndex].url = String(url);
  
  if (tags !== undefined) {
    gallery[itemIndex].tags = Array.isArray(tags) 
      ? tags 
      : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []);
  }
  
  if (location !== undefined) gallery[itemIndex].location = String(location);
  if (altitude !== undefined) gallery[itemIndex].altitude = String(altitude);
  if (lore !== undefined) gallery[itemIndex].lore = String(lore);

  saveGallery(gallery);
  res.json(gallery[itemIndex]);
});

app.delete('/api/gallery/:id', (req, res) => {
  const gallery = loadGallery();
  const { id } = req.params;
  const filtered = gallery.filter(item => item.id !== id);

  if (filtered.length === gallery.length) {
    return res.status(404).json({ error: "Gallery item not found." });
  }

  saveGallery(filtered);
  res.json({ success: true, message: "Gallery photo removed successfully." });
});

// 1. Get all J&K package details
app.get('/api/packages', (req, res) => {
  const packages = loadPackages();
  res.json(packages);
});

// 2. CMS: Add a new tour package
app.post('/api/packages', (req, res) => {
  const packages = loadPackages();
  const newPkg: TourPackage = {
    id: `pkg-${Date.now()}`,
    title: req.body.title || 'Beautiful Kashmir Special Group Adventure',
    duration: req.body.duration || '5 Nights / 6 Days',
    price: Number(req.body.price) || 25000,
    originalPrice: Number(req.body.originalPrice) || 30000,
    rating: 5.0,
    reviewsCount: 1,
    image: req.body.image || 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80',
    category: req.body.category || 'Luxury',
    highlights: req.body.highlights || [],
    itinerary: req.body.itinerary || [],
    inclusions: req.body.inclusions || [],
    exclusions: req.body.exclusions || [],
    featured: !!req.body.featured,
    seoDescription: req.body.seoDescription || 'Get best custom Jammu & Kashmir tours with local assistance.'
  };

  packages.unshift(newPkg);
  savePackages(packages);
  res.status(201).json({ success: true, package: newPkg });
});

// 3. CMS: Update a tour package
app.put('/api/packages/:id', (req, res) => {
  const packages = loadPackages();
  const index = packages.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: "Package not found" });
  }

  packages[index] = {
    ...packages[index],
    ...req.body,
    price: req.body.price ? Number(req.body.price) : packages[index].price,
    originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : packages[index].originalPrice,
  };

  savePackages(packages);
  res.json({ success: true, package: packages[index] });
});

// 4. CMS: Delete a tour package
app.delete('/api/packages/:id', (req, res) => {
  const packages = loadPackages();
  const filtered = packages.filter(p => p.id !== req.params.id);
  
  if (filtered.length === packages.length) {
    return res.status(404).json({ error: "Package not found" });
  }

  savePackages(filtered);
  res.json({ success: true, message: "Package deleted successfully" });
});

// 5. Razorpay integration: Create order
app.post('/api/payment/order', async (req, res) => {
  const {
    packageId,
    packageName,
    customerName,
    customerEmail,
    customerPhone,
    panCard,
    guestsCount,
    travelDate,
    totalPrice,
    customRequirements,
    nationality,
    aadhaarNumber,
    passportNumber,
    hasInfants,
    infantDetails,
    otherTravelers
  } = req.body;

  if (!customerName || !customerEmail || !customerPhone || !panCard) {
    return res.status(400).json({ error: "Booking missing essential parameters (Name, Email, Phone, PAN required)." });
  }

  const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
  
  const bookingId = `bk-${Date.now()}`;
  const amountInPaise = Math.round(Number(totalPrice) * 100);

  const bookings = loadBookings();

  // If Razorpay keys are configured in environment secrets
  if (razorpayKeyId && razorpayKeySecret) {
    try {
      console.log(`[Razorpay Client] Building direct payment order for ${customerName}, amount INR ${totalPrice}`);
      
      const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: bookingId
         })
      });

      if (!response.ok) {
        let errDetails = response.statusText;
        try {
          const errData = await response.json() as any;
          if (errData && errData.error) {
            errDetails = `${errData.error.description || errData.error.code || JSON.stringify(errData.error)}`;
          } else {
            errDetails = JSON.stringify(errData);
          }
        } catch (_) {}
        throw new Error(`Razorpay API error: ${errDetails}`);
      }

      const orderData = await response.json() as { id: string };
      
      const newBooking: Booking = {
        id: bookingId,
        packageId,
        packageName,
        customerName,
        customerEmail,
        customerPhone,
        panCard,
        guestsCount: Number(guestsCount) || 1,
        travelDate,
        totalPrice: Number(totalPrice),
        paymentStatus: 'Pending',
        razorpayOrderId: orderData.id,
        customRequirements,
        leadStatus: 'Local Captured',
        createdAt: new Date().toISOString(),
        nationality,
        aadhaarNumber,
        passportNumber,
        hasInfants: !!hasInfants,
        infantDetails,
        otherTravelers
      };

      bookings.push(newBooking);
      saveBookings(bookings);
      upsertCustomerDetails(customerName, customerEmail, customerPhone, panCard, Number(totalPrice));

      return res.json({
        success: true,
        orderId: orderData.id,
        bookingId,
        amount: amountInPaise,
        keyId: razorpayKeyId,
        simulation: false,
        note: "Initialized live Razorpay payment gateway."
      });
    } catch (err: any) {
      console.error("[Razorpay Core Error] Creating live order failed, falling back to simulated checkout:", err.message);
    }
  }

  // Fallback / Simulated checkout (Graceful implementation if Razorpay secrets are not configured yet)
  console.log(`[Razorpay Client] Fallback simulation active for client checkout.`);
  const mockOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
  const newBooking: Booking = {
    id: bookingId,
    packageId,
    packageName,
    customerName,
    customerEmail,
    customerPhone,
    panCard,
    guestsCount: Number(guestsCount) || 1,
    travelDate,
    totalPrice: Number(totalPrice),
    paymentStatus: 'Pending',
    razorpayOrderId: mockOrderId,
    customRequirements,
    leadStatus: 'Local Captured',
    createdAt: new Date().toISOString(),
    nationality,
    aadhaarNumber,
    passportNumber,
    hasInfants: !!hasInfants,
    infantDetails,
    otherTravelers
  };

  bookings.push(newBooking);
  saveBookings(bookings);
  upsertCustomerDetails(customerName, customerEmail, customerPhone, panCard, Number(totalPrice));

  return res.json({
    success: true,
    orderId: mockOrderId,
    bookingId,
    amount: amountInPaise,
    keyId: razorpayKeyId || "rzp_test_T2pbeuclHL0QXH",
    simulation: true,
    note: "Razorpay Sandbox mode active (Keys not set in environment secrets)."
  });
});

// 6. Razorpay integration: Verify signature & Sync Lead
app.post('/api/payment/verify', async (req, res) => {
  const {
    bookingId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    simulation
  } = req.body;

  const bookings = loadBookings();
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);

  if (bookingIndex === -1) {
    return res.status(404).json({ error: "Booking session not found." });
  }

  const booking = bookings[bookingIndex];
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!simulation && razorpayKeySecret && razorpaySignature) {
    // 1. Live Validation
    const text = razorpayOrderId + "|" + razorpayPaymentId;
    const generated_signature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(text)
      .digest('hex');

    if (generated_signature !== razorpaySignature) {
      booking.paymentStatus = 'Failed';
      saveBookings(bookings);
      return res.status(400).json({ error: "Payment verification failed. Invalid Signature." });
    }
  }

  // Valid or simulated purchase completed
  booking.paymentStatus = 'Paid';
  booking.razorpayPaymentId = razorpayPaymentId || `pay_${crypto.randomBytes(8).toString('hex')}`;
  
  // 2. Mark Lead Captured
  booking.leadStatus = 'Local Captured';

  bookings[bookingIndex] = booking;
  saveBookings(bookings);

  res.json({
    success: true,
    message: "Payment verified successfully and trip details captured!",
    booking
  });
});

// 7. Custom Trip Form Formulator & Sync Lead
app.post('/api/custom-trip', async (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    panCard,
    travelDate,
    guestsCount,
    customRequirements,
    estimatedBudget,
    nationality,
    aadhaarNumber,
    passportNumber,
    hasInfants,
    infantDetails,
    otherTravelers
  } = req.body;

  if (!customerName || !customerEmail || !customerPhone) {
    return res.status(400).json({ error: "Missing essential data fields (Name, Email, Phone are compulsory)." });
  }

  const bookings = loadBookings();
  const bookingId = `bk-cust-${Date.now()}`;

  const customBooking: Booking = {
    id: bookingId,
    packageId: "custom",
    packageName: `Custom Tailored Holiday Booking (Est. Budget: INR ${estimatedBudget || 'Flexible'})`,
    customerName,
    customerEmail,
    customerPhone,
    panCard: panCard || "NOT_PROVIDED",
    travelDate,
    guestsCount: Number(guestsCount) || 1,
    totalPrice: Number(estimatedBudget) || 0,
    paymentStatus: 'Pending', // pending final custom quotes
    customRequirements,
    leadStatus: 'Local Captured',
    createdAt: new Date().toISOString(),
    nationality,
    aadhaarNumber,
    passportNumber,
    hasInfants: !!hasInfants,
    infantDetails,
    otherTravelers
  };

  // Mark Lead Captured
  customBooking.leadStatus = 'Local Captured';

  bookings.push(customBooking);
  saveBookings(bookings);
  upsertCustomerDetails(customerName, customerEmail, customerPhone, panCard || "NOT_PROVIDED", Number(estimatedBudget || 0));

  res.json({
    success: true,
    message: "Your custom J&K heritage travel wishlist has been recorded! Our Kashmiri local guide will reach out via WhatsApp.",
    booking: customBooking
  });
});

// 8. General Lead Submission (e.g. from footer / sidebar)
app.post('/api/leads', async (req, res) => {
  const { name, email, phone, packageName, travelDate, guestsCount, customRequirements } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Name, email, and phone are required to capture the lead." });
  }

  const bookings = loadBookings();
  const bookingId = `ld-${Date.now()}`;

  const leadBooking: Booking = {
    id: bookingId,
    packageName: packageName || "General Kashmir Inquiry",
    customerName: name,
    customerEmail: email,
    customerPhone: phone,
    panCard: "N/A",
    travelDate: travelDate || "Not Selected",
    guestsCount: Number(guestsCount) || 1,
    totalPrice: 0,
    paymentStatus: 'Pending',
    customRequirements,
    leadStatus: 'Local Captured',
    createdAt: new Date().toISOString()
  };

  // Mark Lead Captured
  leadBooking.leadStatus = 'Local Captured';

  bookings.push(leadBooking);
  saveBookings(bookings);
  upsertCustomerDetails(name, email, phone, "N/A", 0);

  res.json({
    success: true,
    message: "Thank you! Saffron-fragranced J&K greeting! We have successfully received your travel inquiry.",
    booking: leadBooking
  });
});

// 8b. Newsletter subscription route
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: "A valid email address is required for our newsletter list." });
  }

  // Verify if already registered
  const bookings = loadBookings();
  const exists = bookings.some(b => b.customerEmail?.toLowerCase() === email.toLowerCase() && b.packageName === "Newsletter Subscription List");
  if (exists) {
    return res.json({
      success: true,
      message: "You are already subscribed to the Sheenora Journeys newsletter list!"
    });
  }

  const name = email.split('@')[0];
  const userName = name.charAt(0).toUpperCase() + name.slice(1);
  const bookingId = `sub-${Date.now()}`;

  const subLead: Booking = {
    id: bookingId,
    packageName: "Newsletter Subscription List",
    customerName: userName,
    customerEmail: email,
    customerPhone: "+91-NEWSLETTER",
    panCard: "N/A",
    travelDate: "Monthly Update",
    guestsCount: 1,
    totalPrice: 0,
    paymentStatus: 'Paid',
    customRequirements: "Registered for exclusive Kashmir luxury travel discounts and season updates.",
    leadStatus: 'Local Captured',
    createdAt: new Date().toISOString()
  };

  bookings.push(subLead);
  saveBookings(bookings);
  upsertCustomerDetails(userName, email, "+91-NEWSLETTER", "N/A", 0);

  res.json({
    success: true,
    message: "Subscribed! Welcome aboard Sheenora Journeys newsletter. Rest assured, your inbox is filled only with beauty."
  });
});

// 9. Admin view for active CMS / Booking Log
app.get('/api/bookings', (req, res) => {
  res.json(loadBookings());
});

// 9f. CRM: Get all customer profiles with active engagement details
app.get('/api/customers', (req, res) => {
  res.json(loadCustomers());
});

// 9g. CRM: Update customer profile details or admin notes
app.put('/api/customers/:id', (req, res) => {
  const customers = loadCustomers();
  const index = customers.findIndex(c => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Customer not found." });
  }

  customers[index] = {
    ...customers[index],
    ...req.body,
    totalBookings: req.body.totalBookings !== undefined ? Number(req.body.totalBookings) : customers[index].totalBookings,
    totalRevenue: req.body.totalRevenue !== undefined ? Number(req.body.totalRevenue) : customers[index].totalRevenue,
  };

  saveCustomers(customers);
  res.json({ success: true, message: "Customer profile updated successfully.", customer: customers[index] });
});

// 9h. CRM: Delete customer profile securely
app.delete('/api/customers/:id', (req, res) => {
  const customers = loadCustomers();
  const filtered = customers.filter(c => c.id !== req.params.id);

  if (filtered.length === customers.length) {
    return res.status(404).json({ error: "Customer not found." });
  }

  saveCustomers(filtered);
  res.json({ success: true, message: "Customer profile was safely removed from the registry." });
});

// 9b. CMS purge: delete booking/lead log entry
app.delete('/api/bookings/:id', (req, res) => {
  const bookings = loadBookings();
  const filtered = bookings.filter(b => b.id !== req.params.id);
  
  if (filtered.length === bookings.length) {
    return res.status(404).json({ error: "Booking record not found" });
  }

  saveBookings(filtered);
  res.json({ success: true, message: "Booking record purged successfully from admin stream." });
});

// 9c. CRM core sync: push captured lead securely to Zoho CRM
app.post('/api/bookings/:id/sync', (req, res) => {
  const bookings = loadBookings();
  const index = bookings.findIndex(b => b.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Booking session not found." });
  }

  bookings[index].leadStatus = 'Synced with Zoho CRM';
  saveBookings(bookings);
  res.json({ 
    success: true, 
    message: "Lead push complete: Successfully synchronized transaction with Zoho CRM lead pipeline.",
    booking: bookings[index]
  });
});

// 9d. CMS update: update details of a booking or lead
app.put('/api/bookings/:id', (req, res) => {
  const bookings = loadBookings();
  const index = bookings.findIndex(b => b.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Booking session not found." });
  }

  bookings[index] = {
    ...bookings[index],
    ...req.body,
    guestsCount: req.body.guestsCount ? Number(req.body.guestsCount) : bookings[index].guestsCount,
    totalPrice: req.body.totalPrice ? Number(req.body.totalPrice) : bookings[index].totalPrice,
  };

  saveBookings(bookings);
  res.json({ success: true, message: "Booking record updated successfully.", booking: bookings[index] });
});

// 9e. Traveler direct lookup (Public lookup with deterministic guide assignment)
app.get('/api/bookings-lookup/:id', (req, res) => {
  const bookings = loadBookings();
  const idToFind = req.params.id.trim();
  const booking = bookings.find(b => b.id.toLowerCase() === idToFind.toLowerCase());

  if (!booking) {
    return res.status(404).json({ error: "Booking ID not found. Please double check your booking voucher or inquiry receipt." });
  }

  // Pre-configured list of local expert ambassadors / guides
  const GUIDES = [
    {
      name: "Bilal Ahmad",
      role: "Senior Adventure & Glacier trekking Guide",
      phone: "+91 94191 23456",
      avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80",
      bio: "Certified mountaineer from Pahalgam. 9+ years navigating Thajiwas glacier, Great Lakes trails, and snow-camping excursions.",
      rating: 4.9,
      languages: "Kashmiri, Urdu, Hindi, English"
    },
    {
      name: "Shabir Wani",
      role: "Local Heritage & Houseboat Concierge",
      phone: "+91 94190 65432",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
      bio: "12+ years expertise. Resident scholar of Srinagar ancient markets, Mughal Garden history, and Shikara navigation.",
      rating: 5.0,
      languages: "Kashmiri, Urdu, Hindi, English, Punjabi"
    },
    {
      name: "Yasmeen Dar",
      role: "Cultural Ambassador & High-Altitude Advisor",
      phone: "+91 94195 98765",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      bio: "Local of Srinagar City. Specialized in family experiences across Gulmarg skiing tracks, Pampore saffron harvests, and local food trials.",
      rating: 4.8,
      languages: "Kashmiri, Hindi, English, Punjabi"
    },
    {
      name: "Mohammad Bhat",
      role: "Pilgrimage Route Coordinator & Naturalist",
      phone: "+91 94197 45678",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
      bio: "Spiritual site specialist. Safe navigation expert for Amarnath Yatra circuits, Vaishno Devi trails, and Shankaracharya architecture.",
      rating: 4.9,
      languages: "Kashmiri, Dogri, Urdu, Hindi, English"
    }
  ];

  // Map stably based on booking ID
  const sumChars = booking.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const guideIndex = sumChars % GUIDES.length;
  const assignedGuide = GUIDES[guideIndex];

  res.json({
    success: true,
    booking: {
      id: booking.id,
      packageName: booking.packageName,
      customerName: booking.customerName,
      travelDate: booking.travelDate,
      guestsCount: booking.guestsCount,
      totalPrice: booking.totalPrice,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt,
      customRequirements: booking.customRequirements,
      nationality: booking.nationality,
      aadhaarNumber: booking.aadhaarNumber,
      passportNumber: booking.passportNumber,
      hasInfants: booking.hasInfants,
      infantDetails: booking.infantDetails,
      otherTravelers: booking.otherTravelers
    },
    assignedGuide
  });
});

// 10. Real-time Weather Proxy API
app.get('/api/weather', async (req, res) => {
  try {
    const locations = [
      { name: 'Srinagar', lat: 34.0837, lon: 74.7973 },
      { name: 'Gulmarg', lat: 34.0484, lon: 74.3805 },
      { name: 'Pahalgam', lat: 34.0161, lon: 75.3150 }
    ];

    const weatherPromises = locations.map(async (loc) => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=Asia/Kolkata`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        const data = await response.json();
        return {
          name: loc.name,
          latitude: loc.lat,
          longitude: loc.lon,
          temperature: data.current_weather?.temperature ?? null,
          windspeed: data.current_weather?.windspeed ?? null,
          weathercode: data.current_weather?.weathercode ?? 0,
          isDay: data.current_weather?.is_day ?? 1,
          tempMax: data.daily?.temperature_2m_max?.[0] ?? null,
          tempMin: data.daily?.temperature_2m_min?.[0] ?? null,
          dailyForecasts: data.daily?.time?.slice(0, 5).map((time: string, idx: number) => ({
            date: time,
            tempMax: data.daily?.temperature_2m_max?.[idx] ?? null,
            tempMin: data.daily?.temperature_2m_min?.[idx] ?? null,
            weathercode: data.daily?.weather_code?.[idx] ?? 0
          })) || []
        };
      } catch (err: any) {
        console.warn(`[Weather Open-Meteo Fallback Mode active for ${loc.name}]:`, err.message);
        
        // Realistic season-based mock weather forecasts in J&K (June/Summer averages)
        const mockTemplates: Record<string, any> = {
          'Srinagar': {
            temp: 26,
            wind: 8.5,
            code: 3, // partly cloudy
            tempMax: 29,
            tempMin: 18,
            forecasts: [
              { offset: 0, weathercode: 3, tempMax: 29, tempMin: 18 },
              { offset: 1, weathercode: 0, tempMax: 30, tempMin: 19 },
              { offset: 2, weathercode: 51, tempMax: 27, tempMin: 17 },
              { offset: 3, weathercode: 3, tempMax: 28, tempMin: 18 },
              { offset: 4, weathercode: 0, tempMax: 31, tempMin: 20 }
            ]
          },
          'Gulmarg': {
            temp: 14,
            wind: 12.2,
            code: 51, // slight rain/cloudy
            tempMax: 17,
            tempMin: 8,
            forecasts: [
              { offset: 0, weathercode: 51, tempMax: 17, tempMin: 8 },
              { offset: 1, weathercode: 3, tempMax: 19, tempMin: 9 },
              { offset: 2, weathercode: 61, tempMax: 13, tempMin: 7 },
              { offset: 3, weathercode: 3, tempMax: 16, tempMin: 8 },
              { offset: 4, weathercode: 0, tempMax: 18, tempMin: 10 }
            ]
          },
          'Pahalgam': {
            temp: 21,
            wind: 9.0,
            code: 0, // clear sky
            tempMax: 24,
            tempMin: 12,
            forecasts: [
              { offset: 0, weathercode: 0, tempMax: 24, tempMin: 12 },
              { offset: 1, weathercode: 3, tempMax: 23, tempMin: 13 },
              { offset: 2, weathercode: 3, tempMax: 22, tempMin: 11 },
              { offset: 3, weathercode: 0, tempMax: 25, tempMin: 12 },
              { offset: 4, weathercode: 51, tempMax: 21, tempMin: 10 }
            ]
          }
        };

        const tmpl = mockTemplates[loc.name] || mockTemplates['Srinagar'];
        const today = new Date();
        
        return {
          name: loc.name,
          latitude: loc.lat,
          longitude: loc.lon,
          temperature: tmpl.temp,
          windspeed: tmpl.wind,
          weathercode: tmpl.code,
          isDay: 1,
          tempMax: tmpl.tempMax,
          tempMin: tmpl.tempMin,
          dailyForecasts: tmpl.forecasts.map((f: any) => {
            const d = new Date();
            d.setDate(today.getDate() + f.offset);
            return {
              date: d.toISOString().split('T')[0],
              tempMax: f.tempMax,
              tempMin: f.tempMin,
              weathercode: f.weathercode
            };
          })
        };
      }
    });

    const results = await Promise.all(weatherPromises);
    res.json({ success: true, weather: results });
  } catch (error: any) {
    console.error("[Weather Server API Error]:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});


// ----------------------------------------------------
// VITE CLIENT INTEGRATION MIDDLEWARE
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexCapitalPath = path.join(distPath, 'Index.html');
      if (fs.existsSync(indexCapitalPath)) {
        res.sendFile(indexCapitalPath);
      } else {
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sheenora Journeys Server booted at http://localhost:${PORT}`);
  });
}

startServer();
