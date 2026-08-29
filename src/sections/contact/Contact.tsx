import { contactChannels } from "../../data/contact";
import { Reveal } from "../../components/ui/Reveal";
import { MagneticButton } from "../../components/ui/MagneticButton";
import { SideRays } from "../../components/effects/SideRays";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import styles from "./Contact.module.css";

export function Contact() {
  const email = contactChannels.find((c) => c.id === "email");
  const reducedMotion = useReducedMotion();

  return (
    <section id="contact" className={styles.contact} data-dark aria-labelledby="contact-heading">
      <div className={styles.glow} aria-hidden="true" />
      {!reducedMotion ? (
        <div className={styles.raysLayer} aria-hidden="true">
          <SideRays
            speed={1.4}
            rayColor1="#EAB308"
            rayColor2="#96c8ff"
            intensity={1.1}
            spread={1.8}
            origin="top-right"
            saturation={1.0}
            blend={0.72}
            falloff={1.9}
            opacity={0.5}
          />
        </div>
      ) : null}
      <div className={`container ${styles.container}`}>
        <Reveal variant="fade">
          <div className={styles.eyebrowRow}>
            <span className={styles.index}>09</span>
            <span className="eyebrow eyebrow--on-dark">Contact</span>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h2 id="contact-heading" className={styles.headline}>
            LET'S BUILD SOMETHING.
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <p className={styles.sub}>Have an idea, project, or problem worth solving?</p>
        </Reveal>

        <Reveal delay={200}>
          <div className={styles.ctaRow}>
            {email ? (
              <MagneticButton className="cursor-target" href={email.href} variant="solid">
                Say Hello
              </MagneticButton>
            ) : null}
            <MagneticButton
              className="cursor-target"
              href="/Hansel-Kristanzen-CV.pdf"
              download="Hansel-Kristanzen-CV.pdf"
              variant="outline"
              showArrow={false}
            >
              View CV
            </MagneticButton>
          </div>
        </Reveal>

        <div className={styles.channels}>
          {contactChannels.map((channel, i) => (
            <Reveal key={channel.id} delay={260 + i * 50}>
              <a
                href={channel.href}
                className={`${styles.channel} cursor-target`}
                target={channel.external ? "_blank" : undefined}
                rel={channel.external ? "noreferrer noopener" : undefined}
              >
                <span className={styles.channelLabel}>{channel.label}</span>
                <span className={styles.channelValue}>{channel.value}</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
