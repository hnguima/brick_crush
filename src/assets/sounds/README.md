# Sound Assets

This directory contains the audio files used by the game's sound engine.

## Required Sound Files

### Single Sound Effects

- `piece_invalid.wav` - Brief error tone when trying to place a piece in an invalid location
- `line_clear.wav` - Rewarding chime/ding sound when lines are cleared
- `bag_complete.wav` - Celebration sound when all 3 pieces in a bag are placed
- `game_over.wav` - Game over sound effect
- `ui_button.wav` - Generic button click sound for UI interactions

### Sound Variations (Multiple files for variety)

- `piece_place_1.wav` - First variation of piece placement sound
- `piece_place_2.wav` - Second variation of piece placement sound
- `piece_place_3.wav` - Third variation of piece placement sound

The sound engine will randomly select from the available variations each time the effect is played, creating a more dynamic and less repetitive audio experience.

## Adding More Variations

You can add variations to any sound effect by:

1. Updating the `soundConfigs` in `SoundEngine.ts`
2. Changing the `paths` property from a single string to an array of strings
3. Adding the corresponding sound files

Example:

```typescript
[SoundEffect.LINE_CLEAR]: {
  paths: [
    'sounds/line_clear_1.wav',
    'sounds/line_clear_2.wav',
    'sounds/line_clear_3.wav'
  ],
  volume: 0.8,
  loop: false
}
```

## Sound Requirements

- **Format**: `.wav` files for best compatibility
- **Quality**: 16-bit, 44.1kHz or 48kHz sample rate
- **Duration**: Keep sound effects short (< 2 seconds) for responsiveness
- **Volume**: Sound engine handles volume mixing, so normalize files to consistent levels

## Licensing

Ensure all sound files are properly licensed for commercial use or are royalty-free.

## Recommendations

Good sources for game sound effects:

- Freesound.org (Creative Commons)
- Zapsplat (subscription)
- Adobe Stock Audio
- Create custom sounds using tools like Audacity

## Testing

After adding sound files:

1. Run `npm run build` to ensure files are included in the build
2. Test on both web and mobile platforms
3. Check that sounds play correctly with the native audio plugin
