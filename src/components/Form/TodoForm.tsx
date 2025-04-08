import { useState, FormEvent } from 'react'
import './TodoForm.css'

interface Props {
  addTodo: (text: string) => void
}

export function TodoForm({ addTodo }: Props) {
  const [text, setText] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    addTodo(text)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        className="todo-input"
        type="text"
        placeholder="Add a new task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  )
}