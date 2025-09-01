import { useEffect } from "react";
import { tsParticles } from "@tsparticles/engine";
import { loadLinksPreset } from "@tsparticles/preset-links";

export function ParticleBackground() {
  useEffect(() => {
    const initParticles = async () => {
      await loadLinksPreset(tsParticles);

      await tsParticles.load({
        id: "tsparticles",
        options: {
          preset: "links",
          fullScreen: {
            enable: false,
          },
          style: {
            width: "120%",
            height: "120%",
            top: "-10%",
            left: "-10%",
            position: "absolute",
          },
          background: {
            color: "transparent",
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#3352fdff",
              distance: 250,
              enable: true,
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 0.3,
            },
            number: {
              value: 50,
            },
            opacity: {
              value: 0.1,
            },
            size: {
              value: 1,
            },
          },
          detectRetina: true,
        },
      });
    };

    initParticles();
  }, []);

  return (
    <div
      id="tsparticles"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
