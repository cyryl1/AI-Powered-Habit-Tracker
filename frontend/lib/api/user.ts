import { User, UpdateSettingsPayload } from '@/types';

export async function getUser(): Promise<User> {
  const response = await fetch('/api/v1/users/me');
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

export async function updateUserSettings(settings: UpdateSettingsPayload): Promise<User> {
  const response = await fetch('/api/v1/users/settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update user settings');
  }

  return response.json();
}

export async function exportUserData(userId: string): Promise<Blob> {
  const response = await fetch(`/api/user/${userId}/export`, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to export user data');
  }

  return response.blob();
}