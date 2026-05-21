import { useEffect, useState } from "react";
import "./App.css";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type Ticket = {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  customer: {
    name: string;
    email: string;
  };
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loginEmail, setLoginEmail] = useState("test@test.com");
  const [loginPassword, setLoginPassword] = useState("password123");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Login Issue");
  const [priority, setPriority] = useState("LOW");

  const [isRegistering, setIsRegistering] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const fetchTickets = () => {
    fetch("http://localhost:5000/api/tickets")
      .then((res) => res.json())
      .then((data) => setTickets(data))
      .catch((error) => console.error("Failed to fetch tickets:", error));
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    });

    if (!response.ok) {
      alert("Login failed");
      return;
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      }),
    });

    if (!response.ok) {
      alert("Registration failed");
      return;
    }

    alert("Account created. You can now log in.");
    setIsRegistering(false);
    setLoginEmail(registerEmail);
    setLoginPassword("");
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        category,
        priority,
        customerId: user?.id,
      }),
    });

    if (!response.ok) {
      alert("Failed to create ticket");
      return;
    }

    setTitle("");
    setDescription("");
    setCategory("Login Issue");
    setPriority("LOW");
    setIsModalOpen(false);
    fetchTickets();
  };

  const handleStatusChange = async (ticketId: number, newStatus: string) => {
    const response = await fetch(
      `http://localhost:5000/api/tickets/${ticketId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      }
    );

    if (!response.ok) {
      alert("Failed to update ticket status");
      return;
    }

    fetchTickets();
  };

  if (!user) {
    return (
      <main className="login-page">
        <section className="login-card">
          <h1>SupportAI</h1>
          <p>
            {isRegistering
              ? "Create an account to start submitting support tickets."
              : "Sign in to manage customer support tickets."}
          </p>

          {isRegistering ? (
            <form onSubmit={handleRegister} className="login-form">
              <label>
                Name
                <input
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
              </label>

              <button type="submit">Create Account</button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="login-form">
              <label>
                Email
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </label>

              <button type="submit">Login</button>
            </form>
          )}

          <button
            className="auth-switch"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? "Already have an account? Login"
              : "Need an account? Register"}
          </button>
        </section>
      </main>
    );
  }

  const totalTickets = tickets.length;
  const openTickets = tickets.filter((ticket) => ticket.status === "OPEN").length;
  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS"
  ).length;
  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "RESOLVED"
  ).length;

  return (
    <main className="app">
      <aside className="sidebar">
        <h1>SupportAI</h1>
        <nav>
          <p className="active">Dashboard</p>
          <p>Tickets</p>
          <p>Customers</p>
          <p>Analytics</p>
          <p>Settings</p>
        </nav>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <h2>Customer Support Dashboard</h2>
            <p>Logged in as {user.name} • {user.role}</p>
          </div>

          <div className="topbar-actions">
            {user.role === "CUSTOMER" && (
              <button onClick={() => setIsModalOpen(true)}>New Ticket</button>
            )}

            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
              }}
            >
              Logout
            </button>
          </div>
        </header>

        <section className="stats">
          <div className="card">
            <p>Total Tickets</p>
            <h3>{totalTickets}</h3>
          </div>
          <div className="card">
            <p>Open Tickets</p>
            <h3>{openTickets}</h3>
          </div>
          <div className="card">
            <p>In Progress</p>
            <h3>{inProgressTickets}</h3>
          </div>
          <div className="card">
            <p>Resolved</p>
            <h3>{resolvedTickets}</h3>
          </div>
        </section>

        <section className="panel">
          <h3>Recent Support Tickets</h3>

          <div className="ticket-list">
            {tickets.map((ticket) => (
              <div className="ticket" key={ticket.id}>
                <div>
                  <h4>{ticket.title}</h4>
                  <p>
                    {ticket.customer.name} • {ticket.category}
                  </p>
                </div>

                <div className="badges">
                  <span className="priority">{ticket.priority}</span>

                  {user.role === "CUSTOMER" ? (
                    <span className="status">{ticket.status}</span>
                  ) : (
                    <select
                      className="status-select"
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create New Ticket</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="ticket-form">
              <label>
                Title
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cannot log into my account"
                  required
                />
              </label>

              <label>
                Description
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue..."
                  required
                />
              </label>

              <label>
                Category
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>Login Issue</option>
                  <option>Payment Issue</option>
                  <option>Technical Bug</option>
                  <option>Account Issue</option>
                  <option>General Question</option>
                </select>
              </label>

              <label>
                Priority
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option>LOW</option>
                  <option>MEDIUM</option>
                  <option>HIGH</option>
                </select>
              </label>

              <button type="submit" className="submit-btn">
                Create Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;