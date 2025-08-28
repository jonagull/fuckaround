import express from "express";
import { User } from "@weddingplanner/types";

// user routes
const router = express.Router();

router.get("/:id", (req, res) => {
    const { id } = req.params;

    // TODO: Implement databae, find user and return

    const user: User = {
        id: id,
        name: "Demo User",
        email: "implement@auth.com",
        phoneNumber: "1234567890",
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    res.json(user);
});

export default router;