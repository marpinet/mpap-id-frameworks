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

// Demo AI Chat functionality
function initializeDemoAIChat() {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-chat-btn');
    const chatMessages = document.getElementById('chat-messages');
    
    // Enable the chat (demo mode)
    chatInput.disabled = false;
    sendButton.disabled = false;
    
    // Update placeholder
    chatInput.placeholder = 'Ask the AI for help (Demo Mode)...';
    
    // Remove "coming soon" message
    const comingSoon = chatMessages.querySelector('.text-center');
    if (comingSoon) {
        comingSoon.remove();
    }
    
    const sendMessage = async () => {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'flex justify-end';
        userMsg.innerHTML = `
            <div class="bg-primary-600 text-white rounded-lg px-4 py-2 max-w-[80%]">
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
            <div class="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 max-w-[80%]">
                ${response}
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">Note: This is a demo response. Real AI integration coming soon!</p>
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
    
    // Context-aware responses based on current framework
    if (message.includes('help') || message.includes('how')) {
        return `I can help you complete the ${currentFramework?.name || 'framework'}! Each section has specific guidance. Would you like me to suggest content for a particular section, or would you like general tips for completing this framework?`;
    }
    
    if (message.includes('example') || message.includes('sample')) {
        return `Here's an example for the ${currentFramework?.name || 'framework'}:\n\nFor the first section, you might write: "Our project aims to improve user engagement by 40% through redesigning the onboarding experience. We'll focus on reducing friction points and providing clear value propositions."\n\nWould you like more specific examples for other sections?`;
    }
    
    if (message.includes('research') || message.includes('data')) {
        return `I can help you find relevant research! For ${currentFramework?.name || 'this framework'}, I'd recommend looking into:\n\n• Industry benchmarks and case studies\n• User research methodologies\n• Best practices from similar projects\n\nWhat specific area would you like me to research further?`;
    }
    
    if (message.includes('stakeholder') || message.includes('people')) {
        return `For stakeholder analysis, consider identifying:\n\n1. Primary stakeholders (directly impacted)\n2. Secondary stakeholders (indirectly affected)\n3. Key influencers and decision-makers\n4. End users and beneficiaries\n\nWould you like help mapping their relationships or influence levels?`;
    }
    
    // Default helpful response
    return `I understand you're asking about "${userMessage}". In the context of ${currentFramework?.name || 'this framework'}, I can help by:\n\n• Providing examples and templates\n• Researching relevant information\n• Suggesting best practices\n• Reviewing your content\n\nWhat specific aspect would you like me to focus on?`;
}

// Demo file processing
function enhanceFileUpload() {
    const fileInput = document.getElementById('file-upload');
    
    fileInput?.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        const uploadedFilesContainer = document.getElementById('uploaded-files');
        uploadedFilesContainer.classList.remove('hidden');
        uploadedFilesContainer.innerHTML = '';
        
        files.forEach(async (file) => {
            const fileEl = document.createElement('div');
            fileEl.className = 'flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700';
            fileEl.innerHTML = `
                <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                    <div>
                        <span class="text-sm text-gray-700 dark:text-gray-300">${file.name}</span>
                        <p class="text-xs text-gray-500">Processing...</p>
                    </div>
                </div>
                <span class="text-xs text-gray-500">${(file.size / 1024).toFixed(1)} KB</span>
            `;
            uploadedFilesContainer.appendChild(fileEl);
            
            // Simulate processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const statusEl = fileEl.querySelector('p');
            statusEl.textContent = 'Processed (Demo)';
            statusEl.classList.add('text-green-600');
        });
        
        // Show demo message after processing
        setTimeout(() => {
            showSuccess('Files processed! In production, AI would analyze these and populate framework sections.');
        }, 2500);
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    initializeTabs();
    initializeFileUpload();
    initializeThemeToggle();
    initializeDemoAIChat();
    enhanceFileUpload();
    
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
