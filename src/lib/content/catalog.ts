export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export interface LessonSeed {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
  mediaKey: string;
  isPreview?: boolean;
}

export interface SectionSeed {
  id: string;
  title: string;
  description: string;
  lessons: LessonSeed[];
}

export interface CourseSeed {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  level: CourseLevel;
  thumbnail: string;
  instructorId: string;
  isDemo: boolean;
  priceCents: number | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  outcomes: string[];
  sections: SectionSeed[];
}

export interface InstructorSeed {
  id: string;
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  initials: string;
  accent: "cyan" | "blue" | "lavender";
}

/**
 * Demonstration catalogue.
 *
 * Every course below is seeded with realistic, course-specific written
 * content so the product can be evaluated end to end. Media files are
 * sample recordings generated for development; they are flagged with the
 * `isDemo` marker in the interface and are replaced by uploading real
 * lesson media (see README -> Adding lesson media).
 */
export const INSTRUCTORS: InstructorSeed[] = [
  {
    id: "ins-faculty",
    name: "Hackway Academy Faculty",
    role: "Instructor",
    bio: "Sample instructor profile for demonstration content. Replace with the assigned instructor before publishing a course.",
    expertise: ["Security fundamentals", "Learning design", "Technical writing"],
    initials: "HA",
    accent: "cyan",
  },
  {
    id: "ins-networking",
    name: "Hackway Academy Faculty",
    role: "Networking Instructor",
    bio: "Sample instructor profile for demonstration content. Replace with the assigned instructor before publishing a course.",
    expertise: ["TCP/IP", "Network architecture", "Traffic analysis"],
    initials: "HA",
    accent: "blue",
  },
  {
    id: "ins-linux",
    name: "Hackway Academy Faculty",
    role: "Linux Instructor",
    bio: "Sample instructor profile for demonstration content. Replace with the assigned instructor before publishing a course.",
    expertise: ["Linux administration", "Filesystems", "Shell fundamentals"],
    initials: "HA",
    accent: "cyan",
  },
  {
    id: "ins-web",
    name: "Hackway Academy Faculty",
    role: "Application Security Instructor",
    bio: "Sample instructor profile for demonstration content. Replace with the assigned instructor before publishing a course.",
    expertise: ["Web technologies", "OWASP Top 10", "Secure design"],
    initials: "HA",
    accent: "lavender",
  },
  {
    id: "ins-offensive",
    name: "Hackway Academy Faculty",
    role: "Offensive Security Instructor",
    bio: "Sample instructor profile for demonstration content. Replace with the assigned instructor before publishing a course.",
    expertise: ["Testing methodology", "Reconnaissance concepts", "Reporting"],
    initials: "HA",
    accent: "blue",
  },
  {
    id: "ins-defensive",
    name: "Hackway Academy Faculty",
    role: "Defensive Security Instructor",
    bio: "Sample instructor profile for demonstration content. Replace with the assigned instructor before publishing a course.",
    expertise: ["Security monitoring", "Event analysis", "Incident response"],
    initials: "HA",
    accent: "cyan",
  },
];

export const COURSES: CourseSeed[] = [
  {
    id: "crs-fundamentals",
    slug: "cybersecurity-fundamentals",
    title: "Cybersecurity Fundamentals",
    tagline: "The language, principles and mental models every security professional starts with.",
    description:
      "A structured introduction to how security is actually practised. You will build a shared vocabulary for assets, threats, vulnerabilities and risk, then learn how defenders layer controls so that a single mistake does not become a breach.",
    category: "Foundations",
    level: "Beginner",
    thumbnail: "/art/course-cybersecurity-fundamentals.svg",
    instructorId: "ins-faculty",
    isDemo: true,
    priceCents: null,
    featured: true,
    createdAt: "2026-01-14T09:00:00.000Z",
    updatedAt: "2026-09-28T09:00:00.000Z",
    outcomes: [
      "Describe the core goals of information security using precise, standard language.",
      "Distinguish between a threat, a vulnerability, an exploit and a business risk.",
      "Map assets, actors and trust boundaries across a small system.",
      "Explain how defence in depth and least privilege reduce real-world impact.",
      "Build and maintain a lightweight risk register for a team or project.",
    ],
    sections: [
      {
        id: "sec-fund-1",
        title: "Foundations of Security",
        description: "Where the discipline came from and the vocabulary it settled on.",
        lessons: [
          {
            id: "les-fund-1-1",
            title: "Welcome and Course Orientation",
            description:
              "A short orientation to the course: what security means, how the lessons are structured, and how to get the most out of the material.",
            durationSeconds: 252,
            mediaKey: "orientation",
            isPreview: true,
          },
          {
            id: "les-fund-1-2",
            title: "Security Goals: Confidentiality, Integrity, Availability",
            description:
              "The three goals that nearly every control ultimately serves, and the everyday examples that make them concrete.",
            durationSeconds: 575,
            mediaKey: "foundations",
          },
          {
            id: "les-fund-1-3",
            title: "The CIA Triad in Practice",
            description:
              "Moving past the textbook definition and seeing how the triad behaves inside real organisations and systems.",
            durationSeconds: 668,
            mediaKey: "foundations",
          },
          {
            id: "les-fund-1-4",
            title: "Identifying Assets and Trust Boundaries",
            description:
              "How to find what actually matters to a business and where it stops trusting the world around it.",
            durationSeconds: 740,
            mediaKey: "foundations",
          },
        ],
      },
      {
        id: "sec-fund-2",
        title: "Threats and Risk",
        description: "Who attacks, what they want, and how risk is actually reasoned about.",
        lessons: [
          {
            id: "les-fund-2-1",
            title: "Threat Actors and Their Motivations",
            description:
              "Nation-state actors, organised crime, insiders and researchers — and why understanding intent changes how you respond.",
            durationSeconds: 645,
            mediaKey: "foundations",
          },
          {
            id: "les-fund-2-2",
            title: "Common Threat Categories",
            description:
              "Malware, phishing, credential abuse, misconfiguration and denial of service, explained without hype.",
            durationSeconds: 795,
            mediaKey: "foundations",
          },
          {
            id: "les-fund-2-3",
            title: "Vulnerability, Threat and Risk",
            description:
              "The chain that turns a weakness into an incident, and where risk management enters the picture.",
            durationSeconds: 842,
            mediaKey: "foundations",
          },
          {
            id: "les-fund-2-4",
            title: "Working with a Risk Register",
            description:
              "A repeatable way to record risks, owners, likelihood, impact and the treatment decision behind each one.",
            durationSeconds: 758,
            mediaKey: "foundations",
          },
        ],
      },
      {
        id: "sec-fund-3",
        title: "Defence Fundamentals",
        description: "How controls combine so that a single failure stays survivable.",
        lessons: [
          {
            id: "les-fund-3-1",
            title: "Defence in Depth",
            description:
              "Why layered controls matter, and how an attacker must clear several barriers rather than exploit one flaw.",
            durationSeconds: 710,
            mediaKey: "foundations",
          },
          {
            id: "les-fund-3-2",
            title: "Least Privilege and Access Control",
            description:
              "Granting only the access a role genuinely needs, and recognising privilege creep when you see it.",
            durationSeconds: 802,
            mediaKey: "foundations",
          },
          {
            id: "les-fund-3-3",
            title: "Security Awareness and Culture",
            description:
              "The human layer: training, reporting habits and the signals that suggest a culture is or is not working.",
            durationSeconds: 595,
            mediaKey: "foundations",
          },
          {
            id: "les-fund-3-4",
            title: "Course Summary and Next Steps",
            description:
              "Recapping the core language of security and the directions you can take next depending on your interests.",
            durationSeconds: 344,
            mediaKey: "closing",
          },
        ],
      },
    ],
  },
  {
    id: "crs-networking",
    slug: "computer-networking-for-security",
    title: "Computer Networking for Security",
    tagline: "Read a network like an investigator: structure, addressing and traffic.",
    description:
      "Security work starts by understanding how data actually moves. This course builds a working model of network architecture, the TCP/IP stack, addressing and routing, so you can reason about exposure, capture traffic and explain why a misconfiguration is dangerous.",
    category: "Networking",
    level: "Beginner",
    thumbnail: "/art/course-computer-networking-for-security.svg",
    instructorId: "ins-networking",
    isDemo: true,
    priceCents: null,
    featured: true,
    createdAt: "2026-02-02T09:00:00.000Z",
    updatedAt: "2026-09-21T09:00:00.000Z",
    outcomes: [
      "Explain how the TCP/IP model organises network communication.",
      "Read and interpret an IPv4 address, subnet mask and default gateway.",
      "Describe how a TCP handshake establishes a session and why it matters for monitoring.",
      "Recognise the most common network protocols and the security implications of each.",
      "Understand how routing and firewalls decide whether traffic is allowed.",
    ],
    sections: [
      {
        id: "sec-net-1",
        title: "Network Fundamentals",
        description: "The shapes and vocabulary of a network before any security context.",
        lessons: [
          {
            id: "les-net-1-1",
            title: "What a Network Actually Is",
            description:
              "Clients, servers, switches, routers and the media between them — a plain-language map of a network.",
            durationSeconds: 268,
            mediaKey: "networking",
            isPreview: true,
          },
          {
            id: "les-net-1-2",
            title: "The TCP/IP Model",
            description:
              "The four layers every security conversation eventually refers back to, and what happens at each one.",
            durationSeconds: 612,
            mediaKey: "networking",
          },
          {
            id: "les-net-1-3",
            title: "Network Topologies and Segmentation",
            description:
              "Why networks are split into segments, and how segmentation limits how far an intruder can travel.",
            durationSeconds: 585,
            mediaKey: "networking",
          },
        ],
      },
      {
        id: "sec-net-2",
        title: "Addressing and Transport",
        description: "How devices are identified and how connections are established.",
        lessons: [
          {
            id: "les-net-2-1",
            title: "IP Addressing and Subnetting Essentials",
            description:
              "Breaking an address into network and host portions, and why subnet maths shows up in every security review.",
            durationSeconds: 735,
            mediaKey: "networking",
          },
          {
            id: "les-net-2-2",
            title: "Ports, Protocols and Services",
            description:
              "Matching well-known ports to the services behind them, and the exposure that creates.",
            durationSeconds: 664,
            mediaKey: "networking",
          },
          {
            id: "les-net-2-3",
            title: "The TCP Handshake and Connection State",
            description:
              "How a session is opened, maintained and closed — and what a half-open state looks like to a defender.",
            durationSeconds: 698,
            mediaKey: "networking",
          },
          {
            id: "les-net-2-4",
            title: "DNS and Name Resolution",
            description:
              "How names become addresses, and why a resolver is such a valuable target for an attacker.",
            durationSeconds: 712,
            mediaKey: "networking",
          },
        ],
      },
      {
        id: "sec-net-3",
        title: "Traffic, Filtering and Exposure",
        description: "Reading what traffic is happening and controlling what may flow.",
        lessons: [
          {
            id: "les-net-3-1",
            title: "Packet Capture and Traffic Fundamentals",
            description:
              "What a captured conversation looks like, and how to read headers to understand a session.",
            durationSeconds: 742,
            mediaKey: "networking",
          },
          {
            id: "les-net-3-2",
            title: "Firewalls, ACLs and Segmentation Rules",
            description:
              "How allow and deny decisions are evaluated, and where rules tend to become too broad.",
            durationSeconds: 705,
            mediaKey: "networking",
          },
          {
            id: "les-net-3-3",
            title: "Wireless Networking and Wi-Fi Security",
            description:
              "Wireless removes the physical boundary, so the protocol layer has to carry the security burden.",
            durationSeconds: 688,
            mediaKey: "networking",
          },
          {
            id: "les-net-3-4",
            title: "Hardening Network Exposure",
            description:
              "A repeatable checklist for reducing what an attacker can see from the outside.",
            durationSeconds: 604,
            mediaKey: "closing",
          },
        ],
      },
    ],
  },
  {
    id: "crs-linux",
    slug: "linux-essentials-for-cybersecurity",
    title: "Linux Essentials for Cybersecurity",
    tagline: "The operating system most security work happens inside.",
    description:
      "Linux underpins the overwhelming majority of servers, network appliances and security tooling. This course teaches the filesystem, permissions, processes and command-line concepts you need before you can administer, audit or investigate a Linux host with confidence.",
    category: "Linux",
    level: "Beginner",
    thumbnail: "/art/course-linux-essentials-for-cybersecurity.svg",
    instructorId: "ins-linux",
    isDemo: true,
    priceCents: null,
    featured: true,
    createdAt: "2026-02-19T09:00:00.000Z",
    updatedAt: "2026-10-02T09:00:00.000Z",
    outcomes: [
      "Navigate a Linux filesystem and predict where configuration and log data lives.",
      "Read and change file permissions with confidence.",
      "Explain how users, groups and the superuser model affect access decisions.",
      "Inspect running processes, services and open network connections.",
      "Use the command line to gather the first facts during an investigation.",
    ],
    sections: [
      {
        id: "sec-lin-1",
        title: "The Linux Environment",
        description: "Distributions, shells and the filesystem layout.",
        lessons: [
          {
            id: "les-lin-1-1",
            title: "Distributions, Shells and the Command Line",
            description:
              "What a distribution actually is, how a shell interprets what you type, and how to get help when you are stuck.",
            durationSeconds: 286,
            mediaKey: "linux",
            isPreview: true,
          },
          {
            id: "les-lin-1-2",
            title: "Navigating the Filesystem",
            description:
              "The directories every Linux system shares, and how to move around them without guessing.",
            durationSeconds: 548,
            mediaKey: "linux",
          },
          {
            id: "les-lin-1-3",
            title: "Files, Directories and the Inode",
            description:
              "What a file really is on disk, and why links and ownership behave the way they do.",
            durationSeconds: 592,
            mediaKey: "linux",
          },
        ],
      },
      {
        id: "sec-lin-2",
        title: "Users, Permissions and Access",
        description: "The access model that decides who can read, change or run anything.",
        lessons: [
          {
            id: "les-lin-2-1",
            title: "Users, Groups and the Superuser Model",
            description:
              "How identity is grouped and why the root account is the single most valuable target on the host.",
            durationSeconds: 635,
            mediaKey: "linux",
          },
          {
            id: "les-lin-2-2",
            title: "File Permissions and Ownership",
            description:
              "Reading the permission bits, and the difference between chmod and chown in practice.",
            durationSeconds: 668,
            mediaKey: "linux",
          },
          {
            id: "les-lin-2-3",
            title: "Special Permissions and the Sticky Bit",
            description:
              "setuid, setgid and the sticky bit — the settings that quietly grant far more than they appear to.",
            durationSeconds: 574,
            mediaKey: "linux",
          },
          {
            id: "les-lin-2-4",
            title: "Package Management and Keeping Systems Patched",
            description:
              "Where updates come from, how to tell what is installed, and why patch timing matters.",
            durationSeconds: 646,
            mediaKey: "linux",
          },
        ],
      },
      {
        id: "sec-lin-3",
        title: "Running Systems and Gathering Evidence",
        description: "What is running, who is connected, and what the logs say.",
        lessons: [
          {
            id: "les-lin-3-1",
            title: "Processes, Services and Scheduling",
            description:
              "How work is scheduled, how services start, and how to tell normal activity from an intruder.",
            durationSeconds: 612,
            mediaKey: "linux",
          },
          {
            id: "les-lin-3-2",
            title: "Logs and System Journals",
            description:
              "Which logs answer which question, and how to read the ones you have never opened before.",
            durationSeconds: 598,
            mediaKey: "linux",
          },
          {
            id: "les-lin-3-3",
            title: "Essential Commands for Investigation",
            description:
              "A small, high-value set of commands for establishing what happened on a host.",
            durationSeconds: 634,
            mediaKey: "linux",
          },
          {
            id: "les-lin-3-4",
            title: "Hardening Basics and Next Steps",
            description:
              "Closing the loop with a practical hardening pass and pointers to further Linux study.",
            durationSeconds: 486,
            mediaKey: "closing",
          },
        ],
      },
    ],
  },
  {
    id: "crs-webapp",
    slug: "web-application-security",
    title: "Web Application Security",
    tagline: "How the modern web works, and where it breaks.",
    description:
      "Web applications combine many moving parts, and each one is an opportunity. This course works through HTTP, session handling, input processing and the most common classes of web vulnerability, then shows how secure design practices remove them at the source.",
    category: "Application Security",
    level: "Intermediate",
    thumbnail: "/art/course-web-application-security.svg",
    instructorId: "ins-web",
    isDemo: true,
    priceCents: null,
    featured: true,
    createdAt: "2026-03-08T09:00:00.000Z",
    updatedAt: "2026-10-06T09:00:00.000Z",
    outcomes: [
      "Explain the purpose of HTTP and HTTPS and how a request and response are structured.",
      "Recognise the most common classes of web application vulnerability and their root causes.",
      "Understand how authentication and session management work and where they commonly fail.",
      "Assess how input handling and output encoding affect injection and injection-adjacent flaws.",
      "Apply secure development practices that reduce risk rather than treating symptoms.",
    ],
    sections: [
      {
        id: "sec-web-1",
        title: "How the Web Works",
        description: "The protocol, the browser and the server — and the security decisions inside each.",
        lessons: [
          {
            id: "les-web-1-1",
            title: "Welcome and the Shape of Web Security",
            description:
              "Why the web is the most attacked application surface, and how this course is organised.",
            durationSeconds: 298,
            mediaKey: "websec",
            isPreview: true,
          },
          {
            id: "les-web-1-2",
            title: "HTTP Requests, Responses and Headers",
            description:
              "Every part of the conversation between browser and server, including the headers that carry security meaning.",
            durationSeconds: 724,
            mediaKey: "websec",
          },
          {
            id: "les-web-1-3",
            title: "HTTPS, Certificates and Transport Security",
            description:
              "What encryption protects, what it does not protect, and how certificate handling breaks in practice.",
            durationSeconds: 686,
            mediaKey: "websec",
          },
          {
            id: "les-web-1-4",
            title: "The Browser as an Application",
            description:
              "Same-origin policy, cookie scoping and the rendering rules that keep one site's code from touching another's.",
            durationSeconds: 712,
            mediaKey: "websec",
          },
        ],
      },
      {
        id: "sec-web-2",
        title: "Authentication and Session Management",
        description: "How identity is proven, maintained and — too often — broken.",
        lessons: [
          {
            id: "les-web-2-1",
            title: "Authentication Models and Flows",
            description:
              "Passwords, multi-factor, single sign-on and the trade-offs each model introduces.",
            durationSeconds: 742,
            mediaKey: "websec",
          },
          {
            id: "les-web-2-2",
            title: "Cookies and Session Tokens",
            description:
              "How session identifiers are issued, stored, scoped and — occasionally — stolen.",
            durationSeconds: 705,
            mediaKey: "websec",
          },
          {
            id: "les-web-2-3",
            title: "Access Control and Broken Authorisation",
            description:
              "Why checking that a user is logged in is not the same as checking that they may access this resource.",
            durationSeconds: 768,
            mediaKey: "websec",
          },
        ],
      },
      {
        id: "sec-web-3",
        title: "Common Vulnerability Classes",
        description: "The flaws that dominate real assessments, grouped by root cause.",
        lessons: [
          {
            id: "les-web-3-1",
            title: "Injection: SQL, Command and Template Injection",
            description:
              "The shared pattern behind injection bugs and why parameterisation fixes it at the source.",
            durationSeconds: 812,
            mediaKey: "websec",
          },
          {
            id: "les-web-3-2",
            title: "Cross-Site Scripting and Output Encoding",
            description:
              "How untrusted data becomes executable script, and the encoding rules that prevent it.",
            durationSeconds: 780,
            mediaKey: "websec",
          },
          {
            id: "les-web-3-3",
            title: "Server-Side Request Forgery and Path Traversal",
            description:
              "Abusing the server's own network position and file access to reach places the client cannot.",
            durationSeconds: 654,
            mediaKey: "websec",
          },
          {
            id: "les-web-3-4",
            title: "Security Misconfiguration and Dependency Risk",
            description:
              "Defaults left in place, verbose errors exposed and outdated components shipped into production.",
            durationSeconds: 632,
            mediaKey: "websec",
          },
        ],
      },
      {
        id: "sec-web-4",
        title: "Secure Design and Practice",
        description: "Building the habits that keep vulnerabilities out in the first place.",
        lessons: [
          {
            id: "les-web-4-1",
            title: "Validating Input at the Boundaries",
            description:
              "Allow-lists over deny-lists, and validating where data enters the system rather than where it is used.",
            durationSeconds: 664,
            mediaKey: "websec",
          },
          {
            id: "les-web-4-2",
            title: "Security Headers and Content Security Policy",
            description:
              "How response headers turn a browser into an enforcement point, and how to deploy them safely.",
            durationSeconds: 598,
            mediaKey: "websec",
          },
          {
            id: "les-web-4-3",
            title: "Secure Development Workflow",
            description:
              "Where review, testing and dependency hygiene fit into the build, without slowing delivery to a crawl.",
            durationSeconds: 706,
            mediaKey: "websec",
          },
          {
            id: "les-web-4-4",
            title: "Course Summary and Further Study",
            description:
              "Consolidating the material and mapping the next steps for a deeper specialisation.",
            durationSeconds: 452,
            mediaKey: "closing",
          },
        ],
      },
    ],
  },
  {
    id: "crs-pentest",
    slug: "introduction-to-penetration-testing",
    title: "Introduction to Penetration Testing",
    tagline: "Structured, authorised testing from scope to report.",
    description:
      "Penetration testing is a disciplined process, not a list of tricks. This course covers authorisation and scope, the phases of an engagement, reconnaissance concepts, the discipline of evidence and reporting, and the professional conduct that separates testing from crime.",
    category: "Offensive Security",
    level: "Intermediate",
    thumbnail: "/art/course-introduction-to-penetration-testing.svg",
    instructorId: "ins-offensive",
    isDemo: true,
    priceCents: null,
    featured: true,
    createdAt: "2026-03-25T09:00:00.000Z",
    updatedAt: "2026-10-09T09:00:00.000Z",
    outcomes: [
      "Explain what authorisation means and how to define a defensible scope for testing.",
      "Describe the phases of a penetration test and what evidence each phase produces.",
      "Plan passive and active reconnaissance within an agreed scope.",
      "Document findings with reproducible steps, impact and remediation advice.",
      "Apply professional rules of engagement, including when to stop.",
    ],
    sections: [
      {
        id: "sec-pen-1",
        title: "Authorisation and Scope",
        description: "The part of the job that happens before any technical work begins.",
        lessons: [
          {
            id: "les-pen-1-1",
            title: "Welcome and the Ethics of Testing",
            description:
              "What separates professional security testing from unauthorised access, and the legal and ethical lines that define it.",
            durationSeconds: 528,
            mediaKey: "offensive",
            isPreview: true,
          },
          {
            id: "les-pen-1-2",
            title: "Rules of Engagement",
            description:
              "Writing the document that states what may be tested, when, by whom, and how results are handled.",
            durationSeconds: 1560,
            mediaKey: "offensive",
          },
          {
            id: "les-pen-1-3",
            title: "Building a Defensible Scope",
            description:
              "Turning business requirements into testable scope, exclusions, time windows and abort criteria.",
            durationSeconds: 1712,
            mediaKey: "offensive",
          },
          {
            id: "les-pen-1-4",
            title: "Stakeholders, Legal Review and Communication",
            description:
              "Who signs off, who must be informed, and how to keep a client comfortable during an intrusive test.",
            durationSeconds: 1484,
            mediaKey: "offensive",
          },
        ],
      },
      {
        id: "sec-pen-2",
        title: "Methodology and Reconnaissance",
        description: "A repeatable process, and the information gathering that feeds it.",
        lessons: [
          {
            id: "les-pen-2-1",
            title: "The Phases of an Engagement",
            description:
              "Planning, information gathering, vulnerability analysis, exploitation, reporting and retesting.",
            durationSeconds: 1782,
            mediaKey: "offensive",
          },
          {
            id: "les-pen-2-2",
            title: "Passive Reconnaissance Concepts",
            description:
              "Gathering intelligence without touching the target, and reading it critically.",
            durationSeconds: 1898,
            mediaKey: "offensive",
          },
          {
            id: "les-pen-2-3",
            title: "Active Reconnaissance Within Scope",
            description:
              "Enumerating live services responsibly, and recording every action as you go.",
            durationSeconds: 2004,
            mediaKey: "offensive",
          },
          {
            id: "les-pen-2-4",
            title: "Building an Attack Surface Map",
            description:
              "Turning raw enumeration into a structured picture of systems, trust boundaries and exposure.",
            durationSeconds: 1630,
            mediaKey: "offensive",
          },
        ],
      },
      {
        id: "sec-pen-3",
        title: "Evidence, Reporting and Professional Practice",
        description: "Turning technical activity into something a business can act on.",
        lessons: [
          {
            id: "les-pen-3-1",
            title: "Recording Evidence and Test Logs",
            description:
              "Keeping defensible, timestamped records that let you reproduce and defend a finding later.",
            durationSeconds: 1840,
            mediaKey: "offensive",
          },
          {
            id: "les-pen-3-2",
            title: "Writing a Finding",
            description:
              "Structure, evidence, impact and remediation — the four parts every finding needs.",
            durationSeconds: 1920,
            mediaKey: "offensive",
          },
          {
            id: "les-pen-3-3",
            title: "Risk Rating and Business Impact",
            description:
              "Converting technical severity into a language that business owners can prioritise and fund.",
            durationSeconds: 1680,
            mediaKey: "offensive",
          },
          {
            id: "les-pen-3-4",
            title: "Remediation Guidance and Retesting",
            description:
              "Advice that actually gets implemented, and how to confirm a fix holds.",
            durationSeconds: 1760,
            mediaKey: "offensive",
          },
          {
            id: "les-pen-3-5",
            title: "Ethics, Care and When to Stop",
            description:
              "Judgement under pressure: protecting data and people when a test goes further than expected.",
            durationSeconds: 1464,
            mediaKey: "offensive",
          },
        ],
      },
    ],
  },
  {
    id: "crs-secops",
    slug: "security-operations-fundamentals",
    title: "Security Operations Fundamentals",
    tagline: "Monitoring, analysis and the first hours of an incident.",
    description:
      "Security operations is where detection becomes action. This course explains how monitoring is configured, how events are triaged and escalated, how an incident is handled in its first hours, and how defenders build the workflows that keep response repeatable.",
    category: "Defensive Security",
    level: "Beginner",
    thumbnail: "/art/course-security-operations-fundamentals.svg",
    instructorId: "ins-defensive",
    isDemo: true,
    priceCents: null,
    featured: true,
    createdAt: "2026-04-11T09:00:00.000Z",
    updatedAt: "2026-10-12T09:00:00.000Z",
    outcomes: [
      "Describe how monitoring is deployed and what telemetry it produces.",
      "Triage an alert into meaningful categories and judge its urgency.",
      "Explain the roles involved in incident response and how they hand over work.",
      "Follow an incident through the first hours with a documented timeline.",
      "Design basic detection content and the workflows that make it actionable.",
    ],
    sections: [
      {
        id: "sec-soc-1",
        title: "Monitoring and Visibility",
        description: "What you can see, what you cannot, and why the gap matters.",
        lessons: [
          {
            id: "les-soc-1-1",
            title: "Welcome to Security Operations",
            description:
              "The purpose of a security operations function and how this course is structured.",
            durationSeconds: 302,
            mediaKey: "defensive",
            isPreview: true,
          },
          {
            id: "les-soc-1-2",
            title: "Log Sources and Collection",
            description:
              "Endpoints, network devices, applications and identity providers, and how their data is gathered.",
            durationSeconds: 902,
            mediaKey: "defensive",
          },
          {
            id: "les-soc-1-3",
            title: "SIEM, Detection Rules and Alert Volume",
            description:
              "How collected data becomes a rule, and how poorly tuned rules destroy a team's ability to respond.",
            durationSeconds: 966,
            mediaKey: "defensive",
          },
          {
            id: "les-soc-1-4",
            title: "Building a Healthy Baseline",
            description:
              "Knowing what normal looks like for your environment so anomalies mean something.",
            durationSeconds: 1014,
            mediaKey: "defensive",
          },
        ],
      },
      {
        id: "sec-soc-2",
        title: "Triage and Analysis",
        description: "Turning a noisy alert into a decision.",
        lessons: [
          {
            id: "les-soc-2-1",
            title: "Alert Categories and Severity",
            description:
              "A shared vocabulary for what an alert represents and how urgently it needs attention.",
            durationSeconds: 986,
            mediaKey: "defensive",
          },
          {
            id: "les-soc-2-2",
            title: "Analyst Investigation Workflow",
            description:
              "A repeatable loop: verify, scope, decide, document — and the evidence that supports each step.",
            durationSeconds: 1092,
            mediaKey: "defensive",
          },
          {
            id: "les-soc-2-3",
            title: "Analysis with Host and Network Telemetry",
            description:
              "Piecing together a story across endpoint, network and identity data.",
            durationSeconds: 1034,
            mediaKey: "defensive",
          },
        ],
      },
      {
        id: "sec-soc-3",
        title: "Incident Response",
        description: "The first hours, the roles, and the paperwork that follows.",
        lessons: [
          {
            id: "les-soc-3-1",
            title: "Incident Response Lifecycle",
            description:
              "Preparation, identification, containment, eradication, recovery and lessons learned.",
            durationSeconds: 1128,
            mediaKey: "defensive",
          },
          {
            id: "les-soc-3-2",
            title: "Roles, Escalation and Communication",
            description:
              "Who decides, who is told, and how to communicate without causing panic or silence.",
            durationSeconds: 1058,
            mediaKey: "defensive",
          },
          {
            id: "les-soc-3-3",
            title: "Containment, Eradication and Recovery",
            description:
              "Deciding what to isolate, what to rebuild and how to prove the compromise is over.",
            durationSeconds: 1172,
            mediaKey: "defensive",
          },
          {
            id: "les-soc-3-4",
            title: "Documentation and Post-Incident Review",
            description:
              "Timelines, timelines again — and the blameless review that turns an incident into progress.",
            durationSeconds: 1004,
            mediaKey: "defensive",
          },
          {
            id: "les-soc-3-5",
            title: "Building Repeatable Workflows",
            description:
              "Runbooks, playbooks and automation that let a small team respond consistently.",
            durationSeconds: 946,
            mediaKey: "defensive",
          },
        ],
      },
    ],
  },
];
