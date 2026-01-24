// backend/index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const OpenAI = require("openai");

const app = express();

// ---- config ----
const PORT = Number(process.env.PORT || 4000);
// IMPORTANT: use 0.0.0.0 so other devices (phone) can reach your laptop
const HOST = process.env.HOST || "0.0.0.0";

// --- OpenAI ---
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
console.log("OPENAI_API_KEY present?", !!process.env.OPENAI_API_KEY);

// --- middleware ---
app.use(express.json({ limit: "1mb" }));

// CORS: allow Expo web + mobile
app.use(
  cors({
    origin: (origin, cb) => {
      // Mobile requests often have no Origin -> allow
      if (!origin) return cb(null, true);

      // Allow local dev origins
      const allowed = [
        "http://localhost:19006", // Expo web (common)
        "http://localhost:8081",  // Metro sometimes
        "http://localhost:3000",  // if you also run React web
      ];

      // Allow any localhost:* and LAN:* during dev
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin.startsWith("http://192.168.") ||
        origin.startsWith("http://10.") ||
        origin.startsWith("http://172.")
      ) {
        return cb(null, true);
      }

      if (allowed.includes(origin)) return cb(null, true);

      // If you want strict mode, change this to: cb(new Error("CORS blocked"))
      return cb(null, true);
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

// --- MySQL pool (use env vars) ---
const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    port: Number(process.env.MYSQLPORT),
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    timezone: "Z",
    ssl: { rejectUnauthorized: false }, // Railway commonly needs this
});

// quick health check
app.get("/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 as ok");
    res.json({ ok: true, db: rows?.[0]?.ok === 1 });
  } catch (e) {
    res.status(500).json({ ok: false, error: "db not reachable" });
  }
});

// helper
function parseDateOrNow(createdAt) {
  if (!createdAt) return new Date();
  const d = new Date(createdAt);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

// ---------- ROUTES ----------

// GET /api/tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, text, done, created_at, source FROM tasks ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("GET /api/tasks error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/tasks
app.post("/api/tasks", async (req, res) => {
  try {
    const { text, done = false, createdAt, source = "web" } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "text is required" });
    }

    const created = parseDateOrNow(createdAt);

    const [result] = await pool.query(
      "INSERT INTO tasks (text, done, created_at, source) VALUES (?, ?, ?, ?)",
      [text, done ? 1 : 0, created, source]
    );

    const [rows] = await pool.query(
      "SELECT id, text, done, created_at, source FROM tasks WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH /api/tasks/:id
app.patch("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { text, done } = req.body;

  try {
    const fields = [];
    const values = [];

    if (typeof text === "string") {
      fields.push("text = ?");
      values.push(text);
    }
    if (typeof done === "boolean") {
      fields.push("done = ?");
      values.push(done ? 1 : 0);
    }
    if (!fields.length) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    values.push(id);

    await pool.query(`UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`, values);

    const [rows] = await pool.query(
      "SELECT id, text, done, created_at, source FROM tasks WHERE id = ?",
      [id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("PATCH /api/tasks/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/tasks/:id
app.delete("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
    res.status(204).send();
  } catch (err) {
    console.error("DELETE /api/tasks/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/journal
app.post("/api/journal", async (req, res) => {
  try {
    const { dateKey, mood, note } = req.body;

    if (!dateKey) return res.status(400).json({ error: "dateKey is required" });

    await pool.query(
      `
      INSERT INTO journal_entries (date_key, mood, note)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        mood = VALUES(mood),
        note = VALUES(note),
        updated_at = CURRENT_TIMESTAMP
      `,
      [dateKey, mood ?? null, note ?? null]
    );

    const [rows] = await pool.query(
      "SELECT id, date_key, mood, note, created_at, updated_at FROM journal_entries WHERE date_key = ?",
      [dateKey]
    );

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("POST /api/journal error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/chat
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const chatMessages = [
      {
        role: "system",
        content:
          "You are a gentle, supportive companion in a mood journaling app. " +
          "You listen, validate feelings, and offer small, realistic suggestions. " +
          "You are NOT a therapist and must remind users you cannot give medical advice.",
      },
    ];

    if (Array.isArray(messages)) {
      for (const m of messages) {
        const content = m?.content || m?.text;
        if (!content) continue;
        chatMessages.push({
          role: m.role === "user" ? "user" : "assistant",
          content,
        });
      }
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: chatMessages,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "I'm here with you. I'm listening.";

    res.json({ reply });
  } catch (err) {
    console.error("POST /api/chat error:", err?.response?.data || err?.message || err);
    res.status(500).json({
      error: "chat server error",
      reply: "Sorry—chat is unavailable right now. Please try again in a moment.",
    });
  }
});

// optional weekly stats
app.get("/api/tasks/weekly", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        DATE(created_at) as day,
        SUM(done = 1) as completed
      FROM tasks
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY day
      ORDER BY day;
      `
    );
    res.json(rows);
  } catch (err) {
    console.error("GET /api/tasks/weekly error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`API server running on http://${HOST}:${PORT}`);
});
