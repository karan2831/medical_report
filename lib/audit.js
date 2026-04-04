import { createClient } from '@supabase/supabase-js';

/**
 * MedAI Clinical Audit Logger
 * Logs clinical actions to the public.audit_logs table.
 */
export async function logClinicalAction(userId, action, targetId = null) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { error } = await supabase
      .from('audit_logs')
      .insert([
        {
          user_id: userId,
          action,
          target_id: targetId,
          timestamp: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error("Clinical Audit Logging Failed:", error.message);
    }
  } catch (error) {
    console.error("Audit System Exception:", error.message);
  }
}
