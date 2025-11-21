import { auth, db, supabase } from './supabase.js';
import { initializeAuth, showError, showSuccess, modal } from './auth.js';
import { frameworkDefinitions } from './frameworks.js';

let currentUser = null;
let allFrameworks = [];
let frameworkToDelete = null;

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
        
        // Render frameworks
        renderFrameworks(allFrameworks);
        
    } catch (error) {
        console.error('Error loading frameworks:', error);
        showError('Failed to load frameworks');
        renderFrameworks([]);
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
