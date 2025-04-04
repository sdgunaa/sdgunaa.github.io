/**
 * Theme Toggle
 * Manages dark/light theme switching functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Get theme toggle button
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check for saved theme preference or use default
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    /**
     * Initialize theme based on saved preference
     */
    function initTheme() {
        setTheme(savedTheme);
        setupEventListeners();
    }
    
    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    
    /**
     * Toggle between dark and light themes
     */
    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        setTheme(newTheme);
        saveTheme(newTheme);
    }
    
    /**
     * Apply the selected theme to the document
     * @param {string} theme - The theme to apply ('dark' or 'light')
     */
    function setTheme(theme) {
        htmlElement.setAttribute('data-bs-theme', theme);
        
        // Update button icon
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
        }
        
        // Add transition class for smooth color changes
        document.body.classList.add('theme-transition');
        
        // Remove transition class after the transition is complete
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
    }
    
    /**
     * Save theme preference to localStorage
     * @param {string} theme - The theme to save ('dark' or 'light')
     */
    function saveTheme(theme) {
        localStorage.setItem('theme', theme);
    }
    
    // Initialize the theme system
    initTheme();
});
