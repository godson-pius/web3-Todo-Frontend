import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todo, setTodo] = useState("");
  const [popup, setPopup] = useState(false);
  const [todos, setTodos] = useState([]);
  const [isServerdown, setIsserverdown] = useState(false);
  const URL = "http://localhost:3001";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const server_res = await axios.post(`${URL}/todo/new`, { text: todo });
    const added_todo = server_res.data;

    setPopup(false);
    setTodo("");
    setTodos([...todos, added_todo]);
  };

  const handleDelete = async (id) => {
    let conf = confirm("Do you want to delete task?");

    if (conf) {
      const server_res = await axios.delete(`${URL}/todo/delete/${id}`);
      const deleted_id = server_res.data?._id;

      setTodos((todos) => todos.filter((todo) => todo._id !== deleted_id));
    }
  };

  const handleComplete = async (id) => {
    const server_res = await axios.put(`${URL}/todo/complete/${id}`);
    getTodos();
  };

  const getTodos = async () => {
    const todos = await axios
      .get(`${URL}/todos`)
      .catch((err) => setIsserverdown(true));
    setTodos(todos.data);
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <>
      <div className="w-full flex justify-center py-20">
        <div className="todo__box p-2 text-center text-[#f4f1f1] w-full px-4 md:px-20 lg:px-36">
          <h1 className="font-bold text-2xl mt-3 mb-5">Web3 Todo</h1>

          {todos.length > 0 ? (
            todos.map((todo) => (
              <div
                key={todo?._id}
                className="single__todo bg-[#192a35b1] w-full py-2 px-5 rounded-full mb-4 shadow-xl"
              >
                <div className="flex justify-between">
                  <h2
                    className={todo.complete ? "completed" : "cursor-pointer"}
                    onClick={() => handleComplete(todo?._id)}
                  >
                    {todo?.text}
                  </h2>
                  <span
                    className="w-7 h-7 hover:ring-1 cursor-pointer hover:ring-red-400 duration-700 rounded-full flex items-center justify-center"
                    onClick={() => handleDelete(todo?._id)}
                  >
                    &times;
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="animate-pulse">
              {isServerdown ? "Please check your network!" : "Loading"}
            </div>
          )}
        </div>

        {/* Pop Up */}
        {popup ? (
          <div className="todo__popup p-20 bg-[#1a2e3cfe] absolute rounded-md shadow-lg flex flex-col items-center">
            <h1 className="font-bold text-[#f4f1f1] mt-3 mb-5">Add Todo</h1>

            <form className="flex gap-2" onSubmit={handleSubmit}>
              <input
                className="w-96 p-2 outline-none bg-transparent ring-2 ring-sky-900 focus:ring-sky-800 duration-500 px-3 text-sm text-[#f4f1f1] rounded"
                type="text"
                name="todo"
                id="todo"
                placeholder="Type todo..."
                onChange={(e) => setTodo(e.target.value)}
              />
              <button
                type="submit"
                className="bg-sky-800 p-2 text-sm text-[#f4f1f19e] rounded hover:bg-sky-900 duration-500 hover:text-[#f4f1f160] shadow"
              >
                Add
              </button>
            </form>

            <div className="close text-right absolute float-right w-[30rem] md:w-full top-1">
              <span
                className="p-5 rounded-full text-center text-red-300 cursor-pointer"
                onClick={() => setPopup(!popup)}
              >
                &times;
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <div
        className="add__todo w-10 h-10 shadow-xl ring-2 text-[#f4f1f1] hover:bg-[#192a35b1] duration-500 hover:scale-105 cursor-pointer ease-in-out flex items-center float-right justify-center mx-4 md:mx-20 lg:mr-36 rounded-full"
        onClick={() => setPopup(!popup)}
      >
        <span className="">+</span>
      </div>
    </>
  );
}

export default App;
