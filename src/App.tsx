import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { useUserProfile } from './hooks/useUserProfile';
import { useWorkoutPlans } from './hooks/useWorkoutPlans';
import AuthForm from './components/Auth/AuthForm';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import UserAssessment from './components/UserAssessment';
import WorkoutPlan from './components/WorkoutPlan';
import Header from './components/Header';
import { UserProfile, WorkoutPlanType } from './types';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading, refetch: refetchProfile } = useUserProfile();
  const { currentPlan, loading: plansLoading, refetch: refetchPlans } = useWorkoutPlans();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showAssessment, setShowAssessment] = useState(false);

  useEffect(() => {
    if (user && !profileLoading && !profile) {
      console.log('User exists but no profile found, showing assessment');
      setShowAssessment(true);
    } else if (profile && currentPlan) {
      console.log('Profile and plan exist, hiding assessment');
      setShowAssessment(false);
    }
  }, [user, profile, currentPlan, profileLoading]);

  const handleAssessmentComplete = async (userProfile: UserProfile, plan: WorkoutPlanType) => {
    console.log('Assessment completed, received:', { userProfile, plan });
    
    // Refresh data to ensure we have the latest from the database
    await Promise.all([
      refetchProfile(),
      refetchPlans()
    ]);
    
    // Hide assessment and show main app
    setShowAssessment(false);
  };

  const handleStartOver = () => {
    console.log('Starting over - showing assessment');
    setShowAssessment(true);
  };

  if (!user) {
    return (
      <AuthForm 
        mode={authMode} 
        onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')} 
      />
    );
  }

  if (profileLoading || plansLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your fitness data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {showAssessment || !profile || !currentPlan ? (
          <UserAssessment onComplete={handleAssessmentComplete} />
        ) : (
          <WorkoutPlan 
            userProfile={profile} 
            workoutPlan={currentPlan}
            onStartOver={handleStartOver}
          />
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;