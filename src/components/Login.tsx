import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import '../App.css'; // Reusing some styles

export const Login = () => {
    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="app-title">
                    <span className="gradient-text">Voice2Text</span> Login
                </h1>
                <p className="app-subtitle">Please sign in to continue</p>

                <button onClick={handleLogin} className="login-btn">
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        className="google-icon"
                    />
                    Sign in with Google
                </button>
            </div>

            <style>{`
        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          width: 100%;
        }

        .login-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 3rem;
          text-align: center;
          backdrop-filter: blur(10px);
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .login-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          background: white;
          color: #333;
          padding: 1rem 2rem;
          border-radius: 30px;
          font-weight: 600;
          font-size: 1.1rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
        }

        .google-icon {
          width: 24px;
          height: 24px;
        }
      `}</style>
        </div>
    );
};
