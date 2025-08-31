"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth"));
const errorHandler_1 = require("./middleware/errorHandler");
const event_1 = __importDefault(require("./routes/event"));
const addressSearch_1 = __importDefault(require("./routes/addressSearch"));
const plannerInvitation_1 = __importDefault(require("./routes/plannerInvitation"));
const invitation_1 = __importDefault(require("./routes/invitation"));
const app = (0, express_1.default)();
const PORT = 3070;
// CORS configuration
const corsOptions = {
    origin: ["http://localhost:3050"],
    credentials: true, // Allow cookies and authorization headers
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", auth_1.default); // auth routes
app.use("/api/users", users_1.default); // users route
app.use("/api/events", event_1.default); // event routes
app.use("/api/addressSearch", addressSearch_1.default); // address search routes
app.use("/api/invitations", plannerInvitation_1.default); // planner invitation routes
app.use("/api/guest-invitations", invitation_1.default); // guest invitation routes
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
