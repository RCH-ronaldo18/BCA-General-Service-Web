// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function () {

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===== BACK TO TOP BUTTON =====
    const backToTopButton = document.getElementById('backToTop');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Cerrar navbar en móvil después de click
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    });

    // ===== LIGHTBOX PARA IMÁGENES DE PROYECTOS =====
    const projectImages = document.querySelectorAll('.img-clickable');
    let currentImageIndex = 0;
    let imagesArray = [];

    // Crear lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';

    const lightboxImg = document.createElement('img');
    lightboxImg.className = 'lightbox-img';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '&times;';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'lightbox-nav lightbox-prev';
    prevBtn.innerHTML = '&#10094;';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'lightbox-nav lightbox-next';
    nextBtn.innerHTML = '&#10095;';

    lightbox.appendChild(closeBtn);
    lightbox.appendChild(prevBtn);
    lightbox.appendChild(lightboxImg);
    lightbox.appendChild(nextBtn);
    document.body.appendChild(lightbox);

    // Configurar imágenes para lightbox
    projectImages.forEach((img, index) => {
        imagesArray.push(img.src);

        img.addEventListener('click', function (e) {
            e.preventDefault();
            currentImageIndex = index;
            openLightbox(img.src);
        });
    });

    // Funciones del lightbox
    function openLightbox(imgSrc) {
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + imagesArray.length) % imagesArray.length;
        lightboxImg.src = imagesArray[currentImageIndex];
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % imagesArray.length;
        lightboxImg.src = imagesArray[currentImageIndex];
    }

    // Event listeners del lightbox
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navegación con teclado
    document.addEventListener('keydown', function (e) {
        if (lightbox.classList.contains('active')) {
            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        }
    });

    // ===== FORMULARIO WHATSAPP =====
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Tu número de WhatsApp (sin el +) - REEMPLAZA CON TU NÚMERO
    const whatsappNumber = '51976042238'; // Ejemplo: 51974132970

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validación básica
            const inputs = this.querySelectorAll('input[required], textarea[required], select[required]');
            let isValid = true;

            // Resetear mensajes de error
            errorMessage.style.display = 'none';

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                }
            });

            // Validar email
            const emailInput = document.getElementById('email');
            if (emailInput && emailInput.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    isValid = false;
                    emailInput.classList.add('is-invalid');
                    showError('Por favor, ingrese un correo electrónico válido.');
                }
            }

            // Validar teléfono
            const telefonoInput = document.getElementById('telefono');
            if (telefonoInput && telefonoInput.value) {
                const telefonoRegex = /^[0-9+\-\s]{7,15}$/;
                if (!telefonoRegex.test(telefonoInput.value)) {
                    isValid = false;
                    telefonoInput.classList.add('is-invalid');
                    showError('Por favor, ingrese un número de teléfono válido.');
                }
            }

            if (!isValid) {
                showError('Por favor, complete todos los campos requeridos correctamente.');
                return;
            }

            // Cambiar estado del botón
            const btnText = document.querySelector('.btn-text');
            const btnLoader = document.querySelector('.btn-loader');
            const submitBtn = document.getElementById('submitBtn');

            if (btnText && btnLoader) {
                btnText.style.display = 'none';
                btnLoader.style.display = 'inline-block';
            }
            if (submitBtn) {
                submitBtn.disabled = true;
            }

            // Obtener datos del formulario
            const nombre = document.getElementById('nombre').value;
            const empresa = document.getElementById('empresa').value || 'No especificada';
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;
            const servicio = document.getElementById('servicio').value;
            const mensaje = document.getElementById('mensaje').value;

            // Crear mensaje para WhatsApp
            const fecha = new Date().toLocaleDateString('es-PE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const whatsappMessage = `¡Hola BCA General Services! 👋

📋 *SOLICITUD DE COTIZACIÓN*

👤 *Nombre:* ${nombre}
🏢 *Empresa:* ${empresa}
📧 *Email:* ${email}
📱 *Teléfono:* ${telefono}
🛠️ *Servicio solicitado:* ${servicio}
📅 *Fecha:* ${fecha}

💬 *Mensaje/Proyecto:*
${mensaje}

---
*Enviado desde el sitio web de BCA General Services*
*https://bcageneralservices.com*`;

            // Codificar el mensaje para URL
            const encodedMessage = encodeURIComponent(whatsappMessage);

            // Mostrar mensaje de éxito
            showSuccess('¡Formulario completado! Abriendo WhatsApp...');

            // Esperar 1 segundo para mostrar el mensaje
            setTimeout(() => {
                // Redirigir a WhatsApp
                const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                window.open(whatsappURL, '_blank');

                // Limpiar formulario
                contactForm.reset();
                contactForm.querySelectorAll('.is-valid').forEach(el => {
                    el.classList.remove('is-valid');
                });

                // Restaurar botón
                if (btnText && btnLoader) {
                    btnText.style.display = 'inline-block';
                    btnLoader.style.display = 'none';
                }
                if (submitBtn) {
                    submitBtn.disabled = false;
                }

                // Ocultar mensaje después de 3 segundos
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 3000);

            }, 1000);
        });

        // Función para mostrar mensaje de éxito
        function showSuccess(message) {
            successMessage.querySelector('strong').nextSibling.textContent = ' ' + message;
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';
        }

        // Función para mostrar mensaje de error
        function showError(message) {
            errorMessage.querySelector('strong').nextSibling.textContent = ' ' + message;
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';

            // Ocultar después de 5 segundos
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 5000);
        }
    }

    // ===== ANIMACIONES AL SCROLL =====
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-card, .value-card, .project-card');

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('fade-in');
            }
        });
    }

    // Ejecutar al cargar y al hacer scroll
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // ===== ANIMACIÓN DE ESTADÍSTICAS =====
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');

        statNumbers.forEach(stat => {
            // Guardar el contenido HTML original
            const originalContent = stat.innerHTML;

            // Extraer el número del texto
            const textContent = stat.textContent || stat.innerText;
            const numberMatch = textContent.match(/\d+/);

            if (numberMatch) {
                const target = parseInt(numberMatch[0]);
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        // Restaurar el contenido original con símbolos
                        stat.innerHTML = originalContent;
                        clearInterval(timer);
                    } else {
                        // Mostrar solo el número durante la animación
                        stat.textContent = Math.floor(current);
                    }
                }, 30);
            }
        });
    }

    // Ejecutar animación cuando la sección hero sea visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        observer.observe(heroSection);
    }

    // ===== VALIDACIÓN EN TIEMPO REAL =====
    const formInputs = document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select');

    formInputs.forEach(input => {
        input.addEventListener('input', function () {
            if (this.value.trim()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
            }
        });

        input.addEventListener('blur', function () {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('is-invalid');
            }
        });
    });

});