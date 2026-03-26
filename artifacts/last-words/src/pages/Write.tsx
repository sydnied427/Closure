import React, { useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateLetter } from "@workspace/api-client-react";

type DeliveryType = "sealed" | "date";

interface MediaState {
  blob: Blob | null;
  base64: string | null;
  recording: boolean;
  stream: MediaStream | null;
  mediaRecorder: MediaRecorder | null;
  chunks: BlobPart[];
}

function useMediaRecorder(type: "audio" | "video") {
  const [state, setState] = useState<MediaState>({
    blob: null,
    base64: null,
    recording: false,
    stream: null,
    mediaRecorder: null,
    chunks: [],
  });
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const constraints = type === "audio" ? { audio: true } : { audio: true, video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const mimeType = type === "audio" ? "audio/webm" : "video/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.onloadend = () => {
          setState((s) => ({ ...s, blob, base64: reader.result as string, recording: false, stream: null, mediaRecorder: null }));
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mr.start();
      setState((s) => ({ ...s, recording: true, stream, mediaRecorder: mr, blob: null, base64: null }));
    } catch {
      alert(`Could not access your ${type === "audio" ? "microphone" : "camera"}. Please check permissions.`);
    }
  }, [type]);

  const stopRecording = useCallback(() => {
    state.mediaRecorder?.stop();
  }, [state.mediaRecorder]);

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setState((s) => ({ ...s, blob: file, base64: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }, []);

  const clear = useCallback(() => {
    state.stream?.getTracks().forEach((t) => t.stop());
    setState({ blob: null, base64: null, recording: false, stream: null, mediaRecorder: null, chunks: [] });
  }, [state.stream]);

  return { state, startRecording, stopRecording, handleFileUpload, clear };
}

export default function Write() {
  const [, navigate] = useLocation();
  const [recipient, setRecipient] = useState("");
  const [body, setBody] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("sealed");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [showAudio, setShowAudio] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioFileRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);

  const audio = useMediaRecorder("audio");
  const video = useMediaRecorder("video");
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  const createLetterMutation = useCreateLetter();

  // Show live camera preview while recording
  React.useEffect(() => {
    if (videoPreviewRef.current && video.state.stream) {
      videoPreviewRef.current.srcObject = video.state.stream;
    }
  }, [video.state.stream]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!recipient.trim()) { setError("Please enter who this letter is for."); return; }
    if (!body.trim()) { setError("Your letter is empty. Take your time."); return; }
    if (deliveryType === "date" && !deliveryDate) { setError("Please choose a date to release this letter."); return; }

    try {
      await createLetterMutation.mutateAsync({
        data: {
          recipient: recipient.trim(),
          body: body.trim(),
          deliveryType,
          deliveryDate: deliveryType === "date" ? deliveryDate : null,
          audioData: audio.state.base64 ?? null,
          videoData: video.state.base64 ?? null,
        },
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Your words are still here — please try again.");
    }
  };

  // Minimum date for delivery picker: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl text-center"
        >
          {/* Wax seal metaphor */}
          <div className="mx-auto mb-10 w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
            <span className="text-4xl select-none">🕯️</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6 leading-tight">
            Your words are safe here.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            We'll hold them until it's time.
          </p>
          <button
            onClick={() => navigate("/")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            Return home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-8 flex items-center justify-between max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="font-serif text-xl font-medium tracking-tight text-foreground hover:text-muted-foreground transition-colors"
        >
          Last Words.
        </button>
        <span className="text-sm text-muted-foreground">A letter to someone you've lost</span>
      </header>

      <main className="max-w-2xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2 leading-snug">
            Write your letter.
          </h1>
          <p className="text-muted-foreground mb-10">There's no right way. Just say what you need to say.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Recipient */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <label className="block text-sm font-medium text-muted-foreground mb-2 tracking-wide uppercase text-xs">
              Who is this letter for?
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Mom, Dad, James, Grandma…"
              className="w-full bg-transparent border-b-2 border-border focus:border-foreground outline-none py-3 text-xl font-serif text-foreground placeholder:text-muted-foreground/50 transition-colors"
            />
          </motion.div>

          {/* Letter body */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            <label className="block text-sm font-medium text-muted-foreground mb-2 tracking-wide uppercase text-xs">
              Your letter
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Start writing. There's no right way to do this."
              rows={14}
              className="w-full bg-transparent outline-none resize-none font-serif text-lg text-foreground leading-[1.9] placeholder:text-muted-foreground/40 py-2"
            />
            <div className="mt-2 h-px bg-border/60" />
          </motion.div>

          {/* Attachment options */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Attachments — optional</p>

            {/* Audio */}
            <div className="space-y-3">
              {!showAudio ? (
                <button
                  type="button"
                  onClick={() => setShowAudio(true)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <span className="w-6 h-6 rounded-full border border-border/60 group-hover:border-foreground/30 flex items-center justify-center text-xs transition-colors">+</span>
                  Add a voice memo
                </button>
              ) : (
                <div className="border border-border/50 rounded-lg p-4 space-y-3 bg-card/40">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Voice memo</span>
                    <button type="button" onClick={() => { setShowAudio(false); audio.clear(); }} className="text-xs text-muted-foreground hover:text-foreground">Remove</button>
                  </div>

                  {audio.state.base64 ? (
                    <div className="space-y-2">
                      <audio controls src={audio.state.base64} className="w-full h-10" />
                      <button type="button" onClick={audio.clear} className="text-xs text-muted-foreground hover:text-destructive transition-colors">Clear recording</button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {!audio.state.recording ? (
                        <button
                          type="button"
                          onClick={audio.startRecording}
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                        >
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          Record
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={audio.stopRecording}
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition-colors"
                        >
                          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                          Stop recording
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => audioFileRef.current?.click()}
                        className="px-4 py-2 text-sm border border-border/60 text-muted-foreground rounded-md hover:border-foreground/30 hover:text-foreground transition-colors"
                      >
                        Upload file
                      </button>
                      <input
                        ref={audioFileRef}
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) audio.handleFileUpload(f); }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Video */}
              {!showVideo ? (
                <button
                  type="button"
                  onClick={() => setShowVideo(true)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <span className="w-6 h-6 rounded-full border border-border/60 group-hover:border-foreground/30 flex items-center justify-center text-xs transition-colors">+</span>
                  Add a video message
                </button>
              ) : (
                <div className="border border-border/50 rounded-lg p-4 space-y-3 bg-card/40">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Video message</span>
                    <button type="button" onClick={() => { setShowVideo(false); video.clear(); }} className="text-xs text-muted-foreground hover:text-foreground">Remove</button>
                  </div>

                  {video.state.base64 ? (
                    <div className="space-y-2">
                      <video controls src={video.state.base64} className="w-full rounded-md max-h-48 bg-black" />
                      <button type="button" onClick={video.clear} className="text-xs text-muted-foreground hover:text-destructive transition-colors">Clear recording</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {video.state.recording && (
                        <video ref={videoPreviewRef} autoPlay muted playsInline className="w-full rounded-md max-h-48 bg-black" />
                      )}
                      <div className="flex flex-wrap gap-3">
                        {!video.state.recording ? (
                          <button
                            type="button"
                            onClick={video.startRecording}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                          >
                            <span className="w-2 h-2 rounded-full bg-primary" />
                            Record
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={video.stopRecording}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition-colors"
                          >
                            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                            Stop recording
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => videoFileRef.current?.click()}
                          className="px-4 py-2 text-sm border border-border/60 text-muted-foreground rounded-md hover:border-foreground/30 hover:text-foreground transition-colors"
                        >
                          Upload file
                        </button>
                        <input
                          ref={videoFileRef}
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) video.handleFileUpload(f); }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Delivery options */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">When should this be opened?</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Sealed option */}
              <button
                type="button"
                onClick={() => setDeliveryType("sealed")}
                className={`relative p-5 rounded-xl border-2 text-left transition-all duration-300 ${
                  deliveryType === "sealed"
                    ? "border-foreground/40 bg-foreground/5"
                    : "border-border/50 hover:border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl select-none">🪭</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    deliveryType === "sealed" ? "border-foreground bg-foreground" : "border-border/60"
                  }`}>
                    {deliveryType === "sealed" && <div className="w-1.5 h-1.5 rounded-full bg-background" />}
                  </div>
                </div>
                <h3 className="font-serif text-base text-foreground mb-1">Seal until I decide</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Locked away with no release date. Only you can choose when.
                </p>
              </button>

              {/* Date option */}
              <button
                type="button"
                onClick={() => setDeliveryType("date")}
                className={`relative p-5 rounded-xl border-2 text-left transition-all duration-300 ${
                  deliveryType === "date"
                    ? "border-foreground/40 bg-foreground/5"
                    : "border-border/50 hover:border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl select-none">📅</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    deliveryType === "date" ? "border-foreground bg-foreground" : "border-border/60"
                  }`}>
                    {deliveryType === "date" && <div className="w-1.5 h-1.5 rounded-full bg-background" />}
                  </div>
                </div>
                <h3 className="font-serif text-base text-foreground mb-1">Release on a date</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Choose a specific day for this letter to be unlocked.
                </p>
              </button>
            </div>

            {/* Date picker */}
            <AnimatePresence>
              {deliveryType === "date" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2">
                    <label className="block text-xs text-muted-foreground mb-2">Choose a date</label>
                    <input
                      type="date"
                      value={deliveryDate}
                      min={minDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="bg-transparent border border-border/60 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-foreground/40 transition-colors"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-destructive"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="submit"
              disabled={createLetterMutation.isPending}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 bg-foreground text-background font-serif text-lg rounded-xl hover:bg-foreground/90 hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 disabled:pointer-events-none"
            >
              {createLetterMutation.isPending ? (
                <span className="inline-block w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              ) : (
                <>
                  <span>🕯️</span>
                  Seal This Letter
                </>
              )}
            </button>
          </motion.div>
        </form>
      </main>
    </div>
  );
}
