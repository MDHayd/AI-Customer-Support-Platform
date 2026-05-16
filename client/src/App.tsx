import './App.css'

function App() {
  const tickets = [
    {
      id: 1,
      title: "Cannot log into my account",
      customer: "Michael",
      category: "Login Issue",
      priority: "HIGH",
      status: "IN_PROGRESS",
    },
  ];

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
          <button>New Ticket</button>
        </header>

        <section className="stats">
          <div className="card">
            <p>Total Tickets</p>
            <h3>1</h3>
          </div>
          <div className="card">
            <p>Open Tickets</p>
            <h3>0</h3>
          </div>
          <div className="card">
            <p>In Progress</p>
            <h3>1</h3>
          </div>
          <div className="card">
            <p>Resolved</p>
            <h3>0</h3>
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
                    {ticket.customer} • {ticket.category}
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
    </main>
  );
}
  
export default App
