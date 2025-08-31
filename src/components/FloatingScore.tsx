// FloatingScore component: Shows animated score numbers floating up from board
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

export interface FloatingScoreItem {
  id: string;
  points: number;
  x: number; // Position relative to board container (0-100%)
  y: number; // Position relative to board container (0-100%)
  timestamp: number;
}

interface FloatingScoreProps {
  scores: FloatingScoreItem[];
  onScoreComplete?: (id: string) => void;
}

// Defined sx objects for each score category
const baseScoreSx = {
  fontFamily: "'Bungee', 'Arial Black', sans-serif", // Use Bungee font with fallbacks
  fontWeight: "normal", // Bungee is already bold by design
  textShadow: "2px 2px 4px rgba(0,0,0,0.5)", // Strong shadow for visibility
};

const singleLineScoreSx = {
  ...baseScoreSx,
  color: "#ff3c1eff", // Green for single line (+100)
  WebkitTextStroke: "1px white", // White border using text-stroke instead of text-shadow
  fontSize: "1.5rem",
};

const multiLineScoreSx = {
  ...baseScoreSx,
  background:
    "linear-gradient(90deg, #00ff0dff 0%, #b1ffa7ff 50%, #00ac34ff 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  WebkitTextStroke: "1px white", // White border using text-stroke instead of text-shadow
  textShadow: "0 0 16px #00ff0dff", // Keep only the golden glow
  fontSize: "2.5rem",
};

const dramaticScoreSx = {
  ...baseScoreSx,
  // Golden gradient for dramatic scores (+300+)
  background: "linear-gradient(90deg, #ffd700 0%, #ffffffff 50%, #ffb300 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  WebkitTextStroke: "2px white", // White border using text-stroke instead of text-shadow
  textShadow: "0 0 25px #fede2bff", // Keep only the golden glow
  fontSize: "4rem",
};

// Helper function to get appropriate sx object based on score
const getScoreSx = (points: number) => {
  if (points >= 300) return dramaticScoreSx;
  if (points >= 200) return multiLineScoreSx;
  return singleLineScoreSx;
};

export const FloatingScore: React.FC<FloatingScoreProps> = ({
  scores,
  onScoreComplete,
}) => {
  const [activeScores, setActiveScores] = useState<FloatingScoreItem[]>([]);

  // Helper function to remove score by id
  const removeScoreById = (scoreId: string) => {
    setActiveScores((prev) => prev.filter((s) => s.id !== scoreId));
    onScoreComplete?.(scoreId);
  };

  // Update active scores when new scores are added
  useEffect(() => {
    const existingIds = new Set(activeScores.map((s) => s.id));
    const newScores = scores.filter((score) => !existingIds.has(score.id));
    if (newScores.length > 0) {
      setActiveScores((prev) => [...prev, ...newScores]);
    }
  }, [scores, activeScores]);

  // Remove scores after animation completes
  useEffect(() => {
    if (activeScores.length === 0) return;

    const timers: NodeJS.Timeout[] = [];

    activeScores.forEach((score) => {
      const timer = setTimeout(() => removeScoreById(score.id), 1500);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [activeScores]);

  if (activeScores.length === 0) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // Don't interfere with board interactions
        zIndex: 1000, // Above board but below dialogs
      }}
    >
      {activeScores.map((score) => (
        <Box
          key={score.id}
          sx={{
            position: "absolute",
            left: `${score.x}%`,
            top: `${score.y}%`,
            // Transform to center the text on the position
            transform: "translate(-50%, -50%)",
            // Floating animation - rises up and fades out with snappy easing
            animation:
              "float-score 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
            "@keyframes float-score": {
              "0%": {
                opacity: 1,
                transform: "translate(-50%, -50%) scale(0)",
              },
              "15%": {
                opacity: 1,
                transform: "translate(-50%, -55%) scale(1.8)", // Quick pop up
              },
              "30%": {
                opacity: 1,
                transform: "translate(-50%, -60%) scale(1.5)", // Settle to readable size
              },
              "70%": {
                opacity: 1,
                transform: "translate(-50%, -80%) scale(1.5)", // Slow drift up
              },
              "100%": {
                opacity: 0,
                transform: "translate(-50%, -100%) scale(0.5)", // Fade and shrink
              },
            },
          }}
        >
          <Typography variant="h6" sx={getScoreSx(score.points)}>
            +{score.points}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

// Utility function to generate random positions on the board
export const generateRandomBoardPosition = () => ({
  x: 20 + Math.random() * 60, // 20%-80% to avoid edges
  y: 30 + Math.random() * 40, // 30%-70% to stay in visible board area
});

// Utility function to create a new floating score item
export const createFloatingScore = (
  points: number,
  position?: { x: number; y: number }
): FloatingScoreItem => ({
  id: `score-${Date.now()}-${Math.random()}`,
  points,
  ...(position || generateRandomBoardPosition()),
  timestamp: Date.now(),
});

// Testing function to display all three score types on screen for tinkering
export const testAllScoreTypes = () => {
  const testScores: FloatingScoreItem[] = [
    // Single line score (green)
    createFloatingScore(100, { x: 25, y: 40 }),
    // Multi-line score (orange with border)
    createFloatingScore(200, { x: 50, y: 40 }),
    // Dramatic score (orange with glow)
    createFloatingScore(300, { x: 75, y: 40 }),
  ];

  return testScores;
};

// Expose testing function to window for browser console access (dev only)
if (typeof window !== "undefined" && import.meta.env.DEV) {
  // Expose the sx objects directly so they can be modified in browser console
  (window as any).singleLineScoreSx = singleLineScoreSx;
  (window as any).multiLineScoreSx = multiLineScoreSx;
  (window as any).dramaticScoreSx = dramaticScoreSx;

  // Helper function to get the current sx (checks window objects first)
  const getCurrentScoreSx = (points: number) => {
    const windowSingle = (window as any).singleLineScoreSx;
    const windowMulti = (window as any).multiLineScoreSx;
    const windowDramatic = (window as any).dramaticScoreSx;

    if (points >= 300) return windowDramatic || dramaticScoreSx;
    if (points >= 200) return windowMulti || multiLineScoreSx;
    return windowSingle || singleLineScoreSx;
  };

  // Simple static display mode for visual testing using actual sx objects
  (window as any).showStaticFloatingScores = () => {
    console.log("Creating static floating score display...");

    // Remove existing container
    const existingContainer = document.getElementById("static-floating-test");
    if (existingContainer) {
      existingContainer.remove();
    }

    // Create a container div
    const container = document.createElement("div");
    container.id = "static-floating-test";
    container.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10000;
      pointer-events: none;
      width: 600px;
      height: 400px;
      background: rgba(0,0,0,0.1);
      border: 2px dashed #ccc;
      border-radius: 8px;
    `;
    document.body.appendChild(container);

    // Create Typography elements directly using the sx objects
    const scores = [
      { points: 100, x: 25, y: 30, label: "Single Line" },
      { points: 200, x: 50, y: 30, label: "Multi-Line" },
      { points: 300, x: 75, y: 30, label: "Dramatic" },
    ];

    // Import what we need for React rendering
    import("react").then((React) => {
      import("react-dom/client").then(({ createRoot }) => {
        import("@mui/material").then(({ Typography, Box }) => {
          const TestDisplay = () => {
            return React.createElement(
              Box,
              {
                sx: { position: "relative", width: "100%", height: "100%" },
              },
              scores.map((score) => {
                return React.createElement(
                  Box,
                  {
                    key: score.points,
                    sx: {
                      position: "absolute",
                      left: `${score.x}%`,
                      top: `${score.y}%`,
                      transform: "translate(-50%, -50%)",
                      animation: "float-score-static 2s ease-in-out infinite",
                    },
                  },
                  [
                    // Use Typography with the actual sx object (checks window first for live editing)
                    React.createElement(
                      Typography,
                      {
                        key: "score",
                        variant: "h6",
                        sx: getCurrentScoreSx(score.points), // Use the dynamic version
                      },
                      `+${score.points}`
                    ),
                    // Label
                    React.createElement(
                      Typography,
                      {
                        key: "label",
                        variant: "caption",
                        sx: {
                          fontSize: "0.8rem",
                          color: "#666",
                          textAlign: "center",
                          marginTop: "8px",
                          textShadow: "none",
                          WebkitTextFillColor: "unset",
                          background: "unset",
                        },
                      },
                      score.label
                    ),
                  ]
                );
              })
            );
          };

          // Add animation keyframes
          const style = document.createElement("style");
          style.textContent = `
          @keyframes float-score-static {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -60%) scale(1.1); }
          }
        `;
          document.head.appendChild(style);

          // Render the component
          const root = createRoot(container);
          root.render(React.createElement(TestDisplay));

          console.log(
            "Static floating scores displayed! Click anywhere to remove."
          );

          // Remove on click
          const removeHandler = () => {
            root.unmount();
            container.remove();
            document.removeEventListener("click", removeHandler);
            console.log("Static floating scores removed.");
          };

          setTimeout(() => {
            document.addEventListener("click", removeHandler);
          }, 100);
        });
      });
    });

    return "Static display created successfully!";
  };

  // Auto-refresh the static display every second during development
  let refreshInterval: NodeJS.Timeout | null = null;
  (window as any).startAutoRefresh = () => {
    if (refreshInterval) clearInterval(refreshInterval);

    refreshInterval = setInterval(() => {
      // Only refresh if the static display is currently visible
      if (document.getElementById("static-floating-test")) {
        (window as any).showStaticFloatingScores();
      }
    }, 1000);

    console.log(
      "Auto-refresh started - static display will update every second"
    );
  };

  (window as any).stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
      console.log("Auto-refresh stopped");
    }
  };
}
