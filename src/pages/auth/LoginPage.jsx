import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Lock, User, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password demo modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [recoveryIdentifier, setRecoveryIdentifier] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter both your phone/email and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const user = await login(identifier.trim(), password);
      const defaultDashboard =
        user.preferredDashboard === 'owner' ? '/owner/dashboard' : '/farmer/dashboard';
      const destination = from || defaultDashboard;
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleRecoverySubmit = (e) => {
    e.preventDefault();
    if (!recoveryIdentifier.trim()) return;
    setRecoverySent(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Left panel — brand & demo credentials info */}
      <div className="hidden lg:flex w-1/2 bg-primary-700 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <img
          src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=75"
          alt="Agriculture machinery in field"
          className="w-full max-w-sm rounded-3xl object-cover mb-8 shadow-2xl"
          style={{ maxHeight: '250px' }}
          loading="lazy"
        />
        <div className="flex items-center gap-2 mb-3">
          <Leaf size={28} className="text-white" />
          <span className="text-3xl font-bold text-white">AgroShare</span>
        </div>
        <p className="text-primary-200 text-center text-lg font-medium mb-2">
          Share Equipment. Grow More.
        </p>
        <p className="text-primary-300 text-center text-sm max-w-xs leading-relaxed mb-6">
          Log in to manage your bookings, browse tractors & implements near you, or list your equipment.
        </p>

        {/* Demo Credentials Helper Box */}
        <div className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white">
          <p className="text-xs font-semibold text-accent-300 uppercase tracking-wider mb-2">
            Demo Credentials (For Judges & Mentors)
          </p>
          <div className="text-xs space-y-1.5 text-primary-100">
            <p><strong>Farmer:</strong> farmer@demo.com or 08012345678 (Pass: demo1234)</p>
            <p><strong>Owner:</strong> owner@demo.com or 08087654321 (Pass: demo1234)</p>
            <p><strong>Both (Dual):</strong> dual@demo.com or 08099887766 (Pass: demo1234)</p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-10 px-4 sm:px-8">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-primary-700 flex items-center justify-center">
            <Leaf size={20} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-primary-700">Agro</span>
            <span className="text-xl font-bold text-secondary-500">Share</span>
          </div>
        </div>

        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">Welcome back</h1>
          <p className="text-sm text-neutral-500 mb-6">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-primary-700 font-medium hover:underline">
              Sign up
            </Link>
          </p>

          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-sm text-red-700" role="alert">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              id="login-identifier"
              label="Phone Number or Email"
              placeholder="e.g. 08012345678 or farmer@demo.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              leftIcon={<User size={16} />}
            />

            <Input
              id="login-password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftIcon={<Lock size={16} />}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="remember-me" className="text-sm text-neutral-600">
                  Remember me
                </label>
              </div>

              <button
                type="button"
                onClick={() => {
                  setRecoverySent(false);
                  setRecoveryIdentifier('');
                  setForgotModalOpen(true);
                }}
                className="text-sm text-primary-700 hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="mt-2"
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Password (Demo)"
      >
        {recoverySent ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <h4 className="text-base font-semibold text-neutral-900 mb-1">Recovery Link Sent</h4>
            <p className="text-sm text-neutral-600 mb-5 leading-relaxed">
              In this demo application, an SMS/Email recovery instruction was simulated for{' '}
              <span className="font-semibold">{recoveryIdentifier}</span>. You may continue to log in using the demo password: <code>demo1234</code>.
            </p>
            <Button
              variant="primary"
              fullWidth
              onClick={() => setForgotModalOpen(false)}
            >
              Back to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleRecoverySubmit} className="flex flex-col gap-4">
            <p className="text-sm text-neutral-600 leading-relaxed">
              Enter your registered phone number or email address. We will simulate sending a password reset code.
            </p>
            <Input
              id="recovery-identifier"
              label="Phone or Email"
              placeholder="e.g. 08012345678"
              value={recoveryIdentifier}
              onChange={(e) => setRecoveryIdentifier(e.target.value)}
              required
            />
            <div className="flex gap-2 justify-end mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setForgotModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Send Reset Code
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default LoginPage;
