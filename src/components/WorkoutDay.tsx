import React, { useState } from 'react';
import { WorkoutDay as WorkoutDayType, WorkoutProgress } from '../types';
import ExerciseCard from './ExerciseCard';
import VideoPlayer from './VideoPlayer';
import VoiceCoach from './VoiceCoach';
import { Play, Pause, SkipForward, Clock, Target, Flame } from 'lucide-react';

interface WorkoutDayProps {
  day: WorkoutDayType;
  progress: WorkoutProgress[];
  onUpdateProgress: (dayId: number, exerciseId: string, completed: boolean) => void;
}

const WorkoutDay: React.FC<WorkoutDayProps> = ({ day, progress, onUpdateProgress }) => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);

  const allExercises = [...day.warmup, ...day.exercises, ...day.cooldown];
  const currentExercise = allExercises[currentExerciseIndex];

  const completedExercises = progress.filter(p => p.completed).length;
  const totalExercises = day.exercises.length;
  const completionPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  const startWorkout = () => {
    setIsWorkoutActive(true);
    // Start workout timer
  };

  const pauseWorkout = () => {
    setIsWorkoutActive(false);
  };

  const nextExercise = () => {
    if (currentExerciseIndex < allExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setIsResting(false);
      setRestTimer(0);
    }
  };

  const startRest = () => {
    setIsResting(true);
    setRestTimer(currentExercise.restTime);
  };

  return (
    <div className="space-y-6">
      {/* Workout Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Day {day.day}: {day.name}</h1>
            <p className="text-gray-600">{day.focus}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-xl">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-blue-900 font-medium">{day.duration} min</span>
            </div>
            <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-xl">
              <Target className="w-5 h-5 text-green-600" />
              <span className="text-green-900 font-medium">{totalExercises} exercises</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{completedExercises}/{totalExercises} completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Workout Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!isWorkoutActive ? (
            <button
              onClick={startWorkout}
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
            >
              <Play className="w-5 h-5" />
              <span className="font-medium">Start Workout</span>
            </button>
          ) : (
            <>
              <button
                onClick={pauseWorkout}
                className="flex items-center space-x-2 px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all"
              >
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </button>
              <button
                onClick={nextExercise}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
              >
                <SkipForward className="w-5 h-5" />
                <span>Next</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Active Workout View */}
      {isWorkoutActive && currentExercise && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Video Player */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <VideoPlayer 
              exercise={currentExercise}
              isPlaying={isWorkoutActive && !isResting}
            />
          </div>

          {/* Exercise Details & Voice Coach */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{currentExercise.name}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-indigo-50 p-4 rounded-xl">
                  <div className="text-sm text-indigo-600 mb-1">Sets</div>
                  <div className="text-2xl font-bold text-indigo-900">{currentExercise.sets}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <div className="text-sm text-purple-600 mb-1">Reps</div>
                  <div className="text-2xl font-bold text-purple-900">{currentExercise.reps}</div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{currentExercise.description}</p>
              
              {isResting && (
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-orange-900">Rest Time</span>
                  </div>
                  <div className="text-3xl font-bold text-orange-900">{restTimer}s</div>
                </div>
              )}
            </div>

            <VoiceCoach 
              exercise={currentExercise}
              isActive={isWorkoutActive}
              isResting={isResting}
            />
          </div>
        </div>
      )}

      {/* Exercise List */}
      {!isWorkoutActive && (
        <div className="space-y-6">
          {/* Warmup */}
          {day.warmup.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Flame className="w-6 h-6 text-orange-500" />
                <span>Warmup</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {day.warmup.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    isCompleted={progress.some(p => p.exerciseId === exercise.id && p.completed)}
                    onToggleComplete={(completed) => onUpdateProgress(day.day, exercise.id, completed)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Main Exercises */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Target className="w-6 h-6 text-indigo-500" />
              <span>Main Workout</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {day.exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  isCompleted={progress.some(p => p.exerciseId === exercise.id && p.completed)}
                  onToggleComplete={(completed) => onUpdateProgress(day.day, exercise.id, completed)}
                />
              ))}
            </div>
          </div>

          {/* Cooldown */}
          {day.cooldown.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock className="w-6 h-6 text-blue-500" />
                <span>Cooldown</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {day.cooldown.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    isCompleted={progress.some(p => p.exerciseId === exercise.id && p.completed)}
                    onToggleComplete={(completed) => onUpdateProgress(day.day, exercise.id, completed)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutDay;