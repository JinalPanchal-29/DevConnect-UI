import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance from '../api/axiosInstance';
import { setUser } from '../store/authSlice';

// Shape of the logged-in user data passed up to App
export interface UserAuthData {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  gender?: string;
  age?: string;
  skills?: string[];
  about?: string;
  imageUrl?: string;
}

interface LoginProps {
  onLoginSuccess: (user: UserAuthData) => void;
}

// ─── Gender options ──────────────────────────────────────────────────────────
const GENDER_OPTIONS = ['Male', 'Female', 'Others'] as const;
type Gender = (typeof GENDER_OPTIONS)[number];

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const dispatch = useDispatch();
  // Toggle tab: false = Sign In, true = Sign Up
  const [isSignUp, setIsSignUp] = useState(false);

  // ── Sign-In fields ──────────────────────────────────────────────────────────
  const [loginIdentifier, setLoginIdentifier] = useState('');   // email OR userName
  const [loginPassword, setLoginPassword] = useState('');

  // ── Sign-Up fields ──────────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ── UI state ────────────────────────────────────────────────────────────────
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Reset form when switching tabs ──────────────────────────────────────────
  const switchTab = (signUp: boolean) => {
    setIsSignUp(signUp);
    setError('');
    setLoginIdentifier(''); setLoginPassword('');
    setFirstName(''); setLastName(''); setUserName('');
    setEmail(''); setPhoneNumber(''); setGender('Male');
    setAge(''); setPassword(''); setConfirmPassword('');
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const isEmail = (val: string) => /\S+@\S+\.\S+/.test(val);

  // ── Sign-In handler ─────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!loginIdentifier || !loginPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const payload = isEmail(loginIdentifier)
        ? { email: loginIdentifier, password: loginPassword }
        : { userName: loginIdentifier, password: loginPassword };

      const res = await axiosInstance.post('/login', payload);
      const userData: UserAuthData = res.data.user;

      // Update Redux state
      dispatch(setUser(userData));
      onLoginSuccess(userData);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ── Sign-Up handler ─────────────────────────────────────────────────────────
  const handleSignUp = async () => {
    if (!firstName || !lastName || !userName || !email || !phoneNumber || !age || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      setError('Please enter a valid age (18–100).');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await axiosInstance.post('/signup', {
        firstName,
        lastName,
        userName,
        email,
        phoneNumber,
        gender,
        age: String(age),
        password,
      });

      // Auto-switch to Sign-In after successful registration
      switchTab(false);
      setError(''); // clear any residual
      // Optionally surface a success banner — but a clean switch is enough
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ── Unified form submit ──────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      handleSignUp();
    } else {
      handleLogin();
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex-grow flex items-center justify-center p-4 bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-content/5 transition-all duration-300 rounded-2xl my-8">
        <div className="card-body p-8">

          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-2">
              <svg
                className="w-10 h-10 text-pink-500 fill-current filter drop-shadow-[0_2px_8px_rgba(244,63,94,0.4)] animate-pulse"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-3xl font-black tracking-wider bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
                DevTinder
              </span>
            </div>
            <p className="text-base-content/60 text-xs">Swipe. Match. Code. Deploy.</p>
          </div>

          {/* Toggle Tabs */}
          <div className="tabs tabs-box bg-base-200 p-1 rounded-xl mb-6 flex justify-around">
            <button
              type="button"
              className={`tab flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!isSignUp ? 'tab-active bg-base-100 shadow-xs text-primary' : 'text-base-content/60 hover:text-base-content'}`}
              onClick={() => switchTab(false)}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`tab flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${isSignUp ? 'tab-active bg-base-100 shadow-xs text-primary' : 'text-base-content/60 hover:text-base-content'}`}
              onClick={() => switchTab(true)}
            >
              Register
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-error text-sm py-2 px-3 rounded-lg mb-4 flex items-start gap-2 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* ── SIGN-UP SUCCESS BANNER (shown briefly after switchTab) ── */}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ════════════════════════  SIGN-UP FIELDS  ════════════════════════ */}
            {isSignUp && (
              <>
                {/* First Name + Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="form-control">
                    <label className="label py-1 text-xs font-bold text-base-content/70">First Name</label>
                    <input
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={loading}
                      className="input input-bordered w-full focus:input-primary rounded-xl text-sm"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label py-1 text-xs font-bold text-base-content/70">Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={loading}
                      className="input input-bordered w-full focus:input-primary rounded-xl text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="form-control">
                  <label className="label py-1 text-xs font-bold text-base-content/70">Username</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/40">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="john_doe"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      disabled={loading}
                      className="input input-bordered w-full pl-10 focus:input-primary rounded-xl text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="form-control">
                  <label className="label py-1 text-xs font-bold text-base-content/70">Phone Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/40">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </span>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={loading}
                      className="input input-bordered w-full pl-10 focus:input-primary rounded-xl text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Age + Gender side by side */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="form-control">
                    <label className="label py-1 text-xs font-bold text-base-content/70">Age</label>
                    <input
                      type="number"
                      placeholder="e.g. 25"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      disabled={loading}
                      min="18"
                      max="100"
                      className="input input-bordered w-full focus:input-primary rounded-xl text-sm"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label py-1 text-xs font-bold text-base-content/70">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as Gender)}
                      disabled={loading}
                      className="select select-bordered w-full focus:select-primary rounded-xl text-sm"
                      required
                    >
                      {GENDER_OPTIONS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* ════════════════════════  SHARED FIELDS  ════════════════════════ */}

            {/* Email — for both Sign-In and Sign-Up */}
            {isSignUp ? (
              <div className="form-control">
                <label className="label py-1 text-xs font-bold text-base-content/70">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/40">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="input input-bordered w-full pl-10 focus:input-primary rounded-xl text-sm"
                    required
                  />
                </div>
              </div>
            ) : (
              /* Sign-In: accept email OR username */
              <div className="form-control">
                <label className="label py-1 text-xs font-bold text-base-content/70">Email or Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/40">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="name@example.com or username"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    disabled={loading}
                    className="input input-bordered w-full pl-10 focus:input-primary rounded-xl text-sm"
                    required
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div className="form-control">
              <label className="label py-1 text-xs font-bold text-base-content/70">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/40">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={isSignUp ? password : loginPassword}
                  onChange={(e) => isSignUp ? setPassword(e.target.value) : setLoginPassword(e.target.value)}
                  disabled={loading}
                  className="input input-bordered w-full pl-10 focus:input-primary rounded-xl text-sm"
                  required
                />
              </div>
              {isSignUp && (
                <p className="text-xs text-base-content/50 mt-1 pl-1">
                  Must include uppercase, lowercase, number &amp; symbol (min 6 chars)
                </p>
              )}
            </div>

            {/* Confirm Password — Sign-Up only */}
            {isSignUp && (
              <div className="form-control">
                <label className="label py-1 text-xs font-bold text-base-content/70">Confirm Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/40">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="input input-bordered w-full pl-10 focus:input-primary rounded-xl text-sm"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="form-control mt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 hover:brightness-105 border-none text-white rounded-xl font-bold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : isSignUp ? (
                  'Create Account'
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            {/* Hint below Sign-Up: password rules */}
            {!isSignUp && (
              <p className="text-center text-xs text-base-content/40 mt-2">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchTab(true)}
                  className="text-primary underline hover:text-primary/80 transition-colors"
                >
                  Register here
                </button>
              </p>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
