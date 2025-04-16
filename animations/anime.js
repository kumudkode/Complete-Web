document.addEventListener('DOMContentLoaded', () => {
    // =======================================================
    // Universe Theme Elements
    // =======================================================
    
    // Create star field in background
    const createStarryBackground = () => {
        const universeLayer = document.createElement('div');
        universeLayer.classList.add('universe-layer');
        document.body.appendChild(universeLayer);
        
        // Add stars
        for (let i = 0; i < 200; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.width = `${Math.random() * 3 + 1}px`;
            star.style.height = star.style.width;
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            universeLayer.appendChild(star);
        }
        
        // Add planets
        const planetColors = ['#FFB6C1', '#ADD8E6', '#90EE90', '#FFD700', '#FFA07A'];
        for (let i = 0; i < 5; i++) {
            const planet = document.createElement('div');
            planet.classList.add('planet');
            
            const size = Math.random() * 60 + 40;
            planet.style.width = `${size}px`;
            planet.style.height = `${size}px`;
            planet.style.top = `${Math.random() * 100}%`;
            planet.style.left = `${Math.random() * 100}%`;
            planet.style.background = planetColors[i];
            planet.style.boxShadow = `0 0 ${size/2}px ${planetColors[i]}33`;
            
            // Add planet rings to some planets
            if (Math.random() > 0.5) {
                const ring = document.createElement('div');
                ring.classList.add('planet-ring');
                planet.appendChild(ring);
            }
            
            universeLayer.appendChild(planet);
            
            // Animate planet
            anime({
                targets: planet,
                translateX: () => anime.random(-100, 100),
                translateY: () => anime.random(-100, 100),
                rotate: () => anime.random(0, 360),
                duration: () => anime.random(30000, 60000),
                loop: true,
                direction: 'alternate',
                easing: 'easeInOutSine'
            });
        }
        
        // Add occasional shooting stars
        setInterval(() => {
            const shootingStar = document.createElement('div');
            shootingStar.classList.add('shooting-star');
            shootingStar.style.top = `${Math.random() * 100}%`;
            shootingStar.style.left = `${Math.random() * 100}%`;
            universeLayer.appendChild(shootingStar);
            
            setTimeout(() => {
                shootingStar.remove();
            }, 1000);
        }, 3000);
    };
    
    // Create Interactive Mascot
    const createMascot = () => {
        const mascotContainer = document.createElement('div');
        mascotContainer.classList.add('mascot-container');
        
        const mascotCharacter = document.createElement('div');
        mascotCharacter.classList.add('mascot-character');
        
        // Create SVG for animated alien mascot
        mascotCharacter.innerHTML = `
            <svg viewBox="0 0 120 120" width="120" height="120">
                <defs>
                    <radialGradient id="mascotGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stop-color="#9f7aea" stop-opacity="0.8"/>
                        <stop offset="100%" stop-color="#6366f1" stop-opacity="0.6"/>
                    </radialGradient>
                </defs>
                <circle class="mascot-head" cx="60" cy="60" r="50" fill="url(#mascotGlow)"/>
                <circle class="mascot-eye left" cx="40" cy="45" r="10" fill="white"/>
                <circle class="mascot-eye right" cx="80" cy="45" r="10" fill="white"/>
                <circle class="mascot-pupil left" cx="40" cy="45" r="5" fill="#1e293b"/>
                <circle class="mascot-pupil right" cx="80" cy="45" r="5" fill="#1e293b"/>
                <path class="mascot-mouth" d="M40,75 Q60,95 80,75" stroke="white" stroke-width="4" fill="none"/>
                <ellipse class="mascot-antenna-base" cx="60" cy="15" rx="8" ry="5" fill="#6366f1"/>
                <circle class="mascot-antenna-tip" cx="60" cy="5" r="8" fill="#9f7aea"/>
            </svg>
        `;
        
        // Create tip bubble
        const mascotTip = document.createElement('div');
        mascotTip.classList.add('mascot-tip');
        
        // Random tips about Anime.js
        const tips = [
            "Try using 'staggering' for cascade effects!",
            "The 'timeline' feature helps sequence animations perfectly.",
            "Use elastic easing for bouncy, playful animations!",
            "SVG path animations create amazing drawing effects.",
            "Keyframes let you define multiple animation stages."
        ];
        
        mascotTip.textContent = tips[Math.floor(Math.random() * tips.length)];
        
        // Assemble mascot
        mascotContainer.appendChild(mascotCharacter);
        mascotContainer.appendChild(mascotTip);
        document.body.appendChild(mascotContainer);
        
        // Mascot interaction
        mascotCharacter.addEventListener('click', () => {
            // Show random tip
            mascotTip.textContent = tips[Math.floor(Math.random() * tips.length)];
            
            // Excited animation
            mascotCharacter.classList.add('excited');
            
            // Show achievement
            showAchievement("Cosmic Guide", "You've met your animation assistant!", 1);
            
            setTimeout(() => {
                mascotCharacter.classList.remove('excited');
            }, 2000);
            
            // Animate eyes to look around
            anime({
                targets: '.mascot-pupil',
                translateX: [
                    { value: -3, duration: 200, delay: 0 },
                    { value: 3, duration: 400, delay: 200 },
                    { value: 0, duration: 200, delay: 400 }
                ],
                translateY: [
                    { value: -2, duration: 200, delay: 0 },
                    { value: 2, duration: 400, delay: 200 },
                    { value: 0, duration: 200, delay: 400 }
                ],
                easing: 'easeInOutQuad'
            });
        });
        
        // Blink animation
        setInterval(() => {
            anime({
                targets: '.mascot-eye',
                scaleY: [
                    { value: 0.1, duration: 100, },
                    { value: 1, duration: 100, delay: 50 }
                ],
                easing: 'easeInOutQuad'
            });
        }, 5000);
        
        // Antenna glow
        anime({
            targets: '.mascot-antenna-tip',
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
            duration: 2000,
            loop: true,
            easing: 'easeInOutSine'
        });
    };
    
    // Achievement system
    const createAchievementSystem = () => {
        const achievementContainer = document.createElement('div');
        achievementContainer.classList.add('achievement');
        achievementContainer.innerHTML = `
            <div class="achievement-icon">🏆</div>
            <div class="achievement-content">
                <h4>Achievement Unlocked!</h4>
                <p>Description goes here</p>
                <div class="achievement-progress">
                    <div class="achievement-progress-bar"></div>
                </div>
            </div>
        `;
        document.body.appendChild(achievementContainer);
    };
    
    const showAchievement = (title, description, progress = 1) => {
        const achievement = document.querySelector('.achievement');
        const achievementTitle = achievement.querySelector('h4');
        const achievementDesc = achievement.querySelector('p');
        const progressBar = achievement.querySelector('.achievement-progress-bar');
        
        achievementTitle.textContent = title;
        achievementDesc.textContent = description;
        
        // Show achievement
        achievement.classList.add('show');
        
        // Animate progress bar
        anime({
            targets: progressBar,
            width: `${progress * 100}%`,
            duration: 800,
            easing: 'easeOutQuart'
        });
        
        // Hide after delay
        setTimeout(() => {
            achievement.classList.remove('show');
        }, 5000);
    };
    
    // Add theme switcher
    const createThemeSwitcher = () => {
        const themeSwitcher = document.createElement('div');
        themeSwitcher.classList.add('theme-switcher');
        
        const themes = [
            { name: 'default', color: '#6366f1' },
            { name: 'dark', color: '#0f172a' },
            { name: 'cute', color: '#ec4899' },
            { name: 'cosmic', color: '#5b21b6' }
        ];
        
        themes.forEach(theme => {
            const option = document.createElement('div');
            option.classList.add('theme-option');
            option.setAttribute('data-theme', theme.name);
            option.style.backgroundColor = theme.color;
            
            if (theme.name === 'default') {
                option.classList.add('active');
            }
            
            option.addEventListener('click', () => {
                // Remove active class from all options
                document.querySelectorAll('.theme-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                
                // Add active class to clicked option
                option.classList.add('active');
                
                // Set theme on body
                document.body.setAttribute('data-theme', theme.name);
                
                // Special case for cosmic theme
                if (theme.name === 'cosmic') {
                    document.body.classList.add('cosmic-theme');
                    showAchievement("Cosmic Explorer", "You've unlocked the cosmic theme!", 1);
                } else {
                    document.body.classList.remove('cosmic-theme');
                }
            });
            
            themeSwitcher.appendChild(option);
        });
        
        document.body.appendChild(themeSwitcher);
    };
    
    // =======================================================
    // Initialize Core Functionality
    // =======================================================
    
    // Completely remove old dog from DOM to avoid any conflicts
    const oldDog = document.querySelector('.dog-mascot');
    if (oldDog) {
        oldDog.remove();
    }
    
    // Get the interactive dog element
    const dog = document.querySelector('.interactive-dog');
    
    // Make sure it's visible and positioned properly
    if (dog) {
        // Set initial visible position
        dog.style.transform = `translate(${window.innerWidth - 150}px, ${window.innerHeight - 150}px)`;
        dog.style.opacity = '1';
        
        // Log to console for debugging
        console.log('Interactive dog initialized');
        
        // Basic cursor following
        document.addEventListener('mousemove', (e) => {
            // Simple following with 60px offset
            const dogX = e.clientX - 60;
            const dogY = e.clientY - 40;
            
            // Apply position with correct direction
            if (e.clientX < parseInt(dog.style.transform.split('translate(')[1])) {
                dog.style.transform = `translate(${dogX}px, ${dogY}px) scaleX(-1)`;
            } else {
                dog.style.transform = `translate(${dogX}px, ${dogY}px)`;
            }
        });
    }
    
    // Initialize stagger grid
    const staggerGrid = document.getElementById('stagger-demo');
    for (let i = 0; i < 25; i++) {
        const element = document.createElement('div');
        element.classList.add('stagger-element');
        staggerGrid.appendChild(element);
    }
    
    // Setup demo buttons
    document.querySelectorAll('.run-demo-btn').forEach(button => {
        button.addEventListener('click', () => {
            const demoType = button.getAttribute('data-demo');
            runDemo(demoType);
            
            // Add particle burst on button click
            createParticleBurst(button, 15);
            
            // Show achievement for experimenting
            if (!localStorage.getItem(`demo_${demoType}`)) {
                localStorage.setItem(`demo_${demoType}`, 'true');
                const demoCount = Object.keys(localStorage).filter(key => key.startsWith('demo_')).length;
                
                showAchievement(
                    "Animation Explorer", 
                    `You've tried ${demoCount}/6 animation techniques!`, 
                    demoCount/6
                );
                
                if (demoCount === 6) {
                    showAchievement(
                        "Animation Master",
                        "You've mastered all animation techniques!",
                        1
                    );
                }
            }
        });
    });
    
    // Setup section navigation
    document.querySelectorAll('.section-nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.getAttribute('data-target');
            
            // Cosmic travel effect
            cosmicTravel(() => {
                document.getElementById(targetSection).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    });
    
    // Create cosmic travel effect
    const cosmicTravel = (callback) => {
        const travelOverlay = document.createElement('div');
        travelOverlay.classList.add('cosmic-travel-overlay');
        document.body.appendChild(travelOverlay);
        
        anime({
            targets: travelOverlay,
            opacity: [0, 1, 1, 0],
            duration: 1500,
            easing: 'easeInOutExpo',
            complete: () => {
                callback();
                travelOverlay.remove();
            }
        });
    };
    
    // Create particle burst effect
    const createParticleBurst = (element, count) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Cosmic particle styling
            particle.style.width = anime.random(4, 8) + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = getComputedStyle(document.documentElement).getPropertyValue('--primary');
            
            // Add glow effect
            particle.style.boxShadow = `0 0 ${anime.random(5, 10)}px ${particle.style.background}`;
            
            particle.style.borderRadius = '50%';
            particle.style.position = 'fixed';
            particle.style.zIndex = '9999';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            document.body.appendChild(particle);
            
            anime({
                targets: particle,
                translateX: () => anime.random(-100, 100),
                translateY: () => anime.random(-100, 100),
                scale: [1, 0],
                opacity: [1, 0],
                duration: () => anime.random(600, 1000),
                easing: 'easeOutExpo',
                complete: () => {
                    particle.remove();
                }
            });
        }
    };
    
    // Highlight active section based on scroll
    const sections = document.querySelectorAll('.page');
    const navItems = document.querySelectorAll('.section-nav-item');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 300) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-target') === current) {
                item.classList.add('active');
            }
        });
    });
    
    // Create hero section shapes
    const createHeroShapes = () => {
        const heroShapes = document.querySelector('.hero-shapes');
        if (!heroShapes) return;
        
        heroShapes.innerHTML = '';
        
        const shapeTypes = ['circle', 'triangle', 'square', 'pentagon', 'hexagon'];
        
        for (let i = 0; i < 30; i++) {
            const shape = document.createElement('div');
            shape.classList.add('shape');
            
            // Randomly select shape type for variety
            const shapeType = shapeTypes[anime.random(0, shapeTypes.length - 1)];
            shape.classList.add(shapeType);
            
            // Make shapes look cosmic with glows and gradients
            const size = anime.random(20, 100);
            shape.style.width = `${size}px`;
            shape.style.height = `${size}px`;
            
            // Space-themed color palette
            const colors = [
                'rgba(99, 102, 241, 0.8)', // Indigo
                'rgba(139, 92, 246, 0.8)', // Purple
                'rgba(91, 33, 182, 0.8)',  // Dark Purple
                'rgba(124, 58, 237, 0.8)', // Violet
                'rgba(167, 139, 250, 0.8)' // Light Purple
            ];
            
            // Add glow effect
            const color = colors[Math.floor(Math.random() * colors.length)];
            shape.style.background = color;
            shape.style.boxShadow = `0 0 ${size/3}px ${color}`;
            
            shape.style.top = anime.random(-10, 110) + '%';
            shape.style.left = anime.random(-10, 110) + '%';
            shape.style.opacity = anime.random(0.3, 0.8);
            
            // For non-circles, add specific styling
            if (shapeType === 'triangle') {
                shape.style.width = '0';
                shape.style.height = '0';
                shape.style.background = 'transparent';
                shape.style.borderLeft = `${size/2}px solid transparent`;
                shape.style.borderRight = `${size/2}px solid transparent`;
                shape.style.borderBottom = `${size}px solid ${color}`;
            } else if (shapeType === 'square') {
                shape.style.borderRadius = '4px';
            } else if (shapeType === 'pentagon') {
                shape.style.clipPath = 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)';
            } else if (shapeType === 'hexagon') {
                shape.style.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
            }
            
            heroShapes.appendChild(shape);
        }
        
        // Animate shapes in cosmic way
        anime({
            targets: '.shape',
            translateX: () => anime.random(-250, 250),
            translateY: () => anime.random(-250, 250),
            translateZ: () => anime.random(-200, 200),
            rotate: () => anime.random(-180, 180),
            scale: () => anime.random(0.2, 2),
            opacity: () => anime.random(0.3, 0.8),
            duration: () => anime.random(5000, 10000),
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine',
            delay: anime.stagger(100)
        });
        
        // Animate letters with cosmic effect
        anime.timeline()
            .add({
                targets: '.letter',
                opacity: [0, 1],
                translateY: ['1.5em', 0],
                translateZ: 0,
                rotateZ: [anime.random(-45, 45), 0],
                duration: 750,
                delay: (el, i) => 300 + 50 * i,
                easing: 'easeOutExpo'
            });
        
        // Add click handler for the Play Animation button
        document.querySelector('.play-btn').addEventListener('click', () => {
            animateLetters();
            createParticleBurst(document.querySelector('.play-btn'), 30);
        });
    };
    
    // Letter animation for hero section
    const animateLetters = () => {
        // Reset any ongoing animations
        anime.remove('.letter');
        
        anime.timeline()
            .add({
                targets: '.letter',
                scale: [1, 1.5],
                translateY: [0, -30],
                opacity: 1,
                duration: 500,
                easing: 'easeInOutQuad',
                delay: anime.stagger(100)
            })
            .add({
                targets: '.letter',
                scale: [1.5, 1],
                translateY: [-30, 0],
                rotateZ: () => anime.random(-20, 20),
                duration: 500,
                easing: 'easeInOutQuad',
                delay: anime.stagger(100)
            })
            .add({
                targets: '.letter',
                translateX: (el, i, l) => {
                    return (i - Math.floor(l/2)) * 40;
                },
                translateY: (el, i) => {
                    return i % 2 === 0 ? -30 : 30;
                },
                scale: 1.2,
                duration: 800,
                easing: 'easeOutElastic(1, .6)',
                delay: anime.stagger(80, {from: 'center'})
            })
            .add({
                targets: '.letter',
                translateX: 0,
                translateY: 0,
                scale: 1,
                duration: 600,
                easing: 'easeOutElastic(1, .6)',
                delay: anime.stagger(50)
            });
    };
    
    // Add card interactions
    const setupCardInteractions = () => {
        const cards = document.querySelectorAll('.card');
        if (!cards.length) return;
        
        cards.forEach(card => {
            // Advanced 3D tilt effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // mouse position within the element
                const y = e.clientY - rect.top;
                
                // Calculate rotation based on mouse position
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateY = ((x - centerX) / centerX) * 15; // max 15 degrees
                const rotateX = ((centerY - y) / centerY) * 15;
                
                anime({
                    targets: card,
                    rotateY: rotateY,
                    rotateX: rotateX,
                    translateZ: '50px',
                    duration: 400,
                    easing: 'easeOutCubic',
                    update: function(anim) {
                        // Add dynamic lighting effect
                        const lightingValue = `rgba(255, 255, 255, ${0.2 + (y / rect.height) * 0.1})`;
                        card.style.background = `linear-gradient(135deg, ${lightingValue}, transparent)`;
                    }
                });
                
                // Create cosmic particle trail for mouse
                if (Math.random() > 0.7) {
                    const particle = document.createElement('div');
                    particle.classList.add('card-particle');
                    particle.style.left = `${x}px`;
                    particle.style.top = `${y}px`;
                    card.appendChild(particle);
                    
                    anime({
                        targets: particle,
                        opacity: [1, 0],
                        scale: [1, 0],
                        duration: 1000,
                        easing: 'easeOutExpo',
                        complete: function() {
                            particle.remove();
                        }
                    });
                }
            });
            
            // Reset card on mouse leave
            card.addEventListener('mouseleave', () => {
                anime({
                    targets: card,
                    rotateY: 0,
                    rotateX: 0,
                    translateZ: 0,
                    duration: 600,
                    easing: 'easeOutElastic(1, .6)',
                    complete: function() {
                        card.style.background = '';
                    }
                });
            });
            
            // Click animation
            card.addEventListener('click', () => {
                anime({
                    targets: card,
                    scale: [1, 0.9, 1.05, 1],
                    duration: 600,
                    easing: 'easeInOutElastic(1, .6)'
                });
                
                createParticleBurst(card, 20);
                
                showAchievement("Interactive Master", "You've mastered interactive animations!", 1);
            });
        });
    };
    
    // Add animated SVG path
    const setupSvgAnimation = () => {
        const path = document.querySelector('.path');
        if (!path) return;
        
        const pathLength = path.getTotalLength();
        
        path.setAttribute('stroke-dasharray', pathLength);
        path.setAttribute('stroke-dashoffset', pathLength);
        
        // Create an intersection observer to animate the path when it comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime({
                        targets: path,
                        strokeDashoffset: [pathLength, 0],
                        easing: 'easeInOutSine',
                        duration: 3000,
                        loop: true,
                        direction: 'alternate'
                    });
                    
                    // Creating cosmic glow effect along the path
                    const svgContainer = entry.target.closest('.svg-container');
                    const cosmicGlow = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
                    cosmicGlow.setAttribute('id', 'cosmicGlow');
                    cosmicGlow.innerHTML = `
                        <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
                        <feColorMatrix type="matrix" values="
                            1 0 0 0 0
                            0 1 0 0 0
                            0 0 1 0 0
                            0 0 0 15 -7" />
                    `;
                    
                    const svg = svgContainer.querySelector('svg');
                    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                    defs.appendChild(cosmicGlow);
                    svg.insertBefore(defs, svg.firstChild);
                    
                    path.setAttribute('filter', 'url(#cosmicGlow)');
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(document.querySelector('.svg-container'));
    };
    
    // Timeline scroll animation
    const setupTimelineAnimation = () => {
        const timelineItems = document.querySelectorAll('.timeline-item');
        if (!timelineItems.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const item = entry.target;
                    const isOdd = Array.from(timelineItems).indexOf(item) % 2 === 0;
                    
                    // Create cosmic animation for timeline items
                    anime({
                        targets: item.querySelector('.timeline-content'),
                        translateX: [isOdd ? -100 : 100, 0],
                        translateY: [50, 0],
                        opacity: [0, 1],
                        duration: 1200,
                        delay: 300,
                        easing: 'easeOutExpo'
                    });
                    
                    // Animate timeline dot with cosmic glow
                    anime({
                        targets: item.querySelector('.timeline-dot'),
                        scale: [0, 1.5, 1],
                        opacity: [0, 1],
                        boxShadow: [
                            '0 0 0 0 rgba(99, 102, 241, 0)',
                            '0 0 0 15px rgba(99, 102, 241, 0.3)',
                            '0 0 0 5px rgba(99, 102, 241, 0.5)'
                        ],
                        duration: 1500,
                        easing: 'easeOutElastic(1, .6)'
                    });
                    
                    // Stop observing after animation
                    observer.unobserve(item);
                }
            });
        }, { threshold: 0.2 });
        
        // Observe each timeline item
        timelineItems.forEach(item => {
            observer.observe(item);
        });
    };
    
    // Run various demos
    function runDemo(type) {
        switch(type) {
            case 'basic':
                anime({
                    targets: '#basic-demo',
                    translateX: 150,
                    translateY: 30,
                    backgroundColor: '#FF5733',
                    borderRadius: ['0%', '50%'],
                    scale: 1.5,
                    duration: 1000,
                    direction: 'alternate',
                    easing: 'easeInOutQuad',
                    complete: function() {
                        anime({
                            targets: '#basic-demo',
                            translateX: 0,
                            translateY: 0,
                            backgroundColor: '#6366f1',
                            borderRadius: '4px',
                            scale: 1,
                            duration: 800,
                            easing: 'easeOutQuad'
                        });
                    }
                });
                break;
                
            case 'timeline':
                anime.timeline({
                    duration: 800,
                    easing: 'easeOutExpo'
                })
                .add({
                    targets: '#timeline-demo',
                    translateX: 150,
                    backgroundColor: '#6b46c1'
                })
                .add({
                    targets: '#timeline-demo',
                    translateY: 40,
                    backgroundColor: '#4338ca'
                })
                .add({
                    targets: '#timeline-demo',
                    translateX: 0,
                    backgroundColor: '#818cf8'
                })
                .add({
                    targets: '#timeline-demo',
                    translateY: 0,
                    backgroundColor: '#6366f1'
                });
                break;
                
            case 'stagger':
                anime({
                    targets: '.stagger-element',
                    scale: [0, 1],
                    opacity: [0, 1],
                    delay: anime.stagger(50, {grid: [5, 5], from: 'center'}),
                    easing: 'easeOutQuad',
                    complete: function() {
                        setTimeout(() => {
                            anime({
                                targets: '.stagger-element',
                                scale: [1, 0],
                                opacity: [1, 0],
                                delay: anime.stagger(30, {grid: [5, 5], from: 'center'}),
                                easing: 'easeInQuad'
                            });
                        }, 1000);
                    }
                });
                break;
                
            case 'morph':
                anime({
                    targets: '#morph-demo',
                    borderRadius: [
                        {value: '50%', duration: 800},
                        {value: '10% 50% 10% 50%', duration: 800},
                        {value: '50% 10% 50% 10%', duration: 800},
                        {value: '0%', duration: 800}
                    ],
                    rotate: [0, 45, 90, 0],
                    backgroundColor: [
                        '#6366f1', '#6b46c1', '#4338ca', '#6366f1'
                    ],
                    easing: 'easeInOutSine',
                    duration: 3200,
                    // Add cosmic glow during morph
                    update: function(anim) {
                        const progress = Math.min(anim.progress / 100, 1);
                        document.querySelector('#morph-demo').style.boxShadow = 
                            `0 0 ${20 + progress * 30}px rgba(99, 102, 241, ${0.3 + progress * 0.5})`;
                    }
                });
                break;
                
            case 'keyframes':
                anime({
                    targets: '#keyframes-demo',
                    keyframes: [
                        {translateX: 100, backgroundColor: '#6b46c1', rotate: 0, scale: 1.5},
                        {translateY: 50, backgroundColor: '#4338ca', rotate: 180, scale: 1},
                        {translateX: 0, backgroundColor: '#818cf8', rotate: 360, scale: 1.5},
                        {translateY: 0, backgroundColor: '#6366f1', rotate: 0, scale: 1}
                    ],
                    duration: 2000,
                    easing: 'easeOutElastic(1, .8)'
                });
                break;
                
            case 'physics':
                anime({
                    targets: '#physics-demo',
                    translateX: 150,
                    translateY: [
                        {value: 50, duration: 500},
                        {value: 0, duration: 500}
                    ],
                    scale: [
                        {value: 1.5, duration: 500},
                        {value: 1, duration: 500}
                    ],
                    rotate: {
                        value: '1turn',
                        duration: 1000,
                        easing: 'easeOutElastic(1, .8)'
                    },
                    backgroundColor: '#6b46c1',
                    duration: 1000,
                    easing: 'spring(1, 80, 10, 0)',
                    complete: function() {
                        anime({
                            targets: '#physics-demo',
                            translateX: 0,
                            backgroundColor: '#6366f1',
                            duration: 800,
                            easing: 'easeOutElastic(1, .8)'
                        });
                    }
                });
                break;
                
            case 'easing':
                document.querySelectorAll('.easing-ball').forEach(ball => {
                    const easing = ball.getAttribute('data-easing');
                    // Add cosmic trail effect
                    const track = ball.closest('.easing-item').querySelector('.easing-track');
                    track.innerHTML = ''; // Clear existing trails
                    
                    anime({
                        targets: ball,
                        translateX: 100,
                        easing: easing === 'spring' ? 'spring(1, 80, 10, 0)' : easing,
                        duration: 2000,
                        direction: 'alternate',
                        loop: 2,
                        update: function(anim) {
                            // Create cosmic trail
                            if (anim.progress % 10 < 1) {
                                const trailDot = document.createElement('div');
                                trailDot.classList.add('trail-dot');
                                trailDot.style.left = `${ball.offsetLeft + 10}px`;
                                trailDot.style.opacity = '0.6';
                                track.appendChild(trailDot);
                                
                                anime({
                                    targets: trailDot,
                                    opacity: 0,
                                    scale: 0,
                                    duration: 1000,
                                    easing: 'easeOutExpo'
                                });
                            }
                        }
                    });
                });
                break;
        }
    }
    
    // Initialize everything
    const init = () => {
        // Add cosmic styling first
        const cosmicStyle = document.createElement('style');
        cosmicStyle.innerHTML = `
            .universe-layer {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
                overflow: hidden;
            }
            
            .star {
                position: absolute;
                background-color: white;
                border-radius: 50%;
                animation: twinkle 5s ease-in-out infinite;
            }
            
            .planet {
                position: absolute;
                border-radius: 50%;
                opacity: 0.2;
                filter: blur(2px);
            }
            
            .planet-ring {
                position: absolute;
                top: 50%;
                left: 0;
                width: 100%;
                height: 10px;
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-50%) rotate(30deg);
                border-radius: 50%;
            }
            
            .shooting-star {
                position: absolute;
                width: 100px;
                height: 2px;
                background: linear-gradient(90deg, white, transparent);
                transform: rotate(-45deg);
                animation: shoot 1s linear;
            }
            
            .cosmic-travel-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at center, var(--primary), #000);
                z-index: 9999;
                opacity: 0;
                pointer-events: none;
            }
            
            .card-particle {
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
                pointer-events: none;
            }
            
            .trail-dot {
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--primary);
                border-radius: 50%;
                top: 50%;
                transform: translateY(-50%);
                box-shadow: 0 0 8px var(--primary);
            }
            
            body.cosmic-theme {
                background: #0f0a19;
                background-image: 
                    radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.2) 0%, transparent 60%),
                    radial-gradient(circle at 80% 70%, rgba(91, 33, 182, 0.2) 0%, transparent 60%);
            }
            
            body.cosmic-theme .page {
                background-color: rgba(15, 23, 42, 0.6);
                border-color: var(--primary);
                color: white;
            }
            
            body.cosmic-theme h1, 
            body.cosmic-theme h2, 
            body.cosmic-theme h3, 
            body.cosmic-theme p {
                color: white;
            }
            
            @keyframes twinkle {
                0%, 100% { opacity: 0.2; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
            }
            
            @keyframes shoot {
                0% { transform: translateX(0) translateY(0) rotate(-45deg); opacity: 1; }
                100% { transform: translateX(200px) translateY(200px) rotate(-45deg); opacity: 0; }
            }
        `;
        document.head.appendChild(cosmicStyle);
        
        // Initialize core features
        createStarryBackground();
        createMascot();
        createAchievementSystem();
        createThemeSwitcher();
        
        // Initialize page elements
        createHeroShapes();
        setupCardInteractions();
        setupSvgAnimation();
        setupTimelineAnimation();
        
        // Show initial achievement
        setTimeout(() => {
            showAchievement("Cosmic Journey", "Welcome to the Anime.js Universe!", 1);
        }, 1500);
    };
    
    // Call init function
    init();
});
