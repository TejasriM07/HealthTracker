import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { entryService } from '../services/entryService';
import { useAuth } from '../contexts/AuthContext';
import {
  ChartBarIcon,
  TrophyIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Homepage = () => {
  const { user } = useAuth();
  const [todayComparison, setTodayComparison] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [todayData, weeklyData] = await Promise.all([
          entryService.getTodayComparison(),
          entryService.getWeeklyStats()
        ]);
        setTodayComparison(todayData);
        setWeeklyStats(weeklyData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Today's goals chart data
  const todayChartData = {
    labels: ['Workout Minutes', 'Water (Liters)'],
    datasets: [
      {
        label: 'Goal',
        data: todayComparison?.goal ? [
          todayComparison.goal.workoutMinutes,
          todayComparison.goal.waterConsumption
        ] : [0, 0],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Actual',
        data: todayComparison?.totals ? [
          todayComparison.totals.workoutMinutes,
          todayComparison.totals.waterConsumption
        ] : [0, 0],
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Weekly stats chart data
  const weeklyChartData = {
    labels: weeklyStats?.weeklyStats.map(stat => 
      new Date(stat.date).toLocaleDateString('en-US', { weekday: 'short' })
    ) || [],
    datasets: [
      {
        label: 'Workout Minutes',
        data: weeklyStats?.weeklyStats.map(stat => stat.workoutMinutes) || [],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Water Consumption (L)',
        data: weeklyStats?.weeklyStats.map(stat => stat.waterConsumption) || [],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg mb-8">
          <div className="px-6 py-12 sm:px-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                HealthTracker Dashboard
              </h1>
              <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                Track your daily activities, set meaningful goals, 
                and visualize your progress with beautiful, insightful charts.
              </p>
            </div>
          </div>
        </div>

        {/* Personalized Welcome Section */}
        {user && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Welcome back, {user.username}! 👋
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Here's your health dashboard for today
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Today's Goals vs Actual */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <ChartBarIcon className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Today's Goals Progress</h2>
            </div>
            
            {todayComparison?.goal && todayComparison?.totals ? (
              <div>
                <div className="h-64 mb-4">
                  <Bar data={todayChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      todayComparison.comparison?.workoutMinutes.achieved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {todayComparison.comparison?.workoutMinutes.achieved ? '✓' : '✗'} Workout Goal
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      todayComparison.comparison?.waterConsumption.achieved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {todayComparison.comparison?.waterConsumption.achieved ? '✓' : '✗'} Water Goal
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  {!todayComparison?.goal ? 'No goals set for today' : 'No entry logged for today'}
                </p>
                <div className="space-x-4">
                  <a
                    href="/goals"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    <TrophyIcon className="h-4 w-4 mr-2" />
                    Set Goals
                  </a>
                  <a
                    href="/today"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Log Today's Activity
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Weekly Stats */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Activity Overview</h2>
            
            {weeklyStats && weeklyStats.weeklyStats.length > 0 ? (
              <div>
                <div className="h-64 mb-4">
                  <Line data={weeklyChartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-primary-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-primary-600">
                      {weeklyStats.averages.workoutMinutes}
                    </div>
                    <div className="text-sm text-gray-600">Avg Workout (min)</div>
                  </div>
                  <div className="bg-secondary-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-secondary-600">
                      {weeklyStats.averages.waterConsumption}L
                    </div>
                    <div className="text-sm text-gray-600">Avg Water Intake</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" style={{width: '48px', height: '48px'}} />
                <p className="text-gray-500 mb-4">Start logging your activities to see weekly trends</p>
                <a
                  href="/today"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Log Your First Activity
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Cards */}
        {weeklyStats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow-lg rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrophyIcon className="h-8 w-8 text-yellow-500" style={{width: '32px', height: '32px'}} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Entries This Week
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {weeklyStats.totalEntries}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-8 w-8 text-primary-500" style={{width: '32px', height: '32px'}} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Workout Time
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {weeklyStats.weeklyStats.reduce((sum, stat) => sum + stat.workoutMinutes, 0)} min
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">💧</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Water Intake
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {weeklyStats.weeklyStats.reduce((sum, stat) => sum + stat.waterConsumption, 0).toFixed(1)}L
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Homepage;