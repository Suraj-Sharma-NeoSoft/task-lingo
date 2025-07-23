"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Todo = {
  id: string;
  task: string;
  is_complete: boolean;
  translation: string | null;
  created_at: string;
};

const LANGUAGES: { label: string; code: string }[] = [
  { label: "Spanish", code: "es" },
  { label: "French", code: "fr" },
  { label: "Hindi", code: "hi" },
  { label: "German", code: "de" },
  { label: "Japanese", code: "ja" },
];

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [selectedLang, setSelectedLang] = useState("es");

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching todos:", error.message);
    } else {
      setTodos(data || []);
    }
  };

  const addTodo = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("todos").insert({ task: input.trim() });
    setInput("");
    await fetchTodos();
    setLoading(false);

    if (error) {
      console.error("Error adding todo:", error.message);
    }
  };

  const toggleTodo = async (id: string, current: boolean) => {
    const { error } = await supabase.from("todos").update({ is_complete: !current }).eq("id", id);
    if (error) {
      console.error("Error updating todo:", error.message);
    }
    await fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) {
      console.error("Error deleting todo:", error.message);
    }
    await fetchTodos();
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditValue(todo.task);
  };

  const saveEdit = async (id: string) => {
    if (!editValue.trim()) return;
    const { error } = await supabase.from("todos").update({ task: editValue }).eq("id", id);
    if (error) {
      console.error("Error updating task:", error.message);
    }
    setEditingId(null);
    await fetchTodos();
  };

  const handleTranslate = async (todo: Todo) => {
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: todo.task, target: selectedLang }),
      });

      const data = await res.json();

      if (data.translatedText) {
        await supabase
          .from("todos")
          .update({ translation: data.translatedText })
          .eq("id", todo.id);

        fetchTodos();
      }
    } catch (err) {
      console.error("Translation error:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">🌐 Task Lingo</h1>
      <p className="text-sm text-gray-600 mb-4">
      A multilingual AI-powered to-do app. <br />
      Add tasks, mark them complete, update them, delete them, and translate them into popular languages.
      </p>

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
        <label className="mr-2 font-medium">Translate to:</label>
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <ul className="space-y-3">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border p-3 rounded bg-white shadow-sm"
          >
            <div className="flex-1">
              {editingId === todo.id ? (
                <div className="flex gap-2">
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                  <button
                    onClick={() => saveEdit(todo.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <p className={todo.is_complete ? "line-through text-gray-500" : ""}>
                    {todo.task}
                  </p>
                  {todo.translation && (
                    <p className="text-sm text-gray-500 italic">
                      Translated: {todo.translation}
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="flex gap-2 flex-wrap justify-end">
              <button
                onClick={() => toggleTodo(todo.id, todo.is_complete)}
                className="text-xs px-2 py-1 bg-green-600 text-white rounded"
              >
                {todo.is_complete ? "Undo" : "Complete"}
              </button>
              <button
                onClick={() => handleTranslate(todo)}
                className="text-xs px-2 py-1 bg-blue-600 text-white rounded"
              >
                Translate
              </button>
              <button
                onClick={() => startEditing(todo)}
                className="text-xs px-2 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-xs px-2 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}


