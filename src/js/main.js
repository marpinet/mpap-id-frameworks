// Import Supabase and Auth
import { supabase, auth } from './supabase.js';
import { initializeAuth } from './auth.js';

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
            { name: "Canvas Business Plan", slug: "canvas-business-plan" }
        ]
    },
    {
        title: "Knowing Content",
        description: "Analyze resources, systems, and markets to understand the problem space.",
        color: "green",
        frameworks: [
            { name: "Resource-Based Analysis", slug: "resource-based-analysis" },
            { name: "System Mapping", slug: "system-mapping" },
            { name: "Market Segmentation", slug: "market-segmentation" }
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
            { name: "Translating Themes to Opportunity Spaces", slug: "translating-themes" }
        ]
    },
    {
        title: "Framing Solutions",
        description: "Define strategic goals, roadmaps, and interventions for impactful solutions.",
        color: "red",
        frameworks: [
            { name: "Strategic Purpose", slug: "strategic-purpose" },
            { name: "Strategic Roadmap", slug: "strategic-roadmap" },
            { name: "Leverage Points and Interventions", slug: "leverage-points" }
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
                    <h3 class="text-2xl font-bold mb-2">${index + 1}. ${category.title}</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">${category.description}</p>
                </div>
            </div>
            <div class="flex flex-wrap gap-2">
                ${category.frameworks.map(fw => `
                    <a href="/framework.html?id=${fw.slug}" 
                       class="inline-block px-4 py-2 bg-${category.color}-100 dark:bg-${category.color}-900 
                              text-${category.color}-700 dark:text-${category.color}-300 rounded-lg 
                              hover:bg-${category.color}-200 dark:hover:bg-${category.color}-800 
                              transition-colors text-sm font-medium">
                        ${fw.name}
                    </a>
                `).join('')}
            </div>
        `;
        categoriesContainer.appendChild(categoryCard);
    });
}

// Export for use in other modules
export { frameworkCategories };
