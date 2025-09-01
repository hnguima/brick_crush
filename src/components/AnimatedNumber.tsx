// AnimatedNumber component: Animated counting number display
import React, { useState, useEffect, useRef } from "react";
import { Typography, type SxProps, type Theme } from "@mui/material";

interface AnimatedNumberProps {
  value: number;
  duration?: number; // Animation duration in milliseconds
  sx?: SxProps<Theme>;
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body1"
    | "body2"
    | "caption"
    | "overline";
  [key: string]: any; // Allow any other Typography props
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1000,
  sx,
  variant = "h4",
  ...typographyProps
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const previousValueRef = useRef(value);

  useEffect(() => {
    // Only animate if the value actually changed
    if (previousValueRef.current === value) {
      return;
    }

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setIsAnimating(true);
    const startValue = previousValueRef.current;
    const targetValue = value;
    const difference = targetValue - startValue;

    // Reset start time for new animation
    startTimeRef.current = null;

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const currentValue = startValue + difference * easeOut;
      setDisplayValue(Math.round(currentValue));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue);
        setIsAnimating(false);
        previousValueRef.current = targetValue;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <Typography
      variant={variant}
      sx={{
        ...sx,
        // Add slight scale animation during counting for extra visual feedback
        ...(isAnimating && {
          animation: "pulse 0.3s ease-in-out",
          "@keyframes pulse": {
            "0%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.02)" },
            "100%": { transform: "scale(1)" },
          },
        }),
      }}
      {...typographyProps}
    >
      {displayValue.toLocaleString()}
    </Typography>
  );
};
