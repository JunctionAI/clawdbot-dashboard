// Skill types and data definitions

export interface SkillPermission {
  id: string;
  name: string;
  description: string;
  scope?: string;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  description: string;
  longDescription: string;
  price: number; // in cents per month
  category: 'productivity' | 'automation' | 'communication' | 'ai' | 'data';
  features: string[];
  permissions: SkillPermission[];
  examples: string[];
  rating: number;
  reviewCount: number;
  isPopular?: boolean;
  isNew?: boolean;
  comingSoon?: boolean;
}

export interface SkillBundle {
  id: string;
  name: string;
  description: string;
  skills: string[]; // skill ids
  originalPrice: number;
  bundlePrice: number;
  savings: number;
  claimedPercent?: number;
}

export interface UserSkill {
  skillId: string;
  active: boolean;
  activatedAt?: string;
  trialEndsAt?: string;
  isTrialing?: boolean;
}

// Skill definitions based on the marketplace design
export const SKILLS: Skill[] = [
  {
    id: 'gmail',
    name: 'Gmail Integration',
    icon: '📧',
    description: 'Read, send, and manage emails directly through Ally',
    longDescription: 'Transform how you handle email. Ally can read your inbox, draft replies, send emails, and set up smart filters—all through natural conversation.',
    price: 500,
    category: 'productivity',
    features: [
      'Read and summarize unread emails',
      'Draft and send emails',
      'Search emails by sender, date, or content',
      'Set up smart filters and labels',
      'Manage drafts',
      'Archive and organize',
    ],
    permissions: [
      {
        id: 'gmail.read',
        name: 'Read emails',
        description: 'View your email messages and settings',
        scope: 'https://www.googleapis.com/auth/gmail.readonly',
      },
      {
        id: 'gmail.send',
        name: 'Send emails',
        description: 'Send email on your behalf',
        scope: 'https://www.googleapis.com/auth/gmail.send',
      },
      {
        id: 'gmail.modify',
        name: 'Manage emails',
        description: 'View and modify but not delete your email',
        scope: 'https://www.googleapis.com/auth/gmail.modify',
      },
    ],
    examples: [
      '"Read my unread emails"',
      '"Draft a reply to Sarah\'s email"',
      '"Find all emails from Amazon this month"',
      '"Send the meeting notes to the team"',
      '"Summarize my inbox"',
    ],
    rating: 4.9,
    reviewCount: 142,
    isPopular: true,
  },
  {
    id: 'calendar',
    name: 'Calendar Sync',
    icon: '📅',
    description: 'Sync with Google/Outlook and manage your schedule',
    longDescription: 'Never miss a meeting or deadline. Ally syncs with your calendar to help you schedule, reschedule, and stay on top of your commitments.',
    price: 500,
    category: 'productivity',
    features: [
      'View upcoming events',
      'Create and modify events',
      'Smart scheduling suggestions',
      'Meeting reminders',
      'Conflict detection',
      'Time zone handling',
    ],
    permissions: [
      {
        id: 'calendar.read',
        name: 'View calendar',
        description: 'See your calendar events',
        scope: 'https://www.googleapis.com/auth/calendar.readonly',
      },
      {
        id: 'calendar.write',
        name: 'Manage calendar',
        description: 'Create and edit calendar events',
        scope: 'https://www.googleapis.com/auth/calendar.events',
      },
    ],
    examples: [
      '"What\'s on my calendar today?"',
      '"Schedule a meeting with Tom tomorrow at 2pm"',
      '"Move my dentist appointment to Friday"',
      '"Remind me about the project deadline"',
      '"Find a free slot for a 1-hour meeting"',
    ],
    rating: 4.9,
    reviewCount: 98,
    isPopular: true,
  },
  {
    id: 'browser',
    name: 'Browser Automation',
    icon: '🌐',
    description: 'Automate web tasks, scraping, and form filling',
    longDescription: 'Let Ally browse the web for you. Automate repetitive tasks, extract data from websites, fill out forms, and more.',
    price: 1000,
    category: 'automation',
    features: [
      'Web scraping and data extraction',
      'Form filling automation',
      'Price monitoring',
      'Screenshot capture',
      'Multi-step workflows',
      'JavaScript execution',
    ],
    permissions: [
      {
        id: 'browser.navigate',
        name: 'Browse websites',
        description: 'Navigate to and interact with websites',
      },
      {
        id: 'browser.execute',
        name: 'Execute scripts',
        description: 'Run automation scripts on web pages',
      },
    ],
    examples: [
      '"Check the price of this product daily"',
      '"Fill out this job application for me"',
      '"Extract all contact emails from this page"',
      '"Take a screenshot of my dashboard"',
      '"Monitor this page for changes"',
    ],
    rating: 4.7,
    reviewCount: 67,
  },
  {
    id: 'voice',
    name: 'Voice Assistant',
    icon: '🎙️',
    description: 'Voice input/output, calls, and voice notes',
    longDescription: 'Talk to Ally naturally. Get voice responses, make phone calls, transcribe voice notes, and control everything hands-free.',
    price: 1500,
    category: 'communication',
    features: [
      'Voice input recognition',
      'Natural voice responses',
      'Phone call automation',
      'Voice note transcription',
      'Multiple voice options',
      'Hands-free operation',
    ],
    permissions: [
      {
        id: 'voice.input',
        name: 'Voice input',
        description: 'Listen to voice commands through microphone',
      },
      {
        id: 'voice.output',
        name: 'Voice output',
        description: 'Respond with synthesized speech',
      },
      {
        id: 'voice.calls',
        name: 'Phone calls',
        description: 'Make and receive phone calls',
      },
    ],
    examples: [
      '"Read my messages out loud"',
      '"Call the restaurant and make a reservation"',
      '"Transcribe this voice memo"',
      '"Set a voice reminder for 5pm"',
      '"Read this article to me"',
    ],
    rating: 4.8,
    reviewCount: 54,
  },
  {
    id: 'multi-agent',
    name: 'Multi-Agent Teams',
    icon: '👥',
    description: 'Parallel AI workers with specialized skills',
    longDescription: 'Supercharge productivity with multiple AI agents working in parallel. Assign specialized tasks to different workers and orchestrate complex workflows.',
    price: 2000,
    category: 'ai',
    features: [
      'Parallel task execution',
      'Specialized agent roles',
      'Team orchestration',
      'Task delegation',
      'Progress monitoring',
      'Result synthesis',
    ],
    permissions: [
      {
        id: 'agents.spawn',
        name: 'Spawn agents',
        description: 'Create new AI agent instances',
      },
      {
        id: 'agents.orchestrate',
        name: 'Orchestrate',
        description: 'Coordinate multiple agents',
      },
    ],
    examples: [
      '"Research these 5 topics in parallel"',
      '"Have one agent write while another edits"',
      '"Split this analysis into 3 parts"',
      '"Create a research team for this project"',
      '"Run multiple data analyses simultaneously"',
    ],
    rating: 4.9,
    reviewCount: 31,
    isNew: true,
  },
  {
    id: 'smart-home',
    name: 'Smart Home Control',
    icon: '🏠',
    description: 'Control lights, thermostats, and smart devices',
    longDescription: 'Turn your AI assistant into a smart home hub. Control lights, thermostats, locks, and other smart devices through natural conversation.',
    price: 500,
    category: 'automation',
    features: [
      'Light control',
      'Thermostat management',
      'Smart lock control',
      'Scene automation',
      'Device status monitoring',
      'Voice activation',
    ],
    permissions: [
      {
        id: 'home.control',
        name: 'Device control',
        description: 'Control smart home devices',
      },
      {
        id: 'home.status',
        name: 'Device status',
        description: 'View status of smart home devices',
      },
    ],
    examples: [
      '"Turn off all the lights"',
      '"Set the thermostat to 72"',
      '"Lock the front door"',
      '"Activate movie night scene"',
      '"Is the garage door closed?"',
    ],
    rating: 4.6,
    reviewCount: 45,
  },
  {
    id: 'research',
    name: 'Deep Research',
    icon: '🔬',
    description: 'Advanced web research with source verification',
    longDescription: 'Go beyond basic search. Ally conducts thorough research, verifies sources, synthesizes findings, and delivers comprehensive reports.',
    price: 800,
    category: 'data',
    features: [
      'Multi-source research',
      'Source verification',
      'Citation tracking',
      'Report generation',
      'Fact checking',
      'Summary synthesis',
    ],
    permissions: [
      {
        id: 'research.search',
        name: 'Web search',
        description: 'Search the web for information',
      },
      {
        id: 'research.analyze',
        name: 'Content analysis',
        description: 'Analyze and synthesize content',
      },
    ],
    examples: [
      '"Research the latest in quantum computing"',
      '"Compare these 5 competing products"',
      '"Find credible sources on climate policy"',
      '"Write a research brief on AI trends"',
      '"Verify these claims with sources"',
    ],
    rating: 4.8,
    reviewCount: 89,
  },
  {
    id: 'slack',
    name: 'Slack Integration',
    icon: '💬',
    description: 'Read, send, and manage Slack messages',
    longDescription: 'Stay on top of Slack without constant context switching. Ally can summarize channels, send messages, and help you manage notifications.',
    price: 500,
    category: 'communication',
    features: [
      'Channel summaries',
      'Send messages',
      'Thread management',
      'Notification filtering',
      'Search conversations',
      'Status updates',
    ],
    permissions: [
      {
        id: 'slack.read',
        name: 'Read messages',
        description: 'View messages in channels and DMs',
      },
      {
        id: 'slack.write',
        name: 'Send messages',
        description: 'Post messages on your behalf',
      },
    ],
    examples: [
      '"Summarize #general from today"',
      '"Send a message to the dev team"',
      '"What did I miss in #announcements?"',
      '"Reply to that thread about the deploy"',
      '"Set my status to away"',
    ],
    rating: 4.7,
    reviewCount: 76,
    comingSoon: true,
  },
  {
    id: 'github',
    name: 'GitHub Integration',
    icon: '🐙',
    description: 'Manage repos, PRs, and issues',
    longDescription: 'Streamline your development workflow. Ally helps you manage GitHub repositories, review PRs, track issues, and stay updated on project activity.',
    price: 800,
    category: 'productivity',
    features: [
      'PR review assistance',
      'Issue management',
      'Code search',
      'Repository insights',
      'Commit summaries',
      'Notification management',
    ],
    permissions: [
      {
        id: 'github.read',
        name: 'Read repositories',
        description: 'View repository content and metadata',
      },
      {
        id: 'github.write',
        name: 'Write access',
        description: 'Create issues, PRs, and comments',
      },
    ],
    examples: [
      '"Summarize the latest PRs"',
      '"Create an issue for this bug"',
      '"What\'s the status of issue #42?"',
      '"List open PRs needing review"',
      '"Show me recent commits to main"',
    ],
    rating: 4.8,
    reviewCount: 63,
    comingSoon: true,
  },
];

export const SKILL_BUNDLES: SkillBundle[] = [
  {
    id: 'productivity-pack',
    name: 'Productivity Pack',
    description: 'Gmail + Calendar for the ultimate productivity boost',
    skills: ['gmail', 'calendar'],
    originalPrice: 1000,
    bundlePrice: 800,
    savings: 20,
  },
  {
    id: 'automation-suite',
    name: 'Automation Suite',
    description: 'Browser + Voice for hands-free automation',
    skills: ['browser', 'voice'],
    originalPrice: 2500,
    bundlePrice: 2000,
    savings: 20,
  },
  {
    id: 'power-user-pack',
    name: 'Power User Pack',
    description: 'All 5 core skills at 29% off',
    skills: ['gmail', 'calendar', 'browser', 'voice', 'multi-agent'],
    originalPrice: 5500,
    bundlePrice: 3900,
    savings: 29,
    claimedPercent: 71,
  },
];

export const CATEGORY_LABELS: Record<Skill['category'], string> = {
  productivity: 'Productivity',
  automation: 'Automation',
  communication: 'Communication',
  ai: 'AI & Agents',
  data: 'Data & Research',
};

export const CATEGORY_COLORS: Record<Skill['category'], string> = {
  productivity: 'purple',
  automation: 'blue',
  communication: 'green',
  ai: 'pink',
  data: 'orange',
};
