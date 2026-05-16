import './App.css';
import { useEffect, useState } from 'react';

type Ticket = {
  id: number;
  title: string;
  category: string;
  priority: string;
  status: string;
  customer: {
      name : string;
      email: string;
  };
};

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Login Issue");
  const [priority, setPriority] = useState("LOW");

  const fetchTickets = () => {
    fetch("http://localhost:5000/api/tickets")
      .then((res) => res.json())
      .then((data) => setTickets(data))
      .catch((error) => console.error("Failed to fetch tickets:", error));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

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
        customerId: 1,
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
            <p>AI-powered ticket monitoring and customer support insights.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)}>New Ticket</button>
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
                  <span className="status">{ticket.status}</span>
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
  
export default App