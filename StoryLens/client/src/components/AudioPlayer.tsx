import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Download, Gauge } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
}

export default function AudioPlayer({ audioUrl, title }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audio.currentTime = newTime;
  };

  const adjustSpeed = () => {
    const newRate = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1;
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  const downloadAudio = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_narration.wav`;
    link.click();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h5 className="font-medium text-gray-900 flex items-center">
          <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
          Audio Narration
        </h5>
        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
          AI Voice
        </span>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <Button
            onClick={togglePlayPause}
            className="w-12 h-12 rounded-full bg-primary hover:bg-blue-600 transition-colors shadow-lg"
            size="sm"
          >
            {isPlaying ? (
              <Pause className="text-white" size={20} />
            ) : (
              <Play className="text-white ml-0.5" size={20} />
            )}
          </Button>

          <div className="flex-1">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div
              className="w-full bg-gray-200 rounded-full h-2 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={adjustSpeed}
              className="text-gray-500 hover:text-primary"
            >
              <Gauge size={16} />
              <span className="ml-1 text-xs">{playbackRate}x</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadAudio}
              className="text-gray-500 hover:text-primary"
            >
              <Download size={16} />
            </Button>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  );
}
