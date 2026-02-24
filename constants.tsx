import { Domain, Chapter, Track, Institution, License } from './types';
import { Leaf, Users, Home, Scale, Activity, Brain, Globe, Zap, Database, Briefcase, ShieldCheck, BookOpen, Building2, GraduationCap, Factory, TreeDeciduous, ScrollText, Package, Server, Network, Layers, FileBadge, Workflow, Waypoints, RefreshCw, Binary } from 'lucide-react';
import React from 'react';

export const DEMO_INDUSTRIES = [
  { id: 'all', label: 'All Specialties' },
  { id: 'cardiology', label: 'Cardiology' },
  { id: 'neurology', label: 'Neurology' },
  { id: 'oncology', label: 'Oncology' },
  { id: 'pediatrics', label: 'Pediatrics' },
];

export const FINANCIAL_MODEL = [
  { 
    year: 'Year 1', 
    label: 'Phase 1: Anchor', 
    clients: '5 Hospitals', 
    revenue: '$600,000', 
    details: 'Avg: $120k/contract',
    height: 'h-16',
    color: 'bg-slate-300'
  },
  { 
    year: 'Year 2', 
    label: 'Validation', 
    clients: '12 Hospitals', 
    revenue: '$1.6M', 
    details: 'Market Validation',
    height: 'h-24',
    color: 'bg-slate-400'
  },
  { 
    year: 'Year 3', 
    label: 'Phase 2: Health System', 
    clients: '25 Hosp. + 1 System', 
    revenue: '$5M ARR', 
    details: 'First Health System',
    height: 'h-32',
    color: 'bg-vault-accent'
  },
  { 
    year: 'Year 4', 
    label: 'Scale', 
    clients: '40 Hosp. + 2 Systems', 
    revenue: '$11M ARR', 
    details: 'Expansion Phase',
    height: 'h-48',
    color: 'bg-blue-600'
  },
  { 
    year: 'Year 5', 
    label: 'Phase 3: National', 
    clients: '60 Hosp. + Regional', 
    revenue: '$20M+ ARR', 
    details: 'Regional Monopoly',
    height: 'h-64',
    color: 'bg-indigo-900'
  },
];

export const MODEL_ASSUMPTIONS = [
  { label: "Hospital Contract", value: "$120,000 /yr" },
  { label: "Health System Contract", value: "$500k - $1.5M /yr" },
  { label: "Client Retention", value: "85–90%" },
  { label: "Annual Price Lift", value: "3–5%" },
];

export const CERTIFICATION_TRACKS: Track[] = [
  { id: 't1', title: 'Advanced Cardiology Diagnostics', topicsRange: 'Topics 1–5', icon: 'Activity', description: 'ECG interpretation, echocardiography, and advanced imaging.', estimatedChapters: 80 },
  { id: 't2', title: 'Neurological Disorders & Management', topicsRange: 'Topics 6–10', icon: 'Brain', description: 'Stroke protocols, neurodegenerative diseases, and neuropharmacology.', estimatedChapters: 75 },
  { id: 't3', title: 'Oncology Treatment Protocols', topicsRange: 'Topics 11–15', icon: 'ShieldCheck', description: 'Targeted therapies, immunotherapy, and palliative care.', estimatedChapters: 75 },
  { id: 't4', title: 'Pediatric Emergency Medicine', topicsRange: 'Topics 16–20', icon: 'Users', description: 'Neonatal resuscitation, pediatric trauma, and infectious diseases.', estimatedChapters: 80 },
  { id: 't5', title: 'Medical Ethics & Patient Rights', topicsRange: 'Topics 21–24', icon: 'Scale', description: 'Informed consent, end-of-life decisions, and medical malpractice.', estimatedChapters: 65 },
  { id: 't6', title: 'Healthcare Administration & Policy', topicsRange: 'Topics 25–28', icon: 'Building2', description: 'Hospital management, health economics, and public health policy.', estimatedChapters: 70 },
  { id: 't7', title: 'Surgical Techniques & Innovations', topicsRange: 'Topics 29–33', icon: 'Waypoints', description: 'Minimally invasive surgery, robotic surgery, and perioperative care.', estimatedChapters: 80 },
  { id: 't8', title: 'Pharmacology & Therapeutics', topicsRange: 'Topics 34–38', icon: 'Binary', description: 'Pharmacokinetics, drug interactions, and personalized medicine.', estimatedChapters: 80 }
];

// Sample of domains distributed across tracks
export const CORE_DOMAINS: Domain[] = [
  // Track 1
  { id: 'd1', trackId: 't1', name: 'ECG Interpretation', description: 'Mastering complex electrocardiograms.' },
  { id: 'd2', trackId: 't1', name: 'Echocardiography', description: 'Ultrasound imaging of the heart.' },
  { id: 'd3', trackId: 't1', name: 'Cardiac MRI', description: 'Advanced magnetic resonance imaging.' },
  
  // Track 2
  { id: 'd4', trackId: 't2', name: 'Stroke Protocols', description: 'Acute management of ischemic and hemorrhagic strokes.' },
  { id: 'd5', trackId: 't2', name: 'Neurodegenerative Diseases', description: 'Alzheimer\'s, Parkinson\'s, and ALS.' },

  // Track 3
  { id: 'd6', trackId: 't3', name: 'Targeted Therapies', description: 'Precision medicine in oncology.' },
  { id: 'd7', trackId: 't3', name: 'Immunotherapy', description: 'Harnessing the immune system to fight cancer.' },

  // Track 4
  { id: 'd8', trackId: 't4', name: 'Neonatal Resuscitation', description: 'Life-saving techniques for newborns.' },
  { id: 'd9', trackId: 't4', name: 'Pediatric Trauma', description: 'Management of severe injuries in children.' },

  // Track 5
  { id: 'd10', trackId: 't5', name: 'Informed Consent', description: 'Legal and ethical requirements.' },
  { id: 'd11', trackId: 't5', name: 'End-of-Life Decisions', description: 'Advance directives and palliative care.' },

  // Track 6
  { id: 'd12', trackId: 't6', name: 'Hospital Management', description: 'Operations and resource allocation.' },
  { id: 'd13', trackId: 't6', name: 'Health Economics', description: 'Cost-effectiveness and healthcare financing.' },

  // Track 7
  { id: 'd14', trackId: 't7', name: 'Minimally Invasive Surgery', description: 'Laparoscopic and endoscopic techniques.' },
  { id: 'd15', trackId: 't7', name: 'Robotic Surgery', description: 'Da Vinci systems and advanced robotics.' },

  // Track 8
  { id: 'd16', trackId: 't8', name: 'Pharmacokinetics', description: 'Drug absorption, distribution, metabolism, and excretion.' },
  { id: 'd17', trackId: 't8', name: 'Personalized Medicine', description: 'Genomics and tailored therapeutics.' },
];

export const PLACEHOLDER_CHAPTERS: Chapter[] = [
  { id: '1', title: 'Clinical Foundations', description: 'Anatomy, physiology, and pathophysiology.' },
  { id: '2', title: 'Diagnostic Criteria', description: 'Guidelines and evidence-based medicine.' },
  { id: '3', title: 'Treatment Protocols', description: 'Standard of care and emerging therapies.' },
  { id: '4', title: 'Case Studies: Complex Presentations', description: 'Real-world clinical scenarios.' },
  { id: '5', title: 'Surgical/Procedural Interventions', description: 'Techniques and complications.' },
  { id: '6', title: 'Patient Management & Follow-up', description: 'Long-term care and prognosis.' },
  { id: '7', title: 'Clinical Assessment', description: 'Final knowledge verification.' },
];

export const MOCK_INSTITUTIONS: Institution[] = [
  { id: 'inst1', name: 'Pacific State Medical Center', type: 'higher-ed', contactEmail: 'admin@psmc.edu', location: 'Oregon, USA' },
  { id: 'inst2', name: 'Global Health Network', type: 'corporate', contactEmail: 'training@ghn.com', location: 'Remote' },
  { id: 'inst3', name: 'County General Hospital', type: 'gov', contactEmail: 'education@cgh.gov', location: 'California, USA' },
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
