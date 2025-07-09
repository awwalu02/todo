'use client';
import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed?: boolean;
  isEditing?: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('todos');
    if (stored) setTodos(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const newTask: Todo = { id: Date.now(), text: newTodo };
    setTodos([newTask, ...todos]);
    setNewTodo('');
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  const enableEdit = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, isEditing: true } : todo
    ));
  };

  const handleEditChange = (id: number, newText: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  const saveEdit = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, isEditing: false } : todo
    ));
  };

  const toggleComplete = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div className="bg-gray-100 px-4 pt-10 min-h-screen">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">My To-Do App</h1>

        <div className="flex flex-col gap-3 mb-6">
          <input
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            placeholder="Enter a task"
            className="w-full text-black placeholder-gray-500 focus:outline-none focus:ring-0 border border-gray-300 p-2 rounded"
          />
          <button
            onClick={addTodo}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            Add
          </button>
        </div>

        <ul className="space-y-4">
          {todos.map(todo => (
            <li
              key={todo.id}
              className="bg-gray-50 text-black p-3 rounded flex flex-col md:flex-row md:justify-between items-start md:items-center shadow-sm gap-2"
            >
              <div className="flex items-center gap-2 w-full">
                <input
                  type="checkbox"
                  checked={todo.completed || false}
                  onChange={() => toggleComplete(todo.id)}
                />
                {todo.isEditing ? (
                  <input
                    value={todo.text}
                    onChange={e => handleEditChange(todo.id, e.target.value)}
                    className="w-full text-black placeholder-gray-500 focus:outline-none focus:ring-0 border border-gray-300 p-1 rounded"
                  />
                ) : (
                  <span className={`flex-1 font-medium ${todo.completed ? 'text-gray-400 line-through' : 'text-black'}`}>
                    {todo.text}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                {todo.isEditing ? (
                  <button
                    onClick={() => saveEdit(todo.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 cursor-pointer"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => enableEdit(todo.id)}
                    className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 cursor-pointer"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}