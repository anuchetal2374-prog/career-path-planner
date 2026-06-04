import { useState, useEffect, useRef, useCallback } from "react";

// ─── Load mammoth from CDN ────────────────────────────────────────────────────
function useMammoth() {
  const [ready, setReady] = useState(!!window.mammoth);
  useEffect(() => {
    if (window.mammoth) { setReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
    s.onload = () => setReady(true);
    document.head.appendChild(s);
  }, []);
  return ready;
}

// ─── Career Data ──────────────────────────────────────────────────────────────
const CAREER_DATA = {
  "Software Developer": {
    icon: "⬡", color: "#5BE8B4", description: "Build and ship software products",
    paths: [
      {
        id: "ic", label: "IC Track", title: "Senior Developer", years: "2–4 yrs", salary: "$130k–$190k",
        skills: ["System Design","TypeScript","AWS","Docker","Kubernetes","CI/CD","Code Review","REST APIs","Testing","Mentorship"],
        education: ["Bachelor's in Computer Science or Engineering"], certs: ["AWS Solutions Architect","GCP Professional Developer","CKA"],
        next: {
          title: "Staff / Principal Engineer", years: "+3–5 yrs", salary: "$190k–$290k",
          skills: ["Technical Strategy","RFC Writing","Architecture Reviews","Cross-Team Influence","Distributed Systems"],
          education: ["Bachelor's CS; Master's beneficial"], certs: ["AWS Solutions Architect Pro"],
          next: { title: "Distinguished Engineer / Fellow", years: "+5–9 yrs", salary: "$280k–$600k+", skills: ["Company-Wide Vision","Open Source Leadership","Patents","Conference Speaking"], education: ["MS/PhD CS for research roles"], certs: [], next: null }
        }
      },
      {
        id: "mgmt", label: "Management Track", title: "Engineering Manager", years: "2–4 yrs", salary: "$150k–$220k",
        skills: ["People Management","1:1 Coaching","Hiring","Sprint Planning","OKRs","Performance Reviews","Budget Management","Conflict Resolution"],
        education: ["Bachelor's in CS or Engineering"], certs: ["PMP","Certified Engineering Manager","PSM I"],
        next: {
          title: "Director of Engineering", years: "+3–5 yrs", salary: "$210k–$320k",
          skills: ["Org Design","Multi-Team Leadership","Executive Alignment","Headcount Planning","Engineering Culture"],
          education: ["Bachelor's CS; MBA beneficial"], certs: ["Executive Leadership Program"],
          next: { title: "VP Engineering / CTO", years: "+4–8 yrs", salary: "$300k–$650k+", skills: ["Technology Vision","M&A Due Diligence","Board Reporting","Fundraising","Culture at Scale"], education: ["BS/MS CS; MBA for VP roles"], certs: [], next: null }
        }
      },
      {
        id: "tpm", label: "Product-Eng Hybrid", title: "Technical Product Manager", years: "1–3 yrs", salary: "$120k–$175k",
        skills: ["Product Roadmapping","Technical Requirements","API Design","Agile/Scrum","Stakeholder Management","SQL","Data Analysis","Prototyping"],
        education: ["Bachelor's in CS, Engineering, or Business"], certs: ["CSPO","Google PM Certificate","AWS Cloud Practitioner"],
        next: {
          title: "Senior PM / Group PM", years: "+3–5 yrs", salary: "$165k–$240k",
          skills: ["Platform Strategy","P&L Ownership","GTM Planning","OKR Design","Team Leadership"],
          education: ["Bachelor's + MBA beneficial"], certs: ["CPO Certification"],
          next: { title: "VP Product / CPO", years: "+5–8 yrs", salary: "$230k–$450k+", skills: ["Company Product Vision","Board Communication","M&A Integration","Org Design"], education: ["MBA preferred"], certs: [], next: null }
        }
      }
    ]
  },
  "Product Owner": {
    icon: "◈", color: "#E8C547", description: "Own the backlog and bridge business & dev",
    paths: [
      {
        id: "pm", label: "Product Management", title: "Product Manager", years: "1–3 yrs", salary: "$110k–$160k",
        skills: ["Product Roadmapping","Backlog Management","User Stories","Acceptance Criteria","Agile/Scrum","Stakeholder Management","A/B Testing","JIRA","Confluence"],
        education: ["Bachelor's in Business, CS, or related"], certs: ["CSPO","PMC","Google PM Certificate","PSPO"],
        next: {
          title: "Senior / Group PM", years: "+3–5 yrs", salary: "$155k–$225k",
          skills: ["P&L Ownership","OKR Strategy","GTM Planning","Team Leadership","Pricing Strategy","Executive Communication"],
          education: ["Bachelor's + MBA strongly preferred"], certs: ["CPO Certification"],
          next: { title: "Director / VP Product", years: "+4–7 yrs", salary: "$210k–$380k", skills: ["Product Vision","Org Design","Board Reporting","M&A Strategy","Revenue Ownership"], education: ["MBA preferred"], certs: [], next: null }
        }
      },
      {
        id: "ba", label: "Business Analysis", title: "Senior Business Analyst", years: "1–2 yrs", salary: "$90k–$130k",
        skills: ["Requirements Gathering","Process Mapping","Gap Analysis","SQL","Tableau","Stakeholder Interviews","BPMN","Wireframing","Power BI"],
        education: ["Bachelor's in Business, Finance, or related"], certs: ["CBAP","PMI-PBA","ECBA"],
        next: {
          title: "Lead BA / Product Analyst", years: "+2–4 yrs", salary: "$120k–$175k",
          skills: ["Enterprise Architecture","Strategic Analysis","Team Mentoring","Business Case Development","Change Management"],
          education: ["Bachelor's + MBA beneficial"], certs: ["CBAP","Six Sigma Green Belt"],
          next: { title: "Head of Product / Director of Strategy", years: "+4–6 yrs", salary: "$170k–$280k", skills: ["Business Strategy","P&L Management","Org Transformation","Board-Level Reporting"], education: ["MBA preferred"], certs: [], next: null }
        }
      },
      {
        id: "agile", label: "Agile Leadership", title: "Agile Coach / RTE", years: "2–4 yrs", salary: "$100k–$155k",
        skills: ["SAFe Framework","PI Planning","ART Facilitation","Coaching Teams","Backlog Refinement","Dependency Management","Portfolio Kanban"],
        education: ["Bachelor's in any field; Agile certs weighted heavily"], certs: ["SAFe RTE","SAFe Agilist","ICP-ACC","PMI-ACP"],
        next: {
          title: "Portfolio Mgr / Agile Transformation Lead", years: "+3–5 yrs", salary: "$150k–$210k",
          skills: ["Enterprise Agile Transformation","Portfolio Roadmapping","Executive Coaching","Value Stream Mapping"],
          education: ["Bachelor's + MBA or advanced degree"], certs: ["SAFe SPCT"],
          next: { title: "VP / Director of Agile Delivery", years: "+4–6 yrs", salary: "$190k–$300k", skills: ["Org Design","P&L","Delivery at Scale","Board Communication"], education: ["MBA or extensive agile experience"], certs: [], next: null }
        }
      }
    ]
  },
  "Product Manager": {
    icon: "◎", color: "#FF7E5F", description: "Define what to build and why",
    paths: [
      {
        id: "senior", label: "Senior PM Track", title: "Senior Product Manager", years: "2–4 yrs", salary: "$140k–$200k",
        skills: ["Product Strategy","OKR Design","Customer Discovery","Competitive Analysis","Data-Driven Decisions","Go-To-Market","Pricing","SQL","Figma"],
        education: ["Bachelor's in CS, Business, or related; MBA a strong plus"], certs: ["CPO Certification","Pragmatic Marketing Certified","CSPO"],
        next: {
          title: "Group PM / Director of Product", years: "+3–5 yrs", salary: "$195k–$280k",
          skills: ["P&L Ownership","Multi-Team Leadership","Platform Thinking","Business Development","Analyst Relations"],
          education: ["MBA from top school strongly preferred"], certs: [],
          next: { title: "VP Product / CPO", years: "+4–7 yrs", salary: "$260k–$500k+", skills: ["Company Vision","Board Reporting","M&A Integration","Revenue Strategy","Investor Relations"], education: ["MBA or equivalent track record"], certs: [], next: null }
        }
      },
      {
        id: "platform", label: "Platform / Technical PM", title: "Platform Product Manager", years: "2–4 yrs", salary: "$145k–$205k",
        skills: ["API Design","Developer Experience","Platform Strategy","Technical Roadmapping","SLA/SLO Definition","Data Pipelines","System Architecture"],
        education: ["Bachelor's in CS or Engineering strongly preferred"], certs: ["AWS Cloud Practitioner","CSPO"],
        next: {
          title: "Sr. Platform PM / Head of Platform", years: "+3–5 yrs", salary: "$200k–$290k",
          skills: ["Platform P&L","Developer Advocacy","Ecosystem Strategy","Enterprise Architecture","Vendor Management"],
          education: ["Bachelor's CS + MBA beneficial"], certs: [],
          next: { title: "VP Platform / CTO (Product)", years: "+4–7 yrs", salary: "$270k–$500k+", skills: ["Technology Vision","Revenue from Platform","Partner Strategy"], education: ["MS CS or MBA"], certs: [], next: null }
        }
      },
      {
        id: "growth", label: "Growth / Data PM", title: "Growth Product Manager", years: "1–3 yrs", salary: "$125k–$180k",
        skills: ["Growth Loops","Funnel Analysis","A/B Testing","Experimentation","SQL","Mixpanel","Amplitude","PLG","Activation","Retention"],
        education: ["Bachelor's in CS, Statistics, or Business"], certs: ["Product-Led Growth Certified","Google Analytics"],
        next: {
          title: "Head of Growth / Director of Growth", years: "+3–5 yrs", salary: "$180k–$260k",
          skills: ["Growth Strategy","Team Leadership","Revenue Attribution","Multi-Channel Acquisition","Budget Ownership"],
          education: ["Bachelor's + data science or MBA preferred"], certs: [],
          next: { title: "VP Growth / CMO / CPO", years: "+4–6 yrs", salary: "$250k–$450k+", skills: ["Full-Funnel Ownership","Board Narratives","M&A","Org Design"], education: ["MBA or deep growth expertise"], certs: [], next: null }
        }
      }
    ]
  },
  "Project Manager": {
    icon: "◆", color: "#38BDF8", description: "Deliver projects on time, scope, and budget",
    paths: [
      {
        id: "itpm", label: "IT / Tech PM", title: "Senior IT Project Manager", years: "2–4 yrs", salary: "$95k–$145k",
        skills: ["Waterfall","Agile Hybrid","Risk Management","RAID Log","Resource Planning","Budget Tracking","MS Project","JIRA","Vendor Management","Change Control"],
        education: ["Bachelor's in IT, CS, Business, or Engineering"], certs: ["PMP","PRINCE2","PMI-ACP","CAPM"],
        next: {
          title: "Program Manager / PMO Lead", years: "+3–5 yrs", salary: "$135k–$195k",
          skills: ["Portfolio Management","PMO Setup","Governance Frameworks","Executive Stakeholder Management","Benefits Realisation"],
          education: ["Bachelor's + MBA or MSc in Project Management"], certs: ["PMP","PgMP","PRINCE2 Practitioner"],
          next: { title: "Director of PMO / VP Delivery", years: "+4–7 yrs", salary: "$175k–$280k", skills: ["Enterprise Portfolio Strategy","Org Design","P&L","Board-Level Reporting"], education: ["MBA or MSc preferred"], certs: [], next: null }
        }
      },
      {
        id: "digital", label: "Digital Transformation", title: "Digital Transformation PM", years: "2–4 yrs", salary: "$105k–$160k",
        skills: ["Change Management","PROSCI/ADKAR","Business Process Reengineering","ERP Implementation","Cloud Migration","Training Design"],
        education: ["Bachelor's in Business, IT, or Management"], certs: ["PMP","PROSCI Change Management","Lean Six Sigma Green Belt","SAFe Agilist"],
        next: {
          title: "Transformation Lead / Senior Program Manager", years: "+3–5 yrs", salary: "$155k–$225k",
          skills: ["Enterprise Architecture","Strategic Roadmapping","Culture Change","Executive Sponsorship","Value Stream Mapping"],
          education: ["MBA strongly preferred"], certs: ["PgMP","Lean Six Sigma Black Belt"],
          next: { title: "Chief Transformation Officer / VP Strategy", years: "+5–8 yrs", salary: "$220k–$400k", skills: ["Board Reporting","M&A Integration","Org Restructuring","Global Programme Leadership"], education: ["MBA from top school preferred"], certs: [], next: null }
        }
      },
      {
        id: "delivery", label: "Agile Delivery Lead", title: "Delivery Manager", years: "1–3 yrs", salary: "$90k–$135k",
        skills: ["Scrum","Kanban","Sprint Planning","Impediment Removal","Velocity Tracking","Stakeholder Management","Release Planning","Retrospectives"],
        education: ["Bachelor's in any field; Agile experience weighted heavily"], certs: ["PSM I","CSM","PSPO","SAFe Agilist","PMI-ACP"],
        next: {
          title: "Head of Delivery / Agile Programme Manager", years: "+3–5 yrs", salary: "$130k–$185k",
          skills: ["Scaled Agile","Portfolio Kanban","OKR Alignment","Executive Reporting","Budget Management"],
          education: ["Bachelor's + Agile/PM certifications"], certs: ["SAFe RTE","PMP","PgMP"],
          next: { title: "VP Engineering / Director of Delivery", years: "+4–6 yrs", salary: "$175k–$290k", skills: ["Delivery at Scale","Org Design","P&L","Culture","Technology Roadmap Alignment"], education: ["MBA or equivalent"], certs: [], next: null }
        }
      }
    ]
  },
  "Program Manager": {
    icon: "◉", color: "#A78BFA", description: "Orchestrate multiple projects toward strategic goals",
    paths: [
      {
        id: "enterprise", label: "Enterprise Programs", title: "Senior Program Manager", years: "2–4 yrs", salary: "$130k–$185k",
        skills: ["Portfolio Management","Dependency Mapping","Executive Stakeholder Mgmt","Governance Frameworks","Strategic Roadmapping","Benefits Realisation","OKRs","Change Management"],
        education: ["Bachelor's in Business, Engineering, or IT; MBA strongly preferred"], certs: ["PgMP","PMP","MSP","SAFe LACE"],
        next: {
          title: "Director of Programs / PMO Director", years: "+3–5 yrs", salary: "$175k–$250k",
          skills: ["PMO Governance","Enterprise Portfolio Strategy","Executive Reporting","Org Design","Budget Ownership"],
          education: ["MBA preferred"], certs: ["PgMP","P3O"],
          next: { title: "VP / Chief of Staff / COO", years: "+4–7 yrs", salary: "$230k–$420k", skills: ["Company Strategy","Board Communication","M&A","P&L","Culture at Scale"], education: ["MBA from top school preferred"], certs: [], next: null }
        }
      },
      {
        id: "tpgm", label: "Technical Program Manager", title: "Senior Technical Program Manager", years: "2–4 yrs", salary: "$145k–$210k",
        skills: ["Engineering Cross-Team Coordination","Technical Risk Management","Architecture Reviews","OKR Tracking","Release Management","RFC Process"],
        education: ["Bachelor's in CS or Engineering — technical background essential"], certs: ["PMP","AWS Solutions Architect Associate","SAFe RTE"],
        next: {
          title: "Principal TPM / Head of Eng Programs", years: "+3–5 yrs", salary: "$205k–$295k",
          skills: ["Multi-org Program Strategy","Technical Due Diligence","Executive Engineering Communication","Platform Roadmap Ownership"],
          education: ["Bachelor's CS/Eng + MBA or MS beneficial"], certs: [],
          next: { title: "VP Engineering Programs / CTO Office", years: "+4–7 yrs", salary: "$270k–$500k+", skills: ["Company-Wide Technical Execution","Board-Level Reporting","Technology Acquisitions"], education: ["MS or MBA"], certs: [], next: null }
        }
      },
      {
        id: "prodops", label: "Product Operations", title: "Product Operations Manager", years: "1–3 yrs", salary: "$100k–$150k",
        skills: ["Product Analytics","Data Dashboards","Process Documentation","Cross-Functional Alignment","GTM Coordination","Customer Feedback Systems"],
        education: ["Bachelor's in Business, Operations, or CS"], certs: ["PMP","CSPO","Lean Six Sigma","Tableau"],
        next: {
          title: "Head of Product Operations", years: "+3–5 yrs", salary: "$150k–$220k",
          skills: ["Product Operating Model Design","OKR Implementation","Team Leadership","Executive Alignment"],
          education: ["Bachelor's + MBA beneficial"], certs: [],
          next: { title: "VP Product Operations / COO (Product)", years: "+4–6 yrs", salary: "$210k–$360k", skills: ["Company-Wide Ops Strategy","Board Reporting","P&L","Org Design"], education: ["MBA preferred"], certs: [], next: null }
        }
      }
    ]
  },
  "Scrum Master": {
    icon: "⬢", color: "#34D399", description: "Facilitate agile teams and remove impediments",
    paths: [
      {
        id: "coaching", label: "Agile Coaching", title: "Agile Coach / Senior Scrum Master", years: "2–4 yrs", salary: "$100k–$150k",
        skills: ["Scrum Mastery","Kanban","Team Coaching","Conflict Facilitation","Retrospective Techniques","Velocity Metrics","Training & Workshops"],
        education: ["Bachelor's in any field; certifications weighted heavily"], certs: ["PSM II","CSP-SM","ICP-ACC","CTC"],
        next: {
          title: "Enterprise Agile Coach / RTE", years: "+3–5 yrs", salary: "$145k–$210k",
          skills: ["SAFe at Scale","PI Planning Facilitation","ART Launch","Leadership Coaching","Value Stream Mapping"],
          education: ["Bachelor's + advanced agile credentials"], certs: ["SAFe SPCT","SAFe RTE","CEC"],
          next: { title: "Head of Agile / Director of Eng Effectiveness", years: "+4–6 yrs", salary: "$185k–$290k", skills: ["Agile Transformation Strategy","Org Design","Culture Building","Hiring Coaches","P&L"], education: ["MBA or equivalent"], certs: [], next: null }
        }
      },
      {
        id: "deliverymgmt", label: "Delivery Management", title: "Delivery Manager / Flow Master", years: "2–3 yrs", salary: "$95k–$140k",
        skills: ["Flow Metrics","Dependency Management","Release Coordination","Stakeholder Reporting","DevOps Collaboration","Portfolio Kanban","Risk Management"],
        education: ["Bachelor's in Business, IT, or related"], certs: ["PSM I","SAFe Agilist","PMP","KMP"],
        next: {
          title: "Head of Delivery / Senior Programme Manager", years: "+3–5 yrs", salary: "$140k–$200k",
          skills: ["Scaled Delivery","OKR Design","Budget Management","Multi-Team Coordination","Executive Communication"],
          education: ["Bachelor's + PMP or MBA beneficial"], certs: ["PgMP","SAFe RTE"],
          next: { title: "VP Delivery / Director of Engineering", years: "+4–6 yrs", salary: "$190k–$310k", skills: ["Delivery at Scale","Technology Strategy","Org Design","P&L","Board Reporting"], education: ["MBA or equivalent"], certs: [], next: null }
        }
      },
      {
        id: "po", label: "Product Ownership", title: "Product Owner / Junior PM", years: "1–2 yrs", salary: "$95k–$140k",
        skills: ["Backlog Prioritisation","User Story Writing","Acceptance Criteria","Sprint Goal Setting","Stakeholder Management","Customer Discovery","Roadmapping","JIRA"],
        education: ["Bachelor's in Business, CS, or related"], certs: ["CSPO","PSPO","PMC","Google PM Certificate"],
        next: {
          title: "Product Manager / Senior PO", years: "+2–4 yrs", salary: "$130k–$190k",
          skills: ["Product Strategy","OKR Design","Go-To-Market","Competitive Analysis","SQL","Executive Storytelling"],
          education: ["Bachelor's + MBA strongly preferred for PM track"], certs: ["CPO Certification"],
          next: { title: "Senior PM / Director of Product", years: "+4–7 yrs", salary: "$190k–$350k", skills: ["Product Vision","Org Leadership","Revenue Ownership","M&A","Board Communication"], education: ["MBA preferred"], certs: [], next: null }
        }
      }
    ]
  },

  // ── NEW ROLES ──────────────────────────────────────────────────────────────
  "DevOps Engineer": {
    icon: "⚙", color: "#F472B6", description: "Bridge development and operations at scale",
    paths: [
      {
        id: "sre", label: "Site Reliability", title: "Senior SRE / DevOps Engineer", years: "2–4 yrs", salary: "$135k–$195k",
        skills: ["Kubernetes","Terraform","CI/CD","AWS","Docker","Ansible","Prometheus","Grafana","SLO Design","Incident Management","Python","Golang"],
        education: ["Bachelor's in CS or Engineering"], certs: ["AWS DevOps Professional","CKA","HashiCorp Terraform Associate"],
        next: {
          title: "Staff SRE / Platform Architect", years: "+3–5 yrs", salary: "$185k–$265k",
          skills: ["Platform Strategy","Internal Developer Platforms","Cost Optimization FinOps","Security Architecture","Chaos Engineering"],
          education: ["Bachelor's CS; Cloud architecture experience"], certs: ["AWS Solutions Architect Pro","GCP Professional Architect"],
          next: { title: "VP Engineering / Director of Infrastructure", years: "+4–7 yrs", salary: "$260k–$450k+", skills: ["Technology Vision","Org Design","Vendor Management","Board Reporting"], education: ["BS/MS CS"], certs: [], next: null }
        }
      },
      {
        id: "cloudarch", label: "Cloud Architecture", title: "Cloud Engineer / Architect", years: "2–4 yrs", salary: "$140k–$200k",
        skills: ["AWS/GCP/Azure Architecture","Networking","Security","IaC (Terraform/Pulumi)","Serverless","Microservices","Cost Management","Compliance"],
        education: ["Bachelor's in CS, Engineering, or IT"], certs: ["AWS Solutions Architect","Google Cloud Architect","Azure Solutions Architect Expert"],
        next: {
          title: "Principal Cloud Architect", years: "+3–5 yrs", salary: "$200k–$290k",
          skills: ["Multi-Cloud Strategy","Enterprise Architecture","Migration Planning","Security Governance","Vendor Management"],
          education: ["Bachelor's CS; Master's beneficial"], certs: ["AWS Solutions Architect Pro","TOGAF"],
          next: { title: "CTO / VP of Infrastructure", years: "+4–7 yrs", salary: "$280k–$550k+", skills: ["Technology Vision","M&A Technical Due Diligence","Board Communication","FinOps at Scale"], education: ["MS CS or MBA"], certs: [], next: null }
        }
      },
      {
        id: "secops", label: "Security / DevSecOps", title: "DevSecOps / Security Engineer", years: "2–4 yrs", salary: "$130k–$190k",
        skills: ["SAST/DAST","Container Security","Zero Trust","SIEM","Vulnerability Management","Compliance (SOC2/ISO27001)","Penetration Testing","AWS Security"],
        education: ["Bachelor's in CS, Cybersecurity, or IT"], certs: ["CISSP","CEH","AWS Security Specialty","CompTIA Security+"],
        next: {
          title: "Security Architect / Security Lead", years: "+3–5 yrs", salary: "$185k–$270k",
          skills: ["Security Architecture","Threat Modeling","Risk Management","Incident Response","Red Team / Blue Team"],
          education: ["Bachelor's CS/Security; CISSP usually required"], certs: ["CISM","CISSP","SABSA"],
          next: { title: "CISO / VP Security", years: "+4–7 yrs", salary: "$250k–$500k+", skills: ["Security Strategy","Board Reporting","Regulatory Compliance","Org Leadership","M&A Security"], education: ["MBA or equivalent executive experience"], certs: [], next: null }
        }
      }
    ]
  },

  "Data Engineer": {
    icon: "⬟", color: "#60A5FA", description: "Build the pipelines that power data products",
    paths: [
      {
        id: "analytics-eng", label: "Analytics Engineering", title: "Senior Data Engineer", years: "2–4 yrs", salary: "$125k–$180k",
        skills: ["Python","Spark","Airflow","dbt","Snowflake","BigQuery","Kafka","Data Modeling","SQL","ETL/ELT","Dagster"],
        education: ["Bachelor's in CS, Mathematics, or Engineering"], certs: ["Databricks Data Engineer Associate","dbt Certified","AWS Data Analytics Specialty"],
        next: {
          title: "Staff Data Engineer / Data Architect", years: "+3–5 yrs", salary: "$180k–$260k",
          skills: ["Data Platform Strategy","Lakehouse Architecture","Data Mesh","DataOps","Team Leadership","Cost Optimisation","Governance"],
          education: ["Bachelor's + Master's beneficial"], certs: ["Databricks Data Engineer Professional","Google Professional Data Engineer"],
          next: { title: "Head of Data Engineering / VP Data", years: "+4–7 yrs", salary: "$240k–$400k+", skills: ["Data Strategy","Org Design","Executive Reporting","Build vs Buy","Vendor Management"], education: ["MS or MBA"], certs: [], next: null }
        }
      },
      {
        id: "ml-platform", label: "ML Platform", title: "ML Platform Engineer", years: "2–4 yrs", salary: "$140k–$200k",
        skills: ["MLOps","Kubeflow","MLflow","Feature Stores","Model Serving","Ray","Distributed Training","Python","Docker","Kubernetes"],
        education: ["Bachelor's in CS, Math, or Statistics"], certs: ["AWS ML Specialty","Databricks ML Professional","TensorFlow Developer"],
        next: {
          title: "Staff MLOps / AI Platform Lead", years: "+3–5 yrs", salary: "$200k–$290k",
          skills: ["Platform Architecture for ML","LLMOps","Responsible AI","FinOps for ML","Team Leadership"],
          education: ["Bachelor's + Master's in CS/ML preferred"], certs: [],
          next: { title: "Head of AI Infrastructure / VP ML Platform", years: "+4–6 yrs", salary: "$270k–$480k+", skills: ["AI Strategy","Org Design","Board Communication","Research-to-Prod Pipeline"], education: ["MS/PhD CS preferred"], certs: [], next: null }
        }
      },
      {
        id: "analytics", label: "Analytics & BI", title: "Senior Analytics Engineer / BI Lead", years: "1–3 yrs", salary: "$100k–$155k",
        skills: ["dbt","SQL","Tableau","Looker","Power BI","Data Modeling","Business Metrics","Python","Stakeholder Communication"],
        education: ["Bachelor's in Statistics, Business Analytics, or CS"], certs: ["Tableau Desktop Specialist","Looker Certified","dbt Certified"],
        next: {
          title: "Analytics Manager / Head of BI", years: "+3–5 yrs", salary: "$150k–$220k",
          skills: ["Analytics Strategy","Team Leadership","Executive Dashboarding","Data Literacy Programs","OKR Tracking"],
          education: ["Bachelor's + MBA beneficial"], certs: [],
          next: { title: "VP Analytics / CDO", years: "+4–6 yrs", salary: "$210k–$370k+", skills: ["Data Culture","Board-Level Reporting","Data Monetisation","Org Design"], education: ["MBA or MS in Data Science"], certs: [], next: null }
        }
      }
    ]
  },

  "UX Designer": {
    icon: "◍", color: "#F9A8D4", description: "Design products people love to use",
    paths: [
      {
        id: "product-design", label: "Product Design", title: "Senior Product Designer", years: "2–4 yrs", salary: "$115k–$165k",
        skills: ["Figma","Design Systems","Visual Design","Prototyping","User Research","Accessibility","Motion Design","Design Critique","Interaction Design"],
        education: ["Bachelor's in Graphic Design, HCI, or related","Portfolio required"], certs: ["Google UX Design Certificate","Figma Advanced"],
        next: {
          title: "Lead / Staff Product Designer", years: "+3–5 yrs", salary: "$160k–$230k",
          skills: ["Design Direction","Cross-Functional Leadership","Design Strategy","Mentorship","Roadmap Influence","Design Ops"],
          education: ["Bachelor's or Master's in Design or HCI"], certs: ["Human Factors International"],
          next: { title: "Head of Design / CDO", years: "+4–7 yrs", salary: "$210k–$380k+", skills: ["Design Vision","Brand Ownership","Org Building","Executive Communication","Design ROI"], education: ["Bachelor's Design; MBA for CDO track"], certs: [], next: null }
        }
      },
      {
        id: "ux-research", label: "UX Research", title: "Senior UX Researcher", years: "2–4 yrs", salary: "$110k–$160k",
        skills: ["Usability Testing","Qualitative Research","Quantitative Research","Journey Mapping","Survey Design","JTBD","Statistical Analysis","Research Ops"],
        education: ["Bachelor's or Master's in Psychology, HCI, or Cognitive Science"], certs: ["NN/g UX Research","UXPA Certification"],
        next: {
          title: "Research Lead / Principal Researcher", years: "+3–5 yrs", salary: "$155k–$215k",
          skills: ["Research Strategy","Team Mentoring","Research Ops","Insights Platforms","Experimental Design","Executive Influence"],
          education: ["Master's in Psychology or HCI preferred"], certs: [],
          next: { title: "Head of Research / VP Research", years: "+4–6 yrs", salary: "$200k–$320k", skills: ["Research Culture","Executive Partnership","Research Roadmap","Budget Ownership","Org Design"], education: ["Master's or PhD"], certs: [], next: null }
        }
      },
      {
        id: "design-systems", label: "Design Systems & Ops", title: "Design Systems Lead", years: "2–4 yrs", salary: "$120k–$170k",
        skills: ["Figma","Component Libraries","Token Architecture","Storybook","React basics","Documentation","Cross-Team Governance","Accessibility Standards"],
        education: ["Bachelor's in Design, CS, or HCI"], certs: ["Figma Advanced","Web Accessibility Specialist"],
        next: {
          title: "Head of Design Systems / Design Platform Lead", years: "+3–5 yrs", salary: "$170k–$240k",
          skills: ["Design Platform Strategy","Engineering Partnership","Design Culture","Team Leadership","Open Source Contribution"],
          education: ["Bachelor's + deep systems experience"], certs: [],
          next: { title: "VP Design / Principal Designer", years: "+4–6 yrs", salary: "$230k–$400k+", skills: ["Company-Wide Design Vision","C-Suite Communication","Design ROI","Org Scaling"], education: ["Bachelor's Design; MBA for VP track"], certs: [], next: null }
        }
      }
    ]
  },

  "Data Scientist": {
    icon: "◐", color: "#C084FC", description: "Extract insights and build predictive models",
    paths: [
      {
        id: "ml-research", label: "ML / AI Research", title: "Senior Data Scientist", years: "2–4 yrs", salary: "$140k–$200k",
        skills: ["Machine Learning","Deep Learning","PyTorch","TensorFlow","Statistics","A/B Testing","Feature Engineering","Python","NLP","Computer Vision"],
        education: ["Master's or PhD in CS, Statistics, or Math strongly preferred"], certs: ["AWS ML Specialty","TensorFlow Developer","Databricks ML Professional"],
        next: {
          title: "Staff Data Scientist / Research Scientist", years: "+3–5 yrs", salary: "$200k–$300k",
          skills: ["Research Papers","Novel Architecture Design","Benchmarking","Large-Scale Experimentation","LLMs","Reinforcement Learning"],
          education: ["PhD in CS, ML, or Statistics preferred"], certs: [],
          next: { title: "Principal Scientist / Head of AI Research", years: "+4–7 yrs", salary: "$280k–$600k+", skills: ["Research Strategy","Team Building","AI Ethics","Governance","Executive Communication"], education: ["PhD + leadership experience"], certs: [], next: null }
        }
      },
      {
        id: "applied-ds", label: "Applied / Product DS", title: "Product Data Scientist", years: "1–3 yrs", salary: "$130k–$185k",
        skills: ["Experimentation","Causal Inference","SQL","Python","Mixpanel","Amplitude","Bayesian Statistics","Regression Modeling","Dashboard Design"],
        education: ["Bachelor's or Master's in Statistics, CS, or Economics"], certs: ["Google Data Analytics","Tableau Desktop Specialist"],
        next: {
          title: "Lead Data Scientist / Analytics Manager", years: "+3–5 yrs", salary: "$185k–$255k",
          skills: ["Data Science Strategy","Team Leadership","Executive Stakeholder Mgmt","Product Metrics Ownership","Roadmap Influence"],
          education: ["Master's preferred; MBA beneficial"], certs: [],
          next: { title: "Head of Data Science / VP Analytics", years: "+4–6 yrs", salary: "$240k–$400k+", skills: ["Data Strategy","Org Design","Board Reporting","Revenue Analytics"], education: ["MS/PhD + leadership"], certs: [], next: null }
        }
      },
      {
        id: "ds-to-pm", label: "DS → Product Manager", title: "Data-Driven Product Manager", years: "1–2 yrs", salary: "$125k–$175k",
        skills: ["Product Roadmapping","Experimentation","SQL","Stakeholder Management","User Research","Agile/Scrum","Go-To-Market","KPI Definition"],
        education: ["Bachelor's in CS or Statistics; MBA accelerates transition"], certs: ["CSPO","Google PM Certificate","Pragmatic Marketing"],
        next: {
          title: "Senior PM / Group PM", years: "+3–5 yrs", salary: "$170k–$245k",
          skills: ["P&L Ownership","Platform Thinking","GTM Leadership","OKR Strategy","Team Leadership"],
          education: ["MBA from top school strongly preferred"], certs: [],
          next: { title: "VP Product / CPO", years: "+4–7 yrs", salary: "$260k–$500k+", skills: ["Company Vision","Board Reporting","M&A Integration","Revenue Strategy"], education: ["MBA preferred"], certs: [], next: null }
        }
      }
    ]
  },

  "QA Engineer": {
    icon: "◑", color: "#FB923C", description: "Ensure quality and reliability across software",
    paths: [
      {
        id: "automation", label: "Test Automation", title: "Senior QA / SDET", years: "2–4 yrs", salary: "$105k–$155k",
        skills: ["Selenium","Playwright","Cypress","API Testing","Python/Java","CI/CD Integration","Test Strategy","BDD/TDD","Performance Testing","Postman"],
        education: ["Bachelor's in CS, Engineering, or IT"], certs: ["ISTQB Advanced","Selenium Certified","AWS Developer Associate"],
        next: {
          title: "Lead QA Engineer / QA Architect", years: "+3–5 yrs", salary: "$150k–$215k",
          skills: ["Test Architecture","Quality Strategy","Team Leadership","Shift-Left Testing","Contract Testing","Observability"],
          education: ["Bachelor's CS; Master's beneficial"], certs: ["ISTQB Expert","AWS DevOps Professional"],
          next: { title: "Director of Quality / VP Engineering", years: "+4–6 yrs", salary: "$200k–$340k+", skills: ["Quality Culture","Org Design","Engineering Strategy","Executive Reporting","FinOps"], education: ["BS/MS CS or MBA"], certs: [], next: null }
        }
      },
      {
        id: "qa-to-dev", label: "QA → Developer", title: "Software Developer (from QA)", years: "1–2 yrs", salary: "$110k–$160k",
        skills: ["Python or JavaScript","React or Node.js","SQL","Git","REST APIs","System Design basics","Code Review","Unit Testing"],
        education: ["Bachelor's in CS or bootcamp equivalent"], certs: ["AWS Developer Associate","freeCodeCamp","Meta Front-End Developer"],
        next: {
          title: "Mid / Senior Software Engineer", years: "+2–4 yrs", salary: "$140k–$200k",
          skills: ["System Design","TypeScript","AWS","Docker","Architecture Patterns","CI/CD","Mentorship"],
          education: ["Bachelor's CS; certifications valued"], certs: ["AWS Solutions Architect"],
          next: { title: "Staff Engineer / Engineering Manager", years: "+4–7 yrs", salary: "$200k–$380k+", skills: ["Technical Strategy","Org Design","RFC Writing","Team Leadership"], education: ["BS/MS CS"], certs: [], next: null }
        }
      },
      {
        id: "qa-to-pm", label: "QA → Product Manager", title: "Associate Product Manager (from QA)", years: "1–2 yrs", salary: "$100k–$145k",
        skills: ["User Story Writing","Acceptance Criteria","Stakeholder Management","Roadmapping","Agile/Scrum","Customer Discovery","JIRA","Data Analysis"],
        education: ["Bachelor's in any field; MBA accelerates"], certs: ["CSPO","PMI-ACP","Google PM Certificate"],
        next: {
          title: "Product Manager", years: "+2–3 yrs", salary: "$130k–$185k",
          skills: ["Product Strategy","Go-To-Market","OKR Design","Competitive Analysis","SQL","Executive Storytelling"],
          education: ["Bachelor's + MBA preferred"], certs: ["CPO Certification"],
          next: { title: "Senior PM / Director of Product", years: "+3–5 yrs", salary: "$185k–$300k", skills: ["P&L Ownership","Platform Thinking","Revenue Strategy","Org Leadership"], education: ["MBA from top school"], certs: [], next: null }
        }
      }
    ]
  },

  "Solutions Architect": {
    icon: "◧", color: "#2DD4BF", description: "Design enterprise solutions and win technical deals",
    paths: [
      {
        id: "enterprise-arch", label: "Enterprise Architecture", title: "Senior Solutions Architect", years: "2–4 yrs", salary: "$145k–$210k",
        skills: ["AWS/GCP/Azure","Microservices","API Design","Enterprise Integration","Security Architecture","Proposal Writing","Technical Presentations","Customer Discovery","POC Design"],
        education: ["Bachelor's in CS or Engineering"], certs: ["AWS Solutions Architect Pro","Google Cloud Architect","TOGAF"],
        next: {
          title: "Principal Architect / Distinguished Architect", years: "+3–5 yrs", salary: "$210k–$300k",
          skills: ["Enterprise Architecture Strategy","Thought Leadership","Conference Speaking","Partner Ecosystem","C-Suite Engagement"],
          education: ["Bachelor's CS; Master's beneficial"], certs: ["TOGAF","AWS Ambassador"],
          next: { title: "CTO / VP Architecture", years: "+4–7 yrs", salary: "$280k–$550k+", skills: ["Technology Vision","M&A Technical DD","Board Reporting","Org Design"], education: ["MS CS or MBA"], certs: [], next: null }
        }
      },
      {
        id: "sa-to-sales", label: "Technical Sales / SE", title: "Sales Engineer / Technical Account Manager", years: "1–3 yrs", salary: "$130k–$200k OTE",
        skills: ["Technical Demos","RFP Responses","Competitive Positioning","Deal Strategy","Relationship Management","Product Knowledge","Revenue Targets","Salesforce CRM"],
        education: ["Bachelor's in CS, Engineering, or Business"], certs: ["AWS Solutions Architect","Salesforce Sales Cloud","MEDDIC"],
        next: {
          title: "Senior SE / Sales Engineering Manager", years: "+3–5 yrs", salary: "$200k–$320k OTE",
          skills: ["Team Leadership","Sales Strategy","Territory Planning","Partner Engineering","Executive Selling"],
          education: ["Bachelor's + MBA beneficial"], certs: [],
          next: { title: "VP Sales Engineering / CRO", years: "+4–7 yrs", salary: "$300k–$600k+ OTE", skills: ["Revenue Strategy","GTM Alignment","Board Reporting","Org Design","M&A Integration"], education: ["MBA preferred"], certs: [], next: null }
        }
      },
      {
        id: "sa-to-product", label: "SA → Product Manager", title: "Technical Product Manager", years: "1–2 yrs", salary: "$130k–$180k",
        skills: ["Product Roadmapping","API Design","Customer Needs Analysis","Agile/Scrum","Competitive Analysis","Go-To-Market","Stakeholder Management","SQL"],
        education: ["Bachelor's in CS or Engineering; MBA accelerates"], certs: ["CSPO","Google PM Certificate","AWS Cloud Practitioner"],
        next: {
          title: "Senior PM / Platform PM", years: "+2–4 yrs", salary: "$175k–$250k",
          skills: ["Platform Strategy","P&L Ownership","Developer Advocacy","OKR Design","Executive Storytelling"],
          education: ["Bachelor's + MBA strongly preferred"], certs: ["CPO Certification"],
          next: { title: "VP Product / CPO", years: "+4–7 yrs", salary: "$260k–$500k+", skills: ["Company Vision","Board Reporting","M&A","Revenue Strategy"], education: ["MBA preferred"], certs: [], next: null }
        }
      }
    ]
  },

  "Cybersecurity Analyst": {
    icon: "◫", color: "#F87171", description: "Protect systems, data, and organisations from threats",
    paths: [
      {
        id: "secops-path", label: "Security Operations", title: "Senior Security Analyst / SOC Lead", years: "2–4 yrs", salary: "$100k–$150k",
        skills: ["SIEM (Splunk/Sentinel)","Threat Intelligence","Incident Response","Malware Analysis","Vulnerability Management","Network Security","Forensics","Cloud Security"],
        education: ["Bachelor's in Cybersecurity, CS, or IT"], certs: ["CISSP","CompTIA Security+","CEH","GCIH"],
        next: {
          title: "Security Manager / Threat Intelligence Lead", years: "+3–5 yrs", salary: "$145k–$210k",
          skills: ["Team Leadership","Security Program Management","Risk Management","Executive Reporting","Vendor Management","Red Team Coordination"],
          education: ["Bachelor's + CISSP; MBA beneficial"], certs: ["CISM","CISSP","PMP"],
          next: { title: "CISO / VP of Security", years: "+4–8 yrs", salary: "$230k–$500k+", skills: ["Security Strategy","Board Communication","Regulatory Compliance","M&A Security","Org Design"], education: ["MBA or equivalent executive experience"], certs: [], next: null }
        }
      },
      {
        id: "appsec", label: "Application Security", title: "Application Security Engineer", years: "2–4 yrs", salary: "$120k–$175k",
        skills: ["SAST/DAST Tools","Secure Code Review","Penetration Testing","OWASP","DevSecOps","Threat Modeling","API Security","Cloud Security Posture"],
        education: ["Bachelor's in CS or Cybersecurity"], certs: ["OSCP","CEH","GWEB","AWS Security Specialty"],
        next: {
          title: "Principal AppSec Engineer / Security Architect", years: "+3–5 yrs", salary: "$175k–$255k",
          skills: ["Security Architecture","Zero Trust Design","PKI","Policy Frameworks","Engineering Influence","Compliance Programs"],
          education: ["Bachelor's CS/Security; OSCP/CISSP expected"], certs: ["CISSP","SABSA","OSEP"],
          next: { title: "Head of AppSec / CISO", years: "+4–6 yrs", salary: "$240k–$480k+", skills: ["Security Program Leadership","Board Reporting","Org Building","Culture of Security"], education: ["MBA or extensive security leadership"], certs: [], next: null }
        }
      },
      {
        id: "grc", label: "GRC / Compliance", title: "GRC Analyst / Compliance Manager", years: "1–3 yrs", salary: "$90k–$135k",
        skills: ["ISO 27001","SOC 2","GDPR","Risk Assessment","Policy Writing","Audit Management","Vendor Risk","NIST Framework","Business Continuity"],
        education: ["Bachelor's in CS, Business, or Law"], certs: ["CISA","CISM","ISO 27001 Lead Auditor","CRISC"],
        next: {
          title: "Senior GRC Manager / Risk Director", years: "+3–5 yrs", salary: "$135k–$195k",
          skills: ["Enterprise Risk Management","Board-Level Reporting","Third-Party Risk","Privacy Law","Programme Leadership"],
          education: ["Bachelor's + MBA or Law degree beneficial"], certs: ["CISM","CRISC","CGEIT"],
          next: { title: "CISO / Chief Risk Officer", years: "+4–7 yrs", salary: "$220k–$450k+", skills: ["Risk Strategy","Board Communication","Regulatory Affairs","M&A Risk","Org Leadership"], education: ["MBA + deep security/risk expertise"], certs: [], next: null }
        }
      }
    ]
  }
};

const ROLES = Object.keys(CAREER_DATA);

// ─── Utilities ────────────────────────────────────────────────────────────────
function flattenPath(p, d = 0) { const r = [{ ...p, depth: d }]; if (p.next) r.push(...flattenPath(p.next, d + 1)); return r; }
function norm(s) { return s.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim(); }
function skillMatch(a, b) {
  const na = norm(a), nb = norm(b);
  return na === nb || na.includes(nb) || nb.includes(na) ||
    (na.length > 4 && nb.length > 4 && (na.startsWith(nb.slice(0, 5)) || nb.startsWith(na.slice(0, 5))));
}
function computeGap(skills, path) {
  const nodes = flattenPath(path);
  const all = [...new Set(nodes.flatMap(n => n.skills))];
  const have = all.filter(s => skills.some(r => skillMatch(r, s)));
  const missing = all.filter(s => !skills.some(r => skillMatch(r, s)));
  return { have, missing, pct: Math.round((have.length / all.length) * 100) };
}

// ─── Background course search ─────────────────────────────────────────────────
const courseCache = {};
async function fetchCoursesForSkill(skillName, targetRole) {
  const key = `${skillName}::${targetRole}`;
  if (courseCache[key]) return courseCache[key];
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514", max_tokens: 900,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: `Find the best 3 real learning resources for "${skillName}" for someone targeting "${targetRole}". Return ONLY valid JSON:\n{"skill":"${skillName}","summary":"why this matters","courses":[{"title":"...","provider":"...","url":"real url","cost":"Free or $X","duration":"X hours/weeks","level":"Beginner/Intermediate/Advanced","rating":"X/5 or omit","why":"one sentence"}],"timeToCompetency":"X weeks","totalCostRange":"Free–$X","quickTip":"one actionable tip"}` }]
    })
  });
  const data = await res.json();
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("").replace(/```json|```/g, "").trim();
  try {
    const parsed = JSON.parse(text);
    courseCache[key] = parsed;
    return parsed;
  } catch {
    const fb = { skill: skillName, summary: `${skillName} is key for ${targetRole}.`, courses: [{ title: `Search: ${skillName} for ${targetRole}`, provider: "Google", url: `https://www.google.com/search?q=${encodeURIComponent(skillName + " course " + targetRole)}`, cost: "Varies", duration: "Varies", level: "Beginner", why: "Search for current top-rated courses." }], timeToCompetency: "2–6 weeks", totalCostRange: "Free–$50", quickTip: "Start with a free intro to assess your baseline." };
    courseCache[key] = fb;
    return fb;
  }
}

// ─── PDF Report Generator ─────────────────────────────────────────────────────
function generateReport(resumeData, role, gaps) {
  const rd = CAREER_DATA[role];
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Career Gap Report — ${resumeData.currentRole || role}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #1a1a2e; font-size: 13px; line-height: 1.6; }
  .cover { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 60px 48px; min-height: 220px; }
  .cover-tag { font-size: 10px; letter-spacing: .2em; color: #64748b; text-transform: uppercase; margin-bottom: 12px; }
  .cover-title { font-size: 32px; font-weight: 800; margin-bottom: 8px; letter-spacing: -.5px; }
  .cover-sub { font-size: 16px; color: #94a3b8; margin-bottom: 24px; }
  .cover-meta { display: flex; gap: 24px; flex-wrap: wrap; }
  .cover-chip { background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.15); border-radius: 6px; padding: 8px 16px; font-size: 12px; }
  .cover-chip span { display: block; font-size: 10px; color: #64748b; margin-bottom: 2px; letter-spacing: .08em; }
  .section { padding: 32px 48px; border-bottom: 1px solid #f1f5f9; }
  .section-title { font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: #64748b; margin-bottom: 16px; font-weight: 600; }
  .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; }
  .skill-have { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 20px; font-size: 11px; color: #065f46; }
  .skill-miss { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 20px; font-size: 11px; color: #991b1b; }
  .path-block { margin-bottom: 28px; page-break-inside: avoid; }
  .path-header { background: #f8fafc; border-left: 4px solid #5BE8B4; padding: 12px 16px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; border-radius: 0 6px 6px 0; }
  .path-name { font-weight: 700; font-size: 15px; }
  .path-score { font-size: 22px; font-weight: 800; }
  .path-score.high { color: #059669; }
  .path-score.mid { color: #d97706; }
  .path-score.low { color: #dc2626; }
  .path-meta { font-size: 11px; color: #64748b; margin-top: 2px; }
  .bar-wrap { height: 6px; background: #f1f5f9; border-radius: 3px; margin: 8px 0 12px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 3px; }
  .action-item { display: flex; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f8fafc; }
  .action-num { width: 22px; height: 22px; border-radius: 50%; background: #0f172a; color: white; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .action-text { flex: 1; }
  .action-skill { font-weight: 600; font-size: 12px; }
  .action-detail { font-size: 11px; color: #64748b; }
  .cert-item { padding: 6px 0; border-bottom: 1px solid #f8fafc; display: flex; align-items: center; gap: 8px; font-size: 12px; }
  .summary-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px 20px; margin-top: 16px; }
  .edu-item { padding: 6px 0; font-size: 12px; color: #4c1d95; display: flex; gap: 8px; }
  .footer { padding: 20px 48px; background: #f8fafc; text-align: center; font-size: 11px; color: #94a3b8; }
  @media print { .section { page-break-inside: avoid; } }
</style>
</head>
<body>

<div class="cover">
  <div class="cover-tag">Career Gap Analysis Report</div>
  <div class="cover-title">${resumeData.currentRole || role}</div>
  <div class="cover-sub">${resumeData.summary || "Tech career transition plan"}</div>
  <div class="cover-meta">
    <div class="cover-chip"><span>CURRENT ROLE</span>${resumeData.currentRole || role}</div>
    <div class="cover-chip"><span>EXPERIENCE</span>${resumeData.yearsExp || "—"}</div>
    <div class="cover-chip"><span>SKILLS DETECTED</span>${resumeData.skills?.length || 0}</div>
    <div class="cover-chip"><span>REPORT DATE</span>${date}</div>
  </div>
</div>

<div class="section">
  <div class="section-title">Your Detected Skills</div>
  <div class="skills-grid">
    ${(resumeData.skills || []).map(s => `<span class="skill-have">✓ ${s}</span>`).join("")}
  </div>
  ${(resumeData.education || []).length > 0 ? `
  <div style="margin-top:16px">
    <div class="section-title" style="margin-bottom:8px">Education</div>
    ${(resumeData.education || []).map(e => `<div class="edu-item">🎓 ${e}</div>`).join("")}
  </div>` : ""}
</div>

<div class="section">
  <div class="section-title">Path Readiness Overview</div>
  ${gaps.map(g => {
    const pct = g.pct;
    const scoreClass = pct >= 70 ? "high" : pct >= 40 ? "mid" : "low";
    const barColor = pct >= 70 ? "#059669" : pct >= 40 ? "#d97706" : "#dc2626";
    return `
    <div class="path-block">
      <div class="path-header">
        <div>
          <div class="path-name">${g.label}</div>
          <div class="path-meta">${g.title} · ${g.salary || ""} · ${g.years || ""}</div>
        </div>
        <div class="path-score ${scoreClass}">${pct}%</div>
      </div>
      <div class="bar-wrap"><div class="bar-fill" style="width:${pct}%;background:${barColor}"></div></div>
      <div style="display:flex;gap:16px;font-size:11px;color:#64748b">
        <span>✓ ${g.have.length} skills matched</span>
        <span>✗ ${g.missing.length} skills to develop</span>
      </div>
    </div>`;
  }).join("")}
</div>

${gaps.map(g => g.missing.length > 0 ? `
<div class="section">
  <div class="section-title">Action Plan — ${g.label}</div>
  <div style="font-size:12px;color:#64748b;margin-bottom:12px">Target role: <strong>${g.title}</strong> · ${g.salary || ""}</div>
  ${g.missing.slice(0, 10).map((s, i) => `
  <div class="action-item">
    <div class="action-num">${i + 1}</div>
    <div class="action-text">
      <div class="action-skill">${s}</div>
      <div class="action-detail">Search for "${s} course for ${g.title}" on Coursera, Udemy, or LinkedIn Learning</div>
    </div>
  </div>`).join("")}
  ${g.certs && g.certs.length > 0 ? `
  <div style="margin-top:16px">
    <div class="section-title" style="margin-bottom:8px">Recommended Certifications</div>
    ${g.certs.map(c => `<div class="cert-item">🏅 ${c}</div>`).join("")}
  </div>` : ""}
</div>` : "").join("")}

<div class="section">
  <div class="summary-box">
    <div style="font-weight:700;margin-bottom:6px">💡 Next Steps</div>
    <div style="font-size:12px;color:#78350f;line-height:1.7">
      1. Start with your highest readiness path and close the top 3 skill gaps first.<br/>
      2. Enrol in one certification within the next 30 days.<br/>
      3. Update your LinkedIn profile to reflect your target role title.<br/>
      4. Use the AI Coach in the Career Path Planner for a personalised week-by-week plan.
    </div>
  </div>
</div>

<div class="footer">
  Generated by Career Path Planner · ${date} · careerpath.ai
</div>

</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `CareerGapReport_${(resumeData.currentRole || role).replace(/\s+/g, "_")}_${date.replace(/\s|,/g, "_")}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
@keyframes slideDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
.fade-up{animation:fadeUp .4s ease both;}
.slide-down{animation:slideDown .25s ease both;}
.shimmer-b{background:linear-gradient(90deg,#1a2535 25%,#243047 50%,#1a2535 75%);background-size:600px 100%;animation:shimmer 1.6s infinite;border-radius:5px;}
.spinner{width:14px;height:14px;border:2px solid rgba(255,255,255,.1);border-top-color:#E8C547;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;flex-shrink:0;}
.upload-zone{border:2px dashed rgba(255,255,255,.1);border-radius:12px;padding:22px 16px;text-align:center;cursor:pointer;transition:all .3s;background:rgba(255,255,255,.02);}
.upload-zone:hover,.upload-zone.drag{border-color:rgba(255,255,255,.28);background:rgba(255,255,255,.05);}
.pill{display:inline-flex;align-items:center;gap:3px;padding:3px 10px;border-radius:20px;font-size:10.5px;font-family:'DM Mono',monospace;margin:2px;line-height:1.4;}
.ph{background:rgba(91,232,180,.1);border:1px solid rgba(91,232,180,.28);color:#5BE8B4;}
.pm{background:rgba(248,113,113,.09);border:1px solid rgba(248,113,113,.22);color:#F87171;}
.pn{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#CBD5E1;}
.tab{padding:6px 13px;border-radius:7px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.1em;cursor:pointer;transition:all .2s;color:#475569;background:transparent;border:1px solid transparent;}
.tab.on{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.12);color:#f1f5f9;}
.tab:hover:not(.on){color:#94a3b8;}
.card{border-radius:10px;cursor:pointer;transition:background .2s,border-color .2s,box-shadow .2s;}
.card:hover{background:rgba(255,255,255,.06)!important;}
.prog-track{height:5px;border-radius:3px;background:rgba(255,255,255,.06);overflow:hidden;margin-top:3px;}
.prog-fill{height:100%;border-radius:3px;transition:width 1.1s cubic-bezier(.16,1,.3,1);}
.sh{font-size:9px;letter-spacing:.16em;color:#475569;font-family:'DM Mono',monospace;margin-bottom:7px;text-transform:uppercase;}
.badge{display:inline-flex;align-items:center;padding:3px 8px;border-radius:4px;font-size:10px;font-family:'DM Mono',monospace;margin:2px;}
.bc{background:rgba(232,197,71,.1);border:1px solid rgba(232,197,71,.25);color:#E8C547;}
.be{background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.25);color:#A78BFA;}
.role-btn{padding:7px 12px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:11px;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:5px;border:1px solid;}
.chat-input{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:9px;padding:10px 13px;color:#f1f5f9;font-family:'DM Sans',sans-serif;font-size:13px;outline:none;transition:border-color .2s;resize:none;}
.chat-input:focus{border-color:rgba(255,255,255,.26);}
.chat-send{padding:10px 15px;background:#E8C547;border:none;border-radius:8px;color:#0a0f1a;font-family:'DM Mono',monospace;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s;flex-shrink:0;}
.chat-send:hover{background:#f0d060;}
.chat-send:disabled{background:rgba(255,255,255,.08);color:#334155;cursor:not-allowed;}
.li-input{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:7px;padding:8px 11px;color:#f1f5f9;font-family:'DM Mono',monospace;font-size:11px;outline:none;transition:border-color .2s;}
.li-input:focus{border-color:rgba(255,255,255,.22);}
.course-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:9px;padding:11px 13px;margin-bottom:7px;transition:border-color .2s;}
.course-card:hover{border-color:rgba(255,255,255,.18);}
.course-link{color:#5BE8B4;text-decoration:none;font-size:13px;font-weight:600;line-height:1.35;display:block;margin-bottom:5px;}
.course-link:hover{text-decoration:underline;}
.course-meta{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:5px;}
.meta-chip{padding:2px 8px;border-radius:20px;font-size:10px;font-family:'DM Mono',monospace;}
.chip-free{background:rgba(91,232,180,.12);border:1px solid rgba(91,232,180,.25);color:#5BE8B4;}
.chip-paid{background:rgba(232,197,71,.12);border:1px solid rgba(232,197,71,.25);color:#E8C547;}
.chip-time{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#94A3B8;}
.chip-level{background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.22);color:#A78BFA;}
.chip-rating{background:rgba(251,146,60,.1);border:1px solid rgba(251,146,60,.22);color:#FB923C;}
.skill-search-panel{margin-top:10px;border-top:1px solid rgba(255,255,255,.07);padding-top:10px;}
.search-loading{display:flex;align-items:center;gap:8px;padding:8px 0;font-size:11px;color:#64748B;font-family:'DM Mono',monospace;}
.search-dot{width:5px;height:5px;border-radius:50%;background:#E8C547;animation:pulse 1.2s ease infinite;}
.summary-box{padding:10px 14px;background:rgba(91,232,180,.06);border:1px solid rgba(91,232,180,.18);border-radius:8px;margin-bottom:10px;}
.tip-box{padding:10px 14px;background:rgba(232,197,71,.06);border:1px solid rgba(232,197,71,.18);border-radius:8px;margin-top:8px;}
.report-btn{display:flex;align-items:center;gap:7px;padding:10px 16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:9px;color:#F1F5F9;font-family:'DM Mono',monospace;font-size:11px;cursor:pointer;transition:all .2s;letter-spacing:.06em;}
.report-btn:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.22);}
`;

// ─── Sub-components ───────────────────────────────────────────────────────────
function ProgressBar({ pct }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 100); return () => clearTimeout(t); }, [pct]);
  const c = pct >= 70 ? "#5BE8B4" : pct >= 40 ? "#E8C547" : "#F87171";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span className="sh" style={{ marginBottom: 0 }}>SKILL MATCH</span>
        <span style={{ fontSize: 12, fontFamily: "'DM Mono',monospace", color: c, fontWeight: 600 }}>{pct}%</span>
      </div>
      <div className="prog-track"><div className="prog-fill" style={{ width: `${w}%`, background: `linear-gradient(90deg,${c}66,${c})` }} /></div>
    </div>
  );
}

function CourseCard({ course }) {
  const isFree = course.cost?.toLowerCase().includes("free");
  return (
    <div className="course-card">
      <a className="course-link" href={course.url} target="_blank" rel="noopener noreferrer">{course.title}</a>
      <div className="course-meta">
        <span className="meta-chip chip-time">⏱ {course.duration}</span>
        <span className={`meta-chip ${isFree ? "chip-free" : "chip-paid"}`}>{isFree ? "🆓 Free" : `💳 ${course.cost}`}</span>
        <span className="meta-chip chip-level">{course.level}</span>
        {course.rating && <span className="meta-chip chip-rating">★ {course.rating}</span>}
        <span className="meta-chip chip-time" style={{ color: "#475569" }}>{course.provider}</span>
      </div>
      {course.why && <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.5 }}>{course.why}</div>}
    </div>
  );
}

function SkillSearchPanel({ skillName, targetRole }) {
  const [state, setState] = useState("loading");
  const [result, setResult] = useState(null);
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return; fired.current = true;
    fetchCoursesForSkill(skillName, targetRole).then(d => { setResult(d); setState("done"); }).catch(() => setState("error"));
  }, []);
  if (state === "loading") return (
    <div className="skill-search-panel">
      <div className="search-loading"><div style={{ display: "flex", gap: 4 }}>{[0,1,2].map(i => <div key={i} className="search-dot" style={{ animationDelay: `${i*.25}s` }} />)}</div>Searching for {skillName} courses…</div>
      <div style={{ display: "flex", gap: 5 }}>{[160,120,140].map((w,i) => <div key={i} className="shimmer-b" style={{ width: w, height: 54, animationDelay: `${i*.18}s` }} />)}</div>
    </div>
  );
  if (state === "error") return <div className="skill-search-panel"><div style={{ fontSize: 11, color: "#F87171", fontFamily: "'DM Mono',monospace" }}>⚠ Could not load courses — try refreshing</div></div>;
  if (!result) return null;
  return (
    <div className="skill-search-panel slide-down">
      {result.summary && <div className="summary-box"><div className="sh" style={{ color: "#5BE8B4", marginBottom: 3 }}>WHY THIS SKILL MATTERS</div><div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.55 }}>{result.summary}</div></div>}
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 1, padding: "9px 12px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 8 }}>
          <div className="sh" style={{ marginBottom: 2 }}>TIME TO COMPETENCY</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#E8C547", fontFamily: "'DM Mono',monospace" }}>{result.timeToCompetency || "2–6 weeks"}</div>
        </div>
        <div style={{ flex: 1, padding: "9px 12px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 8 }}>
          <div className="sh" style={{ marginBottom: 2 }}>TOTAL COST RANGE</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#5BE8B4", fontFamily: "'DM Mono',monospace" }}>{result.totalCostRange || "Free–$50"}</div>
        </div>
      </div>
      <div className="sh">RECOMMENDED COURSES</div>
      {(result.courses || []).map((c, i) => <CourseCard key={i} course={c} />)}
      {result.quickTip && <div className="tip-box"><div className="sh" style={{ color: "#E8C547", marginBottom: 3 }}>💡 PRO TIP</div><div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.55 }}>{result.quickTip}</div></div>}
    </div>
  );
}

function GapSkillItem({ skill, targetRole }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ marginBottom: 7 }}>
      <div onClick={() => setExpanded(e => !e)} style={{ padding: "9px 13px", background: expanded ? "rgba(248,113,113,.1)" : "rgba(248,113,113,.05)", border: expanded ? "1px solid rgba(248,113,113,.3)" : "1px solid rgba(248,113,113,.15)", borderRadius: expanded ? "9px 9px 0 0" : 9, cursor: "pointer", transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#F87171" }}>✗</span>
          <span style={{ fontSize: 13, color: "#F1F5F9", fontWeight: 600 }}>{skill}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {!expanded && <span style={{ fontSize: 10, color: "#475569", fontFamily: "'DM Mono',monospace" }}>tap for courses →</span>}
          <span style={{ fontSize: 11, color: "#64748B", display: "inline-block", transform: expanded ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▾</span>
        </div>
      </div>
      {expanded && (
        <div style={{ padding: "11px 13px", background: "rgba(248,113,113,.04)", border: "1px solid rgba(248,113,113,.15)", borderTop: "none", borderRadius: "0 0 9px 9px" }}>
          <SkillSearchPanel skillName={skill} targetRole={targetRole} />
        </div>
      )}
    </div>
  );
}

function LinkedInImport({ onResult, accent }) {
  const [url, setUrl] = useState(""); const [phase, setPhase] = useState("idle"); const [msg, setMsg] = useState("");
  const go = async () => {
    if (!url.trim()) return; setPhase("loading"); setMsg("Analysing…");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 900, messages: [{ role: "user", content: `LinkedIn URL: ${url}. Extract likely skills from URL role keywords. Return ONLY valid JSON:\n{"currentRole":"...","yearsExp":"estimate","education":["..."],"skills":["..."],"summary":"one sentence"}` }] }) });
      const data = await res.json();
      const parsed = JSON.parse((data.content||[]).map(b=>b.text||"").join("").replace(/```json|```/g,"").trim());
      setPhase("done"); setMsg("Imported — paste your Skills section for a full scan");
      onResult({ ...parsed, source: "linkedin" });
    } catch { setPhase("error"); setMsg("Import failed. Upload resume instead."); }
  };
  return (
    <div style={{ marginBottom: 10 }}>
      <div className="sh">LINKEDIN PROFILE URL</div>
      <div style={{ display: "flex", gap: 6 }}>
        <input className="li-input" placeholder="linkedin.com/in/yourname" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && go()} />
        <button onClick={go} disabled={phase==="loading"||!url.trim()} style={{ padding: "8px 11px", background: url.trim()?`${accent}22`:"transparent", border: `1px solid ${url.trim()?accent+"55":"rgba(255,255,255,.08)"}`, borderRadius: 7, color: url.trim()?accent:"#475569", fontFamily: "'DM Mono',monospace", fontSize: 10, cursor: url.trim()?"pointer":"not-allowed" }}>
          {phase==="loading"?<span className="spinner" style={{borderTopColor:accent}}/>:"IMPORT"}
        </button>
      </div>
      {msg && <div style={{ fontSize: 10, color: phase==="error"?"#F87171":"#64748B", fontFamily: "'DM Mono',monospace", marginTop: 4 }}>{msg}</div>}
    </div>
  );
}

function UploadZone({ onResult, accent, mammothReady }) {
  const [phase,setPhase]=useState("idle"); const [msg,setMsg]=useState(""); const [drag,setDrag]=useState(false); const ref=useRef();
  const process = useCallback(async (file) => {
    if (!file) return; setPhase("loading"); setMsg("");
    try {
      let text="";
      if (file.name.match(/\.docx?$/i)) {
        if (!mammothReady||!window.mammoth) throw new Error("DOCX parser loading — try again.");
        setMsg("Extracting Word document…");
        const ab=await file.arrayBuffer(); const result=await window.mammoth.extractRawText({arrayBuffer:ab}); text=result.value;
        if (!text||text.trim().length<40) throw new Error("Could not extract text from this DOCX.");
      } else if (file.name.match(/\.pdf$/i)) {
        setMsg("Reading PDF…");
        const b64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(file);});
        const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,messages:[{role:"user",content:[{type:"document",source:{type:"base64",media_type:"application/pdf",data:b64}},{type:"text",text:`Extract ALL skills, education, current role, years of exp. Return ONLY valid JSON:\n{"currentRole":"...","yearsExp":"...","education":["..."],"skills":["..."],"summary":"one sentence"}`}]}]})});
        const data=await res.json(); const parsed=JSON.parse((data.content||[]).map(b=>b.text||"").join("").replace(/```json|```/g,"").trim());
        setPhase("done"); setMsg(`${parsed.skills?.length||0} skills · ${parsed.education?.length||0} education entries`);
        onResult({...parsed,fileName:file.name}); return;
      } else {
        setMsg("Reading file…"); text=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsText(file);});
      }
      setMsg("Analysing with AI…");
      const res2=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,messages:[{role:"user",content:`Extract ALL skills, education, current role, years of exp. Return ONLY valid JSON:\n{"currentRole":"...","yearsExp":"...","education":["..."],"skills":["..."],"summary":"one sentence"}\n\nResume:\n${text.slice(0,9000)}`}]})});
      const data2=await res2.json(); const parsed2=JSON.parse((data2.content||[]).map(b=>b.text||"").join("").replace(/```json|```/g,"").trim());
      setPhase("done"); setMsg(`${parsed2.skills?.length||0} skills · ${parsed2.education?.length||0} entries`);
      onResult({...parsed2,fileName:file.name});
    } catch(e) { setPhase("error"); setMsg(e.message||"Could not parse. Try PDF, DOCX, or TXT."); }
  },[onResult,mammothReady]);
  return (
    <div className={`upload-zone${drag?" drag":""}`} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);process(e.dataTransfer.files[0]);}} onClick={()=>phase!=="loading"&&ref.current?.click()}>
      <input ref={ref} type="file" accept=".pdf,.txt,.doc,.docx" style={{display:"none"}} onChange={e=>e.target.files[0]&&process(e.target.files[0])}/>
      {phase==="idle"&&<><div style={{fontSize:22,marginBottom:7,opacity:.3}}>⬆</div><div style={{fontSize:12,color:"#94A3B8",marginBottom:3}}>Drop resume or <span style={{color:accent,textDecoration:"underline"}}>browse</span></div><div style={{fontSize:10,color:"#475569",fontFamily:"'DM Mono',monospace",letterSpacing:".1em"}}>PDF · DOCX · DOC · TXT</div></>}
      {phase==="loading"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:7}}><div className="spinner" style={{borderTopColor:accent}}/><div style={{fontSize:11,color:"#94A3B8",fontFamily:"'DM Mono',monospace"}}>{msg||"Processing…"}</div><div style={{display:"flex",gap:4}}>{[65,48,75,55].map((w,i)=><div key={i} className="shimmer-b" style={{width:w,height:13,animationDelay:`${i*.14}s`}}/>)}</div></div>}
      {phase==="done"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:"#5BE8B4",fontSize:15}}>✓</span><span style={{fontSize:11,color:"#94A3B8",fontFamily:"'DM Mono',monospace"}}>{msg}</span></div><button onClick={e=>{e.stopPropagation();setPhase("idle");onResult(null);}} style={{fontSize:10,color:"#475569",background:"none",border:"1px solid rgba(255,255,255,.1)",borderRadius:4,padding:"2px 9px",cursor:"pointer",fontFamily:"'DM Mono',monospace",marginTop:2}}>remove</button></div>}
      {phase==="error"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><span style={{color:"#F87171"}}>⚠</span><div style={{color:"#F87171",fontSize:11,fontFamily:"'DM Mono',monospace",textAlign:"center"}}>{msg}</div><button onClick={e=>{e.stopPropagation();setPhase("idle");}} style={{fontSize:10,color:"#94A3B8",background:"none",border:"1px solid rgba(255,255,255,.1)",borderRadius:4,padding:"2px 9px",cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>retry</button></div>}
    </div>
  );
}

function CoachingChat({ resumeData, currentRole, accent }) {
  const rd = CAREER_DATA[currentRole];
  const [messages,setMessages]=useState([{role:"assistant",text:`Hi! I'm your AI career coach. ${resumeData?`I can see you're a ${resumeData.currentRole||currentRole} with ${resumeData.yearsExp||"some"} experience.`:`You're exploring ${currentRole} career paths.`} Ask me anything — which path fits you best, how to close a skill gap, which cert to get first, or how to make the jump to your next level.`}]);
  const [input,setInput]=useState(""); const [loading,setLoading]=useState(false); const bottomRef=useRef();
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);
  const send=async()=>{
    const q=input.trim(); if(!q||loading) return;
    setMessages(m=>[...m,{role:"user",text:q}]); setInput(""); setLoading(true);
    try {
      const ctx=resumeData?`User: ${resumeData.currentRole||currentRole}, ${resumeData.yearsExp||"unknown"} exp. Skills: ${(resumeData.skills||[]).slice(0,25).join(", ")}. Education: ${(resumeData.education||[]).join(", ")}.`:`User exploring ${currentRole}.`;
      const paths=rd.paths.map(p=>`${p.label}: ${p.title} → ${p.next?.title||""}`).join("; ");
      const history=messages.slice(-6).map(m=>({role:m.role==="user"?"user":"assistant",content:m.text}));
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,system:`Expert career coach for tech professionals. ${ctx} Paths for ${currentRole}: ${paths}. Be specific and actionable. Under 120 words unless a plan is requested.`,messages:[...history,{role:"user",content:q}]})});
      const data=await res.json();
      setMessages(m=>[...m,{role:"assistant",text:(data.content||[]).map(b=>b.text||"").join("").trim()}]);
    } catch { setMessages(m=>[...m,{role:"assistant",text:"Sorry, something went wrong. Try again."}]); }
    setLoading(false);
  };
  const chips=["Which path fits me best?","How do I close my skill gaps?","What cert first?","How long to reach Director?"];
  return (
    <div style={{display:"flex",flexDirection:"column",minHeight:480}}>
      <div style={{flex:1,overflowY:"auto",paddingRight:3,marginBottom:10,display:"flex",flexDirection:"column",gap:9}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            {m.role==="assistant"&&<div style={{width:26,height:26,borderRadius:"50%",background:`${accent}22`,border:`1px solid ${accent}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0,marginRight:7,marginTop:2}}>{rd.icon}</div>}
            <div style={{maxWidth:"80%",padding:"9px 13px",borderRadius:m.role==="user"?"11px 11px 2px 11px":"11px 11px 11px 2px",background:m.role==="user"?"rgba(255,255,255,.08)":"rgba(255,255,255,.04)",border:m.role==="user"?"1px solid rgba(255,255,255,.1)":`1px solid ${accent}22`,fontSize:13,color:"#E2E8F0",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{m.text}</div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:26,height:26,borderRadius:"50%",background:`${accent}22`,border:`1px solid ${accent}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>{rd.icon}</div><div style={{padding:"9px 13px",background:"rgba(255,255,255,.04)",borderRadius:"11px 11px 11px 2px",border:`1px solid ${accent}22`,display:"flex",gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:accent,opacity:.5,animation:`pulse .9s ${i*.18}s ease infinite`}}/>)}</div></div>}
        <div ref={bottomRef}/>
      </div>
      {messages.length<=2&&<div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:9}}>{chips.map(s=><button key={s} onClick={()=>setInput(s)} style={{padding:"4px 10px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:20,color:"#64748B",fontFamily:"'DM Mono',monospace",fontSize:10,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.color="#94A3B8"} onMouseLeave={e=>e.currentTarget.style.color="#64748B"}>{s}</button>)}</div>}
      <div style={{display:"flex",gap:7,alignItems:"flex-end"}}>
        <textarea className="chat-input" rows={2} placeholder="Ask your career coach anything…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}/>
        <button className="chat-send" onClick={send} disabled={loading||!input.trim()}>SEND →</button>
      </div>
    </div>
  );
}

function NodeCard({ node, color, isLast, resumeData, animDelay }) {
  const [open,setOpen]=useState(false); const [vis,setVis]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setVis(true),animDelay);return()=>clearTimeout(t);},[animDelay]);
  const depthLabel=["NEXT STEP","MID-CAREER","SENIOR LEVEL","LEADERSHIP"][node.depth]||"LEADERSHIP";
  const have=resumeData?node.skills.filter(s=>resumeData.skills.some(r=>skillMatch(r,s))):[];
  const miss=resumeData?node.skills.filter(s=>!resumeData.skills.some(r=>skillMatch(r,s))):[];
  const pct=resumeData?Math.round((have.length/node.skills.length)*100):null;
  return (
    <div style={{opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(15px)",transition:"opacity .5s,transform .5s",display:"flex",alignItems:"flex-start"}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginRight:12,paddingTop:18}}>
        <div style={{width:9,height:9,borderRadius:"50%",background:color,boxShadow:`0 0 8px ${color}88`,flexShrink:0}}/>
        {!isLast&&<div style={{width:1,flex:1,minHeight:32,background:`linear-gradient(to bottom,${color}66,transparent)`,marginTop:3}}/>}
      </div>
      <div className="card" onClick={()=>setOpen(o=>!o)} style={{flex:1,marginBottom:isLast?0:9,padding:"13px 15px",background:open?"rgba(255,255,255,.08)":"rgba(255,255,255,.03)",border:open?`1px solid ${color}55`:"1px solid rgba(255,255,255,.07)",boxShadow:open?`0 0 18px ${color}16`:"none"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{flex:1,minWidth:0,marginRight:10}}>
            <div style={{fontSize:9,letterSpacing:".14em",color,fontFamily:"'DM Mono',monospace",marginBottom:3}}>{depthLabel}</div>
            <div style={{fontSize:14,fontWeight:700,color:"#F1F5F9",fontFamily:"'Playfair Display',serif",letterSpacing:"-.01em",lineHeight:1.25}}>{node.title}</div>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:12,fontWeight:700,color,fontFamily:"'DM Mono',monospace"}}>{node.salary}</div>
            <div style={{fontSize:10,color:"#64748B",fontFamily:"'DM Mono',monospace",marginTop:1}}>{node.years}</div>
          </div>
        </div>
        {pct!==null&&<div style={{marginTop:7}}><ProgressBar pct={pct}/></div>}
        {open&&(
          <div className="slide-down" style={{marginTop:10,borderTop:"1px solid rgba(255,255,255,.07)",paddingTop:10}}>
            <div style={{marginBottom:8}}><div className="sh">SKILLS</div>
              {resumeData?node.skills.map(s=>{const h=resumeData.skills.some(r=>skillMatch(r,s));return<span key={s} className={`pill ${h?"ph":"pm"}`}>{h?"✓":"✗"} {s}</span>;}):node.skills.map(s=><span key={s} className="pill pn">{s}</span>)}
              {resumeData&&miss.length>0&&<div style={{fontSize:10,color:"#F87171",fontFamily:"'DM Mono',monospace",marginTop:4}}>{miss.length} to develop</div>}
            </div>
            {node.education?.length>0&&<div style={{marginBottom:8}}><div className="sh">EDUCATION</div>{node.education.map(e=><span key={e} className="badge be">🎓 {e}</span>)}</div>}
            {node.certs?.length>0&&<div><div className="sh">CERTIFICATIONS</div>{node.certs.map(c=><span key={c} className="badge bc">🏅 {c}</span>)}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

function PathColumn({ path, color, idx, resumeData, show }) {
  const nodes=flattenPath(path); const gap=resumeData?computeGap(resumeData.skills,path):null;
  if(!show) return null;
  return (
    <div style={{flex:1,minWidth:240,maxWidth:310}}>
      <div style={{marginBottom:9,padding:"8px 12px",background:`${color}0d`,border:`1px solid ${color}28`,borderRadius:7,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:9,letterSpacing:".12em",color,fontFamily:"'DM Mono',monospace"}}>PATH {idx+1}</div><div style={{fontSize:12,fontWeight:600,color:"#CBD5E1"}}>{path.label}</div></div>
        {gap&&<div style={{fontSize:13,fontWeight:700,color:gap.pct>=70?"#5BE8B4":gap.pct>=40?"#E8C547":"#F87171",fontFamily:"'DM Mono',monospace"}}>{gap.pct}%</div>}
      </div>
      {gap&&<div style={{marginBottom:9}}><ProgressBar pct={gap.pct}/></div>}
      {nodes.map((n,i)=><NodeCard key={i} node={n} color={color} isLast={i===nodes.length-1} resumeData={resumeData} animDelay={idx*80+i*55}/>)}
    </div>
  );
}

function GapPanel({ resumeData, currentRole, accent }) {
  const rd=CAREER_DATA[currentRole];
  const gaps=rd.paths.map(p=>({label:p.label,title:p.title,salary:p.next?.salary||p.salary,years:p.years,certs:[...new Set(flattenPath(p).flatMap(n=>n.certs||[]))],...computeGap(resumeData.skills,p)}));
  const [sel,setSel]=useState(0);
  const chosenGap=gaps[sel];
  const nodes=flattenPath(rd.paths[sel]);
  const resumeEdu=resumeData.education||[];
  const reqEdu=[...new Set(nodes.flatMap(n=>n.education||[]))];
  const missEdu=reqEdu.filter(e=>!resumeEdu.some(r=>norm(r).includes(norm(e).slice(0,7))||norm(e).includes(norm(r).slice(0,7))));
  const targetRole=rd.paths[sel]?.title||currentRole;

  const handleDownload=()=>generateReport(resumeData,currentRole,gaps);

  return (
    <div className="fade-up">
      {/* Profile + Download button */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,gap:12,flexWrap:"wrap"}}>
        <div style={{padding:"13px 15px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.08)",borderRadius:11,display:"flex",gap:11,alignItems:"flex-start",flex:1,minWidth:240}}>
          <div style={{width:36,height:36,borderRadius:8,background:`${accent}1a`,border:`1px solid ${accent}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{rd.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:600,color:"#F1F5F9",marginBottom:2}}>{resumeData.currentRole||currentRole}</div>
            {resumeData.yearsExp&&<div style={{fontSize:10,color:"#64748B",fontFamily:"'DM Mono',monospace",marginBottom:3}}>{resumeData.yearsExp} experience</div>}
            {resumeData.summary&&<div style={{fontSize:12,color:"#94A3B8",lineHeight:1.5}}>{resumeData.summary}</div>}
          </div>
        </div>
        <button className="report-btn" onClick={handleDownload}>
          <span style={{fontSize:16}}>⬇</span> Download Gap Report
        </button>
      </div>

      {resumeEdu.length>0&&<div style={{marginBottom:12}}><div className="sh">YOUR EDUCATION</div>{resumeEdu.map(e=><span key={e} className="badge be">🎓 {e}</span>)}</div>}
      <div style={{marginBottom:14}}><div className="sh">YOUR SKILLS ({resumeData.skills?.length||0})</div>{(resumeData.skills||[]).slice(0,30).map(s=><span key={s} className="pill ph">✓ {s}</span>)}{(resumeData.skills||[]).length>30&&<span style={{fontSize:10,color:"#475569",fontFamily:"'DM Mono',monospace",marginLeft:4}}>+{resumeData.skills.length-30} more</span>}</div>

      <div style={{marginBottom:14}}>
        <div className="sh">PATH READINESS — SELECT TO ANALYSE</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
          {gaps.map((g,i)=>{const c=g.pct>=70?"#5BE8B4":g.pct>=40?"#E8C547":"#F87171";return<button key={i} onClick={()=>setSel(i)} style={{padding:"7px 12px",border:sel===i?`1px solid ${c}55`:"1px solid rgba(255,255,255,.08)",borderRadius:8,background:sel===i?`${c}12`:"rgba(255,255,255,.03)",color:sel===i?c:"#64748B",fontFamily:"'DM Mono',monospace",fontSize:11,cursor:"pointer",transition:"all .2s",display:"flex",alignItems:"center",gap:6}}><span style={{fontWeight:700}}>{g.pct}%</span><span>{g.label}</span></button>;})}
        </div>
        <div style={{padding:"11px 14px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:9,marginBottom:14}}>
          <div style={{fontSize:12,color:"#CBD5E1",fontWeight:600,marginBottom:5}}>→ {rd.paths[sel].label} · {rd.paths[sel].title}</div>
          <ProgressBar pct={chosenGap.pct}/>
          <div style={{fontSize:10,color:"#475569",fontFamily:"'DM Mono',monospace",marginTop:4}}>{chosenGap.have.length} matched · {chosenGap.missing.length} to develop · {chosenGap.certs.length} certs recommended</div>
        </div>
      </div>

      {chosenGap.missing.slice(0,12).length>0&&(
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <div className="sh" style={{marginBottom:0}}>SKILLS TO DEVELOP</div>
            <div style={{fontSize:10,color:"#475569",fontFamily:"'DM Mono',monospace"}}>tap any skill → live course search</div>
          </div>
          {chosenGap.missing.slice(0,12).map(s=><GapSkillItem key={`${s}-${sel}`} skill={s} targetRole={targetRole}/>)}
        </div>
      )}

      {missEdu.length>0&&(
        <div style={{marginBottom:14}}>
          <div className="sh">EDUCATION TO CONSIDER</div>
          {missEdu.map(e=><div key={e} style={{padding:"9px 13px",background:"rgba(167,139,250,.07)",border:"1px solid rgba(167,139,250,.18)",borderRadius:8,marginBottom:6}}><div style={{fontSize:12,color:"#F1F5F9",fontWeight:600,marginBottom:1}}>🎓 {e}</div><div style={{fontSize:11,color:"#94A3B8"}}>Commonly required or preferred for this path.</div></div>)}
        </div>
      )}

      {chosenGap.certs.length>0&&(
        <div>
          <div className="sh">CERTIFICATIONS TO EARN</div>
          {chosenGap.certs.map(c=><div key={c} style={{padding:"9px 13px",background:"rgba(232,197,71,.07)",border:"1px solid rgba(232,197,71,.18)",borderRadius:8,marginBottom:6}}><div style={{fontSize:12,color:"#F1F5F9",fontWeight:600,marginBottom:1}}>🏅 {c}</div><div style={{fontSize:11,color:"#94A3B8"}}>Earning this will significantly strengthen your candidacy.</div></div>)}
        </div>
      )}

      {chosenGap.missing.length===0&&missEdu.length===0&&(
        <div style={{padding:"18px",textAlign:"center",background:"rgba(91,232,180,.06)",border:"1px solid rgba(91,232,180,.2)",borderRadius:10}}>
          <div style={{fontSize:22,marginBottom:5}}>🎉</div>
          <div style={{fontSize:13,color:"#5BE8B4",fontWeight:600}}>Strong match!</div>
          <div style={{fontSize:11,color:"#94A3B8",marginTop:3}}>Focus on certifications and leadership experience to accelerate your transition.</div>
        </div>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const mammothReady=useMammoth();
  const [role,setRole]=useState("Software Developer");
  const [resume,setResume]=useState(null);
  const [tab,setTab]=useState("paths");
  const [loaded,setLoaded]=useState(false);
  const [selPath,setSelPath]=useState(null);
  const [search,setSearch]=useState("");

  useEffect(()=>{setLoaded(false);const t=setTimeout(()=>setLoaded(true),60);return()=>clearTimeout(t);},[role]);
  const handleResume=useCallback(data=>{setResume(data);if(data)setTab("gap");},[]);
  const rd=CAREER_DATA[role];

  const filteredRoles=search.trim()
    ? ROLES.filter(r=>r.toLowerCase().includes(search.toLowerCase()))
    : ROLES;

  return (
    <div style={{minHeight:"100vh",background:"#080C14",color:"#F1F5F9",fontFamily:"'DM Sans',sans-serif",position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",backgroundImage:"linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)",backgroundSize:"48px 48px",zIndex:0}}/>
      <div style={{position:"fixed",top:-200,left:"50%",transform:"translateX(-50%)",width:1000,height:560,borderRadius:"50%",background:`radial-gradient(ellipse,${rd.color}11 0%,transparent 70%)`,pointerEvents:"none",zIndex:0,transition:"background .6s"}}/>

      <div style={{position:"relative",zIndex:1,maxWidth:1380,margin:"0 auto",padding:"28px 20px"}}>

        {/* Header */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:10,letterSpacing:".22em",color:"#334155",fontFamily:"'DM Mono',monospace",marginBottom:6}}>TECH CAREER PATH PLANNER · {ROLES.length} ROLES · AI COACHING · LIVE COURSE SEARCH</div>
          <h1 style={{fontSize:"clamp(20px,3.2vw,38px)",fontFamily:"'Playfair Display',serif",fontWeight:900,color:"#F8FAFC",letterSpacing:"-.02em",lineHeight:1.1}}>
            Map your tech career,<br/><span style={{color:rd.color,transition:"color .4s"}}>find every learning path.</span>
          </h1>
        </div>

        {/* Role picker with search */}
        <div style={{marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div className="sh" style={{marginBottom:0}}>YOUR CURRENT ROLE</div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search roles…"
              style={{padding:"5px 10px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:6,color:"#94A3B8",fontFamily:"'DM Mono',monospace",fontSize:10,outline:"none",width:160}}/>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {filteredRoles.map(r=>{
              const d=CAREER_DATA[r],on=role===r;
              return(
                <button key={r} className="role-btn" onClick={()=>{setRole(r);setSelPath(null);setSearch("");}}
                  style={{background:on?`${d.color}18`:"rgba(255,255,255,.04)",borderColor:on?`${d.color}55`:"rgba(255,255,255,.08)",color:on?d.color:"#94A3B8",fontWeight:on?600:400}}
                  onMouseEnter={e=>{if(!on)e.currentTarget.style.background="rgba(255,255,255,.08)";}}
                  onMouseLeave={e=>{if(!on)e.currentTarget.style.background="rgba(255,255,255,.04)";}}>
                  <span>{d.icon}</span><span>{r}</span>
                </button>
              );
            })}
          </div>
          <div style={{marginTop:6,fontSize:11,color:"#334155",fontFamily:"'DM Mono',monospace"}}>
            <span style={{color:rd.color}}>{rd.icon}</span>&nbsp;{rd.description}&nbsp;·&nbsp;{rd.paths.length} career tracks
          </div>
        </div>

        {/* Layout */}
        <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
          {/* Sidebar */}
          <div style={{width:265,flexShrink:0,position:"sticky",top:20,display:"flex",flexDirection:"column",gap:8}}>
            <LinkedInImport onResult={handleResume} accent={rd.color}/>
            <div style={{fontSize:9,color:"#1E293B",fontFamily:"'DM Mono',monospace",textAlign:"center",letterSpacing:".1em"}}>— OR UPLOAD RESUME —</div>
            <UploadZone onResult={handleResume} accent={rd.color} mammothReady={mammothReady}/>
            {!mammothReady&&<div style={{fontSize:9,color:"#334155",fontFamily:"'DM Mono',monospace",textAlign:"center"}}>Loading DOCX support…</div>}
            <div style={{padding:"9px 11px",background:resume?`${rd.color}0d`:"rgba(255,255,255,.02)",border:resume?`1px solid ${rd.color}2e`:"1px solid rgba(255,255,255,.06)",borderRadius:9}}>
              {resume
                ?<><div style={{fontSize:9,letterSpacing:".13em",color:rd.color,fontFamily:"'DM Mono',monospace",marginBottom:3}}>RESUME LOADED</div><div style={{fontSize:11,color:"#94A3B8"}}>{resume.skills?.length||0} skills · {resume.education?.length||0} education entries</div></>
                :<div style={{fontSize:11,color:"#334155",fontFamily:"'DM Mono',monospace",lineHeight:1.65}}>Upload a resume to unlock gap analysis, course search &amp; downloadable report.</div>
              }
            </div>
            <div style={{padding:"9px 11px",background:"rgba(91,232,180,.04)",border:"1px solid rgba(91,232,180,.14)",borderRadius:9}}>
              <div style={{fontSize:9,letterSpacing:".12em",color:"#5BE8B4",fontFamily:"'DM Mono',monospace",marginBottom:4}}>FEATURES</div>
              <div style={{fontSize:10,color:"#334155",lineHeight:1.7,fontFamily:"'DM Mono',monospace"}}>
                ✓ {ROLES.length} tech roles<br/>
                ✓ Live AI course search<br/>
                ✓ PDF gap report download<br/>
                ✓ AI career coach chat
              </div>
            </div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {["PDF","DOCX","DOC","TXT"].map(f=><span key={f} style={{padding:"2px 7px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:4,fontSize:9,fontFamily:"'DM Mono',monospace",color:"#334155",letterSpacing:".1em"}}>{f}</span>)}
            </div>
          </div>

          {/* Main */}
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:13,borderBottom:"1px solid rgba(255,255,255,.07)",paddingBottom:10,flexWrap:"wrap"}}>
              <button className={`tab ${tab==="paths"?"on":""}`} onClick={()=>setTab("paths")}>CAREER PATHS</button>
              <button className={`tab ${tab==="gap"?"on":""}`} onClick={()=>setTab("gap")} style={{position:"relative"}}>
                GAP + COURSES{resume&&<span style={{position:"absolute",top:-2,right:-2,width:7,height:7,background:"#5BE8B4",borderRadius:"50%"}}/>}
              </button>
              <button className={`tab ${tab==="coach"?"on":""}`} onClick={()=>setTab("coach")} style={{position:"relative"}}>
                AI COACH{resume&&<span style={{position:"absolute",top:-2,right:-2,width:7,height:7,background:rd.color,borderRadius:"50%"}}/>}
              </button>
              {tab==="paths"&&(
                <div style={{marginLeft:"auto",display:"flex",gap:5,flexWrap:"wrap"}}>
                  {rd.paths.map((p,i)=>(
                    <button key={i} onClick={()=>setSelPath(selPath===i?null:i)} style={{padding:"4px 10px",background:selPath===i?`${rd.color}22`:"transparent",border:selPath===i?`1px solid ${rd.color}55`:"1px solid rgba(255,255,255,.09)",borderRadius:20,color:selPath===i?rd.color:"#475569",fontFamily:"'DM Mono',monospace",fontSize:9,cursor:"pointer",transition:"all .2s"}}>
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {tab==="paths"&&loaded&&(
              <div style={{display:"flex",gap:13,flexWrap:"wrap",alignItems:"flex-start"}}>
                {rd.paths.map((p,i)=>(selPath===null||selPath===i)&&<PathColumn key={`${role}-${i}`} path={p} color={rd.color} idx={i} resumeData={resume} show={selPath===null||selPath===i}/>)}
              </div>
            )}

            {tab==="gap"&&(
              resume
                ?<GapPanel resumeData={resume} currentRole={role} accent={rd.color}/>
                :<div style={{padding:"52px 28px",textAlign:"center",background:"rgba(255,255,255,.02)",border:"2px dashed rgba(255,255,255,.07)",borderRadius:14}}>
                  <div style={{fontSize:28,marginBottom:10,opacity:.2}}>{rd.icon}</div>
                  <div style={{fontSize:14,color:"#64748B",fontFamily:"'Playfair Display',serif",marginBottom:5}}>No resume loaded yet</div>
                  <div style={{fontSize:11,color:"#475569",fontFamily:"'DM Mono',monospace"}}>Upload a resume or import LinkedIn to unlock gap analysis with live course search</div>
                </div>
            )}

            {tab==="coach"&&<CoachingChat resumeData={resume} currentRole={role} accent={rd.color}/>}
          </div>
        </div>

        {/* Legend */}
        <div style={{marginTop:32,paddingTop:13,borderTop:"1px solid rgba(255,255,255,.06)",display:"flex",gap:16,flexWrap:"wrap"}}>
          {[{c:"#5BE8B4",l:"SKILL MATCHED",d:"Found in your resume"},{c:"#F87171",l:"SKILL GAP",d:"Tap to search courses"},{c:"#A78BFA",l:"EDUCATION",d:"Required degree/field"},{c:"#E8C547",l:"CERTIFICATION",d:"Recommended credential"}].map(x=>(
            <div key={x.l} style={{display:"flex",alignItems:"center",gap:7}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:x.c,boxShadow:`0 0 5px ${x.c}88`}}/>
              <div><div style={{fontSize:9,letterSpacing:".12em",color:x.c,fontFamily:"'DM Mono',monospace"}}>{x.l}</div><div style={{fontSize:11,color:"#475569"}}>{x.d}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
