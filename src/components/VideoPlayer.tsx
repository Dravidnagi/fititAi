import React, { useState, useRef } from 'react';
import { Exercise } from '../types';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';

interface VideoPlayerProps {
  exercise: Exercise;
  isPlaying: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ exercise, isPlaying }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(isPlaying);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock video URL - In production, this would come from Tavus API
  const mockVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const togglePlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = parseFloat(e.target.value);
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  return (
    <div className="relative bg-black rounded-xl overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full aspect-video"
        src={mockVideoUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        muted={isMuted}
        loop
      />
      
      {/* Video Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300">
        {/* Top Bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg">
            <span className="text-white text-sm font-medium">{exercise.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-all"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-all">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all transform hover:scale-110"
          >
            {isVideoPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </button>
        </div>
        
        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
            {/* Progress Bar */}
            <div className="mb-3">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-indigo-300 transition-colors"
                >
                  {isVideoPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={restartVideo}
                  className="text-white hover:text-indigo-300 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <div className="text-white text-sm">
                <span className="bg-indigo-500 px-2 py-1 rounded">
                  Tavus Demo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tavus Integration Notice */}
      <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-b-xl">
        <div className="flex items-center space-x-2 text-sm text-indigo-700">
          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
          <span>
            <strong>Tavus Integration:</strong> In production, this would display personalized video demonstrations 
            generated by Tavus AI based on your exercise form and preferences.
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;