"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient"; // Adjust if you move your file

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
  const [loading, setLoading] = useState(false);

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
    const { error } = await supabase
      .from("todos")
      .update({ is_complete: !current })
      .eq("id", id);

    if (error) {
      console.error("Error updating todo:", error.message);
    }

    await fetchTodos();
  };

  // ✅ ADD THIS FUNCTION
  const handleTranslate = async (todo: Todo) => {
    const targetLang = "es"; // Change to dynamic selection later if needed

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: todo.task, target: targetLang }),
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
      <h1 className="text-2xl font-bold mb-4">📝 AI To-Do App</h1>

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

      <ul className="space-y-3">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex flex-col gap-2 border p-3 rounded bg-white shadow-sm"
          >
            <div className="flex justify-between items-center">
              <span className={todo.is_complete ? "line-through text-gray-500" : ""}>
                {todo.task}
              </span>
              <button
                onClick={() => toggleTodo(todo.id, todo.is_complete)}
                className="text-sm text-blue-600"
              >
                {todo.is_complete ? "Undo" : "Done"}
              </button>
            </div>

            {/* ✅ TRANSLATION SECTION */}
            {todo.translation && (
              <p className="text-sm text-gray-600 italic">
                Translated: {todo.translation}
              </p>
            )}

            <button
              onClick={() => handleTranslate(todo)}
              className="text-xs w-fit bg-blue-500 text-white px-3 py-1 rounded self-start"
            >
              Translate
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
