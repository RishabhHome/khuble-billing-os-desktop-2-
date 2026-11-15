import express from "express";
import path from "path";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index.js";
import { users, invoices, inventory, crm } from "./src/db/schema.js";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Workaround for crypto in node environment if needed, but uuid uses crypto internally.
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-me";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API Routes ---

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email)
      });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }
      const hash = await bcrypt.hash(password, 10);
      const id = `USR-${crypto.randomBytes(4).toString("hex")}`;
      
      await db.insert(users).values({
        id,
        name,
        email,
        passwordHash: hash,
        role: "Root Admin",
        status: "Active"
      });
      
      const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
      res.json({ token, user: { id, name, email, role: "Root Admin", status: "Active" } });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await db.query.users.findFirst({
        where: eq(users.email, email)
      });
      if (!user) return res.status(400).json({ error: "Invalid credentials" });
      
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
      
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status } });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Middleware to verify token
  const authMiddleware = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (e) {
      res.status(401).json({ error: "Unauthorized" });
    }
  };

  // User endpoints
  app.get("/api/users", authMiddleware, async (req, res) => {
    const allUsers = await db.select().from(users);
    res.json(allUsers.map(u => ({ id: u.id, name: u.name, role: u.role, status: u.status, email: u.email })));
  });

  app.post("/api/users", authMiddleware, async (req, res) => {
    try {
      const { name, email, password, role, status } = req.body;
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email)
      });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }
      const hash = await bcrypt.hash(password, 10);
      const id = `USR-${crypto.randomBytes(4).toString("hex")}`;
      await db.insert(users).values({
        id,
        name,
        email,
        passwordHash: hash,
        role: role || "Staff",
        status: status || "Offline"
      });
      res.json({ id, name, email, role: role || "Staff", status: status || "Offline" });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.put("/api/users/:id", authMiddleware, async (req, res) => {
    try {
        const { name, role, status } = req.body;
        await db.update(users).set({ name, role, status }).where(eq(users.id, req.params.id));
        res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.delete("/api/users/:id", authMiddleware, async (req, res) => {
    try {
        await db.delete(users).where(eq(users.id, req.params.id));
        res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get("/api/users/me", authMiddleware, async (req: any, res) => {
    const user = await db.query.users.findFirst({ where: eq(users.id, req.user.id) });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ id: user.id, name: user.name, role: user.role, status: user.status, email: user.email });
  });

  // Data endpoints (Invoices, Inventory, CRM)
  app.get("/api/invoices", authMiddleware, async (req, res) => {
    const data = await db.select().from(invoices);
    res.json(data);
  });
  
  app.post("/api/invoices", authMiddleware, async (req, res) => {
    try {
        const { id, client, date, amount, status } = req.body;
        await db.insert(invoices).values({ id, client, date, amount, status });
        res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.put("/api/invoices/:id", authMiddleware, async (req, res) => {
    try {
        const { client, date, amount, status } = req.body;
        await db.update(invoices).set({ client, date, amount, status }).where(eq(invoices.id, req.params.id));
        res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.delete("/api/invoices/:id", authMiddleware, async (req, res) => {
    try {
        await db.delete(invoices).where(eq(invoices.id, req.params.id));
        res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  
  app.get("/api/inventory", authMiddleware, async (req, res) => {
    const data = await db.select().from(inventory);
    res.json(data);
  });
  
  app.post("/api/inventory", authMiddleware, async (req, res) => {
    try {
        const { id, name, stock, price } = req.body;
        await db.insert(inventory).values({ id, name, stock, price });
        res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.put("/api/inventory/:id", authMiddleware, async (req, res) => {
    try {
        const { name, stock, price } = req.body;
        await db.update(inventory).set({ name, stock, price }).where(eq(inventory.id, req.params.id));
        res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.delete("/api/inventory/:id", authMiddleware, async (req, res) => {
    try {
        await db.delete(inventory).where(eq(inventory.id, req.params.id));
        res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get("/api/crm", authMiddleware, async (req, res) => {
    const data = await db.select().from(crm);
    res.json(data);
  });

  app.post("/api/crm", authMiddleware, async (req, res) => {
    try {
        const { id, name, totalValue, last, status } = req.body;
        await db.insert(crm).values({ id, name, totalValue, last, status });
        res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.put("/api/crm/:id", authMiddleware, async (req, res) => {
    try {
        const { name, totalValue, last, status } = req.body;
        await db.update(crm).set({ name, totalValue, last, status }).where(eq(crm.id, req.params.id));
        res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.delete("/api/crm/:id", authMiddleware, async (req, res) => {
    try {
        await db.delete(crm).where(eq(crm.id, req.params.id));
        res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
