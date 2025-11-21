import { auth } from './supabase.js';

// Modal management
export const modal = {
    open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    },

    close(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    },

    closeAll() {
        const modals = document.querySelectorAll('[id$="-modal"]');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
        document.body.style.overflow = 'auto';
    }
};

// Show/hide UI elements based on auth state
export function updateAuthUI(user) {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    
    if (user) {
        // User is logged in
        authButtons?.classList.add('hidden');
        userMenu?.classList.remove('hidden');
    } else {
        // User is logged out
        authButtons?.classList.remove('hidden');
        userMenu?.classList.add('hidden');
    }
}

// Show error message
export function showError(message, containerId = 'error-message') {
    const errorContainer = document.getElementById(containerId);
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('hidden');
        setTimeout(() => {
            errorContainer.classList.add('hidden');
        }, 5000);
    }
}

// Show success message
export function showSuccess(message, containerId = 'success-message') {
    const successContainer = document.getElementById(containerId);
    if (successContainer) {
        successContainer.textContent = message;
        successContainer.classList.remove('hidden');
        setTimeout(() => {
            successContainer.classList.add('hidden');
        }, 3000);
    }
}

// Handle login form submission
export async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Signing in...';
    
    try {
        const { data, error } = await auth.signIn(email, password);
        
        if (error) throw error;
        
        // Success!
        modal.close('login-modal');
        showSuccess('Successfully logged in!');
        
        // Reset form
        event.target.reset();
        
    } catch (error) {
        showError(error.message, 'login-error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

// Handle signup form submission
export async function handleSignup(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showError('Passwords do not match', 'signup-error');
        return;
    }
    
    // Validate password length
    if (password.length < 6) {
        showError('Password must be at least 6 characters', 'signup-error');
        return;
    }
    
    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Creating account...';
    
    try {
        const { data, error } = await auth.signUp(email, password, { full_name: fullName });
        
        if (error) throw error;
        
        // Success!
        modal.close('signup-modal');
        showSuccess('Account created! Please check your email to verify your account.');
        
        // Reset form
        event.target.reset();
        
    } catch (error) {
        showError(error.message, 'signup-error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

// Handle logout
export async function handleLogout() {
    try {
        const { error } = await auth.signOut();
        
        if (error) throw error;
        
        showSuccess('Successfully logged out!');
        
        // Redirect to home if on a protected page
        if (window.location.pathname !== '/') {
            window.location.href = '/';
        }
        
    } catch (error) {
        showError(error.message);
    }
}

// Initialize auth listeners
export function initializeAuth() {
    // Listen to auth state changes
    auth.onAuthStateChange((event, session) => {
        const user = session?.user || null;
        updateAuthUI(user);
        
        console.log('Auth state changed:', event, user ? 'User logged in' : 'User logged out');
    });
    
    // Check current session on page load
    auth.getSession().then(({ session }) => {
        const user = session?.user || null;
        updateAuthUI(user);
    });
    
    // Set up modal button listeners
    const loginButtons = document.querySelectorAll('#login-btn, #mobile-login-btn');
    loginButtons.forEach(btn => {
        btn?.addEventListener('click', () => modal.open('login-modal'));
    });
    
    const signupButtons = document.querySelectorAll('#signup-btn, #mobile-signup-btn');
    signupButtons.forEach(btn => {
        btn?.addEventListener('click', () => modal.open('signup-modal'));
    });
    
    const logoutButtons = document.querySelectorAll('#logout-btn, #mobile-logout-btn');
    logoutButtons.forEach(btn => {
        btn?.addEventListener('click', handleLogout);
    });
    
    // Close modal when clicking outside
    const modals = document.querySelectorAll('[id$="-modal"]');
    modals.forEach(modalEl => {
        modalEl?.addEventListener('click', (e) => {
            if (e.target === modalEl) {
                modal.close(modalEl.id);
            }
        });
    });
    
    // Close modal buttons
    const closeButtons = document.querySelectorAll('[data-close-modal]');
    closeButtons.forEach(btn => {
        btn?.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-close-modal');
            modal.close(modalId);
        });
    });
    
    // Form submissions
    const loginForm = document.getElementById('login-form');
    loginForm?.addEventListener('submit', handleLogin);
    
    const signupForm = document.getElementById('signup-form');
    signupForm?.addEventListener('submit', handleSignup);
    
    // Switch between login and signup
    const switchToSignup = document.getElementById('switch-to-signup');
    switchToSignup?.addEventListener('click', (e) => {
        e.preventDefault();
        modal.close('login-modal');
        modal.open('signup-modal');
    });
    
    const switchToLogin = document.getElementById('switch-to-login');
    switchToLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        modal.close('signup-modal');
        modal.open('login-modal');
    });
}
