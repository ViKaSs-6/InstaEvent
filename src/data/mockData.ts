import { Venue, Vendor } from '../types';

export const VENUE_CATEGORIES = [
  { id: 'all', name: 'All Spaces', icon: 'Building2' },
  { id: 'rooftop', name: 'Rooftops', icon: 'Building' },
  { id: 'mansion', name: 'Mansions', icon: 'Home' },
  { id: 'warehouse', name: 'Industrial', icon: 'Warehouse' },
  { id: 'beach', name: 'Beachfront', icon: 'Sun' },
  { id: 'garden', name: 'Gardens', icon: 'Trees' },
  { id: 'studio', name: 'Photo Studios', icon: 'Camera' },
  { id: 'ballroom', name: 'Ballrooms', icon: 'PartyPopper' }
];

export const MOCK_VENUES: Venue[] = [
  {
    id: 'v1',
    name: 'The Skyline Glass Penthouse',
    location: 'SoHo, New York, NY',
    city: 'New York',
    category: 'rooftop',
    rating: 4.96,
    reviewsCount: 128,
    capacity: 120,
    pricePerHour: 350,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'A breathtaking 4,000 sq ft glass terrace overlooking Manhattan skyline. Perfect for high-end cocktail parties, product launches, and intimate wedding receptions.',
    amenities: ['Full Bar Area', 'Pro Sound System', 'Elevator Access', 'High-Speed WiFi', 'Dimmable Lighting', 'Kitchen Access'],
    superhost: true,
    instantBook: true,
    sqft: 4000,
    hostName: 'Elena Rostova',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'v2',
    name: 'Malibu Oceanfront Villa Estate',
    location: 'Malibu, Los Angeles, CA',
    city: 'Los Angeles',
    category: 'mansion',
    rating: 4.98,
    reviewsCount: 94,
    capacity: 200,
    pricePerHour: 500,
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Panoramic Pacific Ocean views with expansive infinity pool deck, lush private lawns, and direct beach access. Ideal for luxury galas and milestone celebrations.',
    amenities: ['Infinity Pool', 'Valet Parking Area', 'Private Beach Path', 'Outdoor Lounge', 'Catering Kitchen', 'Fire Pit'],
    superhost: true,
    instantBook: false,
    sqft: 7500,
    hostName: 'Marcus Vance',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'v3',
    name: 'The Brickwork Loft & Creative Warehouse',
    location: 'Arts District, Los Angeles, CA',
    city: 'Los Angeles',
    category: 'warehouse',
    rating: 4.89,
    reviewsCount: 76,
    capacity: 150,
    pricePerHour: 220,
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Industrial chic warehouse with exposed brick walls, 20ft timber ceilings, customizable LED rig, and drive-in loading bay.',
    amenities: ['Freight Elevator', 'Drive-in Loading', 'Stage Platform', 'Acoustic Panels', 'Green Room', 'Modular Furniture'],
    superhost: false,
    instantBook: true,
    sqft: 3200,
    hostName: 'Devon Hayes',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'v4',
    name: 'Serenity Secret Botanical Garden',
    location: 'Coral Gables, Miami, FL',
    city: 'Miami',
    category: 'garden',
    rating: 4.95,
    reviewsCount: 112,
    capacity: 250,
    pricePerHour: 280,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Tropical paradise featuring rare orchids, stone fountains, fairy-lit weeping banyan trees, and an open-air glass pavilion.',
    amenities: ['Glass Pavilion', 'Outdoor Lighting', 'Valet Friendly', 'Restroom Suites', 'Sound Regulations Compliant'],
    superhost: true,
    instantBook: true,
    sqft: 12000,
    hostName: 'Sofia Delgado',
    hostAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'v5',
    name: 'Grand Heritage Ballroom & Atrium',
    location: 'Downtown, Chicago, IL',
    city: 'Chicago',
    category: 'ballroom',
    rating: 4.92,
    reviewsCount: 88,
    capacity: 350,
    pricePerHour: 450,
    images: [
      'https://images.unsplash.com/photo-1545232979-fbfd42da200d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Classic 1920s architecture restored with crystal chandeliers, grand marble staircase, and state-of-the-art concert audio.',
    amenities: ['Concert Audio Rig', 'Marble Staircase', 'VIP Lounge', 'Full Commercial Kitchen', 'Coat Check Room'],
    superhost: true,
    instantBook: false,
    sqft: 8500,
    hostName: 'Jonathan Sterling',
    hostAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'v6',
    name: 'Aether Light Daylight Photo Studio',
    location: 'DUMBO, Brooklyn, NY',
    city: 'New York',
    category: 'studio',
    rating: 4.88,
    reviewsCount: 65,
    capacity: 60,
    pricePerHour: 180,
    images: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'South-facing floor-to-ceiling windows with unobstructed East River views. Outfitted with cyclorama wall, makeup vanities, and pro grip gear.',
    amenities: ['Cyclorama Wall', 'Makeup Vanities', 'Grip Equipment Included', 'Blackout Curtains', 'High-Speed Fiber Internet'],
    superhost: false,
    instantBook: true,
    sqft: 2200,
    hostName: 'Chloe Bennett',
    hostAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80'
  }
];

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'vd1',
    name: 'Artisan Feast Culinary Group',
    category: 'Catering',
    rating: 4.97,
    reviewsCount: 142,
    priceRange: '$$$',
    hourlyRate: 85,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    bio: 'Farm-to-table gourmet small plates, raw bars, and interactive live cooking stations tailored for modern events.',
    location: 'New York & Tri-State',
    popularPackages: ['Plated 5-Course Tasting', 'Cocktail Tapas & Caviar', 'Live Woodfire Grill Station']
  },
  {
    id: 'vd2',
    name: 'Lumina Cinema & Photography',
    category: 'Photography',
    rating: 4.99,
    reviewsCount: 210,
    priceRange: '$$$$',
    hourlyRate: 250,
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
    bio: 'Editorial photojournalistic coverage and 4K drone videography capturing authentic high-energy event moments.',
    location: 'Los Angeles & Travel Nationwide',
    popularPackages: ['Full Event Documentary + Drone', 'Express Same-Day Highlights', '360 Video Booth Add-on']
  },
  {
    id: 'vd3',
    name: 'SonicWave Live DJs & Production',
    category: 'DJ & Music',
    rating: 4.93,
    reviewsCount: 98,
    priceRange: '$$',
    hourlyRate: 150,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    bio: 'Custom musical curations from chill sunset lounge vinyl to open-format club sets with full concert lighting rigs.',
    location: 'Miami & All Major Hubs',
    popularPackages: ['4-Hour Live DJ + Intelligent Lights', 'Hybrid Live Sax & DJ Collective', 'Acoustic Ceremony Trio']
  },
  {
    id: 'vd4',
    name: 'Botanica Luxe Floral Architecture',
    category: 'Florist',
    rating: 4.95,
    reviewsCount: 84,
    priceRange: '$$$',
    hourlyRate: 120,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
    bio: 'Sculptural botanical installations, suspended floral clouds, and opulent table styling for unforgettable visual impact.',
    location: 'New York, Los Angeles, Miami',
    popularPackages: ['Suspended Floral Ceiling Canopy', 'Statement Entrance Archway', 'Monochromatic Table Scapes']
  }
];
