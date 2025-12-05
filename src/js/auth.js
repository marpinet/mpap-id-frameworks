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
    const isDemoMode = localStorage.getItem('demoMode') === 'true';
    
    if (user || isDemoMode) {
        // User is logged in or in demo mode
        authButtons?.classList.add('hidden');
        userMenu?.classList.remove('hidden');
        
        // Update profile button text for demo mode
        if (isDemoMode && !user) {
            const profileBtn = document.getElementById('profile-btn');
            if (profileBtn) {
                profileBtn.textContent = '🎭 Demo Mode';
                profileBtn.onclick = (e) => {
                    e.preventDefault();
                    alert('Demo Mode Active\n\n✅ You can use all features\n💾 Your work saves locally\n🔄 Sign up to sync across devices');
                };
            }
        }
    } else {
        // User is logged out
        authButtons?.classList.remove('hidden');
        userMenu?.classList.add('hidden');
    }
}

// Improved error messages mapping
function getUserFriendlyError(error) {
    const message = error?.message || error || 'An error occurred';
    
    // Map common Supabase errors to user-friendly messages
    const errorMappings = {
        'Invalid login credentials': 'Incorrect email or password. Please try again.',
        'User already registered': 'An account with this email already exists. Try logging in instead.',
        'Invalid email': 'Please enter a valid email address.',
        'Password should be at least 6 characters': 'Your password must be at least 6 characters long.',
        'Unable to validate email address: invalid format': 'Please enter a valid email address.',
        'Email rate limit exceeded': 'Too many attempts. Please wait a few minutes and try again.',
        'For security purposes, you can only request this once every 60 seconds': 'Please wait a minute before trying again.',
    };
    
    // Check if message contains any of our mapped errors
    for (const [key, value] of Object.entries(errorMappings)) {
        if (message.includes(key)) {
            return value;
        }
    }
    
    // Return original message if no mapping found
    return message;
}

// Show error message
export function showError(error, containerId = 'error-message') {
    const errorContainer = document.getElementById(containerId);
    const friendlyMessage = getUserFriendlyError(error);
    
    if (errorContainer) {
        // Handle both inline errors and toast notifications
        if (containerId.includes('error') && !containerId.includes('message')) {
            // Inline error (in forms)
            errorContainer.textContent = friendlyMessage;
            errorContainer.classList.remove('hidden');
        } else {
            // Toast notification
            const span = errorContainer.querySelector('span') || errorContainer;
            span.textContent = friendlyMessage;
            errorContainer.classList.remove('hidden');
            setTimeout(() => {
                errorContainer.classList.add('hidden');
            }, 5000);
        }
    }
}

// Show success message
export function showSuccess(message, containerId = 'success-message') {
    const successContainer = document.getElementById(containerId);
    if (successContainer) {
        const span = successContainer.querySelector('span') || successContainer;
        span.textContent = message;
        successContainer.classList.remove('hidden');
        setTimeout(() => {
            successContainer.classList.add('hidden');
        }, 4000);
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
        showSuccess('🎉 Account created successfully! You\'re now logged in.');
        
        // Reset form
        event.target.reset();
        
        // Reload to update UI
        setTimeout(() => {
            window.location.reload();
        }, 1000);
        
    } catch (error) {
        showError(error.message, 'signup-error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

// Handle logout
export async function handleLogout() {
    const isDemoMode = localStorage.getItem('demoMode') === 'true';
    
    if (isDemoMode) {
        // Exit demo mode
        localStorage.removeItem('demoMode');
        showSuccess('Exited Demo Mode');
        window.location.reload();
        return;
    }
    
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

// Handle forgot password
export async function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('forgot-password-email').value;
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    try {
        const { error } = await auth.resetPassword(email);
        
        if (error) throw error;
        
        // Success!
        modal.close('forgot-password-modal');
        showSuccess('Password reset link sent! Check your email.');
        
        // Reset form
        event.target.reset();
        
    } catch (error) {
        showError(error.message, 'forgot-password-error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

// Initialize auth listeners
export function initializeAuth() {
    // Check for demo mode first
    const isDemoMode = localStorage.getItem('demoMode') === 'true';
    if (isDemoMode) {
        updateAuthUI(null); // Will show demo mode UI
        console.log('🎭 Demo Mode is active');
    }
    
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
    
    const signupButtons = document.querySelectorAll('#signup-btn, #mobile-signup-btn, #cta-signup-btn');
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
    
    // Forgot password link
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    forgotPasswordLink?.addEventListener('click', (e) => {
        e.preventDefault();
        modal.close('login-modal');
        modal.open('forgot-password-modal');
    });
    
    // Back to login from forgot password
    const backToLogin = document.getElementById('back-to-login');
    backToLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        modal.close('forgot-password-modal');
        modal.open('login-modal');
    });
    
    // Forgot password form
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    forgotPasswordForm?.addEventListener('submit', handleForgotPassword);
    
    // Demo Mode buttons
    const demoModeLogin = document.getElementById('demo-mode-login');
    demoModeLogin?.addEventListener('click', () => {
        enableDemoMode();
        modal.close('login-modal');
    });
    
    const demoModeSignup = document.getElementById('demo-mode-signup');
    demoModeSignup?.addEventListener('click', () => {
        enableDemoMode();
        modal.close('signup-modal');
    });
}

// Enable demo/guest mode
function enableDemoMode() {
    // Set a flag in localStorage to indicate demo mode
    localStorage.setItem('demoMode', 'true');
    
    // Show success message
    showSuccess('🎭 Demo Mode activated! You can explore all features. Your work will be saved locally.');
    
    // Reload to update UI
    setTimeout(() => {
        window.location.reload();
    }, 1500);
}
