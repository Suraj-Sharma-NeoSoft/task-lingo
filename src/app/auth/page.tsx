"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../../../lib/supabaseClient";

export default function AuthPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">Task Lingo</h1>
        <p className="text-center text-gray-600 mb-6 text-sm">
          A multilingual AI-powered to-do app. Add tasks, mark them complete, and translate them into popular languages.
        </p>

        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={[]} // ❌ Disable GitHub, Google, Azure, etc.
        />
      </div>
    </div>
  );
}


