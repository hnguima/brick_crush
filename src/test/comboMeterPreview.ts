// ComboMeter Preview Test - Showcase all combo meter styles
// Usage: Open browser console and call showComboMeterPreview()

import React from "react";
import { createRoot } from "react-dom/client";
import { Box, Typography } from "@mui/material";
import { ComboMeter } from "../components/ComboMeter";

// Combo showcase data with different values to trigger different styles
const COMBO_SHOWCASE = [
  { combo: 2, label: "Default (2x)", isMaxCombo: false },
  { combo: 5, label: "Default (5x)", isMaxCombo: false },
  { combo: 10, label: "Hot (10x)", isMaxCombo: false },
  { combo: 15, label: "Hot (15x)", isMaxCombo: false },
  { combo: 20, label: "Fire (20x)", isMaxCombo: false },
  { combo: 24, label: "Fire (24x)", isMaxCombo: false },
  { combo: 25, label: "Max (25x)", isMaxCombo: true },
] as const;

// Function to show combo meter preview
const showComboMeterPreview = () => {
  console.log("Creating combo meter preview showcase...");

  // Remove existing container if it exists
  const existingContainer = document.getElementById("combo-meter-preview");
  if (existingContainer) {
    existingContainer.remove();
  }

  // Create container div
  const container = document.createElement("div");
  container.id = "combo-meter-preview";
  container.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
    pointer-events: none;
    width: 800px;
    height: 600px;
    background: rgba(0, 0, 0, 0.1);
    border: 2px dashed #ccc;
    border-radius: 12px;
    padding: 20px;
  `;
  document.body.appendChild(container);

  // Create the showcase component
  const ComboShowcase = () => {
    return React.createElement(
      Box,
      {
        sx: {
          position: "relative",
          width: "100%",
          height: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: 4,
          padding: 2,
        },
      },
      [
        // Title
        React.createElement(
          Typography,
          {
            key: "title",
            variant: "h4",
            sx: {
              gridColumn: "1 / -1",
              textAlign: "center",
              marginBottom: 2,
              color: "#333",
              fontWeight: "bold",
            },
          },
          "Combo Meter Showcase"
        ),
        // Generate combo meters
        ...COMBO_SHOWCASE.map((item) => {
          return React.createElement(
            Box,
            {
              key: item.combo,
              sx: {
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                padding: 2,
                border: "1px solid #ddd",
                borderRadius: 2,
                backgroundColor: "#f9f9f9",
              },
            },
            [
              // Label
              React.createElement(
                Typography,
                {
                  key: "label",
                  variant: "caption",
                  sx: {
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    color: "#666",
                    textAlign: "center",
                  },
                },
                item.label
              ),
              // Container for combo meter (needs relative positioning)
              React.createElement(
                Box,
                {
                  key: "meter-container",
                  sx: {
                    position: "relative",
                    width: "80px",
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                },
                // The actual ComboMeter component
                React.createElement(ComboMeter, {
                  combo: item.combo,
                  isMaxCombo: item.isMaxCombo,
                  sx: {
                    position: "relative",
                    bottom: "unset",
                    right: "unset",
                  },
                })
              ),
            ]
          );
        }),
      ]
    );
  };

  // Render the showcase
  const root = createRoot(container);
  root.render(React.createElement(ComboShowcase));

  console.log("Combo meter preview displayed! Click anywhere to remove.");

  // Remove on click
  const removeHandler = () => {
    root.unmount();
    container.remove();
    document.removeEventListener("click", removeHandler);
    console.log("Combo meter preview removed.");
  };

  setTimeout(() => {
    document.addEventListener("click", removeHandler);
  }, 100);

  return "Combo meter showcase created successfully!";
};

// Expose to window for console access (dev only)
if (typeof window !== "undefined" && import.meta.env.DEV) {
  (window as any).showComboMeterPreview = showComboMeterPreview;

  console.log(
    "Combo meter preview loaded! Use showComboMeterPreview() in console to display."
  );
}

export { showComboMeterPreview };
