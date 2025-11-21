import { auth, db } from './supabase.js';
import { getFramework } from './frameworks.js';
import { initializeAuth, showError, showSuccess, modal } from './auth.js';

// Get framework ID from URL
const urlParams = new URLSearchParams(window.location.search);
const frameworkId = urlParams.get('id');

let currentFramework = null;
let frameworkData = {};
let currentUser = null;

// Initialize page
async function initializePage() {
    // Initialize auth
    initializeAuth();
    
    // Check if user is logged in
    const { user } = await auth.getUser();
    currentUser = user;
    
    // Load framework definition
    if (!frameworkId) {
        showError('No framework specified');
        setTimeout(() => window.location.href = '/', 2000);
        return;
    }
    
    currentFramework = getFramework(frameworkId);
    
    if (!currentFramework) {
        showError('Framework not found');
        setTimeout(() => window.location.href = '/', 2000);
        return;
    }
    
    // Populate framework info
    document.getElementById('framework-icon').textContent = currentFramework.icon;
    document.getElementById('framework-title').textContent = currentFramework.name;
    document.getElementById('framework-category').textContent = currentFramework.category;
    document.getElementById('framework-description').textContent = currentFramework.description;
    document.title = `${currentFramework.name} - MPAP Frameworks`;
    
    // Render framework sections
    renderFrameworkSections();
    
    // Load saved data if user is logged in
    if (currentUser) {
        await loadSavedFramework();
    }
}

// Render framework sections
function renderFrameworkSections() {
    const sectionsContainer = document.getElementById('framework-sections');
    sectionsContainer.innerHTML = '';
    
    currentFramework.sections.forEach((section, index) => {
        const sectionEl = document.createElement('div');
        sectionEl.className = 'card';
        sectionEl.innerHTML = `
            <div class="mb-4">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    ${index + 1}. ${section.title}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">${section.description}</p>
            </div>
            <textarea 
                id="section-${section.id}" 
                data-section-id="${section.id}"
                rows="6" 
                class="input-field resize-y"
                placeholder="${section.placeholder}"
            >${frameworkData[section.id] || ''}</textarea>
        `;
        sectionsContainer.appendChild(sectionEl);
        
        // Add auto-save on change
        const textarea = sectionEl.querySelector('textarea');
        textarea.addEventListener('input', (e) => {
            frameworkData[section.id] = e.target.value;
            // Auto-save to localStorage
            saveToLocalStorage();
        });
    });
}

// Save to localStorage (temporary storage)
function saveToLocalStorage() {
    if (!frameworkId) return;
    localStorage.setItem(`framework-${frameworkId}`, JSON.stringify(frameworkData));
}

// Load from localStorage
function loadFromLocalStorage() {
    if (!frameworkId) return;
    const saved = localStorage.getItem(`framework-${frameworkId}`);
    if (saved) {
        frameworkData = JSON.parse(saved);
        // Update textareas
        currentFramework.sections.forEach(section => {
            const textarea = document.getElementById(`section-${section.id}`);
            if (textarea && frameworkData[section.id]) {
                textarea.value = frameworkData[section.id];
            }
        });
    }
}

// Load saved framework from database
async function loadSavedFramework() {
    if (!currentUser) return;
    
    try {
        const { data, error } = await db.getUserFrameworks(currentUser.id);
        if (error) throw error;
        
        // Find this framework
        const savedFramework = data?.find(f => f.framework_type === frameworkId);
        if (savedFramework) {
            frameworkData = savedFramework.content || {};
            renderFrameworkSections();
        } else {
            // Load from localStorage if no saved version
            loadFromLocalStorage();
        }
    } catch (error) {
        console.error('Error loading saved framework:', error);
        loadFromLocalStorage();
    }
}

// Save framework to database
async function saveFramework() {
    if (!currentUser) {
        showError('Please log in to save your work');
        return;
    }
    
    // Collect all section data
    currentFramework.sections.forEach(section => {
        const textarea = document.getElementById(`section-${section.id}`);
        if (textarea) {
            frameworkData[section.id] = textarea.value;
        }
    });
    
    try {
        // Check if framework already exists
        const { data: existing } = await db.getUserFrameworks(currentUser.id);
        const savedFramework = existing?.find(f => f.framework_type === frameworkId);
        
        if (savedFramework) {
            // Update existing
            const { error } = await db.updateFramework(savedFramework.id, {
                content: frameworkData,
                updated_at: new Date().toISOString()
            });
            if (error) throw error;
        } else {
            // Create new
            const { error } = await db.createFramework({
                user_id: currentUser.id,
                framework_type: frameworkId,
                title: currentFramework.name,
                description: currentFramework.description,
                content: frameworkData
            });
            if (error) throw error;
        }
        
        // Show success modal
        modal.open('save-success-modal');
        
        // Clear localStorage
        localStorage.removeItem(`framework-${frameworkId}`);
        
    } catch (error) {
        console.error('Error saving framework:', error);
        showError('Failed to save framework: ' + error.message);
    }
}

// Export as PDF (placeholder)
function exportAsPDF() {
    showError('PDF export coming soon!');
}

// Tab switching
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Update button states
            tabButtons.forEach(btn => {
                btn.classList.remove('active', 'border-primary-600', 'text-primary-600', 'dark:text-primary-400');
                btn.classList.add('border-transparent', 'text-gray-500', 'dark:text-gray-400');
            });
            button.classList.add('active', 'border-primary-600', 'text-primary-600', 'dark:text-primary-400');
            button.classList.remove('border-transparent', 'text-gray-500', 'dark:text-gray-400');
            
            // Update content visibility
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });
            document.getElementById(`${tabName}-tab`).classList.remove('hidden');
        });
    });
}

// File upload handling
function initializeFileUpload() {
    const fileInput = document.getElementById('file-upload');
    const uploadedFilesContainer = document.getElementById('uploaded-files');
    
    fileInput?.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        uploadedFilesContainer.classList.remove('hidden');
        uploadedFilesContainer.innerHTML = '';
        
        files.forEach(file => {
            const fileEl = document.createElement('div');
            fileEl.className = 'flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700';
            fileEl.innerHTML = `
                <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                    <span class="text-sm text-gray-700 dark:text-gray-300">${file.name}</span>
                </div>
                <span class="text-xs text-gray-500">${(file.size / 1024).toFixed(1)} KB</span>
            `;
            uploadedFilesContainer.appendChild(fileEl);
        });
        
        showSuccess('Files uploaded! AI processing coming soon.');
    });
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
    initializeTabs();
    initializeFileUpload();
    initializeThemeToggle();
    
    // Save button listeners
    document.getElementById('save-framework-btn')?.addEventListener('click', saveFramework);
    document.getElementById('save-framework-btn-bottom')?.addEventListener('click', saveFramework);
    
    // Export PDF button
    document.getElementById('export-pdf-btn')?.addEventListener('click', exportAsPDF);
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('[data-close-modal]');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-close-modal');
            document.getElementById(modalId)?.classList.add('hidden');
        });
    });
});
