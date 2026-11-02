import { ServicePreset } from '@/types/invoice';

export const INITIAL_PROJECT_A_SERVICES: ServicePreset[] = [
  // PILLAR: MANAGE
  {
    id: 'pa-smm',
    category: 'Manage',
    name: 'Social Media Management',
    description: 'Always-on social planning, editorial direction, content production, publishing, approval workflow, and performance review.',
    unit: 'Bulan',
    suggestedPrice: 6500000,
  },
  {
    id: 'pa-brand-strategy',
    category: 'Manage',
    name: 'Brand & Content Strategy',
    description: 'Turn business priorities into a clear brand, content, campaign, audience mapping, and channel direction.',
    unit: 'Project',
    suggestedPrice: 7500000,
  },
  {
    id: 'pa-campaign-management',
    category: 'Manage',
    name: 'Channel & Campaign Management',
    description: 'Coordinate calendars, deliverables, approval loops, cross-team sync, and campaign launch tracking.',
    unit: 'Bulan',
    suggestedPrice: 8500000,
  },

  // PILLAR: CREATE
  {
    id: 'pa-integrated-campaign',
    category: 'Create',
    name: 'Integrated Campaign & Creative Development',
    description: 'Big ideas, campaign platforms, key visuals (KV), and connected multi-channel creative assets.',
    unit: 'Project',
    suggestedPrice: 12500000,
  },
  {
    id: 'pa-brand-collab',
    category: 'Create',
    name: 'Brand Collaboration Campaigns',
    description: 'Co-branded campaigns connecting two brands through one clear narrative, launch activation, and unified visual system.',
    unit: 'Project',
    suggestedPrice: 9500000,
  },
  {
    id: 'pa-content-production',
    category: 'Create',
    name: 'Content Production (Photo & Short Video)',
    description: 'Always-on photography, Reels/TikTok short videos, graphic feeds, and campaign assets tailored to platform formats.',
    unit: 'Batch / Bulan',
    suggestedPrice: 4500000,
  },
  {
    id: 'pa-tvc-film',
    category: 'Create',
    name: 'TVC, Film & Corporate Video Production',
    description: 'End-to-end commercial TVC, branded film, corporate profile video, testimonials, directing, and high-end color grading.',
    unit: 'Project',
    suggestedPrice: 18000000,
  },
  {
    id: 'pa-activation-event',
    category: 'Create',
    name: 'Brand Activation, Event & Experiential',
    description: 'Physical brand experiences, event identity, interactive booth design, multimedia screens, and offline touchpoints.',
    unit: 'Event',
    suggestedPrice: 15000000,
  },
  {
    id: 'pa-ooh-billboard',
    category: 'Create',
    name: 'OOH, Billboard & Videotron Creative',
    description: 'High-impact key visual adaptation and placement-ready assets for static billboards, 3D videotrons, and digital OOH.',
    unit: 'Spot / Titik',
    suggestedPrice: 5000000,
  },
  {
    id: 'pa-transit-media',
    category: 'Create',
    name: 'Transit & Transport Branding',
    description: 'Commuter line (KRL) & TransJakarta train/bus wrapping, interior panels, hand-grips, and transit station takeover.',
    unit: 'Unit Kereta/Bus',
    suggestedPrice: 8500000,
  },
  {
    id: 'pa-brand-identity',
    category: 'Create',
    name: 'Brand Identity & Design System',
    description: 'Comprehensive logo suite, design system, typography, color guide, pitch decks, stationery, and packaging guidelines.',
    unit: 'Paket Identity',
    suggestedPrice: 6500000,
  },
  {
    id: 'pa-motion-3d',
    category: 'Create',
    name: 'Motion Design, 3D & Post Production',
    description: 'Motion graphics, 3D product animation (Cinema 4D/Blender), visual effects compositing, sound design, and finishing.',
    unit: 'Asset / Project',
    suggestedPrice: 5500000,
  },
  {
    id: 'pa-web-digital',
    category: 'Create',
    name: 'Websites & Digital Experiences (Next.js / UI/UX)',
    description: 'High-converting landing pages, company websites, web applications, and interactive digital campaign microsites.',
    unit: 'Website',
    suggestedPrice: 8000000,
  },

  // PILLAR: GROW
  {
    id: 'pa-performance-marketing',
    category: 'Grow',
    name: 'Performance & Digital Marketing (Meta / TikTok / Google Ads)',
    description: 'Media planning, creative variation testing, conversion landing page optimization, and daily ad spend management.',
    unit: 'Bulan',
    suggestedPrice: 5500000,
  },
  {
    id: 'pa-social-optimization',
    category: 'Grow',
    name: 'Social Media Optimization & Growth Audit',
    description: 'Channel algorithm audit, retention analysis, hook testing, and strategic adjustments to maximize organic reach.',
    unit: 'Audit',
    suggestedPrice: 3500000,
  },
  {
    id: 'pa-ecommerce-growth',
    category: 'Grow',
    name: 'Marketplace & E-commerce Growth',
    description: 'Product storefront redesign, conversion copywriting, banner assets, and live shopping broadcast creative.',
    unit: 'Toko / Bulan',
    suggestedPrice: 4500000,
  },
  {
    id: 'pa-kol-activation',
    category: 'Grow',
    name: 'KOL & Creator Activation',
    description: 'Influencer curation, campaign briefs, talent coordination, review approvals, and content amplification.',
    unit: 'Campaign',
    suggestedPrice: 6000000,
  },
  {
    id: 'pa-traffic-planning',
    category: 'Grow',
    name: 'Media Placement, Route & Traffic Planning',
    description: 'Strategic planning for OOH and transit media based on traffic density, audience demographics, and route exposure.',
    unit: 'Plan',
    suggestedPrice: 4000000,
  },
];

const SERVICES_STORAGE_KEY = 'projecta_services_v1';

export function loadServices(): ServicePreset[] {
  if (typeof window === 'undefined') return INITIAL_PROJECT_A_SERVICES;
  try {
    const data = localStorage.getItem(SERVICES_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(INITIAL_PROJECT_A_SERVICES));
      return INITIAL_PROJECT_A_SERVICES;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PROJECT_A_SERVICES;
  } catch (err) {
    console.error('Error loading services from storage', err);
    return INITIAL_PROJECT_A_SERVICES;
  }
}

export function saveServices(services: ServicePreset[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));
  } catch (err) {
    console.error('Error saving services to storage', err);
  }
}

export function resetToDefaultServices(): ServicePreset[] {
  if (typeof window === 'undefined') return INITIAL_PROJECT_A_SERVICES;
  localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(INITIAL_PROJECT_A_SERVICES));
  return INITIAL_PROJECT_A_SERVICES;
}
