// FloatingScore testing utilities - separated from main component for cleaner code
import type { FloatingScoreItem } from "../components/FloatingScore";
import { createFloatingScore } from "../components/FloatingScore";

// Testing function to display all score types on screen for tinkering
export const testAllScoreTypes = (): FloatingScoreItem[] => {
  const testScores: FloatingScoreItem[] = [
    // Subtle score (<100)
    createFloatingScore(50, { x: 15, y: 30 }),
    // Basic score (100-249)
    createFloatingScore(150, { x: 30, y: 30 }),
    // Good score (250-499)
    createFloatingScore(350, { x: 45, y: 30 }),
    // Great score (500-999)
    createFloatingScore(750, { x: 60, y: 30 }),
    // Epic score (1000+)
    createFloatingScore(1500, { x: 75, y: 30 }),
  ];

  return testScores;
};

// Browser console testing setup (dev only)
if (typeof window !== "undefined" && import.meta.env.DEV) {
  // Helper function to get score category for testing
  const getScoreCategory = (points: number): string => {
    if (points >= 1000) return "Epic";
    if (points >= 500) return "Great";
    if (points >= 250) return "Good";
    if (points >= 100) return "Basic";
    return "Subtle";
  };

  // Simple static display mode for visual testing
  (window as any).showStaticFloatingScores = () => {
    console.log("Creating static floating score display...");

    // Remove existing container
    const existingContainer = document.getElementById("static-floating-test");
    if (existingContainer) {
      existingContainer.remove();
    }

    // Create a container div with sample scores
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
      height: 200px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      border: 2px dashed #ccc;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      font-family: 'Bungee', Arial, sans-serif;
    `;
    
    // Add sample score elements
    const scores = [
      { points: 50, label: "Subtle", color: "#e0e0e0" },
      { points: 150, label: "Basic", color: "#4fc3f7" },
      { points: 350, label: "Good", color: "#66bb6a" },
      { points: 750, label: "Great", color: "#ff7043" },
      { points: 1500, label: "Epic", color: "#e91e63" },
    ];

    scores.forEach((score) => {
      const scoreDiv = document.createElement("div");
      scoreDiv.style.cssText = `
        text-align: center;
        animation: bounce 2s ease-in-out infinite;
      `;
      
      // Determine font size based on score category
      let fontSize = "1rem";
      if (score.points >= 1000) fontSize = "2rem";
      else if (score.points >= 500) fontSize = "1.8rem";
      else if (score.points >= 250) fontSize = "1.5rem";
      else if (score.points >= 100) fontSize = "1.3rem";
      
      const pointsSpan = document.createElement("span");
      pointsSpan.textContent = `+${score.points}`;
      pointsSpan.style.cssText = `
        display: block;
        font-size: ${fontSize};
        color: ${score.color};
        text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        margin-bottom: 4px;
      `;
      
      const labelSpan = document.createElement("span");
      labelSpan.textContent = score.label;
      labelSpan.style.cssText = `
        display: block;
        font-size: 0.8rem;
        color: #ccc;
      `;
      
      scoreDiv.appendChild(pointsSpan);
      scoreDiv.appendChild(labelSpan);
      container.appendChild(scoreDiv);
    });

    // Add bounce animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes bounce {
        0%, 100% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-10px) scale(1.1); }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(container);

    console.log("Static floating scores displayed! Click anywhere to remove.");

    // Remove on click
    const removeHandler = () => {
      container.remove();
      style.remove();
      document.removeEventListener("click", removeHandler);
      console.log("Static floating scores removed.");
    };

    setTimeout(() => {
      document.addEventListener("click", removeHandler);
    }, 100);

    return "Static display created successfully!";
  };

  // Quick test function
  (window as any).testFloatingScores = () => {
    console.log("Available test functions:");
    console.log("- showStaticFloatingScores(): Display static test scores");
    console.log("- testAllScoreTypes(): Get test score data array");
    
    return {
      showStaticFloatingScores: (window as any).showStaticFloatingScores,
      testScores: testAllScoreTypes(),
      getScoreCategory,
    };
  };

  // Auto-expose on load
  console.log("FloatingScore test utilities loaded. Run testFloatingScores() for help.");
}

// Export the testing function for use in other files
export { testAllScoreTypes as default };
