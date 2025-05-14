// Datos de productos
export const products = [
  {
    id: 1,
    name: "Cable NYY 3x16mm² - 100m",
    description: "Cable de energía para distribución, flexible, 3 hilos, sección de 16mm².",
    price: 480.00,
    category: "cables",
    image: "/src/assets/images/cable-nyy.jpg",
    featured: true,
    stock: 15
  },
  {
    id: 2,
    name: "Luminaria LED 24W Panel",
    description: "Panel LED de 24W, luz blanca, para empotrar en cielo raso, alta eficiencia.",
    price: 120.00,
    category: "iluminacion",
    image: "/src/assets/images/luminaria-led.jpg",
    featured: true,
    stock: 30
  },
  {
    id: 3,
    name: "Toma Corriente Triple Empotrable",
    description: "Tomacorriente triple empotrable con protección para niños, color blanco.",
    price: 25.50,
    category: "enchufes",
    image: "/src/assets/images/tomacorriente.jpg",
    featured: false,
    stock: 50
  },
  {
    id: 4,
    name: "Taladro Eléctrico Profesional 800W",
    description: "Taladro profesional de 800W con mandril de 13mm, velocidad variable y reversa.",
    price: 350.00,
    category: "herramientas",
    image: "/src/assets/images/taladro.jpg",
    featured: true,
    stock: 10
  },
  {
    id: 5,
    name: "Caja Térmica 4 Llaves",
    description: "Caja térmica para 4 llaves termomagnéticas, con puerta y riel DIN.",
    price: 85.00,
    category: "tableros",
    image: "/src/assets/images/caja-termica.jpg",
    featured: false,
    stock: 20
  },
  {
    id: 6,
    name: "Llave Térmica 32A",
    description: "Llave térmica monofásica de 32A, 220V, capacidad de ruptura 6KA.",
    price: 45.00,
    category: "tableros",
    image: "/src/assets/images/llave-termica.jpg",
    featured: false,
    stock: 25
  },
  {
    id: 7,
    name: "Foco LED 15W E27",
    description: "Bombilla LED de 15W, casquillo E27, luz blanca fría, equivalente a 100W incandescente.",
    price: 18.90,
    category: "iluminacion",
    image: "/src/assets/images/foco-led.jpg",
    featured: true,
    stock: 60
  },
  {
    id: 8,
    name: "Cable THW 10 AWG - 100m",
    description: "Cable unipolar THW, calibre 10 AWG (5.26mm²), ideal para instalaciones domésticas.",
    price: 220.00,
    category: "cables",
    image: "/src/assets/images/cable-thw.jpg",
    featured: false,
    stock: 15
  },
  {
    id: 9,
    name: "Alicate Universal Profesional",
    description: "Alicate universal con mango aislado, para electricistas profesionales.",
    price: 38.50,
    category: "herramientas",
    image: "/src/assets/images/alicate.jpg",
    featured: false,
    stock: 30
  },
  {
    id: 10,
    name: "Interruptor Simple Empotrable",
    description: "Interruptor simple para empotrar, color blanco, con marco incluido.",
    price: 12.90,
    category: "enchufes",
    image: "/src/assets/images/interruptor.jpg",
    featured: false,
    stock: 45
  },
  {
    id: 11,
    name: "Reflector LED 50W Exterior",
    description: "Reflector LED para exterior, 50W, luz blanca fría, IP65 resistente al agua.",
    price: 79.90,
    category: "iluminacion",
    image: "/src/assets/images/reflector-led.jpg",
    featured: false,
    stock: 18
  },
  {
    id: 12,
    name: "Multímetro Digital Profesional",
    description: "Multímetro digital profesional con pantalla LCD, mide voltaje AC/DC, corriente, resistencia y más.",
    price: 125.00,
    category: "herramientas",
    image: "/src/assets/images/multimetro.jpg",
    featured: true,
    stock: 12
  },
  {
    id: 12,
    name: "Nuevo Profesional",
    description: "future digital profesional con pantalla LCD, mide voltaje AC/DC, corriente, resistencia y más.",
    price: 125.00,
    category: "future",
    image: "/src/assets/images/multimetro.jpg",
    featured: true,
    stock: 12
  }
];

// Obtener productos por categoría
export const getProductsByCategory = (category) => {
  return products.filter(product => product.category === category);
};

// Obtener productos destacados
export const getFeaturedProducts = () => {
  return products.filter(product => product.featured);
};

// Obtener producto por ID
export const getProductById = (id) => {
  return products.find(product => product.id === parseInt(id));
};

// Obtener todas las categorías disponibles
export const getCategories = () => {
  const categories = products.map(product => product.category);
  return [...new Set(categories)]; // Eliminar duplicados
};
