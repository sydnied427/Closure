import { Router, type IRouter } from "express";
import { db, waitlistTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.post("/waitlist", async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    res.status(422).json({ error: "A valid email address is required." });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(422).json({ error: "Please enter a valid email address." });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existing = await db
      .select()
      .from(waitlistTable)
      .where(eq(waitlistTable.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      res.status(409).json({ error: "This email is already on the waitlist." });
      return;
    }

    await db.insert(waitlistTable).values({ email: normalizedEmail });

    res.json({ success: true, message: "You've been added to the waitlist." });
  } catch (err) {
    req.log.error({ err }, "Failed to insert waitlist entry");
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
