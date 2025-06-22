import React, { useState } from 'react';
import { Exercise } from '../types';
import VideoPlayer from './VideoPlayer';
import { Play, Clock, Target, Dumbbell, Check } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  isCompleted: boolean;
  onToggleComplete: (completed: boolean) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, isCompleted, onToggleComplete }) => {
  const [showVideo, setShowVideo] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`border-2 rounded-xl p-6 transition-all ${
      isCompleted 
        ? 'border-green-200 bg-green-50' 
        : 'border-gray-200 bg-white hover:shadow-lg'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{exercise.name}</h3>
          <p className="text-gray-600 text-sm mb-3">{exercise.description}</p>
          
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              <span>{exercise.sets} sets</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Dumbbell className="w-4 h-4" />
              <span>{exercise.reps} reps</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{exercise.restTime}s rest</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
              {exercise.difficulty}
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium">
              {exercise.category}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {exercise.muscleGroups.map((muscle) => (
              <span key={muscle} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                {muscle}
              </span>
            ))}
          </div>
        </div>
        
        <button
          onClick={() => onToggleComplete(!isCompleted)}
          className={`p-2 rounded-full transition-all ${
            isCompleted
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          <Check className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={() => setShowVideo(!showVideo)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all text-sm"
        >
          <Play className="w-4 h-4" />
          <span>Watch Demo</span>
        </button>
        
        {exercise.equipment.length > 0 && (
          <div className="flex items-center space-x-1 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
            <span>Equipment: {exercise.equipment.join(', ')}</span>
          </div>
        )}
      </div>
      
      {showVideo && (
        <div className="mt-4">
          <VideoPlayer exercise={exercise} isPlaying={false} />
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;