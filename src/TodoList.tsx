import React, { useState } from "react";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface Item {
  id: number;
  text: string;
  completed: boolean;
}

export const TodoList = () => {
  const [todos, setTodos] = useState<Item[]>([
    { id: 1, text: "Make dishes", completed: false },
    { id: 2, text: "Clean kitchen", completed: false },
  ]);

  const [input, setInput] = useState<string>("");

  const handleToggle = (id: number) => {
    setTodos(
      (
        prevTodos //we are going to add new todo item, so we named it prevTodos that represent
      ) =>
        prevTodos.map((todo) => {
          if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
          }
          return todo;
        })
    );
  };

  const handleRemove = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const handleClick = () => {
    const newTodo: Item = { id: Date.now(), text: input, completed: false };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setInput("");
  };

  return (
    <div>
      <ListGroup>
        {todos.map((todo, index) => (
          <ListGroupItem
            key={todo.id}
            onClick={() => handleToggle(todo.id)}
            className="d-flex justify-content-between"
            style={{ textDecoration: todo.completed ? "line-through" : "none" }}
          >
            {index + 1} - {todo.text}
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleRemove(todo.id)}
            >
              Remove
            </Button>
          </ListGroupItem>
        ))}
      </ListGroup>
      <p></p>
      <input
        className="form-control"
        type="text"
        placeholder="Add todo item"
        value={input}
        onChange={(e) => setInput(e.currentTarget.value)}
      ></input>
      <p></p>
      <Button onClick={handleClick}>Add</Button>
    </div>
  );
};

// ...prevTodos is previous state of todos array and wa make a swallow copy of the prevTodos array!
