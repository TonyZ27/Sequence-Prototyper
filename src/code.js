// code.js
console.log("Plugin starting...");

figma.showUI(__html__, { width: 260, height: 450 });

figma.ui.onmessage = msg => {

  if (msg.type === 'create-links') {
    
    const selection = [...figma.currentPage.selection];

    if (selection.length < 2) {
      figma.notify("❌ Please select at least 2 frames or variants.");
      return;
    }

    // Sort Selection (Top-Left to Bottom-Right)
    selection.sort((a, b) => {
      if (Math.abs(a.y - b.y) > 50) { 
        return a.y - b.y;
      }
      return a.x - b.x;
    });

    let linksCreated = 0;
    let errorCount = 0;

    for (let i = 0; i < selection.length; i++) {
      const currentNode = selection[i];
      let nextNode = selection[i + 1];

      // Handle Looping
      if (i === selection.length - 1) {
        if (msg.loop) {
          nextNode = selection[0];
        } else {
          break;
        }
      }

      if (!nextNode || nextNode.id === currentNode.id) continue;

      // 1. Prepare Transition
      let transitionObj = null;
      if (msg.useSmartAnimate) {
        transitionObj = {
          type: 'SMART_ANIMATE',
          easing: { type: 'EASE_OUT' },
          duration: msg.animDuration / 1000
        };
      } else {
        transitionObj = { type: 'INSTANT' };
      }

      // 2. Prepare Action Object
      let actionNode = {};

      if (msg.interactionType === 'SWAP') {
        // --- CASE A: CHANGE TO (VARIANTS) ---
        // FIX: The correct navigation type is "CHANGE_TO", not "SWAP"
        actionNode = {
          type: 'NODE',
          destinationId: nextNode.id,
          navigation: 'CHANGE_TO', // <--- THE KEY FIX
          transition: transitionObj,
          resetVideoPosition: false
        };
      } else {
        // --- CASE B: NAVIGATE TO (FRAMES) ---
        actionNode = {
          type: 'NODE',
          destinationId: nextNode.id,
          navigation: 'NAVIGATE',
          transition: transitionObj,
          preserveScrollPosition: false,
          resetVideoPosition: false
        };
      }

      // 3. Create Reaction
      const reaction = {
        trigger: {
          type: 'AFTER_TIMEOUT',
          timeout: msg.delay / 1000 
        },
        actions: [actionNode]
      };

      try {
        currentNode.reactions = [reaction];
        linksCreated++;
      } catch (err) {
        console.error("Failed on node:", currentNode.name, err);
        console.log("FAILED JSON:", JSON.stringify(reaction));
        errorCount++;
      }
    }

    if (errorCount > 0) {
      figma.notify(`⚠️ Sequenced ${linksCreated} frames, but ${errorCount} failed. Check console.`);
    } else {
      figma.notify(`✅ Sequenced ${linksCreated} frames successfully!`);
    }
  }
};