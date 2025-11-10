import { User, UpdateSettingsPayload } from '@/types';
import { BASE_URL } from "../../config";

export async function getUser(): Promise<User | null> {
  const response = await fetch(`${BASE_URL}users/me`, {  // ✅ Fixed: Added parentheses
    credentials: 'include',  // ✅ Added: Must send cookies
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

export async function updateUserSettings(
  payload: UpdateSettingsPayload & { name?: string; email?: string }
): Promise<User> {
  const { name, email, ...settings } = payload;
  
  const body: { 
    name?: string; 
    email?: string; 
    insightFrequency?: string; 
    analysisDepth?: string; 
    habitReminders?: boolean; 
    streakAlerts?: boolean; 
    aiInsights?: boolean;
  } = { ...settings };
  
  if (name !== undefined) body.name = name;
  if (email !== undefined) body.email = email;

  console.log("body: ", body)
  
  const response = await fetch(`${BASE_URL}users/update-settings`, {  // ✅ Fixed: Added parentheses
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update user settings');
  }
  
  return response.json();
}

export async function exportUserData(userId: string): Promise<Blob> {
  const response = await fetch(`${BASE_URL}users/${userId}/export`, {  // ✅ Fixed: Added parentheses and used BASE_URL
    method: 'GET',
    credentials: 'include'
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to export user data');
  }
  
  return response.blob();
}