import { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [search, setSearch] = useState("");
    const [editId, setEditId] = useState(null);
    const [dueDate, setDueDate]= useState("");
    const [filter, setFilter] = useState("All");
    const [darkMode,setDarkMode] = useState(false);
    const navigate = useNavigate();
useEffect(() => {

  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/");
    return;
  }

  fetchTasks();

}, []);
const fetchTasks = async () => {

    const token = localStorage.getItem("token");
  try {
    const res = await axios.get("https://task-manager-kbwk.onrender.com/api/tasks",
        {
            headers: {
                authorization: token
            }
        }
    );
    console.log(res.data);
    setTasks(Array.isArray(res.data) ? res.data : []);
  } catch (error) {
    console.log(error);
  }
};
const addTask = async () => {
  try {
    if (editId) {
        const token = localStorage.getItem("token");
  await axios.put(`https://task-manager-kbwk.onrender.com/api/tasks/${editId}`, {
    title,
    status: "Pending",
    priority,
  },

{
    headers: {
        authorization: token
    }
});

  setEditId(null);
  fetchTasks();
  setTitle("");
  return;
}

    const token = localStorage.getItem("token");
    await axios.post("https://task-manager-kbwk.onrender.com/api/tasks/create", {
      title,
      description: "New Task",
      status: "Pending",
      priority: priority,
      due_date: "2026-06-20",
    },
{
    headers: {
        authorization: token
    }
});

    fetchTasks();
    setTitle("");
  } catch (error) {
    console.log(error);
  }
};

const updateTask = async (id) => {
  try {
    const token = localStorage.getItem("token");
    await axios.put(`https://task-manager-kbwk.onrender.com/api/tasks/${id}`, {
      status: "Completed"
    },
{
    headers: {
        authorization: token
    }
});

    fetchTasks();
  } catch (error) {
    console.log(error);
  }
};

const deleteTask = async (id) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`https://task-manager-kbwk.onrender.com/api/tasks/${id}`,
        {
            headers: {
                authorization: token
            }
        }
    );
    fetchTasks();
  } catch (error) {
    console.log(error);
  }
};

const totalTasks = tasks.length;

const completedTasks = tasks.filter(
  (task) => task.status === "Completed"
).length;

const pendingTasks = tasks.filter(
  (task) => task.status === "Pending"
).length;

const filteredTasks = tasks.filter((task) => {
  const matchesSearch = task.title
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesFilter =
    filter === "All" || task.status === filter;

  return matchesSearch && matchesFilter;
});

const editTask = (task) => {
  setTitle(task.title);
  setPriority(task.priority);
  setEditId(task.id);
};

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <h1>Dashboard Page</h1>
      <div className="stats">
  <div className="stat-card">
    <h3>Total</h3>
    <p>{totalTasks}</p>
  </div>

  <div className="stat-card">
    <h3>Pending</h3>
    <p>{pendingTasks}</p>
  </div>

  <div className="stat-card">
    <h3>Completed</h3>
    <p>{completedTasks}</p>
  </div>
</div >
<div className="top-bar">
    <button
  onClick={() => setDarkMode(!darkMode)}
>
  {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
</button>

      <button
  onClick={() => {
    localStorage.removeItem("token");
    navigate("/");
  }}
>
  Logout
</button>
</div>


<div className="task-form">
<input
  type="date"
  value={dueDate}
  onChange={(e) => setDueDate(e.target.value)}
/>

<input
  type="text"
  placeholder="Search Task"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

      <input
  type="text"
  placeholder="Enter Task"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>

<select
  value={priority}
  onChange={(e) => setPriority(e.target.value)}
>
  <option value="Low">Low</option>
  <option value="Medium">Medium</option>
  <option value="High">High</option>
</select>

<select
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
>
  <option value="All">All</option>
  <option value="Pending">Pending</option>
  <option value="Completed">Completed</option>
</select>

<button onClick={addTask}>
  {editId ? "Update Task" : "Add Task"}
</button>
</div>

      <ul>
  {filteredTasks.map((task) => (
   <div className="task-card" key={task.id}>

    <div>
  <h3>{task.title}</h3>
  <p>{task.status}</p>
  <p>
  Priority:
  <span className={task.priority.toLowerCase()}>
    {" "}{task.priority}
  </span>
</p>
</div>
   <p>
  Due: {new Date(task.due_date).toLocaleDateString()}
</p>

  <div className="task-actions">
    <button className="complete-btn" onClick={() => updateTask(task.id)}>
      Complete
    </button>

    <button className="edit-btn"
  onClick={() => {
    setTitle(task.title);
    setPriority(task.priority);
    setEditId(task.id);
  }}
>
  Edit
</button>

    <button className="delete-btn" onClick={() => deleteTask(task.id)}>
      Delete
    </button>
  </div>
</div>
  ))}
</ul>

    </div>
  );
}

export default Dashboard;