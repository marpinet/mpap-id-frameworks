import { auth, db } from './supabase.js';
import { initializeAuth, showError, showSuccess, modal } from './auth.js';
import { frameworkCategories } from './frameworks.js';

let currentUser = null;
let allProjects = [];
let filteredProjects = [];
let selectedProjects = new Set();

// Initialize page
async function initializePage() {
    // Initialize auth
    initializeAuth();
    
    // Check if user is logged in
    const { user } = await auth.getUser();
    currentUser = user;
    
    if (!currentUser) {
        // Redirect to home if not logged in
        showError('Please log in to view your projects');
        setTimeout(() => window.location.href = '/', 2000);
        return;
    }
    
    // Initialize UI
    initializeThemeToggle();
    initializeModalHandlers();
    initializeSearch();
    initializeFilters();
    populateFrameworkOptions();
    
    // Load projects
    await loadProjects();
}

// Load all user projects
async function loadProjects() {
    const loadingState = document.getElementById('loading-state');
    const projectsContainer = document.getElementById('projects-container');
    const emptyState = document.getElementById('empty-state');
    
    loadingState.classList.remove('hidden');
    projectsContainer.classList.add('hidden');
    emptyState.classList.add('hidden');
    
    try {
        const { data, error } = await db.getUserFrameworks(currentUser.id);
        if (error) throw error;
        
        // Transform data to include metadata
        allProjects = (data || []).map(project => {
            const content = project.content || {};
            const sections = Object.keys(content).length;
            const totalSections = getTotalSections(project.framework_type);
            const completionPercent = totalSections > 0 ? Math.round((sections / totalSections) * 100) : 0;
            
            return {
                ...project,
                completionPercent,
                sections,
                totalSections,
                status: completionPercent === 100 ? 'completed' : completionPercent > 0 ? 'in-progress' : 'draft'
            };
        });
        
        filteredProjects = [...allProjects];
        renderProjects();
        
    } catch (error) {
        console.error('Error loading projects:', error);
        showError('Failed to load projects: ' + error.message);
    } finally {
        loadingState.classList.add('hidden');
    }
}

// Get total sections for a framework type
function getTotalSections(frameworkType) {
    // This would need to be imported from frameworks.js
    // For now, return a default
    return 8; // Average number of sections
}

// Render projects
function renderProjects() {
    const projectsContainer = document.getElementById('projects-container');
    const emptyState = document.getElementById('empty-state');
    
    if (filteredProjects.length === 0) {
        projectsContainer.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    projectsContainer.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    projectsContainer.innerHTML = filteredProjects.map(project => `
        <div class="card group relative hover:shadow-xl transition-all duration-200" data-project-id="${project.id}">
            <!-- Selection Checkbox -->
            <div class="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <input 
                    type="checkbox" 
                    class="project-checkbox w-5 h-5 rounded border-navy-300 text-primary-600 focus:ring-primary-500"
                    data-project-id="${project.id}"
                    ${selectedProjects.has(project.id) ? 'checked' : ''}
                >
            </div>
            
            <!-- Project Header -->
            <div class="mb-4">
                <div class="flex items-start justify-between mb-2">
                    <div class="flex-1 pr-8">
                        <h3 class="text-lg font-semibold text-navy-900 dark:text-cream-50 mb-1 line-clamp-2">
                            ${project.title || 'Untitled Project'}
                        </h3>
                        <p class="text-sm text-navy-600 dark:text-cream-400 line-clamp-1">
                            ${project.framework_type?.replace(/-/g, ' ') || 'Unknown Framework'}
                        </p>
                    </div>
                    <span class="text-2xl">${getFrameworkIcon(project.framework_type)}</span>
                </div>
                
                <!-- Status Badge -->
                <div class="flex items-center space-x-2 mb-3">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}">
                        ${project.status === 'in-progress' ? 'In Progress' : project.status === 'completed' ? 'Completed' : 'Draft'}
                    </span>
                    <span class="text-xs text-navy-500 dark:text-cream-500">
                        ${formatDate(project.updated_at)}
                    </span>
                </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="mb-4">
                <div class="flex items-center justify-between text-xs text-navy-600 dark:text-cream-400 mb-1">
                    <span>Progress</span>
                    <span class="font-semibold">${project.completionPercent}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-navy-700 rounded-full h-2">
                    <div class="bg-primary-500 h-2 rounded-full transition-all duration-300" style="width: ${project.completionPercent}%"></div>
                </div>
                <p class="text-xs text-navy-500 dark:text-cream-500 mt-1">
                    ${project.sections} of ${project.totalSections} sections completed
                </p>
            </div>
            
            <!-- Actions -->
            <div class="flex items-center space-x-2 pt-4 border-t border-navy-100 dark:border-navy-700">
                <button 
                    class="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-navy-900 font-medium rounded-lg transition-all text-sm"
                    onclick="window.location.href='/framework.html?id=${project.framework_type}&project=${project.id}'"
                >
                    ${project.completionPercent === 0 ? 'Start' : 'Continue'}
                </button>
                <button 
                    class="p-2 hover:bg-cream-100 dark:hover:bg-navy-700 rounded-lg transition-colors"
                    data-action="duplicate"
                    data-project-id="${project.id}"
                    title="Duplicate"
                >
                    <svg class="w-5 h-5 text-navy-600 dark:text-cream-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                </button>
                <button 
                    class="p-2 hover:bg-cream-100 dark:hover:bg-navy-700 rounded-lg transition-colors"
                    data-action="delete"
                    data-project-id="${project.id}"
                    title="Delete"
                >
                    <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    addProjectEventListeners();
}

// Get framework icon
function getFrameworkIcon(frameworkType) {
    const iconMap = {
        'project-charter': '📋',
        'project-brief': '📝',
        'canvas-business-plan': '🎯',
        'company-background': '🏢',
        'resource-based-analysis': '💎',
        'system-mapping': '🗺️',
        'market-segmentation': '👥',
        'competitor-mapping': '🔍',
        'stakeholder-mapping': '🤝',
        'power-dynamics-mapping': '⚡',
        'synthesize-research': '🔬',
        'journey-mapping': '🛤️',
        'translating-themes-to-opportunity-spaces': '💡',
        'strategic-purpose': '🎯',
        'strategic-roadmap': '🗺️',
        'leverage-points-and-interventions': '🎚️'
    };
    return iconMap[frameworkType] || '📄';
}

// Get status color classes
function getStatusColor(status) {
    const colors = {
        'draft': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
        'in-progress': 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
        'completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    };
    return colors[status] || colors.draft;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Add event listeners to project actions
function addProjectEventListeners() {
    // Checkboxes
    document.querySelectorAll('.project-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            const projectId = e.target.dataset.projectId;
            if (e.target.checked) {
                selectedProjects.add(projectId);
            } else {
                selectedProjects.delete(projectId);
            }
            updateBulkActions();
        });
    });
    
    // Action buttons
    document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = e.currentTarget.dataset.action;
            const projectId = e.currentTarget.dataset.projectId;
            
            if (action === 'delete') {
                deleteProject(projectId);
            } else if (action === 'duplicate') {
                duplicateProject(projectId);
            }
        });
    });
}

// Update bulk actions visibility
function updateBulkActions() {
    const bulkActions = document.getElementById('bulk-actions');
    const selectedCount = document.getElementById('selected-count');
    
    if (selectedProjects.size > 0) {
        bulkActions.classList.remove('hidden');
        selectedCount.textContent = selectedProjects.size;
    } else {
        bulkActions.classList.add('hidden');
    }
}

// Delete project
async function deleteProject(projectId) {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;
    
    // Store for modal
    window.projectToDelete = projectId;
    modal.open('delete-modal');
}

// Confirm delete
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('confirm-delete-btn')?.addEventListener('click', async () => {
        const projectId = window.projectToDelete;
        if (!projectId) return;
        
        try {
            const { error } = await db.deleteFramework(projectId);
            if (error) throw error;
            
            showSuccess('Project deleted successfully');
            modal.close('delete-modal');
            await loadProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            showError('Failed to delete project: ' + error.message);
        }
    });
});

// Duplicate project
async function duplicateProject(projectId) {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;
    
    try {
        const { error } = await db.createFramework({
            user_id: currentUser.id,
            framework_type: project.framework_type,
            title: `${project.title} (Copy)`,
            description: project.description,
            content: project.content
        });
        
        if (error) throw error;
        
        showSuccess('Project duplicated successfully');
        await loadProjects();
    } catch (error) {
        console.error('Error duplicating project:', error);
        showError('Failed to duplicate project: ' + error.message);
    }
}

// Initialize search
function initializeSearch() {
    const searchInput = document.getElementById('search-projects');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        filteredProjects = allProjects.filter(project => 
            project.title?.toLowerCase().includes(query) ||
            project.framework_type?.toLowerCase().includes(query) ||
            project.description?.toLowerCase().includes(query)
        );
        renderProjects();
    });
}

// Initialize filters
function initializeFilters() {
    const frameworkFilter = document.getElementById('filter-framework');
    const statusFilter = document.getElementById('filter-status');
    const sortBy = document.getElementById('sort-by');
    
    const applyFilters = () => {
        let filtered = [...allProjects];
        
        // Apply search
        const searchQuery = document.getElementById('search-projects').value.toLowerCase();
        if (searchQuery) {
            filtered = filtered.filter(project => 
                project.title?.toLowerCase().includes(searchQuery) ||
                project.framework_type?.toLowerCase().includes(searchQuery)
            );
        }
        
        // Apply framework filter
        const frameworkValue = frameworkFilter.value;
        if (frameworkValue) {
            filtered = filtered.filter(project => {
                const category = getFrameworkCategory(project.framework_type);
                return category === frameworkValue;
            });
        }
        
        // Apply status filter
        const statusValue = statusFilter.value;
        if (statusValue) {
            filtered = filtered.filter(project => project.status === statusValue);
        }
        
        // Apply sorting
        const sortValue = sortBy.value;
        filtered.sort((a, b) => {
            switch (sortValue) {
                case 'name':
                    return (a.title || '').localeCompare(b.title || '');
                case 'created':
                    return new Date(b.created_at) - new Date(a.created_at);
                case 'completion':
                    return b.completionPercent - a.completionPercent;
                case 'recent':
                default:
                    return new Date(b.updated_at) - new Date(a.updated_at);
            }
        });
        
        filteredProjects = filtered;
        renderProjects();
    };
    
    frameworkFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    sortBy.addEventListener('change', applyFilters);
}

// Get framework category
function getFrameworkCategory(frameworkType) {
    const categoryMap = {
        'project-charter': 'strategy',
        'project-brief': 'strategy',
        'canvas-business-plan': 'business',
        'company-background': 'research',
        'resource-based-analysis': 'research',
        'system-mapping': 'design',
        'market-segmentation': 'research',
        'competitor-mapping': 'research',
        'stakeholder-mapping': 'design',
        'power-dynamics-mapping': 'design',
        'synthesize-research': 'research',
        'journey-mapping': 'design',
        'translating-themes-to-opportunity-spaces': 'design',
        'strategic-purpose': 'strategy',
        'strategic-roadmap': 'strategy',
        'leverage-points-and-interventions': 'execution'
    };
    return categoryMap[frameworkType] || 'strategy';
}

// Populate framework options in new project modal
function populateFrameworkOptions() {
    const select = document.getElementById('project-framework');
    
    frameworkCategories.forEach(category => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = category.name;
        
        category.frameworks.forEach(framework => {
            const option = document.createElement('option');
            option.value = framework.id;
            option.textContent = `${framework.icon} ${framework.name}`;
            optgroup.appendChild(option);
        });
        
        select.appendChild(optgroup);
    });
}

// New project button
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('new-project-btn')?.addEventListener('click', () => {
        modal.open('new-project-modal');
    });
    
    document.getElementById('create-project-btn')?.addEventListener('click', async () => {
        const name = document.getElementById('project-name').value.trim();
        const frameworkType = document.getElementById('project-framework').value;
        
        if (!name) {
            showError('Please enter a project name');
            return;
        }
        
        if (!frameworkType) {
            showError('Please select a framework');
            return;
        }
        
        // Redirect to framework page with new project
        window.location.href = `/framework.html?id=${frameworkType}&new=true&name=${encodeURIComponent(name)}`;
    });
});

// Bulk actions
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('bulk-delete-btn')?.addEventListener('click', async () => {
        if (selectedProjects.size === 0) return;
        
        const confirmed = confirm(`Delete ${selectedProjects.size} projects? This cannot be undone.`);
        if (!confirmed) return;
        
        try {
            for (const projectId of selectedProjects) {
                await db.deleteFramework(projectId);
            }
            
            showSuccess(`${selectedProjects.size} projects deleted`);
            selectedProjects.clear();
            updateBulkActions();
            await loadProjects();
        } catch (error) {
            console.error('Error deleting projects:', error);
            showError('Failed to delete projects');
        }
    });
    
    document.getElementById('cancel-selection-btn')?.addEventListener('click', () => {
        selectedProjects.clear();
        document.querySelectorAll('.project-checkbox').forEach(cb => cb.checked = false);
        updateBulkActions();
    });
});

// Theme toggle
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    html.classList.toggle('dark', currentTheme === 'dark');
    
    themeToggle?.addEventListener('click', () => {
        const isDark = html.classList.contains('dark');
        html.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });
}

// Modal handlers
function initializeModalHandlers() {
    document.querySelectorAll('[data-close-modal]').forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-close-modal');
            modal.close(modalId);
        });
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}
