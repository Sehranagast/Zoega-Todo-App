import { useEffect, useState } from 'react'
import './App.css'
import { TodoForm } from './components/Form/TodoForm'
import { TodoList } from './components/List/TodoList'
import { ThemeProvider } from './context/ThemeContext'
import { ThemeToggle } from './components/Toggle/ThemeToggle'

export type Todo = {
  id: number
  text: string
  completed: boolean
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all')
  const [message, setMessage] = useState<string>('')


  useEffect(() => {
    const stored = localStorage.getItem('todos')
    const parsed = stored ? JSON.parse(stored) : null

    if (parsed && parsed.length > 0) {
      setTodos(parsed)
    } else {
      fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
        .then(res => res.json())
        .then(data => {
          const initial = data.map((todo: any) => ({
            id: todo.id,
            text: todo.title,
            completed: todo.completed,
          }))
          setTodos(initial)
          localStorage.setItem('todos', JSON.stringify(initial))
        })
    }
  }, [])


  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const showMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const addTodo = (text: string) => {
    if (!text.trim()) {
      showMessage('La tarea no puede estar vacía')
      return
    }
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
    }
    setTodos(prev => [...prev, newTodo])
    showMessage('Tarea agregada')
  }

  const toggleTodo = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
    showMessage('Tarea actualizada')
  }

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
    showMessage('Tarea eliminada')
  }

  const filteredTodos =
    filter === 'all'
      ? todos
      : filter === 'completed'
      ? todos.filter(todo => todo.completed)
      : todos.filter(todo => !todo.completed)

  return (
    <ThemeProvider>
      <div className="app-container">
        <h1 className="title">To-Do App</h1>
        <ThemeToggle />
        <TodoForm addTodo={addTodo} />

        <div className="filters">
          <button onClick={() => setFilter('all')}>All</button>
          <button onClick={() => setFilter('completed')}>Completed</button>
          <button onClick={() => setFilter('pending')}>Pending</button>
        </div>

        {message && <div className="message">{message}</div>}

        <TodoList
          todos={filteredTodos}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
        />
      </div>
    </ThemeProvider>
  )
}

export default App
