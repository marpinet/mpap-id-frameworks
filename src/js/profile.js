import { auth, db, supabase } from './supabase.js';
import { initializeAuth, showError, showSuccess, modal } from './auth.js';
import { frameworkDefinitions } from './frameworks.js';

let currentUser = null;
let allFrameworks = [];
let frameworkToDelete = null;

// ============================================================================
// DASHBOARD STATS & RECENT FRAMEWORKS
// ============================================================================

/**
 * Calculate completion percentage for a framework
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
 * Determine project status based on completion
 */
function getProjectStatus(completion) {
  if (completion === 0) return 'draft';
  if (completion === 100) return 'completed';
  return 'in-progress';
}

/**
 * Update dashboard statistics
 */
function updateDashboardStats(frameworks) {
  const total = frameworks.length;
  
  const statusCounts = frameworks.reduce((acc, framework) => {
    const completion = calculateCompletion(framework.content);
    const status = getProjectStatus(completion);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, { draft: 0, 'in-progress': 0, completed: 0 });
  
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-inprogress').textContent = statusCounts['in-progress'] || 0;
  document.getElementById('stat-completed').textContent = statusCounts.completed || 0;
}

/**
 * Render recently accessed frameworks
 */
function renderRecentFrameworks(frameworks) {
  const listContainer = document.getElementById('recent-frameworks-list');
  const emptyState = document.getElementById('recent-empty-state');
  
  if (!frameworks || frameworks.length === 0) {
    listContainer.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  
  emptyState.classList.add('hidden');
  
  // Sort by updated_at and take top 5
  const recent = [...frameworks]
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 5);
  
  listContainer.innerHTML = recent.map(framework => {
    const definition = frameworkDefinitions[framework.framework_type] || {};
    const completion = calculateCompletion(framework.content);
    const status = getProjectStatus(completion);
    
    const statusColors = {
      'draft': 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      'in-progress': 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
      'completed': 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
    };
    
    const statusLabels = {
      'draft': 'Draft',
      'in-progress': 'In Progress',
      'completed': 'Completed'
    };
    
    const timeAgo = getTimeAgo(new Date(framework.updated_at));
    
    return `
      <a href="/framework.html?id=${framework.framework_type}&project=${framework.id}" 
         class="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md transition-all">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 flex-1">
            <span class="text-2xl">${definition.icon || '📋'}</span>
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-semibold text-gray-900 dark:text-white truncate">${framework.title}</h4>
              <p class="text-xs text-gray-600 dark:text-gray-400">${definition.name || 'Framework'}</p>
            </div>
          </div>
          <div class="flex items-center space-x-3 ml-4">
            <span class="text-xs px-2 py-1 rounded-full ${statusColors[status]}">
              ${statusLabels[status]}
            </span>
            <div class="text-right">
              <div class="text-xs font-medium text-gray-900 dark:text-white">${completion}%</div>
              <div class="text-xs text-gray-500 dark:text-gray-500">${timeAgo}</div>
            </div>
          </div>
        </div>
        
        <!-- Progress bar -->
        <div class="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div class="bg-primary-500 h-1.5 rounded-full transition-all" style="width: ${completion}%"></div>
        </div>
      </a>
    `;
  }).join('');
}

/**
 * Get human-readable time ago string
 */
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [name, secondsInInterval] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInInterval);
    if (interval >= 1) {
      return interval === 1 ? `1 ${name} ago` : `${interval} ${name}s ago`;
    }
  }
  
  return 'just now';
}

// Initialize page
async function initializePage() {
    // Initialize auth
    initializeAuth();
    
    // Check if user is logged in
    const { user } = await auth.getUser();
    
    if (!user) {
        // Redirect to home if not logged in
        window.location.href = '/';
        return;
    }
    
    currentUser = user;
    
    // Load user profile
    await loadUserProfile();
    
    // Load frameworks
    await loadFrameworks();
}

// Load user profile
async function loadUserProfile() {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
        
        if (error) throw error;
        
        // Update UI
        const fullName = data?.full_name || currentUser.email?.split('@')[0] || 'User';
        document.getElementById('user-name').textContent = fullName;
        document.getElementById('user-email').textContent = currentUser.email;
        
        // Get initials
        const initials = fullName
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
        document.getElementById('user-initials').textContent = initials;
        
        // Populate edit form
        document.getElementById('profile-name').value = fullName;
        document.getElementById('profile-email').value = currentUser.email;
        
    } catch (error) {
        console.error('Error loading profile:', error);
        // Use fallback values
        const fallbackName = currentUser.email?.split('@')[0] || 'User';
        document.getElementById('user-name').textContent = fallbackName;
        document.getElementById('user-email').textContent = currentUser.email;
        document.getElementById('user-initials').textContent = fallbackName[0].toUpperCase();
    }
}

// Load frameworks
async function loadFrameworks() {
    try {
        const { data, error } = await db.getUserFrameworks(currentUser.id);
        
        if (error) throw error;
        
        allFrameworks = data || [];
        
        // Update count
        document.getElementById('framework-count').textContent = allFrameworks.length;
        
        // Update dashboard stats
        updateDashboardStats(allFrameworks);
        
        // Render recently accessed frameworks
        renderRecentFrameworks(allFrameworks);
        
        // Render all frameworks
        renderFrameworks(allFrameworks);
        
    } catch (error) {
        console.error('Error loading frameworks:', error);
        showError('Failed to load frameworks');
        renderFrameworks([]);
        updateDashboardStats([]);
        renderRecentFrameworks([]);
    }
}

// Render frameworks
function renderFrameworks(frameworks) {
    const grid = document.getElementById('frameworks-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (!frameworks || frameworks.length === 0) {
        grid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    grid.innerHTML = '';
    
    frameworks.forEach(framework => {
        const definition = frameworkDefinitions[framework.framework_type] || {};
        const card = document.createElement('div');
        card.className = 'card hover:shadow-xl cursor-pointer transition-all';
        
        const lastUpdated = new Date(framework.updated_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        card.innerHTML = `
            <div class="flex items-start justify-between mb-3">
                <span class="text-3xl">${definition.icon || '📋'}</span>
                <button class="delete-framework-btn text-gray-400 hover:text-red-500 transition-colors" data-framework-id="${framework.id}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">${framework.title}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${definition.category || 'Framework'}</p>
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-4">
                <span>Updated ${lastUpdated}</span>
            </div>
            <a href="/framework.html?id=${framework.framework_type}" class="btn-primary w-full text-center block">
                Open Framework
            </a>
        `;
        
        grid.appendChild(card);
        
        // Add delete button listener
        const deleteBtn = card.querySelector('.delete-framework-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            frameworkToDelete = framework.id;
            modal.open('delete-modal');
        });
    });
}

// Filter and sort frameworks
function filterAndSortFrameworks() {
    const category = document.getElementById('filter-category').value;
    const sortBy = document.getElementById('sort-by').value;
    
    let filtered = [...allFrameworks];
    
    // Filter by category
    if (category !== 'all') {
        filtered = filtered.filter(f => {
            const definition = frameworkDefinitions[f.framework_type];
            return definition?.category === category;
        });
    }
    
    // Sort
    filtered.sort((a, b) => {
        if (sortBy === 'recent') {
            return new Date(b.updated_at) - new Date(a.updated_at);
        } else if (sortBy === 'oldest') {
            return new Date(a.updated_at) - new Date(b.updated_at);
        } else if (sortBy === 'title') {
            return a.title.localeCompare(b.title);
        }
        return 0;
    });
    
    renderFrameworks(filtered);
}

// Delete framework
async function deleteFramework() {
    if (!frameworkToDelete) return;
    
    try {
        const { error } = await db.deleteFramework(frameworkToDelete);
        
        if (error) throw error;
        
        showSuccess('Framework deleted successfully');
        modal.close('delete-modal');
        
        // Remove from list
        allFrameworks = allFrameworks.filter(f => f.id !== frameworkToDelete);
        frameworkToDelete = null;
        
        // Update count and re-render
        document.getElementById('framework-count').textContent = allFrameworks.length;
        updateDashboardStats(allFrameworks);
        renderRecentFrameworks(allFrameworks);
        filterAndSortFrameworks();
        
    } catch (error) {
        console.error('Error deleting framework:', error);
        showError('Failed to delete framework');
    }
}

// Update profile
async function updateProfile(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('profile-name').value;
    
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ full_name: fullName, updated_at: new Date().toISOString() })
            .eq('id', currentUser.id);
        
        if (error) throw error;
        
        showSuccess('Profile updated successfully');
        modal.close('edit-profile-modal');
        
        // Reload profile
        await loadUserProfile();
        
    } catch (error) {
        console.error('Error updating profile:', error);
        const errorEl = document.getElementById('profile-error');
        errorEl.textContent = error.message;
        errorEl.classList.remove('hidden');
    }
}

// Theme toggle
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
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
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    initializeThemeToggle();
    
    // Filter and sort listeners
    document.getElementById('filter-category')?.addEventListener('change', filterAndSortFrameworks);
    document.getElementById('sort-by')?.addEventListener('change', filterAndSortFrameworks);
    
    // Edit profile button
    document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
        modal.open('edit-profile-modal');
    });
    
    // Edit profile form
    document.getElementById('edit-profile-form')?.addEventListener('submit', updateProfile);
    
    // Delete confirmation
    document.getElementById('confirm-delete-btn')?.addEventListener('click', deleteFramework);
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('[data-close-modal]');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-close-modal');
            modal.close(modalId);
            frameworkToDelete = null;
        });
    });
    
    // Logout button
    document.getElementById('logout-btn')?.addEventListener('click', async () => {
        await auth.signOut();
        window.location.href = '/';
    });
});
