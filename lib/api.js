import { supabase } from './supabase';

/**
 * Uploads a file to Supabase Storage and runs AI extraction.
 * Returns the full API response including the report ID for routing.
 * @param {File} file - The file to upload.
 * @returns {Promise<Object>} - The full response including { report, id, analysis, similar_cases }.
 */
export async function uploadFile(file) {
  try {
    // Get current session token to authenticate the API call
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || '';

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to process document through Neural Engine.");
    }

    // Return full response — callers use data.id, data.report, data.analysis
    return data;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw error;
  }
}

/**
 * Logs a clinician action for audit compliance (Phase 8).
 * @param {string} action - The action performed (e.g., 'VIEW_REPORT').
 * @param {string} [targetId] - The ID of the affected resource.
 */
export async function logAuditAction(action, targetId) {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return; // Silent skip if unauthenticated

    await supabase
      .from('audit_logs')
      .insert([{ user_id: user.id, action, target_id: targetId || null }]);
  } catch (error) {
    console.error('Audit Log Error:', error);
    // Non-blocking — audit failures should not break the UI
  }
}

/**
 * Fetches all reports for the current user.
 * @returns {Promise<Array>} - List of reports with extracted_data joined.
 */
export async function getReports() {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*, extracted_data (*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in getReports:', error);
    throw error;
  }
}
