import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

// Modal Component
function Modal({ show, onClose, onConfirm }) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-blue-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold text-purple-950">Are you sure! you want to delete this todo?</h2>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onConfirm}
            className="bg-green-600 text-white p-2 rounded-md hover:bg-yellow-400"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="bg-purple-600 text-white p-2 rounded-md hover:bg-orange-800"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null); // Track the todo to delete

  useEffect(() => {
    let todoString = localStorage.getItem("todos");
    if (todoString) {
      let todos = JSON.parse(localStorage.getItem("todos"));
      setTodos(todos);
    }
  }, []);

  const saveToLs = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleAdd = () => {
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }]);
    setTodo("");
    saveToLs();
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex((item) => item.id === id);
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
    saveToLs();
  };

  const handleEdit = (e, id) => {
    let t = todos.filter((i) => i.id === id);
    setTodo(t[0].todo);
    let newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
    saveToLs();
  };

  const handleDeleteClick = (id) => {
    setTodoToDelete(id);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    let newTodos = todos.filter((item) => item.id !== todoToDelete);
    setTodos(newTodos);
    saveToLs();
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-300 min-h-[80vh] md:w-1/2">
        <h1 className="font-bold text-center text-xl">Manage Your Todos At One Place</h1>
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className="text-lg font-bold">Add a Todo</h2>
          <input
            type="text"
            className="w-full rounded-lg px-5 py-1"
            onChange={handleChange}
            value={todo}
          />
          <button
            onClick={handleAdd}
            disabled={todo.length <= 3}
            className="bg-violet-800 disabled:bg-purple-600 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md"
          >
            Save
          </button>
        </div>
        <input onChange={toggleFinished} type="checkbox" checked={showFinished} /> Show Finished
        <h2 className="text-lg font-bold">Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && <div className="m-5">No Todos to display</div>}
          {todos.filter((item) => showFinished ? item.isCompleted : true).map((item) => (
            <div key={item.id} className="todo flex justify-between my-3">
              <div className="flex gap-5">
                <input
                  name={item.id}
                  onChange={handleCheckbox}
                  type="checkbox"
                  checked={item.isCompleted}
                />
                <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
              </div>
              <div className="buttons flex h-full">
                <button
                  onClick={(e) => handleEdit(e, item.id)}
                  className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-2"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteClick(item.id)}
                  className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-2"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Modal Component */}
      <Modal
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default App;
