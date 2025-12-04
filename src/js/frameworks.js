// Framework definitions with metadata
export const frameworkDefinitions = {
    // SENSING INTENT
    'project-charter': {
        id: 'project-charter',
        name: 'Project Charter',
        category: 'Sensing Intent',
        description: 'Define the foundational elements of a project, ensuring clarity on scope, objectives, and stakeholders.',
        icon: '📋',
        sections: [
            {
                id: 'project-name',
                title: 'Name of the Project',
                description: 'A clear and concise title for the project',
                placeholder: 'Example: "AI-Powered Customer Support System"'
            },
            {
                id: 'start-date',
                title: 'Start Date',
                description: 'The date the project begins',
                placeholder: 'Example: January 1, 2026'
            },
            {
                id: 'end-date',
                title: 'End Date',
                description: 'The expected completion date of the project',
                placeholder: 'Example: December 31, 2026'
            },
            {
                id: 'project-background',
                title: 'Project Background',
                description: 'Context and history leading to the initiation of the project',
                placeholder: 'Example: "The project was initiated to address increasing customer support demands."'
            },
            {
                id: 'intent',
                title: 'Intent',
                description: 'The purpose or motivation behind the project',
                placeholder: 'Example: "To enhance customer satisfaction through automated support."'
            },
            {
                id: 'goal',
                title: 'Goal',
                description: 'The overarching aim or objective of the project',
                placeholder: 'Example: "Reduce customer response time by 50%."'
            },
            {
                id: 'problem-space',
                title: 'Definition of Problem Space',
                description: 'A detailed description of the problem the project seeks to address',
                placeholder: 'Example: "Current customer support processes are slow and inefficient."'
            },
            {
                id: 'solution-description',
                title: 'Solution Description',
                description: 'A high-level overview of the proposed solution',
                placeholder: 'Example: "Implementing an AI chatbot to handle common queries."'
            },
            {
                id: 'in-scope',
                title: 'In-Scope Infrastructures/Products/Services/Mechanisms',
                description: 'A list of what is included within the project\'s scope',
                placeholder: 'Example: "Chatbot development, integration with CRM, and user training."'
            },
            {
                id: 'expected-outcomes',
                title: 'Expected Outcomes',
                description: 'The results or deliverables anticipated from the project',
                placeholder: 'Example: "A fully functional chatbot integrated with the CRM system."'
            },
            {
                id: 'success-measures',
                title: 'Measures of Success',
                description: 'Criteria or metrics to evaluate the project\'s success',
                placeholder: 'Example: "Achieving a 90% customer satisfaction rate."'
            },
            {
                id: 'key-stakeholders',
                title: 'Key Stakeholders',
                description: 'Individuals or groups with a vested interest in the project',
                placeholder: 'Example: "Customer Support Team, IT Department, and Project Sponsor."'
            },
            {
                id: 'potential-partnerships',
                title: 'Potential Partnerships',
                description: 'Organizations or entities that could collaborate on the project',
                placeholder: 'Example: "Partnering with an AI solutions provider."'
            },
            {
                id: 'location',
                title: 'Location',
                description: 'The geographical area or context where the project will be implemented',
                placeholder: 'Example: "Headquarters and regional offices."'
            }
        ]
    },
    'project-brief': {
        id: 'project-brief',
        name: 'Project Brief',
        category: 'Sensing Intent',
        description: 'Align key stakeholders on the high-level vision of a project with stakeholder roles and communication plans.',
        icon: '📝',
        sections: [
            {
                id: 'project-purpose',
                title: 'Project Purpose',
                description: 'A concise statement of why the project exists',
                placeholder: 'Example: "To develop a mobile app that simplifies personal finance management."'
            },
            {
                id: 'goals',
                title: 'Goals',
                description: 'The primary objectives the project aims to achieve',
                placeholder: 'Example: "Increase user adoption by 20% within the first year."'
            },
            {
                id: 'stakeholder-roles',
                title: 'Stakeholders - Roles',
                description: 'Define the roles of key stakeholders',
                placeholder: 'Example: Project Manager, Developers, Marketing Team'
            },
            {
                id: 'stakeholder-responsibilities',
                title: 'Stakeholders - Responsibilities',
                description: 'Outline what each stakeholder is responsible for',
                placeholder: 'Example: Developers are responsible for coding and testing the app.'
            },
            {
                id: 'communication-plan',
                title: 'Stakeholders - Communication Plan',
                description: 'Describe how stakeholders will communicate and collaborate',
                placeholder: 'Example: Weekly progress meetings and daily updates via Slack.'
            },
            {
                id: 'timeline-milestones',
                title: 'Timeline and Milestones',
                description: 'A high-level timeline with key milestones',
                placeholder: 'Example: "Prototype completion by Q1, beta testing by Q2, launch by Q3."'
            },
            {
                id: 'risks-challenges',
                title: 'Key Risks and Challenges',
                description: 'Potential obstacles or risks that could impact the project',
                placeholder: 'Example: "Delays in development due to resource constraints."'
            }
        ]
    },
    'canvas-business-plan': {
        id: 'canvas-business-plan',
        name: 'Canvas Business Plan',
        category: 'Sensing Intent',
        description: 'Provide a high-level overview of a business model based on the Business Model Canvas structure.',
        icon: '💼',
        sections: [
            {
                id: 'key-partners',
                title: 'Key Partners',
                description: 'External organizations, suppliers, or partners critical to the business',
                placeholder: 'Example: A coffee shop partnering with local bakeries to offer fresh pastries.'
            },
            {
                id: 'key-activities',
                title: 'Key Activities',
                description: 'The most important tasks and actions the business must perform',
                placeholder: 'Example: A software company focusing on continuous product development and customer support.'
            },
            {
                id: 'key-resources',
                title: 'Key Resources',
                description: 'Assets (physical, intellectual, human, or financial) required',
                placeholder: 'Example: A fashion brand relying on its design team and supply chain network.'
            },
            {
                id: 'value-propositions',
                title: 'Value Propositions',
                description: 'The unique value the business delivers to its customers',
                placeholder: 'Example: A meal delivery service offering healthy, pre-portioned ingredients.'
            },
            {
                id: 'customer-relationships',
                title: 'Customer Relationships',
                description: 'How the business interacts with and retains its customers',
                placeholder: 'Example: A subscription box service providing personalized support and loyalty rewards.'
            },
            {
                id: 'channels',
                title: 'Channels',
                description: 'Methods and platforms used to deliver the value proposition',
                placeholder: 'Example: An e-commerce store using its website and social media for sales.'
            },
            {
                id: 'customer-segments',
                title: 'Customer Segments',
                description: 'Target audience or groups of customers the business serves',
                placeholder: 'Example: A fitness app targeting young professionals seeking convenient workouts.'
            },
            {
                id: 'cost-structure',
                title: 'Cost Structure',
                description: 'Major costs associated with operating the business',
                placeholder: 'Example: A manufacturing company with high costs in raw materials and labor.'
            },
            {
                id: 'revenue-streams',
                title: 'Revenue Streams',
                description: 'How the business generates income from its value propositions',
                placeholder: 'Example: A streaming platform earning revenue through subscriptions and ads.'
            }
        ]
    },
    'company-background': {
        id: 'company-background',
        name: 'Company Background',
        category: 'Sensing Intent',
        description: 'Document and analyze the history, mission, vision, and key details of a company.',
        icon: '🏢',
        sections: [
            {
                id: 'company-overview',
                title: 'Company Overview',
                description: 'High-level summary including name, industry, headquarters, founding year',
                placeholder: 'Example: A tech startup founded in 2015 specializing in AI solutions.'
            },
            {
                id: 'mission-statement',
                title: 'Mission Statement',
                description: 'The company\'s purpose and core values',
                placeholder: 'Example: "To make technology accessible to everyone."'
            },
            {
                id: 'vision-statement',
                title: 'Vision Statement',
                description: 'The company\'s long-term goals and aspirations',
                placeholder: 'Example: "To be the leading provider of AI-driven solutions globally."'
            },
            {
                id: 'history',
                title: 'History',
                description: 'Summarize the company\'s key milestones and achievements',
                placeholder: 'Example: Launching the first product in 2016, reaching 1M users by 2020.'
            },
            {
                id: 'products-services',
                title: 'Products and Services',
                description: 'Describe the company\'s main offerings',
                placeholder: 'Example: Cloud-based software solutions, mobile applications.'
            },
            {
                id: 'target-market',
                title: 'Market Position - Target Market',
                description: 'The primary audience the company serves',
                placeholder: 'Example: Small and medium-sized businesses in the tech industry.'
            },
            {
                id: 'competitive-position',
                title: 'Market Position - Competitive Position',
                description: 'The company\'s standing relative to competitors',
                placeholder: 'Example: Known for innovation and customer-centric solutions.'
            },
            {
                id: 'strengths',
                title: 'Strengths',
                description: 'Internal advantages or unique capabilities',
                placeholder: 'Example: Strong R&D team, proprietary technology.'
            },
            {
                id: 'weaknesses',
                title: 'Weaknesses',
                description: 'Internal challenges or limitations',
                placeholder: 'Example: Limited market presence in Asia.'
            },
            {
                id: 'opportunities',
                title: 'Opportunities',
                description: 'External factors the company can leverage',
                placeholder: 'Example: Growing demand for AI solutions in healthcare.'
            }
        ]
    },

    // KNOWING CONTENT
    'resource-based-analysis': {
        id: 'resource-based-analysis',
        name: 'Resource-Based Analysis',
        category: 'Knowing Content',
        description: 'Assess and categorize resources across the 8 capitals of innovation to identify leverage points and gaps.',
        icon: '💎',
        sections: [
            {
                id: 'financial-capital',
                title: 'Financial Capital',
                description: 'Assess monetary resources, funding, and financial stability',
                placeholder: 'Leverage Points: Key areas where financial resources can be maximized...'
            },
            {
                id: 'political-capital',
                title: 'Political Capital',
                description: 'Evaluate influence, relationships, and alignment with policies',
                placeholder: 'Example: Strong relationships with policymakers can facilitate approvals.'
            },
            {
                id: 'social-capital',
                title: 'Social Capital',
                description: 'Analyze networks, relationships, and community engagement',
                placeholder: 'Example: Leveraging community partnerships to expand outreach.'
            },
            {
                id: 'digital-capital',
                title: 'Digital Capital',
                description: 'Assess technological assets, digital infrastructure, and data capabilities',
                placeholder: 'Example: Investing in cloud computing to enhance scalability.'
            },
            {
                id: 'natural-capital',
                title: 'Natural Capital',
                description: 'Evaluate environmental resources, sustainability practices, and ecological impact',
                placeholder: 'Example: Utilizing renewable energy sources to reduce carbon footprint.'
            },
            {
                id: 'manufactured-capital',
                title: 'Manufactured Capital',
                description: 'Assess physical assets, infrastructure, and tools',
                placeholder: 'Example: Upgrading machinery to improve production efficiency.'
            },
            {
                id: 'cultural-capital',
                title: 'Cultural Capital',
                description: 'Analyze cultural assets, values, and identity',
                placeholder: 'Example: Promoting diversity and inclusion to strengthen culture.'
            },
            {
                id: 'human-capital',
                title: 'Human Capital',
                description: 'Evaluate skills, knowledge, and expertise within the organization',
                placeholder: 'Example: Providing training programs to enhance employee skills.'
            }
        ]
    },
    'system-mapping': {
        id: 'system-mapping',
        name: 'System Mapping',
        category: 'Knowing Content',
        description: 'Visualize relationships, dependencies, and power dynamics within a system to identify leverage points.',
        icon: '🌐',
        sections: [
            {
                id: 'stakeholders',
                title: 'Stakeholders',
                description: 'Identify all relevant stakeholders within the system',
                placeholder: 'Example: Stakeholder A (Role: Supplier, Influence: High)'
            },
            {
                id: 'relationships',
                title: 'Relationships',
                description: 'Map the connections and interactions between stakeholders',
                placeholder: 'Example: Stakeholder A depends on Stakeholder B for raw materials.'
            },
            {
                id: 'power-dynamics',
                title: 'Power Dynamics',
                description: 'Analyze the distribution of power and influence within the system',
                placeholder: 'Example: Stakeholder C has significant influence due to control over key resources.'
            },
            {
                id: 'leverage-points',
                title: 'Leverage Points',
                description: 'Highlight areas where small changes could lead to significant impacts',
                placeholder: 'Example: Improving communication between Stakeholder A and B to reduce delays.'
            }
        ]
    },
    'market-segmentation': {
        id: 'market-segmentation',
        name: 'Market Segmentation',
        category: 'Knowing Content',
        description: 'Divide target market into distinct groups to identify the most valuable segments to prioritize.',
        icon: '📊',
        sections: [
            {
                id: 'market-overview',
                title: 'Market Overview',
                description: 'Provide a high-level description of the overall market',
                placeholder: 'Example: The global fitness industry, valued at $100 billion.'
            },
            {
                id: 'segmentation-criteria',
                title: 'Segmentation Criteria',
                description: 'Define the criteria used to segment the market',
                placeholder: 'Example: Segmenting by age group, income level, and fitness goals.'
            },
            {
                id: 'segment-profiles',
                title: 'Segment Profiles',
                description: 'Create detailed profiles for each segment',
                placeholder: 'Characteristics, Needs, and Preferences for each segment...'
            },
            {
                id: 'segment-value',
                title: 'Segment Value Assessment',
                description: 'Evaluate each segment based on size, profitability, accessibility, strategic fit',
                placeholder: 'Market Size, Profitability, Accessibility, Strategic Fit...'
            },
            {
                id: 'prioritization',
                title: 'Prioritization',
                description: 'Rank segments based on their value and strategic importance',
                placeholder: 'Example: Prioritizing young professionals due to high profitability.'
            }
        ]
    },
    'competitor-mapping': {
        id: 'competitor-mapping',
        name: 'Competitor Mapping',
        category: 'Knowing Content',
        description: 'Analyze competitors\' offerings and market positions to identify differentiation opportunities.',
        icon: '⚔️',
        sections: [
            {
                id: 'competitor-overview',
                title: 'Competitor Overview',
                description: 'Name, industry, key offerings, market position',
                placeholder: 'Example: Competitor A is a leading provider of cloud storage with 30% market share.'
            },
            {
                id: 'buyer-utility-analysis',
                title: 'Buyer Utility Analysis',
                description: 'Map competitors across utility levers and buyer experience stages',
                placeholder: 'Utility Levers: Performance, simplicity, convenience, risk reduction, fun/image...'
            },
            {
                id: 'differentiation-opportunities',
                title: 'Opportunities for Differentiation',
                description: 'Highlight areas where your offering can stand out',
                placeholder: 'Example: Introducing a subscription model to address affordability gaps.'
            },
            {
                id: 'market-threats',
                title: 'Market Threats',
                description: 'Analyze competitors\' strengths that pose risks',
                placeholder: 'Example: Competitor C\'s strong brand loyalty and distribution network.'
            }
        ]
    },

    // KNOWING PEOPLE
    'stakeholder-mapping': {
        id: 'stakeholder-mapping',
        name: 'Stakeholder Mapping',
        category: 'Knowing People',
        description: 'Identify and categorize stakeholders based on influence, interest, and roles with optional 8 capitals analysis.',
        icon: '👥',
        sections: [
            {
                id: 'stakeholder-identification',
                title: 'Stakeholder Identification',
                description: 'List all relevant stakeholders and define their roles',
                placeholder: 'Example: Stakeholder A (Role: Project Manager, Influence: High, Interest: High)'
            },
            {
                id: 'stakeholder-categorization',
                title: 'Stakeholder Categorization',
                description: 'Map stakeholders based on influence (High/Medium/Low) and interest (High/Medium/Low)',
                placeholder: 'Place stakeholders in a 2x2 matrix (Influence vs. Interest)...'
            },
            {
                id: 'stakeholder-roles',
                title: 'Stakeholder Roles',
                description: 'Define the specific roles and responsibilities of each stakeholder',
                placeholder: 'Example: Stakeholder C is responsible for approving project budgets.'
            },
            {
                id: '8-capitals-analysis',
                title: 'Optional: 8 Capitals Analysis',
                description: 'Assess stakeholders\' contributions across the 8 capitals of innovation',
                placeholder: 'Financial, Political, Social, Digital, Natural, Manufactured, Cultural, Human...'
            }
        ]
    },
    'power-dynamics-mapping': {
        id: 'power-dynamics-mapping',
        name: 'Power Dynamics Mapping',
        category: 'Knowing People',
        description: 'Analyze distribution of power and influence among stakeholders to surface imbalances and risks.',
        icon: '⚡',
        sections: [
            {
                id: 'stakeholder-list',
                title: 'Stakeholder List',
                description: 'Name, Role, Power Level (Low/Medium/High), Influence Level (Low/Medium/High)',
                placeholder: 'Example: Stakeholder A (Role: Project Manager, Power: High, Influence: Medium)'
            },
            {
                id: 'sources-of-power',
                title: 'Sources of Power (per stakeholder)',
                description: 'Authority, Resources, Expertise, Network, Legitimacy, Information Control',
                placeholder: 'Example: Stakeholder B has high authority and expertise but limited network.'
            },
            {
                id: 'power-relationships',
                title: 'Power Relationships',
                description: 'Directional influence pairs (e.g., Stakeholder A → Stakeholder B)',
                placeholder: 'Example: Stakeholder A influences B through resource allocation.'
            },
            {
                id: 'imbalance-risk-flags',
                title: 'Imbalance & Risk Flags',
                description: 'Auto-detected triggers: High power + Low transparency, conflicting stakeholders, etc.',
                placeholder: 'A. Single stakeholder with High power and Low transparency...'
            },
            {
                id: 'sensitive-stakeholders',
                title: 'Sensitive Stakeholders',
                description: 'Stakeholders requiring special attention due to volatility, gatekeeping, etc.',
                placeholder: 'Example: Stakeholder D is sensitive due to their gatekeeping role.'
            }
        ]
    },
    'synthesize-research': {
        id: 'synthesize-research',
        name: 'Synthesize Research',
        category: 'Knowing People',
        description: 'Organize and distill research findings into a structured hierarchy: facts, findings, insights, themes.',
        icon: '🔬',
        sections: [
            {
                id: 'facts',
                title: 'Facts',
                description: 'Individual data points or observations from research',
                placeholder: 'Example: "50% of users prefer X," "Customer feedback highlights Y."'
            },
            {
                id: 'key-findings',
                title: 'Key Findings',
                description: 'Patterns or trends derived from 3+ related facts',
                placeholder: 'Example: "Users prefer X because of its simplicity."'
            },
            {
                id: 'insights',
                title: 'Insights',
                description: 'Deeper understanding derived from 3+ key findings',
                placeholder: 'Example: "Simplicity is a critical driver of user satisfaction."'
            },
            {
                id: 'themes',
                title: 'Themes',
                description: 'Overarching concepts derived from 3+ insights',
                placeholder: 'Example: "Focus on simplicity to enhance user experience."'
            }
        ]
    },

    // FRAMING INSIGHTS
    'journey-mapping': {
        id: 'journey-mapping',
        name: 'Journey Mapping',
        category: 'Framing Insights',
        description: 'Visualize user journey using the 5E framework to identify friction points, passion points, and opportunities.',
        icon: '🗺️',
        sections: [
            {
                id: 'entice',
                title: 'Journey Steps - Entice',
                description: 'How the user becomes aware of and attracted to the product/service',
                placeholder: 'Example: A user sees a targeted ad on social media.'
            },
            {
                id: 'enter',
                title: 'Journey Steps - Enter',
                description: 'The user\'s first interaction or onboarding experience',
                placeholder: 'Example: Signing up for a free trial on a website.'
            },
            {
                id: 'engage',
                title: 'Journey Steps - Engage',
                description: 'How the user interacts with the product/service over time',
                placeholder: 'Example: Regularly using a fitness app to track workouts.'
            },
            {
                id: 'exit',
                title: 'Journey Steps - Exit',
                description: 'The user\'s process of leaving or completing the experience',
                placeholder: 'Example: Cancelling a subscription after achieving fitness goals.'
            },
            {
                id: 'extend',
                title: 'Journey Steps - Extend',
                description: 'How the experience continues to provide value after exit',
                placeholder: 'Example: Receiving follow-up emails with tips and offers.'
            },
            {
                id: 'friction-points',
                title: 'Friction Points',
                description: 'Pain points or obstacles at each step of the 5E framework',
                placeholder: 'Example: Difficulty navigating the app during onboarding.'
            },
            {
                id: 'passion-points',
                title: 'Passion Points',
                description: 'Moments where the user experiences delight or strong positive emotions',
                placeholder: 'Example: Unlocking a milestone badge in the app.'
            },
            {
                id: 'moments-that-matter',
                title: 'Moments That Matter',
                description: 'Critical moments with greatest impact on overall experience',
                placeholder: 'Example: A seamless checkout process that encourages repeat purchases.'
            },
            {
                id: 'opportunities',
                title: 'Opportunities for Improvement',
                description: 'Specific actions to address friction points and enhance key moments',
                placeholder: 'Example: Simplifying onboarding to reduce user drop-off rates.'
            }
        ]
    },
    'translating-themes-to-opportunity-spaces': {
        id: 'translating-themes-to-opportunity-spaces',
        name: 'Translating Themes to Opportunity Spaces',
        category: 'Framing Insights',
        description: 'Convert synthesized themes into actionable opportunity areas for innovation or strategy.',
        icon: '💡',
        sections: [
            {
                id: 'themes',
                title: 'Themes',
                description: 'List the synthesized themes derived from research insights',
                placeholder: 'Example: "Theme: Simplicity. Description: Users value products that are easy to use."'
            },
            {
                id: 'opportunity-areas',
                title: 'Opportunity Areas',
                description: 'For each theme, identify actionable opportunity areas',
                placeholder: 'Example: "Opportunity: Develop a user-friendly interface to reduce onboarding time."'
            },
            {
                id: 'opportunity-statements',
                title: 'Opportunity Statements',
                description: 'Articulate each opportunity as: "How might we [action] to [outcome] for [user/group]?"',
                placeholder: 'Example: "How might we simplify onboarding to improve retention for first-time customers?"'
            },
            {
                id: 'supporting-insights',
                title: 'Supporting Insights',
                description: 'Link each opportunity to the insights and themes that support it',
                placeholder: 'Example: "Insight: 70% of users reported difficulty during onboarding."'
            }
        ]
    },

    // FRAMING SOLUTIONS
    'strategic-purpose': {
        id: 'strategic-purpose',
        name: 'Strategic Purpose',
        category: 'Framing Solutions',
        description: 'Define a clear purpose statement using the format: contribution, impact, and jobs to be done.',
        icon: '🎯',
        sections: [
            {
                id: 'purpose-statement',
                title: 'Purpose Statement',
                description: '"Our purpose is to [contribution] so that [impact] by [jobs to be done]."',
                placeholder: 'Example: "To empower small businesses with digital tools so that they thrive by providing accessible technology."'
            },
            {
                id: 'contribution',
                title: 'Contribution',
                description: 'The specific contribution the organization makes',
                placeholder: 'Examples: Providing innovative solutions, creating sustainable practices...'
            },
            {
                id: 'impact',
                title: 'Impact',
                description: 'The broader impact or change the organization aims to achieve',
                placeholder: 'Examples: Improving quality of life, reducing environmental harm...'
            },
            {
                id: 'jobs-to-be-done',
                title: 'Jobs to Be Done',
                description: 'Specific actions or tasks the organization will undertake',
                placeholder: 'Examples: Developing user-friendly software, offering training programs...'
            },
            {
                id: 'alignment',
                title: 'Alignment with Goals and Values',
                description: 'Ensure the purpose statement aligns with long-term goals and core values',
                placeholder: 'Provide a checklist or criteria for alignment...'
            }
        ]
    },
    'strategic-roadmap': {
        id: 'strategic-roadmap',
        name: 'Strategic Roadmap',
        category: 'Framing Solutions',
        description: 'Define a clear path from current state to future purpose with vectors of investment and waves of initiatives.',
        icon: '🛣️',
        sections: [
            {
                id: 'future-purpose',
                title: 'Frame Purpose as the Future State',
                description: '"Our purpose is to [contribution] so that [impact] by [jobs to be done]."',
                placeholder: 'Example: "To revolutionize urban mobility so cities become sustainable by developing electric transportation."'
            },
            {
                id: 'current-state',
                title: 'Summarize the Current State',
                description: 'Current position, differentiated assets, capabilities, and gaps',
                placeholder: 'Example: "Strong R&D capabilities but limited market penetration."'
            },
            {
                id: 'vector-customers',
                title: 'Vector: Customers and Influencers',
                description: 'Target customer segments, geographic markets, and evolution over time',
                placeholder: 'Example: "Focus on urban millennials in North America and Europe."'
            },
            {
                id: 'vector-offerings',
                title: 'Vector: Offerings and Value Proposition',
                description: 'Value proposition, customer experience, and new innovations',
                placeholder: 'Example: "Developing a subscription-based electric scooter service."'
            },
            {
                id: 'vector-processes',
                title: 'Vector: Processes and Workflow',
                description: 'Business process redesign to deliver value proposition',
                placeholder: 'Example: "Streamlining supply chain operations to reduce costs."'
            },
            {
                id: 'vector-technology',
                title: 'Vector: Technology and Data Analytics',
                description: 'Technology systems, data, and analytics capabilities',
                placeholder: 'Example: "Implementing AI-driven analytics to optimize fleet management."'
            },
            {
                id: 'vector-people',
                title: 'Vector: People, Organization, and Partnerships',
                description: 'New organizational roles and partnerships required',
                placeholder: 'Example: "Partnering with renewable energy providers to power the fleet."'
            },
            {
                id: 'waves-of-initiatives',
                title: 'Create Waves of Initiatives',
                description: 'Sequential waves (Wave 1, Wave 2, Wave N) based on priority and timing',
                placeholder: 'Example: "Wave 1: Launch pilot programs in two cities. Wave 2: Expand to 10 cities."'
            },
            {
                id: 'initiatives-detail',
                title: 'Detail Initiatives per Vector',
                description: 'Break down each initiative within the vectors of investment',
                placeholder: 'Example: "Vector: Technology. Initiative: Develop mobile app for real-time tracking."'
            }
        ]
    },
    'leverage-points-and-interventions': {
        id: 'leverage-points-and-interventions',
        name: 'Leverage Points and Interventions',
        category: 'Framing Solutions',
        description: 'Identify and prioritize system leverage points where small changes can lead to significant improvements.',
        icon: '🎚️',
        sections: [
            {
                id: 'system-overview',
                title: 'System Overview',
                description: 'High-level description of the system being analyzed',
                placeholder: 'Example: A supply chain system with multiple vendors and distribution centers.'
            },
            {
                id: 'leverage-points',
                title: 'Leverage Points',
                description: 'Points where small changes can lead to significant improvements',
                placeholder: 'Categorize: parameters, feedback loops, system structure, or goals...'
            },
            {
                id: 'intervention-opportunities',
                title: 'Intervention Opportunities',
                description: 'Specific actions or changes at each leverage point',
                placeholder: 'Example: Implementing real-time tracking to improve delivery efficiency.'
            },
            {
                id: 'prioritization',
                title: 'Prioritization',
                description: 'Rank leverage points based on potential impact and feasibility',
                placeholder: 'Example: Prioritizing low-cost, high-impact interventions.'
            },
            {
                id: 'action-plan',
                title: 'Action Plan',
                description: 'Plan for implementing top-priority interventions',
                placeholder: 'Include timelines, responsibilities, and success metrics...'
            }
        ]
    }
};

// Get framework by ID
export function getFramework(frameworkId) {
    return frameworkDefinitions[frameworkId] || null;
}

// Get all frameworks
export function getAllFrameworks() {
    return Object.values(frameworkDefinitions);
}

// Get frameworks by category
export function getFrameworksByCategory(category) {
    return getAllFrameworks().filter(fw => fw.category === category);
}
