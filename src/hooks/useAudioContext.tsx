
import { useRef, useCallback } from "react";

export const useAudioContext = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playFrequency = useCallback((frequency: number) => {
    try {
      const audioContext = initAudioContext();
      
      // Stop any existing oscillator
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      
      // Create new oscillator
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      
      // Set gentle volume
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [initAudioContext]);

  const stopFrequency = useCallback(() => {
    try {
      if (oscillatorRef.current && gainNodeRef.current) {
        const audioContext = audioContextRef.current;
        if (audioContext) {
          gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
          
          setTimeout(() => {
            if (oscillatorRef.current) {
              oscillatorRef.current.stop();
              oscillatorRef.current.disconnect();
              oscillatorRef.current = null;
            }
            if (gainNodeRef.current) {
              gainNodeRef.current.disconnect();
              gainNodeRef.current = null;
            }
          }, 100);
        }
      }
    } catch (error) {
      console.warn('Audio stop failed:', error);
    }
  }, []);

  return {
    playFrequency,
    stopFrequency
  };
};
