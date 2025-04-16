/**
 * Main JavaScript for Portfolio
 * Sound effects and interactive elements
 */

// Wait for DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    // Initialize sound system
    const soundSystem = initSoundSystem();

    // Initialize theme toggle
    initThemeToggle(soundSystem);

    // Initialize interactive elements
    initMobileMenu(soundSystem);
    initSmoothScrolling();
    initButtonSounds(soundSystem);
    initJellyfishInteraction(soundSystem);
    initFormValidation(soundSystem);
    initHeaderScroll();
    initSkillBars();
    initAnimations();
    initParticleBackground();
    initTypedText();
    initProjectCardEffects();
    initStars();
    initEnhancedContactForm();
    initAboutSection();
    initExperienceAnimations();
    initMagneticElements();
    initSkillIcons();
});

/**
 * Sound System
 * Creates and manages sound effects using Web Audio API
 */
function initSoundSystem() {
    // Create audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    
    // Sound enabled state
    let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    
    // Sound toggle element
    const soundToggle = document.getElementById('sound-toggle');
    const soundIcon = soundToggle ? soundToggle.querySelector('.sound-icon') : null;
    
    // Update sound icon based on current state
    const updateSoundIcon = () => {
        if (!soundIcon) return;
        
        if (soundEnabled) {
            soundIcon.classList.add('sound-on');
            soundIcon.classList.remove('sound-off');
        } else {
            soundIcon.classList.add('sound-off');
            soundIcon.classList.remove('sound-on');
        }
    };
    
    // Initialize sound toggle
    if (soundToggle) {
        updateSoundIcon();
        
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            localStorage.setItem('soundEnabled', soundEnabled);
            updateSoundIcon();
            
            // Play toggle sound
            if (soundEnabled) {
                playSound('toggle');
            }
        });
    }
    
    // Sound definitions
    const sounds = {
        hover: {
            type: 'sine',
            frequency: 800,
            duration: 0.1,
            volumeStart: 0.05,
            volumeEnd: 0.01,
            frequencyEnd: 600
        },
        click: {
            type: 'sine',
            frequency: 500,
            duration: 0.15,
            volumeStart: 0.1,
            volumeEnd: 0.01,
            frequencyEnd: 400
        },
        toggle: {
            type: 'triangle',
            frequency: 700,
            duration: 0.15,
            volumeStart: 0.1,
            volumeEnd: 0.01,
            frequencyEnd: 900
        },
        success: {
            type: 'sine',
            frequency: 600,
            duration: 0.3,
            volumeStart: 0.1,
            volumeEnd: 0.01,
            frequencyEnd: 800
        },
        error: {
            type: 'sawtooth',
            frequency: 400,
            duration: 0.3,
            volumeStart: 0.1,
            volumeEnd: 0.01,
            frequencyEnd: 200
        },
        jellyfish: {
            type: 'sine',
            frequency: 300,
            duration: 0.5,
            volumeStart: 0.05,
            volumeEnd: 0.01,
            frequencyEnd: 600
        }
    };
    
    // Play a sound effect
    const playSound = (soundName) => {
        if (!soundEnabled || !audioContext || !sounds[soundName]) return;
        
        try {
            // Resume audio context if it's suspended (needed for browsers that require user interaction)
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            // Get sound definition
            const sound = sounds[soundName];
            
            // Create oscillator and gain node
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            // Configure oscillator
            oscillator.type = sound.type;
            oscillator.frequency.setValueAtTime(sound.frequency, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(
                sound.frequencyEnd, 
                audioContext.currentTime + sound.duration
            );
            
            // Configure gain node
            gainNode.gain.setValueAtTime(sound.volumeStart, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                sound.volumeEnd, 
                audioContext.currentTime + sound.duration
            );
            
            // Connect nodes and start sound
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + sound.duration);
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };
    
    // Return sound system functions
    return {
        play: playSound,
        isEnabled: () => soundEnabled
    };
}

/**
 * Theme Toggler
 * Handles switching between light and dark modes
 */
function initThemeToggle(soundSystem) {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Check for saved theme preference or use system preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    
    // Set initial theme based on saved preference or system preference
    if (savedTheme === 'dark' || (savedTheme === null && prefersDarkScheme.matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Update jellyfish colors based on theme
    updateJellyfishForTheme();
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', () => {
        // Toggle theme
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Play sound if sound system is available
        if (soundSystem) {
            soundSystem.play('toggle');
        }
        
        // Update theme and save preference
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update elements that need special handling for theme changes
        updateJellyfishForTheme();
        updateParticlesForTheme();
    });
    
    // Theme preference change listener
    prefersDarkScheme.addEventListener('change', (e) => {
        if (localStorage.getItem('theme') === null) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateJellyfishForTheme();
            updateParticlesForTheme();
        }
    });
}

/**
 * Helper function to update jellyfish colors based on theme
 */
function updateJellyfishForTheme() {
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    const jellyfishBody = document.querySelector('.jellyfish-body');
    const jellyfishInner = document.querySelector('.jellyfish-inner');
    const tentacles = document.querySelectorAll('.tentacle');
    
    if (jellyfishBody && jellyfishInner && tentacles.length) {
        if (isDarkTheme) {
            // Update to blue colors for dark theme
            jellyfishBody.style.backgroundColor = 'rgba(10, 132, 255, 0.7)';
            jellyfishBody.style.boxShadow = '0 0 15px rgba(10, 132, 255, 0.5)';
            
            tentacles.forEach(tentacle => {
                tentacle.style.backgroundColor = 'rgba(10, 132, 255, 0.6)';
            });
        } else {
            // Reset to pink colors for light theme
            jellyfishBody.style.backgroundColor = 'rgba(227, 89, 171, 0.7)';
            jellyfishBody.style.boxShadow = '0 0 15px rgba(227, 89, 171, 0.5)';
            
            tentacles.forEach(tentacle => {
                tentacle.style.backgroundColor = 'rgba(227, 89, 171, 0.6)';
            });
        }
    }
}

/**
 * Helper function to update particle colors based on theme
 */
function updateParticlesForTheme() {
    // This will be called when the theme changes to update particle colors
    // The actual implementation happens in the particle drawing function
    // which checks the current theme
}

/**
 * Button Sound Effects
 * Adds sound effects to interactive elements
 */
function initButtonSounds(soundSystem) {
    if (!soundSystem) return;
    
    // Elements that should have hover sounds
    const hoverElements = document.querySelectorAll(
        '.nav-link, .primary-button, .secondary-button, .project-link, ' +
        '.text-button, .social-link, .submit-button, #sound-toggle'
    );
    
    // Elements that should have click sounds
    const clickElements = document.querySelectorAll(
        '.nav-link, .primary-button, .secondary-button, .submit-button, ' +
        '.project-link, .text-button, .social-link'
    );
    
    // Add hover sounds
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            soundSystem.play('hover');
        });
    });
    
    // Add click sounds
    clickElements.forEach(element => {
        element.addEventListener('click', () => {
            soundSystem.play('click');
        });
    });
}

/**
 * Enhanced jellyfish interaction with more dynamic behaviors
 */
function initJellyfishInteraction(soundSystem) {
    const jellyfish = document.querySelector('.jellyfish');
    const oceanContainer = document.querySelector('.ocean-container');
    if (!jellyfish || !oceanContainer) return;
    
    // Track initial position for natural movement
    let targetX = 0;
    let currentX = 0;
    let isMoving = false;
    let lastScrollY = window.scrollY;
    let clickCount = 0;
    
    // Make jellyfish respond to click/tap
    jellyfish.addEventListener('click', () => {
        soundSystem.play('jellyfish');
        
        // Add happy animation
        jellyfish.classList.add('happy');
        
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.classList.add('jellyfish-ripple');
        oceanContainer.appendChild(ripple);
        
        // Generate random droplets
        for (let i = 0; i < 5; i++) {
            const droplet = document.createElement('div');
            droplet.classList.add('water-droplet');
            droplet.style.left = `${40 + Math.random() * 20}%`;
            droplet.style.top = `${60 + Math.random() * 10}%`;
            droplet.style.animationDuration = `${1 + Math.random() * 0.5}s`;
            droplet.style.setProperty('--bubble-x', `${-20 + Math.random() * 40}px`);
            oceanContainer.appendChild(droplet);
            
            // Remove droplet after animation
            setTimeout(() => {
                droplet.remove();
            }, 1500);
        }
        
        // Create bubbles
        for (let i = 0; i < 3; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('jellyfish-bubble');
            bubble.style.width = `${8 + Math.random() * 12}px`;
            bubble.style.height = bubble.style.width;
            bubble.style.left = `${30 + Math.random() * 40}%`;
            bubble.style.top = `${40 + Math.random() * 20}%`;
            bubble.style.animationDuration = `${2 + Math.random() * 2}s`;
            bubble.style.setProperty('--bubble-x', `${-30 + Math.random() * 60}px`);
            oceanContainer.appendChild(bubble);
            
            // Remove bubble after animation
            setTimeout(() => {
                bubble.remove();
            }, 3000);
        }
        
        // Jump animation
        jellyfish.style.transform = `translateY(-50px) translateX(calc(-50% + ${currentX}px))`;
        setTimeout(() => {
            jellyfish.style.transform = `translateY(0) translateX(calc(-50% + ${currentX}px))`;
        }, 300);
        
        // Remove classes after animation
        setTimeout(() => {
            jellyfish.classList.remove('happy');
            ripple.remove();
        }, 1000);
        
        // Increment click counter and cycle through color schemes
        clickCount++;
        const colorScheme = (clickCount % 5) + 1;
        
        // Remove all existing color scheme classes
        for (let i = 1; i <= 5; i++) {
            jellyfish.classList.remove(`color-scheme-${i}`);
        }
        
        // Add new color scheme class
        jellyfish.classList.add(`color-scheme-${colorScheme}`);
        
        // If clicked 3 times, change site theme color
        if (clickCount % 3 === 0) {
            // Remove existing theme classes
            for (let i = 1; i <= 5; i++) {
                document.documentElement.classList.remove(`jellyfish-theme-${i}`);
            }
            
            // Add new theme class
            document.documentElement.classList.add(`jellyfish-theme-${colorScheme}`);
            
            // Update CSS color variables to match jellyfish theme
            const root = document.documentElement;
            
            // Extract RGB values from jellyfish variables
            const computedStyle = getComputedStyle(jellyfish);
            const primaryRGB = computedStyle.getPropertyValue('--jellyfish-primary-rgb').trim();
            
            // Update CSS variables
            if (primaryRGB) {
                root.style.setProperty('--color-accent-rgb', primaryRGB);
            }
        }
    });
    
    // Make jellyfish follow cursor with smooth easing
    document.addEventListener('mousemove', (e) => {
        if (!oceanContainer) return;
        
        const containerRect = oceanContainer.getBoundingClientRect();
        const containerCenterX = containerRect.left + containerRect.width / 2;
        const containerCenterY = containerRect.top + containerRect.height / 2;
        
        // Calculate distance from container center to cursor
        const distance = Math.sqrt(
            Math.pow(e.clientX - containerCenterX, 2) + 
            Math.pow(e.clientY - containerCenterY, 2)
        );
        
        // Only follow if cursor is relatively close
        if (distance < 400) {
            isMoving = true;
            // Calculate how much to move (more movement when closer)
            const influenceFactor = Math.max(0, 1 - (distance / 400));
            const maxOffset = 50 * influenceFactor;
            
            // Calculate offset from center
            targetX = ((e.clientX - containerCenterX) / 400) * maxOffset;
        } else {
            // Gradually return to center
            targetX = 0;
        }
    });
    
    // Jellyfish reacts to scrolling
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const scrollDiff = currentScrollY - lastScrollY;
        
        // Add a slight tilt based on scroll direction
        if (Math.abs(scrollDiff) > 10) {
            const tiltAmount = Math.min(Math.max(scrollDiff / 10, -10), 10);
            jellyfish.style.transform = `translateY(0) translateX(calc(-50% + ${currentX}px)) rotate(${tiltAmount}deg)`;
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Smooth animation loop for jellyfish movement
    function animateJellyfish() {
        // Smooth easing towards target position
        currentX += (targetX - currentX) * 0.05;
        
        // Apply movement with easing
        if (Math.abs(targetX - currentX) > 0.1 || isMoving) {
            jellyfish.style.transform = `translateX(calc(-50% + ${currentX}px))`;
            isMoving = Math.abs(targetX - currentX) > 0.1;
        }
        
        requestAnimationFrame(animateJellyfish);
    }
    
    // Start the animation loop
    animateJellyfish();
    
    // Add CSS for enhanced jellyfish behavior
    const style = document.createElement('style');
    style.textContent = `
        .jellyfish {
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .jellyfish:hover .jellyfish-body {
            transform: scale(1.1);
        }
        
        .jellyfish:hover .tentacle {
            animation-duration: 2s !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Enhanced Mobile Menu Toggle with smooth animations
 */
function initMobileMenu(soundSystem) {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menuOverlay = document.querySelector('.menu-overlay');
    const navItems = document.querySelectorAll('.nav-links li');
    
    if (!menuToggle || !navLinks) return;
    
    // Set initial item indexes for staggered animation
    navItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index);
    });
    
    // Toggle menu function
    function toggleMenu() {
        const isOpen = menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        
        // Play toggle sound
        soundSystem.play('toggle');
        
        // Update aria-expanded attribute for accessibility
        menuToggle.setAttribute('aria-expanded', isOpen);
        
        // Prevent body scrolling when menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }
    
    // Menu toggle click handler
    menuToggle.addEventListener('click', toggleMenu);
    
    // Overlay click handler to close menu
    menuOverlay.addEventListener('click', () => {
        if (menuToggle.classList.contains('active')) {
            toggleMenu();
        }
    });
    
    // Close menu when clicking on a nav link (for mobile)
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle.classList.contains('active')) {
                toggleMenu();
                
                // Play click sound
                soundSystem.play('click');
            }
        });
    });
    
    // Close menu when escape key is pressed
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuToggle.classList.contains('active')) {
            toggleMenu();
        }
    });
    
    // Handle resize to reset menu state when switching between mobile and desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && menuToggle.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            menuOverlay.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', false);
            document.body.style.overflow = '';
        }
    });
}

/**
 * Smooth Scrolling
 */
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (href === '#' || href === '') return;
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                // Get header height for offset
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL but without scrolling
                history.pushState(null, null, href);
            }
        });
    });
}

/**
 * Form Validation with sound feedback
 */
function initFormValidation(soundSystem) {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form fields
        const nameField = this.querySelector('#name');
        const emailField = this.querySelector('#email');
        const subjectField = this.querySelector('#subject');
        const messageField = this.querySelector('#message');
        
        // Basic validation
        let isValid = true;
        
        [nameField, emailField, subjectField, messageField].forEach(field => {
            if (!field) return;
            
            // Remove any existing error styles
            field.classList.remove('error');
            const errorMsg = field.parentElement.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
            
            // Check if field is empty
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                
                // Create error message
                const errorElement = document.createElement('p');
                errorElement.classList.add('error-message');
                errorElement.textContent = 'This field is required';
                field.parentElement.appendChild(errorElement);
            }
            
            // Email validation
            if (field === emailField && field.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(field.value)) {
                    isValid = false;
                    field.classList.add('error');
                    
                    const errorElement = document.createElement('p');
                    errorElement.classList.add('error-message');
                    errorElement.textContent = 'Please enter a valid email address';
                    field.parentElement.appendChild(errorElement);
                }
            }
        });
        
        // Play appropriate sound
        if (isValid) {
            soundSystem.play('success');
        } else {
            soundSystem.play('error');
        }
        
        // If form is valid, show success message and reset form
        if (isValid) {
            // Here you would typically send the form data to a server
            // For this example, we'll just show a success message
            
            // Disable submit button and show loading state
            const submitButton = this.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Simulate server request
            setTimeout(() => {
                // Create success message
                const formContainer = contactForm.parentElement;
                
                // Hide form with a smooth transition
                contactForm.style.opacity = '0';
                contactForm.style.transform = 'translateY(20px)';
                contactForm.style.transition = 'all 0.5s ease';
                
                // Create success message after form fades out
                setTimeout(() => {
                    contactForm.style.display = 'none';
                    
                    const successMessage = document.createElement('div');
                    successMessage.classList.add('success-message');
                    successMessage.innerHTML = `
                        <div class="success-icon">✓</div>
                        <h3>Message Sent!</h3>
                        <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
                        <button class="secondary-button send-another">Send Another Message</button>
                    `;
                    
                    formContainer.appendChild(successMessage);
                    
                    // Play success sound again when message appears
                    soundSystem.play('success');
                    
                    // Add CSS for success message
                    const style = document.createElement('style');
                    style.textContent = `
                        .success-message {
                            text-align: center;
                            padding: var(--spacing-xl);
                            background-color: var(--color-surface-elevated);
                            border-radius: var(--border-radius-lg);
                            box-shadow: var(--shadow-md);
                            animation: fadeIn 0.5s ease forwards;
                        }
                        
                        .success-icon {
                            width: 6rem;
                            height: 6rem;
                            background-color: var(--color-success);
                            color: white;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 3rem;
                            margin: 0 auto var(--spacing-lg);
                        }
                        
                        @keyframes fadeIn {
                            from {
                                opacity: 0;
                                transform: translateY(20px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                    `;
                    document.head.appendChild(style);
                    
                    // Add event listener to "Send Another Message" button
                    const sendAnotherButton = successMessage.querySelector('.send-another');
                    sendAnotherButton.addEventListener('click', () => {
                        successMessage.remove();
                        contactForm.reset();
                        contactForm.style.display = 'flex';
                        submitButton.disabled = false;
                        submitButton.textContent = originalText;
                        
                        // Play click sound
                        soundSystem.play('click');
                        
                        // Fade form back in
                        setTimeout(() => {
                            contactForm.style.opacity = '1';
                            contactForm.style.transform = 'translateY(0)';
                        }, 10);
                    });
                    
                }, 500);
                
            }, 1500); // Simulate server delay
        }
    });
    
    // Add CSS for form validation
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.error,
        .form-group textarea.error {
            border-color: #ff3b30;
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        .error-message {
            color: #ff3b30;
            font-size: var(--font-size-sm);
            margin-top: var(--spacing-xs);
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes shake {
            10%, 90% { transform: translateX(-1px); }
            20%, 80% { transform: translateX(2px); }
            30%, 50%, 70% { transform: translateX(-4px); }
            40%, 60% { transform: translateX(4px); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Enhanced About section interactions
 */
function initAboutSection() {
    const aboutStats = document.querySelector('.about-stats');
    
    if (aboutStats) {
        // Add 3D tilt effect to stats card on mouse move
        aboutStats.addEventListener('mousemove', (e) => {
            const rect = aboutStats.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation based on mouse position
            // with subtle effect (max 5 degrees)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateY = ((x - centerX) / centerX) * 5;
            const rotateX = ((centerY - y) / centerY) * 3;
            
            aboutStats.style.transform = `
                translateY(-10px) 
                translateZ(30px)
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
            `;
        });
        
        // Reset transform on mouse leave
        aboutStats.addEventListener('mouseleave', () => {
            aboutStats.style.transform = '';
        });
    }
    
    // Create counter animation for stat numbers
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(statNumber => {
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetValue = parseInt(statNumber.textContent.replace(/\D/g, ''));
                    
                    // Animate counter from 0 to target value
                    let currentValue = 0;
                    const duration = 2000; // 2 seconds
                    const increment = targetValue / (duration / 16); // Update every 16ms
                    
                    const counter = setInterval(() => {
                        currentValue += increment;
                        
                        if (currentValue >= targetValue) {
                            clearInterval(counter);
                            currentValue = targetValue;
                        }
                        
                        // Update the text with the + sign if it had one
                        if (statNumber.textContent.includes('+')) {
                            statNumber.textContent = Math.floor(currentValue) + '+';
                        } else {
                            statNumber.textContent = Math.floor(currentValue);
                        }
                    }, 16);
                    
                    observer.unobserve(entry.target);
                }
            });
        };
        
        const observer = new IntersectionObserver(observerCallback, {
            threshold: 0.5
        });
        
        observer.observe(statNumber);
    });
    
    // Add hover effects to skill icons
    const skillIcons = document.querySelectorAll('.skill-icon');
    skillIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'translateZ(50px) scale(1.2)';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'translateZ(30px) scale(1)';
        });
    });
}

/**
 * Enhanced Contact Form with advanced effects
 */
function initEnhancedContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    // Add icons to contact methods if they don't have any
    const methodIcons = document.querySelectorAll('.method-icon');
    methodIcons.forEach(icon => {
        if (icon.innerHTML.trim() === '') {
            // Get the heading text to determine which icon to use
            const heading = icon.closest('.contact-method').querySelector('h3').textContent.toLowerCase();
            
            if (heading.includes('email')) {
                icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>';
            } else if (heading.includes('linkedin')) {
                icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>';
            } else if (heading.includes('github')) {
                icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>';
            } else {
                icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';
            }
        }
    });

    // Add 3D tilt effect to form on mouse move
    const formContainer = contactForm.closest('.contact-form-container');
    if (formContainer) {
        // Only apply on desktop - not on touch devices
        if (window.matchMedia('(min-width: 1024px)').matches) {
            formContainer.addEventListener('mousemove', (e) => {
                const form = formContainer.querySelector('.contact-form');
                if (!form) return;
                
                const rect = form.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Calculate rotation based on mouse position
                // with subtle effect (max 2 degrees)
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateY = ((x - centerX) / centerX) * 2;
                const rotateX = ((centerY - y) / centerY) * 1;
                
                form.style.transform = `
                    translateY(-10px) 
                    translateZ(20px)
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg)
                `;
            });
            
            formContainer.addEventListener('mouseleave', () => {
                const form = formContainer.querySelector('.contact-form');
                if (!form) return;
                
                // Reset transform on mouse leave
                form.style.transform = '';
            });
        }
    }
}

/**
 * Header Scroll Effect
 * Changes header appearance on scroll
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    const scrollThreshold = 50; // Amount of scroll before header changes
    
    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        // Add 'scrolled' class when scrolled down
        if (currentScrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Add 'hidden' class when scrolling down fast (for hiding header)
        if (currentScrollY > lastScrollY + 50 && currentScrollY > 300) {
            header.classList.add('hidden');
        } else if (currentScrollY < lastScrollY - 10 || currentScrollY < 300) {
            header.classList.remove('hidden');
        }
        
        lastScrollY = currentScrollY;
    }
    
    // Add CSS for the new classes
    const style = document.createElement('style');
    style.textContent = `
        .header.scrolled {
            background-color: rgba(255, 255, 255, 0.95);
            box-shadow: var(--shadow-sm);
        }
        
        [data-theme="dark"] .header.scrolled {
            background-color: rgba(18, 18, 18, 0.95);
        }
        
        .header.hidden {
            transform: translateY(-100%);
        }
    `;
    document.head.appendChild(style);
    
    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateHeader);
    });
    
    // Run once on page load
    updateHeader();
}

/**
 * Skill Bars Animation
 * Animates skill level bars when they come into view
 */
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-level');
    if (!skillBars.length) return;
    
    const animateSkillBars = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const levelBar = entry.target.querySelector('.level-bar');
                const level = entry.target.dataset.level;
                
                // First set width to 0 and then animate to actual level
                levelBar.style.width = '0%';
                
                // Use setTimeout to create a small delay for better visual effect
                setTimeout(() => {
                    levelBar.style.width = `${level}%`;
                    levelBar.style.transition = 'width 1.5s cubic-bezier(0.1, 0.45, 0.1, 1)';
                }, 100);
                
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    };
    
    const skillObserver = new IntersectionObserver(animateSkillBars, {
        root: null,
        threshold: 0.1,
        rootMargin: '-50px'
    });
    
    skillBars.forEach(bar => {
        // Reset initial state (will be animated by JS)
        const levelBar = bar.querySelector('.level-bar');
        if (levelBar) levelBar.style.width = '0%';
        
        skillObserver.observe(bar);
    });
}

/**
 * Scroll Animations
 * Adds subtle animations to elements as they enter the viewport
 */
function initAnimations() {
    // Select elements to animate
    const animatedElements = document.querySelectorAll(
        '.hero-content, .hero-image, .about-text, .about-stats, ' +
        '.project-card, .skill-category, .experience-item, .contact-info, ' +
        '.contact-form-container, .section-header'
    );
    
    if (!animatedElements.length) return;
    
    // Add initial styles to hide elements
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s var(--transition-medium), transform 0.8s var(--transition-medium);
        }
        
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .fade-in-left {
            opacity: 0;
            transform: translateX(-30px);
            transition: opacity 0.8s var(--transition-medium), transform 0.8s var(--transition-medium);
        }
        
        .fade-in-left.visible {
            opacity: 1;
            transform: translateX(0);
        }
        
        .fade-in-right {
            opacity: 0;
            transform: translateX(30px);
            transition: opacity 0.8s var(--transition-medium), transform 0.8s var(--transition-medium);
        }
        
        .fade-in-right.visible {
            opacity: 1;
            transform: translateX(0);
        }
    `;
    document.head.appendChild(style);
    
    // Apply appropriate animation class based on element type
    animatedElements.forEach((element, index) => {
        // Determine which animation to use based on element class
        let animationClass = 'fade-in';
        
        if (element.classList.contains('hero-content') || 
            element.classList.contains('about-text') ||
            element.classList.contains('contact-info')) {
            animationClass = 'fade-in-left';
        } else if (element.classList.contains('hero-image') || 
                   element.classList.contains('about-stats') ||
                   element.classList.contains('contact-form-container')) {
            animationClass = 'fade-in-right';
        }
        
        // Apply animation class
        element.classList.add(animationClass);
        
        // Apply staggered delay for certain element groups
        if (element.classList.contains('project-card') || 
            element.classList.contains('skill-item') ||
            element.classList.contains('experience-item')) {
            element.style.transitionDelay = `${index * 0.1}s`;
        }
    });
    
    // Create intersection observer
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stop observing after animation
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-50px'
    });
    
    // Observe all animated elements
    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
    
    // Special animation for section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.classList.add('fade-in');
    });
}

/**
 * Apple-inspired cursor effect for interactive elements
 * Creates a subtle "magnetic" effect on buttons and links
 */
function initMagneticElements() {
    const magneticElements = document.querySelectorAll(
        '.primary-button, .secondary-button, .project-card, .social-link'
    );
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Smaller movement for subtle effect
            const strength = 10;
            const moveX = x / strength;
            const moveY = y / strength;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            // Reset position with transition
            element.style.transition = 'transform 0.3s ease';
            element.style.transform = 'translate(0, 0)';
            
            // Remove transition property after animation completes
            setTimeout(() => {
                element.style.transition = '';
            }, 300);
        });
    });
}

/**
 * Particle Background
 * Adds a particle effect to the hero section
 */
function initParticleBackground() {
    // Create canvas element for particles
    const canvas = document.createElement('canvas');
    canvas.classList.add('particle-canvas');
    const heroSection = document.querySelector('.hero');
    
    if (!heroSection) return;
    
    // Insert canvas as first child of hero section
    heroSection.insertBefore(canvas, heroSection.firstChild);
    
    // Add canvas styles
    const style = document.createElement('style');
    style.textContent = `
        .particle-canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            opacity: 0.7;
            pointer-events: none;
        }
        
        .hero .container {
            position: relative;
            z-index: 1;
        }
    `;
    document.head.appendChild(style);
    
    // Canvas setup
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 50;
    
    // Resize canvas
    function resizeCanvas() {
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Create particles
    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 5 + 1,
                speedX: Math.random() * 1 - 0.5,
                speedY: Math.random() * 1 - 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    // Draw particles
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Check current theme
        const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
        const particleColor = isDarkTheme ? '10, 132, 255' : '0, 113, 227';  // RGB values for theme colors
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${particleColor}, ${particle.opacity})`;
            ctx.fill();
            
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x > canvas.width || particle.x < 0) {
                particle.speedX *= -1;
            }
            
            if (particle.y > canvas.height || particle.y < 0) {
                particle.speedY *= -1;
            }
        });
        
        // Connect particles with lines if they're close
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${particleColor}, ${0.1 * (1 - distance / 120)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(drawParticles);
    }
    
    // Initialize particles
    createParticles();
    drawParticles();
    
    // React to mouse movement
    heroSection.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        particles.forEach(particle => {
            // Calculate distance between mouse and particle
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Move particles away from mouse
            if (distance < 100) {
                const angle = Math.atan2(dy, dx);
                const force = (100 - distance) / 500;
                particle.speedX -= Math.cos(angle) * force;
                particle.speedY -= Math.sin(angle) * force;
            }
        });
    });
}

/**
 * Typed Text Animation
 * Adds a typing effect to the hero title
 */
function initTypedText() {
    const titleElement = document.querySelector('.hero .title');
    if (!titleElement) return;
    
    // Store original text
    const originalText = titleElement.textContent;
    titleElement.textContent = '';
    
    // Create typing container
    const typingContainer = document.createElement('div');
    typingContainer.classList.add('typing-container');
    titleElement.appendChild(typingContainer);
    
    // Create static part
    const staticPart = document.createElement('span');
    staticPart.textContent = 'Full-Stack ';
    typingContainer.appendChild(staticPart);
    
    // Create dynamic part with cursor
    const dynamicPart = document.createElement('span');
    dynamicPart.classList.add('dynamic-text');
    const cursor = document.createElement('span');
    cursor.classList.add('cursor');
    cursor.textContent = '|';
    
    typingContainer.appendChild(dynamicPart);
    typingContainer.appendChild(cursor);
    
    // Add CSS
    const style = document.createElement('style');
    style.textContent = `
        .typing-container {
            display: inline-block;
        }
        
        .dynamic-text {
            color: var(--color-accent);
        }
        
        .cursor {
            color: var(--color-accent);
            font-weight: bold;
            animation: blink 1s infinite;
            margin-left: 2px;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Define skill words to rotate through
    const skills = ['Developer', 'Designer', 'Problem Solver', 'Innovator', 'Creator'];
    let currentSkillIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeText() {
        const currentSkill = skills[currentSkillIndex];
        
        if (isDeleting) {
            // Delete text
            dynamicPart.textContent = currentSkill.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typingSpeed = 50; // Faster when deleting
        } else {
            // Add text
            dynamicPart.textContent = currentSkill.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typingSpeed = 100; // Normal speed when typing
        }
        
        // Check if word is complete
        if (!isDeleting && currentCharIndex === currentSkill.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause before deleting
        } 
        // Check if deletion is complete
        else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentSkillIndex = (currentSkillIndex + 1) % skills.length; // Move to next skill
            typingSpeed = 500; // Pause before typing next word
        }
        
        setTimeout(typeText, typingSpeed);
    }
    
    // Start typing animation
    setTimeout(typeText, 1000);
}

/**
 * Create stars for dark mode
 */
function initStars() {
    // Create stars container
    const starsContainer = document.createElement('div');
    starsContainer.classList.add('stars');
    document.body.appendChild(starsContainer);
    
    // Create stars
    const starCount = 100; // Adjust based on preference
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position
        const x = Math.floor(Math.random() * 100);
        const y = Math.floor(Math.random() * 100);
        
        // Random size (smaller stars more common)
        const size = Math.random() * 0.2 + 0.1; // 0.1px to 0.3px
        
        // Random twinkle animation duration
        const duration = Math.random() * 4 + 3; // 3-7 seconds
        
        // Set styles
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDuration = `${duration}s`;
        
        // Add to container
        starsContainer.appendChild(star);
    }
    
    // Add some larger "highlight" stars
    for (let i = 0; i < 15; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position
        const x = Math.floor(Math.random() * 100);
        const y = Math.floor(Math.random() * 100);
        
        // Slightly larger size
        const size = Math.random() * 0.7 + 0.3; // 0.3px to 1px
        
        // Random twinkle animation duration
        const duration = Math.random() * 3 + 2; // 2-5 seconds
        
        // Set styles
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDuration = `${duration}s`;
        star.style.boxShadow = '0 0 2px rgba(255, 255, 255, 0.7)';
        
        // Add to container
        starsContainer.appendChild(star);
    }
}

/**
 * Project Card Effects 
 * Enhances the project cards with 3D hover effects
 */
function initProjectCardEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add floating animation
            card.style.transform = 'translateY(-16px) scale(1.02) rotateX(5deg) rotateY(2deg)';
            card.style.boxShadow = '0 20px 40px -20px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(var(--color-accent-rgb), 0.1), 0 0 30px -5px rgba(var(--color-accent-rgb), 0.25)';
            card.style.zIndex = '2';
            
            // Animate image scale
            const img = card.querySelector('.project-image img');
            if (img) {
                img.style.transform = 'scale(1.1)';
            }
            
            // Animate content
            const content = card.querySelector('.project-content');
            if (content) {
                content.style.transform = 'translateZ(40px)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            // Remove effects on mouse leave
            card.style.transform = '';
            card.style.boxShadow = '';
            card.style.zIndex = '1';
            
            // Reset image
            const img = card.querySelector('.project-image img');
            if (img) {
                img.style.transform = '';
            }
            
            // Reset content
            const content = card.querySelector('.project-content');
            if (content) {
                content.style.transform = '';
            }
        });
        
        // Add interactive hover for tech tags inside cards
        const techTags = card.querySelectorAll('.tech-tag');
        techTags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                tag.style.backgroundColor = 'var(--color-accent)';
                tag.style.color = 'white';
                tag.style.transform = 'translateY(-3px)';
                tag.style.boxShadow = '0 3px 8px rgba(var(--color-accent-rgb), 0.3)';
            });
            
            tag.addEventListener('mouseleave', () => {
                tag.style.backgroundColor = '';
                tag.style.color = '';
                tag.style.transform = '';
                tag.style.boxShadow = '';
            });
        });
    });
}

/**
 * Experience Timeline Animations
 * Adds interactive elements to the experience timeline
 */
function initExperienceAnimations() {
    const experienceItems = document.querySelectorAll('.experience-item');
    
    experienceItems.forEach(item => {
        // Create an observer for each experience item
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add special animation class
                    entry.target.classList.add('animate-experience');
                    
                    // Add pulse animation to the timeline node
                    const timelineNode = entry.target.querySelector('.experience-content::before');
                    if (timelineNode) {
                        timelineNode.style.animation = 'pulse 1.5s infinite';
                    }
                    
                    // Stop observing after animation
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        // Start observing each experience item
        observer.observe(item);
        
        // Add interactive hover effect
        item.addEventListener('mouseenter', () => {
            const content = item.querySelector('.experience-content');
            if (content) {
                content.style.transform = 'translateY(-5px) scale(1.02)';
                content.style.boxShadow = 'var(--shadow-md)';
                content.style.borderLeft = '4px solid var(--color-accent)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const content = item.querySelector('.experience-content');
            if (content) {
                content.style.transform = '';
                content.style.boxShadow = '';
                content.style.borderLeft = '';
            }
        });
    });
    
    // Add styles for experience animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-experience {
            animation: slide-in-right 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        
        @keyframes slide-in-right {
            0% {
                transform: translateX(30px);
                opacity: 0;
            }
            100% {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
        }
        
        .experience-content {
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                        box-shadow 0.3s ease,
                        border-left 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialize Skill Icons
 * Adds SVG icons for each technology in the skills section
 */
function initSkillIcons() {
  // Get all skill items
  const skillItems = document.querySelectorAll('.skill-item');
  
  // Map of skill names to their SVG icons
  const skillIcons = {
    'react': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M12 9.861A2.139 2.139 0 1 0 12 14.139 2.139 2.139 0 1 0 12 9.861zM6.008 16.255l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 0 0 1.363 3.578l.101.213-.101.213a23.307 23.307 0 0 0-1.363 3.578l-.133.467zM5.317 8.95c-2.674.751-4.315 1.9-4.315 3.046 0 1.145 1.641 2.294 4.315 3.046a24.95 24.95 0 0 1 1.182-3.046A24.752 24.752 0 0 1 5.317 8.95zM17.992 16.255l-.133-.469a23.357 23.357 0 0 0-1.364-3.577l-.101-.213.101-.213a23.42 23.42 0 0 0 1.364-3.578l.133-.468.473.119c3.517.889 5.535 2.398 5.535 4.14s-2.018 3.25-5.535 4.139l-.473.12zm-.491-4.259c.48 1.039.877 2.06 1.182 3.046 2.675-.752 4.315-1.901 4.315-3.046 0-1.146-1.641-2.294-4.315-3.046a24.788 24.788 0 0 1-1.182 3.046zM5.31 8.945l-.133-.467C4.188 4.992 4.488 2.494 6 1.622c1.483-.856 3.864.155 6.359 2.716l.34.349-.34.349a23.552 23.552 0 0 0-2.422 2.967l-.135.193-.235.02a23.657 23.657 0 0 0-3.785.61l-.472.119zm1.896-6.63c-.268 0-.505.058-.705.173-.994.573-1.17 2.565-.485 5.253a25.122 25.122 0 0 1 3.233-.501 24.847 24.847 0 0 1 2.052-2.544c-1.56-1.519-3.037-2.381-4.095-2.381z"/>
    </svg>`,
    
    'javascript': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.09.563.315.732.676.775-.507.775-.507 1.316-.844-.203-.314-.304-.451-.439-.586-.473-.528-1.103-.798-2.126-.775l-.528.067c-.507.124-.991.395-1.283.754-.855.968-.608 2.655.427 3.354 1.023.765 2.521.933 2.712 1.653.18.878-.652 1.159-1.475 1.058-.607-.136-.945-.439-1.316-1.002l-1.372.788c.157.359.337.517.607.832 1.305 1.316 4.568 1.249 5.153-.754.021-.067.18-.528.056-1.237l.034.049zm-6.737-5.434h-1.686c0 1.453-.007 2.898-.007 4.354 0 .924.047 1.772-.104 2.033-.247.517-.886.451-1.175.359-.297-.146-.448-.349-.623-.641-.047-.078-.082-.146-.095-.146l-1.368.844c.229.473.563.879.994 1.137.641.383 1.502.507 2.404.305.588-.17 1.095-.519 1.358-1.059.384-.697.302-1.553.299-2.509.008-1.541 0-3.083 0-4.635l.003-.042z"/>
    </svg>`,
    
    'typescript': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M3 3h18v18H3V3zm10.71 14.29c.18.19.43.3.7.3a1.003 1.003 0 0 0 .71-1.71c-.18-.18-.43-.29-.71-.29a1.003 1.003 0 0 0-.7 1.7zM12 13.54L9.82 17H8.53l3.12-4.67-3.36-4.67h1.33L12 11.07l2.38-3.41h1.33l-3.36 4.67L15.47 17h-1.29L12 13.54zm2.12-7.79l-7.79 7.79-.71-.71 7.79-7.79.71.71z"/>
    </svg>`,
    
    'css': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M5.2 1h13.6l-1.222 14-5.596 1.895-5.474-1.892L5.2 1zm13.075 2H5.707l.284 3.4h8.279l-.206 2.285H8.452l.231 3.086h5.447l-.314 3.42-3.12.803-3.062-.804-.22-2.316H5.251l.366 4.477 4.203 1.42 4.197-1.458.957-10.314z"/>
    </svg>`,
    
    'html': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M5.136 1h13.728l-1.295 14.704L12 18.926l-5.57-3.22L5.136 1zm11.677 3.627H7.189l.328 3.84h8.936l-.264 2.99H8.656l.297 3.79 3.09.068 3.188-1.054.343-3.738h-6.96l-.328-3.933h10.958l-.131 1.465.066.834-.066.853-.131 1.798-.065.833-.66.834-.13 1.467-.067.834-.197 2.497L12 16.452l-.067.04-3.936-1.055-.262-3.149h1.967l.132 1.386 2.099.591 2.098-.59.263-2.895H7.518l-.396-5.07-.13-1.466-.065-.834.065-.833.131-1.467z"/>
    </svg>`,
    
    'node': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12c.95.46 1.27.47 1.7.47 1.38 0 2.17-.84 2.17-2.3V9.04c0-.12-.1-.22-.22-.22h-.93c-.12 0-.22.1-.22.22v7.54c0 .66-.68 1.31-1.77.76L3.27 16.23a.26.26 0 01-.13-.22V7.96c0-.1.05-.2.13-.26l7.4-4.29c.08-.04.17-.04.25 0l7.4 4.29c.08.06.13.15.13.26v8.06c0 .11-.04.17-.12.22l-7.4 4.29c-.08.05-.17.05-.25 0l-1.87-1.14a.182.182 0 00-.23 0c-.57.32-.68.36-1.21.52-.13.04-.3.11.07.32l2.48 1.47c.24.14.5.21.78.21s.54-.07.78-.21l7.44-4.29c.48-.28.78-.8.78-1.36V7.7c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.12-.5-.19-.78-.19z"/>
    </svg>`,
    
    'python': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M14.31.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.83l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.23l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05L0 11.97l.06-1.22.16-.98.24-.8.32-.65.36-.52.4-.38.41-.27.42-.17.4-.07.37.01h.32l.28.04.21.06.13.06.2.16.24.28.25.43.23.61.2.83.14 1.09v.77h1.79l-.05.55-.17.47-.3.38-.44.28-.59.09H6.64v.36l.03.49.07.44.11.39.15.33.19.28.22.23.25.17.27.13.26.08.25.04.23.01h5.1l.62-.05.53-.15.44-.24.35-.31.29-.35.23-.37.18-.36.13-.34.1-.29.06-.24.04-.17.02-.11.01-.05z"/>
      <path d="M9.79 8.5l-.62.05-.53.15-.44.24-.35.31-.29.35-.23.37-.18.36-.13.34-.1.29-.06.24-.04.17-.02.11-.01.05.06.16.14.27.23.33.32.36.44.34.58.28.74.16.92.01 1.11-.17.95-.37.78-.55.58-.73.4-.9.22-1.08.05-1.23-.13-.95-.3-.79-.5-.65-.67-.51-.84-.39-.99-.28-1.13-.18z"/>
    </svg>`,
    
    'django': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M7.533 5.6H4.8V17.6h2.733v-4.619h2.486c2.967 0 4.577-2.167 4.577-4.63 0-2.363-1.52-4.751-4.577-4.751H7.533zm2.366 6.647H7.533V7.334h2.366c1.59 0 2.417 1.095 2.417 2.401 0 1.408-.883 2.512-2.417 2.512z"/>
      <path d="M19.2 9.734v7.866h-2.733v-7.866H19.2zM17.867 2.4h2.733v2.733h-2.733V2.4z"/>
    </svg>`,
    
    'mongodb': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M12 1C6.226 1 3 4.097 3 9.588c0 5.284 2.865 7.11 3.615 7.11.585.03.585-1.407.585-1.407V4.513s.178-.487.585-.487c.408 0 .585.487.585.487v11.59s-.178 1.5.585 1.5c.763 0 3.508-2.748 3.508-8.006 0-5.266-3.708-8.4-9.23-8.326L12 1zm0 2.972c-.585.097-3.508.683-3.508 6.534 0 5.85 2.923 6.436 3.508 6.534.585-.098 3.508-.684 3.508-6.534 0-5.85-2.923-6.436-3.508-6.534z"/>
    </svg>`,
    
    'postgresql': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M17.128 0a10.134 10.134 0 0 0-2.755.403l-.063.02A10.922 10.922 0 0 0 12.6.258C11.422.238 10.41.524 9.594 1 8.79.721 7.122.24 5.364.336 4.14.403 2.804.775 1.814 1.82.827 2.865.305 4.482.415 6.682c.03.607.203 1.597.49 2.879s.69 2.783 1.193 4.152c.503 1.37 1.054 2.6 1.915 3.436.43.419 1.022.771 1.72.742.49-.02.933-.235 1.315-.552.186.245.385.352.566.451.228.125.45.21.68.266.413.103 1.12.241 1.948.1.282-.047.579-.139.875-.27.01.33.024.653.037.98.04 1.036.067 1.993.378 2.832.05.137.187.843.727 1.466.54.624 1.598 1.013 2.803.755.85-.182 1.931-.51 2.649-1.532.71-1.01 1.03-2.459 1.093-4.809.016-.127.035-.235.055-.336l.169.015h.02c.907.041 1.891-.088 2.713-.47.728-.337 1.279-.678 1.68-1.283.1-.15.21-.331.24-.643s-.149-.8-.446-1.025c-.595-.452-.969-.28-1.37-.197a6.27 6.27 0 0 1-1.202.146c1.156-1.947 1.985-4.015 2.458-5.845.28-1.08.437-2.076.45-2.947.013-.871-.058-1.642-.58-2.309C21.36.6 19.067.024 17.293.004c-.055-.001-.11-.002-.165-.001zm-.047.64c1.678-.016 3.822.455 5.361 2.422.346.442.449 1.088.437 1.884-.013.795-.16 1.747-.429 2.79-.522 2.02-1.508 4.375-2.897 6.488a.756.756 0 0 0 .158.086c.29.12.951.223 2.27-.048.332-.07.575-.117.827.075a.52.52 0 0 1 .183.425.704.704 0 0 1-.13.336c-.255.383-.758.746-1.403 1.045-.571.266-1.39.405-2.116.413-.364.004-.7-.024-.985-.113l-.018-.007c-.11 1.06-.363 3.153-.528 4.108-.132.77-.363 1.382-.804 1.84-.44.458-1.063.734-1.901.914-1.038.223-1.795-.017-2.283-.428-.487-.41-.71-.954-.844-1.287-.092-.23-.14-.528-.186-.926-.046-.398-.08-.885-.103-1.434a51.426 51.426 0 0 1-.03-2.523 3.061 3.061 0 0 1-1.552.76c-.689.117-1.304.002-1.671-.09a2.276 2.276 0 0 1-.52-.201c-.17-.091-.332-.194-.44-.397a.56.56 0 0 1-.057-.381.61.61 0 0 1 .218-.331c.198-.161.46-.251.855-.333.719-.148.97-.249 1.123-.37.13-.104.277-.314.537-.622a1.16 1.16 0 0 1-.003-.041 2.96 2.96 0 0 1-1.33-.358c-.15.158-.916.968-1.85 2.092-.393.47-.827.74-1.285.759-.458.02-.872-.211-1.224-.552-.703-.683-1.264-1.858-1.753-3.186-.488-1.328-.885-2.807-1.167-4.067-.283-1.26-.45-2.276-.474-2.766-.105-2.082.382-3.485 1.217-4.37.836-.885 1.982-1.22 3.099-1.284 2.005-.115 3.909.584 4.294.734.742-.504 1.698-.818 2.892-.798a7.39 7.39 0 0 1 1.681.218l.02-.009a6.854 6.854 0 0 1 .739-.214A9.626 9.626 0 0 1 17.08.642zm.152.67h-.146a8.74 8.74 0 0 0-1.704.192c1.246.552 2.187 1.402 2.85 2.25a8.44 8.44 0 0 1 1.132 1.92c.11.264.184.487.226.66.021.087.035.16.04.236.002.038.004.077-.012.144 0 .003-.005.01-.006.013.03.876-.187 1.47-.213 2.306-.02.606.135 1.318.173 2.095.036.73-.052 1.532-.526 2.319.04.048.076.096.114.144 1.254-1.975 2.158-4.16 2.64-6.023.258-1.003.395-1.912.407-2.632.01-.72-.124-1.242-.295-1.46-1.342-1.716-3.158-2.153-4.68-2.165zm-4.79.256c-1.182.003-2.03.36-2.673.895-.663.553-1.108 1.31-1.4 2.085-.347.92-.466 1.81-.513 2.414l.013-.008c.357-.2.826-.4 1.328-.516.502-.115 1.043-.151 1.533.039s.895.637 1.042 1.315c.704 3.257-.219 4.468-.559 5.382a9.61 9.61 0 0 0-.331 1.013c.043-.01.086-.022.129-.026.24-.02.428.06.54.108.342.142.577.44.704.78.033.089.057.185.071.284a.336.336 0 0 1 .02.127 55.14 55.14 0 0 0 .013 3.738c.023.538.057 1.012.1 1.386.043.373.104.657.143.753.128.32.315.739.653 1.024.338.284.823.474 1.709.284.768-.165 1.242-.394 1.559-.723.316-.329.505-.787.626-1.488.181-1.05.545-4.095.589-4.668-.02-.432.044-.764.182-1.017.142-.26.362-.419.552-.505.095-.043.184-.072.257-.093a5.956 5.956 0 0 0-.243-.325 4.456 4.456 0 0 1-.666-1.099 8.296 8.296 0 0 0-.257-.483c-.133-.24-.301-.54-.477-.877-.352-.675-.735-1.493-.934-2.29-.198-.796-.227-1.62.28-2.2.45-.517 1.24-.73 2.426-.61-.035-.105-.056-.192-.115-.332a7.817 7.817 0 0 0-1.041-1.764c-1.005-1.285-2.632-2.559-5.146-2.6H12.4zm-6.642.052c-.127 0-.254.004-.38.011-1.01.058-1.965.351-2.648 1.075-.684.724-1.134 1.911-1.036 3.876.019.372.181 1.414.459 2.652.277 1.238.67 2.695 1.142 3.982.473 1.287 1.046 2.407 1.59 2.937.274.265.512.372.728.363.217-.01.478-.135.797-.518a43.244 43.244 0 0 1 1.81-2.048 3.497 3.497 0 0 1-1.167-3.15c.103-.739.117-1.43.105-1.976-.012-.532-.05-.886-.05-1.107a.336.336 0 0 1 0-.019v-.005l-.001-.006v-.001a9.893 9.893 0 0 1 .592-3.376c.28-.744.697-1.5 1.322-2.112-.614-.202-1.704-.51-2.884-.568a7.603 7.603 0 0 0-.38-.01zM18.157 6.9c-.68.01-1.326.45-1.763 1.4-.445.97-.392 1.672-.21 2.34.181.666.523 1.361.86 2.004.339.643.695 1.255 1.011 1.729.316.474.601.829.711.922.21.18.492.226.712.12.22-.106.374-.329.463-.63.05-.17.08-.332.103-.46.023-.129.04-.22.068-.258.07-.096.262-.288.303-.419.04-.131.034-.294.007-.364a2.13 2.13 0 0 0-.056-.124 7.143 7.143 0 0 0-.35-.65c-.222-.38-.496-.826-.727-1.353-.231-.527-.42-1.116-.467-1.748-.046-.633.004-1.346.48-1.934.476-.588 1.359-.92 2.495-.894.02-.707.042-1.267.063-1.798.02-.518.038-.963.038-1.345 0-.328-.013-.564-.025-.715a1.978 1.978 0 0 0-.056-.333c-.02-.072-.05-.152-.105-.25-.055-.099-.149-.212-.307-.32-.157-.107-.387-.212-.697-.212-.309 0-.577.092-.755.195-.178.103-.293.208-.366.308-.072.099-.117.19-.15.276a3.67 3.67 0 0 0-.09.582c-.01.16-.019.358-.019.618 0 .124.003.254.01.387.006.133.019.273.038.42.02.143.046.296.086.448-.793-.013-1.593.003-2.285.024zM5.242 9.904c-.238.163-.53.284-.832.36-.303.075-.624.11-.923.108a2.25 2.25 0 0 1-.71-.116 1.264 1.264 0 0 1-.327-.179c.642 1.649 1.075 2.75 1.72 3.16.182.115.395.182.618.211.223.029.453.018.674-.043.365-.101.7-.294 1.006-.574a7.766 7.766 0 0 1-.714-1.089 5.895 5.895 0 0 1-.512-1.838zm9.924 2.399c-.53-.036-1.105.091-1.593.4-.488.31-.873.818-1.08 1.535-.238.834-.143 1.335.04 1.82.185.485.5.94.884 1.309.384.37.847.654 1.272.847.425.193.783.3.951.3.234.001.362-.088.42-.172.059-.084.09-.223.075-.412-.009-.112-.04-.324-.122-.686a5.564 5.564 0 0 0-.252-.747 3.692 3.692 0 0 0-.343-.678 1.858 1.858 0 0 0-.346-.425c.007.13.02.276.037.444.016.167.04.344.066.523.026.179.057.358.089.537.032.179.067.335.096.472.049.23.089.379.131.468.042.09.093.138.216.138.14 0 .395-.225.63-.508a2.192 2.192 0 0 0 .47-.787c.128-.314.181-.614.121-.813-.059-.199-.202-.322-.352-.376a2.12 2.12 0 0 0-.403-.08 2.93 2.93 0 0 0-.439-.012z"/>
    </svg>`,
    
    'graphql': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M14.109 13.373l-4.216-7.294h8.433l4.222 7.294-4.222 7.294h-8.435l4.218-7.294zm-4.898-6.024L4.993 13.63l4.218 7.294-8.434.001L.001 13.63l4.776-8.284 4.434.003zm5.584 12.048h-5.59l-2.79-4.834 2.798-4.828h5.583l2.788 4.83-2.789 4.832z"/>
    </svg>`,
    
    'docker': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M13.983 11.078h2.12a.38.38 0 00.382-.382.385.385 0 00-.382-.382h-2.12a.38.38 0 00-.382.382c0 .21.172.382.382.382z"/>
      <path d="M23.13 10.382c-.507-.292-1.232-.247-1.83-.154-.057-4.082-2.586-5.944-5.81-5.944-2.902 0-5.32 2.089-5.943 4.876-1.76-.182-3.264.76-3.95 2.304-1.687.2-2.888 1.316-3.262 2.748C.75 14.458 0 15.631 0 16.689c0 1.32.745 2.542 1.936 3.262.966.547 2.088.57 3.15.504C6.237 20.5 7.39 20.5 8.545 20.5h9.85c1.124 0 2.233-.012 3.361-.096.996.134 2.058.033 2.93-.51C23.56 19.205 24 18.094 24 16.94c0-1.237-.466-2.39-1.364-3.177-.267-.264-.624-.513-.995-.673zM0 16.689c0-.562.23-1.086.62-1.498l.006-.006a2.5 2.5 0 012.249-1.037l.276.011c.132.005.263.011.393.011.177 0 .351-.011.518-.033l.021-.001v-.013c.327-1.1.496-2.292.618-2.962.26-1.48 1.343-2.55 2.75-2.702.256-.027.512-.04.765-.04.736 0 1.46.142 2.134.425.533.251.97.58 1.285.975.554.703.818 1.59.844 2.858a8.11 8.11 0 01-.064.812C12.357 13.64 12.355 14 12.355 14h8.87c.197-.013.39.01.584.035.013 0 .025.002.038.004l.012.002.007.001h.002a3.392 3.392 0 12.361.857c.232.15.439.31.618.488.43.428.654.95.654 1.554 0 .546-.177 1.075-.498 1.483-.541.673-1.316.926-1.934.926-.275 0-.542-.042-.79-.117a.29.29 0 00-.089-.014l-.025.002h-.001c-.058.006-.172.015-.296.015-.161 0-.343-.019-.52-.057a17.7 17.7 0 01-1.096.041H8.546c-1.143 0-2.291-.012-3.43-.06a12.08 12.08 0 01-1.501.064c-.239 0-.475-.012-.695-.036-.425-.038-.818-.144-1.155-.3C1.09 18.704.693 18.06.693 17.21c0-.229.037-.443.105-.647.233-.687.772-1.326 1.54-1.614v-.506c-.479.201-.919.478-1.235.86a2.273 2.273 0 00-.694 1.62c0 .682.249 1.328.683 1.826-.991-.456-1.092-1.967-1.092-2.06z"/>
      <path d="M13.983 11.078h2.12a.38.38 0 00.382-.382.385.385 0 00-.382-.382h-2.12a.38.38 0 00-.382.382c0 .21.172.382.382.382z"/>
      <path d="M10.067 11.898h2.12c.21 0 .382-.172.382-.382a.385.385 0 00-.382-.382h-2.12a.38.38 0 00-.382.382c0 .21.172.382.382.382z"/>
      <path d="M11.108 14.547h2.12c.21 0 .382-.172.382-.382a.385.385 0 00-.382-.382h-2.12a.38.38 0 00-.382.382c0 .21.172.382.382.382z"/>
      <path d="M6.15 14.547h2.12c.21 0 .382-.172.382-.382a.385.385 0 00-.382-.382h-2.12a.38.38 0 00-.382.382c0 .21.172.382.382.382z"/>
      <path d="M6.625 11.898h2.12c.21 0 .382-.172.382-.382a.385.385 0 00-.382-.382h-2.12a.38.38 0 00-.382.382c0 .21.172.382.382.382z"/>
      <path d="M8.2 9.19h2.12c.21 0 .382-.172.382-.382a.385.385 0 00-.382-.382H8.2a.38.38 0 00-.381.382c0 .21.172.382.381.382z"/>
    </svg>`,
    
    'kubernetes': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M10.204 14.35l.007.01-.999 2.413a5.171 5.171 0 01-2.075-2.597l2.578-.437.013.042c.094.19.208.374.476.57zm-.833-2.129a4.786 4.786 0 00-.006-.014l-2.679-.38c.157-1.137.708-2.13 1.496-2.858l1.895 1.889-.006.006c-.075.173-.124.373-.124.583 0 .342.14.657.37.881zm2.437-2.312c.19.094.374.208.57.476l.01.007 2.413-.999a5.171 5.171 0 00-2.597-2.075l-.437 2.578.042.013zm2.17.742a4.78 4.78 0 01.014.006l.38-2.679a5.232 5.232 0 00-2.858 1.496l1.889 1.895.006-.006c.173-.075.373-.124.583-.124.342 0 .657.14.881.37zm.74 2.437c.095.19.209.374.477.57l.007.01 2.413-.999a5.14 5.14 0 00-2.075-2.597l-.437 2.578.042.013zm.746 2.039c.381.18.703.55.803.978l.017.075 2.721-.28c-.193-1.36-.9-2.57-1.92-3.399l-1.708 2.126.01.064c.02.192.033.391.033.591 0 0-.02 0 .044-.155zm-1.844 1.816a1.26 1.26 0 01-.569.476l-.01.007.999 2.412a5.13 5.13 0 002.597-2.074l-2.578-.437-.013.042c-.094.19-.208.373-.426.399v-.825zm-1.27.743c-.06.001-.11.003-.155.044h-.006l.28 2.721c1.36-.193 2.572-.9 3.401-1.92l-2.126-1.709-.064.01c-.192.02-.391.033-.591.033l-.739.821zM11.978 1.5c6.627 0 12 5.373 12 12s-5.373 12-12 12-12-5.373-12-12 5.373-12 12-12zM5.969 14.345l-.407 2.57c-.094.592.345 1.14.937 1.234.086.014.17.02.254.02a1.13 1.13 0 001.032-.712l.615-1.482a.216.216 0 00-.086-.285 6.226 6.226 0 01-2.345-1.345zm4.296 2.711a6.25 6.25 0 01-2.678-.597.214.214 0 00-.282.097l-.915 2.204a1.132 1.132 0 00.593 1.481c.088.038.177.064.27.08.49.111 1.064-.089 1.284-.512l1.729-3.224c0-.2.001-.39.0-.59l-.001.061zm-1.837-13.457l-1.72-3.208c-.23-.425-.8-.625-1.28-.515a1.123 1.123 0 00-.864 1.562l.913 2.204a.217.217 0 00.234.111 6.11 6.11 0 012.717-.615v.461zm11.573 2.183c-.306-.471-.945-.607-1.397-.278l-1.981 1.402a.216.216 0 00-.075.275 6.217 6.217 0 01.437 2.318h-.462l.013-.056 1.352-4.176a1.133 1.133 0 00-.694-1.45 1.13 1.13 0 00-1.431.635l-1.344 4.066a6.19 6.19 0 01-.216-.898.215.215 0 00-.2-.168l-2.646-.366a1.13 1.13 0 00-1.252.994 1.131 1.131 0 00.98 1.2l2.537.348c.1.002.186-.066.213-.162a6.198 6.198 0 011.837-2.885l.043.027-.868 2.676c-.027.09.007.187.082.242a6.223 6.223 0 012.016 1.79.216.216 0 00.273.037l2.041-1.277a1.127 1.127 0 00.337-1.655zm-3.253 9.862l2.532 1.945a1.129 1.129 0 001.575-.268 1.129 1.129 0 00-.213-1.59l-2.346-1.732a.214.214 0 00-.279.041 6.23 6.23 0 01-1.631 1.304.215.215 0 00-.105.263l.467.037zm-.056-3.699c.108-.018.175-.121.157-.23a6.172 6.172 0 01-.019-2.367.217.217 0 00-.1-.241l-2.587-1.452a1.13 1.13 0 00-1.545.413 1.13 1.13 0 00.408 1.545l2.307 1.296.025.052c.064.137.13.273.203.407.014.022.031.041.05.057l.899.459.202.061zm-8.361-3.075l-4.307-.586a1.13 1.13 0 00-1.28.97 1.131 1.131 0 00.97 1.28l4.309.586a.217.217 0 00.235-.14 6.237 6.237 0 01.891-1.577.216.216 0 00-.01-.283l-.808-.25z"/>
    </svg>`,
    
    'git': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M23.546 10.93L13.067.452a1.55 1.55 0 00-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 012.327 2.341l2.658 2.66a1.838 1.838 0 011.9 1.79c0 1.013-.815 1.829-1.828 1.829a1.827 1.827 0 01-1.827-1.828 1.84 1.84 0 01.372-1.105l-2.484-2.482v6.530a1.843 1.843 0 01.977 3.344 1.834 1.834 0 01-2.603-2.603c.258-.265.97-.973.97-.973V8.667a1.83 1.83 0 01-.974-.973L5.69 4.465 0 10.155a1.55 1.55 0 000 2.188l10.48 10.48a1.55 1.55 0 002.189 0l10.43-10.43a1.55 1.55 0 000-2.189"/>
    </svg>`,
    
    'responsive design': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
    </svg>`,
    
    'express': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M24 18.588a1.529 1.529 0 01-1.895-.72l-3.45-4.771-.5-.667-4.003 5.444a1.466 1.466 0 01-1.802.708l5.158-6.92-4.798-6.251a1.595 1.595 0 011.9.666l3.576 4.83 3.596-4.81a1.435 1.435 0 011.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 000 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27 1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.078 4.078 0 002.582-2.876c.207-.666.548-.78 1.174-.588a5.417 5.417 0 01-2.589 3.957 6.272 6.272 0 01-7.306-.933 6.575 6.575 0 01-1.64-3.858c0-.235-.08-.455-.134-.666A88.33 88.33 0 010 11.577zm1.127-.286h9.654c-.06-3.076-2.001-5.258-4.59-5.278-2.882-.04-4.944 2.094-5.071 5.264z"/>
    </svg>`,
    
    'next.js': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 01-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 00-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 00-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 01-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 01-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 01.174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 004.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 002.466-2.163 11.944 11.944 0 002.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 00-2.499-.523A33.119 33.119 0 0011.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 01.237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 01.233-.296c.096-.05.13-.054.5-.054z"/>
    </svg>`,
    
    'sass': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M12 2.121c2.671 0 4.985.502 6.942 1.505 1.958 1.003 2.937 2.254 2.937 3.754 0 1.198-.587 2.245-1.762 3.139-1.175.894-2.717 1.548-4.624 1.962.303.357.577.775.82 1.254.244.479.366.995.366 1.547 0 1.382-.409 2.428-1.228 3.139-.818.711-1.838 1.066-3.058 1.066a4.403 4.403 0 01-2.038-.46c-.599-.307-1.105-.719-1.518-1.234-.5.642-1.078 1.121-1.731 1.437a4.323 4.323 0 01-2.212.476c-1.22 0-2.24-.355-3.058-1.066C1.658 17.928 1.25 16.882 1.25 15.5c0-.69.156-1.401.469-2.135a6.324 6.324 0 011.366-1.918 6.792 6.792 0 01-.485-1.288 4.056 4.056 0 01-.219-1.318c0-1.5.679-2.751 2.037-3.754C6.015 2.623 8.329 2.121 11 2.121zm0 17.77c.667 0 1.237-.173 1.711-.519.473-.345.709-.79.709-1.333 0-.417-.124-.855-.374-1.313-.25-.458-.587-.888-1.013-1.288a9.437 9.437 0 01-1.534-1.62 8.57 8.57 0 01-1.08-1.69c-.977.073-1.846.325-2.607.756-.761.432-1.142.93-1.142 1.497 0 .417.174.82.523 1.209.348.388.78.711 1.299.965-.64.513-1.139.987-1.494 1.422-.356.435-.534.871-.534 1.309 0 .506.247.937.741 1.293.494.355 1.06.533 1.696.533.394 0 .79-.075 1.188-.226.397-.15.724-.344.981-.58a4.844 4.844 0 00.765 1.074c.304.326.607.572.907.736.301.164.63.246.989.246.394 0 .704-.093.93-.279.225-.186.358-.399.399-.638l-.82-.031c-.356-.013-.58-.21-.674-.592-.093-.382-.057-.913.108-1.593zm-1.666-11.207c.439.499.84.965 1.204 1.4.363.433.67.831.92 1.192.25.362.466.723.649 1.086.183.362.33.724.442 1.086 1.205-.352 2.169-.795 2.891-1.327.723-.533 1.084-1.139 1.084-1.819 0-1.016-.691-1.869-2.073-2.56-1.381-.692-3.193-1.037-5.433-1.037-2.188 0-3.973.382-5.358 1.146C3.275 8.607 2.583 9.591 2.583 10.5c0 .424.08.815.242 1.17.161.356.366.688.617.996a8.568 8.568 0 01.981-1.359c.382-.433.784-.834 1.203-1.204a14.81 14.81 0 011.341-1.022c.463-.307.942-.57 1.438-.786.496-.217.977-.38 1.444-.493.466-.113.935-.169 1.404-.169.47 0 .877.047 1.222.14.345.095.62.23.825.408.205.178.307.4.307.666 0 .288-.051.55-.154.785a7.125 7.125 0 01-.374.739c-.15.23-.316.446-.498.646a5.88 5.88 0 01-.553.524z"/>
    </svg>`
  };
  
  // Add icons to skill items
  skillItems.forEach(item => {
    const title = item.querySelector('h4');
    const iconContainer = item.querySelector('.skill-icon');
    
    if (!iconContainer || !title) return;
    
    const titleText = title.textContent.toLowerCase();
    let iconSvg = null;
    
    // Match skill name to icon
    if (titleText.includes('react') || titleText.includes('next')) {
      iconSvg = skillIcons.react;
    } else if (titleText.includes('javascript')) {
      iconSvg = skillIcons.javascript;
    } else if (titleText.includes('typescript')) {
      iconSvg = skillIcons.typescript;
    } else if (titleText.includes('css') || titleText.includes('sass')) {
      iconSvg = titleText.includes('sass') ? skillIcons.sass : skillIcons.css;
    } else if (titleText.includes('html')) {
      iconSvg = skillIcons.html;
    } else if (titleText.includes('node') || titleText.includes('express')) {
      iconSvg = titleText.includes('express') ? skillIcons.express : skillIcons.node;
    } else if (titleText.includes('python') || titleText.includes('django')) {
      iconSvg = titleText.includes('django') ? skillIcons.django : skillIcons.python;
    } else if (titleText.includes('mongo')) {
      iconSvg = skillIcons.mongodb;
    } else if (titleText.includes('sql') || titleText.includes('postgre')) {
      iconSvg = skillIcons.postgresql;
    } else if (titleText.includes('docker') || titleText.includes('container')) {
      iconSvg = skillIcons.docker;
    } else if (titleText.includes('kube')) {
      iconSvg = skillIcons.kubernetes;
    } else if (titleText.includes('graphql')) {
      iconSvg = skillIcons.graphql;
    } else if (titleText.includes('git')) {
      iconSvg = skillIcons.git;
    } else if (titleText.includes('responsive')) {
      iconSvg = skillIcons['responsive design'];
    }
    
    // Add icon if found
    if (iconSvg) {
      iconContainer.innerHTML = iconSvg;
      iconContainer.style.display = 'flex';
      iconContainer.style.justifyContent = 'center';
      iconContainer.style.alignItems = 'center';
      iconContainer.style.color = 'var(--color-accent)';
      
      // Add animation
      iconContainer.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }
  });
  
  // Add CSS for skill icons
  const style = document.createElement('style');
  style.textContent = `
    .skill-item .skill-icon {
      width: 3.5rem;
      height: 3.5rem;
      margin-right: var(--spacing-md);
      background-color: var(--color-accent-light);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-accent);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .skill-item:hover .skill-icon {
      transform: scale(1.15);
      background-color: var(--color-accent);
      color: white;
      box-shadow: 0 5px 15px rgba(var(--color-accent-rgb), 0.4);
    }
    
    .skill-item-header {
      display: flex;
      align-items: center;
      margin-bottom: var(--spacing-md);
    }
  `;
  document.head.appendChild(style);
  
  // Update the skill item headers to include icons
  skillItems.forEach(item => {
    const header = item.querySelector('.skill-item-header');
    const iconContainer = item.querySelector('.skill-icon');
    const title = item.querySelector('h4');
    
    if (!header && iconContainer && title) {
      // Create header if it doesn't exist
      const newHeader = document.createElement('div');
      newHeader.classList.add('skill-item-header');
      item.insertBefore(newHeader, title);
      
      // Move icon and title into the header
      newHeader.appendChild(iconContainer);
      newHeader.appendChild(title);
    }
  });
}