
# ⚡ Sequence Prototyper

> A Figma plugin that automates the creation of "Prototype" interactions between multiple selected frames and component variants, turning minutes of tedious prototyping into a single click.

## 💡 The Problem

Building loading sequences, complex micro-interactions, or step-by-step onboarding flows in Figma requires manually linking frames, setting the trigger to "After Delay," adjusting the timing, and setting the animation type... over and over. This plugin automates that repetitive chore.


## ✨ Features

- **Batch Prototyping:** Select multiple frames or component variants and link them all in sequential order instantly.
- **Smart Interaction Support:** Supports both "Navigate To" (for standard frames) and "Change To" (for interactive component variants).
- **Custom Timings:** Define the specific "After Delay" time (in milliseconds) applied to the entire sequence.
- **Looping:** Optional toggle to automatically link the final frame back to the first frame, perfect for infinite loading spinners or ambient animations.


## 🚀 Installation

**Install via Figma Community** : *https://www.figma.com/community/plugin/1605529378886881954*



## 🛠️ Usage

- Select two or more Frames or Component Variants in your Figma file. *(Note: The sequence order is determined by your selection order, or layer list order).*
- Run **Sequence Prototyper** from your plugins menu.
- Enter your desired delay time (e.g., `800` ms).
- Choose the action type (`Navigate To` or `Change To`).
- Toggle "Loop Sequence" if desired.
- Click **Generate Sequence**.


## 📄 License

MIT License

