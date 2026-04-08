import { useState, useEffect } from "react";

type Phase =
  | "idle"
  | "opening"
  | "catching"
  | "closing"
  | "sealed"
  | "shaking"
  | "fading"
  | "gone";

interface TreasureBoxProps {
  fate: string | null | undefined;
  triggered: boolean;
}

const CSS = `
  /* ── wrapper ── */
  .tb-wrapper {
    position: relative;
    width: 220px;
    height: 210px;
    margin: 0 auto;
  }

  /* ── envelope ── */
  .tb-envelope {
    position: absolute;
    left: 50%;
    bottom: 110px;
    transform: translateX(-50%);
    z-index: 20;
    pointer-events: none;
  }
  .tb-envelope.rising {
    animation: tb-env-rise 0.75s cubic-bezier(0.22,1,0.36,1) forwards;
  }
  .tb-envelope.falling {
    animation: tb-env-fall 0.55s cubic-bezier(0.55,0,1,0.45) forwards;
  }
  @keyframes tb-env-rise {
    from { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
    to   { transform: translateX(-50%) translateY(-76px) scale(0.7); opacity: 1; }
  }
  @keyframes tb-env-fall {
    from { transform: translateX(-50%) translateY(-76px) scale(0.7); opacity: 1; }
    to   { transform: translateX(-50%) translateY(-8px)  scale(0.18); opacity: 0; }
  }

  /* ── box outer wrapper (for shake/fade transforms) ── */
  .tb-box {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .tb-box.shaking {
    animation: tb-shake 0.85s ease-in-out;
  }
  .tb-box.fading {
    animation: tb-fade-out 1s ease-in forwards;
  }
  @keyframes tb-shake {
    0%,100% { transform: translateX(-50%) rotate(0deg); }
    10%  { transform: translateX(calc(-50% - 9px)) rotate(-2.5deg); }
    22%  { transform: translateX(calc(-50% + 9px)) rotate( 2.5deg); }
    34%  { transform: translateX(calc(-50% - 7px)) rotate(-1.8deg); }
    46%  { transform: translateX(calc(-50% + 7px)) rotate( 1.8deg); }
    58%  { transform: translateX(calc(-50% - 4px)) rotate(-1deg); }
    70%  { transform: translateX(calc(-50% + 4px)) rotate( 1deg); }
    84%  { transform: translateX(calc(-50% - 2px)) rotate(-0.4deg); }
  }
  @keyframes tb-fade-out {
    0%   { opacity: 1; transform: translateX(-50%) scale(1);    filter: brightness(1.6) saturate(2.2); }
    35%  { opacity: 0.85;                                        filter: brightness(2.3) saturate(2.8); }
    100% { opacity: 0; transform: translateX(-50%) scale(0.5) translateY(12px); filter: brightness(1); }
  }

  /* ── amber glow (release fate) ── */
  .tb-glow {
    position: absolute;
    inset: -14px;
    border-radius: 14px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .tb-glow.active {
    opacity: 1;
    animation: tb-amber-pulse 0.6s ease-in-out infinite alternate;
  }
  @keyframes tb-amber-pulse {
    from { box-shadow: 0 0 18px 6px rgba(251,146,60,0.45); }
    to   { box-shadow: 0 0 40px 18px rgba(251,146,60,0.65); }
  }

  /* ── perspective wrapper for lid ── */
  .tb-lid-persp {
    perspective: 560px;
    perspective-origin: center bottom;
    width: 176px;
    position: relative;
    z-index: 2;
  }

  /* ── lid ── */
  .tb-lid {
    width: 176px;
    height: 46px;
    background: linear-gradient(175deg, #C49060 0%, #A87848 30%, #8B5E3C 70%, #7A5030 100%);
    border-radius: 6px 6px 2px 2px;
    position: relative;
    transform-origin: bottom center;
  }
  .tb-lid.opening {
    animation: tb-lid-open 0.65s cubic-bezier(0.34,1.2,0.64,1) forwards;
  }
  .tb-lid.closing {
    animation: tb-lid-close 0.72s cubic-bezier(0.45,0,0.55,1) forwards;
  }
  @keyframes tb-lid-open {
    from { transform: rotateX(0deg); }
    to   { transform: rotateX(-116deg); }
  }
  @keyframes tb-lid-close {
    from { transform: rotateX(-116deg); }
    to   { transform: rotateX(0deg); }
  }
  .tb-lid-grain {
    position: absolute; inset: 0;
    background: repeating-linear-gradient(
      90deg,
      transparent, transparent 20px,
      rgba(255,255,255,0.06) 20px, rgba(255,255,255,0.06) 21px
    );
    border-radius: inherit;
  }
  .tb-lid-highlight {
    position: absolute;
    top: 4px; left: 14px; right: 14px;
    height: 4px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0.2) 60%, transparent);
    border-radius: 2px;
  }
  .tb-lid-trim {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, #5C3317, #7A4E2D 50%, #5C3317);
  }

  /* ── box body ── */
  .tb-body {
    width: 160px;
    height: 94px;
    background: linear-gradient(180deg, #8B5E3C 0%, #7A5234 45%, #6B4226 100%);
    border-radius: 0 0 8px 8px;
    position: relative;
    overflow: hidden;
    border: 1.5px solid #5C3317;
    border-top: none;
  }
  .tb-body-grain {
    position: absolute; inset: 0;
    background: repeating-linear-gradient(
      90deg,
      transparent, transparent 22px,
      rgba(0,0,0,0.07) 22px, rgba(0,0,0,0.07) 23px
    );
  }
  .tb-body-shade {
    position: absolute; inset: 0;
    background: linear-gradient(
      90deg,
      rgba(0,0,0,0.18) 0%, transparent 22%,
      transparent 78%, rgba(0,0,0,0.18) 100%
    );
  }
  .tb-body-top-edge {
    position: absolute; top: 0; left: 0; right: 0;
    height: 3px;
    background: rgba(0,0,0,0.22);
  }

  /* ── gold latch ── */
  .tb-latch {
    position: absolute;
    bottom: 10px; left: 50%;
    transform: translateX(-50%);
    width: 22px; height: 30px;
    background: linear-gradient(170deg, #FFE066 0%, #DAA520 40%, #9A7000 100%);
    border-radius: 3px 3px 5px 5px;
    border: 1px solid #7A5C00;
    box-shadow:
      0 2px 6px rgba(0,0,0,0.45),
      inset 0 1px 0 rgba(255,255,255,0.35),
      inset 0 -1px 0 rgba(0,0,0,0.2);
  }
  .tb-keyhole-circle {
    position: absolute;
    top: 6px; left: 50%;
    transform: translateX(-50%);
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #3A2800;
  }
  .tb-keyhole-stem {
    position: absolute;
    top: 11px; left: 50%;
    transform: translateX(-50%);
    width: 4px; height: 7px;
    background: #3A2800;
    border-radius: 0 0 3px 3px;
  }

  /* ── hinges ── */
  .tb-hinge {
    position: absolute; top: 5px;
    width: 10px; height: 10px;
    background: radial-gradient(circle at 35% 35%, #FFE566, #C49A00 60%, #8B6A00 100%);
    border-radius: 50%;
    border: 1px solid #7A5C00;
    box-shadow: 0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3);
  }
  .tb-hinge.left  { left:  10px; }
  .tb-hinge.right { right: 10px; }

  /* ── ground shadow ── */
  .tb-shadow {
    width: 148px; height: 14px;
    background: radial-gradient(ellipse, rgba(0,0,0,0.28) 0%, transparent 68%);
    margin-top: 4px;
  }

  /* ── sealed sparkles ── */
  .tb-spark {
    position: absolute;
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #FFD700;
    bottom: 22px; left: calc(50% - 2.5px);
    opacity: 0;
    pointer-events: none;
    animation: tb-spark-out 0.75s ease-out forwards;
  }
  @keyframes tb-spark-out {
    0%   { opacity: 1; transform: translate(0, 0) scale(1.2); }
    60%  { opacity: 0.9; }
    100% { opacity: 0; transform: var(--spark-to) scale(0); }
  }
`;

const SPARK_DIRS = [
  "translate(-30px, -32px)",
  "translate(-8px, -42px)",
  "translate(16px, -38px)",
  "translate(32px, -20px)",
  "translate(28px,  10px)",
  "translate(-26px, 8px)",
];

function Envelope() {
  return (
    <svg width="44" height="34" viewBox="0 0 44 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.75" y="0.75" width="42.5" height="32.5" rx="3.25" fill="#FAF0DC" stroke="#C9A97A" strokeWidth="1.5" />
      <path d="M1 3L22 20L43 3" stroke="#C9A97A" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <path d="M1 33L15 17.5" stroke="#C9A97A" strokeWidth="1" fill="none" />
      <path d="M43 33L29 17.5" stroke="#C9A97A" strokeWidth="1" fill="none" />
    </svg>
  );
}

export function TreasureBox({ fate, triggered }: TreasureBoxProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [sparks, setSparks] = useState(false);

  useEffect(() => {
    if (!triggered) {
      setPhase("idle");
      setSparks(false);
      return;
    }

    if (fate === "release") {
      setPhase("shaking");
      const t1 = setTimeout(() => setPhase("fading"), 900);
      const t2 = setTimeout(() => setPhase("gone"), 1950);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else {
      setPhase("opening");
      const t1 = setTimeout(() => setPhase("catching"), 750);
      const t2 = setTimeout(() => setPhase("closing"), 1350);
      const t3 = setTimeout(() => { setPhase("sealed"); setSparks(true); }, 2150);
      const t4 = setTimeout(() => setSparks(false), 3200);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }
  }, [triggered]);

  if (phase === "gone") return null;

  const lidOpen    = phase === "opening" || phase === "catching";
  const lidClosing = phase === "closing"  || phase === "sealed";
  const showEnv    = phase === "opening"  || phase === "catching";
  const envFalling = phase === "catching";
  const isGlowing  = phase === "shaking"  || phase === "fading";
  const isShaking  = phase === "shaking";
  const isFading   = phase === "fading";

  const boxClass  = ["tb-box",  isShaking ? "shaking" : "", isFading ? "fading" : ""].filter(Boolean).join(" ");
  const lidClass  = ["tb-lid",  lidOpen ? "opening" : "", lidClosing ? "closing" : ""].filter(Boolean).join(" ");
  const glowClass = ["tb-glow", isGlowing ? "active" : ""].filter(Boolean).join(" ");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="tb-wrapper">
        {/* Floating envelope */}
        {showEnv && (
          <div className={`tb-envelope ${envFalling ? "falling" : "rising"}`}>
            <Envelope />
          </div>
        )}

        {/* Box group */}
        <div className={boxClass}>
          {/* Amber glow overlay */}
          <div className={glowClass} />

          {/* Lid (inside perspective parent) */}
          <div className="tb-lid-persp">
            <div className={lidClass}>
              <div className="tb-lid-grain" />
              <div className="tb-lid-highlight" />
              <div className="tb-lid-trim" />
            </div>
          </div>

          {/* Body */}
          <div
            className="tb-body"
            style={isGlowing ? { boxShadow: "0 8px 24px rgba(0,0,0,0.4)" } : undefined}
          >
            <div className="tb-body-grain" />
            <div className="tb-body-shade" />
            <div className="tb-body-top-edge" />

            <div className="tb-latch">
              <div className="tb-keyhole-circle" />
              <div className="tb-keyhole-stem" />
            </div>
            <div className="tb-hinge left" />
            <div className="tb-hinge right" />

            {/* Sparkles on sealed */}
            {sparks && SPARK_DIRS.map((dir, i) => (
              <div
                key={i}
                className="tb-spark"
                style={{
                  "--spark-to": dir,
                  animationDelay: `${i * 60}ms`,
                } as React.CSSProperties}
              />
            ))}
          </div>

          <div className="tb-shadow" />
        </div>
      </div>
    </>
  );
}
