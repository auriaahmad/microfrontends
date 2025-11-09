import React from 'react';
import { createRoot } from 'react-dom/client';
import Counter from './Counter';

// Store roots for re-rendering
const roots = new Map();

// Widget API
const CounterWidget = {
  version: '1.0.0',

  // Manual initialization
  init: function(elementId, options = {}) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`CounterWidget: Element with id "${elementId}" not found`);
      return;
    }

    // Check if root already exists for this element
    let root = roots.get(elementId);

    if (!root) {
      // Create new root if it doesn't exist
      root = createRoot(element);
      roots.set(elementId, root);
    }

    // Render or re-render
    root.render(React.createElement(Counter, options));

    console.log('✅ CounterWidget initialized on', elementId);
  },

  // Auto-initialize all widgets on page
  autoInit: function() {
    const widgets = document.querySelectorAll('.counter-widget');

    widgets.forEach((element, index) => {
      // Read data attributes
      const options = {
        initialValue: parseInt(element.getAttribute('data-initial') || '0'),
        label: element.getAttribute('data-label') || 'Counter',
        color: element.getAttribute('data-color') || '#2196F3',
        size: element.getAttribute('data-size') || 'medium'
      };

      // Use element itself as key for auto-init (since these don't have IDs)
      const elementKey = `auto-${index}`;
      let root = roots.get(elementKey);

      if (!root) {
        root = createRoot(element);
        roots.set(elementKey, root);
      }

      root.render(React.createElement(Counter, options));

      console.log(`✅ CounterWidget auto-initialized #${index + 1}`, options);
    });

    if (widgets.length === 0) {
      console.log('ℹ️ CounterWidget: No elements with class "counter-widget" found');
    }
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    CounterWidget.autoInit();
  });
} else {
  // DOM already loaded
  CounterWidget.autoInit();
}

console.log('🚀 CounterWidget v' + CounterWidget.version + ' loaded');

// Export for webpack UMD
export default CounterWidget;
