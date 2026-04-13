// import { useState } from "react"
// import { useAuthStore } from "../store/auth.store"

// const LoginPage = () => {
//     const login = useAuthStore(s => s.login)
//    // const { login } = useAuthStore()
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')

//     const handleSubmit = async () => {
//         await login(email, password)
//     }

//     return (
//         <div>
//             <h2>Login</h2>
//             <input onChange={(e) => setEmail(e.target.value)} placeholder="email" />
//             <input onChange={(e) => setPassword(e.target.value)} placeholder="password" />
//             <button onClick={handleSubmit}>Login</button>
//         </div >
//     )

// }

// export default LoginPage




import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
type FormMode = "signin" | "signup";
function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">

      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-8 py-8">
          <h1 className="text-2xl font-bold text-center text-orange-500 mb-6">
            AI Debugging Assistant
          </h1>
          <h1 className="text-2xl text-center font-semibold text-slate-900 mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-center text-slate-500 mb-6">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
function AuthForm({ mode }: { mode: FormMode }) {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    // simple email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please provide a valid email address.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signin") {
        await login(email.trim(), password);
      } else {
        await signup(email.trim(), password);

        await login(email.trim(), password);
      }

      navigate("/", { replace: true });
    } catch (err: any) {

      setError(err?.response?.data?.message || err?.message || "An error occurred. Please try again.");
      setLoading(false);
    }
  }
  return (
    <div className="max-w-md mx-auto">

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="mt-1 block w-full border rounded-md p-2 focus:ring-2 focus:ring-orange-300"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="mt-1 block w-full border rounded-md p-2 focus:ring-2 focus:ring-orange-300"
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {mode === "signin" ? "No account?" : "Already have an account?"}
          </div>
          <div className="text-xs">
            {mode === "signin" ? (
              <Link to="/signup" className="text-orange-600 font-medium hover:underline">
                Create account
              </Link>
            ) : (
              <Link to="/login" className="text-orange-600 font-medium hover:underline">
                Sign in
              </Link>
            )}
          </div>
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center items-center px-4 py-2 rounded-md bg-orange-500 text-white hover:brightness-105 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                {mode === "signin" ? "Signing in..." : "Creating account..."}
              </span>
            ) : (
              <span>{mode === "signin" ? "Sign in" : "Sign up"}</span>
            )}
          </button>
        </div>
      </form>
    </div>

  );
}
export function SignInPage() {
  return (
    <AuthLayout title="Sign in" subtitle="Enter your email and password to continue.">
      <AuthForm mode="signin" />
    </AuthLayout>
  );
}
export function SignUpPage() {
  return (
    <AuthLayout title="Create account" subtitle="Start your account with email and password.">
      <AuthForm mode="signup" />
    </AuthLayout>
  );
}
export default SignInPage;