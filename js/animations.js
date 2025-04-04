/**
 * Animations.js
 * Handles all advanced animations on the portfolio website
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    /**
     * Add a slight parallax effect to the hero section
     */
    function setupParallax() {
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            window.addEventListener('scroll', function() {
                const scrollPosition = window.scrollY;
                const translateY = scrollPosition * 0.3;
                
                // Apply parallax effect to the hero content
                const heroContent = heroSection.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.transform = `translateY(${translateY}px)`;
                }
            });
        }
    }

    /**
     * Create animated typing effect for hero section
     */
    function setupTypingEffect() {
        const typingElement = document.querySelector('.hero-section p.lead');
        
        if (!typingElement) return;
        
        const text = typingElement.textContent;
        typingElement.textContent = '';
        
        let i = 0;
        const typingSpeed = 50; // ms per character
        
        function typeCharacter() {
            if (i < text.length) {
                typingElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeCharacter, typingSpeed);
            }
        }
        
        // Start the typing effect when the element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeCharacter, 1000); // Delay before starting
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(typingElement);
    }

    /**
     * Animate progress bars in skills section
     */
    function animateSkillBars() {
        const progressBars = document.querySelectorAll('.skill-progress .progress-bar');
        
        if (progressBars.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.style.width;
                    
                    // Reset the width to 0 first
                    progressBar.style.width = '0%';
                    
                    // Animate the width to the target value
                    setTimeout(() => {
                        progressBar.style.transition = 'width 1s ease-in-out';
                        progressBar.style.width = width;
                    }, 200);
                    
                    observer.unobserve(progressBar);
                }
            });
        }, { threshold: 0.2 });
        
        progressBars.forEach(progressBar => {
            observer.observe(progressBar);
        });
    }

    /**
     * Animate counter numbers in about section stats
     */
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-box h3');
        
        if (counters.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.textContent);
                    const increment = Math.ceil(target / 50);
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = current;
                            setTimeout(updateCounter, 30);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    // Start from 0
                    counter.textContent = '0';
                    setTimeout(updateCounter, 400);
                    
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    /**
     * Add hover effects to project cards
     */
    function setupProjectCardEffects() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                // Add a slight scale effect
                this.style.transform = 'translateY(-10px)';
                this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
            });
            
            card.addEventListener('mouseleave', function() {
                // Reset to original state
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
            });
        });
    }

    /**
     * Smooth revealing of background pattern
     */
    function revealBackgroundPattern() {
        const backgroundPattern = document.querySelector('.background-pattern');
        
        if (backgroundPattern) {
            // Start with opacity 0
            backgroundPattern.style.opacity = '0';
            
            // Animate to final opacity
            setTimeout(() => {
                backgroundPattern.style.transition = 'opacity 1.5s ease';
                backgroundPattern.style.opacity = '0.05';
            }, 500);
        }
    }

    /**
     * Initialize all animations
     */
    function initAnimations() {
        setupParallax();
        setupTypingEffect();
        animateSkillBars();
        animateCounters();
        setupProjectCardEffects();
        revealBackgroundPattern();
    }

    // Start animations when DOM is loaded
    initAnimations();
});
