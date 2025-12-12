import { useState, useRef, useEffect } from 'react';

interface AudioRecorderProps {
  onAudioRecorded: (blob: Blob) => void;
}

export const AudioRecorder = ({ onAudioRecorded }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Determine supported mimeType for mobile compatibility
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : 'audio/wav';

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        // Use the actual mimeType from the recorder
        const actualMimeType = mediaRecorderRef.current?.mimeType || mimeType;
        const blob = new Blob(chunksRef.current, { type: actualMimeType });
        console.log('Recording completed. MimeType:', actualMimeType, 'Size:', blob.size);
        onAudioRecorded(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      intervalRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please ensure permissions are granted.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="audio-recorder-container">
      <div className={`status-indicator ${isRecording ? 'recording' : ''}`}>
        <div className="pulse-ring"></div>
        <div className="mic-icon">
          {/* Simple Mic Icon SVG */}
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 2.34 9 4v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </div>
      </div>

      <div className="timer">{formatTime(recordingTime)}</div>

      <button
        className={`record-btn ${isRecording ? 'stop' : 'start'}`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      <style>{`
        .audio-recorder-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(10px);
          box-shadow: var(--shadow-lg);
          max-width: 400px;
          margin: 0 auto;
        }

        .status-indicator {
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--surface-color);
          border-radius: 50%;
          color: var(--text-secondary);
          transition: all 0.3s ease;
        }

        .status-indicator.recording {
          color: #ef4444; /* Red */
          background: #2a1e1e;
        }

        .status-indicator.recording .pulse-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid #ef4444;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .timer {
          font-size: 1.5rem;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          color: var(--text-primary);
        }

        .record-btn {
          padding: 0.8rem 2rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 1rem;
          transition: transform 0.1s;
        }

        .record-btn.start {
          background: var(--accent-gradient);
          color: white;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
        }

        .record-btn.start:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
        }

        .record-btn.stop {
          background: var(--surface-color);
          border: 1px solid #ef4444;
          color: #ef4444;
        }

        .record-btn.stop:hover {
          background: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </div>
  );
};
