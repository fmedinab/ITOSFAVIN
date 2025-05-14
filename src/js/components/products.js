import { getFeaturedProducts, getProductsByCategory } from '../data/products.js';
import { cart } from './cart.js';

// Clase para manejar la visualización de productos
export class ProductDisplay {
  constructor() {
    this.featuredContainer = document.getElementById('featured-products-container');
    this.allProducts = [];
    this.currentFilters = {
      category: null,
      search: '',
    };
  }

  // Cargar todos los productos
  async loadAllProducts() {
    // Si ya están cargados, no hacemos nada
    if (this.allProducts.length > 0) return this.allProducts;

    try {
      const module = await import('../data/products.js');
      this.allProducts = module.products || [];
      return this.allProducts;
    } catch (error) {
      console.error('Error al cargar los productos:', error);
      return [];
    }
  }

  // Crear un elemento de tarjeta de producto
  createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.setAttribute('data-category', product.category);
    productCard.setAttribute('data-id', product.id);

    // Verificar si el producto ya está en el carrito
    const isInCart = cart.items.some(item => item.id === product.id);
    const buttonText = isInCart ? 'En el carrito ✓' : 'Añadir al carrito';
    const buttonClass = isInCart ? 'add-to-cart in-cart' : 'add-to-cart';

    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <div class="product-category">${this.getCategoryName(product.category)}</div>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-price">S/ ${product.price.toFixed(2)}</div>
        <div class="product-actions">
          <button class="${buttonClass}" data-id="${product.id}">${buttonText}</button>
        </div>
      </div>
    `;

    // Añadir event listener para el botón de añadir al carrito
    const addToCartButton = productCard.querySelector('.add-to-cart');
    addToCartButton.addEventListener('click', (event) => {
      event.preventDefault();
      const productId = parseInt(addToCartButton.getAttribute('data-id'));

      // Si ya está en el carrito, no hacemos nada
      if (addToCartButton.classList.contains('in-cart')) {
        // Opcional: abrir el modal del carrito
        document.getElementById('cart-modal').classList.add('active');
        return;
      }

      const success = cart.addItem(productId, 1);

      if (success) {
        // Cambiar aspecto del botón
        addToCartButton.textContent = 'En el carrito ✓';
        addToCartButton.classList.add('in-cart');

        // Animar el botón con efecto de pulso
        addToCartButton.classList.add('pulse');
        setTimeout(() => {
          addToCartButton.classList.remove('pulse');
        }, 700);

        this.showNotification(`${product.name} ha sido añadido al carrito`);
      }
    });

    return productCard;
  }

  // Obtener el nombre legible de una categoría
  getCategoryName(categorySlug) {
    const categoryNames = {
      'cables': 'Cables y Conductores',
      'iluminacion': 'Iluminación',
      'enchufes': 'Enchufes y Tomacorrientes',
      'herramientas': 'Herramientas Eléctricas',
      'tableros': 'Tableros y Accesorios'
      
    };

    return categoryNames[categorySlug] || categorySlug;
  }

  // Obtener el slug de categoría a partir del nombre
  getCategorySlug(categoryName) {
    const categoryMap = {
      'Cables y Conductores': 'cables',
      'Iluminación': 'iluminacion',
      'Enchufes y Tomacorrientes': 'enchufes',
      'Herramientas Eléctricas': 'herramientas',
      'Tableros y Accesorios': 'tableros'
    };

    return categoryMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-');
  }

  // Mostrar productos destacados en la página de inicio
  async displayFeaturedProducts() {
    if (!this.featuredContainer) return;

    // Añadimos estilos para el botón "in-cart" y la animación de pulso
    this.addCartButtonStyles();

    const featuredProducts = getFeaturedProducts();
    this.featuredContainer.innerHTML = '';

    if (featuredProducts.length === 0) {
      this.featuredContainer.innerHTML = '<div class="loading">No hay productos destacados disponibles</div>';
      return;
    }

    featuredProducts.forEach(product => {
      const productCard = this.createProductCard(product);
      this.featuredContainer.appendChild(productCard);
    });
  }

  // Filtrar productos por categoría
  async filterProductsByCategory(categorySlug, container) {
    if (!container) return;

    // Actualizar los filtros actuales
    this.currentFilters.category = categorySlug;

    const products = await this.loadAllProducts();
    const filteredProducts = categorySlug
      ? products.filter(product => product.category === categorySlug)
      : products;

    this.displayFilteredProducts(filteredProducts, container);
  }

  // Mostrar productos filtrados
  displayFilteredProducts(products, container) {
    container.innerHTML = '';

    if (products.length === 0) {
      container.innerHTML = '<div class="no-products">No hay productos disponibles con los filtros seleccionados</div>';
      return;
    }

    // Animación de entrada
    container.style.opacity = '0';

    products.forEach(product => {
      const productCard = this.createProductCard(product);
      container.appendChild(productCard);
    });

    // Animar la aparición
    setTimeout(() => {
      container.style.transition = 'opacity 0.5s ease';
      container.style.opacity = '1';
    }, 50);
  }

  // Mostrar productos por categoría en la página de categorías
  async displayProductsByCategory(categorySlug, container) {
    if (!container) return;

    // Añadimos estilos para el botón "in-cart" y la animación de pulso
    this.addCartButtonStyles();

    // Mostrar elemento de carga
    container.innerHTML = '<div class="loading">Cargando productos...</div>';

    // Esperar un poco para mostrar la carga (para una mejor UX)
    setTimeout(async () => {
      // Usar nueva función de filtrado
      await this.filterProductsByCategory(categorySlug, container);
    }, 300);
  }

  // Mostrar todos los productos en la página de tienda
  async displayAllProducts(container) {
    if (!container) return;

    // Añadimos estilos para el botón "in-cart" y la animación de pulso
    this.addCartButtonStyles();

    // Añadir filtros en la página de tienda si no existen
    this.setupShopFilters(container);

    // Mostrar elemento de carga
    container.innerHTML = '<div class="loading">Cargando productos...</div>';

    // Cargar todos los productos
    setTimeout(async () => {
      const products = await this.loadAllProducts();
      this.displayFilteredProducts(products, container);
    }, 300);
  }

  // Configurar filtros en la página de tienda
  setupShopFilters(container) {
    // Solo configurar filtros si estamos en la página de tienda
    if (!window.location.pathname.includes('/tienda.html')) return;

    // Verificar si ya existen los filtros
    if (document.getElementById('shop-filters-bar')) return;

    // Crear barra de filtros
    const shopSidebar = document.querySelector('.shop-sidebar');

    if (shopSidebar) {
      // Añadir buscador
      const searchDiv = document.createElement('div');
      searchDiv.className = 'filter-section search-section';
      searchDiv.innerHTML = `
        <h3>Buscar Productos</h3>
        <div class="search-container">
          <input type="text" id="product-search" class="form-input" placeholder="Buscar productos...">
        </div>
      `;

      // Insertar al inicio del sidebar
      shopSidebar.insertBefore(searchDiv, shopSidebar.firstChild);

      // Añadir estilo para el buscador
      const style = document.createElement('style');
      style.textContent = `
        .search-container {
          margin-bottom: var(--spacing-md);
        }

        #product-search {
          width: 100%;
          padding: var(--spacing-md);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background-color: var(--input-bg);
          color: var(--input-text);
        }

        #product-search:focus {
          border-color: var(--color-primary);
          outline: none;
          box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.1);
        }

        .filter-list li {
          position: relative;
        }

        .filter-list a.active::before {
          content: '✓';
          position: absolute;
          left: 5px;
          color: var(--color-primary);
        }

        .filter-list a.active {
          padding-left: 25px;
        }
      `;
      document.head.appendChild(style);

      // Añadir evento de búsqueda
      const searchInput = document.getElementById('product-search');
      if (searchInput) {
        searchInput.addEventListener('input', this.handleSearch.bind(this));
      }

      // Añadir eventos a los enlaces de categoría
      document.querySelectorAll('.filter-list a').forEach(link => {
        link.addEventListener('click', (event) => {
          event.preventDefault();

          // Quitar clase active de todos los enlaces
          document.querySelectorAll('.filter-list a').forEach(a => {
            a.classList.remove('active');
          });

          // Añadir clase active al enlace seleccionado
          link.classList.add('active');

          // Obtener categoría del enlace
          const href = link.getAttribute('href');
          const catParam = new URLSearchParams(href.split('?')[1]).get('cat');

          // Filtrar productos
          this.filterProductsByCategory(catParam, container);
        });
      });
    }
  }

  // Manejar búsqueda de productos
  async handleSearch(event) {
    const searchTerm = event.target.value.trim().toLowerCase();
    this.currentFilters.search = searchTerm;

    // Obtener el contenedor de productos
    const container = document.getElementById('shop-products-container');
    if (!container) return;

    // Cargar todos los productos
    const products = await this.loadAllProducts();

    // Filtrar por categoría y término de búsqueda
    let filteredProducts = this.currentFilters.category
      ? products.filter(product => product.category === this.currentFilters.category)
      : products;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product => {
        return product.name.toLowerCase().includes(searchTerm) ||
               this.getCategoryName(product.category).toLowerCase().includes(searchTerm);
      });
    }

    // Mostrar productos filtrados
    this.displayFilteredProducts(filteredProducts, container);
  }

  // Añadir estilos para los botones de carrito
  addCartButtonStyles() {
    // Verificar si ya existen los estilos
    if (!document.getElementById('cart-button-styles')) {
      const style = document.createElement('style');
      style.id = 'cart-button-styles';
      style.textContent = `
        .add-to-cart.in-cart {
          background: var(--color-secondary);
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .add-to-cart.pulse {
          animation: pulse 0.7s ease;
        }

        .no-products {
          grid-column: 1 / -1;
          text-align: center;
          padding: var(--spacing-xl);
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        [data-theme="dark"] .add-to-cart.in-cart {
          background: var(--color-secondary-dark);
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          color: var(--text-secondary);
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Mostrar notificación de producto añadido
  showNotification(message, duration = 3000) {
    // Crear el elemento de notificación si no existe
    let notification = document.getElementById('product-notification');

    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'product-notification';
      notification.className = 'notification';
      document.body.appendChild(notification);

      // Añadir estilos para la notificación
      const style = document.createElement('style');
      style.textContent = `
        .notification {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background-color: var(--color-primary);
          color: white;
          padding: 12px 20px;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
          transform: translateY(100px);
          opacity: 0;
          transition: transform 0.3s ease, opacity 0.3s ease;
          z-index: 9999;
        }
        .notification.active {
          transform: translateY(0);
          opacity: 1;
        }
      `;
      document.head.appendChild(style);
    }

    // Mostrar la notificación
    notification.textContent = message;
    notification.classList.add('active');

    // Ocultar la notificación después de un tiempo
    setTimeout(() => {
      notification.classList.remove('active');
    }, duration);
  }
}

// Exportar una instancia única
export const productDisplay = new ProductDisplay();
