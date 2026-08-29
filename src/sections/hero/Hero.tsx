import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from "react";
import { MagneticButton } from "../../components/ui/MagneticButton";
import { LatticeFallback } from "../../components/three/LatticeFallback";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { useSmoothScroll } from "../../lib/SmoothScrollContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { gsap } from "../../lib/gsap";
import styles from "./Hero.module.css";

const HeroCanvas = lazy(() =>
  import("../../components/three/HeroCanvas").then((mod) => ({ default: mod.HeroCanvas }))
);

interface HeroProps {
  ready: boolean;
}

const EASTER_EGG_CLICKS = 5;
const EASTER_EGG_WINDOW_MS = 2600;

export function Hero({ ready }: HeroProps) {
  const { ref: sectionRef, progress } = useScrollProgress<HTMLElement>();
  const { scrollTo } = useSmoothScroll();
  const reducedMotion = useReducedMotion();

  const rootRef = useRef<HTMLElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const clickTimestamps = useRef<number[]>([]);
  const [easterEggVisible, setEasterEggVisible] = useState(false);

  const setSectionRefs = (node: HTMLElement | null) => {
    sectionRef.current = node;
    rootRef.current = node;
  };

  useEffect(() => {
    if (!ready || reducedMotion) return;

    // TASK 1 root cause: this timeline used to run inside a plain
    // useEffect. Under React 19 StrictMode (dev only) effects mount →
    // cleanup → mount, and while `tl.kill()` on cleanup does stop the
    // timeline, it doesn't itself guarantee the *second* mount starts from
    // a clean slate if a webfont swap (FOUT) reflows the text mid-animation
    // — the transform GSAP already applied was computed against the
    // fallback font's metrics, so when "General Sans" swaps in the glyphs
    // land in a visibly different place for a frame, reading as duplicated
    // text. Two fixes, both applied here:
    //   1. `gsap.context()` scopes every tween this effect creates to
    //      `rootRef`, so `ctx.revert()` on cleanup guarantees a full,
    //      idempotent teardown no matter how many times StrictMode
    //      mounts/unmounts this effect — no orphaned tweens, no leftover
    //      inline styles carried into the next mount.
    //   2. The entrance timeline only starts once `document.fonts.ready`
    //      resolves, so the very first frame we animate is already laid
    //      out with the final webfont — nothing reflows underneath the
    //      animation while it's running.
    let cancelled = false;
    let ctx: gsap.Context | undefined;

    const play = () => {
      if (cancelled || !rootRef.current) return;

      ctx = gsap.context(() => {
        const targets = [
          metaRef.current,
          line1Ref.current,
          line2Ref.current,
          roleRef.current,
          statementRef.current,
          ctaRef.current,
          scrollHintRef.current,
        ].filter(Boolean);

        gsap.set(targets, { opacity: 0 });
        gsap.set([line1Ref.current, line2Ref.current], { yPercent: 110 });
        gsap.set(
          [metaRef.current, roleRef.current, statementRef.current, ctaRef.current, scrollHintRef.current],
          { y: 16 }
        );

        const tl = gsap.timeline({ defaults: { ease: "cubic-bezier(0.16,1,0.3,1)" } });
        tl.to(metaRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.05)
          .to(line1Ref.current, { opacity: 1, yPercent: 0, duration: 0.9 }, 0.15)
          .to(line2Ref.current, { opacity: 1, yPercent: 0, duration: 0.9 }, 0.28)
          .to(roleRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.55)
          .to(statementRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.65)
          .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.8)
          .to(scrollHintRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.95);
      }, rootRef);
    };

    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(play).catch(play);
    } else {
      play();
    }

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [ready, reducedMotion]);

  const handleEasterEggClick = () => {
    const now = Date.now();
    clickTimestamps.current = [...clickTimestamps.current, now].filter(
      (ts) => now - ts < EASTER_EGG_WINDOW_MS
    );
    if (clickTimestamps.current.length >= EASTER_EGG_CLICKS) {
      clickTimestamps.current = [];
      setEasterEggVisible(true);
      window.setTimeout(() => setEasterEggVisible(false), 3200);
    }
  };

  const parallaxStyle = { "--scroll-progress": progress } as CSSProperties;

  return (
    <section
      id="home"
      ref={setSectionRefs}
      className={styles.hero}
      data-dark
      aria-label="Introduction"
      style={parallaxStyle}
    >
      <div className={styles.canvasLayer} onClick={handleEasterEggClick}>
        <Suspense fallback={<LatticeFallback />}>
          <HeroCanvas />
        </Suspense>
      </div>
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.grid}>
        <div className={styles.meta} ref={metaRef}>
          <span className={styles.metaLeft}>JKT / 2026</span>
          <span className={styles.metaRight}>
            PORTFOLIO
            <br />
            VOL. 01
          </span>
        </div>

        <div className={styles.headlineBlock}>
          <h1 className={styles.headline} aria-label="Hansel Kristanzen">
            <span className={styles.headlineLine} aria-hidden="true">
              <span ref={line1Ref}>HANSEL</span>
            </span>
            <span className={styles.headlineLine} aria-hidden="true">
              <span ref={line2Ref}>KRISTANZEN</span>
            </span>
          </h1>
        </div>

        <div className={styles.supportRow}>
          <p className={styles.role} ref={roleRef}>
            Computer Science Student &amp; Designer
          </p>
          <p className={styles.statement} ref={statementRef}>
            Exploring how technology can solve real-world problems.
          </p>
        </div>

        <div className={styles.ctaRow} ref={ctaRef}>
          <MagneticButton
            className="cursor-target"
            variant="solid"
            onClick={() => scrollTo("#work", { offset: -24 })}
          >
            View Work
          </MagneticButton>
          <MagneticButton
            className="cursor-target"
            variant="outline"
            onClick={() => scrollTo("#contact", { offset: -24 })}
          >
            Get In Touch
          </MagneticButton>
        </div>

        <div className={styles.scrollHint} ref={scrollHintRef}>
          <span>Scroll to explore</span>
          <span className={styles.scrollHintArrow} aria-hidden="true">
            ↓
          </span>
        </div>
      </div>

      <p className={styles.easterEgg} data-visible={easterEggVisible} aria-live="polite">
        {easterEggVisible ? "Never settle." : ""}
      </p>
    </section>
  );
}
