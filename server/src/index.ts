import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma.js";

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

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        category,
        priority: priority || "LOW",
        customerId,
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});