'use client';

import { useState, useEffect } from 'react';

import { useAuth } from '@/context/AuthContext';
import { updateUserSettings, exportUserData } from '@/lib/api/user';
import { User, UpdateSettingsPayload } from '@/types';

export default function SettingsPage() {
  const { user, logout, fetchUser } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [aiInsights, setAiInsights] = useState(true);
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [insightFrequency, setInsightFrequency] = useState<'WEEKLY' | 'DAILY' | 'MONTHLY'>('WEEKLY'); // Default AI Insight Frequency
  const [analysisDepth, setAnalysisDepth] = useState<'BASIC' | 'ADVANCED' | 'DEEP_ANALYSIS'>('BASIC'); // Default AI Analysis Depth
  const [habitReminders, setHabitReminders] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const typedUser = user as User;
      setDisplayName(typedUser.name || '');
      setEmail(typedUser.email || '');
      setInsightFrequency(typedUser.settings?.insightFrequency || 'WEEKLY');
      setAnalysisDepth(typedUser.settings?.analysisDepth || 'BASIC');
      setHabitReminders(typedUser.settings?.habitReminders ?? true);
      setStreakAlerts(typedUser.settings?.streakAlerts ?? true);
      setAiInsights(typedUser.settings?.aiInsights ?? true);
      setNotifications(typedUser.settings?.notifications ?? true);
    }
  }, [user]);

  useEffect(() => {
    if (!notifications) {
      setHabitReminders(false);
      setAiInsights(false);
      setStreakAlerts(false);
    }
  }, [notifications]);

  const handleSaveSettings = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (!user?._id) {
        throw new Error('User not authenticated');
      }

      // Basic validation
      if (displayName.trim() === '') {
        throw new Error('Display name cannot be empty.');
      }
      if (!/^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(email)) {
        throw new Error('Invalid email format.');
      }

      await updateUserSettings({ 
        name: displayName, 
        email, 
        settings: {
          insightFrequency: insightFrequency,
          analysisDepth: analysisDepth,
          habitReminders: habitReminders,
          streakAlerts: streakAlerts,
          aiInsights: aiInsights,
          notifications: notifications,
        }
      });
      
      // Fetch updated user data to refresh the context
      await fetchUser();
      
      setSuccess('Settings saved successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    setExporting(true);
    setError(null);
    setSuccess(null);
    try {
      if (!user?._id) {
        throw new Error('User not authenticated');
      }
      const data = await exportUserData(user._id);
      const blobUrl = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `habit_tracker_data_${user._id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      setSuccess('Data exported successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to export data.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex-1 p-6">
      {saving ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-cyan-300 font-mono text-xl">LOADING_SETTINGS...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Settings */}
            <div className="bg-black/60 border border-cyan-400/30 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-mono text-cyan-300 mb-6">
                <span className="text-green-400">👤</span> PROFILE_SETTINGS
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-cyan-300 font-mono text-sm mb-2">
                    DISPLAY_NAME
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-cyan-400/30 rounded-md text-white font-mono focus:border-cyan-400 focus:outline-none"
                    placeholder="Enter display name"
                  />
                </div>
                <div>
                  <label className="block text-cyan-300 font-mono text-sm mb-2">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-cyan-400/30 rounded-md text-white font-mono focus:border-cyan-400 focus:outline-none"
                    placeholder="Enter email"
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-black/60 border border-purple-400/30 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-mono text-purple-300 mb-6">
                <span className="text-green-400">🔔</span> NOTIFICATION_SETTINGS
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-700/30">
                  <div>
                    <div className="text-gray-300 font-mono text-sm">ENABLE_ALL_NOTIFICATIONS</div>
                    <div className="text-gray-500 text-xs">Toggle all notifications on or off</div>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      notifications ? 'bg-green-400' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                      notifications ? 'translate-x-7' : 'translate-x-1'
                    }`}></div>
                  </button>
                </div>
                {[ 
                  { label: 'HABIT_REMINDERS', description: 'Daily habit completion reminders', value: habitReminders, onChange: setHabitReminders },
                  { label: 'AI_INSIGHTS', description: 'Weekly AI-powered insights', value: aiInsights, onChange: setAiInsights },
                  { label: 'STREAK_ALERTS', description: 'Notifications for streak milestones', value: streakAlerts, onChange: setStreakAlerts }
                ].map((setting, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700/30 last:border-0">
                    <div>
                      <div className="text-gray-300 font-mono text-sm">{setting.label}</div>
                      <div className="text-gray-500 text-xs">{setting.description}</div>
                    </div>
                    <button
                      onClick={() => setting.onChange(!setting.value)}
                      className={`w-12 h-6 rounded-full transition-all duration-300 ${
                        setting.value ? 'bg-green-400' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                        setting.value ? 'translate-x-7' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Settings */}
            <div className="bg-black/60 border border-green-400/30 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-mono text-green-300 mb-6">
                <span className="text-cyan-400">🧠</span> AI_PREFERENCES
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-green-300 font-mono text-sm mb-2">
                    INSIGHT_FREQUENCY
                  </label>
                  <select
                    value={insightFrequency}
                    onChange={(e) => setInsightFrequency(e.target.value as 'WEEKLY' | 'DAILY' | 'MONTHLY')}
                    className="w-full px-3 py-2 bg-black/50 border border-green-400/30 rounded-md text-white font-mono focus:border-green-400 focus:outline-none"
                  >
                    <option>DAILY</option>
                    <option>WEEKLY</option>
                    <option>MONTHLY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-green-300 font-mono text-sm mb-2">
                    ANALYSIS_DEPTH
                  </label>
                  <select
                    value={analysisDepth}
                    onChange={(e) => setAnalysisDepth(e.target.value as 'BASIC' | 'ADVANCED' | 'DEEP_ANALYSIS')}
                    className="w-full px-3 py-2 bg-black/50 border border-green-400/30 rounded-md text-white font-mono focus:border-green-400 focus:outline-none"
                  >
                    <option>BASIC</option>
                    <option>ADVANCED</option>
                    <option>DEEP_ANALYSIS</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-black/60 border border-red-400/30 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-mono text-red-300 mb-6">
                <span className="text-green-400">⚡</span> QUICK_ACTIONS
              </h2>
              <div className="space-y-3">
                {error && <p className="text-red-500 text-sm font-mono">Error: {error}</p>}
                {success && <p className="text-green-500 text-sm font-mono">{success}</p>}
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="w-full py-3 bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 font-mono rounded-lg hover:bg-cyan-400/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin mr-2"></div>
                      SAVING...
                    </>
                  ) : (
                    'SAVE_SETTINGS'
                  )}
                </button>
                
                <button
                  onClick={handleExportData}
                  disabled={exporting}
                  className="w-full py-3 bg-purple-400/20 border border-purple-400/30 text-purple-300 font-mono rounded-lg hover:bg-purple-400/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                >
                  {exporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin mr-2"></div>
                      EXPORTING...
                    </>
                  ) : (
                    'EXPORT_DATA'
                  )}
                </button>
                
                <button 
                  onClick={logout}
                  className="w-full py-3 bg-red-400/20 border border-red-400/30 text-red-300 font-mono rounded-lg hover:bg-red-400/30 transition-all duration-300"
                >
                  LOGOUT_SYSTEM
                </button>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-black/60 border border-gray-400/30 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-mono text-gray-300 mb-6">
                <span className="text-green-400">ℹ️</span> SYSTEM_INFO
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">VERSION</span>
                  <span className="text-gray-300">v2.1.3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">USERNAME</span>
                  <span className="text-gray-300">{user?.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">LAST_SYNC</span>
                  <span className="text-gray-300">Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}