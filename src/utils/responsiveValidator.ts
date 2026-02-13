// Responsive Design Validation Utility
// Usage: Import and run validation checks in browser console

export const ResponsiveValidator = {
  /**
   * Check for horizontal scrolling overflow
   */
  checkHorizontalScroll: () => {
    const scrollWidth = document.documentElement.scrollWidth;
    const windowWidth = window.innerWidth;
    const hasOverflow = scrollWidth > windowWidth;
    
    console.group('🔍 Horizontal Scroll Check');
    console.log('Document Width:', scrollWidth + 'px');
    console.log('Window Width:', windowWidth + 'px');
    console.log('Has Overflow:', hasOverflow ? '❌ YES' : '✅ NO');
    console.groupEnd();
    
    return !hasOverflow;
  },

  /**
   * Get current breakpoint
   */
  getCurrentBreakpoint: () => {
    const width = window.innerWidth;
    let breakpoint = 'unknown';
    
    if (width < 480) breakpoint = 'xs (320px-480px)';
    else if (width < 768) breakpoint = 'sm (480px-768px)';
    else if (width < 1024) breakpoint = 'md (768px-1024px)';
    else if (width < 1280) breakpoint = 'lg (1024px-1280px)';
    else if (width < 1536) breakpoint = 'xl (1280px-1536px)';
    else if (width < 1920) breakpoint = '2xl (1536px-1920px)';
    else if (width < 2560) breakpoint = '3xl (1920px-2560px)';
    else breakpoint = '4xl (2560px+)';
    
    console.log(`📱 Current Breakpoint: ${breakpoint}`);
    return breakpoint;
  },

  /**
   * Check for cumulative layout shift
   */
  checkLayoutShift: async () => {
    console.group('📊 Layout Shift Detection');
    console.log('Note: Open DevTools > Rendering > Cumulative Layout Shift');
    console.log('Scrollbar Gutter Stable:', 
      getComputedStyle(document.documentElement).scrollbarGutter === 'stable' 
        ? '✅ YES' 
        : '❌ NO');
    console.groupEnd();
  },

  /**
   * Validate all images are responsive
   */
  checkImages: () => {
    console.group('🖼️  Image Responsiveness Check');
    
    const images = document.querySelectorAll('img');
    let allResponsive = true;
    
    images.forEach((img, idx) => {
      const maxWidth = getComputedStyle(img).maxWidth;
      const height = getComputedStyle(img).height;
      const isResponsive = maxWidth === '100%' || maxWidth.includes('100%');
      
      if (!isResponsive) {
        console.warn(`Image ${idx}: ${img.src}`);
        console.warn('  ❌ Max-width not 100%:', maxWidth);
        allResponsive = false;
      }
    });
    
    console.log(`Total Images: ${images.length}`);
    console.log(allResponsive ? '✅ All responsive' : '❌ Some not responsive');
    console.groupEnd();
    
    return allResponsive;
  },

  /**
   * Check container max-widths
   */
  checkContainers: () => {
    console.group('📦 Container Max-Width Check');
    
    const containers = document.querySelectorAll('[class*="container"]');
    const results = {};
    
    containers.forEach(el => {
      const maxWidth = getComputedStyle(el).maxWidth;
      const className = el.className;
      
      if (!results[maxWidth]) {
        results[maxWidth] = [];
      }
      results[maxWidth].push(className);
    });
    
    Object.entries(results).forEach(([width, classes]) => {
      console.log(`${width}: ${classes.length} elements`);
    });
    
    console.groupEnd();
  },

  /**
   * Check touch target sizes
   */
  checkTouchTargets: () => {
    console.group('👆 Touch Target Size Check (44px minimum)');
    
    const buttons = document.querySelectorAll('button, [role="button"], a[class*="btn"]');
    let smallTargets = 0;
    
    buttons.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      const size = `${Math.round(rect.width)}x${Math.round(rect.height)}`;
      
      if (rect.width < 44 || rect.height < 44) {
        console.warn(`Small target (${size}):`, btn);
        smallTargets++;
      }
    });
    
    console.log(`Total buttons: ${buttons.length}`);
    console.log(smallTargets === 0 
      ? '✅ All targets meet minimum 44px' 
      : `❌ ${smallTargets} targets below 44px`);
    
    console.groupEnd();
  },

  /**
   * Check text line length (optimal: 50-80 chars)
   */
  checkLineLength: () => {
    console.group('📝 Text Line Length Check');
    
    const paragraphs = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
    const optimalCount = [];
    const tooLongCount = [];
    
    paragraphs.forEach(el => {
      const width = el.offsetWidth;
      const fontSize = parseFloat(getComputedStyle(el).fontSize);
      const charWidth = fontSize * 0.5; // Approximate
      const estimatedChars = width / charWidth;
      
      if (estimatedChars > 80) {
        tooLongCount.push(el);
      } else if (estimatedChars > 50) {
        optimalCount.push(el);
      }
    });
    
    console.log(`Total text elements: ${paragraphs.length}`);
    console.log(`✅ Optimal length (50-80 chars): ${optimalCount.length}`);
    console.log(`⚠️  Too long (80+ chars): ${tooLongCount.length}`);
    console.groupEnd();
  },

  /**
   * Check for hardcoded pixel widths (anti-pattern)
   */
  checkHardcodedWidths: () => {
    console.group('⚠️  Hardcoded Width Check');
    
    const elements = document.querySelectorAll('[style*="width"]');
    const hardcodedPx = [];
    
    elements.forEach(el => {
      const style = el.getAttribute('style');
      if (style && style.includes('px') && !style.includes('max-width')) {
        hardcodedPx.push({
          element: el.tagName,
          style: style,
          el: el
        });
      }
    });
    
    if (hardcodedPx.length > 0) {
      console.warn(`Found ${hardcodedPx.length} hardcoded px widths:`);
      hardcodedPx.forEach(item => {
        console.warn(`  ${item.element}: ${item.style}`, item.el);
      });
    } else {
      console.log('✅ No hardcoded pixel widths found');
    }
    
    console.groupEnd();
  },

  /**
   * Simulate different viewport sizes
   */
  simulateViewportSizes: () => {
    const sizes = [
      { name: 'iPhone SE', width: 375 },
      { name: 'iPhone 15', width: 393 },
      { name: 'Galaxy S24', width: 412 },
      { name: 'iPad', width: 768 },
      { name: 'iPad Pro', width: 1024 },
      { name: 'MacBook Air', width: 1280 },
      { name: '27" Monitor', width: 1920 },
      { name: 'Ultra-wide', width: 2560 }
    ];
    
    console.group('📱 Viewport Size Reference');
    sizes.forEach(size => {
      console.log(`${size.name}: ${size.width}px`);
    });
    console.log('Use Chrome DevTools > Device toggle (Ctrl+Shift+M)');
    console.groupEnd();
  },

  /**
   * Check responsive font scaling
   */
  checkFontScaling: () => {
    console.group('🔤 Font Scaling Check');
    
    const headings = {
      h1: document.querySelector('h1'),
      h2: document.querySelector('h2'),
      h3: document.querySelector('h3'),
      p: document.querySelector('p')
    };
    
    Object.entries(headings).forEach(([tag, el]) => {
      if (el) {
        const fontSize = getComputedStyle(el).fontSize;
        const lineHeight = getComputedStyle(el).lineHeight;
        console.log(`${tag}: ${fontSize} (line-height: ${lineHeight})`);
      }
    });
    
    console.log('Font sizes should scale with window resize (use clamp)');
    console.groupEnd();
  },

  /**
   * Run all checks
   */
  runAllChecks: function() {
    console.clear();
    console.log('🧪 Running Responsive Design Validation Suite\n');
    
    this.getCurrentBreakpoint();
    console.log('');
    
    const scrollCheck = this.checkHorizontalScroll();
    console.log('');
    
    this.checkImages();
    console.log('');
    
    this.checkContainers();
    console.log('');
    
    this.checkTouchTargets();
    console.log('');
    
    this.checkLineLength();
    console.log('');
    
    this.checkHardcodedWidths();
    console.log('');
    
    this.checkFontScaling();
    console.log('');
    
    this.simulateViewportSizes();
    console.log('');
    
    this.checkLayoutShift();
    console.log('');
    
    console.log('✅ Validation complete!');
  }
};

// Export for use in browser console
window.ResponsiveValidator = ResponsiveValidator;

// Usage in browser console:
// ResponsiveValidator.runAllChecks()
// ResponsiveValidator.checkHorizontalScroll()
// ResponsiveValidator.checkImages()
// etc.
