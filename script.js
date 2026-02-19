// =====================================================
// G2 GLOBAL INTELLIGENCE - JAVASCRIPT INTERACTIONS
// =====================================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    initParticles();
    initNavbar();
    initMobileMenu();
    initFlipCards();
    initScrollAnimations();
    initCounters();
    initSmoothScroll();
});

// =====================================================
// PARTICLE SYSTEM
// =====================================================
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth > 768 ? 50 : 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// =====================================================
// NAVBAR SCROLL EFFECT
// =====================================================
function initNavbar() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', debounce(function () {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 10));
}

// =====================================================
// MOBILE MENU TOGGLE
// =====================================================
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// =====================================================
// FLIP CARDS - Mobile Touch Support
// =====================================================
function initFlipCards() {
    const flipCards = document.querySelectorAll('.service-card-flip');

    // For mobile devices, toggle flip on tap
    if (window.innerWidth <= 768) {
        flipCards.forEach(card => {
            card.addEventListener('click', function () {
                this.classList.toggle('flipped');
            });
        });
    }
}

// =====================================================
// SCROLL ANIMATIONS - Intersection Observer
// =====================================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // If it's a grid, stagger the children
                if (entry.target.classList.contains('services-grid') ||
                    entry.target.classList.contains('solutions-grid') ||
                    entry.target.classList.contains('testimonials-grid')) {
                    staggerChildren(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe sections
    const sections = document.querySelectorAll('.services, .solutions, .testimonials, .about, .cta-final');
    sections.forEach(section => observer.observe(section));

    // Observe cards
    const cards = document.querySelectorAll('.service-card-flip, .solution-card, .testimonial-card');
    cards.forEach(card => observer.observe(card));
}

// Stagger animation for grid children
function staggerChildren(parent) {
    const children = parent.children;
    Array.from(children).forEach((child, index) => {
        setTimeout(() => {
            child.style.animation = 'fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        }, index * 100);
    });
}

// =====================================================
// ANIMATED COUNTERS
// =====================================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.round(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

// =====================================================
// SMOOTH SCROLL
// =====================================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navLinks = document.getElementById('navLinks');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    document.getElementById('mobileMenuToggle').classList.remove('active');
                }
            }
        });
    });
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// =====================================================
// CONTACT FORM MODAL
// =====================================================
function initContactForm() {
    const modal = document.getElementById('contactModal');
    const closeModalBtn = document.getElementById('closeModal');
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    // Open modal when CTA buttons are clicked
    // IMPORTANT: Exclude the submit button inside the form to avoid blocking form submission
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    ctaButtons.forEach(button => {
        // Skip the submit button inside the contact form
        if (button.id === 'submitBtn' || button.closest('#contactForm')) {
            return;
        }
        button.addEventListener('click', function (e) {
            e.preventDefault();
            openModal();
        });
    });

    // Close modal
    closeModalBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with ESC key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Form submission
    contactForm.addEventListener('submit', handleFormSubmit);

    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });

        input.addEventListener('input', function () {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function openModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function validateField(field) {
    const fieldId = field.id;
    const errorElement = document.getElementById(fieldId + 'Error');
    let isValid = true;
    let errorMessage = '';

    // Remove previous error state
    field.classList.remove('error');
    if (errorElement) {
        errorElement.classList.remove('active');
    }

    // Validate based on field type
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
    } else if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Ingresa un email válido';
        }
    } else if (field.id === 'privacy' && field.type === 'checkbox' && !field.checked) {
        isValid = false;
        errorMessage = 'Debes aceptar la política de privacidad';
    }

    // Show error if invalid
    if (!isValid && errorElement) {
        field.classList.add('error');
        errorElement.textContent = errorMessage;
        errorElement.classList.add('active');
    }

    return isValid;
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');

    // Validate form
    if (!validateForm(form)) {
        return;
    }

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        company: document.getElementById('company').value,
        phone: document.getElementById('phone').value || 'No proporcionado',
        service: document.getElementById('service').options[document.getElementById('service').selectedIndex].text,
        message: document.getElementById('message').value || 'Sin mensaje adicional'
    };

    try {
        // Simulate API call (replace with actual EmailJS or backend call)
        await sendEmail(formData);

        // Hide form and show success message
        form.style.display = 'none';
        formSuccess.style.display = 'block';

        // Reset form after 3 seconds and close modal
        setTimeout(() => {
            form.reset();
            form.style.display = 'flex';
            formSuccess.style.display = 'none';
            closeModal();
        }, 3000);

    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        alert('Hubo un error al enviar el formulario. Por favor, intenta nuevamente.');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// =====================================================
// N8N WEBHOOK INTEGRATION
// =====================================================
async function sendEmail(formData) {
    // 🔗 CONFIGURACIÓN DEL WEBHOOK DE N8N
    // Reemplaza esta URL con tu webhook de N8N
    const N8N_WEBHOOK_URL = 'https://n8n.g2-gi.com/webhook/g2gi-leads';

    // Preparar datos optimizados para N8N + Retell AI
    const webhookPayload = {
        // Información del Lead
        lead: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            fullName: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            company: formData.company
        },

        // Información del Interés
        interest: {
            service: formData.service,
            message: formData.message
        },

        // Metadata para tracking
        metadata: {
            source: 'landing_page_g2gi',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            referrer: document.referrer || 'direct'
        },

        // Datos para Retell AI
        retellData: {
            contactName: `${formData.firstName} ${formData.lastName}`,
            contactPhone: formData.phone,
            contactEmail: formData.email,
            companyName: formData.company,
            serviceInterest: formData.service,
            customMessage: formData.message,
            // Prioridad basada en el servicio (puedes ajustar)
            priority: getPriorityByService(formData.service),
            // Mejor horario para llamar (puedes agregar un campo en el form)
            preferredCallTime: 'business_hours'
        }
    };

    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Opcional: Agregar autenticación si tu webhook lo requiere
                // 'Authorization': 'Bearer TU_TOKEN_AQUI'
            },
            body: JSON.stringify(webhookPayload)
        });

        // Verificar respuesta
        if (!response.ok) {
            throw new Error(`Error del webhook: ${response.status} ${response.statusText}`);
        }

        // Handle response - N8N may return JSON, text, or empty body
        let result;
        const responseText = await response.text();
        try {
            result = responseText ? JSON.parse(responseText) : { success: true };
        } catch (parseError) {
            // N8N returned non-JSON (e.g., "OK" or empty) - that's fine
            result = { success: true, rawResponse: responseText };
        }
        console.log('✅ Lead enviado a N8N exitosamente:', result);

        return result;

    } catch (error) {
        console.error('❌ Error al enviar a N8N:', error);

        // Opcional: Guardar en localStorage como backup
        saveLeadToLocalStorage(webhookPayload);

        throw error;
    }
}

// =====================================================
// FUNCIONES AUXILIARES
// =====================================================

// Determinar prioridad basada en el servicio seleccionado
function getPriorityByService(service) {
    const priorityMap = {
        'Automatización de Procesos': 'high',
        'Análisis Predictivo': 'high',
        'Automatización de Ventas': 'high',
        'Chatbots Inteligentes': 'medium',
        'Machine Learning': 'high',
        'Consultoría en IA': 'medium',
        'Otro': 'low'
    };

    return priorityMap[service] || 'medium';
}

// Guardar lead en localStorage como backup (opcional)
function saveLeadToLocalStorage(leadData) {
    try {
        const leads = JSON.parse(localStorage.getItem('g2gi_pending_leads') || '[]');
        leads.push({
            ...leadData,
            savedAt: new Date().toISOString(),
            status: 'pending'
        });
        localStorage.setItem('g2gi_pending_leads', JSON.stringify(leads));
        console.log('💾 Lead guardado en localStorage como backup');
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
    }
}

// Función para reenviar leads pendientes (llamar manualmente si es necesario)
function retryPendingLeads() {
    const leads = JSON.parse(localStorage.getItem('g2gi_pending_leads') || '[]');

    if (leads.length === 0) {
        console.log('No hay leads pendientes para reenviar');
        return;
    }

    console.log(`Reenviando ${leads.length} leads pendientes...`);

    leads.forEach(async (lead, index) => {
        try {
            await sendEmail(lead.lead);
            // Remover del localStorage si se envió exitosamente
            leads.splice(index, 1);
            localStorage.setItem('g2gi_pending_leads', JSON.stringify(leads));
        } catch (error) {
            console.error(`Error al reenviar lead ${index}:`, error);
        }
    });
}

// Initialize contact form
document.addEventListener('DOMContentLoaded', function () {
    initContactForm();
});

// =====================================================
// PARALLAX EFFECT (Optional - Light version)
// =====================================================
window.addEventListener('scroll', debounce(function () {
    const scrolled = window.pageYOffset;
    const sphere = document.querySelector('.sphere');

    if (sphere && window.innerWidth > 768) {
        sphere.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
}, 10));

// =====================================================
// PERFORMANCE OPTIMIZATION
// =====================================================

// Lazy load images when they come into view
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// =====================================================
// CONSOLE BRANDING (Optional Easter Egg)
// =====================================================
console.log('%c🤖 G2 Global Intelligence', 'font-size: 24px; font-weight: bold; color: #3B82F6;');
console.log('%cTransformando negocios con IA', 'font-size: 14px; color: #A1A1AA;');
console.log('%c¿Interesado en trabajar con nosotros? Visita: www.g2gi.com/careers', 'font-size: 12px; color: #71717A;');
