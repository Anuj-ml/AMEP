
import React, { useRef, useState, useEffect } from 'react';
import { Camera, Zap, Scan, X, BrainCircuit, Maximize2, AlertCircle } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const ARLab: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hints, setHints] = useState<{detectedTopic: string, hints: string[]} | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err: any) {
      console.error("Camera access denied:", err);
      setError("Camera access denied. Please allow camera permissions in your browser settings to use the AR Socratic feature.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsScanning(true);
    setHints(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];

      try {
        const result = await geminiService.analyzeARImage(base64Image);
        setHints(result);
      } catch (e) {
        console.error("AR Analysis failed", e);
      } finally {
        setIsScanning(false);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-black rounded-[3rem] relative overflow-hidden shadow-2xl border-4 border-slate-900 group">
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-white space-y-4">
          <AlertCircle size={48} className="text-rose-500" />
          <h3 className="text-xl font-black">Camera Unavailable</h3>
          <p className="text-slate-400 max-w-md">{error}</p>
          <button 
            onClick={startCamera}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
      )}
      
      <canvas ref={canvasRef} className="hidden" />

      {/* AR Overlay UI - Only show if no error */}
      {!error && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 border-[20px] border-indigo-500/10 rounded-[2.5rem]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/30 rounded-3xl flex items-center justify-center">
              <Scan className={`text-white/50 w-full h-full p-4 ${isScanning ? 'animate-pulse text-indigo-400' : ''}`} strokeWidth={0.5} />
          </div>
          
          {/* HUD Elements */}
          <div className="absolute top-8 left-8 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
             <span className="text-xs font-black text-white uppercase tracking-widest">Live Feed</span>
          </div>

          {/* Hints Overlay */}
          {hints && (
            <div className="absolute bottom-32 left-8 right-8 pointer-events-auto animate-in slide-in-from-bottom-10 fade-in duration-500">
               <div className="bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 p-6 rounded-[2rem] shadow-2xl space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                     <BrainCircuit className="text-indigo-400" size={24} />
                     <h3 className="text-lg font-black text-white">{hints.detectedTopic} Detected</h3>
                  </div>
                  <div className="space-y-3">
                     {hints.hints.map((hint, i) => (
                       <div key={i} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">{i+1}</span>
                          <p className="text-sm font-medium text-slate-200">{hint}</p>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8 pointer-events-auto z-20">
         <button className="p-4 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 transition-all text-white"><X size={24} /></button>
         <button 
           onClick={captureAndAnalyze}
           disabled={isScanning || !!error}
           className="w-20 h-20 bg-white rounded-full border-4 border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.5)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
         >
           {isScanning ? <Scan className="animate-spin text-indigo-600" size={32} /> : <div className="w-16 h-16 bg-indigo-600 rounded-full border-2 border-white"></div>}
         </button>
         <button className="p-4 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 transition-all text-white"><Maximize2 size={24} /></button>
      </div>
    </div>
  );
};

export default ARLab;
