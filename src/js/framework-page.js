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
    chatInput.placeholder = 'Type your message here...';
    
    // Remove "coming soon" message
    const comingSoon = chatMessages.querySelector('.text-center');
    if (comingSoon) {
        comingSoon.remove();
    }
    
    // Add initial AI greeting message
    const greetingMsg = document.createElement('div');
    greetingMsg.className = 'flex justify-start';
    greetingMsg.innerHTML = `
        <div class="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 max-w-[85%]">
            <p class="font-semibold mb-2">👋 Hello! I'm your AI assistant for the ${currentFramework?.name || 'framework'}.</p>
            <p class="mb-3">I'm here to help you complete this framework step by step. Here's what I can do for you:</p>
            <ul class="list-disc list-inside space-y-1 mb-3 text-sm">
                <li><strong>Provide examples</strong> for each section</li>
                <li><strong>Research information</strong> relevant to your project</li>
                <li><strong>Suggest content</strong> based on best practices</li>
                <li><strong>Answer questions</strong> about the framework</li>
            </ul>
            <p class="font-semibold">To get started, try asking:</p>
            <ul class="list-none space-y-1 text-sm mt-2">
                <li>• "Can you give me an example for the first section?"</li>
                <li>• "Help me understand what this framework is for"</li>
                <li>• "What should I include in the [section name]?"</li>
            </ul>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">Note: This is a demo version. Full AI integration coming soon!</p>
        </div>
    `;
    chatMessages.appendChild(greetingMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
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
