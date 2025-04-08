import { Todo } from '../../App'
import './TodoList.css'

interface Props {
  todos: Todo[]
  toggleTodo: (id: number) => void
  deleteTodo: (id: number) => void
}

export function TodoList({ todos, toggleTodo, deleteTodo }: Props) {
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <li key={todo.id} className={todo.completed ? 'completed' : ''}>
          <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
          <button onClick={() => deleteTodo(todo.id)}>❌</button>
        </li>
      ))}
    </ul>
  )
}
