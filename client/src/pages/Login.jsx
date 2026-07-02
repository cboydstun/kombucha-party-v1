import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      login(data.token);
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900">
        Welcome back 🫧
      </h1>
      <p className="mt-2 text-gray-600">
        Log in to your Kombucha Party account.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 font-normal"
        />

        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 font-normal"
        />

        {error && (
          <p className="rounded-md bg-pink-50 px-3 py-2 text-sm text-pink-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="self-start rounded-md bg-purple-700 px-4 py-2 text-sm font-medium text-white hover:bg-purple-800 disabled:bg-gray-400"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        No account yet?{" "}
        <Link
          to="/register"
          className="font-medium text-purple-700 hover:underline"
        >
          Create one
        </Link>
      </p>
    </section>
  );
}

export default Login;
