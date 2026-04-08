import { Router } from "express";
import { db, closureBoxesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateClosureBoxBody, ListClosureBoxesParams } from "@workspace/api-zod";

const router = Router();

router.post("/closure/boxes", async (req, res) => {
  const parsed = CreateClosureBoxBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ error: parsed.error.message });
  }

  const { sessionId, theme, intention, recipientName, letterContent, fate, fateDate, audioData, photoData, videoData } = parsed.data;

  const [box] = await db
    .insert(closureBoxesTable)
    .values({ sessionId, theme, intention, recipientName, letterContent, fate, fateDate: fateDate ?? null, audioData: audioData ?? null, photoData: photoData ?? null, videoData: videoData ?? null })
    .returning();

  return res.status(201).json({ success: true, boxId: box.id, sessionId: box.sessionId });
});

router.get("/closure/boxes/:sessionId", async (req, res) => {
  const parsed = ListClosureBoxesParams.safeParse(req.params);
  if (!parsed.success) {
    return res.status(422).json({ error: parsed.error.message });
  }

  const boxes = await db
    .select({
      id: closureBoxesTable.id,
      theme: closureBoxesTable.theme,
      intention: closureBoxesTable.intention,
      recipientName: closureBoxesTable.recipientName,
      fate: closureBoxesTable.fate,
      fateDate: closureBoxesTable.fateDate,
      hasAudio: closureBoxesTable.audioData,
      hasPhoto: closureBoxesTable.photoData,
      hasVideo: closureBoxesTable.videoData,
      createdAt: closureBoxesTable.createdAt,
    })
    .from(closureBoxesTable)
    .where(eq(closureBoxesTable.sessionId, parsed.data.sessionId));

  return res.json({
    boxes: boxes.map((b) => ({
      ...b,
      hasAudio: b.hasAudio !== null,
      hasPhoto: b.hasPhoto !== null,
      hasVideo: b.hasVideo !== null,
      createdAt: b.createdAt.toISOString(),
    })),
  });
});

export default router;
