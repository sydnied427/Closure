import { Router } from "express";
import { db, closureBoxesTable } from "@workspace/db";
import { eq, or } from "drizzle-orm";
import { CreateClosureBoxBody, ListClosureBoxesParams } from "@workspace/api-zod";

const router = Router();

function toBoxResponse(b: typeof closureBoxesTable.$inferSelect) {
  return {
    id: b.id,
    theme: b.theme,
    intention: b.intention,
    recipientName: b.recipientName,
    fate: b.fate,
    fateDate: b.fateDate ?? null,
    hasAudio: b.audioData !== null,
    hasPhoto: b.photoData !== null,
    hasVideo: b.videoData !== null,
    createdAt: b.createdAt.toISOString(),
  };
}

router.post("/closure/boxes", async (req, res) => {
  const parsed = CreateClosureBoxBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ error: parsed.error.message });
  }

  const { sessionId, theme, intention, recipientName, letterContent, fate, fateDate, audioData, photoData, videoData } = parsed.data;

  const userId = req.isAuthenticated() ? req.user.id : null;

  const [box] = await db
    .insert(closureBoxesTable)
    .values({
      sessionId,
      userId,
      theme,
      intention,
      recipientName,
      letterContent,
      fate,
      fateDate: fateDate ?? null,
      audioData: audioData ?? null,
      photoData: photoData ?? null,
      videoData: videoData ?? null,
    })
    .returning();

  return res.status(201).json({ success: true, boxId: box.id, sessionId: box.sessionId });
});

// Anonymous session-based listing
router.get("/closure/boxes/:sessionId", async (req, res) => {
  const parsed = ListClosureBoxesParams.safeParse(req.params);
  if (!parsed.success) {
    return res.status(422).json({ error: parsed.error.message });
  }

  const boxes = await db
    .select()
    .from(closureBoxesTable)
    .where(eq(closureBoxesTable.sessionId, parsed.data.sessionId));

  return res.json({ boxes: boxes.map(toBoxResponse) });
});

// Authenticated user listing — includes boxes by userId OR sessionId (for boxes created before sign-in)
router.get("/closure/me/boxes", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const sessionId = req.query.sessionId as string | undefined;
  const userId = req.user.id;

  const conditions = [eq(closureBoxesTable.userId, userId)];
  if (sessionId) {
    conditions.push(eq(closureBoxesTable.sessionId, sessionId));
  }

  const boxes = await db
    .select()
    .from(closureBoxesTable)
    .where(or(...conditions));

  // Also update anonymous boxes from this session to link them to the user
  if (sessionId) {
    await db
      .update(closureBoxesTable)
      .set({ userId })
      .where(eq(closureBoxesTable.sessionId, sessionId));
  }

  return res.json({ boxes: boxes.map(toBoxResponse) });
});

export default router;
