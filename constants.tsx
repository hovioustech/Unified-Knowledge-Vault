import { Domain, PartnerType, Chapter, Track, Institution, License } from './types';
import { Leaf, Users, Home, Scale, Activity, Brain, Globe, Zap, Database, Briefcase, ShieldCheck, BookOpen, Building2, GraduationCap, Factory, TreeDeciduous, ScrollText, Package, Server, Network, Layers, FileBadge, Workflow, Waypoints, RefreshCw, Binary } from 'lucide-react';
import React from 'react';

export const PARTNER_ROLES = [
  {
    type: PartnerType.IP_Definition,
    label: "IP Definition",
    description: "Curriculum architects, workforce design firms, and LMS consultants defining the knowledge core.",
    icon: <Brain className="w-5 h-5" />,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200"
  },
  {
    type: PartnerType.Legal_Structuring,
    label: "Legal Structuring",
    description: "IP licensing firms, Reg A securities counsel, and trust attorneys structuring the asset.",
    icon: <Scale className="w-5 h-5" />,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200"
  },
  {
    type: PartnerType.Product_Packaging,
    label: "Product Packaging",
    description: "EdTech product teams, certification designers, and platform integrators packaging for market.",
    icon: <Package className="w-5 h-5" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
  {
    type: PartnerType.Contractual_Licensing,
    label: "Contractual Licensing",
    description: "Higher-ed sales orgs, gov procurement specialists, and enterprise distributors.",
    icon: <ScrollText className="w-5 h-5" />,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200"
  },
  {
    type: PartnerType.Institutional_Embedding,
    label: "Institutional Embedding",
    description: "LMS integrators, success providers, and compliance consultants ensuring renewals.",
    icon: <Network className="w-5 h-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  }
];

export const DEMO_INDUSTRIES = [
  { id: 'all', label: 'All Sectors' },
  { id: 'higher-ed', label: 'Higher Education' },
  { id: 'corporate', label: 'Enterprise/Corporate' },
  { id: 'gov', label: 'Government & Municipal' },
  { id: 'trade', label: 'Vocational & Trade' },
];

export const FINANCIAL_MODEL = [
  { 
    year: 'Year 1', 
    label: 'Phase 1: Anchor', 
    clients: '5 Institutions', 
    revenue: '$600,000', 
    details: 'Avg: $120k/contract',
    height: 'h-16',
    color: 'bg-slate-300'
  },
  { 
    year: 'Year 2', 
    label: 'Validation', 
    clients: '12 Institutions', 
    revenue: '$1.6M', 
    details: 'Market Validation',
    height: 'h-24',
    color: 'bg-slate-400'
  },
  { 
    year: 'Year 3', 
    label: 'Phase 2: Enterprise', 
    clients: '25 Inst. + 1 Ent.', 
    revenue: '$5M ARR', 
    details: 'First Enterprise Client',
    height: 'h-32',
    color: 'bg-vault-accent'
  },
  { 
    year: 'Year 4', 
    label: 'Scale', 
    clients: '40 Inst. + 2 Ent.', 
    revenue: '$11M ARR', 
    details: 'Expansion Phase',
    height: 'h-48',
    color: 'bg-blue-600'
  },
  { 
    year: 'Year 5', 
    label: 'Phase 3: National', 
    clients: '60 Inst. + Regional', 
    revenue: '$20M+ ARR', 
    details: 'Regional Monopoly',
    height: 'h-64',
    color: 'bg-indigo-900'
  },
];

export const MODEL_ASSUMPTIONS = [
  { label: "Institutional Contract", value: "$120,000 /yr" },
  { label: "Enterprise Contract", value: "$500k - $1.5M /yr" },
  { label: "Client Retention", value: "85–90%" },
  { label: "Annual Price Lift", value: "3–5%" },
];

export const CERTIFICATION_TRACKS: Track[] = [
  { id: 't1', title: 'Foundations of Regenerative Land Systems', topicsRange: 'Topics 1–5', icon: 'Leaf', description: 'Core principles of soil health, hydrology, and ecosystem restoration.', estimatedChapters: 80 },
  { id: 't2', title: 'Climate-Smart Agroforestry Deployment', topicsRange: 'Topics 6–10', icon: 'TreeDeciduous', description: 'Scalable tree-crop systems, silvopasture, and carbon farming.', estimatedChapters: 75 },
  { id: 't3', title: 'Workforce Training & Field Operations', topicsRange: 'Topics 11–15', icon: 'Users', description: 'Safety, equipment mastery, and labor management for the green economy.', estimatedChapters: 75 },
  { id: 't4', title: 'Housing, ADU, and Climate Infrastructure', topicsRange: 'Topics 16–20', icon: 'Home', description: 'Sustainable construction materials, modular design, and energy efficiency.', estimatedChapters: 80 },
  { id: 't5', title: 'Governance, Policy, and County Deployment', topicsRange: 'Topics 21–24', icon: 'Scale', description: 'Zoning, legal frameworks, and public-private partnership structures.', estimatedChapters: 65 },
  { id: 't6', title: 'Capital Formation & Institutional Finance', topicsRange: 'Topics 25–28', icon: 'Briefcase', description: 'Green bonds, carbon credits, and regenerative asset management.', estimatedChapters: 70 },
  { id: 't7', title: 'Health, Performance, and Human Systems', topicsRange: 'Topics 29–33', icon: 'Activity', description: 'Nutrition, longevity science, and community wellness integration.', estimatedChapters: 80 },
  { id: 't8', title: 'Founder, Ethics, and Generational Stewardship', topicsRange: 'Topics 34–38', icon: 'ShieldCheck', description: 'Leadership, long-term thinking, and ethical business architectures.', estimatedChapters: 80 }
];

// Sample of domains distributed across tracks
export const CORE_DOMAINS: Domain[] = [
  // Track 1
  { id: 'd1', trackId: 't1', name: 'Soil Microbiology & Carbon Cycles', description: 'Understanding the living soil web.' },
  { id: 'd2', trackId: 't1', name: 'Watershed Management', description: 'Hydrology retention and restoration strategies.' },
  { id: 'd3', trackId: 't1', name: 'Biodiversity Baselines', description: 'Measuring and enhancing ecosystem complexity.' },
  
  // Track 2
  { id: 'd4', trackId: 't2', name: 'Alley Cropping Systems', description: 'Integration of tree rows with agronomic crops.' },
  { id: 'd5', trackId: 't2', name: 'Silvopasture Integration', description: 'Combining forestry and grazing of domesticated animals.' },

  // Track 3
  { id: 'd6', trackId: 't3', name: 'Heavy Machinery & Precision Ag', description: 'Operational certification for modern equipment.' },
  { id: 'd7', trackId: 't3', name: 'Labor Safety Standards (OSHA/Ag)', description: 'Compliance and safety protocols in field ops.' },

  // Track 4
  { id: 'd8', trackId: 't4', name: 'Modular Construction & Prefab', description: 'Rapid deployment housing technologies.' },
  { id: 'd9', trackId: 't4', name: 'Hempcrete & Biocomposites', description: 'Carbon-sequestering building materials.' },

  // Track 5
  { id: 'd10', trackId: 't5', name: 'Zoning Reform & Land Use', description: 'Navigating and changing municipal codes.' },
  { id: 'd11', trackId: 't5', name: 'Community Land Trusts', description: 'Legal structures for shared ownership.' },

  // Track 6
  { id: 'd12', trackId: 't6', name: 'Carbon Credit Verification', description: 'Methodologies for VCM and compliance markets.' },
  { id: 'd13', trackId: 't6', name: 'Regenerative Economics', description: 'Circular economy financial modeling.' },

  // Track 7
  { id: 'd14', trackId: 't7', name: 'Nutrient Density & Epigenetics', description: 'Food systems impact on human gene expression.' },
  { id: 'd15', trackId: 't7', name: 'Environmental Health', description: 'Impact of built environment on physiology.' },

  // Track 8
  { id: 'd16', trackId: 't8', name: 'Ethical Leadership', description: 'Decision making frameworks for long-term impact.' },
  { id: 'd17', trackId: 't8', name: 'Intergenerational Wealth Transfer', description: 'Stewardship trusts and succession planning.' },
];

export const PLACEHOLDER_CHAPTERS: Chapter[] = [
  { id: '1', title: 'Scope & Definitions', description: 'Defining the boundaries and terminology of this domain.' },
  { id: '2', title: 'Regulatory Landscape', description: 'Current laws, gaps, and future policy directions.' },
  { id: '3', title: 'Core Methodologies', description: 'Standard operating procedures and best practices.' },
  { id: '4', title: 'Case Studies: Success & Failure', description: 'Real-world analysis of projects in this sector.' },
  { id: '5', title: 'Technology & Tools', description: 'Software and hardware stack required for implementation.' },
  { id: '6', title: 'Financial Modeling', description: 'Unit economics and ROI analysis.' },
  { id: '7', title: 'Certification Assessment', description: 'Final project and knowledge verification.' },
];

export const MOCK_INSTITUTIONS: Institution[] = [
  { id: 'inst1', name: 'Pacific State University', type: 'higher-ed', contactEmail: 'admin@psu.edu', location: 'Oregon, USA' },
  { id: 'inst2', name: 'Global Tech Corp', type: 'corporate', contactEmail: 'training@gtc.com', location: 'Remote' },
  { id: 'inst3', name: 'County of Marin', type: 'gov', contactEmail: 'planning@marin.gov', location: 'California, USA' },
];

export const MOCK_LICENSES: License[] = [
  { 
    id: 'lic1', 
    institutionId: 'inst1', 
    trackId: 't1', 
    licenseKey: 'UKV-T1-PSU-9921', 
    status: 'active', 
    issuedDate: '2025-01-15', 
    expiryDate: '2026-01-15', 
    seatsTotal: 500, 
    seatsUsed: 342 
  },
  { 
    id: 'lic2', 
    institutionId: 'inst2', 
    trackId: 't3', 
    licenseKey: 'UKV-T3-GTC-4410', 
    status: 'active', 
    issuedDate: '2025-02-01', 
    expiryDate: '2026-02-01', 
    seatsTotal: 1000, 
    seatsUsed: 120 
  },
  { 
    id: 'lic3', 
    institutionId: 'inst3', 
    trackId: 't5', 
    licenseKey: 'UKV-T5-MAR-1102', 
    status: 'expired', 
    issuedDate: '2024-01-01', 
    expiryDate: '2025-01-01', 
    seatsTotal: 50, 
    seatsUsed: 50 
  },
];
