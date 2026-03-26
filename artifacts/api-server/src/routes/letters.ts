import { Router, type IRouter } from "express";
import { db, lettersTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/letters", async (req, res) => {
  const { recipient, body, deliveryType, deliveryDate, audioData, videoData } = req.body;

  if (!recipient || typeof recipient !== "string" || recipient.trim().length === 0) {
    res.status(422).json({ error: "A recipient name is required." });
    return;
  }

  if (!body || typeof body !== "string" || body.trim().length === 0) {
    res.status(422).json({ error: "The letter body cannot be empty." });
    return;
  }

  if (!deliveryType || !["date", "sealed"].includes(deliveryType)) {
    res.status(422).json({ error: "A valid delivery option is required." });
    return;
  }

  if (deliveryType === "date" && !deliveryDate) {
    res.status(422).json({ error: "A delivery date is required when choosing 'Release on a date'." });
    return;
  }

  try {
    const [letter] = await db.insert(lettersTable).values({
      recipient: recipient.trim(),
      body: body.trim(),
      deliveryType,
      deliveryDate: deliveryType === "date" ? deliveryDate : null,
      audioData: audioData ?? null,
      videoData: videoData ?? null,
    }).returning();

    res.status(201).json({
      success: true,
      id: letter.id,
      message: "Your words are safe here. We'll hold them until it's time.",
    });
  } catch (err) {
    req.log.error({ err }, "Failed to save letter");
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
