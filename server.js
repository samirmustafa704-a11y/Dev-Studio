import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import getUserByToken from "@replit/repl-auth";

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 5000;

const SESSION_STORE = new Map();

function getSession(req) {
  const sid = req.headers.cookie
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("sid="))
    ?.split("=")[1];
  return sid ? SESSION_STORE.get(sid) : null;
}

function setSession(res, data) {
  const sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
  SESSION_STORE.set(sid, data);
  res.setHeader(
    "Set-Cookie",
    `sid=${sid}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
  );
  return sid;
}

function clearSession(req, res) {
  const sid = req.headers.cookie
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("sid="))
    ?.split("=")[1];
  if (sid) SESSION_STORE.delete(sid);
  res.setHeader("Set-Cookie", "sid=; Path=/; HttpOnly; Max-Age=0");
}

const app = express();
app.use(express.json());

app.get("/api/auth/user", (req, res) => {
  const session = getSession(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });
  res.json(session);
});

app.get("/api/auth/login", async (req, res) => {
  const token = req.headers["x-replit-user-id"]
    ? null
    : req.query.token;

  const userId = req.headers["x-replit-user-id"];
  const userName = req.headers["x-replit-user-name"];
  const userRoles = req.headers["x-replit-user-roles"];

  if (userId && userName) {
    const user = {
      id: String(userId),
      name: String(userName),
      roles: userRoles ? String(userRoles) : "",
      profileImage: `https://replit.com/cdn-cgi/image/width=64,quality=80/https://storage.googleapis.com/replit/profile-images/${userId}`,
    };
    setSession(res, user);
    return res.redirect("/");
  }

  if (token) {
    try {
      const user = await getUserByToken(String(token));
      if (user) {
        const sessionData = {
          id: String(user.id),
          name: user.name,
          roles: user.roles || "",
          profileImage: user.profileImage || "",
        };
        setSession(res, sessionData);
        return res.redirect("/");
      }
    } catch (e) {
      console.error("Auth token error:", e);
    }
  }

  return res.redirect(
    "https://replit.com/auth_with_repl_site?domain=" +
      encodeURIComponent(
        req.headers.host || process.env.REPLIT_DEV_DOMAIN || "localhost"
      )
  );
});

app.post("/api/auth/logout", (req, res) => {
  clearSession(req, res);
  res.json({ ok: true });
});

if (isProd) {
  const distPath = join(__dirname, "dist");
  app.use(express.static(distPath));
  app.get("/{*path}", (_req, res) => {
    res.sendFile(join(distPath, "index.html"));
  });
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Dev Studio running on port ${PORT}`);
});
