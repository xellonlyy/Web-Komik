import Link from "next/link";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto min-h-screen">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-zinc-300 bg-zinc-900 hover:bg-zinc-800 flex items-center group text-sm transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-zinc-300">
        <h1 className="text-3xl font-bold text-white mb-6 tracking-tight text-center">
          Admin <span className="text-primary-500">Login</span>
        </h1>
        
        <label className="text-md font-medium text-zinc-400" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-zinc-900 border border-zinc-800 mb-6 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md font-medium text-zinc-400" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-zinc-900 border border-zinc-800 mb-6 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        
        <button
          formAction={login}
          className="bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-md px-4 py-2 text-sm mb-2 transition-colors shadow-lg shadow-primary-500/20"
        >
          Sign In
        </button>

        {message && (
          <p className="mt-4 p-4 bg-red-900/20 text-red-400 text-sm text-center border border-red-900/50 rounded-md">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
