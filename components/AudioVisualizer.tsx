
import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ analyser, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderFrame = () => {
      // Get Data
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      // Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw settings
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;

      // Draw loop
      for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i];
        const barHeight = (value / 255) * height;

        // Gradient color based on height/intensity
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, '#3b82f6'); // blue-500
        gradient.addColorStop(0.5, '#60a5fa'); // blue-400
        gradient.addColorStop(1, '#93c5fd'); // blue-300

        ctx.fillStyle = gradient;
        
        // Rounded bars
        if (barHeight > 0) {
            ctx.beginPath();
            ctx.roundRect(x, height - barHeight, barWidth, barHeight, [4, 4, 0, 0]);
            ctx.fill();
        }

        x += barWidth + 2;
      }

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(renderFrame);
      }
    };

    if (isPlaying) {
      // Ensure context is running (browser autoplay policy)
      if (analyser.context.state === 'suspended') {
        analyser.context.resume();
      }
      renderFrame();
    } else {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw a flat line
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 2);
        ctx.lineTo(canvas.width, canvas.height - 2);
        ctx.strokeStyle = '#e2e8f0'; // slate-200
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isPlaying]);

  return (
    <canvas 
      ref={canvasRef} 
      width={800} 
      height={120} 
      className="w-full h-full"
    />
  );
};

export default AudioVisualizer;
