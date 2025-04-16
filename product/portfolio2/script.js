/**
 * Main JavaScript for Portfolio
 * Sound effects and interactive elements
 */

// Wait for DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    // Initialize sound system
    const soundSystem = initSoundSystem();

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
    
    // Add more initializations here
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
 * Jellyfish Interaction
 * Makes the jellyfish interactive
 */
function initJellyfishInteraction(soundSystem) {
    const jellyfish = document.querySelector('.jellyfish');
    if (!jellyfish) return;
    
    // Make jellyfish respond to click/tap
    jellyfish.addEventListener('click', () => {
        soundSystem.play('jellyfish');
        
        // Add pulse animation
        jellyfish.classList.add('jellyfish-clicked');
        
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.classList.add('jellyfish-ripple');
        document.querySelector('.ocean-container').appendChild(ripple);
        
        // Remove classes after animation
        setTimeout(() => {
            jellyfish.classList.remove('jellyfish-clicked');
            ripple.remove();
        }, 1000);
    });
    
    // Add CSS for jellyfish interaction
    const style = document.createElement('style');
    style.textContent = `
        .jellyfish-clicked {
            transform: translateY(1rem) translateX(-50%) scale(1.1) !important;
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }
        
        .jellyfish-ripple {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10rem;
            height: 10rem;
            background: radial-gradient(circle, rgba(227, 89, 171, 0.4) 0%, rgba(227, 89, 171, 0) 70%);
            border-radius: 50%;
            animation: ripple-effect 1s ease-out forwards;
            pointer-events: none;
        }
        
        @keyframes ripple-effect {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Make jellyfish follow cursor with slight delay when near
    document.addEventListener('mousemove', (e) => {
        const oceanContainer = document.querySelector('.ocean-container');
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
        if (distance < 300) {
            // Calculate how much to move (more movement when closer)
            const influenceFactor = Math.max(0, 1 - (distance / 300));
            const maxOffset = 30 * influenceFactor;
            
            // Calculate offset from center
            const offsetX = ((e.clientX - containerCenterX) / 300) * maxOffset;
            
            // Apply movement with transition
            jellyfish.style.transition = 'transform 1s ease-out';
            jellyfish.style.transform = `translateX(calc(-50% + ${offsetX}px))`;
        } else {
            // Reset position when cursor is far away
            jellyfish.style.transition = 'transform 2s ease-out';
            jellyfish.style.transform = 'translateX(-50%)';
        }
    });
}

/**
 * Mobile Menu Toggle with sound
 */
function initMobileMenu(soundSystem) {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuToggle || !navLinks) return;
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Play toggle sound
        soundSystem.play('toggle');
        
        // Update aria-expanded attribute for accessibility
        const isExpanded = menuToggle.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close menu when clicking on a nav link (for mobile)
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', false);
                
                // Play click sound
                soundSystem.play('click');
            }
        });
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

// Call the magnetic elements function
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure other animations have started
    setTimeout(initMagneticElements, 1000);
});

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
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 113, 227, ${particle.opacity})`;
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
                    ctx.strokeStyle = `rgba(0, 113, 227, ${0.1 * (1 - distance / 120)})`;
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