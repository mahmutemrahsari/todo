import React, { useState } from "react";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useQuery, gql, useMutation } from "@apollo/client";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  user_id: number;
}

export const TodoList = () => {
  const GET_TASKS = gql`
    query tasks {
      tasks {
        id
        title
        completed
        user_id
      }
    }
  `;

  const DELETE_TASK = gql`
    mutation deleteTask($id: Int!) {
      deleteTask(id: $id) {
        id
        title
        completed
        user_id
      }
    }
  `;

  const ADD_TASK = gql`
    mutation addTask($id: Int!, $title: String!) {
      addTask(task: { id: $id, title: $title, completed: false, user_id: 1 }) {
        id
        title
        completed
        user_id
      }
    }
  `;

  const UPDATE_TASK = gql`
    mutation updateTask($id: Int!, $edits: EditTaskInput!) {
      updateTask(id: $id, edits: $edits) {
        id
        title
        completed
        user_id
      }
    }
  `;

  const [updateTaskMutation] = useMutation(UPDATE_TASK);
  const [deleteTaskMutation] = useMutation(DELETE_TASK);
  const [addTaskMutation] = useMutation(ADD_TASK);

  const { loading, error, data, refetch } = useQuery(GET_TASKS);
  useMutation(DELETE_TASK);
  useMutation(ADD_TASK);

  const [todos, setTodos] = useState<Task[]>([]);
  const [input, setInput] = useState<string>("");
  const [editing, setEditing] = useState<boolean>(false); //jeg vil ikke blandet de input og editInput
  const [editInput, setEditInput] = useState<string>("");
  const [taskId, setTaskId] = useState<number>();

  const [inputError, setInputError] = useState<string>("");
  const [editInputError, setEditInputError] = useState<string>("");

  const handleToggle = async (id: number) => {
    // Find the task to toggle in the local state
    const toggledTask = todos.find((todo) => todo.id === id);

    if (toggledTask) {
      // Perform the updateTask mutation
      await updateTaskMutation({
        variables: {
          id,
          edits: { completed: !toggledTask.completed },
        },
        refetchQueries: [{ query: GET_TASKS }],
      });

      // Refetch tasks after update
      refetch();
    }
  };

  const handleRemove = async (id: number) => {
    // Perform the deleteTask mutation
    await deleteTaskMutation({
      variables: { id },
      refetchQueries: [{ query: GET_TASKS }],
    });
    // Refetch tasks after deletion
    refetch();
  };

  const handleClick = async () => {
    const newTodo: Task = {
      id: Math.floor(Math.random() * 10000),
      title: input,
      completed: false,
      user_id: 1,
    };

    if (input === "") {
      setInputError("Input can not be null!");
      return;
    }
    // Perform the addTask mutation
    await addTaskMutation({
      variables: { id: newTodo.id, title: newTodo.title },
      refetchQueries: [{ query: GET_TASKS }],
    });

    // Refetch tasks after adding a new task
    refetch();
    setInput("");
  };

  const handleSaveEdit = async (editInput: string, id: number) => {
    // Perform the deleteTask mutation
    if (editInput === "") {
      setEditInputError("Title can not be empty!");
      return;
    }

    await updateTaskMutation({
      variables: { id, edits: { title: editInput } },
      refetchQueries: [{ query: GET_TASKS }],
    });
    setEditing(false);
    setEditInput("");
    setInputError("");
    setEditInputError("");
    // Refetch tasks after deletion
    refetch();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <div>
      <ListGroup>
        {data.tasks.map((task: Task) => (
          <ListGroupItem
            key={task.id}
            onClick={() => handleToggle(task.id)}
            className="flex"
            style={{ textDecoration: task.completed ? "line-through" : "none" }}
          >
            {task.title}
            <div className=" d-flex justify-content-end">
              <div className="m-1 p-1">
                <Button
                  className="mr-2"
                  variant="warning"
                  size="sm"
                  onClick={() => {
                    setEditing(true);
                    setEditInput(task.title);
                    setTaskId(task.id);
                  }}
                >
                  Edit
                </Button>
              </div>
              <div className="m-1 p-1">
                <Button
                  className="pl-2"
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemove(task.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
            {editing && task.id === taskId && (
              <div key={task.id} className="pt-2">
                <input
                  className="form-control input-padding-bottom"
                  type="text"
                  placeholder="Edit todo item"
                  value={editInput}
                  onChange={(e) => setEditInput(e.currentTarget.value)}
                ></input>
                <div aria-live="assertive">
                  {editInputError && (
                    <p className="alert alert-danger py-2 mt-2">
                      {editInputError}
                    </p>
                  )}
                </div>
                <Button
                  className="mt-2"
                  onClick={() => handleSaveEdit(editInput, task.id)}
                >
                  Save
                </Button>
              </div>
            )}
          </ListGroupItem>
        ))}
        <p></p>
        <input
          className="form-control input-padding-bottom"
          type="text"
          placeholder="Add todo item"
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
        ></input>
        <div aria-live="assertive">
          {inputError && (
            <p className="alert alert-danger py-2 mt-2">{inputError}</p>
          )}
        </div>
        <Button className="mt-2" onClick={handleClick}>
          Add
        </Button>
      </ListGroup>
      <p></p>
    </div>
  );
};
