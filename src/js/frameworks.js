// Framework definitions with metadata
export const frameworkDefinitions = {
    'project-charter': {
        id: 'project-charter',
        name: 'Project Charter',
        category: 'Sensing Intent',
        description: 'Define the project scope, objectives, stakeholders, and constraints to establish a clear foundation.',
        icon: '📋',
        sections: [
            {
                id: 'project-overview',
                title: 'Project Overview',
                description: 'Provide a high-level summary of the project',
                placeholder: 'Describe the project purpose, goals, and expected outcomes...'
            },
            {
                id: 'objectives',
                title: 'Objectives',
                description: 'List specific, measurable objectives',
                placeholder: 'What are the key objectives this project aims to achieve?'
            },
            {
                id: 'scope',
                title: 'Scope',
                description: 'Define what is included and excluded',
                placeholder: 'What is in scope and out of scope for this project?'
            },
            {
                id: 'stakeholders',
                title: 'Stakeholders',
                description: 'Identify key stakeholders and their roles',
                placeholder: 'Who are the primary stakeholders and what are their interests?'
            },
            {
                id: 'constraints',
                title: 'Constraints',
                description: 'List limitations and constraints',
                placeholder: 'What are the time, budget, resource, or technical constraints?'
            },
            {
                id: 'success-criteria',
                title: 'Success Criteria',
                description: 'Define how success will be measured',
                placeholder: 'What metrics or criteria will indicate project success?'
            }
        ]
    },
    'project-brief': {
        id: 'project-brief',
        name: 'Project Brief',
        category: 'Sensing Intent',
        description: 'Create a concise document outlining the project context, challenges, and approach.',
        icon: '📝',
        sections: [
            {
                id: 'background',
                title: 'Background',
                description: 'Context and background information',
                placeholder: 'Provide context about the problem or opportunity...'
            },
            {
                id: 'challenge',
                title: 'Challenge Statement',
                description: 'Define the core challenge or problem',
                placeholder: 'What is the main challenge or problem to address?'
            },
            {
                id: 'target-audience',
                title: 'Target Audience',
                description: 'Who will benefit from this project',
                placeholder: 'Who is the primary audience or user group?'
            },
            {
                id: 'approach',
                title: 'Approach',
                description: 'High-level approach and methodology',
                placeholder: 'What approach will be taken to address the challenge?'
            },
            {
                id: 'deliverables',
                title: 'Deliverables',
                description: 'Expected outputs and deliverables',
                placeholder: 'What will be delivered at the end of the project?'
            }
        ]
    },
    'stakeholder-mapping': {
        id: 'stakeholder-mapping',
        name: 'Stakeholder Mapping',
        category: 'Knowing People',
        description: 'Identify and analyze stakeholders, their interests, influence, and relationships.',
        icon: '👥',
        sections: [
            {
                id: 'stakeholder-list',
                title: 'Stakeholder List',
                description: 'List all relevant stakeholders',
                placeholder: 'Who are all the individuals, groups, or organizations involved?'
            },
            {
                id: 'interests',
                title: 'Interests & Needs',
                description: 'What each stakeholder cares about',
                placeholder: 'What are each stakeholder\'s interests, needs, and concerns?'
            },
            {
                id: 'influence',
                title: 'Influence & Power',
                description: 'Level of influence each stakeholder has',
                placeholder: 'How much influence does each stakeholder have on the project?'
            },
            {
                id: 'relationships',
                title: 'Relationships',
                description: 'How stakeholders relate to each other',
                placeholder: 'What are the relationships and dynamics between stakeholders?'
            },
            {
                id: 'engagement-strategy',
                title: 'Engagement Strategy',
                description: 'How to engage with each stakeholder',
                placeholder: 'How should we engage and communicate with each stakeholder?'
            }
        ]
    },
    'journey-mapping': {
        id: 'journey-mapping',
        name: 'Journey Mapping',
        category: 'Framing Insights',
        description: 'Map the user experience across touchpoints to identify pain points and opportunities.',
        icon: '🗺️',
        sections: [
            {
                id: 'persona',
                title: 'User Persona',
                description: 'Who is going through this journey',
                placeholder: 'Describe the user or persona for this journey...'
            },
            {
                id: 'stages',
                title: 'Journey Stages',
                description: 'Key stages in the journey',
                placeholder: 'What are the main stages or phases of this journey?'
            },
            {
                id: 'touchpoints',
                title: 'Touchpoints',
                description: 'Interactions at each stage',
                placeholder: 'What touchpoints does the user encounter at each stage?'
            },
            {
                id: 'emotions',
                title: 'Emotional Journey',
                description: 'Emotional highs and lows',
                placeholder: 'What emotions does the user experience at each stage?'
            },
            {
                id: 'pain-points',
                title: 'Pain Points',
                description: 'Problems and frustrations',
                placeholder: 'What pain points or frustrations exist at each stage?'
            },
            {
                id: 'opportunities',
                title: 'Opportunities',
                description: 'Areas for improvement',
                placeholder: 'What opportunities exist to improve the experience?'
            }
        ]
    },
    'strategic-roadmap': {
        id: 'strategic-roadmap',
        name: 'Strategic Roadmap',
        category: 'Framing Solutions',
        description: 'Plan the timeline, milestones, and initiatives to achieve strategic goals.',
        icon: '🛣️',
        sections: [
            {
                id: 'vision',
                title: 'Vision',
                description: 'Long-term vision and goals',
                placeholder: 'What is the long-term vision we are working towards?'
            },
            {
                id: 'phases',
                title: 'Phases',
                description: 'Key phases or timeframes',
                placeholder: 'What are the main phases (e.g., short-term, mid-term, long-term)?'
            },
            {
                id: 'initiatives',
                title: 'Initiatives',
                description: 'Specific initiatives or projects',
                placeholder: 'What specific initiatives will be undertaken in each phase?'
            },
            {
                id: 'milestones',
                title: 'Milestones',
                description: 'Key milestones and deliverables',
                placeholder: 'What are the key milestones and when will they be achieved?'
            },
            {
                id: 'dependencies',
                title: 'Dependencies',
                description: 'Dependencies between initiatives',
                placeholder: 'What dependencies exist between different initiatives?'
            },
            {
                id: 'resources',
                title: 'Resources',
                description: 'Required resources and capabilities',
                placeholder: 'What resources, skills, or capabilities are needed?'
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
