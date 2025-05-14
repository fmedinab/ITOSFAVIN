import { getProductById } from '../data/products.js';

// Clase para manejar el carrito de compras
export class Cart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.loadFromLocalStorage();
  }

  // Cargar carrito desde localStorage
  loadFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.items = JSON.parse(savedCart);
      this.updateTotal();
    }
  }

  // Guardar carrito en localStorage
  saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  // Añadir producto al carrito
  addItem(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) return false;

    // Verificar si el producto ya está en el carrito
    const existingItem = this.items.find(item => item.id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }

    this.updateTotal();
    this.saveToLocalStorage();
    this.updateCartUI();

    return true;
  }

  // Actualizar cantidad de un producto
  updateItemQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;

      if (item.quantity <= 0) {
        this.removeItem(productId);
      } else {
        this.updateTotal();
        this.saveToLocalStorage();
        this.updateCartUI();
      }

      return true;
    }

    return false;
  }

  // Eliminar producto del carrito
  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.updateTotal();
    this.saveToLocalStorage();
    this.updateCartUI();
  }

  // Vaciar carrito
  clearCart() {
    this.items = [];
    this.total = 0;
    this.saveToLocalStorage();
    this.updateCartUI();
  }

  // Actualizar total del carrito
  updateTotal() {
    this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Obtener cantidad total de productos en el carrito
  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  // Actualizar la interfaz de usuario
  updateCartUI() {
    // Actualizar contador del carrito
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
      cartCount.textContent = this.getItemCount();
    }

    // Actualizar items del carrito en el modal
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
      if (this.items.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Tu carrito está vacío</div>';
      } else {
        cartItemsContainer.innerHTML = '';

        this.items.forEach(item => {
          const cartItem = document.createElement('div');
          cartItem.className = 'cart-item';
          cartItem.innerHTML = `
            <div class="cart-item-image">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-price">S/ ${item.price.toFixed(2)}</div>
              <div class="cart-item-quantity">
                <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
              </div>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">&times;</button>
          `;

          cartItemsContainer.appendChild(cartItem);
        });

        // Añadir event listeners para botones de aumentar/disminuir cantidad
        const decreaseButtons = cartItemsContainer.querySelectorAll('.decrease-quantity');
        const increaseButtons = cartItemsContainer.querySelectorAll('.increase-quantity');
        const removeButtons = cartItemsContainer.querySelectorAll('.cart-item-remove');

        decreaseButtons.forEach(button => {
          button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            const item = this.items.find(item => item.id === productId);
            if (item && item.quantity > 1) {
              this.updateItemQuantity(productId, item.quantity - 1);
            } else {
              this.removeItem(productId);
            }
          });
        });

        increaseButtons.forEach(button => {
          button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            const item = this.items.find(item => item.id === productId);
            if (item) {
              this.updateItemQuantity(productId, item.quantity + 1);
            }
          });
        });

        removeButtons.forEach(button => {
          button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            this.removeItem(productId);
          });
        });
      }
    }

    // Actualizar total del carrito
    const cartTotal = document.getElementById('cart-total');
    if (cartTotal) {
      cartTotal.textContent = `S/ ${this.total.toFixed(2)}`;
    }
  }

  // Generar mensaje para WhatsApp
  generateWhatsAppMessage(customerName, paymentMethod) {
    let message = `*NUEVO PEDIDO DE ${customerName.toUpperCase()}*\n\n`;
    message += '*Productos:*\n';

    this.items.forEach(item => {
      message += `▪ ${item.name} (${item.quantity}) - S/ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n*Total:* S/ ${this.total.toFixed(2)}`;
    message += `\n*Método de pago:* ${paymentMethod}`;
    message += `\n\nGracias por tu pedido.`;

    return encodeURIComponent(message);
  }

  // Generar ticket HTML para el pedido
  generateTicketHTML(customerName, paymentMethod, orderNumber = Math.floor(Math.random() * 10000)) {
    const date = new Date();
    const dateString = date.toLocaleDateString('es-PE');
    const timeString = date.toLocaleTimeString('es-PE');

    let ticketHTML = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ticket #${orderNumber} - ITOSITOSFAVIN Pahoma Tools</title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
          }
          .ticket-header {
            text-align: center;
            margin-bottom: 20px;
          }
          .ticket-header h1 {
            font-size: 18px;
            margin: 0;
          }
          .ticket-info {
            margin-bottom: 20px;
          }
          .ticket-info p {
            margin: 5px 0;
          }
          .ticket-items {
            margin-bottom: 20px;
          }
          .ticket-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .ticket-total {
            font-weight: bold;
            text-align: right;
            border-top: 1px dashed #000;
            padding-top: 10px;
            margin-top: 10px;
          }
          .ticket-footer {
            text-align: center;
            margin-top: 30px;
            font-size: 14px;
          }
          @media print {
            .no-print {
              display: none;
            }
          }
          .print-button {
            display: block;
            margin: 20px auto;
            padding: 10px 15px;
            background-color: #0066ff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div class="ticket-header">
          <h1>ITOSITOSFAVIN Pahoma Tools</h1>
          <p>Tienda de Productos Eléctricos</p>
        </div>

        <div class="ticket-info">
          <p><strong>Ticket:</strong> #${orderNumber}</p>
          <p><strong>Fecha:</strong> ${dateString}</p>
          <p><strong>Hora:</strong> ${timeString}</p>
          <p><strong>Cliente:</strong> ${customerName}</p>
        </div>

        <div class="ticket-items">
          <h2>PRODUCTOS:</h2>
    `;

    this.items.forEach(item => {
      ticketHTML += `
        <div class="ticket-item">
          <span>${item.quantity}x ${item.name}</span>
          <span>S/ ${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      `;
    });

    ticketHTML += `
        <div class="ticket-total">
          <p>TOTAL: S/ ${this.total.toFixed(2)}</p>
          <p>MÉTODO DE PAGO: ${paymentMethod}</p>
        </div>
      </div>

      <div class="ticket-footer">
        <p>¡Gracias por tu compra!</p>
        <p>Para consultas: 902 770 994</p>
      </div>

      <button class="print-button no-print" onclick="window.print()">Imprimir Ticket</button>
      <button class="print-button no-print" onclick="window.close()">Cerrar</button>

      </body>
      </html>
    `;

    return ticketHTML;
  }
}

// Exportar una instancia única del carrito
export const cart = new Cart();
