import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma.js";
import { analyzeSentiment } from "./sentiment.js";
import { generateSuggestedReply } from "./aiReply.js";

const app = express();
const PORT = 5000;
const JWT_SECRET = "dev_secret_key";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Customer Support Platform API Running");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running successfully",
  });
});

//-------------------------------------------------------------------------------------------------

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "CUSTOMER",
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Registration failed",
      errorMessage: error.message,
      errorCode: error.code,
    });
  }
});

//-----------------------------------------------------------------------------

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

app.post("/api/tickets", async (req, res) => {
  try {
    const { title, description, category, priority, customerId } = req.body;

    const analysis = analyzeSentiment(title + " " + description);

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        category,
        priority: priority || "LOW",
        customerId,
        sentiment: analysis.sentiment,
        riskLevel: analysis.riskLevel,
      },
    });

    res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error: any) {
    console.error("Create ticket error:", error);
    res.status(500).json({
      message: "Failed to create ticket",
      errorMessage: error.message,
    });
  }
});

//----------------------------------------------------------------------------------------------npm run dev

app.get("/api/tickets", async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(tickets);
  } catch (error: any) {
    console.error("Fetch tickets error:", error);
    res.status(500).json({
      message: "Failed to fetch tickets",
      errorMessage: error.message,
    });
  }
});

//----------------------------------------------------------------------------------------------

app.patch("/api/tickets/:id/status", async (req, res) => {
  try {
    const ticketId = Number(req.params.id);
    const { status } = req.body;

    const allowedStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        allowedStatuses,
      });
    }

    const updatedTicket = await prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        status,
      },
    });

    res.json({
      message: "Ticket status updated successfully",
      ticket: updatedTicket,
    });
  } catch (error: any) {
    console.error("Update ticket status error:", error);
    res.status(500).json({
      message: "Failed to update ticket status",
      errorMessage: error.message,
    });
  }
});

//----------------------------------------------------------------------------------------
app.post("/api/ai/suggest-reply", async (req, res) => {
  try {
    const { ticketId } = req.body;

    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    const suggestedReply = generateSuggestedReply({
      title: ticket.title,
      description: ticket.description,
      category: ticket.category,
      sentiment: ticket.sentiment,
      riskLevel: ticket.riskLevel,
    });

    res.json({
      suggestedReply,
    });
  } catch (error: any) {
    console.error("AI reply error:", error);
    res.status(500).json({
      message: "Failed to generate suggested reply",
      errorMessage: error.message,
    });
  }
});

//------------------------------------------------------------------------------------------------

app.patch("/api/tickets/:id/resolve", async (req, res) => {
  try {
    const ticketId = Number(req.params.id);
    const { resolution } = req.body;

    if (!resolution) {
      return res.status(400).json({
        message: "Resolution is required",
      });
    }

    const updatedTicket = await prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        status: "RESOLVED",
        resolution,
      },
    });

    res.json({
      message: "Ticket resolved successfully",
      ticket: updatedTicket,
    });
  } catch (error: any) {
    console.error("Resolve ticket error:", error);
    res.status(500).json({
      message: "Failed to resolve ticket",
      errorMessage: error.message,
    });
  }
});

//-------------------------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});