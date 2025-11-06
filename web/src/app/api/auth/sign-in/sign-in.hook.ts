import { createBrowserClient } from "@/lib/supabase/supabase.browser";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import * as Routes from "@/lib/routes";
import { toast } from "sonner";
import { usePostHog } from "posthog-js/react";
import posthog from "posthog-js";
import { useLanguage } from "@/contexts/LanguageContext";

export function useSignInWithEmail() {
  const router = useRouter();
  const posthog = usePostHog();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const supabase = createBrowserClient();
  
      const response = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (response.error) {
        throw response.error;
      }
    },
    onSuccess: () => {
      // Check if there's a return URL in the query params, otherwise go to home
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('returnUrl') || Routes.HOME.getPath();
      router.push(returnUrl);
    },
    onError: (error) => {
      switch (error.message) {
        case 'Invalid login credentials':
          toast.error(t('invalidEmailOrPassword'));
          break;
        case 'Email not confirmed':
          toast.error(t('emailNotConfirmed'));
          break;
        default:
          posthog.captureException(error);
          toast.error(t('somethingWentWrong'));
          break;
      }
    },
  });
}

export function useSignInWithSocial() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  
  return useMutation({
    mutationFn: async (provider: "google") => {
      const supabase = createBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
        redirectTo: `${window.origin}/api/auth/callback?next=${searchParams.get('next') ?? Routes.HOME.getPath()}`,
      },
      });
      
      if (error) {
        throw error;
      }
    },
    onError: (error) => {
      posthog.captureException(error);
      toast.error(t('somethingWentWrong'));
    }
  });
}

export function useSignInWithMagicLink(onError?: (error: Error) => void) {
  const router = useRouter();
  const posthog = usePostHog();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: async (email: string) => {
      // Validate environment variables FIRST before attempting to create client
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      console.log('=== ENVIRONMENT VARIABLE CHECK ===');
      console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ MISSING');
      console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ MISSING');
      
      if (!supabaseUrl || !supabaseAnonKey) {
        const missing = [];
        if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL');
        if (!supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
        
        const errorMsg = `Missing required environment variables: ${missing.join(', ')}\n\n` +
          `Please check your .env.local file in the web/ directory and ensure these variables are set.\n` +
          `After adding them, restart your development server with: npm run dev`;
        
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      // Validate URL format
      if (!supabaseUrl.includes('supabase.co')) {
        const errorMsg = `Invalid Supabase URL format: ${supabaseUrl}\n\n` +
          `Expected format: https://your-project-id.supabase.co\n` +
          `Please check your NEXT_PUBLIC_SUPABASE_URL in .env.local`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      // Validate key format (JWT tokens start with 'eyJ')
      if (!supabaseAnonKey.startsWith('eyJ')) {
        const errorMsg = `Invalid Supabase anon key format\n\n` +
          `The anon key should start with 'eyJ' (it's a JWT token).\n` +
          `Please check your NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      const supabase = createBrowserClient();
      
      // Check if there's a redirect URL in the query params
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrlFromQuery = urlParams.get('redirect');
      const redirectUrlFromStorage = localStorage.getItem('auth_redirect') || '';
      
      // Use redirect from query params first, then localStorage, then let callback determine
      const redirectUrl = redirectUrlFromQuery || redirectUrlFromStorage;
      console.log('Magic link hook - chosen redirect URL:', redirectUrl, {
        fromQuery: redirectUrlFromQuery,
        fromStorage: redirectUrlFromStorage,
      });
      
      // Include redirect URL in the magic link callback URL
      // In development (localhost), always use window.location.origin to avoid port mismatches
      // In production, use NEXT_PUBLIC_APP_URL if set, otherwise fallback to window.location.origin
      const isLocalhost = typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      
      const baseUrl = isLocalhost 
        ? window.location.origin 
        : (process.env.NEXT_PUBLIC_APP_URL || window.location.origin);
      
      // Try without query parameters first if redirect URL is provided
      // This helps avoid 504 errors if Supabase doesn't support wildcards properly
      // We'll handle the redirect via localStorage instead
      const emailRedirectTo = `${baseUrl}/auth/confirm`;
      
      console.log('=== MAGIC LINK CONFIGURATION ===');
      console.log('Environment:', isLocalhost ? 'LOCAL DEVELOPMENT' : 'PRODUCTION');
      console.log('Supabase Project:', supabaseUrl);
      console.log('Base URL:', baseUrl);
      console.log('Redirect URL from params/storage:', redirectUrl);
      console.log('Magic link email redirect to:', emailRedirectTo);
      console.log('');
      console.log('⚠️  IMPORTANT: Make sure this URL is whitelisted in THIS Supabase project:');
      console.log('   Project:', supabaseUrl);
      console.log('   Supabase Dashboard → Authentication → URL Configuration → Redirect URLs');
      console.log('   Add:', emailRedirectTo);
      console.log('   Also verify Site URL is set to:', baseUrl);
      console.log('');
      const projectId = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
      console.log('🔗 Direct link to configure:', `https://supabase.com/dashboard/project/${projectId}/auth/url-configuration`);
      console.log('');
      if (isLocalhost) {
        console.log('🔧 LOCAL DEVELOPMENT CHECKLIST:');
        console.log('   ✅ Environment variables are set');
        console.log('   1. Make sure you\'re using the DEV Supabase project (not production)');
        console.log('   2. Check that Email Auth is enabled: https://supabase.com/dashboard/project/' + projectId + '/settings/auth');
        console.log('   3. Verify redirect URLs are whitelisted: http://localhost:' + (window.location.port || '3000') + '/auth/confirm');
        console.log('   4. Check Supabase Auth logs: https://supabase.com/dashboard/project/' + projectId + '/logs/explorer');
        console.log('   5. If you just added .env.local variables, RESTART your dev server!');
      }
      console.log('📝 Note: Redirect parameter is stored in localStorage and will be handled after auth.');
      console.log('==================================');
      
      // Store redirect URL in localStorage as backup (even if empty, so callback can determine)
      localStorage.setItem('auth_redirect', redirectUrl || '');
      console.log('Stored redirect URL in localStorage:', redirectUrl || '');
      
      // Retry logic for Supabase timeouts (context deadline exceeded)
      let lastError;
      const maxRetries = 2;
      const startTime = Date.now();
      
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        if (attempt > 0) {
          console.log(`Retrying magic link request (attempt ${attempt + 1}/${maxRetries + 1})...`);
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
        
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo,
          },
        });
        
        if (!error) {
          // Success - break out of retry loop
          console.log('✅ Magic link sent successfully!');
          return;
        }
        
        lastError = error;
        
        // If it's a timeout error, retry
        const isTimeout = error.status === 504 || 
                         error.message?.toLowerCase().includes('timeout') ||
                         error.message?.toLowerCase().includes('deadline exceeded');
        
        if (!isTimeout || attempt === maxRetries) {
          // Not a timeout or we've exhausted retries - throw the error
          if (attempt === maxRetries && isTimeout) {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            console.error(`❌ All ${maxRetries + 1} attempts failed after ${elapsed}s`);
            console.error('');
            console.error('🔍 Since redirect URLs are configured, this likely means:');
            console.error('');
            console.error('📧 EMAIL SERVICE ISSUE (Most Likely):');
            console.error('   1. Email Auth is disabled in Supabase');
            console.error('      → Go to: Settings → Auth → Enable Email Auth');
            console.error('');
            console.error('   2. Email service not configured');
            console.error('      → Check: Settings → Auth → Email');
            console.error('      → Verify: Supabase email service or Custom SMTP is set up');
            console.error('');
            console.error('   3. Magic Link email template missing/disabled');
            console.error('      → Check: Authentication → Email Templates → Magic Link');
            console.error('');
            console.error('   4. Rate limiting (free tier limits)');
            console.error('      → Wait 10-15 minutes between attempts');
            console.error('      → Try a different email address');
            console.error('');
            console.error('   5. Project paused or inactive');
            console.error('      → Check: Project Settings → General → Project Status');
            console.error('');
            console.error('🌐 NETWORK/OTHER ISSUES:');
            console.error('   6. Network/firewall blocking Supabase email service');
            console.error('   7. Supabase service outage');
            console.error('      → Check: https://status.supabase.com/');
            console.error('');
            console.error('📋 DIAGNOSTIC LINKS:');
            if (supabaseUrl) {
              const projectId = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
              console.error('');
              console.error('   🔗 URL Configuration:', `https://supabase.com/dashboard/project/${projectId}/auth/url-configuration`);
              console.error('      → Verify redirect URL is whitelisted');
              console.error('');
              console.error('   🔗 Auth Settings:', `https://supabase.com/dashboard/project/${projectId}/settings/auth`);
              console.error('      → Enable Email Auth');
              console.error('      → Check Email Templates');
              console.error('      → Verify Email Service Provider');
              console.error('');
              console.error('   🔗 Auth Logs:', `https://supabase.com/dashboard/project/${projectId}/logs/explorer`);
              console.error('      → Filter by "Auth" and check for error messages');
              console.error('      → Look for: "email not sent", "context deadline exceeded"');
              console.error('');
              console.error('   🔗 Project Status:', `https://supabase.com/dashboard/project/${projectId}/settings/general`);
              console.error('      → Verify project is active and not paused');
            }
            console.error('');
            console.error('💡 QUICK FIXES TO TRY:');
            console.error('   1. Wait 10-15 minutes and try again (rate limit)');
            console.error('   2. Try a different email address');
            console.error('   3. Check Supabase status: https://status.supabase.com/');
            console.error('   4. Verify Email Auth is enabled in Supabase dashboard');
            console.error('   5. Check auth logs for specific error messages');
          }
          throw error;
        }
        
        console.log('Timeout error detected, will retry...', error);
      }
      
      // If we get here, all retries failed
      throw lastError;
    },
    onSuccess: () => {
      toast.success(t('checkEmailForMagicLink'));
      // Redirect to success page with magic link indicator
      router.push('/auth/success?from=magiclink');
    },
    onError: (error: Error | { message?: string; status?: number }) => {
      // Log detailed error for debugging
      const errorMessage = error instanceof Error ? error.message : error?.message || 'Unknown error';
      const errorStatus = 'status' in error ? error.status : undefined;
      
      console.error('Magic link error details:', {
        message: errorMessage,
        status: errorStatus,
        error: error,
      });

      // Capture in PostHog (convert to Error if needed)
      const errorToCapture = error instanceof Error 
        ? error 
        : new Error(errorMessage);
      posthog.captureException(errorToCapture);

      // Show user-friendly error message based on error type
      let userErrorMessage = t('magicLinkFailed');
      const errorMsgLower = errorMessage.toLowerCase();
      
      // Handle 504 Gateway Timeout specifically
      if (errorStatus === 504 || errorStatus === 502) {
        const errorMsgLower = errorMessage.toLowerCase();
        const isTimeout = errorMsgLower.includes('timeout') || 
                         errorMsgLower.includes('deadline exceeded') ||
                         errorMsgLower.includes('context deadline');
        
        const currentBaseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        
        if (isTimeout) {
          const supabaseProjectId = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '') || 'your-project';
          userErrorMessage = t('magicLinkFailed') + ': ' + 
            `Supabase service timeout. This usually means either:` +
            `\n1. The redirect URL ${currentBaseUrl}/auth/confirm is not whitelisted in your Supabase project` +
            `\n2. Supabase's email service is slow or overloaded` +
            `\n\nPlease check:` +
            `\n- Supabase Dashboard → Project ${supabaseProjectId} → Authentication → URL Configuration` +
            `\n- Add redirect URL: ${currentBaseUrl}/auth/confirm` +
            `\n- Set Site URL to: ${currentBaseUrl}` +
            `\n- Check Settings → Auth → Email Auth is enabled`;
        } else {
          userErrorMessage = t('magicLinkFailed') + ': ' + 
            `Gateway timeout. This might mean the redirect URL ${currentBaseUrl}/auth/confirm is not whitelisted in Supabase. ` +
            `Please check Supabase Dashboard → Authentication → URL Configuration and add this URL to the Redirect URLs list.`;
        }
      } else if (errorMessage && errorMessage !== '{}' && errorMessage !== 'Unknown error') {
        // Common Supabase errors
        if (errorMsgLower.includes('rate limit') || errorMsgLower.includes('too many')) {
          const rateLimitMsg = t('rateLimitExceeded') || 'Too many requests. Please wait a few minutes and try again.';
          userErrorMessage = t('magicLinkFailed') + ': ' + rateLimitMsg;
        } else if (errorMsgLower.includes('redirect') || errorMsgLower.includes('url')) {
          const redirectMsg = t('redirectUrlError') || 'Redirect URL configuration error. Please contact support.';
          userErrorMessage = t('magicLinkFailed') + ': ' + redirectMsg;
        } else if (errorMsgLower.includes('email')) {
          userErrorMessage = t('magicLinkFailed') + ': ' + errorMessage;
        } else {
          // Show the actual error message if available
          userErrorMessage = t('magicLinkFailed') + ': ' + errorMessage;
        }
      } else if (errorStatus) {
        // If we have a status but no message, provide generic error
        userErrorMessage = t('magicLinkFailed') + `: HTTP ${errorStatus}. Check browser console for details.`;
      }

      // Call custom error handler if provided
      if (onError) {
        onError(errorToCapture);
      } else {
        toast.error(userErrorMessage, {
          duration: 5000,
        });
      }
    },
  });
}