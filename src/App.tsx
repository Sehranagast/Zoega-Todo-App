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
    const loadData = async () => {
      try {
        const apiRes = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
        const apiData = await apiRes.json()

        const apiTodos: Todo[] = apiData.map((todo: any) => ({
          id: todo.id,
          text: todo.title,
          completed: todo.completed,
        }))

        const customTodosJSON = localStorage.getItem('customTodos')
        const customTodos: Todo[] = customTodosJSON ? JSON.parse(customTodosJSON) : []

        const merged = [...apiTodos, ...customTodos]
        setTodos(merged)
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadData()
  }, [])

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

    const updatedTodos = [...todos, newTodo]
    setTodos(updatedTodos)

    
    const stored = localStorage.getItem('customTodos')
    const currentCustomTodos: Todo[] = stored ? JSON.parse(stored) : []
    localStorage.setItem('customTodos', JSON.stringify([...currentCustomTodos, newTodo]))

    showMessage('Tarea agregada')
  }

  const toggleTodo = (id: number) => {
    const updated = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
    setTodos(updated)

    updateCustomStorage(updated)
    showMessage('Tarea actualizada')
  }

  const deleteTodo = (id: number) => {
    const updated = todos.filter(todo => todo.id !== id)
    setTodos(updated)

    updateCustomStorage(updated)
    showMessage('Tarea eliminada')
  }

  const updateCustomStorage = (allTodos: Todo[]) => {
    const apiIds = Array.from({ length: 10 }, (_, i) => i + 1)
    const onlyCustom = allTodos.filter(todo => !apiIds.includes(todo.id))
    localStorage.setItem('customTodos', JSON.stringify(onlyCustom))
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
