export enum PartnerType {
  IP_Definition = "Transformation 1: IP Definition",
  Legal_Structuring = "Transformation 2: Legal Structuring",
  Product_Packaging = "Transformation 3: Product Packaging",
  Contractual_Licensing = "Transformation 4: Contractual Licensing",
  Institutional_Embedding = "Transformation 5: Institutional Embedding"
}

export interface Track {
  id: string;
  title: string;
  description: string;
  topicsRange: string; // e.g., "Topics 1-5"
  icon: string;
  estimatedChapters: number;
}

export interface Domain {
  id: string;
  trackId: string;
  name: string;
  description: string;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
}

export interface GeneratedContent {
  overview: string;
  keyConcepts: string[];
  roleSpecificInsight: string;
  certificationCriteria: string[]; // Reused as "Operational Deliverables"
  contentBody: string; // Full essay content
}
