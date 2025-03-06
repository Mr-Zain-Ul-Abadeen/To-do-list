import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, CheckCircle2, Circle, Trash2, XCircle, AlertTriangle, ArrowDown, Minus } from 'lucide-react';
import gsap from 'gsap';
import { Scene3D } from './components/Scene3D';
import { Footer } from './components/Footer';
import { ProgressBar } from './components/ProgressBar';

type Importance = 'high' | 'medium' | 'low';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  importance: Importance;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [importance, setImportance] = useState<Importance>('medium');
  const todosContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const getImportanceColor = (importance: Importance) => {
    switch (importance) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
    }
  };

  const getImportanceIcon = (importance: Importance) => {
    switch (importance) {
      case 'high':
        return <AlertTriangle className={`w-5 h-5 ${getImportanceColor(importance)}`} />;
      case 'medium':
        return <Minus className={`w-5 h-5 ${getImportanceColor(importance)}`} />;
      case 'low':
        return <ArrowDown className={`w-5 h-5 ${getImportanceColor(importance)}`} />;
    }
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const newTodoItem = {
      id: crypto.randomUUID(),
      text: newTodo.trim(),
      completed: false,
      createdAt: Date.now(),
      importance
    };

    setTodos(prev => [newTodoItem, ...prev]);
    setNewTodo('');

    gsap.fromTo(
      `[data-todo-id="${newTodoItem.id}"]`,
      { 
        opacity: 0, 
        x: -20,
        scale: 0.9
      },
      { 
        opacity: 1, 
        x: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      }
    );
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === id) {
        const newCompleted = !todo.completed;
        
        gsap.to(
          `[data-todo-id="${id}"]`,
          { 
            scale: newCompleted ? 1.05 : 1,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
          }
        );

        return { ...todo, completed: newCompleted };
      }
      return todo;
    }));
  };

  const deleteTodo = (id: string) => {
    gsap.to(
      `[data-todo-id="${id}"]`,
      {
        opacity: 0,
        x: 20,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setTodos(prev => prev.filter(todo => todo.id !== id));
        }
      }
    );
  };

  const clearCompleted = () => {
    const completedIds = todos.filter(todo => todo.completed).map(todo => todo.id);
    
    gsap.to(
      completedIds.map(id => `[data-todo-id="${id}"]`),
      {
        opacity: 0,
        x: 20,
        stagger: 0.1,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setTodos(prev => prev.filter(todo => !todo.completed));
        }
      }
    );
  };

  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Scene3D completedTasks={completedCount} total={todos.length} />
      
      <div className="max-w-md mx-auto relative z-10">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden border border-white/20">
          <div className="px-8 py-10">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-indigo-400 text-center mb-8">
              Task Manager
            </h1>

            <ProgressBar completed={completedCount} total={todos.length} />

            <form onSubmit={addTodo} className="mb-8 space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 px-4 py-3 bg-white/5 border border-indigo-200/20 rounded-xl text-indigo-100 placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-transparent backdrop-blur-sm"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 shadow-[0_4px_20px_rgba(79,70,229,0.3)]"
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => setImportance('low')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                    importance === 'low' 
                      ? 'bg-green-400/20 text-green-400' 
                      : 'bg-white/5 text-green-400/50 hover:bg-green-400/10'
                  }`}
                >
                  <ArrowDown className="w-4 h-4" />
                  Low
                </button>
                <button
                  type="button"
                  onClick={() => setImportance('medium')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                    importance === 'medium' 
                      ? 'bg-yellow-400/20 text-yellow-400' 
                      : 'bg-white/5 text-yellow-400/50 hover:bg-yellow-400/10'
                  }`}
                >
                  <Minus className="w-4 h-4" />
                  Medium
                </button>
                <button
                  type="button"
                  onClick={() => setImportance('high')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                    importance === 'high' 
                      ? 'bg-red-400/20 text-red-400' 
                      : 'bg-white/5 text-red-400/50 hover:bg-red-400/10'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  High
                </button>
              </div>
            </form>

            <div ref={todosContainerRef} className="space-y-3">
              {todos.map(todo => (
                <div
                  key={todo.id}
                  data-todo-id={todo.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                    todo.completed 
                      ? 'bg-white/5 border-transparent' 
                      : 'bg-gradient-to-r from-white/10 to-white/5 border border-white/10'
                  } hover:bg-white/10 group transform hover:scale-102`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="focus:outline-none transition-transform duration-200 hover:scale-110"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-indigo-300/50" />
                    )}
                  </button>
                  <span
                    className={`flex-1 text-lg ${
                      todo.completed 
                        ? 'text-indigo-300/50 line-through' 
                        : 'text-indigo-100'
                    }`}
                  >
                    {todo.text}
                  </span>
                  <div className="flex items-center gap-3">
                    {getImportanceIcon(todo.importance)}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-indigo-300/50 opacity-0 group-hover:opacity-100 hover:text-red-400 focus:outline-none transition-all duration-200 hover:scale-110"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {todos.length > 0 && (
              <div className="mt-8 flex justify-between items-center text-sm text-indigo-300/50">
                <span className="font-medium">{todos.length} task(s)</span>
                <button
                  onClick={clearCompleted}
                  className="text-indigo-400 hover:text-indigo-300 focus:outline-none transition-colors duration-200 flex items-center gap-2 group"
                >
                  <XCircle className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                  Clear completed
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer
        github="https://github.com/Mr-Zain-Ul-Abadeen"
        linkedin="https://www.linkedin.com/in/zain-ul-abadeen12/"
        email="znzain786zn@gmail.com"
        website="https://www.zainulabideen.me/"
      />
    </div>
  );
}

export default App;