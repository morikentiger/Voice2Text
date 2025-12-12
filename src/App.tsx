import { useState, useEffect } from 'react'
import { AudioRecorder } from './components/AudioRecorder'
import { transcribeAudio } from './gemini'
import { Login } from './components/Login'
import { auth } from './firebase'
import { onAuthStateChanged, type User } from 'firebase/auth'
import './App.css'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [apiKey, setApiKey] = useState('')
  const [transcription, setTranscription] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleAudioRecorded = async (audioBlob: Blob) => {
    if (!apiKey) {
      setError("Please enter your Google API Key first.")
      return
    }

    setError(null)
    setIsTranscribing(true)
    setTranscription('')

    try {
      const text = await transcribeAudio(apiKey, audioBlob)
      setTranscription(text)
    } catch (err: any) {
      console.error("Transcription error:", err)
      setError(err.message || "Failed to transcribe audio.")
    } finally {
      setIsTranscribing(false)
    }
  }

  if (loading) {
    return <div className="loading-state"><div className="spinner"></div></div>
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-top">
          <h1 className="app-title">
            <span className="gradient-text">Gemini</span> Voice2Text
          </h1>
          <button className="logout-btn" onClick={() => auth.signOut()}>Logout</button>
        </div>
        <p className="app-subtitle">
          Powered by Gemini 1.5 Pro (Latest)
        </p>
      </header>

      <main className="main-content">
        <div className="api-key-section">
          <label htmlFor="api-key" className="api-label">Google AI API Key</label>
          <input
            id="api-key"
            type="password"
            placeholder="Enter your API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="api-input"
          />
        </div>

        <div className="recorder-section">
          <AudioRecorder onAudioRecorded={handleAudioRecorded} />
        </div>

        <div className="result-section">
          {isTranscribing && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Transcribing audio...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {transcription && (
            <div className="transcription-box">
              <h3>Transcription</h3>
              <p>{transcription}</p>
              <button
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText(transcription)}
              >
                Copy Text
              </button>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .header-top {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 100%;
        }
        .logout-btn {
          position: absolute;
          right: 0;
          top: 0;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.9rem;
          padding: 0.5rem;
        }
        .logout-btn:hover {
          color: #ef4444;
        }
      `}</style>
    </div>
  )
}

export default App
