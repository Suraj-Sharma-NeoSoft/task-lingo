"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import toast, { Toaster } from "react-hot-toast";

// Types
type Todo = {
  id: string;
  task: string;
  is_complete: boolean;
  translation: string | null;
  created_at: string;
};

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState("es");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) fetchTodos();
  }, [user]);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (error) toast.error("Error fetching todos");
    else setTodos(data || []);
  };

  const addTodo = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("todos").insert({
      task: input.trim(),
      user_id: user?.id,
    });

    setInput("");
    await fetchTodos();
    setLoading(false);

    error ? toast.error("Failed to add task") : toast.success("Task added");
  };

  const toggleComplete = async (todo: Todo) => {
    const { error } = await supabase
      .from("todos")
      .update({ is_complete: !todo.is_complete })
      .eq("id", todo.id);

    error && toast.error("Failed to update status");
    await fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    error ? toast.error("Delete failed") : toast.success("Task deleted");
    setShowDeleteConfirm(null);
    await fetchTodos();
  };

  const updateTodo = async () => {
    if (!editingId || !editValue.trim()) return;

    const { error } = await supabase
      .from("todos")
      .update({ task: editValue })
      .eq("id", editingId);

    if (!error) {
      toast.success("Task updated");
      setEditingId(null);
      setEditValue("");
      fetchTodos();
    } else {
      toast.error("Update failed");
    }
  };

  const handleTranslate = async (todo: Todo) => {
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: todo.task, target: language }),
      });

      const data = await res.json();
      if (data.translatedText) {
        await supabase
          .from("todos")
          .update({ translation: data.translatedText })
          .eq("id", todo.id);
        toast.success("Translated");
        fetchTodos();
      }
    } catch {
      toast.error("Translation failed");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTodos([]);
    router.refresh();
  };

  const handleProfileUpdate = () => {
    toast("Profile editing coming soon...");
    setShowProfile(false);
  };

  if (!user) {
    return (
      <div className="flex justify-center mt-20">
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} theme="dark" />
      </div>
    );
  }    

  return (
    <main className="max-w-xl mx-auto p-6">
      <Toaster />
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Task Lingo</h1>
          <p className="text-sm text-gray-600">
            A multilingual AI-powered to-do app.
            <br />
            Add tasks, mark them complete, and translate them into popular languages.
          </p>
          <p className="text-sm mt-1 text-gray-500">Welcome, {user.email}</p>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setShowProfile(true)} className="text-sm text-blue-600 hover:underline">
            Profile
          </button>
          <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
            Logout
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a task..."
          className="flex-grow border px-4 py-2 rounded"
        />
        <button
          onClick={addTodo}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      <div className="mb-4">
        <label className="text-sm text-gray-700">Translate to: </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border rounded px-2 py-1 ml-2"
        >
          <option value="es">Spanish 🇪🇸</option>
          <option value="fr">French 🇫🇷</option>
          <option value="hi">Hindi 🇮🇳</option>
          <option value="de">German 🇩🇪</option>
          <option value="ja">Japanese 🇯🇵</option>
        </select>
      </div>

      <ul className="space-y-3">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between border p-3 rounded bg-white shadow-sm"
          >
            <div className="flex-1">
              {editingId === todo.id ? (
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={updateTodo}
                  onKeyDown={(e) => e.key === "Enter" && updateTodo()}
                  autoFocus
                  className="border px-2 py-1 rounded w-full"
                />
              ) : (
                <p className={todo.is_complete ? "line-through text-gray-500" : ""}>
                  {todo.task}
                </p>
              )}
              {todo.translation && (
                <p className="text-sm text-gray-500 italic">Translated: {todo.translation}</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleComplete(todo)}
                className="text-xs px-2 py-1 bg-green-500 text-white rounded"
              >
                {todo.is_complete ? "Undo" : "Complete"}
              </button>
              <button
                onClick={() => handleTranslate(todo)}
                className="text-xs px-2 py-1 bg-blue-500 text-white rounded"
              >
                Translate
              </button>
              <button
                onClick={() => {
                  setEditingId(todo.id);
                  setEditValue(todo.task);
                }}
                className="text-xs px-2 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(todo.id)}
                className="text-xs px-2 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>

            {showDeleteConfirm === todo.id && (
              <div className="text-sm text-gray-700 mt-2">
                Are you sure?
                <button onClick={() => deleteTodo(todo.id)} className="ml-2 text-red-600 underline">
                  Yes
                </button>
                <button onClick={() => setShowDeleteConfirm(null)} className="ml-2 text-gray-600 underline">
                  No
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-xl w-96">
            <h2 className="text-lg font-semibold mb-2">Profile</h2>
            <p>Email: {user.email}</p>
            <button
              onClick={handleProfileUpdate}
              className="mt-4 text-sm bg-blue-600 text-white px-3 py-1 rounded"
            >
              Update Email/Password
            </button>
            <button
              onClick={() => setShowProfile(false)}
              className="mt-2 text-sm text-red-600 underline block"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
