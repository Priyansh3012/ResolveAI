import { useState } from "react";
import "./App.css";

function App() {
    const [login, setLogin] = useState({
        email: "",
        password: ""
    });

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        priority: "Medium"
    });

    const [loggedIn, setLoggedIn] = useState(false);
    const [message, setMessage] = useState("");

    const handleLoginChange = (e) => {
        setLogin({
            ...login,
            [e.target.name]: e.target.value
        });
    };

    const handleFormChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Login user
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(login)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            setLoggedIn(true);
            setMessage(`Welcome ${data.user.name}`);
        } catch (error) {
            setMessage(error.message);
        }
    };

    // Create ticket
    const handleTicketSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/tickets",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(form)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create ticket"
                );
            }

            setMessage("Ticket created successfully");

            setForm({
                title: "",
                description: "",
                category: "",
                priority: "Medium"
            });
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="app">
            {!loggedIn ? (
                <>
                    <h1>Login</h1>

                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={login.email}
                            onChange={handleLoginChange}
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={login.password}
                            onChange={handleLoginChange}
                        />

                        <button type="submit">
                            Login
                        </button>
                    </form>

                    {message && <p>{message}</p>}
                </>
            ) : (
                <>
                    <h1>Create Ticket</h1>

                    <p>{message}</p>

                    <form onSubmit={handleTicketSubmit}>
                        <input
                            type="text"
                            name="title"
                            placeholder="Ticket title"
                            value={form.title}
                            onChange={handleFormChange}
                        />

                        <textarea
                            name="description"
                            placeholder="Describe the issue"
                            value={form.description}
                            onChange={handleFormChange}
                        />

                        <select
                            name="category"
                            value={form.category}
                            onChange={handleFormChange}
                        >
                            <option value="">
                                Select category
                            </option>
                            <option value="Technical Issue">
                                Technical Issue
                            </option>
                            <option value="Network Issue">
                                Network Issue
                            </option>
                            <option value="Software Issue">
                                Software Issue
                            </option>
                            <option value="Hardware Issue">
                                Hardware Issue
                            </option>
                        </select>

                        <select
                            name="priority"
                            value={form.priority}
                            onChange={handleFormChange}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>

                        <button type="submit">
                            Create Ticket
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}

export default App;