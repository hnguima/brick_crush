# Sound Assets (Public)

This directory contains the actual audio files used by the game's sound engine.

## Files Required

The following `.wav` files must be placed in this directory for the sound engine to work:

- `piece_place.wav` - Played when a piece is successfully placed on the board
- `piece_invalid.wav` - Played when attempting to place a piece in an invalid location
- `line_clear.wav` - Played when lines/columns are cleared
- `bag_complete.wav` - Played when all 3 pieces in a bag are used
- `game_over.wav` - Played when the game ends
- `ui_button.wav` - Played for UI button interactions

## Notes

- Files in the `public` directory are served statically and accessible to the Capacitor Native Audio plugin
- The sound engine references these files via relative paths like "sounds/piece_place.wav"
- For development, you can use placeholder sound files or temporarily disable sound

## Temporary Placeholder Files

Until actual audio files are added, you can create silent placeholder files:

```bash
# Create silent 1-second wav files for testing
for file in piece_place piece_invalid line_clear bag_complete game_over ui_button; do
  ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 1 -q:a 9 -acodec pcm_s16le "${file}.wav"
done
```
