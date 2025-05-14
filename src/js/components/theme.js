/**
 * Módulo para manejar el tema (claro/oscuro) de la aplicación
 */

// Función para obtener la preferencia de tema del usuario del localStorage
const getStoredTheme = () => {
  return localStorage.getItem('theme');
};

// Función para establecer el tema
const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

// Función para cambiar el tema
const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  updateToggleState(newTheme);
};

// Función para actualizar el estado del interruptor según el tema actual
const updateToggleState = (theme) => {
  const toggleCheckbox = document.getElementById('theme-toggle');
  if (toggleCheckbox) {
    toggleCheckbox.checked = theme === 'dark';
  }
};

// Función para inicializar el tema basado en la preferencia del usuario
const initTheme = () => {
  // Intentar obtener el tema del localStorage
  const storedTheme = getStoredTheme();

  // Si hay un tema guardado, aplicarlo
  if (storedTheme) {
    setTheme(storedTheme);
    updateToggleState(storedTheme);
  } else {
    // Si no hay tema guardado, intentar detectar la preferencia del sistema
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    if (prefersDarkScheme.matches) {
      setTheme('dark');
      updateToggleState('dark');
    } else {
      setTheme('light');
      updateToggleState('light');
    }
  }

  // Añadir event listener al interruptor de tema
  const themeToggle = document.getElementById('theme-toggle');

  if (themeToggle) {
    themeToggle.addEventListener('change', toggleTheme);
  }
};

export const themeManager = {
  initTheme,
  toggleTheme,
  setTheme
};
