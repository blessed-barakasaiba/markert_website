import React, { useState } from "react";

const LoginModal = ({ show, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);

  const handleLogin = () => {
    if (username.trim() === "" || password.trim() === "") {
      // Trigger shake animation
      setShake(true);
      setTimeout(() => setShake(false), 500); // remove after animation ends
      return;
    }

    // Otherwise proceed with login logic
    alert("Login successful!");
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-500 ${
        show ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white p-8 rounded-2xl w-[90%] max-w-md transform transition-all duration-500 ${
          shake ? "animate-shake" : ""
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-2 border mb-4 rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border mb-4 rounded"
        />
        <div className="flex justify-between">
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Login
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
