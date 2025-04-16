/**
 * Interactive Jellyfish Animation
 * Controls the jellyfish animations and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initJellyfish();
});

function initJellyfish() {
    const jellyfish = document.querySelector('.jellyfish');
    const oceanContainer = document.querySelector('.ocean-container');
    
    if (!jellyfish || !oceanContainer) return;
    
    // Track animation state
    let colorSchemeIndex = 1;
    const totalColorSchemes = 5;
    let clickCount = 0;
    let lastClickTime = 0;
    
    // Initialize with first color scheme
    jellyfish.classList.add('color-scheme-1');
    
    // Make jellyfish clickable with color-changing functionality
    jellyfish.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Calculate time since last click for double-click detection
        const currentTime = new Date().getTime();
        const timeSinceLastClick = currentTime - lastClickTime;
        lastClickTime = currentTime;
        
        // Create ripple effect on click
        createRippleEffect(e, oceanContainer);
        
        // Add happiness animation
        jellyfish.classList.add('happy');
        setTimeout(() => {
            jellyfish.classList.remove('happy');
        }, 1000);
        
        // Create random bubbles
        createBubbles(jellyfish, 3 + Math.floor(Math.random() * 3));
        
        // Track clicks for theme changing
        clickCount++;
        
        // Change color scheme of jellyfish
        jellyfish.classList.remove(`color-scheme-${colorSchemeIndex}`);
        colorSchemeIndex = colorSchemeIndex % totalColorSchemes + 1;
        jellyfish.classList.add(`color-scheme-${colorSchemeIndex}`);
        
        // If clicked 3 times within 3 seconds, change site theme
        if (clickCount >= 3 && timeSinceLastClick < 3000) {
            applyJellyfishTheme(colorSchemeIndex);
            clickCount = 0;
        }
        
        // Reset click count after 3 seconds of inactivity
        setTimeout(() => {
            if (currentTime === lastClickTime) {
                clickCount = 0;
            }
        }, 3000);
    });
    
    // Make jellyfish follow cursor with smooth animation
    document.addEventListener('mousemove', (e) => {
        // Only respond if cursor is in bottom half of screen
        if (e.clientY < window.innerHeight / 2) return;
        
        const rect = oceanContainer.getBoundingClientRect();
        
        // Calculate horizontal position - map cursor to container width
        const xPercentage = (e.clientX / window.innerWidth) * 100;
        
        // Limit movement to keep jellyfish mostly within the container
        const limitedX = Math.max(20, Math.min(80, xPercentage));
        
        // Apply position with smooth transition
        oceanContainer.style.right = `${100 - limitedX}%`;
    });
    
    // Add subtle hover effect
    oceanContainer.addEventListener('mouseenter', () => {
        oceanContainer.style.opacity = '1';
    });
    
    oceanContainer.addEventListener('mouseleave', () => {
        oceanContainer.style.opacity = '0.8';
    });
}

/**
 * Creates a ripple effect at the click position
 */
function createRippleEffect(e, container) {
    const ripple = document.createElement('div');
    ripple.classList.add('jellyfish-ripple');
    
    // Position ripple at click coordinates relative to container
    const rect = container.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    
    container.appendChild(ripple);
    
    // Remove the ripple after animation completes
    setTimeout(() => {
        ripple.remove();
    }, 2000);
}

/**
 * Creates bubbles rising from the jellyfish
 */
function createBubbles(jellyfish, count) {
    for (let i = 0; i < count; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('jellyfish-bubble');
        
        // Random size
        const size = 3 + Math.random() * 8;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        // Random horizontal offset
        const offsetX = -30 + Math.random() * 60;
        bubble.style.setProperty('--bubble-x', `${offsetX}px`);
        
        // Set starting position
        bubble.style.left = `${50 + (Math.random() * 20 - 10)}%`;
        bubble.style.top = `${20 + (Math.random() * 40)}%`;
        
        // Add to DOM
        jellyfish.appendChild(bubble);
        
        // Remove bubble after animation completes
        setTimeout(() => {
            bubble.remove();
        }, 3000);
    }
}

/**
 * Applies a theme to the entire site based on jellyfish color
 */
function applyJellyfishTheme(colorIndex) {
    // Remove any existing jellyfish themes
    for (let i = 1; i <= 5; i++) {
        document.documentElement.classList.remove(`jellyfish-theme-${i}`);
    }
    
    // Apply new theme
    document.documentElement.classList.add(`jellyfish-theme-${colorIndex}`);
    
    // Show theme change notification
    showThemeNotification(colorIndex);
}

/**
 * Shows a brief notification when theme changes
 */
function showThemeNotification(colorIndex) {
    const themeNames = [
        'Pink Anemone',
        'Emerald Depths',
        'Sunset Coral',
        'Deep Ocean',
        'Crimson Tide'
    ];
    
    // Create notification if it doesn't exist
    let notification = document.querySelector('.theme-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.classList.add('theme-notification');
        document.body.appendChild(notification);
        
        // Add CSS for notification
        const style = document.createElement('style');
        style.textContent = `
            .theme-notification {
                position: fixed;
                bottom: -60px;
                left: 50%;
                transform: translateX(-50%);
                background-color: var(--color-accent);
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transition: bottom 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                z-index: 1000;
                font-size: 14px;
            }
            
            .theme-notification.show {
                bottom: 20px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Update notification text and show it
    notification.textContent = `Theme changed to ${themeNames[colorIndex-1]}`;
    notification.classList.add('show');
    
    // Hide notification after a few seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}