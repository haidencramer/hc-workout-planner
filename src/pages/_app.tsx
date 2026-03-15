import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../context/AuthContext"; // Use relative path to be safe
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <title>HC Planner | Your Elite Workout Tool</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>
      <div className="bg-slate-950 min-h-screen selection:bg-indigo-500/30">
        <Component { ...pageProps} />
      </div>
    </AuthProvider>
  );
}