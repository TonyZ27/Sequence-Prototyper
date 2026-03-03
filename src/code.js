console.log("Plugin starting...");

figma.showUI(__html__, { width: 260, height: 450 });

figma.ui.onmessage = async (msg) => {

  if (msg.type === 'create-links') {
    
    const selection = [...figma.currentPage.selection];

    if (selection.length < 2) {
      figma.notify("❌ Please select at least 2 frames or variants.");
      return;
    }

    const validTypes = ['FRAME', 'COMPONENT', 'COMPONENT_SET', 'INSTANCE', 'SECTION'];
    const invalidNodes = selection.filter(node => !validTypes.includes(node.type));
    
    if (invalidNodes.length > 0) {
      figma.notify("❌ 'After Delay' only works on Frames, Components, or Instances.");
      return;
    }

    // Sort Top-Left to Bottom-Right
    selection.sort((a, b) => {
      if (Math.abs(a.y - b.y) > 50) return a.y - b.y;
      return a.x - b.x;
    });

    let linksCreated = 0;
    let errorCount = 0;

    for (let i = 0; i < selection.length; i++) {
      const currentNode = selection[i];
      let nextNode = selection[i + 1];

      if (i === selection.length - 1) {
        if (msg.loop) nextNode = selection[0];
        else break;
      }

      if (!nextNode || nextNode.id === currentNode.id) continue;

      let transitionObj = msg.useSmartAnimate 
        ? { type: 'SMART_ANIMATE', easing: { type: 'EASE_OUT' }, duration: msg.animDuration / 1000 }
        : { type: 'INSTANT' };

      // We must define action Node completely independent of the other.
      let actionNode;

      if (msg.interactionType === 'SWAP') {
        // SWAP (CHANGE_TO) action
        actionNode = {
          type: 'NODE',
          destinationId: nextNode.id,
          navigation: 'CHANGE_TO', 
          transition: transitionObj,
          resetVideoPosition: false
        };
      } else {
        // NAVIGATE action
        actionNode = {
          type: 'NODE',
          destinationId: nextNode.id,
          navigation: 'NAVIGATE',
          transition: transitionObj,
          preserveScrollPosition: false,
          resetVideoPosition: false
        };
      }

      // The critical structure: trigger + actions array
      const reaction = {
        trigger: { type: 'AFTER_TIMEOUT', timeout: msg.delay / 1000 },
        actions: [actionNode] 
      };

      try {
        await currentNode.setReactionsAsync([reaction]);
        linksCreated++;
      } catch (err) {
        console.error("Failed on node:", currentNode.name, err);
        errorCount++;
      }
    }

    if (errorCount > 0) {
      figma.notify(`⚠️ Sequenced ${linksCreated} frames, but ${errorCount} failed.`);
    } else {
      figma.notify(`✅ Sequenced ${linksCreated} frames successfully!`);
    }
  }
};