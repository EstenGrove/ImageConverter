import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { API_USER } from "./utils/utils_env";
import userRoutes from "./routes/userRoutes";
import uploadRoutes from "./routes/fileRoutes";
import convertRoutes from "./routes/convertRoutes";

const app = new Hono();
const port = 3000;

const corsConfig = {
	// origin: [
	// 	"origin",
	// 	"http://localhost",
	// 	"http://localhost:5173",
	// 	"http://localhost:3000",
	// ],
	// credentials: false,
	// allowMethods: ["GET", "POST", "OPTIONS", "HEAD", "DELETE", "PREFLIGHT"],
	// allowHeaders: ["Origin", "Content-Type", "Authorization", "INCLUDE"],
};
const authConfig = {
	...API_USER,
	invalidUserMessage: "Nice try bozo",
};

app.use(cors());
app.use(basicAuth(authConfig));
app.use(logger());

app.route("/users", userRoutes);
app.route("/uploads", uploadRoutes);
app.route("/convert", convertRoutes);

console.log(`✅ Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});
