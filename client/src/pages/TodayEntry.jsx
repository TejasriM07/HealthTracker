import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { entryService } from '../services/entryService';
import { workoutOptions, workoutIcons, getTodayDateString, formatTime } from '../utils/helpers';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TrophyIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const TodayEntry = () => {
  const [todayComparison, setTodayComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: getTodayDateString(),
    workout: 'Running',
    workoutMinutes: 30,
    waterConsumption: 2.0,
    sleepTime: '23:00',
    wakeupTime: '07:00'
  });
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchTodayData();
  }, []);

  const fetchTodayData = async () => {
    try {
      const comparisonData = await entryService.getTodayComparison();
      setTodayComparison(comparisonData);
      
      // Reset form to default values since we allow multiple entries
      setFormData({
        date: getTodayDateString(),
        workout: 'Running',
        workoutMinutes: 30,
        waterConsumption: 2.0,
        sleepTime: '23:00',
        wakeupTime: '07:00'
      });
    } catch (error) {
      console.error('Error fetching today data:', error);
      setError('Failed to load today\'s data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'workout' ? value : (isNaN(Number(value)) ? value : Number(value))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    try {
      // Always create new entry (multiple entries per day are now allowed)
      await entryService.createEntry(formData);
      
      // Refresh the data
      await fetchTodayData();
      setShowForm(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save entry');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const hasEntries = !!(todayComparison?.entries && todayComparison.entries.length > 0);
  const hasGoal = !!todayComparison?.goal;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Today's Activity</h1>
            <p className="mt-2 text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Quick Entry Form */}
          <div className="bg-white shadow-lg rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Log New Activity
              </h2>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Add Activity
                </button>
              )}
            </div>
            
            {showForm ? (
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Workout</label>
                    <select
                      name="workout"
                      value={formData.workout}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      {workoutOptions.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Workout Minutes</label>
                    <input
                      type="number"
                      name="workoutMinutes"
                      value={formData.workoutMinutes}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Water Consumption (L)</label>
                    <input
                      type="number"
                      name="waterConsumption"
                      value={formData.waterConsumption}
                      onChange={handleChange}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Time</label>
                    <input
                      type="time"
                      name="sleepTime"
                      value={formData.sleepTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Wake Up Time</label>
                    <input
                      type="time"
                      name="wakeupTime"
                      value={formData.wakeupTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                  >
                    {submitLoading ? 'Saving...' : 'Add Entry'}
                  </button>
                </div>
              </form>
            ) : hasEntries && todayComparison?.entries ? (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Activities ({todayComparison.entries.length})</h3>
                  <div className="space-y-4">
                    {todayComparison.entries.map((entry, index) => (
                      <div key={entry._id} className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="flex items-center">
                            {React.createElement(workoutIcons[entry.workout], { className: "h-5 w-5 text-primary-600 mr-2" })}
                            <div>
                              <p className="text-sm text-gray-600">Activity #{index + 1}</p>
                              <p className="font-semibold">{entry.workout}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Duration</p>
                            <p className="font-semibold">{entry.workoutMinutes} min</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Water</p>
                            <p className="font-semibold">{entry.waterConsumption}L</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Sleep</p>
                            <p className="font-semibold text-xs">
                              {formatTime(entry.sleepTime)} - {formatTime(entry.wakeupTime)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {todayComparison.totals && (
                  <div className="border-t pt-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Today's Totals</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-primary-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Total Workout Time</p>
                        <p className="text-xl font-bold text-primary-600">{todayComparison.totals.workoutMinutes} minutes</p>
                      </div>
                      <div className="bg-secondary-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Total Water Intake</p>
                        <p className="text-xl font-bold text-secondary-600">{todayComparison.totals.waterConsumption}L</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center">
                <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No activity logged for today</p>
                <p className="text-gray-400 text-sm">Click "Log Activity" to record your daily health metrics</p>
              </div>
            )}
          </div>

          {/* Goal Comparison */}
          {hasEntries && hasGoal && todayComparison?.comparison && (
            <div className="bg-white shadow-lg rounded-lg mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Goal Progress</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Workout Progress */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">Workout Duration</h3>
                      {todayComparison.comparison.workoutMinutes.achieved ? (
                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircleIcon className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Goal:</span>
                        <span className="font-medium">{todayComparison.comparison.workoutMinutes.goal} min</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Actual:</span>
                        <span className="font-medium">{todayComparison.comparison.workoutMinutes.actual} min</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            todayComparison.comparison.workoutMinutes.achieved ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ 
                            width: `${Math.min(
                              (todayComparison.comparison.workoutMinutes.actual / todayComparison.comparison.workoutMinutes.goal) * 100,
                              100
                            )}%` 
                          }}
                        ></div>
                      </div>
                      <p className={`text-sm ${
                        todayComparison.comparison.workoutMinutes.achieved ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {todayComparison.comparison.workoutMinutes.achieved 
                          ? '🎉 Goal achieved!' 
                          : `${todayComparison.comparison.workoutMinutes.goal - todayComparison.comparison.workoutMinutes.actual} min remaining`
                        }
                      </p>
                    </div>
                  </div>

                  {/* Water Progress */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">Water Consumption</h3>
                      {todayComparison.comparison.waterConsumption.achieved ? (
                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircleIcon className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Goal:</span>
                        <span className="font-medium">{todayComparison.comparison.waterConsumption.goal}L</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Actual:</span>
                        <span className="font-medium">{todayComparison.comparison.waterConsumption.actual}L</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            todayComparison.comparison.waterConsumption.achieved ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ 
                            width: `${Math.min(
                              (todayComparison.comparison.waterConsumption.actual / todayComparison.comparison.waterConsumption.goal) * 100,
                              100
                            )}%` 
                          }}
                        ></div>
                      </div>
                      <p className={`text-sm ${
                        todayComparison.comparison.waterConsumption.achieved ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {todayComparison.comparison.waterConsumption.achieved 
                          ? '🎉 Goal achieved!' 
                          : `${(todayComparison.comparison.waterConsumption.goal - todayComparison.comparison.waterConsumption.actual).toFixed(1)}L remaining`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No Goal Warning */}
          {hasEntries && !hasGoal && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-yellow-800">No Goals Set for Today</h3>
                  <p className="text-yellow-700 mt-1">
                    Set goals for today to track your progress and get meaningful insights.
                  </p>
                  <a
                    href="/goals"
                    className="inline-flex items-center mt-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                  >
                    <TrophyIcon className="h-4 w-4 mr-2" />
                    Set Today's Goals
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white shadow-lg rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="/goals"
                  className="flex items-center justify-center px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <TrophyIcon className="h-6 w-6 text-primary-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Manage Goals</div>
                    <div className="text-sm text-gray-500">Set or update your health goals</div>
                  </div>
                </a>
                
                <a
                  href="/"
                  className="flex items-center justify-center px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <CheckCircleIcon className="h-6 w-6 text-secondary-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">View Dashboard</div>
                    <div className="text-sm text-gray-500">See your progress and trends</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TodayEntry;