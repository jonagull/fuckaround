import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import usersRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import weddingDetailsRoutes from "./routes/weddingDetails";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = 3070;

// CORS configuration
app.use(
    cors({
        origin: [
            "http://localhost:3050", // Next.js dev server
            "http://localhost:3000", // Alternative Next.js port
            "http://127.0.0.1:3050",
            "http://127.0.0.1:3000",
        ],
        credentials: true, // Allow cookies and authorization headers
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes); // auth routes
app.use("/api/users", usersRoutes); // users route
app.use("/api/wedding-details", weddingDetailsRoutes); // wedding details routes

// app.use(/api/invitations', invitationRoites) // invitation rotues.

app.use(errorHandler);

app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);
