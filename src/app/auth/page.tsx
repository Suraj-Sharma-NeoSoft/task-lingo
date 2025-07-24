"use client"; // Enables Client-side rendering in Next.js

// Import the Auth component to handle authentication UI
import { Auth } from "@supabase/auth-ui-react";
// Import a predefined Supabase auth theme
import { ThemeSupa } from "@supabase/auth-ui-shared";
// Import the configured Supabase client
import { supabase } from "../../../lib/supabaseClient";

// This is the main component for the auth page
export default function AuthPage() {
  return (
    // Full-screen centered layout for the auth card
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
        {/* App Title */}
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">Task Lingo</h1>

        {/* Short App Description */}
        <p className="text-center text-gray-600 mb-6 text-sm">
          A multilingual AI-powered to-do app. Add tasks, mark them complete, and translate them into popular languages.
        </p>

        {/* Supabase Auth UI component */}
        <Auth
          supabaseClient={supabase}              // Pass the Supabase client
          appearance={{ theme: ThemeSupa }}      // Use a predefined theme for styling
          theme="light"                          // Set the visual theme to light
          providers={["github"]}                 // social login providers (GitHub)
        />
      </div>
    </div>
  );
}
