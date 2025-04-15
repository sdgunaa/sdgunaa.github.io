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
        setupGitHubPagesContactForm();
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
 * Handle contact form submission with validation for GitHub Pages
 * Uses Formspree.io as the form backend
 * @param {Event} e - The submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Form elements
    const form = e.target;
    const formMessage = document.querySelector('.form-message');
    const submitButton = form.querySelector('button[type="submit"]');
    const formFields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message')
    };
    
    // Clear previous messages
    formMessage.innerHTML = '';
    
    // Reset validation states
    Object.values(formFields).forEach(field => {
        field.classList.remove('is-invalid');
        const feedbackElement = field.nextElementSibling;
        if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
            feedbackElement.textContent = '';
        }
    });
    
    // Validate form
    let isValid = true;
    
    // Name validation
    if (!formFields.name.value.trim()) {
        showError(formFields.name, 'Please enter your name');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formFields.email.value.trim()) {
        showError(formFields.email, 'Please enter your email');
        isValid = false;
    } else if (!emailRegex.test(formFields.email.value.trim())) {
        showError(formFields.email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Subject validation
    if (!formFields.subject.value.trim()) {
        showError(formFields.subject, 'Please enter a subject');
        isValid = false;
    }
    
    // Message validation
    if (!formFields.message.value.trim()) {
        showError(formFields.message, 'Please enter your message');
        isValid = false;
    }
    
    // If validation fails, stop here
    if (!isValid) {
        formMessage.innerHTML = '<div class="alert alert-danger">Please correct the errors in the form.</div>';
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    const originalButtonText = submitButton.textContent;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
    
    // Prepare form data
    const formData = new FormData(form);
    
    // Send to Formspree
    fetch('https://formspree.io/f/xeoadwdn', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        // Success message
        formMessage.innerHTML = '<div class="alert alert-success"><i class="fas fa-check-circle me-2"></i>Your message has been sent successfully! I will get back to you soon.</div>';
        
        // Reset form
        form.reset();
        
        // Add success animation
        formMessage.querySelector('.alert').classList.add('animate__animated', 'animate__fadeIn');
        
        // Enable analytics tracking (if using Google Analytics)
        if (typeof gtag === 'function') {
            gtag('event', 'contact_form_submit', {
                'event_category': 'engagement',
                'event_label': 'contact_form'
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        
        // Error message
        formMessage.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                There was a problem sending your message. Please try again or contact me directly at 
                <a href="mailto:sdgunaseker@gmail.com">sdgunaseker@gmail.com</a>
            </div>`;
    })
    .finally(() => {
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        
        // Scroll to form message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Clear success message after some time
        const messageElement = formMessage.querySelector('.alert-success');
        if (messageElement) {
            setTimeout(() => {
                messageElement.classList.add('animate__fadeOut');
                setTimeout(() => {
                    formMessage.innerHTML = '';
                }, 500);
            }, 5000);
        }
    });
    
    /**
     * Show error message for a field
     * @param {HTMLElement} field - The form field
     * @param {string} message - The error message
     */
    function showError(field, message) {
        field.classList.add('is-invalid');
        
        // Check if feedback element exists, create if not
        let feedbackElement = field.nextElementSibling;
        if (!feedbackElement || !feedbackElement.classList.contains('invalid-feedback')) {
            feedbackElement = document.createElement('div');
            feedbackElement.className = 'invalid-feedback';
            field.parentNode.insertBefore(feedbackElement, field.nextSibling);
        }
        
        feedbackElement.textContent = message;
    }
}

/**
 * Setup the contact form for GitHub Pages (using Formspree)
 */
function setupGitHubPagesContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // Set form action for Formspree
    contactForm.setAttribute('action', 'https://formspree.io/f/xeoadwdn');
    contactForm.setAttribute('method', 'POST');
    
    // Add extra field for Formspree to redirect back to your site
    const redirectField = document.createElement('input');
    redirectField.type = 'hidden';
    redirectField.name = '_next';
    redirectField.value = window.location.href;
    contactForm.appendChild(redirectField);
    
    // Add honeypot field to prevent spam
    const honeypotField = document.createElement('input');
    honeypotField.type = 'text';
    honeypotField.name = '_gotcha';
    honeypotField.style.display = 'none';
    contactForm.appendChild(honeypotField);
    
    // Add event listener for form submission
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Add character counter to message field
    setupCharacterCounter();
    
    // Add form field interaction enhancements
    document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(field => {
        // Focus & blur effects
        field.addEventListener('focus', () => {
            field.parentElement.classList.add('focused');
        });
        
        field.addEventListener('blur', () => {
            field.parentElement.classList.remove('focused');
            
            // Validate on blur
            if (field.value.trim()) {
                field.classList.add('is-valid');
            }
        });
    });
}

/**
 * Add real-time character count for message field
 */
function setupCharacterCounter() {
    const messageField = document.getElementById('message');
    const maxChars = 1000;
    
    // Create counter element
    const counterContainer = document.createElement('div');
    counterContainer.className = 'text-end text-muted small mt-1';
    counterContainer.innerHTML = `<span id="charCount">0</span>/${maxChars} characters`;
    
    // Insert after message field
    messageField.parentNode.insertBefore(counterContainer, messageField.nextSibling);
    
    // Update counter on input
    messageField.addEventListener('input', function() {
        const currentLength = this.value.length;
        const charCounter = document.getElementById('charCount');
        charCounter.textContent = currentLength;
        
        // Warn if approaching limit
        if (currentLength > maxChars * 0.8) {
            counterContainer.classList.add('text-warning');
        } else {
            counterContainer.classList.remove('text-warning', 'text-danger');
        }
        
        // Show danger if exceeding limit
        if (currentLength > maxChars) {
            counterContainer.classList.add('text-danger');
            charCounter.textContent = `${currentLength} (limit exceeded)`;
        }
    });
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
