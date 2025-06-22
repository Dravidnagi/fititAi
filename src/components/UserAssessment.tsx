import React, { useState } from 'react';
import { UserProfile, WorkoutPlanType } from '../types';
import { generateWorkoutPlan } from '../utils/workoutGenerator';
import { useUserProfile } from '../hooks/useUserProfile';
import { useWorkoutPlans } from '../hooks/useWorkoutPlans';
import { User, Target, Activity, Clock, ChevronRight } from 'lucide-react';

interface UserAssessmentProps {
  onComplete: (profile: UserProfile, plan: WorkoutPlanType) => void;
}

const UserAssessment: React.FC<UserAssessmentProps> = ({ onComplete }) => {
  const { createProfile } = useUserProfile();
  const { savePlan } = useWorkoutPlans();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 4;

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear any previous errors when user makes changes
    if (error) setError(null);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const validateFormData = (): { isValid: boolean; missingFields: string[] } => {
    const requiredFields: (keyof UserProfile)[] = [
      'name', 'age', 'gender', 'height', 'weight', 
      'body_type', 'fitness_goal', 'fitness_level', 
      'available_days', 'preferred_duration'
    ];

    const missingFields: string[] = [];

    for (const field of requiredFields) {
      const value = formData[field];
      if (value === undefined || value === null || value === '' || 
          (typeof value === 'number' && isNaN(value))) {
        missingFields.push(field);
      }
    }

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  };

  const handleSubmit = async () => {
    setError(null);
    setIsGenerating(true);
    
    try {
      // Validate all required fields before proceeding
      const validation = validateFormData();
      if (!validation.isValid) {
        const fieldNames = validation.missingFields.map(field => 
          field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
        ).join(', ');
        setError(`Please fill in all required fields: ${fieldNames}`);
        return;
      }

      console.log('Starting profile creation with data:', formData);
      
      // Create user profile in database
      const profile = await createProfile(formData as Omit<UserProfile, 'id'>);
      console.log('Profile created successfully:', profile);
      
      // Generate workout plan with validated data
      const plan = await generateWorkoutPlan(profile);
      console.log('Workout plan generated:', plan);
      
      // Save workout plan to database
      const savedPlan = await savePlan(plan);
      console.log('Plan saved successfully:', savedPlan);
      
      // Call onComplete to navigate to the main screen
      console.log('Calling onComplete with profile and plan');
      onComplete(profile, savedPlan);
      
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      setError(error.message || 'An error occurred while creating your profile and workout plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <User className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
              <p className="text-gray-600">Tell us about yourself to personalize your fitness journey</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                <input
                  type="number"
                  min="13"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your age"
                  value={formData.age || ''}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value) || undefined)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={formData.gender || ''}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm) *</label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter height in cm"
                  value={formData.height || ''}
                  onChange={(e) => handleInputChange('height', parseInt(e.target.value) || undefined)}
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg) *</label>
                <input
                  type="number"
                  min="30"
                  max="300"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter weight in kg"
                  value={formData.weight || ''}
                  onChange={(e) => handleInputChange('weight', parseInt(e.target.value) || undefined)}
                  required
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Target className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Body Type & Goals</h2>
              <p className="text-gray-600">Help us understand your body type and fitness objectives</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Body Type *</label>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { value: 'ectomorph', label: 'Ectomorph', desc: 'Lean, difficulty gaining weight' },
                    { value: 'mesomorph', label: 'Mesomorph', desc: 'Athletic, builds muscle easily' },
                    { value: 'endomorph', label: 'Endomorph', desc: 'Larger frame, gains weight easily' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      className={`p-4 border-2 rounded-xl text-left transition-all ${
                        formData.body_type === type.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('body_type', type.value)}
                    >
                      <div className="font-medium text-gray-900">{type.label}</div>
                      <div className="text-sm text-gray-600 mt-1">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Primary Fitness Goal *</label>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { value: 'fat_loss', label: 'Fat Loss', desc: 'Reduce body fat percentage' },
                    { value: 'muscle_gain', label: 'Muscle Gain', desc: 'Build lean muscle mass' },
                    { value: 'strength', label: 'Strength', desc: 'Increase overall strength' },
                    { value: 'endurance', label: 'Endurance', desc: 'Improve cardiovascular fitness' },
                    { value: 'flexibility', label: 'Flexibility', desc: 'Enhance mobility and flexibility' }
                  ].map((goal) => (
                    <button
                      key={goal.value}
                      type="button"
                      className={`p-4 border-2 rounded-xl text-left transition-all ${
                        formData.fitness_goal === goal.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('fitness_goal', goal.value)}
                    >
                      <div className="font-medium text-gray-900">{goal.label}</div>
                      <div className="text-sm text-gray-600 mt-1">{goal.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Activity className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Fitness Level</h2>
              <p className="text-gray-600">What's your current fitness experience?</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Current Fitness Level *</label>
                <div className="space-y-3">
                  {[
                    { value: 'beginner', label: 'Beginner', desc: 'New to fitness or returning after a break' },
                    { value: 'intermediate', label: 'Intermediate', desc: 'Regular exercise for 6+ months' },
                    { value: 'advanced', label: 'Advanced', desc: 'Consistent training for 2+ years' }
                  ].map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                        formData.fitness_level === level.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('fitness_level', level.value)}
                    >
                      <div className="font-medium text-gray-900">{level.label}</div>
                      <div className="text-sm text-gray-600 mt-1">{level.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Clock className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule Preferences</h2>
              <p className="text-gray-600">When and how long can you workout?</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Days per week *</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={formData.available_days || ''}
                  onChange={(e) => handleInputChange('available_days', parseInt(e.target.value) || undefined)}
                  required
                >
                  <option value="">Select days</option>
                  <option value="3">3 days</option>
                  <option value="4">4 days</option>
                  <option value="5">5 days</option>
                  <option value="6">6 days</option>
                  <option value="7">7 days</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Workout duration (minutes) *</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={formData.preferred_duration || ''}
                  onChange={(e) => handleInputChange('preferred_duration', parseInt(e.target.value) || undefined)}
                  required
                >
                  <option value="">Select duration</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                </select>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return formData.name && 
               formData.age && !isNaN(formData.age) && 
               formData.gender && 
               formData.height && !isNaN(formData.height) && 
               formData.weight && !isNaN(formData.weight);
      case 2:
        return formData.body_type && formData.fitness_goal;
      case 3:
        return formData.fitness_level;
      case 4:
        return formData.available_days && !isNaN(formData.available_days) && 
               formData.preferred_duration && !isNaN(formData.preferred_duration);
      default:
        return false;
    }
  };

  if (isGenerating) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="animate-spin w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Generating Your Personalized Plan</h2>
          <p className="text-gray-600 mb-8">Our AI is creating the perfect workout plan tailored to your goals...</p>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span>Analyzing your fitness profile</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse animation-delay-200"></div>
              <span>Selecting optimal exercises</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse animation-delay-400"></div>
              <span>Saving to your account</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-gray-50 px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          {renderStep()}
          
          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
            >
              Previous
            </button>
            
            <button
              type="button"
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              onClick={handleNext}
              disabled={!isStepComplete()}
            >
              <span>{currentStep === totalSteps ? 'Generate Plan' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAssessment;