import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
    },
});

// Auth helper functions
export const auth = {
    // Sign up new user
    async signUp(email, password, metadata = {}) {
        try {
            // Sign up with Supabase
            // Note: If "Confirm email" is disabled in Supabase settings,
            // this will automatically create a session and log the user in
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: metadata,
                    emailRedirectTo: window.location.origin,
                },
            });
            
            if (error) throw error;
            
            // If email confirmation is enabled and no session was created,
            // automatically sign in the user for demo purposes
            if (data?.user && !data.session) {
                console.log('No session after signup, attempting auto sign-in...');
                const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                
                if (signInError) {
                    console.error('Auto sign-in failed:', signInError);
                    // Return signup data even if auto sign-in fails
                    // User can still log in manually
                    return { data, error: null };
                }
                
                console.log('Auto sign-in successful');
                return { data: signInData, error: null };
            }
            
            // Session was created successfully
            console.log('Signup successful with session');
            return { data, error: null };
        } catch (error) {
            console.error('Sign up error:', error);
            return { data: null, error };
        }
    },

    // Sign in existing user
    async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Sign in error:', error);
            return { data: null, error };
        }
    },

    // Sign out current user
    async signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Sign out error:', error);
            return { error };
        }
    },

    // Reset password - sends email with reset link
    async resetPassword(email) {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Reset password error:', error);
            return { error };
        }
    },

    // Update password (used after reset link is clicked)
    async updatePassword(newPassword) {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });
            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Update password error:', error);
            return { error };
        }
    },

    // Get current session
    async getSession() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            return { session, error: null };
        } catch (error) {
            console.error('Get session error:', error);
            return { session: null, error };
        }
    },

    // Get current user
    async getUser() {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) throw error;
            return { user, error: null };
        } catch (error) {
            console.error('Get user error:', error);
            return { user: null, error };
        }
    },

    // Listen to auth state changes
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback);
    },

    // Reset password
    async resetPassword(email) {
        try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password.html`,
            });
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Reset password error:', error);
            return { data: null, error };
        }
    },

    // Update password
    async updatePassword(newPassword) {
        try {
            const { data, error } = await supabase.auth.updateUser({
                password: newPassword,
            });
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Update password error:', error);
            return { data: null, error };
        }
    },
};

// Database helper functions
export const db = {
    // Get all frameworks for current user
    async getUserFrameworks(userId) {
        try {
            const { data, error } = await supabase
                .from('frameworks')
                .select('*')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false });
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Get user frameworks error:', error);
            return { data: null, error };
        }
    },

    // Create new framework
    async createFramework(frameworkData) {
        try {
            const { data, error } = await supabase
                .from('frameworks')
                .insert([frameworkData])
                .select()
                .single();
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Create framework error:', error);
            return { data: null, error };
        }
    },

    // Update framework
    async updateFramework(frameworkId, updates) {
        try {
            const { data, error } = await supabase
                .from('frameworks')
                .update(updates)
                .eq('id', frameworkId)
                .select()
                .single();
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Update framework error:', error);
            return { data: null, error };
        }
    },

    // Delete framework
    async deleteFramework(frameworkId) {
        try {
            const { error } = await supabase
                .from('frameworks')
                .delete()
                .eq('id', frameworkId);
            
            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Delete framework error:', error);
            return { error };
        }
    },

    // Get single framework
    async getFramework(frameworkId) {
        try {
            const { data, error } = await supabase
                .from('frameworks')
                .select('*')
                .eq('id', frameworkId)
                .single();
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Get framework error:', error);
            return { data: null, error };
        }
    },
};

// Storage helper functions
export const storage = {
    // Upload file
    async uploadFile(bucket, path, file) {
        try {
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(path, file, {
                    cacheControl: '3600',
                    upsert: false,
                });
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Upload file error:', error);
            return { data: null, error };
        }
    },

    // Get public URL for file
    getPublicUrl(bucket, path) {
        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);
        
        return data.publicUrl;
    },

    // Delete file
    async deleteFile(bucket, path) {
        try {
            const { error } = await supabase.storage
                .from(bucket)
                .remove([path]);
            
            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Delete file error:', error);
            return { error };
        }
    },

    // List files in folder
    async listFiles(bucket, folder) {
        try {
            const { data, error } = await supabase.storage
                .from(bucket)
                .list(folder);
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('List files error:', error);
            return { data: null, error };
        }
    },
};

export default supabase;
