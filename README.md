# Obsidian Dice

A self-contained dark-fantasy dice roguelike interface prototype. Roll a custom six-sided relic die, spend Fate to reroll, and defeat the Hollow Warden before its whispers consume the chamber.

## Run locally

```bash
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173). No package installation or build step is required.

## Included mechanics

- Six distinct sticker faces: Attack, Defense, Vampirism, Curse, and Fortune.
- Curse/Attack and Vampirism/Attack synergy feedback in the combat log.
- Fate-limited rerolls and a keyboard shortcut: <kbd>Space</kbd> rolls the die.
- Live health, enemy vitality, Fate, and victory state updates.
