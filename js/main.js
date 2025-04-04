/**
 * Main JavaScript file for Gunasekar Portfolio
 * Handles main functionality including scroll events, navbar behavior, and project filtering
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Select DOM elements
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar .nav-link');
    const backToTopBtn = document.getElementById('back-to-top');
    const downloadResumeBtn = document.getElementById('download-resume');
    const contactForm = document.getElementById('contactForm');
    const projectFilters = document.querySelectorAll('.btn-filter');
    const projectItems = document.querySelectorAll('.project-item');

    /**
     * Initialize the website functionality
     */
    function init() {
        setupEventListeners();
        setupNavigation();
        observeElements();
    }

    /**
     * Set up all event listeners
     */
    function setupEventListeners() {
        // Window scroll event
        window.addEventListener('scroll', function() {
            toggleNavbarBackground();
            toggleBackToTopButton();
        });

        // Back to top button click event
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', scrollToTop);
        }

        // Download resume button click event
        if (downloadResumeBtn) {
            downloadResumeBtn.addEventListener('click', handleResumeDownload);
        }

        // Contact form submit event
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }

        // Project filter click events
        projectFilters.forEach(button => {
            button.addEventListener('click', filterProjects);
        });
    }

    /**
     * Handle navigation link active states and smooth scrolling
     */
    function setupNavigation() {
        // Add smooth scrolling to all navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Only prevent default if it's a hash link
                if (this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        // Close navbar collapse on mobile
                        const navbarCollapse = document.querySelector('.navbar-collapse');
                        if (navbarCollapse.classList.contains('show')) {
                            navbarCollapse.classList.remove('show');
                        }
                        
                        // Scroll to section
                        window.scrollTo({
                            top: targetSection.offsetTop - 70,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });

        // Set active nav link based on scroll position
        updateActiveNavLink();
        window.addEventListener('scroll', updateActiveNavLink);
    }

    /**
     * Update active navigation link based on current scroll position
     */
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        // Find the current section
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section link
                const activeLink = document.querySelector(`.navbar .nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    /**
     * Toggle navbar background on scroll
     */
    function toggleNavbarBackground() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }

    /**
     * Toggle back to top button visibility
     */
    function toggleBackToTopButton() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    /**
     * Scroll to top of the page
     */
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * Handle resume download click
     * @param {Event} e - The click event
     */
    function handleResumeDownload(e) {
        e.preventDefault();
        const link = document.createElement('a');
        link.href = './resume.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Handle contact form submission
     * @param {Event} e - The submit event
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // In a real implementation, this would send data to a server
        // For now, show a success message and reset the form
        const formMessage = document.querySelector('.form-message');
        formMessage.innerHTML = '<div class="alert alert-success">Your message has been sent. Thank you!</div>';
        
        // Reset form
        contactForm.reset();
        
        // Clear message after 5 seconds
        setTimeout(() => {
            formMessage.innerHTML = '';
        }, 5000);
    }

    /**
     * Filter project items based on category
     * @param {Event} e - The click event
     */
    function filterProjects(e) {
        e.preventDefault();
        
        const filter = this.getAttribute('data-filter');
        
        // Update active button
        projectFilters.forEach(button => {
            button.classList.remove('active');
        });
        this.classList.add('active');
        
        // Filter projects
        projectItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    /**
     * Observe elements for scroll animations
     */
    function observeElements() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const animation = element.getAttribute('data-animation');
                        const delay = element.getAttribute('data-delay') || 0;
                        
                        setTimeout(() => {
                            element.classList.add('animated');
                            
                            switch (animation) {
                                case 'fade-up':
                                    element.style.transform = 'translateY(0)';
                                    break;
                                case 'fade-down':
                                    element.style.transform = 'translateY(0)';
                                    break;
                                case 'fade-left':
                                    element.style.transform = 'translateX(0)';
                                    break;
                                case 'fade-right':
                                    element.style.transform = 'translateX(0)';
                                    break;
                                case 'width-expand':
                                    element.style.width = '80px';
                                    break;
                            }
                        }, delay);
                        
                        // Unobserve after animation
                        observer.unobserve(element);
                    }
                });
            }, {
                threshold: 0.1
            });
            
            // Set initial states
            animatedElements.forEach(element => {
                const animation = element.getAttribute('data-animation');
                
                switch (animation) {
                    case 'fade-up':
                        element.style.transform = 'translateY(40px)';
                        break;
                    case 'fade-down':
                        element.style.transform = 'translateY(-40px)';
                        break;
                    case 'fade-left':
                        element.style.transform = 'translateX(40px)';
                        break;
                    case 'fade-right':
                        element.style.transform = 'translateX(-40px)';
                        break;
                    case 'width-expand':
                        element.style.width = '0px';
                        break;
                }
                
                observer.observe(element);
            });
        } else {
            // Fallback for browsers without IntersectionObserver support
            animatedElements.forEach(element => {
                element.classList.add('animated');
                element.style.transform = 'none';
            });
        }
    }
    
    // Initialize when the DOM is ready
    init();
});
