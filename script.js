 // Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCR58PBXIlBPGRg1sFbDZSbUU2syIJCxBQ", 
    authDomain: "portfolio-contact-b303b.firebaseapp.com", 
    databaseURL: "https://portfolio-contact-b303b-default-rtdb.firebaseio.com", 
    projectId: "portfolio-contact-b303b", 
    storageBucket: "portfolio-contact-b303b.firebasestorage.app",
    messagingSenderId: "941186950399", 
    appId: "1:941186950399:web:ff34849fa77c2af97c98ca", 
    measurementId: "G-0C9GRLXJSR" 
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(); // <- use compat syntax
const analytics = firebase.analytics(); // optional


// Initialize contact form with validation
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Collect form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Save data to Firebase Realtime Database
            const newMessageRef = database.ref('messages').push();
            newMessageRef.set({
                name: name,
                email: email,
                message: message,
                timestamp: Date.now()
            })
            .then(() => {
                showToast('Message sent successfully!');
                contactForm.reset();
                clearErrorMessages();
            })
            .catch((error) => {
                console.error('Error sending message:', error);
                showToast('Failed to send message. Try again.');
            });
        }
    });
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize all functionality
function initializeApp() {
    setCurrentYear();
    initializeMobileMenu();
    initializeSmoothScrolling();
    initializeThemeToggle();
    initializeProjectFilters();
    initializeTestimonialSlider();
    initializeContactForm();
    initializeProjectModals();
    
    // Check for prefers-reduced-motion
    checkReducedMotion();
}

// Set current year in footer
function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

//firebase


// Initialize smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize theme toggle functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    
    if (!themeToggle) return;
    
    // Check for saved theme or prefer-color-scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.textContent = '🌙';
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        themeIcon.textContent = newTheme === 'light' ? '🌙' : '☀️';
    });
}

// Initialize project filtering
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Show/hide projects based on filter
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    // Add fade in animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Initialize testimonial slider
function initializeTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    
    if (testimonials.length === 0) return;
    
    // Function to show a specific testimonial
    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }
    
    // Add click events to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });
    
    // Auto-advance testimonials (only if user hasn't reduced motion)
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        }, 5000);
    }
}

// Initialize contact form with validation
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // In a real application, you would send the form data to a server here
            // For this example, we'll simulate a successful submission
            
            // Show success toast
            showToast('Message sent successfully!');
            
            // Reset form
            contactForm.reset();
            
            // Clear error messages
            clearErrorMessages();
        }
    });
/*
    //firebase
    const firebaseConfig = {
    apiKey: "AIzaSyBOYiWMSTCRNe_5BaJwpMNAeC0vfk1pkP4",
    authDomain: "portfolio-54219.firebaseapp.com",
    databaseURL: "https://portfolio-54219-default-rtdb.firebaseio.com",
    projectId: "portfolio-54219",
    storageBucket: "portfolio-54219.firebasestorage.app",
    messagingSenderId: "980227302269",
    appId: "1:980227302269:web:ac9875289ac31384ea2214",
    measurementId: "G-CTZGZRE7MB"
  };
//initialize
  firebase.initializeApp(firebaseConfig);

  //reference database
  var portfolioDB = firebase.database().ref('portfolio')

  document.getElementById('contact-form').addEventListener("submit", submitform)
  function submitform(e){
    e.preventDefault();

    var name = getElementByVal('name');
    var email = getElementByVal('email');
    var message = getElementByVal('message');

    saveMessages(name, email, message);
  }

  const saveMessages = (name, email, message) => {
    var newContact = portfolioDB.push();

    newContact.set({
        name : name,
        email : email,
        message : message,
    })
  }

  const getElementByVal = (id) => {
    return document.getElementById(id).value;
  }
    */

    // Real-time validation for inputs
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear error when user starts typing
            if (this.classList.contains('error')) {
                clearFieldError(this);
            }
        });
    });
}

// Validate entire form
function validateForm() {
    const contactForm = document.getElementById('contact-form');
    const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual form field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    // Clear previous error
    clearFieldError(field);
    
    // Check if field is empty
    if (!value) {
        showFieldError(field, errorElement, 'This field is required');
        return false;
    }
    
    // Email validation
    if (fieldName === 'email' && !isValidEmail(value)) {
        showFieldError(field, errorElement, 'Please enter a valid email address');
        return false;
    }
    
    // Name validation (at least 2 characters)
    if (fieldName === 'name' && value.length < 2) {
        showFieldError(field, errorElement, 'Name must be at least 2 characters');
        return false;
    }
    
    // Message validation (at least 10 characters)
    if (fieldName === 'message' && value.length < 10) {
        showFieldError(field, errorElement, 'Message must be at least 10 characters');
        return false;
    }
    
    return true;
}

// Check if email is valid
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show field error
function showFieldError(field, errorElement, message) {
    field.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    const fieldName = field.getAttribute('name');
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Clear all error messages
function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(element => {
        element.textContent = '';
    });
    
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => {
        field.classList.remove('error');
    });
}

// Initialize project modals
function initializeProjectModals() {
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const modalClose = document.querySelector('.modal-close');
    
    if (!modal) return;
    
    // Add click event to project cards
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            openProjectModal(this);
        });
        
        // Make project cards keyboard accessible
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProjectModal(this);
            }
        });
    });
    
    // Close modal when clicking close button
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Open project modal with project details
function openProjectModal(projectCard) {
    const modal = document.getElementById('project-modal');
    const modalBody = document.querySelector('.modal-body');
    
    if (!modal || !modalBody) return;
    
    // Get project details from the card
    const title = projectCard.querySelector('.project-title').textContent;
    const description = projectCard.querySelector('.project-description').textContent;
    const tags = projectCard.querySelectorAll('.tag');
    const imageSrc = projectCard.querySelector('.project-image img').getAttribute('src');
    const imageAlt = projectCard.querySelector('.project-image img').getAttribute('alt');
    
    // Create modal content
    let tagsHTML = '';
    tags.forEach(tag => {
        tagsHTML += `<span class="tag">${tag.textContent}</span>`;
    });
    
    modalBody.innerHTML = `
        <div class="project-modal-content">
            <div class="project-modal-image">
                <img src="${imageSrc}" alt="${imageAlt}" width="800" height="400">
            </div>
            <div class="project-modal-details">
                <h2>${title}</h2>
                <p>${description}</p>
                <div class="project-modal-tags">
                    ${tagsHTML}
                </div>
                <div class="project-modal-links">
                    <a href="#" class="btn btn-primary">View Demo</a>
                    <a href="#" class="btn btn-secondary">View Code</a>
                </div>
                <div class="project-modal-features">
                    <h3>Features</h3>
                    <ul>
                        <li>Responsive design that works on all devices</li>
                        <li>Clean, semantic HTML structure</li>
                        <li>Accessible components with ARIA labels</li>
                        <li>Optimized performance and fast loading</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Focus trap inside modal
    trapFocus(modal);
}

// Close modal
function closeModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Focus trap for modal
function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (firstElement) {
        firstElement.focus();
    }
    
    modal.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    });
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('success-toast');
    const toastMessage = toast.querySelector('.toast-message');
    
    if (!toast) return;
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
    
    // Close toast when clicking close button
    const toastClose = toast.querySelector('.toast-close');
    if (toastClose) {
        toastClose.addEventListener('click', function() {
            toast.classList.remove('show');
        });
    }
}

// Check for reduced motion preference
function checkReducedMotion() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (reducedMotion) {
        // Disable or reduce animations
        document.documentElement.style.setProperty('--transition', 'none');
        
        // Stop any auto-advancing sliders
        // This is handled in the testimonial slider initialization
    }
}

// Add resize event listener to handle layout changes
window.addEventListener('resize', function() {
    // Close mobile menu on resize to larger screens
    if (window.innerWidth > 768) {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});