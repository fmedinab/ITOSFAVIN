import { cart } from './components/cart.js';
import { productDisplay } from './components/products.js';
import { themeManager } from './components/theme.js';

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar el tema
  themeManager.initTheme();

  // Inicializar productos en la página de inicio
  initHomePage();

  // Inicializar navegación y menú móvil
  initNavigation();

  // Inicializar carrito
  initCart();

  // Inicializar botón de volver arriba
  initBackToTop();

  // Determinar qué página está activa y ejecutar su inicialización
  const currentPath = window.location.pathname;

  if (currentPath.includes('/tienda.html')) {
    initShopPage();
  } else if (currentPath.includes('/categorias.html')) {
    initCategoriesPage();
  } else if (currentPath.includes('/contacto.html')) {
    initContactPage();
  } else if (currentPath.includes('/servicios.html')) {
    initServicesPage();
  } else if (currentPath.includes('/nosotros.html')) {
    initAboutPage();
  }
});

// Inicializar el botón de volver arriba
function initBackToTop() {
  const backToTopButton = document.getElementById('back-to-top');

  if (backToTopButton) {
    // Mostrar/ocultar botón según scroll
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });

    // Evento de clic para volver arriba
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Inicializar página de inicio
function initHomePage() {
  // Mostrar productos destacados
  productDisplay.displayFeaturedProducts();
}

// Inicializar navegación y menú móvil
function initNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }

  // Añadir clase 'active' al enlace de navegación actual
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');

    if (href === currentPath ||
        (href === '/' && (currentPath === '/index.html' || currentPath === '/')) ||
        (currentPath !== '/' && currentPath !== '/index.html' && href !== '/' && currentPath.includes(href))) {
      link.classList.add('active');
    }
  });

  // Añadir clase 'active' a los enlaces de filtro de categorías si estamos en la página de categorías
  if (currentPath.includes('/categorias.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat');

    if (category) {
      const filterLinks = document.querySelectorAll('.filter-list a');
      filterLinks.forEach(link => {
        if (link.href.includes(`cat=${category}`)) {
          link.classList.add('active');
        }
      });
    }
  }

  // Lo mismo para la página de tienda (enlaces a categorías)
  if (currentPath.includes('/tienda.html')) {
    const shopSidebar = document.querySelector('.shop-sidebar');
    if (shopSidebar) {
      // Añadir título visible para categorías en tienda
      const categoriesTitle = document.createElement('h1');
      categoriesTitle.className = 'shop-title';
      categoriesTitle.textContent = 'Todos los Productos';

      // Añadir antes de la grid de productos
      const shopProductsContainer = document.querySelector('.shop-products');
      if (shopProductsContainer) {
        shopProductsContainer.insertBefore(categoriesTitle, shopProductsContainer.firstChild);
      }
    }
  }
}

// Inicializar carrito
function initCart() {
  // Actualizar UI del carrito
  cart.updateCartUI();

  // Event listeners para el carrito
  const cartBtn = document.getElementById('cart-btn');
  const cartModal = document.getElementById('cart-modal');
  const closeCart = document.getElementById('close-cart');
  const clearCart = document.getElementById('clear-cart');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (cartBtn && cartModal) {
    cartBtn.addEventListener('click', () => {
      cartModal.classList.add('active');
    });
  }

  if (closeCart && cartModal) {
    closeCart.addEventListener('click', () => {
      cartModal.classList.remove('active');
    });

    // Cerrar modal al hacer clic fuera
    cartModal.addEventListener('click', (event) => {
      if (event.target === cartModal) {
        cartModal.classList.remove('active');
      }
    });
  }

  if (clearCart) {
    clearCart.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        cart.clearCart();
      }
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      // Verificar si hay productos en el carrito
      if (cart.items.length === 0) {
        alert('Tu carrito está vacío. Añade productos antes de finalizar el pedido.');
        return;
      }

      // Crear modal de checkout
      createCheckoutModal();
    });
  }
}

// Crear modal de checkout
function createCheckoutModal() {
  // Remover modal existente si hay
  const existingModal = document.getElementById('checkout-modal');
  if (existingModal) {
    existingModal.remove();
  }

  // Crear nueva modal
  const checkoutModal = document.createElement('div');
  checkoutModal.id = 'checkout-modal';
  checkoutModal.className = 'modal';

  // Contenido del modal
  checkoutModal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Finalizar Pedido</h3>
        <button id="close-checkout" class="close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <form id="checkout-form" class="checkout-form">
          <div class="form-group">
            <label for="customer-name">Nombre completo</label>
            <input type="text" id="customer-name" class="form-input" required>
          </div>

          <div class="form-group">
            <label>Método de pago</label>
            <div class="payment-options">
              <div class="payment-option">
                <input type="radio" id="payment-cash" name="payment-method" value="Efectivo" checked class="payment-input">
                <label for="payment-cash" class="payment-label">
                  <span class="payment-icon">💵</span>
                  <span>Efectivo</span>
                </label>
              </div>
              <div class="payment-option">
                <input type="radio" id="payment-yape" name="payment-method" value="Yape" class="payment-input">
                <label for="payment-yape" class="payment-label">
                  <span class="payment-icon">📱</span>
                  <span>Yape</span>
                </label>
              </div>
              <div class="payment-option">
                <input type="radio" id="payment-plin" name="payment-method" value="Plin" class="payment-input">
                <label for="payment-plin" class="payment-label">
                  <span class="payment-icon">📲</span>
                  <span>Plin</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button id="back-to-cart" class="btn btn-secondary">Volver al carrito</button>
        <button id="confirm-order" class="btn btn-primary">Confirmar Pedido</button>
      </div>
    </div>
  `;

  document.body.appendChild(checkoutModal);

  // Mostrar modal
  setTimeout(() => {
    checkoutModal.classList.add('active');
  }, 10);

  // Event listeners
  const closeCheckout = document.getElementById('close-checkout');
  const backToCart = document.getElementById('back-to-cart');
  const confirmOrder = document.getElementById('confirm-order');
  const checkoutForm = document.getElementById('checkout-form');

  if (closeCheckout) {
    closeCheckout.addEventListener('click', () => {
      checkoutModal.classList.remove('active');
      setTimeout(() => {
        checkoutModal.remove();
      }, 300);
    });
  }

  if (backToCart) {
    backToCart.addEventListener('click', () => {
      checkoutModal.classList.remove('active');
      setTimeout(() => {
        checkoutModal.remove();
      }, 300);
    });
  }

  if (confirmOrder && checkoutForm) {
    confirmOrder.addEventListener('click', () => {
      // Validar nombre
      const customerName = document.getElementById('customer-name').value.trim();
      if (!customerName) {
        alert('Por favor ingresa tu nombre');
        return;
      }

      // Obtener método de pago
      const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

      // Generar mensaje de WhatsApp
      const whatsAppMessage = cart.generateWhatsAppMessage(customerName, paymentMethod);

      // Generar ticket HTML
      const ticketHTML = cart.generateTicketHTML(customerName, paymentMethod);

      // Abrir WhatsApp
      window.open(`https://wa.me/51902770994?text=${whatsAppMessage}`, '_blank');

      // Abrir ticket en nueva pestaña
      const ticketWindow = window.open('', '_blank');
      ticketWindow.document.write(ticketHTML);
      ticketWindow.document.close();

      // Limpiar carrito
      cart.clearCart();

      // Cerrar modales
      checkoutModal.classList.remove('active');
      document.getElementById('cart-modal').classList.remove('active');

      setTimeout(() => {
        checkoutModal.remove();
      }, 300);
    });
  }
}

// Inicializar página de tienda
function initShopPage() {
  const productsContainer = document.getElementById('shop-products-container');
  if (productsContainer) {
    productDisplay.displayAllProducts(productsContainer);
  }
}

// Inicializar página de categorías
function initCategoriesPage() {
  const categoryProductsContainer = document.getElementById('category-products-container');

  if (categoryProductsContainer) {
    // Obtener la categoría de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat');

    // Si hay contenedor de categorías, vaciar su contenido
    categoryProductsContainer.innerHTML = '';

    if (category) {
      // Actualizar título de la categoría
      const categoryTitle = document.getElementById('category-title');
      if (categoryTitle) {
        categoryTitle.textContent = productDisplay.getCategoryName(category);
      }

      // Mostrar productos de la categoría
      productDisplay.displayProductsByCategory(category, categoryProductsContainer);

      // Marcar el enlace de categoría como activo
      const categoryLinks = document.querySelectorAll('.filter-list a');
      categoryLinks.forEach(link => {
        if (link.href.includes(`cat=${category}`)) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Ocultar la vista general de categorías
      const categoriesOverview = document.querySelector('.categories-overview');
      if (categoriesOverview) {
        categoriesOverview.style.display = 'none';
      }
    } else {
      // Si no hay categoría seleccionada, mostrar la primera categoría por defecto (Cables y Conductores)
      const defaultCategory = 'cables';
      
      // Actualizar título de la categoría
      const categoryTitle = document.getElementById('category-title');
      if (categoryTitle) {
        categoryTitle.textContent = productDisplay.getCategoryName(defaultCategory);
      }
      
      // Mostrar productos de la categoría por defecto
      productDisplay.displayProductsByCategory(defaultCategory, categoryProductsContainer);
      
      // Marcar el enlace de la primera categoría como activo
      const categoryLinks = document.querySelectorAll('.filter-list a');
      if (categoryLinks.length > 0) {
        categoryLinks[0].classList.add('active');
      }
      
      // Ocultar la vista general de categorías
      const categoriesOverview = document.querySelector('.categories-overview');
      if (categoriesOverview) {
        categoriesOverview.style.display = 'none';
      }
      
      // Actualizar la URL con la categoría por defecto (sin recargar la página)
      const newUrl = window.location.pathname + '?cat=' + defaultCategory;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
  }
}

// Inicializar página de contacto
function initContactPage() {
  const contactForm = document.getElementById('contact-form');
  const previewButton = document.getElementById('preview-btn');

  if (contactForm) {
    // Manejar vista previa del mensaje
    if (previewButton) {
      previewButton.addEventListener('click', (event) => {
        event.preventDefault();
        showContactPreview();
      });
    }

    // Manejar envío del formulario
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      // Obtener los valores del formulario
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
      const contactMethod = document.querySelector('input[name="contact-method"]:checked').value;

      // Validación básica
      if (!name || !email || !subject || !message) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
      }

      // Dependiendo del método seleccionado, enviar por email o WhatsApp
      if (contactMethod === 'email') {
        sendByEmail(name, email, phone, subject, message);
      } else {
        sendByWhatsApp(name, email, phone, subject, message);
      }

      // Mostrar confirmación
      alert(`¡Gracias ${name}! Tu mensaje ha sido enviado. Te contactaremos pronto.`);
      contactForm.reset();
    });
  }
}

// Función para mostrar una vista previa del mensaje
function showContactPreview() {
  // Obtener los valores del formulario
  const name = document.getElementById('name').value.trim() || '[Tu nombre]';
  const email = document.getElementById('email').value.trim() || 'tu@email.com';
  const phone = document.getElementById('phone').value.trim() || '[Tu teléfono]';
  const subject = document.getElementById('subject').value.trim() || '[Asunto]';
  const message = document.getElementById('message').value.trim() || '[Mensaje...]';
  const contactMethod = document.querySelector('input[name="contact-method"]:checked').value;

  // Crear el modal de vista previa
  const previewModal = document.createElement('div');
  previewModal.id = 'preview-modal';
  previewModal.className = 'modal';

  // Determinar qué contenido mostrar según el método
  let previewContent = '';

  if (contactMethod === 'email') {
    previewContent = `
      <h4>Vista previa del email:</h4>
      <p><strong>De:</strong> ${name} (${email})</p>
      <p><strong>Para:</strong> info@itositosfavin.com</p>
      <p><strong>Asunto:</strong> ${subject}</p>
      <p><strong>Mensaje:</strong></p>
      <div class="preview-message">${message.replace(/\n/g, '<br>')}</div>
      <p><strong>Teléfono:</strong> ${phone}</p>
    `;
  } else {
    // Construir el mensaje de WhatsApp como se enviaría
    previewContent = `
      <h4>Vista previa del mensaje de WhatsApp:</h4>
      <div class="preview-message whatsapp-preview">
        *Contacto desde la web ITOSITOSFAVIN*

        *Nombre:* ${name}
        *Email:* ${email}
        *Teléfono:* ${phone}
        *Asunto:* ${subject}

        *Mensaje:*
        ${message}
      </div>
    `;
  }

  // Construir el modal
  previewModal.innerHTML = `
    <div class="modal-content preview-modal">
      <div class="modal-header">
        <h3>Vista previa de tu mensaje</h3>
        <button id="close-preview" class="close-btn">&times;</button>
      </div>
      <div class="modal-body">
        ${previewContent}
      </div>
      <div class="modal-footer">
        <button id="edit-message" class="btn btn-secondary">Editar</button>
        <button id="send-message" class="btn btn-primary">Enviar</button>
      </div>
    </div>
  `;

  // Añadir a la página
  document.body.appendChild(previewModal);

  // Mostrar el modal
  setTimeout(() => {
    previewModal.classList.add('active');
  }, 10);

  // Manejar botones
  const closeButton = document.getElementById('close-preview');
  const editButton = document.getElementById('edit-message');
  const sendButton = document.getElementById('send-message');

  // Cerrar modal
  closeButton.addEventListener('click', () => {
    previewModal.classList.remove('active');
    setTimeout(() => {
      previewModal.remove();
    }, 300);
  });

  // Editar (cerrar modal)
  editButton.addEventListener('click', () => {
    previewModal.classList.remove('active');
    setTimeout(() => {
      previewModal.remove();
    }, 300);
  });

  // Enviar el mensaje
  sendButton.addEventListener('click', () => {
    // Obtener valores actualizados
    const currentName = document.getElementById('name').value.trim();
    const currentEmail = document.getElementById('email').value.trim();
    const currentPhone = document.getElementById('phone').value.trim();
    const currentSubject = document.getElementById('subject').value.trim();
    const currentMessage = document.getElementById('message').value.trim();
    const currentMethod = document.querySelector('input[name="contact-method"]:checked').value;

    // Validación básica
    if (!currentName || !currentEmail || !currentSubject || !currentMessage) {
      alert('Por favor, complete todos los campos obligatorios antes de enviar.');
      return;
    }

    // Enviar según método seleccionado
    if (currentMethod === 'email') {
      sendByEmail(currentName, currentEmail, currentPhone, currentSubject, currentMessage);
    } else {
      sendByWhatsApp(currentName, currentEmail, currentPhone, currentSubject, currentMessage);
    }

    // Cerrar modal
    previewModal.classList.remove('active');
    setTimeout(() => {
      previewModal.remove();
    }, 300);

    // Mostrar confirmación y resetear formulario
    alert(`¡Gracias ${currentName}! Tu mensaje ha sido enviado. Te contactaremos pronto.`);
    document.getElementById('contact-form').reset();
  });
}

// Función para enviar por email (simulado)
function sendByEmail(name, email, phone, subject, message) {
  // En un entorno real, aquí enviarías el form a un backend
  console.log('Enviando por email a info@itositosfavin.com');
  console.log('De:', name, email);
  console.log('Asunto:', subject);
  console.log('Mensaje:', message);
  console.log('Teléfono:', phone);

  // Como esto es una demo, simulamos el envío y abrimos el cliente de correo del usuario
  // usando mailto: con los datos del formulario
  const mailtoSubject = encodeURIComponent(`Contacto web: ${subject}`);
  const mailtoBody = encodeURIComponent(
    `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}\n\nMensaje:\n${message}`
  );

  window.open(`mailto:info@itositosfavin.com?subject=${mailtoSubject}&body=${mailtoBody}`);
}

// Función para enviar por WhatsApp
function sendByWhatsApp(name, email, phone, subject, message) {
  // Construir mensaje para WhatsApp
  const whatsappMessage = encodeURIComponent(
    `*Contacto desde la web ITOSITOSFAVIN*\n\n*Nombre:* ${name}\n*Email:* ${email}\n*Teléfono:* ${phone}\n*Asunto:* ${subject}\n\n*Mensaje:*\n${message}`
  );

  // Abrir WhatsApp con el mensaje
  window.open(`https://wa.me/51902770994?text=${whatsappMessage}`, '_blank');
}

// Inicializar página de servicios
function initServicesPage() {
  // Añadir event listeners para los botones de cotización
  const quoteBtns = document.querySelectorAll('.service-details .btn-primary');

  quoteBtns.forEach(btn => {
    btn.addEventListener('click', (event) => {
      // Podríamos añadir analítica aquí o funcionalidad personalizada
      console.log('Solicitud de cotización para:', btn.closest('.service-item').querySelector('h2').textContent);
    });
  });
}

// Inicializar página de nosotros
function initAboutPage() {
  // Por ahora la página de nosotros es principalmente estática
  // Podríamos añadir más funcionalidad en el futuro
}
