import React, { useState } from 'react';
import { UserProfile, WorkoutPlanType, WorkoutProgress } from '../types';
import { useWorkoutPlans } from '../hooks/useWorkoutPlans';
import WorkoutDay from './WorkoutDay';
import { Calendar, Clock, Target, User, RotateCcw } from 'lucide-react';

interface WorkoutPlanProps {
  userProfile: UserProfile;
  workoutPlan: WorkoutPlanType;
  onStartOver: () => void;
}

const WorkoutPlan: React.FC<WorkoutPlanProps> = ({ userProfile, workoutPlan, onStartOver }) => {
  const { progress, updateProgress } = useWorkoutPlans();
  const [selectedDay, setSelectedDay] = useState(1);

  const handleUpdateProgress = async (dayId: number, exerciseId: string, completed: boolean) => {
    try {
      await updateProgress(dayId, exerciseId, completed, workoutPlan.id);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getDayProgress = (dayId: number) => {
    const currentDay = workoutPlan.days.find(d => d.day === dayId);
    if (!currentDay) return 0;
    
    const totalExercises = currentDay.exercises.length;
    const completedExercises = progress.filter(p => 
      p.day_id === dayId && p.completed
    ).length;
    
    return totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
  };

  const selectedWorkoutDay = workoutPlan.days.find(d => d.day === selectedDay);

  // Convert database progress to component format
  const dayProgress = progress
    .filter(p => p.day_id === selectedDay)
    .map(p => ({
      dayId: p.day_id,
      exerciseId: p.exercise_id,
      completed: p.completed,
      completedAt: p.completed_at ? new Date(p.completed_at) : undefined,
      notes: p.notes || undefined,
    }));

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {userProfile.name}! 👋
            </h1>
            <p className="text-gray-600 text-lg">{workoutPlan.description}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onStartOver}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start Over</span>
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{workoutPlan.daysPerWeek}</div>
                <div className="text-sm text-gray-600">Days/Week</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{workoutPlan.estimatedDuration}</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900 capitalize">
                  {userProfile.fitness_goal?.replace('_', ' ') || 'Fitness'}
                </div>
                <div className="text-sm text-gray-600">Goal</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900 capitalize">{workoutPlan.difficulty}</div>
                <div className="text-sm text-gray-600">Level</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Day Selector */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Schedule</h2>
            <div className="space-y-2">
              {workoutPlan.days.map((day) => {
                const progressPercent = getDayProgress(day.day);
                return (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedDay === day.day
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Day {day.day}</span>
                      <span className="text-sm opacity-75">{day.duration}min</span>
                    </div>
                    <div className="text-sm opacity-75 mb-2">{day.name}</div>
                    <div className="w-full bg-black/20 rounded-full h-1">
                      <div 
                        className="bg-white h-1 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Workout Content */}
        <div className="lg:col-span-3">
          {selectedWorkoutDay && (
            <WorkoutDay
              day={selectedWorkoutDay}
              progress={dayProgress}
              onUpdateProgress={handleUpdateProgress}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlan;