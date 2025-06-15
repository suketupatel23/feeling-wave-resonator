
export type EmotionData = {
  color: string;
  audioType: string;
  category: string;
  frequency: number;
  beat?: number;
};

export const emotions: { [key: string]: EmotionData } = {
  // Anger category (red) - Aggressive healing tones
  anger: { color: "#ff6b6b", audioType: "anger", category: "anger", frequency: 396, beat: 8 },
  enraged: { color: "#ff5252", audioType: "anger", category: "anger", frequency: 396, beat: 8 },
  livid: { color: "#f44336", audioType: "anger", category: "anger", frequency: 396, beat: 8 },
  furious: { color: "#e53935", audioType: "anger", category: "anger", frequency: 396, beat: 8 },
  irate: { color: "#d32f2f", audioType: "anger", category: "anger", frequency: 396, beat: 8 },
  
  // Fear category (green) - Calming healing tones
  fear: { color: "#4ecdc4", audioType: "fear", category: "fear", frequency: 417, beat: 6 },
  terrified: { color: "#26a69a", audioType: "fear", category: "fear", frequency: 417, beat: 6 },
  scared: { color: "#00796b", audioType: "fear", category: "fear", frequency: 417, beat: 6 },
  anxious: { color: "#004d40", audioType: "fear", category: "fear", frequency: 417, beat: 6 },
  worried: { color: "#00695c", audioType: "fear", category: "fear", frequency: 417, beat: 6 },
  
  // Surprise category (cyan) - Energizing healing tones
  surprise: { color: "#45b7d1", audioType: "surprise", category: "surprise", frequency: 528 },
  amazed: { color: "#42a5f5", audioType: "surprise", category: "surprise", frequency: 528 },
  confused: { color: "#1e88e5", audioType: "surprise", category: "surprise", frequency: 528 },
  startled: { color: "#1565c0", audioType: "surprise", category: "surprise", frequency: 528 },
  
  // Happy category (yellow) - Uplifting healing tones
  happy: { color: "#f9ca24", audioType: "happy", category: "happy", frequency: 639 },
  joyful: { color: "#f0932b", audioType: "happy", category: "happy", frequency: 639 },
  ecstatic: { color: "#eb4d4b", audioType: "happy", category: "happy", frequency: 639 },
  optimistic: { color: "#6c5ce7", audioType: "happy", category: "happy", frequency: 639 },
  
  // Sad category (blue) - Comforting healing tones
  sad: { color: "#74b9ff", audioType: "sad", category: "sad", frequency: 741, beat: 4 },
  depressed: { color: "#0984e3", audioType: "sad", category: "sad", frequency: 741, beat: 4 },
  lonely: { color: "#2d3436", audioType: "sad", category: "sad", frequency: 741, beat: 4 },
  despair: { color: "#636e72", audioType: "sad", category: "sad", frequency: 741, beat: 4 },
  
  // Disgust category (purple) - Cleansing healing tones
  disgust: { color: "#a29bfe", audioType: "disgust", category: "disgust", frequency: 852, beat: 10 },
  revolted: { color: "#6c5ce7", audioType: "disgust", category: "disgust", frequency: 852, beat: 10 },
  loathing: { color: "#5f3dc4", audioType: "disgust", category: "disgust", frequency: 852, beat: 10 },
  repugnant: { color: "#7048e8", audioType: "disgust", category: "disgust", frequency: 852, beat: 10 }
};

