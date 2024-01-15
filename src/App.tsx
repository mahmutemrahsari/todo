import "./index.css";
import "./App.css";
import { TodoList } from "./TodoList";

function App() {
  return (
    <div className="container-md">
      <h1 className="header">TO DO</h1>
      <p></p>
      <TodoList />
    </div>
  );
}

export default App;
