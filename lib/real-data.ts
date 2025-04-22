export interface PodcastMention {
  podcast: string
  episode: string
  timestamp: string
}

export interface SampleChat {
  question: string
  response: string
}

export interface InsightTopic {
  id: string
  company: string
  topic: string
  summary: string
  tags: string[]
  mentionedIn: PodcastMention[]
  sampleChat: SampleChat
}

export const realInsights: InsightTopic[] = [
  // Salesforce
  {
    id: "salesforce-1",
    company: "Salesforce",
    topic: "Salesforce Einstein Copilot Expands to Industry Clouds",
    summary:
      "In 2025, Salesforce expanded its Einstein Copilot to Financial Services and Health Cloud products. These AI assistants are built to automate client insights, case summaries, and workflow recommendations within highly regulated environments.",
    tags: ["Salesforce", "Einstein Copilot", "Financial Services", "Health Cloud", "AI Automation"],
    mentionedIn: [
      {
        podcast: "Insightful Investor",
        episode: "31",
        timestamp: "00:18:10 – 00:20:50",
      },
      {
        podcast: "WSJ Podcasts",
        episode: "706",
        timestamp: "00:09:45 – 00:11:30",
      },
    ],
    sampleChat: {
      question: "How is Einstein Copilot tailored for specific industries?",
      response:
        "Einstein Copilot for Financial Services and Health Cloud is trained on domain-specific workflows. It surfaces client insights, assists with compliance documentation, and enhances service agent productivity through AI recommendations.",
    },
  },
  {
    id: "salesforce-2",
    company: "Salesforce",
    topic: "Salesforce Launches Data Cloud for Real-Time Personalization",
    summary:
      "Salesforce introduced its real-time Data Cloud platform in late 2024 to unify customer data and power live personalization across Marketing Cloud, Commerce Cloud, and Service Cloud.",
    tags: ["Salesforce", "Data Cloud", "Personalization", "Customer Experience", "CDP"],
    mentionedIn: [
      {
        podcast: "The AI Fix",
        episode: "23",
        timestamp: "00:12:00 – 00:14:30",
      },
      {
        podcast: "WSJ Podcasts",
        episode: "704",
        timestamp: "00:10:20 – 00:12:10",
      },
    ],
    sampleChat: {
      question: "What does Salesforce's Data Cloud offer?",
      response:
        "Salesforce Data Cloud unifies customer data in real time, allowing brands to deliver personalized experiences across email, web, and mobile. It's especially useful for tailoring recommendations and proactive service responses.",
    },
  },

  // NVIDIA
  {
    id: "nvidia-1",
    company: "NVIDIA",
    topic: "NVIDIA Dominates AI Chip Market in Early 2025",
    summary:
      "NVIDIA continues to lead the AI hardware space with its H100 and next-gen Blackwell chips seeing widespread adoption. Industry analysts in early 2025 cite NVIDIA's strong software ecosystem (CUDA, TensorRT) as key to its competitive moat in cloud and enterprise AI deployments.",
    tags: ["NVIDIA", "AI Chips", "Blackwell", "CUDA", "Enterprise AI"],
    mentionedIn: [
      {
        podcast: "All-in Podcast",
        episode: "145",
        timestamp: "00:12:00 – 00:15:30",
      },
      {
        podcast: "WSJ Podcasts",
        episode: "699",
        timestamp: "00:18:20 – 00:20:00",
      },
    ],
    sampleChat: {
      question: "What makes NVIDIA's Blackwell chips so competitive in 2025?",
      response:
        "Blackwell chips offer higher throughput and lower energy consumption, optimized for generative AI. Combined with NVIDIA's mature software stack, they give developers an efficient platform for scaling AI models in enterprise environments.",
    },
  },
  {
    id: "nvidia-2",
    company: "NVIDIA",
    topic: "NVIDIA's 2024 Q4 Earnings Surpass Expectations",
    summary:
      "NVIDIA reported record Q4 2024 earnings, driven by data center demand and strong GPU sales for AI training. Podcast hosts emphasize the growing role of AI infrastructure in revenue and how NVIDIA is positioning itself as an AI-first company.",
    tags: ["NVIDIA", "Earnings", "Data Center", "AI Training", "Q4 2024"],
    mentionedIn: [
      {
        podcast: "Insightful Investor",
        episode: "29",
        timestamp: "00:10:30 – 00:13:00",
      },
      {
        podcast: "WSJ Podcasts",
        episode: "695",
        timestamp: "00:14:00 – 00:16:00",
      },
    ],
    sampleChat: {
      question: "Why did NVIDIA beat expectations in Q4 2024?",
      response:
        "Explosive demand for data center GPUs and strong AI spending by hyperscalers like AWS and Microsoft helped drive earnings. NVIDIA's positioning as a full-stack AI infrastructure provider gave it a unique advantage.",
    },
  },
  {
    id: "nvidia-3",
    company: "NVIDIA",
    topic: "NVIDIA Partners with Major Automakers for AI-Powered Vehicles",
    summary:
      "In early 2025, NVIDIA expanded its partnerships with global automakers to power next-gen driver assistance systems using its DRIVE platform. Podcast conversations suggest this will accelerate AI adoption in mobility and autonomous tech.",
    tags: ["NVIDIA", "Automotive", "AI", "DRIVE", "ADAS"],
    mentionedIn: [
      {
        podcast: "WSJ Podcasts",
        episode: "700",
        timestamp: "00:11:40 – 00:14:15",
      },
      {
        podcast: "Lex Fridman Podcast",
        episode: "415",
        timestamp: "01:10:10 – 01:13:45",
      },
    ],
    sampleChat: {
      question: "How is NVIDIA's DRIVE platform impacting automotive AI?",
      response:
        "NVIDIA's DRIVE platform enables real-time processing for ADAS and autonomous driving features. Its adoption by major automakers in 2025 signals a growing trend of AI-native vehicle systems with scalable performance and safety features.",
    },
  },
  {
    id: "nvidia-4",
    company: "NVIDIA",
    topic: "NVIDIA Launches AI Cloud Services for Enterprises",
    summary:
      "To reduce reliance on hyperscaler partnerships, NVIDIA has launched its own AI cloud services for model training and inference in early 2025. Analysts believe this could challenge traditional cloud providers by offering optimized end-to-end AI compute.",
    tags: ["NVIDIA", "Cloud AI", "Enterprise AI", "Model Training", "Inference"],
    mentionedIn: [
      {
        podcast: "The AI Podcast",
        episode: "51",
        timestamp: "00:08:30 – 00:11:20",
      },
      {
        podcast: "No Priors: Artificial Intelligence",
        episode: "63",
        timestamp: "00:15:40 – 00:18:05",
      },
    ],
    sampleChat: {
      question: "What's the strategy behind NVIDIA launching its own AI cloud services?",
      response:
        "NVIDIA aims to control more of the AI pipeline by offering tailored infrastructure and services. This gives enterprises access to hardware-optimized environments for faster training and inference, reducing dependence on third-party cloud providers.",
    },
  },

  // Google
  {
    id: "google-1",
    company: "Google",
    topic: "Google DeepMind Unveils Gemini Ultra for Enterprise AI",
    summary:
      "In 2025, Google DeepMind launched Gemini Ultra, a highly capable language model designed for enterprise use. Analysts emphasize its integration with Google Cloud and Workspace, enabling advanced summarization, document generation, and research tasks.",
    tags: ["Google", "Gemini Ultra", "Google Cloud", "Enterprise AI", "LLM"],
    mentionedIn: [
      {
        podcast: "No Priors: Artificial Intelligence",
        episode: "66",
        timestamp: "00:19:20 – 00:22:30",
      },
      {
        podcast: "WSJ Podcasts",
        episode: "705",
        timestamp: "00:13:10 – 00:15:00",
      },
    ],
    sampleChat: {
      question: "How is Gemini Ultra being used by businesses in 2025?",
      response:
        "Gemini Ultra powers enterprise tasks like meeting summarization, contract drafting, and customer service automation across Google Workspace. Its integration into Google Cloud makes it a strong competitor to Microsoft's Copilot offerings.",
    },
  },
  {
    id: "google-2",
    company: "Google",
    topic: "Google Search Adds Generative AI Snapshots",
    summary:
      "As of early 2025, Google has fully rolled out AI-generated snapshots to Search results, offering users summarized answers at the top of queries. This move signals a shift from traditional link lists to context-aware search experiences.",
    tags: ["Google", "Search", "Generative AI", "User Experience", "AI Snapshots"],
    mentionedIn: [
      {
        podcast: "WSJ Podcasts",
        episode: "707",
        timestamp: "00:08:40 – 00:11:05",
      },
      {
        podcast: "Lex Fridman Podcast",
        episode: "418",
        timestamp: "00:42:15 – 00:46:00",
      },
    ],
    sampleChat: {
      question: "What are AI snapshots in Google Search?",
      response:
        "AI snapshots are short summaries that appear above traditional search results, generated by Google's LLMs. They help users get quick answers without clicking through multiple links, transforming how people interact with search.",
    },
  },

  // Microsoft
  {
    id: "microsoft-1",
    company: "Microsoft",
    topic: "Microsoft Expands Copilot Integration Across Office and Azure",
    summary:
      "In early 2025, Microsoft expanded its AI assistant, Copilot, to more services in the Office suite and Azure cloud tools. Podcast analysts discuss how this positions Microsoft as a productivity AI leader, blending LLM capabilities with enterprise workflows.",
    tags: ["Microsoft", "Copilot", "Office 365", "Azure", "Productivity AI"],
    mentionedIn: [
      {
        podcast: "No Priors: Artificial Intelligence",
        episode: "65",
        timestamp: "00:22:00 – 00:25:10",
      },
      {
        podcast: "WSJ Podcasts",
        episode: "702",
        timestamp: "00:12:15 – 00:14:00",
      },
    ],
    sampleChat: {
      question: "How is Microsoft using Copilot to enhance productivity?",
      response:
        "Microsoft Copilot uses large language models to assist with writing, analysis, and scheduling directly in Office apps like Word, Excel, and Outlook. In Azure, it helps developers with code suggestions, deployment tasks, and data insights — embedding AI deeply into enterprise workflows.",
    },
  },
  {
    id: "microsoft-2",
    company: "Microsoft",
    topic: "Microsoft Reports Strong Cloud Growth Led by AI Services",
    summary:
      "Microsoft's Q4 2024 earnings showed strong growth in Azure, fueled by demand for AI infrastructure and services. Analysts discuss how Microsoft is monetizing its OpenAI partnership by embedding models into Azure offerings.",
    tags: ["Microsoft", "Azure", "Cloud", "OpenAI", "Q4 2024 Earnings"],
    mentionedIn: [
      {
        podcast: "Insightful Investor",
        episode: "30",
        timestamp: "00:14:40 – 00:17:30",
      },
      {
        podcast: "WSJ Podcasts",
        episode: "696",
        timestamp: "00:09:10 – 00:11:00",
      },
    ],
    sampleChat: {
      question: "Why did Microsoft's cloud segment perform well in Q4 2024?",
      response:
        "Azure saw strong demand for AI-enabled services, particularly those using OpenAI models like GPT-4. Enterprises are adopting AI to modernize apps, automate processes, and analyze data — all areas where Microsoft provides integrated solutions.",
    },
  },
  {
    id: "microsoft-3",
    company: "Microsoft",
    topic: "Microsoft Launches Small Language Model for Enterprise Use",
    summary:
      "In 2025, Microsoft introduced a small, efficient language model designed for internal enterprise deployments. The move addresses demand for private, scalable AI solutions that don't require full cloud dependence.",
    tags: ["Microsoft", "SLM", "Enterprise AI", "AI Privacy", "Cloud Alternatives"],
    mentionedIn: [
      {
        podcast: "The AI Fix",
        episode: "21",
        timestamp: "00:11:50 – 00:14:00",
      },
      {
        podcast: "WSJ Podcasts",
        episode: "703",
        timestamp: "00:16:30 – 00:18:10",
      },
    ],
    sampleChat: {
      question: "What's the benefit of Microsoft releasing a small language model for enterprises?",
      response:
        "Small language models are easier to deploy on-premises or in private clouds. Microsoft's offering allows companies to maintain data control while still benefiting from conversational AI capabilities — ideal for industries with strict compliance requirements.",
    },
  },
  {
    id: "microsoft-4",
    company: "Microsoft",
    topic: "Microsoft Teams Becomes a Central AI Hub for Enterprises",
    summary:
      "With new features in early 2025, Microsoft Teams is evolving into a central AI interface for daily work. Podcast discussions explore how embedded assistants help with meeting notes, task summarization, and follow-up tracking.",
    tags: ["Microsoft", "Teams", "Collaboration", "AI Productivity", "Workplace Automation"],
    mentionedIn: [
      {
        podcast: "Lex Fridman Podcast",
        episode: "416",
        timestamp: "00:59:00 – 01:03:10",
      },
      {
        podcast: "WSJ Podcasts",
        episode: "701",
        timestamp: "00:08:40 – 00:10:45",
      },
    ],
    sampleChat: {
      question: "How is Microsoft integrating AI into Teams?",
      response:
        "Teams now features AI tools that can auto-generate meeting summaries, suggest follow-up actions, and integrate with Copilot to retrieve and contextualize company documents during live discussions — streamlining communication and collaboration.",
    },
  },

  // Apple
  {
    id: "apple-1",
    company: "Apple",
    topic: "Apple's 2025 AI Roadmap and On-Device Intelligence Expansion",
    summary:
      "In early 2025, Apple is accelerating its push into on-device AI with the anticipated release of iOS 18. Discussions highlight the company's strategy to enhance Siri and on-device intelligence while maintaining strict privacy controls. New AI features are expected to integrate directly into messaging, photos, and productivity apps.",
    tags: ["Apple", "AI", "iOS 18", "Privacy", "Edge Computing"],
    mentionedIn: [
      {
        podcast: "Lex Fridman Podcast",
        episode: "412",
        timestamp: "00:50:10 – 00:54:45",
      },
      {
        podcast: "All-in Podcast",
        episode: "145",
        timestamp: "00:22:00 – 00:25:30",
      },
      {
        podcast: "WSJ Podcasts",
        episode: "698",
        timestamp: "00:14:15 – 00:16:05",
      },
    ],
    sampleChat: {
      question: "What are the new AI features expected in iOS 18?",
      response:
        "Apple is expected to introduce features like AI-driven message summarization, intelligent photo organization, and offline voice interactions in iOS 18. These capabilities will run directly on-device, preserving user privacy and enhancing responsiveness.",
    },
  },
  {
    id: "apple-2",
    company: "Apple",
    topic: "Apple's Services Segment Hits Record Growth in Q4 2024",
    summary:
      "Apple reported record-high revenue in its services segment in Q4 2024, driven by strong performance in Apple One bundles and App Store developer earnings. Analysts point to services as Apple's most resilient segment amid hardware volatility.",
    tags: ["Apple", "Services", "Q4 2024 Earnings", "App Store", "Apple One"],
    mentionedIn: [
      {
        podcast: "Insightful Investor",
        episode: "28",
        timestamp: "00:19:40 – 00:22:10",
      },
      {
        podcast: "WSJ Podcasts",
        episode: "691",
        timestamp: "00:10:00 – 00:11:50",
      },
    ],
    sampleChat: {
      question: "Why did Apple's services revenue grow so much in late 2024?",
      response:
        "Growth was driven by increased adoption of Apple One, strong App Store holiday activity, and rising demand for digital services. These segments provide consistent recurring revenue and higher margins compared to hardware sales.",
    },
  },
  {
    id: "apple-3",
    company: "Apple",
    topic: "iPhone 16 Gains Traction in India and Southeast Asia",
    summary:
      "Released in late 2024, the iPhone 16 is gaining traction in emerging markets, especially India and Indonesia. Discussions cite better localized pricing, longer battery life, and improved camera AI as key selling points.",
    tags: ["Apple", "iPhone 16", "India", "Emerging Markets", "Mobile AI"],
    mentionedIn: [
      {
        podcast: "Mad Money",
        episode: "1083",
        timestamp: "00:13:20 – 00:15:05",
      },
      {
        podcast: "WSJ Podcasts",
        episode: "689",
        timestamp: "00:16:30 – 00:18:10",
      },
    ],
    sampleChat: {
      question: "What's driving iPhone 16 sales in India?",
      response:
        "Key factors include localized pricing, Apple's manufacturing footprint in India, and popular new features like AI-assisted photography and longer battery life — making it competitive in the mid-to-premium market segment.",
    },
  },
  {
    id: "apple-4",
    company: "Apple",
    topic: "Apple Vision Pro Launches in Global Markets Early 2025",
    summary:
      "Following a limited U.S. release in late 2024, Apple launched the Vision Pro in international markets in Q1 2025. Tech analysts are watching how the global reception will shape Apple's spatial computing roadmap.",
    tags: ["Apple", "Vision Pro", "Spatial Computing", "Global Launch", "XR"],
    mentionedIn: [
      {
        podcast: "Acquired",
        episode: "157",
        timestamp: "00:39:50 – 00:43:00",
      },
      {
        podcast: "All-in Podcast",
        episode: "144",
        timestamp: "00:31:10 – 00:34:20",
      },
    ],
    sampleChat: {
      question: "How is the Vision Pro being received internationally?",
      response:
        "Early reports suggest strong interest in Asia and Europe, especially among developers and creative professionals. Adoption is still niche, but it sets the stage for more affordable models and expanded content partnerships later in 2025.",
    },
  },
]
