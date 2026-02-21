import { GeneratedContent, PartnerType, Domain, Chapter } from '../types';

// Local content generation service - No external API required

const generateEssay = (domain: Domain, chapter: Chapter, partnerType: PartnerType): string => {
  const roleFocus = partnerType.split(':')[1]?.trim() || partnerType;
  
  return `
# ${chapter.title}: A Deep Dive into ${domain.name}

## Executive Summary
In the context of **${roleFocus}**, the mastery of **${chapter.title}** is not merely an academic exercise but a critical operational necessity. As we advance the **${domain.name}** domain, this chapter serves as the foundational text for understanding how theoretical models translate into scalable, real-world assets.

## 1. The Strategic Imperative
Why does **${chapter.title}** matter now? The convergence of regulatory pressure, market demand, and technological capability has created a unique window of opportunity. 
*   **Market Gap:** Traditional approaches to ${domain.name} have failed to address the nuance of ${chapter.title}.
*   **Scalability:** By standardizing our approach to ${chapter.title}, we unlock the ability to replicate success across multiple jurisdictions.
*   **Defensibility:** A robust ${chapter.title} strategy creates a high barrier to entry for competitors lacking this depth of integration.

## 2. Core Methodologies & Frameworks
At the heart of our curriculum lies a rigorous adherence to first principles. When we examine **${chapter.title}**, we identify three primary vectors of action:

### A. The Structural Vector
This involves the physical or digital architecture required to support ${chapter.title}. Whether it's soil sensor networks in regenerative agriculture or legal entities in IP structuring, the "hardware" of the solution must be robust.

### B. The Process Vector
How do we execute? The standard operating procedures (SOPs) for **${chapter.title}** must be documented, tested, and optimized. This ensures that every deployment of ${domain.name} achieves consistent quality, regardless of the operator.

### C. The Cultural Vector
Adoption is often the point of failure. Our approach to ${chapter.title} includes specific change management protocols designed to align stakeholders—from the boardroom to the field—around a shared vision of success.

## 3. Implementation in Practice: A Case Study
Consider a recent deployment in the **${domain.trackId === 't2' ? 'Agroforestry' : domain.trackId === 't4' ? 'Housing' : 'Enterprise'} Sector**. 
The challenge was acute: a lack of standardized **${chapter.title}** protocols led to a 40% inefficiency rate. 
By applying the frameworks detailed in this chapter, the project achieved:
1.  **Reduced Latency:** Decision-making cycles shortened by 3 weeks.
2.  **Increased Compliance:** Regulatory adherence improved from 75% to 98%.
3.  **Revenue Uplift:** The clear definition of value drivers allowed for a 15% price premium.

## 4. The Role of ${roleFocus}
From the perspective of **${roleFocus}**, this chapter highlights specific responsibilities. 
*   **Risk Mitigation:** We must identify where ${chapter.title} intersects with liability and proactively manage that exposure.
*   **Value Capture:** How do we monetize the efficiency gains from ${chapter.title}? This is the central question for our commercial teams.
*   **Long-term Stewardship:** ${chapter.title} is not a one-time fix. It requires ongoing governance and refinement.

## 5. Future Outlook & Conclusion
As we look to the horizon, **${chapter.title}** will only grow in importance. Emerging trends in AI, climate resilience, and decentralized governance suggest that the early adopters of these standards will define the market for the next decade. 

This curriculum is designed to position you not just as a participant, but as a leader in that future.
  `;
};

export const generateChapterContent = async (
  domain: Domain,
  chapter: Chapter,
  partnerType: PartnerType
): Promise<GeneratedContent> => {
  // Offline mode: Instant response
  // await new Promise(resolve => setTimeout(resolve, 800));

  const t1 = PartnerType.IP_Definition;
  const t2 = PartnerType.Legal_Structuring;
  const t3 = PartnerType.Product_Packaging;
  const t4 = PartnerType.Contractual_Licensing;
  const t5 = PartnerType.Institutional_Embedding;

  let content: GeneratedContent = {
    overview: "",
    keyConcepts: [],
    roleSpecificInsight: "",
    certificationCriteria: [],
    contentBody: ""
  };

  const essay = generateEssay(domain, chapter, partnerType);

  // Generate specific content based on the Partner Perspective (Transformation Stage)
  switch (partnerType) {
    case t1:
      content = {
        overview: `In the IP Definition phase, we establish the canonical knowledge base for "${chapter.title}". This involves rigorous academic vetting and standardization of the "${domain.name}" domain to ensure it meets accreditation standards for university-level deployment.`,
        keyConcepts: [
          "Curriculum Standardization",
          "Learning Outcome Mapping",
          "Academic Accreditation Alignment",
          "Knowledge Graph Construction",
          "Instructor Pedagogy Definition"
        ],
        roleSpecificInsight: "A defensible asset begins with a 'Golden Record' of knowledge. By defining the standard, we force the market to adapt to our specifications, creating an initial moat against fragmentation.",
        certificationCriteria: [
          "Completion of Core Syllabus Architecture",
          "Validation by 3 Subject Matter Experts",
          "Mapping to Federal Workforce Codes"
        ],
        contentBody: essay
      };
      break;
    case t2:
      content = {
        overview: `Legal Structuring focuses on encapsulating "${chapter.title}" as a discrete, protectable asset. We apply copyright frameworks to the specific methodologies of "${domain.name}" to prevent leakage and enable fractional licensing.`,
        keyConcepts: [
          "Intellectual Property Ring-Fencing",
          "Copyright & Trademark Registration",
          "Licensing Vehicle Formation",
          "Royalty Flow Definition",
          "Territorial Rights Segmentation"
        ],
        roleSpecificInsight: "Raw knowledge is hard to monetize. Structured IP is a tradable asset. This phase transforms the curriculum into a legal instrument that can be leased to institutions without transferring ownership.",
        certificationCriteria: [
          "Filing of Copyright Protections",
          "Drafting of Master License Agreements",
          "Securities Compliance Review (Reg A)"
        ],
        contentBody: essay
      };
      break;
    case t3:
      content = {
        overview: `Product Packaging translates the raw IP of "${chapter.title}" into user-centric formats. For "${domain.name}", this means creating high-fidelity digital modules, instructor guides, and gamified assessments that drive engagement.`,
        keyConcepts: [
          "User Experience (UX) Design",
          "Gamification Mechanics",
          "Multi-Modal Content Delivery",
          "Accessibility Compliance (WCAG)",
          "Brand & Certification Badge Design"
        ],
        roleSpecificInsight: "Institutions buy usability, not just information. Superior packaging reduces friction in adoption and allows us to command a premium price point compared to static textbooks.",
        certificationCriteria: [
          "Production of Video & Interactive Assets",
          "LMS Compatibility Testing (SCORM/xAPI)",
          "Beta User Testing & Feedback Loop"
        ],
        contentBody: essay
      };
      break;
    case t4:
      content = {
        overview: `Contractual Licensing is the sales engine for "${chapter.title}". We establish high-volume B2B distribution channels for "${domain.name}", focusing on multi-year enterprise contracts rather than individual seat sales.`,
        keyConcepts: [
          "Enterprise Sales Strategy",
          "Government Procurement Channels",
          "Channel Partner Incentives",
          "Volume Pricing Architectures",
          "SLA & Support Definition"
        ],
        roleSpecificInsight: "Revenue durability comes from the contract structure. We utilize 'Take-or-Pay' clauses and annual price lifts to ensure that the asset yields compounding returns over time.",
        certificationCriteria: [
          "Signing of First Anchor Institution",
          "Establishment of CRM Pipeline",
          "Finalization of Sales Decks & Collateral"
        ],
        contentBody: essay
      };
      break;
    case t5:
      content = {
        overview: `Institutional Embedding ensures "${chapter.title}" becomes indispensable. We integrate "${domain.name}" protocols directly into the partner's LMS and operational workflows, making removal operationally painful.`,
        keyConcepts: [
          "Deep LMS API Integration",
          "Customer Success Automation",
          "Operational Workflow Dependency",
          "Compliance Reporting Dashboards",
          "Renewal Trigger Optimization"
        ],
        roleSpecificInsight: "The ultimate defense is embedding. When our certifications are tied to a partner's insurance, compliance, or HR systems, churn drops to near zero, securing the asset's long-term value.",
        certificationCriteria: [
          "Successful API Data Flow Test",
          "Deployment of Customer Success Playbook",
          "First Annual Renewal Execution"
        ],
        contentBody: essay
      };
      break;
    default:
      content = {
        overview: `Strategic analysis of ${chapter.title}.`,
        keyConcepts: ["Strategy", "Execution", "Review"],
        roleSpecificInsight: "Strategic value assessment operational.",
        certificationCriteria: ["Review Complete"],
        contentBody: essay
      };
  }

  return content;
};

export const chatWithVault = async (message: string, currentContext?: string): Promise<string> => {
  // Offline mode: Instant response
  // await new Promise(resolve => setTimeout(resolve, 600));
  
  const lowerMsg = message.toLowerCase();

  // Keyword-based conversational logic (Mock AI)
  if (lowerMsg.includes("revenue") || lowerMsg.includes("money") || lowerMsg.includes("financial") || lowerMsg.includes("cost") || lowerMsg.includes("growth")) {
    return "Our financial model projects a climb from $600k in Year 1 to over $20M ARR by Year 5. This is driven by high-retention institutional licensing rather than volatile one-off sales.";
  }

  if (lowerMsg.includes("competitor") || lowerMsg.includes("competition") || lowerMsg.includes("market")) {
    return "Most competitors focus on B2C sales (Coursera, Udemy) with high churn. Our advantage is the 'Golden Record' vault approach—a unified, licensed asset embedded directly into universities and corporations.";
  }

  if (lowerMsg.includes("risk") || lowerMsg.includes("fail") || lowerMsg.includes("problem") || lowerMsg.includes("challenge")) {
    return "The primary risks are content decay and low adoption. We mitigate decay through mandatory annual renewal updates, and we solve adoption by selling top-down to institutions rather than bottom-up to students.";
  }

  if (lowerMsg.includes("team") || lowerMsg.includes("partner") || lowerMsg.includes("who")) {
    return "We partner with top-tier subject matter experts for IP definition, and specialized legal firms for structuring. Our core team focuses on the platform architecture and licensing distribution.";
  }

  if (lowerMsg.includes("climate") || lowerMsg.includes("agroforestry") || lowerMsg.includes("land")) {
    return "Climate & Agroforestry is our pilot sector. It represents a high-demand, low-supply knowledge market where standardized certification is urgently needed for government grants and carbon credit verification.";
  }
  
  if (lowerMsg.includes("workforce") || lowerMsg.includes("job") || lowerMsg.includes("training")) {
    return "Our Workforce Development tracks are designed to align with federal grant codes (WIOA), ensuring that institutions can use public funding to license our curriculum.";
  }

  return "I am the Vault Strategist. I can provide details on our Financial Model, Competitive Landscape, Legal Structuring, or specific Curriculum Tracks. What would you like to explore?";
}