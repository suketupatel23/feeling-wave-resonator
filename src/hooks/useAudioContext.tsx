
import { useRef, useCallback } from "react";

export const useAudioContext = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const stopSound = useCallback(() => {
    try {
      if (oscillatorsRef.current.length > 0 && gainNodeRef.current) {
        const audioContext = audioContextRef.current;
        if (audioContext) {
          gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
          
          setTimeout(() => {
            oscillatorsRef.current.forEach(osc => {
              if (osc) {
                osc.stop();
                osc.disconnect();
              }
            });
            oscillatorsRef.current = [];
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
      
      // Stop any existing sound
      stopSound();
      
      // Create new gain node
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.2);
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
  }, [initAudioContext, stopSound, createBinauralBeat, createHealingChord]);

  return {
    playEmotionSound,
    stopSound
  };
};
