// Import Supabase and Auth
import { supabase, auth } from './supabase.js';
import { initializeAuth } from './auth.js';
import { getFramework } from './frameworks.js';

// Test Supabase connection on page load
(async () => {
    console.log('🔄 Testing Supabase connection...');
    
    const { session, error: sessionError } = await auth.getSession();
    if (sessionError) {
        console.error('❌ Supabase connection failed:', sessionError.message);
    } else {
        console.log('✅ Supabase connected successfully!');
    }
})();

// Initialize authentication system
initializeAuth();

// Show/hide Projects link based on auth status
(async () => {
    const { user } = await auth.getUser();
    const projectsLink = document.getElementById('projects-nav-link');
    if (projectsLink && user) {
        projectsLink.classList.remove('hidden');
    }
})();

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
html.classList.add(currentTheme);

themeToggle?.addEventListener('click', () => {
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        html.classList.add('light');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.remove('light');
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn?.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Framework Categories Data
const frameworkCategories = [
    {
        title: "Sensing Intent",
        description: "Define the project's scope, goals, and foundational elements.",
        color: "blue",
        frameworks: [
            { name: "Project Charter", slug: "project-charter" },
            { name: "Project Brief", slug: "project-brief" },
            { name: "Canvas Business Plan", slug: "canvas-business-plan" },
            { name: "Company Background", slug: "company-background" }
        ]
    },
    {
        title: "Knowing Content",
        description: "Analyze resources, systems, and markets to understand the problem space.",
        color: "green",
        frameworks: [
            { name: "Resource-Based Analysis", slug: "resource-based-analysis" },
            { name: "System Mapping", slug: "system-mapping" },
            { name: "Market Segmentation", slug: "market-segmentation" },
            { name: "Competitor Mapping", slug: "competitor-mapping" }
        ]
    },
    {
        title: "Knowing People",
        description: "Understand stakeholders, their dynamics, and research findings.",
        color: "purple",
        frameworks: [
            { name: "Stakeholder Mapping", slug: "stakeholder-mapping" },
            { name: "Power Dynamics Mapping", slug: "power-dynamics-mapping" },
            { name: "Synthesize Research", slug: "synthesize-research" }
        ]
    },
    {
        title: "Framing Insights",
        description: "Visualize user journeys and convert insights into actionable opportunities.",
        color: "orange",
        frameworks: [
            { name: "Journey Mapping", slug: "journey-mapping" },
            { name: "Translating Themes to Opportunity Spaces", slug: "translating-themes-to-opportunity-spaces" }
        ]
    },
    {
        title: "Framing Solutions",
        description: "Define strategic goals, roadmaps, and interventions for impactful solutions.",
        color: "red",
        frameworks: [
            { name: "Strategic Purpose", slug: "strategic-purpose" },
            { name: "Strategic Roadmap", slug: "strategic-roadmap" },
            { name: "Leverage Points and Interventions", slug: "leverage-points-and-interventions" }
        ]
    }
];

// Populate Framework Categories
const categoriesContainer = document.getElementById('framework-categories');
if (categoriesContainer) {
    frameworkCategories.forEach((category, index) => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'card';
        categoryCard.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <h3 class="text-2xl font-bold font-display mb-2 text-navy-900 dark:text-cream-50">${index + 1}. ${category.title}</h3>
                    <p class="text-navy-600 dark:text-cream-400 mb-4">${category.description}</p>
                </div>
            </div>
            <div class="flex flex-wrap gap-2">
                ${category.frameworks.map(fw => `
                    <a href="/framework.html?id=${fw.slug}" 
                       class="inline-block px-4 py-3 bg-primary-400 hover:bg-primary-500 
                              text-navy-900 rounded-lg font-semibold
                              transition-all duration-200 shadow-sm hover:shadow-md">
                        ${fw.name}
                    </a>
                `).join('')}
            </div>
        `;
        categoriesContainer.appendChild(categoryCard);
    });
}

// ============================================================================
// HOMEPAGE ENHANCEMENTS - RECENT FRAMEWORKS & STATS
// ============================================================================

/**
 * Load and display recent frameworks for logged-in users
 */
async function loadRecentFrameworks() {
    const { user } = await auth.getUser();
    
    if (!user) {
        return;
    }
    
    const recentSection = document.getElementById('recent-frameworks-section');
    const statsSection = document.getElementById('quick-stats-section');
    const grid = document.getElementById('recent-frameworks-grid');
    const emptyState = document.getElementById('recent-frameworks-empty');
    
    // Show sections for logged-in users
    recentSection?.classList.remove('hidden');
    statsSection?.classList.remove('hidden');
    
    try {
        // Fetch user's frameworks
        const { data: frameworks, error } = await supabase
            .from('frameworks')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(4);
        
        if (error) throw error;
        
        if (!frameworks || frameworks.length === 0) {
            grid.innerHTML = '';
            emptyState?.classList.remove('hidden');
            return;
        }
        
        // Calculate stats
        const total = frameworks.length;
        let inProgress = 0;
        let completed = 0;
        const frameworkCounts = {};
        
        frameworks.forEach(fw => {
            const completion = calculateCompletion(fw.content);
            if (completion === 0) {
                // draft - don't count
            } else if (completion === 100) {
                completed++;
            } else {
                inProgress++;
            }
            
            // Count framework usage
            frameworkCounts[fw.framework_type] = (frameworkCounts[fw.framework_type] || 0) + 1;
        });
        
        // Find most used framework
        let mostUsed = '📊';
        let maxCount = 0;
        Object.entries(frameworkCounts).forEach(([type, count]) => {
            if (count > maxCount) {
                maxCount = count;
                const fwData = getFrameworkData(type);
                mostUsed = fwData?.icon || '📊';
            }
        });
        
        // Update stats
        document.getElementById('stat-home-total').textContent = total;
        document.getElementById('stat-home-progress').textContent = inProgress;
        document.getElementById('stat-home-completed').textContent = completed;
        document.getElementById('stat-home-favorite').textContent = mostUsed;
        
        // Render recent frameworks
        emptyState?.classList.add('hidden');
        grid.innerHTML = frameworks.slice(0, 4).map(fw => {
            const fwData = getFrameworkData(fw.framework_type);
            const completion = calculateCompletion(fw.content);
            const timeAgo = getTimeAgo(new Date(fw.updated_at));
            
            return `
                <a href="/framework.html?id=${fw.framework_type}&project=${fw.id}" 
                   class="card hover:shadow-xl transition-all group">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-4xl">${fwData?.icon || '📋'}</span>
                        <span class="text-xs px-2 py-1 rounded-full ${getStatusClass(completion)}">
                            ${completion}%
                        </span>
                    </div>
                    <h3 class="font-bold text-navy-900 dark:text-cream-50 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        ${fw.title}
                    </h3>
                    <p class="text-sm text-navy-600 dark:text-cream-400 mb-3">${fwData?.name || 'Framework'}</p>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div class="bg-primary-500 h-2 rounded-full transition-all" style="width: ${completion}%"></div>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">${timeAgo}</p>
                </a>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error loading recent frameworks:', error);
        grid.innerHTML = '<div class="col-span-full text-center text-red-500">Failed to load frameworks</div>';
    }
}

/**
 * Calculate completion percentage
 */
function calculateCompletion(frameworkData) {
    if (!frameworkData || typeof frameworkData !== 'object') return 0;
    
    const sections = Object.keys(frameworkData).filter(key => 
        !key.startsWith('_') && typeof frameworkData[key] === 'string'
    );
    
    if (sections.length === 0) return 0;
    
    const filledSections = sections.filter(key => 
        frameworkData[key] && frameworkData[key].trim().length > 0
    );
    
    return Math.round((filledSections.length / sections.length) * 100);
}

/**
 * Get framework data by ID
 */
function getFrameworkData(frameworkId) {
    // Use the imported getFramework function from frameworks.js
    const fwDefinition = getFramework(frameworkId);
    if (fwDefinition) {
        return { name: fwDefinition.name, icon: fwDefinition.icon };
    }
    
    // Fallback to local search if not found
    const allFrameworks = frameworkCategories.flatMap(cat => cat.frameworks);
    const fw = allFrameworks.find(f => f.slug === frameworkId);
    if (fw) {
        return { name: fw.name, icon: getFrameworkIcon(frameworkId) };
    }
    return null;
}

/**
 * Get framework icon
 */
function getFrameworkIcon(frameworkId) {
    const icons = {
        'project-charter': '📋',
        'project-brief': '📝',
        'canvas-business-plan': '📊',
        'company-background': '🏢',
        'resource-based-analysis': '🔧',
        'system-mapping': '🌐',
        'market-segmentation': '🎯',
        'competitor-mapping': '📈',
        'stakeholder-mapping': '👥',
        'power-dynamics-mapping': '⚡',
        'synthesize-research': '🔬',
        'journey-mapping': '🗺️',
        'translating-themes-to-opportunity-spaces': '💡',
        'strategic-purpose': '🎯',
        'strategic-roadmap': '🛣️',
        'leverage-points-and-interventions': '🔄'
    };
    return icons[frameworkId] || '📋';
}

/**
 * Get status class based on completion
 */
function getStatusClass(completion) {
    if (completion === 0) return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    if (completion === 100) return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
    return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
}

/**
 * Get time ago string
 */
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' min ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hr ago';
    if (seconds < 2592000) return Math.floor(seconds / 86400) + ' days ago';
    return Math.floor(seconds / 2592000) + ' months ago';
}

// Load recent frameworks on page load
loadRecentFrameworks();

// Export for use in other modules
export { frameworkCategories };
