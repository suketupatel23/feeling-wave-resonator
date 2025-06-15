import { useRef, useCallback, useState } from "react";

export const useAudioContext = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const volumeRef = useRef(0.08); // Default volume

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const stopSound = useCallback(() => {
    try {
      const oscillatorsToStop = oscillatorsRef.current;
      const gainNodeToFade = gainNodeRef.current;

      // Clear refs immediately to prevent race conditions with new sounds being created.
      oscillatorsRef.current = [];
      gainNodeRef.current = null;

      if (oscillatorsToStop.length > 0 && gainNodeToFade) {
        const audioContext = audioContextRef.current;
        if (audioContext) {
          // Fade out the sound smoothly.
          gainNodeToFade.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
          
          // After the fade-out, stop and disconnect the audio nodes.
          setTimeout(() => {
            oscillatorsToStop.forEach(osc => {
              try {
                osc.stop();
                osc.disconnect();
              } catch (e) {
                // Ignore errors if oscillator is already stopped.
              }
            });
            try {
              gainNodeToFade.disconnect();
            } catch (e) {
              // Ignore errors if gain node is already disconnected.
            }
          }, 100);
        }
      }
    } catch (error) {
      console.warn('Audio stop failed:', error);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!gainNodeRef.current || !audioContextRef.current) return;

    const gain = gainNodeRef.current.gain;
    const time = audioContextRef.current.currentTime;

    setIsMuted(current => {
        const newMutedState = !current;
        gain.cancelScheduledValues(time);
        if(newMutedState) {
            gain.linearRampToValueAtTime(0, time + 0.1);
        } else {
            gain.linearRampToValueAtTime(volumeRef.current, time + 0.1);
        }
        return newMutedState;
    });
  }, []);

  const createBinauralBeat = useCallback((baseFreq: number, beatFreq: number, audioContext: AudioContext, gainNode: GainNode) => {
    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
    osc2.frequency.setValueAtTime(baseFreq + beatFreq, audioContext.currentTime);
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    
    osc1.start();
    osc2.start();
    
    return [osc1, osc2];
  }, []);

  const createHealingChord = useCallback((fundamentalFreq: number, audioContext: AudioContext, gainNode: GainNode) => {
    const frequencies = [
      fundamentalFreq,
      fundamentalFreq * 1.25, // Perfect fourth
      fundamentalFreq * 1.5,  // Perfect fifth
      fundamentalFreq * 2     // Octave
    ];
    
    return frequencies.map(freq => {
      const osc = audioContext.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);
      osc.connect(gainNode);
      osc.start();
      return osc;
    });
  }, []);

  const playEmotionSound = useCallback((emotionType: string) => {
    try {
      const audioContext = initAudioContext();
      
      // Stop any existing sound before playing a new one.
      stopSound();
      
      // Create a new gain node for the new sound.
      const gainNode = audioContext.createGain();
      
      // If muted, start with gain 0, otherwise ramp up to volume.
      const targetVolume = isMuted ? 0 : volumeRef.current;
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(targetVolume, audioContext.currentTime + 0.2);
      
      gainNode.connect(audioContext.destination);
      
      let newOscillators: OscillatorNode[] = [];
      
      switch (emotionType) {
        case 'anger':
          // Deep, grounding frequencies with slight dissonance resolving to harmony
          newOscillators = createBinauralBeat(396, 8, audioContext, gainNode); // Root chakra + alpha waves
          break;
          
        case 'fear':
          // Calming binaural beats with theta waves for peace
          newOscillators = createBinauralBeat(417, 6, audioContext, gainNode); // Sacral chakra + theta waves
          break;
          
        case 'surprise':
          // Bright, energizing chord progression
          newOscillators = createHealingChord(528, audioContext, gainNode); // Love frequency
          break;
          
        case 'happy':
          // Uplifting major chord with high vibration
          newOscillators = createHealingChord(639, audioContext, gainNode); // Heart chakra
          break;
          
        case 'sad':
          // Gentle, comforting low frequencies with healing undertones
          newOscillators = createBinauralBeat(741, 4, audioContext, gainNode); // Throat chakra + delta waves
          break;
          
        case 'disgust':
          // Cleansing high frequencies with purifying tones
          newOscillators = createBinauralBeat(852, 10, audioContext, gainNode); // Third eye chakra + alpha waves
          break;
          
        default:
          // Default healing tone
          newOscillators = createBinauralBeat(528, 7, audioContext, gainNode);
      }
      
      oscillatorsRef.current = newOscillators;
      gainNodeRef.current = gainNode;
      
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [initAudioContext, stopSound, createBinauralBeat, createHealingChord, isMuted]);

  return {
    playEmotionSound,
    stopSound,
    toggleMute,
    isMuted
  };
};
