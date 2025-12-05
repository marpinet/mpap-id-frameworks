import { auth, db } from './supabase.js';
import { getFramework } from './frameworks.js';
import { initializeAuth, showError, showSuccess, modal } from './auth.js';

// Get framework ID from URL
const urlParams = new URLSearchParams(window.location.search);
const frameworkId = urlParams.get('id');

let currentFramework = null;
let frameworkData = {};
let currentUser = null;
let currentStepIndex = 0;

// Auto-save state
let autoSaveTimeout = null;
let hasUnsavedChanges = false;
let lastSavedTime = null;

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
    
    // Load saved data if user is logged in
    if (currentUser) {
        await loadSavedFramework();
    } else {
        // Load from localStorage if not logged in
        loadFromLocalStorage();
    }
    
    // Initialize step-by-step guided experience
    initializeStepByStep();
    renderCurrentStep();
}

// Initialize step-by-step guided experience
function initializeStepByStep() {
    const totalSteps = currentFramework.sections.length;
    
    // Initialize progress dots
    const progressDots = document.getElementById('progress-dots');
    progressDots.innerHTML = '';
    
    currentFramework.sections.forEach((section, index) => {
        const dot = document.createElement('div');
        dot.className = 'flex flex-col items-center';
        dot.innerHTML = `
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                index === 0 ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }" data-step="${index}">
                ${index + 1}
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block max-w-[80px] text-center truncate">${section.title}</span>
        `;
        progressDots.appendChild(dot);
    });
    
    // Setup navigation buttons
    const prevBtn = document.getElementById('prev-step-btn');
    const nextBtn = document.getElementById('next-step-btn');
    const skipBtn = document.getElementById('skip-step-btn');
    
    prevBtn.addEventListener('click', () => {
        if (currentStepIndex > 0) {
            saveCurrentStepData();
            currentStepIndex--;
            renderCurrentStep();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        saveCurrentStepData();
        if (currentStepIndex < totalSteps - 1) {
            currentStepIndex++;
            renderCurrentStep();
        } else {
            // Last step completed
            completeFramework();
        }
    });
    
    skipBtn.addEventListener('click', () => {
        if (currentStepIndex < totalSteps - 1) {
            currentStepIndex++;
            renderCurrentStep();
        }
    });
}

// Render current step
function renderCurrentStep() {
    const section = currentFramework.sections[currentStepIndex];
    const totalSteps = currentFramework.sections.length;
    const isLastStep = currentStepIndex === totalSteps - 1;
    
    // Update progress bar and text
    const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;
    document.getElementById('progress-bar').style.width = `${progressPercent}%`;
    document.getElementById('progress-text').textContent = `Step ${currentStepIndex + 1} of ${totalSteps}`;
    
    // Update progress dots
    document.querySelectorAll('#progress-dots [data-step]').forEach((dot, index) => {
        if (index < currentStepIndex) {
            // Completed
            dot.className = 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 bg-green-500 text-white';
            dot.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>';
        } else if (index === currentStepIndex) {
            // Current
            dot.className = 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 bg-primary-500 text-white ring-4 ring-primary-200 dark:ring-primary-900';
            dot.textContent = index + 1;
        } else {
            // Upcoming
            dot.className = 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400';
            dot.textContent = index + 1;
        }
    });
    
    // Render step content with encouraging instructions
    const stepContainer = document.getElementById('step-container');
    stepContainer.innerHTML = `
        <div class="card">
            <div class="mb-6">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-display">
                            ${section.title}
                        </h2>
                        <p class="text-gray-600 dark:text-gray-400">${section.description}</p>
                    </div>
                    <span class="text-4xl ml-4">${currentFramework.icon}</span>
                </div>
                
                <!-- Encouraging Instructions -->
                <div class="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 p-4 rounded-r-lg mb-6">
                    <div class="flex items-start space-x-3">
                        <svg class="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <div class="flex-1">
                            <h4 class="font-semibold text-primary-900 dark:text-primary-100 mb-1">How to complete this step:</h4>
                            <div class="text-sm text-primary-800 dark:text-primary-200 space-y-2">
                                ${generateStepInstructions(section)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Input Area -->
            <div>
                <label for="current-step-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Response
                </label>
                <textarea 
                    id="current-step-input"
                    rows="8" 
                    class="input-field resize-y font-sans"
                    placeholder="${section.placeholder}"
                >${frameworkData[section.id] || ''}</textarea>
                <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    💡 Tip: Be specific and detailed. You can always come back to edit this later.
                </p>
            </div>
            
            ${frameworkData[section.id] ? `
            <div class="mt-4 flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>Great work! This section has content.</span>
            </div>
            ` : ''}
        </div>
    `;
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-step-btn');
    const nextBtn = document.getElementById('next-step-btn');
    const skipBtn = document.getElementById('skip-step-btn');
    
    prevBtn.disabled = currentStepIndex === 0;
    if (currentStepIndex === 0) {
        prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    
    if (isLastStep) {
        nextBtn.querySelector('span').textContent = 'Complete Framework';
        nextBtn.classList.add('bg-green-600', 'hover:bg-green-700');
        nextBtn.classList.remove('bg-primary-500', 'hover:bg-primary-600');
        skipBtn.classList.add('hidden');
    } else {
        nextBtn.querySelector('span').textContent = 'Next';
        nextBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
        nextBtn.classList.add('bg-primary-500', 'hover:bg-primary-600');
        skipBtn.classList.remove('hidden');
    }
    
    // Setup auto-save for current step
    const textarea = document.getElementById('current-step-input');
    textarea.addEventListener('input', (e) => {
        frameworkData[section.id] = e.target.value;
        saveToLocalStorage();
        triggerAutoSave();
    });
    
    // Check if visual enhancement is available for this framework
    checkAndShowVisualEnhancement();
}

// Generate context-aware instructions for each step
function generateStepInstructions(section) {
    const instructions = {
        'objective': `
            <p>• Start by clearly stating what you want to achieve with this project</p>
            <p>• Make it specific, measurable, and time-bound if possible</p>
            <p>• Think about the end result you envision</p>
        `,
        'scope': `
            <p>• Define what's included and what's excluded from this project</p>
            <p>• Be clear about boundaries to prevent scope creep</p>
            <p>• List specific deliverables or outcomes</p>
        `,
        'stakeholders': `
            <p>• Identify all people or groups affected by or involved in this project</p>
            <p>• Include both internal team members and external parties</p>
            <p>• Consider who has influence and who will be impacted</p>
        `,
        'timeline': `
            <p>• Break down the project into key phases or milestones</p>
            <p>• Assign realistic timeframes to each phase</p>
            <p>• Include buffer time for unexpected challenges</p>
        `,
        'resources': `
            <p>• List what you'll need: people, budget, tools, technology</p>
            <p>• Be honest about resource constraints</p>
            <p>• Identify any gaps that need to be filled</p>
        `,
        'risks': `
            <p>• Think about what could go wrong or create obstacles</p>
            <p>• Consider internal and external risk factors</p>
            <p>• For each risk, note how you might mitigate it</p>
        `,
        'success': `
            <p>• Define how you'll measure success</p>
            <p>• Include both quantitative metrics and qualitative outcomes</p>
            <p>• Make criteria specific and observable</p>
        `
    };
    
    // Return matching instructions or default
    const sectionId = section.id.toLowerCase();
    for (const [key, instruction] of Object.entries(instructions)) {
        if (sectionId.includes(key)) {
            return instruction;
        }
    }
    
    // Default instructions
    return `
        <p>• Take your time to think through this section carefully</p>
        <p>• Provide as much detail as possible to make your framework useful</p>
        <p>• You can always return to edit or expand on this later</p>
    `;
}

// Save current step data
function saveCurrentStepData() {
    const section = currentFramework.sections[currentStepIndex];
    const textarea = document.getElementById('current-step-input');
    if (textarea) {
        frameworkData[section.id] = textarea.value;
        saveToLocalStorage();
    }
}

// Complete framework
function completeFramework() {
    saveCurrentStepData();
    
    // Show completion message
    const stepContainer = document.getElementById('step-container');
    stepContainer.innerHTML = `
        <div class="card text-center py-12">
            <div class="mb-6">
                <div class="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <svg class="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3 font-display">
                    🎉 Framework Complete!
                </h2>
                <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                    Congratulations! You've completed all ${currentFramework.sections.length} sections of the ${currentFramework.name}. 
                    ${currentUser ? 'Your work is automatically saved to your profile.' : 'Sign in to save your work permanently.'}
                </p>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button id="review-all-btn" class="btn-secondary">
                    Review All Sections
                </button>
                ${currentUser ? `
                    <a href="/profile.html" class="btn-primary">
                        View in Profile
                    </a>
                ` : `
                    <button id="save-signup-btn" class="btn-primary">
                        Sign Up to Save
                    </button>
                `}
                <button id="export-complete-btn" class="btn-secondary">
                    Export as PDF
                </button>
            </div>
        </div>
    `;
    
    // Hide navigation buttons
    document.getElementById('prev-step-btn').classList.add('hidden');
    document.getElementById('next-step-btn').classList.add('hidden');
    document.getElementById('skip-step-btn').classList.add('hidden');
    
    // Setup review button
    document.getElementById('review-all-btn')?.addEventListener('click', () => {
        currentStepIndex = 0;
        document.getElementById('prev-step-btn').classList.remove('hidden');
        document.getElementById('next-step-btn').classList.remove('hidden');
        document.getElementById('skip-step-btn').classList.remove('hidden');
        renderCurrentStep();
    });
    
    // Setup export button
    document.getElementById('export-complete-btn')?.addEventListener('click', exportAsPDF);
    
    // Auto-save if logged in
    if (currentUser) {
        saveFramework();
    }
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
    // Save current step data first
    saveCurrentStepData();
    
    // Show loading state on save button
    const saveBtn = document.getElementById('save-framework-btn');
    const originalBtnText = saveBtn ? saveBtn.innerHTML : '';
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
        `;
    }
    
    // Simulate a brief delay to show the saving state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // If user is not logged in, save to localStorage only
    if (!currentUser) {
        saveToLocalStorage();
        // Reset button
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalBtnText;
        }
        // Show success modal even in demo mode
        showSaveSuccessModal();
        updateAutoSaveIndicator('saved');
        return;
    }
    
    // Collect all section data from step-by-step mode
    currentFramework.sections.forEach(section => {
        // Try both step-by-step mode and traditional textarea selectors
        const textarea = document.getElementById(`section-${section.id}`) || 
                        document.getElementById('current-step-input');
        if (textarea && currentStepIndex !== undefined) {
            const currentSection = currentFramework.sections[currentStepIndex];
            if (currentSection && currentSection.id === section.id) {
                frameworkData[section.id] = textarea.value;
            }
        } else if (textarea) {
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
        
        // Reset button
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalBtnText;
        }
        
        // Show success modal
        showSaveSuccessModal();
        updateAutoSaveIndicator('saved');
        
        // Clear localStorage since it's now in database
        localStorage.removeItem(`framework-${frameworkId}`);
        
    } catch (error) {
        console.error('Error saving framework:', error);
        
        // Reset button
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalBtnText;
        }
        
        showError('Failed to save to database. Your work is saved locally.');
        // Fallback to localStorage
        saveToLocalStorage();
    }
}

// Show enhanced save success modal
function showSaveSuccessModal() {
    const isDemoMode = !currentUser;
    const completion = calculateFrameworkCompletion();
    
    // Update modal content based on completion and mode
    const modal = document.getElementById('save-success-modal');
    const modalContent = modal.querySelector('.bg-white');
    
    let icon, title, message, actions;
    
    if (completion === 100) {
        // Framework is complete - celebration!
        icon = `<div class="mb-4 animate-bounce">
            <div class="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-3 shadow-lg">
                <svg class="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </div>
            <div class="text-5xl mb-2">🎉 🎊 ✨</div>
        </div>`;
        title = `<h3 class="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Framework Complete!</h3>`;
        message = `<p class="text-gray-600 dark:text-gray-400 mb-2">🌟 <strong>Amazing work!</strong> You've completed all ${currentFramework.sections.length} sections of the <strong>${currentFramework.name}</strong>.</p>
                   <p class="text-sm text-gray-500 dark:text-gray-500 mb-6">${isDemoMode ? '💾 Saved locally in your browser' : '✅ Saved to your account and ready to share'}</p>`;
    } else if (completion >= 50) {
        // Good progress
        icon = `<div class="mb-4">
            <div class="mx-auto h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg class="h-10 w-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
            </div>
        </div>`;
        title = `<h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">Great Progress!</h3>`;
        message = `<p class="text-gray-600 dark:text-gray-400 mb-2">You're ${completion}% done with the <strong>${currentFramework.name}</strong>.</p>
                   <p class="text-sm text-gray-500 dark:text-gray-500 mb-6">${isDemoMode ? '💾 Saved locally' : '✅ Saved to your account'}</p>`;
    } else {
        // Just started
        icon = `<div class="mb-4">
            <div class="mx-auto h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg class="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </div>
        </div>`;
        title = `<h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">Framework Saved!</h3>`;
        message = `<p class="text-gray-600 dark:text-gray-400 mb-2">Your work on <strong>${currentFramework.name}</strong> has been saved.</p>
                   <p class="text-sm text-gray-500 dark:text-gray-500 mb-6">${isDemoMode ? '💾 Saved locally - Sign in to sync across devices' : '✅ Saved to your account'}</p>`;
    }
    
    // Action buttons
    if (isDemoMode) {
        actions = `<div class="space-y-3">
            <button data-close-modal="save-success-modal" class="w-full btn-primary">
                Continue Editing
            </button>
            <button id="signup-from-save" class="w-full btn-secondary">
                Sign Up to Sync Across Devices
            </button>
            <a href="/" class="block text-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                Back to Home
            </a>
        </div>`;
    } else {
        actions = `<div class="space-y-3">
            <div class="flex gap-3">
                <button data-close-modal="save-success-modal" class="flex-1 btn-secondary">
                    Continue Editing
                </button>
                <a href="/profile.html" class="flex-1 btn-primary inline-block text-center">
                    View All Projects
                </a>
            </div>
            <button id="export-from-save" class="w-full btn-secondary">
                📄 Export as PDF
            </button>
        </div>`;
    }
    
    // Update modal HTML
    modalContent.innerHTML = `
        ${icon}
        ${title}
        ${message}
        <div class="mb-6">
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div class="bg-gradient-to-r from-primary-500 to-green-500 h-3 rounded-full transition-all duration-500" style="width: ${completion}%"></div>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">${completion}% Complete</p>
        </div>
        ${actions}
    `;
    
    // Show the modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Setup event listeners for new buttons
    const signupBtn = document.getElementById('signup-from-save');
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            document.getElementById('signup-modal')?.classList.remove('hidden');
        });
    }
    
    const exportBtn = document.getElementById('export-from-save');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            exportAsPDF();
        });
    }
    
    // Setup close button
    const closeBtn = modalContent.querySelector('[data-close-modal="save-success-modal"]');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    }
}

// Calculate framework completion percentage
function calculateFrameworkCompletion() {
    if (!currentFramework || !currentFramework.sections) return 0;
    
    const totalSections = currentFramework.sections.length;
    const completedSections = currentFramework.sections.filter(section => {
        const data = frameworkData[section.id];
        return data && data.trim().length > 0;
    }).length;
    
    return Math.round((completedSections / totalSections) * 100);
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

// Demo AI Chat functionality
function initializeDemoAIChat() {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-chat-btn');
    const chatMessages = document.getElementById('chat-messages');
    
    // Enable the chat (demo mode)
    chatInput.disabled = false;
    sendButton.disabled = false;
    
    // Update placeholder
    chatInput.placeholder = 'Type your message here...';
    
    // Remove "coming soon" message
    const comingSoon = chatMessages.querySelector('.text-center');
    if (comingSoon) {
        comingSoon.remove();
    }
    
    // Add step-aware greeting with quick actions
    initiateStepConversation(chatMessages);
    
    const sendMessage = async () => {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'flex justify-end';
        userMsg.innerHTML = `
            <div class="bg-primary-500 text-navy-900 rounded-lg px-4 py-2 max-w-[80%] font-medium">
                ${message}
            </div>
        `;
        chatMessages.appendChild(userMsg);
        
        // Clear input
        chatInput.value = '';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Show typing indicator
        const typingMsg = document.createElement('div');
        typingMsg.className = 'flex justify-start';
        typingMsg.innerHTML = `
            <div class="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2">
                <span class="animate-pulse">AI is thinking...</span>
            </div>
        `;
        chatMessages.appendChild(typingMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate AI response after delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Remove typing indicator
        typingMsg.remove();
        
        // Generate demo response based on framework
        const response = generateDemoResponse(message);
        
        const aiMsg = document.createElement('div');
        aiMsg.className = 'flex justify-start';
        aiMsg.innerHTML = `
            <div class="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 max-w-[85%]">
                ${response}
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-3 pt-2 border-t border-gray-300 dark:border-gray-600 italic">💡 Demo Mode: Real AI integration coming soon!</p>
            </div>
        `;
        chatMessages.appendChild(aiMsg);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };
    
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

function generateDemoResponse(userMessage) {
    const message = userMessage.toLowerCase();
    const frameworkName = currentFramework?.name || 'framework';
    
    // Context-aware responses based on current framework
    if (message.includes('help') || message.includes('how') || message.includes('start')) {
        return `<p class="font-semibold mb-2">Great question! Here's how to get started with the ${frameworkName}:</p>
                <ol class="list-decimal list-inside space-y-2 mb-3">
                    <li><strong>Read each section carefully</strong> - Understand what information is needed</li>
                    <li><strong>Start with what you know</strong> - Fill in the sections you have information for</li>
                    <li><strong>Use the placeholders as guides</strong> - They show you what kind of content to include</li>
                    <li><strong>Save frequently</strong> - Your work is auto-saved, but manual saves ensure nothing is lost</li>
                </ol>
                <p class="mt-2">💡 <strong>Pro tip:</strong> You don't need to complete everything at once. Work section by section and come back later to refine.</p>
                <p class="mt-2">Would you like me to provide an example for a specific section?</p>`;
    }
    
    if (message.includes('example') || message.includes('sample')) {
        return `<p class="font-semibold mb-2">Here's a practical example for the ${frameworkName}:</p>
                <div class="bg-white dark:bg-gray-800 p-3 rounded border border-gray-300 dark:border-gray-600 my-2">
                    <p class="text-sm italic mb-2">Example: Project Charter - Project Purpose</p>
                    <p class="text-sm">"To redesign our customer onboarding experience to reduce drop-off rates by 40% and improve user satisfaction scores from 3.2 to 4.5 out of 5 within 6 months. This will be achieved through user research, iterative prototyping, and data-driven optimization."</p>
                </div>
                <p class="mt-2"><strong>Key elements this example includes:</strong></p>
                <ul class="list-disc list-inside space-y-1 text-sm mt-2 mb-3">
                    <li>Clear objective (reduce drop-off rates)</li>
                    <li>Measurable targets (40%, 3.2 to 4.5)</li>
                    <li>Timeline (within 6 months)</li>
                    <li>Approach (research, prototyping, optimization)</li>
                </ul>
                <p class="mt-2">📝 Try to include similar specificity in your response. Which section would you like an example for?</p>`;
    }
    
    if (message.includes('research') || message.includes('data') || message.includes('find')) {
        return `<p class="font-semibold mb-2">I can help you gather research for the ${frameworkName}!</p>
                <p class="mb-2">Here's my recommended approach:</p>
                <ol class="list-decimal list-inside space-y-2 mb-3">
                    <li><strong>Industry benchmarks</strong> - Look for reports from Gartner, Forrester, or industry associations</li>
                    <li><strong>Case studies</strong> - Search for similar projects on Medium, company blogs, or design publications</li>
                    <li><strong>Academic research</strong> - Check Google Scholar for peer-reviewed studies</li>
                    <li><strong>Market data</strong> - Use Statista, IBISWorld, or government statistics</li>
                </ol>
                <p class="mt-2">🔍 <strong>Quick tip:</strong> Use specific search terms like "[your industry] + [framework topic] + case study" for better results.</p>
                <p class="mt-2">What specific topic or section do you need research for? I can provide more targeted guidance.</p>`;
    }
    
    if (message.includes('stakeholder') || message.includes('people') || message.includes('who')) {
        return `<p class="font-semibold mb-2">Let me help you identify stakeholders systematically:</p>
                <p class="mb-2"><strong>Step 1: List everyone involved or affected</strong></p>
                <ul class="list-disc list-inside space-y-1 text-sm mb-3">
                    <li>Who makes decisions about this project?</li>
                    <li>Who will use or be affected by the results?</li>
                    <li>Who controls resources (budget, people, time)?</li>
                    <li>Who has expertise you need?</li>
                </ul>
                <p class="mb-2"><strong>Step 2: Categorize them</strong></p>
                <ol class="list-decimal list-inside space-y-1 text-sm mb-3">
                    <li><strong>Primary:</strong> Directly involved or impacted</li>
                    <li><strong>Secondary:</strong> Indirectly affected</li>
                    <li><strong>Key influencers:</strong> Can significantly impact success</li>
                </ol>
                <p class="mt-2">💡 <strong>Action item:</strong> Create a simple list first, then we can map their influence and interest levels.</p>
                <p class="mt-2">Would you like help analyzing their relationships or engagement strategies?</p>`;
    }
    
    if (message.includes('what') && (message.includes('section') || message.includes('include'))) {
        return `<p class="font-semibold mb-2">Here's what to include in each section:</p>
                <p class="mb-2"><strong>General guidelines for any section:</strong></p>
                <ul class="list-disc list-inside space-y-2 mb-3">
                    <li><strong>Be specific:</strong> Use concrete numbers, names, and dates instead of vague descriptions</li>
                    <li><strong>Be concise:</strong> Aim for clarity - 2-3 well-written paragraphs are better than pages of fluff</li>
                    <li><strong>Be relevant:</strong> Focus on information that directly supports decision-making</li>
                    <li><strong>Use examples:</strong> Real-world examples make abstract concepts tangible</li>
                </ul>
                <p class="mt-2">📋 Look at the placeholder text in each field - it gives you hints about what to write!</p>
                <p class="mt-2">Which specific section are you working on? I can give you detailed guidance.</p>`;
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
        return `<p class="mb-2">You're very welcome! I'm here to help. 😊</p>
                <p class="mb-2">Remember, completing a framework is an iterative process. Here are some tips as you continue:</p>
                <ul class="list-disc list-inside space-y-1 text-sm mb-3">
                    <li>Save your work regularly</li>
                    <li>Review and refine sections as you gather more information</li>
                    <li>Don't hesitate to ask for more examples or clarification</li>
                </ul>
                <p class="mt-2">Is there anything else I can help you with?</p>`;
    }
    
    // Default helpful response with clear structure
    return `<p class="font-semibold mb-2">I'm here to help with "${userMessage}"!</p>
            <p class="mb-2">For the <strong>${frameworkName}</strong>, I can assist you with:</p>
            <ul class="list-disc list-inside space-y-2 mb-3">
                <li><strong>Examples:</strong> See how others have completed similar sections</li>
                <li><strong>Research:</strong> Find relevant data, case studies, and best practices</li>
                <li><strong>Guidance:</strong> Get step-by-step instructions for each section</li>
                <li><strong>Review:</strong> Feedback on your content and suggestions for improvement</li>
            </ul>
            <p class="mt-2">💬 <strong>Try asking more specifically:</strong></p>
            <ul class="list-none space-y-1 text-sm mt-2">
                <li>• "Give me an example for [section name]"</li>
                <li>• "Help me research [specific topic]"</li>
                <li>• "What should I write about [section name]?"</li>
            </ul>
            <p class="mt-2">What would you like to focus on first?</p>`;
}

// Demo file processing
// ============================================================================
// FILE UPLOAD & PROCESSING
// ============================================================================

let uploadedFiles = [];

function enhanceFileUpload() {
    const fileInput = document.getElementById('file-upload');
    const dropzone = document.getElementById('dropzone');
    const uploadedFilesContainer = document.getElementById('uploaded-files');
    const uploadedFilesSection = document.getElementById('uploaded-files-section');
    const filesCount = document.getElementById('files-count');
    const clearFilesBtn = document.getElementById('clear-files-btn');
    const processFilesBtn = document.getElementById('process-files-btn');
    const manualModeBtn = document.getElementById('manual-mode-btn');
    const aiProcessingSection = document.getElementById('ai-processing-section');
    
    // File input change handler
    fileInput?.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            handleFiles(files);
        }
    });
    
    // Drag and drop handlers
    dropzone?.addEventListener('click', () => {
        fileInput?.click();
    });
    
    dropzone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('border-primary-500', 'bg-primary-50', 'dark:bg-primary-900/10');
    });
    
    dropzone?.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-primary-500', 'bg-primary-50', 'dark:bg-primary-900/10');
    });
    
    dropzone?.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-primary-500', 'bg-primary-50', 'dark:bg-primary-900/10');
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFiles(files);
        }
    });
    
    // Clear all files
    clearFilesBtn?.addEventListener('click', () => {
        uploadedFiles = [];
        uploadedFilesContainer.innerHTML = '';
        uploadedFilesSection.classList.add('hidden');
        aiProcessingSection.classList.add('hidden');
        filesCount.textContent = '0';
        fileInput.value = '';
    });
    
    // Process files with AI
    processFilesBtn?.addEventListener('click', async () => {
        await processFilesWithAI();
    });
    
    // Manual mode - just store files
    manualModeBtn?.addEventListener('click', () => {
        aiProcessingSection.classList.add('hidden');
        showSuccess('Files stored for reference. You can continue filling the framework manually.');
    });
}

/**
 * Handle uploaded files
 */
async function handleFiles(files) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles = [];
    
    // Validate files
    for (const file of files) {
        if (file.size > maxSize) {
            showError(`${file.name} is too large (max 10MB)`);
            continue;
        }
        validFiles.push(file);
    }
    
    if (validFiles.length === 0) return;
    
    // Show upload progress
    const progressSection = document.getElementById('upload-progress');
    const progressBar = document.getElementById('upload-progress-bar');
    const progressText = document.getElementById('upload-progress-text');
    
    progressSection.classList.remove('hidden');
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
        progressBar.style.width = `${i}%`;
        progressText.textContent = `${i}%`;
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Hide progress
    setTimeout(() => {
        progressSection.classList.add('hidden');
    }, 500);
    
    // Add to uploaded files
    validFiles.forEach(file => {
        uploadedFiles.push({
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date()
        });
    });
    
    // Render files
    renderUploadedFiles();
    
    // Show AI processing section
    document.getElementById('ai-processing-section').classList.remove('hidden');
}

/**
 * Render uploaded files list
 */
function renderUploadedFiles() {
    const container = document.getElementById('uploaded-files');
    const section = document.getElementById('uploaded-files-section');
    const count = document.getElementById('files-count');
    
    section.classList.remove('hidden');
    count.textContent = uploadedFiles.length;
    
    container.innerHTML = uploadedFiles.map((fileData, index) => {
        const icon = getFileIcon(fileData.type);
        const sizeStr = formatFileSize(fileData.size);
        
        return `
            <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all">
                <div class="flex items-center space-x-4 flex-1">
                    <div class="flex-shrink-0">
                        ${icon}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 dark:text-white truncate">${fileData.name}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">${sizeStr} • Uploaded ${getTimeAgo(fileData.uploadedAt)}</p>
                    </div>
                </div>
                <button class="remove-file-btn ml-4 text-gray-400 hover:text-red-500 transition-colors" data-index="${index}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        `;
    }).join('');
    
    // Add remove button listeners
    container.querySelectorAll('.remove-file-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            removeFile(index);
        });
    });
}

/**
 * Get file icon based on type
 */
function getFileIcon(type) {
    if (type.includes('pdf')) {
        return `<svg class="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z"/>
        </svg>`;
    } else if (type.includes('word') || type.includes('document')) {
        return `<svg class="w-10 h-10 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z"/>
        </svg>`;
    } else if (type.includes('image')) {
        return `<svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>`;
    } else {
        return `<svg class="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>`;
    }
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Get time ago string (reuse from earlier if needed)
 */
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' min ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hr ago';
    return Math.floor(seconds / 86400) + ' days ago';
}

/**
 * Remove a file
 */
function removeFile(index) {
    uploadedFiles.splice(index, 1);
    renderUploadedFiles();
    
    if (uploadedFiles.length === 0) {
        document.getElementById('uploaded-files-section').classList.add('hidden');
        document.getElementById('ai-processing-section').classList.add('hidden');
    }
}

/**
 * Process files with AI (Demo)
 */
async function processFilesWithAI() {
    const btn = document.getElementById('process-files-btn');
    const originalText = btn.innerHTML;
    
    // Show processing state
    btn.disabled = true;
    btn.innerHTML = `
        <svg class="animate-spin w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Processing...
    `;
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Reset button
    btn.disabled = false;
    btn.innerHTML = originalText;
    
    // Show success message
    showSuccess('✨ AI Processing Complete! (Demo Mode) In production, relevant content would be extracted and auto-populated into framework sections.');
    
    // Hide AI section
    document.getElementById('ai-processing-section').classList.add('hidden');
}

// ============================================================================
// FRAMEWORK-SPECIFIC VISUAL ENHANCEMENTS
// ============================================================================

/**
 * Check if current framework has visual enhancements available
 */
function checkAndShowVisualEnhancement() {
    const section = document.getElementById('visual-enhancement-section');
    const description = document.getElementById('visual-enhancement-description');
    const button = document.getElementById('open-visual-mode-btn');
    
    const visualModes = {
        'journey-mapping': {
            description: 'Visualize the user journey across stages with an interactive timeline.',
            modalId: 'journey-map-visual'
        },
        'stakeholder-mapping': {
            description: 'Map stakeholders on a Power/Interest grid for strategic planning.',
            modalId: 'stakeholder-grid-visual'
        },
        'system-mapping': {
            description: 'Create a visual system map showing components and relationships.',
            modalId: 'system-map-visual'
        }
    };
    
    const visualMode = visualModes[frameworkId];
    
    if (visualMode) {
        section.classList.remove('hidden');
        description.textContent = visualMode.description;
        
        // Update button click handler
        button.onclick = () => {
            modal.open(visualMode.modalId);
        };
    } else {
        section.classList.add('hidden');
    }
}

/**
 * Initialize visual mode functionality
 */
function initializeVisualModes() {
    // Journey Map Save
    document.getElementById('save-journey-map-btn')?.addEventListener('click', () => {
        saveJourneyMap();
    });
    
    // Stakeholder Grid Save
    document.getElementById('save-stakeholder-grid-btn')?.addEventListener('click', () => {
        saveStakeholderGrid();
    });
    
    // System Map Save
    document.getElementById('save-system-map-btn')?.addEventListener('click', () => {
        saveSystemMap();
    });
}

/**
 * Save Journey Map data
 */
function saveJourneyMap() {
    const stages = ['awareness', 'consideration', 'decision', 'experience', 'advocacy'];
    const journeyData = {};
    
    stages.forEach(stage => {
        const textarea = document.querySelector(`[data-stage="${stage}"] textarea`);
        if (textarea) {
            journeyData[stage] = textarea.value;
        }
    });
    
    // Save to framework data
    frameworkData['journey-stages'] = JSON.stringify(journeyData);
    saveToLocalStorage();
    
    if (currentUser) {
        autoSaveFramework();
    }
    
    modal.close('journey-map-visual');
    showSuccess('Journey map saved successfully!');
}

/**
 * Save Stakeholder Grid data
 */
function saveStakeholderGrid() {
    const quadrants = document.querySelectorAll('.stakeholder-quadrant textarea');
    const gridData = {};
    
    quadrants.forEach((textarea, index) => {
        const quadrantNames = ['manage-closely', 'keep-informed', 'keep-satisfied', 'monitor'];
        gridData[quadrantNames[index]] = textarea.value;
    });
    
    // Save to framework data
    frameworkData['stakeholder-grid'] = JSON.stringify(gridData);
    saveToLocalStorage();
    
    if (currentUser) {
        autoSaveFramework();
    }
    
    modal.close('stakeholder-grid-visual');
    showSuccess('Stakeholder grid saved successfully!');
}

/**
 * Save System Map data
 */
function saveSystemMap() {
    const centerInput = document.querySelector('#system-map-visual input[placeholder="Core System"]');
    const componentInputs = document.querySelectorAll('.system-node input');
    
    const systemData = {
        center: centerInput?.value || '',
        components: []
    };
    
    componentInputs.forEach(input => {
        if (input.value) {
            systemData.components.push(input.value);
        }
    });
    
    // Save to framework data
    frameworkData['system-structure'] = JSON.stringify(systemData);
    saveToLocalStorage();
    
    if (currentUser) {
        autoSaveFramework();
    }
    
    modal.close('system-map-visual');
    showSuccess('System map saved successfully!');
}

/**
 * Load visual data when opening modals
 */
function loadVisualData() {
    // Load Journey Map data
    if (frameworkData['journey-stages']) {
        try {
            const journeyData = JSON.parse(frameworkData['journey-stages']);
            Object.keys(journeyData).forEach(stage => {
                const textarea = document.querySelector(`[data-stage="${stage}"] textarea`);
                if (textarea) {
                    textarea.value = journeyData[stage];
                }
            });
        } catch (e) {
            console.error('Error loading journey map data:', e);
        }
    }
    
    // Load Stakeholder Grid data
    if (frameworkData['stakeholder-grid']) {
        try {
            const gridData = JSON.parse(frameworkData['stakeholder-grid']);
            const quadrants = document.querySelectorAll('.stakeholder-quadrant textarea');
            const quadrantNames = ['manage-closely', 'keep-informed', 'keep-satisfied', 'monitor'];
            
            quadrants.forEach((textarea, index) => {
                if (gridData[quadrantNames[index]]) {
                    textarea.value = gridData[quadrantNames[index]];
                }
            });
        } catch (e) {
            console.error('Error loading stakeholder grid data:', e);
        }
    }
    
    // Load System Map data
    if (frameworkData['system-structure']) {
        try {
            const systemData = JSON.parse(frameworkData['system-structure']);
            const centerInput = document.querySelector('#system-map-visual input[placeholder="Core System"]');
            if (centerInput && systemData.center) {
                centerInput.value = systemData.center;
            }
            
            const componentInputs = document.querySelectorAll('.system-node input');
            componentInputs.forEach((input, index) => {
                if (systemData.components[index]) {
                    input.value = systemData.components[index];
                }
            });
        } catch (e) {
            console.error('Error loading system map data:', e);
        }
    }
}

// ============================================================================
// AUTO-SAVE & WORKFLOW IMPROVEMENTS
// ============================================================================

/**
 * Trigger auto-save with debouncing
 */
function triggerAutoSave() {
    hasUnsavedChanges = true;
    updateAutoSaveIndicator('unsaved');
    
    // Clear existing timeout
    if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
    }
    
    // Set new timeout for auto-save (3 seconds after last change)
    autoSaveTimeout = setTimeout(async () => {
        if (currentUser && hasUnsavedChanges) {
            await autoSaveFramework();
        }
    }, 3000);
}

/**
 * Auto-save framework silently
 */
async function autoSaveFramework() {
    if (!currentUser) return;
    
    updateAutoSaveIndicator('saving');
    
    try {
        await db.saveUserFramework(
            currentUser.id,
            frameworkId,
            currentFramework.name,
            frameworkData
        );
        
        hasUnsavedChanges = false;
        lastSavedTime = new Date();
        updateAutoSaveIndicator('saved');
        
        // Hide "saved" indicator after 2 seconds
        setTimeout(() => {
            if (!hasUnsavedChanges) {
                updateAutoSaveIndicator('hidden');
            }
        }, 2000);
        
    } catch (error) {
        console.error('Auto-save failed:', error);
        updateAutoSaveIndicator('error');
    }
}

/**
 * Update auto-save indicator UI
 */
function updateAutoSaveIndicator(state) {
    const indicator = document.getElementById('autosave-indicator');
    const text = document.getElementById('autosave-text');
    const savedIcon = document.getElementById('autosave-saved-icon');
    const savingIcon = document.getElementById('autosave-saving-icon');
    
    if (!indicator) return;
    
    // Hide all icons first
    savedIcon.classList.add('hidden');
    savingIcon.classList.add('hidden');
    
    switch (state) {
        case 'saving':
            indicator.classList.remove('hidden');
            savingIcon.classList.remove('hidden');
            text.textContent = 'Saving...';
            text.className = 'text-gray-600 dark:text-gray-400';
            break;
            
        case 'saved':
            indicator.classList.remove('hidden');
            savedIcon.classList.remove('hidden');
            text.textContent = 'All changes saved';
            text.className = 'text-green-600 dark:text-green-400';
            break;
            
        case 'unsaved':
            indicator.classList.remove('hidden');
            text.textContent = 'Unsaved changes';
            text.className = 'text-yellow-600 dark:text-yellow-400';
            break;
            
        case 'error':
            indicator.classList.remove('hidden');
            text.textContent = 'Save failed';
            text.className = 'text-red-600 dark:text-red-400';
            break;
            
        case 'hidden':
            indicator.classList.add('hidden');
            break;
    }
}

/**
 * Initialize keyboard shortcuts
 */
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Check for Ctrl/Cmd key
        const modifier = e.ctrlKey || e.metaKey;
        
        if (!modifier) return;
        
        // Ctrl/Cmd + S: Save
        if (e.key === 's') {
            e.preventDefault();
            saveFramework();
        }
        
        // Ctrl/Cmd + E: Export PDF
        else if (e.key === 'e') {
            e.preventDefault();
            exportAsPDF();
        }
        
        // Ctrl/Cmd + K: Show shortcuts
        else if (e.key === 'k') {
            e.preventDefault();
            modal.open('shortcuts-modal');
        }
        
        // Ctrl/Cmd + /: Toggle AI chat
        else if (e.key === '/') {
            e.preventDefault();
            switchTab('ai-chat');
        }
        
        // Ctrl/Cmd + 1/2/3: Switch tabs
        else if (e.key === '1') {
            e.preventDefault();
            switchTab('guided');
        }
        else if (e.key === '2') {
            e.preventDefault();
            switchTab('upload');
        }
        else if (e.key === '3') {
            e.preventDefault();
            switchTab('ai-chat');
        }
        
        // Ctrl/Cmd + Arrow keys: Navigate steps
        else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextStep();
        }
        else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            previousStep();
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
        
        // Ctrl/Cmd + I: Focus input
        else if (e.key === 'i') {
            e.preventDefault();
            document.getElementById('current-step-input')?.focus();
        }
        
        // Ctrl/Cmd + D: Clear current section
        else if (e.key === 'd') {
            e.preventDefault();
            if (confirm('Clear current section?')) {
                const section = currentFramework.sections[currentStepIndex];
                frameworkData[section.id] = '';
                document.getElementById('current-step-input').value = '';
                triggerAutoSave();
            }
        }
    });
}

/**
 * Next step function for keyboard shortcut
 */
function nextStep() {
    const nextBtn = document.querySelector('[onclick*="nextStep"]') || 
                    document.querySelector('.next-step-btn');
    if (nextBtn && !nextBtn.disabled) {
        nextBtn.click();
    }
}

/**
 * Previous step function for keyboard shortcut
 */
function previousStep() {
    const prevBtn = document.querySelector('[onclick*="previousStep"]') || 
                    document.querySelector('.prev-step-btn');
    if (prevBtn && !prevBtn.disabled) {
        prevBtn.click();
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    initializeTabs();
    // initializeFileUpload(); // OLD - replaced by enhanceFileUpload
    initializeThemeToggle();
    initializeDemoAIChat();
    enhanceFileUpload(); // NEW enhanced file upload with AI processing demo
    initializeKeyboardShortcuts();
    initializeVisualModes();
    
    // Load visual data when modals open
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        const modalId = btn.getAttribute('data-close-modal');
        if (modalId.includes('visual')) {
            // Load data when opening visual modals
            btn.closest('[id$="-visual"]')?.addEventListener('transitionend', () => {
                if (!btn.closest('[id$="-visual"]').classList.contains('hidden')) {
                    loadVisualData();
                }
            });
        }
    });
    
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

// ============================================================================
// STEP-AWARE AI CHAT FUNCTIONS
// ============================================================================

/**
 * Initiate a conversation based on the current step
 */
function initiateStepConversation(chatMessages) {
  if (!currentFramework || !currentFramework.sections) {
    console.error('Framework not loaded');
    return;
  }
  
  const currentSection = currentFramework.sections[currentStepIndex];
  if (!currentSection) {
    console.error('Current section not found');
    return;
  }
  
  const sectionId = currentSection.id;
  const sectionData = frameworkData[sectionId];
  const isEmpty = !sectionData || sectionData.trim() === '';

  let greeting, buttons;

  if (isEmpty) {
    // Section is empty - offer help to get started
    greeting = `👋 Let's work on <strong>${currentSection.title}</strong>! I can help you get started with examples, a guided walkthrough, tips, or answer any questions.`;
    buttons = [
      { action: 'example', emoji: '📝', text: 'Show Example' },
      { action: 'guide', emoji: '🗺️', text: 'Guide Me' },
      { action: 'tips', emoji: '💡', text: 'Give Tips' },
      { action: 'questions', emoji: '❓', text: 'Ask Questions' }
    ];
  } else {
    // Section has content - offer enhancement options
    greeting = `Great work on <strong>${currentSection.title}</strong>! 👏 Want me to review what you have, expand on it, suggest improvements, or help with the next section?`;
    buttons = [
      { action: 'review', emoji: '🔍', text: 'Review This' },
      { action: 'expand', emoji: '📈', text: 'Expand Ideas' },
      { action: 'improve', emoji: '✨', text: 'Improve It' },
      { action: 'next', emoji: '➡️', text: 'Next Section' }
    ];
  }

  // Add greeting message
  addChatMessage(greeting, 'ai');

  // Add quick action buttons
  const buttonsHtml = `
    <div class="quick-actions-grid">
      ${buttons.map(btn => `
        <button class="quick-action-btn" data-action="${btn.action}">
          <span class="action-emoji">${btn.emoji}</span>
          <span class="action-text">${btn.text}</span>
        </button>
      `).join('')}
    </div>
  `;

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'chat-message ai-message';
  buttonContainer.innerHTML = buttonsHtml;
  chatMessages.appendChild(buttonContainer);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Attach event listeners to buttons
  buttonContainer.querySelectorAll('.quick-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      handleQuickAction(action, currentSection);
    });
  });
}

/**
 * Add a chat message to the UI
 */
function addChatMessage(content, type = 'user') {
  const chatMessages = document.getElementById('chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${type}-message`;
  messageDiv.innerHTML = content;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
  const chatMessages = document.getElementById('chat-messages');
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-message ai-message typing-indicator';
  typingDiv.id = 'typing-indicator';
  typingDiv.innerHTML = '<span></span><span></span><span></span>';
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Remove typing indicator
 */
function removeTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) {
    indicator.remove();
  }
}

/**
 * Handle quick action button click
 */
async function handleQuickAction(action, section) {
  // Show user's choice
  const actionText = getActionText(action);
  const actionEmoji = getActionEmoji(action);
  addChatMessage(`${actionEmoji} ${actionText}`, 'user');

  // Show typing indicator
  showTypingIndicator();

  // Simulate AI thinking delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Remove typing indicator
  removeTypingIndicator();

  // Generate and show response
  const response = generateActionResponse(action, section);
  addChatMessage(response, 'ai');
}

/**
 * Get display text for action
 */
function getActionText(action) {
  const texts = {
    example: 'Show me an example',
    guide: 'Guide me through this',
    tips: 'Give me some tips',
    questions: 'I have questions',
    review: 'Review what I have',
    expand: 'Help me expand these ideas',
    improve: 'Suggest improvements',
    next: 'Move to next section'
  };
  return texts[action] || action;
}

/**
 * Get emoji for action
 */
function getActionEmoji(action) {
  const emojis = {
    example: '📝',
    guide: '🗺️',
    tips: '💡',
    questions: '❓',
    review: '🔍',
    expand: '📈',
    improve: '✨',
    next: '➡️'
  };
  return emojis[action] || '💬';
}

/**
 * Generate contextual response based on action and current section
 */
function generateActionResponse(action, section) {
  const sectionName = section.title || section.name;
  const sectionId = section.id;

  // Get framework-specific context
  const frameworkType = currentFramework?.id || '';
  const frameworkName = currentFramework?.name || 'framework';
  
  // Response templates organized by action type
  const responses = {
    example: {
      // Project Charter examples
      'project-name': `<strong>Example:</strong> "Customer Onboarding Experience Redesign"<br><br>A good project name should be:<br>• Clear and descriptive<br>• Action-oriented<br>• Specific enough to understand the scope<br>• Professional and memorable`,
      
      'project-background': `<strong>Example:</strong> "Our current onboarding process has a 45% drop-off rate. Customer feedback indicates confusion during the initial setup phase. Competitors are offering smoother experiences, and we're losing potential customers in the first 24 hours. This redesign aims to address these issues and improve retention."<br><br>Notice: Includes the problem, data, impact, and why now.`,
      
      'intent': `<strong>Example:</strong> "To reduce customer frustration during onboarding and increase activation rates by creating a streamlined, intuitive first-time user experience."<br><br>Strong intents:<br>• Focus on the 'why'<br>• Connect to user needs<br>• Are motivating and clear`,
      
      'goal': `<strong>Example:</strong> "Increase onboarding completion rate from 55% to 85% within 6 months, while reducing time-to-first-value from 48 hours to 4 hours."<br><br>SMART goals include:<br>• Specific numbers<br>• Measurable outcomes<br>• Time-bound commitments`,
      
      'stakeholders': `<strong>Example:</strong><br>• <strong>Product Manager:</strong> Owns strategy and prioritization<br>• <strong>UX Designer:</strong> Creates new experience flows<br>• <strong>Engineering Lead:</strong> Technical implementation<br>• <strong>Customer Success:</strong> Provides user insights<br>• <strong>Marketing:</strong> Messaging alignment<br><br>Include role, responsibility, and influence level.`,
      
      'vision-statement': `<strong>Example:</strong> "To become the world's leading sustainable transportation company, making clean mobility accessible to everyone by 2030."<br><br>Notice how it:<br>• States a clear ambition<br>• Includes a time horizon<br>• Defines the impact<br>• Is inspiring yet achievable`,
      
      'target-market': `<strong>Example - B2B SaaS:</strong><br>• <strong>Company Size:</strong> 50-500 employees<br>• <strong>Industry:</strong> Tech startups, digital agencies<br>• <strong>Decision Maker:</strong> VP of Operations, age 35-50<br>• <strong>Pain Point:</strong> Manual workflows costing 20+ hrs/week<br>• <strong>Budget:</strong> $5K-$50K annually<br>• <strong>Geography:</strong> North America, Western Europe<br><br>Be this specific!`,
      
      'default': `<strong>Example for ${sectionName}:</strong><br><br>${section.placeholder || 'Think about your specific context and be concrete with details, numbers, and timelines. Good examples are specific, actionable, and measurable.'}<br><br>What specific aspect would you like me to elaborate on?`
    },

    guide: {
      'project-name': `Let's create a compelling project name:<br><br>🎯 <strong>Formula:</strong> [Action Verb] + [What] + [Why/Outcome]<br><br><strong>Step 1:</strong> What's the main action? (Redesign, Build, Improve, Launch)<br><strong>Step 2:</strong> What are you changing? (specific feature, process, or product)<br><strong>Step 3:</strong> Optional: Add the goal or outcome<br><br><strong>Examples:</strong><br>• Redesign Customer Onboarding<br>• Build AI-Powered Analytics Platform<br>• Improve Mobile App Performance<br><br>What's your project about?`,
      
      'goal': `Let's create a SMART goal together:<br><br><strong>S - Specific:</strong> What exactly will you achieve?<br><strong>M - Measurable:</strong> How will you track progress?<br><strong>A - Achievable:</strong> Is it realistic given resources?<br><strong>R - Relevant:</strong> Why does this matter?<br><strong>T - Time-bound:</strong> When will it be done?<br><br><strong>Template:</strong><br>"[Increase/Decrease/Achieve] [metric] from [X] to [Y] by [date] by [method]"<br><br>Let's start: What metric matters most for your project?`,
      
      'stakeholders': `I'll help you identify all stakeholders:<br><br><strong>Step 1: Internal Stakeholders</strong><br>• Who's on the project team?<br>• Who approves budgets/decisions?<br>• Who's affected by the outcome?<br><br><strong>Step 2: External Stakeholders</strong><br>• Customers/users<br>• Partners or vendors<br>• Regulatory bodies<br><br><strong>Step 3: For each stakeholder, note:</strong><br>• Their role<br>• Their interest/influence (High/Medium/Low)<br>• How they'll be involved<br><br>Start by listing your project team members.`,
      
      'vision-statement': `Let's build your vision statement step-by-step:<br><br><strong>Step 1:</strong> What transformation do you want to create? (Think big picture)<br><br><strong>Step 2:</strong> Who benefits from this transformation?<br><br><strong>Step 3:</strong> When do you aim to achieve this?<br><br><strong>Step 4:</strong> Combine these into one inspiring sentence.<br><br>Start with Step 1 - what transformation are you aiming for?`,
      
      'target-market': `I'll guide you through defining your target market:<br><br><strong>Step 1:</strong> Demographics - Who are they? (age, income, location)<br><br><strong>Step 2:</strong> Psychographics - What do they value? (beliefs, behaviors, priorities)<br><br><strong>Step 3:</strong> Pain Points - What problems do they face?<br><br><strong>Step 4:</strong> Buying Behavior - How do they make decisions?<br><br>Let's start with demographics. Describe your typical customer.`,
      
      'default': `Let's work through <strong>${sectionName}</strong> together:<br><br>📋 <strong>Step-by-Step Guide:</strong><br><br>1️⃣ <strong>Gather:</strong> Collect all relevant information<br>2️⃣ <strong>Organize:</strong> Group into key themes<br>3️⃣ <strong>Prioritize:</strong> Focus on what's most important<br>4️⃣ <strong>Document:</strong> Write clearly and specifically<br><br>💡 <strong>Tip:</strong> ${section.description || 'Focus on being specific and actionable'}<br><br>Ready to start? Tell me what you know so far.`
    },

    tips: {
      'project-name': `💡 <strong>Project Naming Best Practices:</strong><br><br>✓ Keep it under 5 words<br>✓ Make it memorable and searchable<br>✓ Avoid acronyms unless widely known<br>✓ Test it: Can someone unfamiliar understand it?<br>✓ Consider adding version (v2, 2025, Phase 2) if iterating<br><br>❌ <strong>Avoid:</strong> Generic names like "Project Phoenix" or "Initiative X"`,
      
      'goal': `💡 <strong>Goal-Setting Best Practices:</strong><br><br>✓ Include specific numbers (%, $, quantity)<br>✓ Set a clear deadline<br>✓ Make it challenging but achievable<br>✓ Align with business/user outcomes<br>✓ Consider leading indicators, not just lagging<br><br>❌ <strong>Avoid:</strong> Vague goals like "improve quality" or "increase engagement"`,
      
      'stakeholders': `💡 <strong>Stakeholder Management Tips:</strong><br><br>✓ Map influence vs. interest (2x2 matrix)<br>✓ Identify decision-makers early<br>✓ Consider hidden stakeholders<br>✓ Plan communication frequency per group<br>✓ Update the map as project evolves<br><br>⚠️ <strong>Red flag:</strong> If everyone is "High Influence" - prioritize more carefully!`,
      
      'vision-statement': `💡 <strong>Pro Tips for Vision Statements:</strong><br><br>✓ Keep it concise (1-2 sentences max)<br>✓ Make it aspirational but believable<br>✓ Avoid jargon and buzzwords<br>✓ Focus on impact, not tactics<br>✓ Test it: Would it inspire your team?<br><br>❌ <strong>Common mistake:</strong> Being too vague ("be the best"). Be specific!`,
      
      'target-market': `💡 <strong>Target Market Best Practices:</strong><br><br>✓ Be specific over broad (niche > everyone)<br>✓ Use real data when possible<br>✓ Consider multiple segments<br>✓ Identify the most valuable segment first<br>✓ Think about access and reach<br><br>💡 Remember: Trying to serve everyone = serving no one well.`,
      
      'default': `💡 <strong>Tips for ${sectionName}:</strong><br><br>✓ Be specific and concrete<br>✓ Use data to support claims<br>✓ Think from user/stakeholder perspective<br>✓ Align with your overall ${frameworkName} goals<br>✓ Keep it actionable<br><br>💭 Ask yourself: "Could someone else execute this based on what I wrote?"<br><br>Quality over quantity!`
    },

    questions: {
      'default': `I'm here to help! Common questions about <strong>${sectionName}</strong>:<br><br>• How detailed should this be?<br>• What format works best?<br>• How does this connect to other sections?<br>• What if I'm not sure about something?<br><br>What specific question do you have?`
    },

    review: {
      'default': `I'd be happy to review your <strong>${sectionName}</strong>! 🔍<br><br>I'll look at:<br>• Clarity and completeness<br>• Alignment with your goals<br>• Actionability<br>• Potential gaps or improvements<br><br>To give you the best feedback, could you share what specific aspect you'd like me to focus on?`
    },

    expand: {
      'default': `Great! Let's expand on your <strong>${sectionName}</strong>. 📈<br><br>I can help you:<br>• Add more depth and detail<br>• Explore implications<br>• Identify related opportunities<br>• Connect to other frameworks<br><br>Which direction interests you most?`
    },

    improve: {
      'default': `Let's refine your <strong>${sectionName}</strong>! ✨<br><br>Areas we can improve:<br>• Clarity and precision<br>• Strategic alignment<br>• Measurability<br>• Feasibility<br><br>I'll need to see what you have. Could you paste the key points you want to improve?`
    },

    next: {
      'default': `Ready to move forward? ➡️<br><br>Before we go to the next section, let's make sure you've covered the essentials here:<br><br>✓ Key points documented<br>✓ Specific and actionable<br>✓ Aligned with your goals<br><br>Feeling good about <strong>${sectionName}</strong>? Click the Next button below to continue, or let me know if you want to refine anything first.`
    }
  };

  // Get section-specific response or default
  const actionResponses = responses[action] || {};
  return actionResponses[sectionId] || actionResponses['default'] || `I'm here to help with ${sectionName}. What would you like to know?`;
}
