import React, { useState, useEffect } from 'react';
import { Exercise } from '../types';
import { Mic, MicOff, Volume2, VolumeX, Play, Pause, Settings } from 'lucide-react';

interface VoiceCoachProps {
  exercise: Exercise;
  isActive: boolean;
  isResting: boolean;
}

const VoiceCoach: React.FC<VoiceCoachProps> = ({ exercise, isActive, isResting }) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [voiceSettings, setVoiceSettings] = useState({
    voice: 'female',
    speed: 1.0,
    volume: 0.8
  });

  // Mock voice instructions based on exercise phase
  const voiceInstructions = {
    warmup: [
      "Let's start with a proper warmup. Focus on your breathing.",
      "Nice and easy. Get your body ready for the workout.",
      "Keep the movements controlled and smooth."
    ],
    exercise: [
      `Great! Now let's do ${exercise.name}. Remember to maintain proper form.`,
      "Keep your core engaged throughout the movement.",
      "Control the weight on both the up and down phases.",
      "You're doing great! Keep pushing through.",
      "Focus on the muscle groups you're targeting."
    ],
    rest: [
      "Great work! Take a moment to catch your breath.",
      "Use this rest time to hydrate and prepare for the next exercise.",
      "Shake out those muscles and stay loose."
    ],
    motivation: [
      "You've got this! Stay focused on your goals.",
      "Every rep brings you closer to your fitness goals.",
      "Remember why you started this journey.",
      "Your consistency is what will make the difference."
    ]
  };

  useEffect(() => {
    if (isActive && isVoiceEnabled) {
      const instructions = isResting ? voiceInstructions.rest : voiceInstructions.exercise;
      const randomInstruction = instructions[Math.floor(Math.random() * instructions.length)];
      setCurrentInstruction(randomInstruction);
    }
  }, [isActive, isResting, exercise, isVoiceEnabled]);

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const playInstruction = () => {
    // In production, this would use ElevenLabs API to generate and play audio
    if (isVoiceEnabled && !isMuted) {
      // Mock implementation - would be replaced with actual TTS
      console.log('Playing instruction:', currentInstruction);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <Mic className="w-6 h-6 text-indigo-600" />
          <span>AI Voice Coach</span>
        </h3>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className={`p-2 rounded-lg transition-all ${
              isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          
          <button
            onClick={toggleVoice}
            className={`p-2 rounded-lg transition-all ${
              isVoiceEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {isVoiceEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {/* Current Instruction */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 animate-pulse"></div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium">
                {currentInstruction || "Ready to start your workout? Let's get moving!"}
              </p>
              {isActive && (
                <button
                  onClick={playInstruction}
                  className="flex items-center space-x-2 mt-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span className="text-sm">Play Audio</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Voice Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Voice Type</span>
          <select
            value={voiceSettings.voice}
            onChange={(e) => setVoiceSettings({...voiceSettings, voice: e.target.value})}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="female">Female Coach</option>
            <option value="male">Male Coach</option>
            <option value="neutral">Neutral Voice</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Speech Speed</span>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">0.5x</span>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voiceSettings.speed}
              onChange={(e) => setVoiceSettings({...voiceSettings, speed: parseFloat(e.target.value)})}
              className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500">2x</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Volume</span>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">0%</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={voiceSettings.volume}
              onChange={(e) => setVoiceSettings({...voiceSettings, volume: parseFloat(e.target.value)})}
              className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500">100%</span>
          </div>
        </div>
      </div>
      
      {/* ElevenLabs Integration Notice */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
        <div className="flex items-center space-x-2 text-sm text-green-700">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>
            <strong>ElevenLabs Integration:</strong> In production, this would provide real-time AI voice coaching 
            with personalized instructions and motivational cues generated by ElevenLabs TTS technology.
          </span>
        </div>
      </div>
    </div>
  );
};

export default VoiceCoach;