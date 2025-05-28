document.addEventListener("DOMContentLoaded", () => {
  // Viewport height calculation for mobile
  function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  setVH();
  window.addEventListener('resize', setVH);

  // Logo animation
  const logo = document.querySelector('.logo');
  const logoContainer = document.querySelector('.logo-container');
  
  if (logoContainer && logo) {
    logoContainer.addEventListener('mouseenter', () => {
      logo.style.transform = 'scale(1.05) rotate(-5deg)';
      logo.style.filter = `
        drop-shadow(0 0 8px var(--primary))
        drop-shadow(0 0 20px rgba(255, 107, 158, 0.9))
        brightness(1.2)
      `;
    });
    
    logoContainer.addEventListener('mouseleave', () => {
      logo.style.transform = 'scale(1)';
      logo.style.filter = `
        drop-shadow(0 0 5px var(--primary))
        drop-shadow(0 0 15px rgba(255, 107, 158, 0.7))
        brightness(1.1)
      `;
    });
  }

  // Menu tab functionality
  const tabButtons = document.querySelectorAll('.tab-btn');
  const menuCategories = document.querySelectorAll('.menu-category');

  function showCategory(categoryName) {
    // Hide all categories
    menuCategories.forEach(category => {
      category.classList.remove('active');
    });
    
    // Remove active class from all buttons
    tabButtons.forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Show selected category
    const targetCategory = document.querySelector(`[data-category="${categoryName}"]`);
    if (targetCategory) {
      targetCategory.classList.add('active');
    }
    
    // Add active class to clicked button
    const targetButton = document.querySelector(`.tab-btn[data-category="${categoryName}"]`);
    if (targetButton) {
      targetButton.classList.add('active');
    }
  }

  // Add click event listeners to tab buttons
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-category');
      showCategory(category);
      
      // Add visual feedback
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = '';
      }, 150);
    });
  });

  // Contact form functionality
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
      let isValid = true;
      
      requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!data[field] || data[field].trim() === '') {
          isValid = false;
          input.style.borderColor = '#ff4444';
          input.style.boxShadow = '0 0 0 3px rgba(255, 68, 68, 0.1)';
        } else {
          input.style.borderColor = 'var(--medium-bg)';
          input.style.boxShadow = 'none';
        }
      });
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailInput = document.getElementById('email');
      if (data.email && !emailRegex.test(data.email)) {
        isValid = false;
        emailInput.style.borderColor = '#ff4444';
        emailInput.style.boxShadow = '0 0 0 3px rgba(255, 68, 68, 0.1)';
      }
      
      if (isValid) {
        // Simulate form submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending... ⏳';
        submitButton.disabled = true;
        
        setTimeout(() => {
          contactForm.style.display = 'none';
          formSuccess.style.display = 'block';
          
          // Reset form after 5 seconds
          setTimeout(() => {
            contactForm.reset();
            contactForm.style.display = 'block';
            formSuccess.style.display = 'none';
            submitButton.textContent = originalText;
            submitButton.disabled = false;
          }, 5000);
        }, 2000);
        
        // Store form data (in a real app, this would be sent to a server)
        console.log('Form submitted:', data);
        
        // If newsletter subscription is checked, show additional message
        if (data.newsletter) {
          console.log('User subscribed to newsletter');
        }
      } else {
        // Show error message
        showNotification('Please fill in all required fields correctly.', 'error');
      }
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Add loading states for external links
  document.querySelectorAll('a[href^="http"], a[href^="tel:"], a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', function() {
      if (this.href.includes('tel:') || this.href.includes('mailto:')) {
        showNotification('Opening in your default app...', 'info');
      }
    });
  });

  // Notification system
  function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'error' ? '#ff4444' : type === 'success' ? '#4CAF50' : 'var(--primary)'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 1rem;
      font-family: 'Comic Neue', cursive;
      font-weight: 700;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    `;
    
    closeBtn.addEventListener('click', () => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  // Add hover effects to menu items
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Add click effects to buttons
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousedown', function() {
      this.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('mouseup', function() {
      this.style.transform = '';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });

  // Parallax effect for background glow
  let ticking = false;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.background-glow');
    
    if (parallax) {
      const speed = scrolled * 0.1;
      parallax.style.transform = `translateY(${speed}px)`;
    }
    
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick);

  // Add intersection observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe elements for animations
  document.querySelectorAll('.feature-card, .menu-item, .contact-card, .hours-card, .commitment-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Add floating animation to donut icons
  document.querySelectorAll('.donut-icon').forEach((icon, index) => {
    icon.style.animationDelay = `${index * 0.5}s`;
  });

  // Initialize page-specific functionality
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  switch (currentPage) {
    case 'menu.html':
      initializeMenuPage();
      break;
    case 'contact.html':
      initializeContactPage();
      break;
    case 'about.html':
      initializeAboutPage();
      break;
    default:
      initializeHomePage();
  }

  function initializeHomePage() {
    // Add special home page animations
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.opacity = '0';
      hero.style.transform = 'translateY(30px)';
      setTimeout(() => {
        hero.style.transition = 'opacity 1s ease, transform 1s ease';
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
      }, 300);
    }
  }

  function initializeMenuPage() {
    // Show classic donuts by default
    showCategory('classic');
  }

  function initializeContactPage() {
    // Add form validation styling
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.style.borderColor = 'var(--primary)';
        this.style.boxShadow = '0 0 0 3px rgba(255,107,158,0.1)';
      });
      
      input.addEventListener('blur', function() {
        if (!this.value) {
          this.style.borderColor = 'var(--medium-bg)';
          this.style.boxShadow = 'none';
        }
      });
    });
  }

  function initializeAboutPage() {
    // Add timeline animations
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.2}s`;
    });
  }

  // Performance optimization: lazy load images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  console.log("Family Donut Shop website fully loaded! 🍩");
});