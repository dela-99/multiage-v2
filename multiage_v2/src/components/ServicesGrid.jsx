import { useNavigate } from "../router";
import { SectionLabel, SectionHeading } from "./ui";
import { useTheme } from "../context/ThemeContext";

const STUDIO_IMAGES = [
  {
    id: 1,
    src: "https://res.cloudinary.com/delaridge/image/upload/v1777342424/huxsnefbhz6ucsunms7e.jpg",
    alt: "Multiage Studios image 1",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/delaridge/image/upload/v1777342424/zzp3yuk7bzrq5fuwlwnz.jpg",
    alt: "Multiage Studios image 2",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/delaridge/image/upload/v1777342423/qyh0beu7f5t6gbh8r6kt.jpg",
    alt: "Multiage Studios image 3",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/delaridge/image/upload/v1777342423/bxotbg5mh77obhcyms3h.jpg",
    alt: "Multiage Studios image 4",
  },
];

function StudioTile({ image }) {
  const { t } = useTheme();
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/studio")}
      aria-label="Open Multiage Studios"
      style={{
        display: "block",
        textDecoration: "none",
        width: "100%",
        padding: 0,
        background: "transparent",
        border: "none",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 20,
          background: t.cardBg,
          border: `1px solid ${t.cardBorder}`,
          boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
          transform: "translateZ(0)",
        }}
      >
        <div
          style={{
            aspectRatio: "1 / 1",
            background: "linear-gradient(135deg, rgba(197,98,11,0.12), rgba(255,255,255,0.03))",
          }}
        >
          <img
            src={image.src}
            alt={image.alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 260ms ease",
            }}
            className="studio-gallery-image"
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0) 38%, rgba(0,0,0,0.28) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </button>
  );
}

export default function ServicesGrid() {
  const { t } = useTheme();

  return (
    <section id="services" style={{ padding: "100px 0" }}>
      <style>{`
        .studio-gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .studio-gallery-grid button:hover .studio-gallery-image,
        .studio-gallery-grid button:focus-visible .studio-gallery-image {
          transform: scale(1.05);
        }

        @media (min-width: 900px) {
          .studio-gallery-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 20px;
          }
        }
      `}</style>

      <div style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <SectionLabel>Multiage Studios</SectionLabel>
          <SectionHeading>Creative moments in focus</SectionHeading>
          <p
            style={{
              fontSize: 16,
              color: t.textSecondary,
              marginTop: 16,
              maxWidth: 520,
              margin: "16px auto 0",
              lineHeight: 1.7,
            }}
          >
            Explore the visual side of Multiage through a modern studio gallery built for upcoming video and image contents.
          </p>
        </div>

        <div className="studio-gallery-grid">
          {STUDIO_IMAGES.map((image) => (
            <StudioTile key={image.id} image={image} />
          ))}
        </div>
      </div>
    </section>
  );
}
