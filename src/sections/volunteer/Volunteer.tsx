import { volunteer } from "../../data/volunteer";
import { Reveal } from "../../components/ui/Reveal";
import styles from "./Volunteer.module.css";

export function Volunteer() {
  return (
    <section
      id="volunteer"
      className={styles.volunteer}
      aria-labelledby="volunteer-heading"
    >
      <div className="container">
        <h2 id="volunteer-heading" className="visually-hidden">
          Volunteer Work
        </h2>
        {volunteer.map((entry) => (
          <Reveal key={entry.id} className={styles.row} as="div">
            <span className={styles.label}>
              07
              <br />
              Volunteer
            </span>
            <div className={styles.body}>
              <p className={styles.role}>
                {entry.role} — {entry.organization}
              </p>
              <p className={styles.description}>{entry.description}</p>
            </div>
            <div className={styles.meta}>
              {entry.image ? (
                <button
                  type="button"
                  className={`${styles.photoTrigger} cursor-target`}
                  aria-label={`Show a photo from ${entry.organization}`}
                >
                  <img
                    className={styles.photoThumb}
                    src={entry.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                  />
                  <span className={styles.photoPreview}>
                    <img src={entry.image} alt={entry.imageAlt ?? ""} loading="lazy" />
                  </span>
                </button>
              ) : null}
              <span>{entry.date}</span>
              <span>{entry.location}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
