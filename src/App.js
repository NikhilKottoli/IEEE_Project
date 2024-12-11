import React, { useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const addTask = () => {
    if (newTask.trim() === "") return alert("Task name cannot be empty!");
    const task = {
      id: Date.now(),
      name: newTask,
      completed: false,
    };
    setTasks([...tasks, task]);
    setNewTask("");
  };

  const deleteTask = (id) => setTasks(tasks.filter((task) => task.id !== id));

  const toggleComplete = (id) =>
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

  const editTask = (id, newName) =>
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, name: newName } : task
      )
    );

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  const searchedTasks = filteredTasks.filter((task) =>
    task.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDrag = (draggedId, droppedId) => {
    const draggedIndex = tasks.findIndex((task) => task.id === draggedId);
    const droppedIndex = tasks.findIndex((task) => task.id === droppedId);
    const updatedTasks = [...tasks];
    const [draggedTask] = updatedTasks.splice(draggedIndex, 1);
    updatedTasks.splice(droppedIndex, 0, draggedTask);
    setTasks(updatedTasks);
  };

  return (
    <div className="App">
      <h1>Daily To-Do Tasks</h1>

      {/* Input for adding tasks */}
      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Filters */}
      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      {/* Search */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Task List */}
      <ul className="task-list">
        {searchedTasks.map((task) => (
          <li
            key={task.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)}
            onDrop={(e) => {
              const draggedId = parseInt(e.dataTransfer.getData("taskId"), 10);
              handleDrag(draggedId, task.id);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="task-item">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
              />
              <span
                className={`task-name ${
                  task.completed ? "completed" : ""
                }`}
              >
                {task.name}
              </span>
              <button
                onClick={() => {
                  const newName = prompt("Edit task:", task.name);
                  if (newName !== null) editTask(task.id, newName);
                }}
              >
                Edit
              </button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
