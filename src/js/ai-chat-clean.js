// AI CHAT FUNCTIONS - CLEAN VERSION
// This file contains the enhanced AI chat functionality

// Enhanced AI Chat with step-aware questioning
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
    
    // AI asks about current step automatically
    initiateStepConversation();
    
    const sendMessage = async () => {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addChatMessage(message, 'user');
        
        // Clear input
        chatInput.value = '';
        
        // Show typing indicator
        const typingMsg = showTypingIndicator();
        
        // Simulate AI response after delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Remove typing indicator
        typingMsg.remove();
        
        // Generate smart response based on context
        const response = generateSmartResponse(message);
        addChatMessage(response, 'ai');
    };
    
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

// Continue in framework-page.js...
