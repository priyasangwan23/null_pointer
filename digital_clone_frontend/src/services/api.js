// src/services/api.js
// Central service for all backend API calls

const BASE_URL = 'http://localhost:5000';

/**
 * Send a chat message to Priya (Ollama backend)
 * @param {string} message - The user's message
 * @param {Array} history - Past messages [{role: 'user'|'assistant', content: string}]
 * @param {string} role - Relationship role: friend|best_friend|mother|elder|stranger
 * @returns {Promise<string>} Priya's reply text
 */
export async function sendMessage(message, history = [], role = 'friend', onChunk = () => { }) {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, role }),
  });

  if (!res.ok) {
    throw new Error(`Backend error: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunkText = decoder.decode(value, { stream: true });
    fullText += chunkText;
    onChunk(chunkText);
  }

  return fullText;
}

/**
 * Fetch personality data derived from the style dataset
 * @returns {Promise<Object>}
 */
export async function fetchPersonality() {
  const res = await fetch(`${BASE_URL}/api/personality`);
  if (!res.ok) throw new Error(`Backend error: ${res.status}`);
  return res.json();
}

/**
 * Health check — returns true if backend is reachable
 * @returns {Promise<boolean>}
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${BASE_URL}/api/test`);
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Upload a WhatsApp chat export to analyze and learn the user's style
 * @param {File} file - The .txt chat export file
 * @param {string} senderName - (optional) Name of the sender to extract messages for
 * @param {string} category - (optional) 'casual', 'respectful', or 'neutral'
 * @returns {Promise<Object>} API response with stats
 */
export async function uploadChat(file, senderName = '', category = 'casual') {
  const formData = new FormData();
  formData.append('file', file);
  if (senderName) formData.append('senderName', senderName);
  formData.append('category', category);

  const res = await fetch(`${BASE_URL}/api/upload-chat`, {
    method: 'POST',
    body: formData, // fetch sets the appropriate multipart/form-data headers automatically
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Backend error: ${res.status}`);
  }

  return data;
}
