"use client"

import { useAuth } from "@/context/AuthContext";
import HabitForm from "@/components/features/HabitForm"; // Import HabitForm
import HabitList from "@/components/features/HabitList"; // Import HabitList
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login to view your dashboard</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <p className="text-lg text-gray-600 mb-8">
        Welcome, {(user as { email: string })?.email || 'User'}! Here's an overview of your habits.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Habit Summary Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Habit Summary</h2>
          <p className="text-gray-600">You have 0 active habits.</p>
          {/* Placeholder for habit count */}
        </div>

        {/* Progress Overview */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Progress Overview</h2>
          <p className="text-gray-600">No habits tracked yet.</p>
          {/* Placeholder for progress visualization */}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
          <button className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">
            Add New Habit
          </button>
          {/* More actions */}
        </div>
      </div>

      {/* Habit Form Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add a New Habit</h2>
        <HabitForm /> {/* Render the HabitForm component */}
      </div>

      {/* Habit List Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Habits</h2>
        <HabitList /> {/* Render the HabitList component */}
      </div>

      {/* Navigation Links */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Explore</h2>
        <ul className="space-y-2">
          <li>
            <a href="#" className="text-indigo-600 hover:underline">
              View All Habits
            </a>
          </li>
          <li>
            <a href="#" className="text-indigo-600 hover:underline">
              Settings
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};