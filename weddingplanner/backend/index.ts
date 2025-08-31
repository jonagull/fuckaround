import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import usersRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import { errorHandler } from "./middleware/errorHandler";
import eventRoutes from "./routes/event";
import addressSearchRoutes from "./routes/addressSearch";
import plannerInvitationRoutes from "./routes/plannerInvitation";
import invitationRoutes from "./routes/invitation";
const app = express();
const PORT = 3070;

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:3050"],
  credentials: true, // Allow cookies and authorization headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes); // auth routes
app.use("/api/users", usersRoutes); // users route
app.use("/api/events", eventRoutes); // event routes
app.use("/api/addressSearch", addressSearchRoutes); // address search routes
app.use("/api/invitations", plannerInvitationRoutes); // planner invitation routes
app.use("/api/guest-invitations", invitationRoutes); // guest invitation routes

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
