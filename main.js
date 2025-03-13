/**
 * Crea un slider reutilizable con controles, indicadores y botones de navegación
 * @param {Object} config - Configuración del slider
 * @param {string} config.containerSelector - Selector CSS del contenedor del slider
 * @param {string} config.itemSelector - Selector CSS de los elementos del slider
 * @param {string} config.indicatorsContainerSelector - Selector CSS del contenedor de indicadores
 * @param {string} config.prevButtonSelector - Selector CSS del botón anterior
 * @param {string} config.nextButtonSelector - Selector CSS del botón siguiente
 * @param {number} config.itemsVisible - Número de elementos visibles por sección
 * @param {number} config.itemsToScroll - Número de elementos a desplazar con los botones
 * @param {boolean} config.autoScroll - Activar/desactivar auto-scroll
 * @param {number} config.autoScrollInterval - Intervalo del auto-scroll en ms
 * @param {number} config.pauseTime - Tiempo de pausa después de clic en ms
 */
function createSlider(config) {
  // Configuración por defecto
  const defaultConfig = {
    containerSelector: '.slider-container',
    itemSelector: '.slider-item',
    indicatorsContainerSelector: '.slider-indicators',
    prevButtonSelector: null,
    nextButtonSelector: null,
    itemsVisible: 1,
    itemsToScroll: 1,
    autoScroll: true,
    autoScrollInterval: 3000,
    pauseTime: 12000
  };

  // Combinar configuración por defecto con la proporcionada
  const settings = { ...defaultConfig, ...config };

  // Obtener elementos
  const container = document.querySelector(settings.containerSelector);
  const items = container.querySelectorAll(settings.itemSelector);
  const indicatorsContainer = document.querySelector(settings.indicatorsContainerSelector);
  const prevButton = settings.prevButtonSelector ? document.querySelector(settings.prevButtonSelector) : null;
  const nextButton = settings.nextButtonSelector ? document.querySelector(settings.nextButtonSelector) : null;
  
  // Calcular dimensiones
  const itemGap = parseFloat(window.getComputedStyle(container).gap) || 0;
  const itemWidth = items[0].offsetWidth + itemGap;
  
  // Variables de control
  let scrollInterval = null;
  let pauseTimeout = null;
  let isPaused = false;

  // Calcular el número total de secciones basado en elementos visibles
  const totalSections = Math.ceil(items.length / settings.itemsVisible);
  
  // Establecer la cantidad de elementos a desplazar por clic
  const scrollStep = settings.itemsToScroll * itemWidth;

  // Función para ir a la sección anterior
  function goToPrevSection() {
    // Pausar el auto-scroll temporalmente
    pauseScroll(settings.pauseTime);
    
    const newScrollPosition = Math.max(0, container.scrollLeft - scrollStep);
    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
    
    // Actualizar indicador activo
    const currentSection = Math.floor(newScrollPosition / (settings.itemsVisible * itemWidth));
    updateActiveIndicator(currentSection);
  }
  
  // Función para ir a la siguiente sección
  function goToNextSection() {
    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
      // Si estamos al final, volver al inicio sin animación
      container.scrollTo({
        left: 0,
        behavior: 'auto'
      });
      updateActiveIndicator(0);
    } else {
      // Avanzar a la siguiente sección
      const newScrollPosition = Math.min(
        container.scrollWidth - container.clientWidth,
        container.scrollLeft + scrollStep
      );
      container.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
      
      // Actualizar indicador activo
      const currentSection = Math.floor(newScrollPosition / (settings.itemsVisible * itemWidth));
      updateActiveIndicator(currentSection < totalSections ? currentSection : totalSections - 1);
    }
  }
  
  // Configurar botones de navegación
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      goToPrevSection();
      pauseScroll(settings.pauseTime);
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      goToNextSection();
      pauseScroll(settings.pauseTime);
    });
  }

  // Crear indicadores
  if (indicatorsContainer) {
    // Limpiar indicadores existentes
    indicatorsContainer.innerHTML = '';
    
    // Crear indicadores por sección
    for (let i = 0; i < totalSections; i++) {
      const indicator = document.createElement('button');
      indicator.classList.add('indicador');
      indicator.setAttribute('data-section', `${i}`);
      
      indicator.addEventListener('click', (e) => {
        const section = parseInt(indicator.dataset.section);
        // Calcular la posición de scroll para cada sección
        const scrollPosition = section * (settings.itemsVisible * itemWidth);
        
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
        
        // Actualizar indicador activo
        Array.from(indicatorsContainer.children).forEach(child => {
          child.classList.remove('hover');
        });
        
        e.target.classList.add('hover');
        
        // Pausar el auto-scroll temporalmente
        pauseScroll(settings.pauseTime);
      });
      
      indicatorsContainer.appendChild(indicator);
    }
    
    // Marcar el primer indicador como activo al inicio
    if (indicatorsContainer.children.length > 0) {
      indicatorsContainer.children[0].classList.add('hover');
    }
  }

  // Función para pausar el scroll
  function pauseScroll(pauseTime) {
    // Limpiar cualquier pausa anterior que esté pendiente
    if (pauseTimeout) {
      clearTimeout(pauseTimeout);
      pauseTimeout = null;
    }
    
    // Detener el intervalo actual si existe
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = null;
    }
    
    isPaused = true;
    console.log(`Scroll pausado en ${settings.containerSelector}`);

    // Programar la reactivación después del tiempo de pausa
    pauseTimeout = setTimeout(() => {
      isPaused = false;
      console.log(`Scroll reactivado en ${settings.containerSelector}`);
      
      // Reiniciar el auto-scroll
      if (settings.autoScroll) {
        startAutoScroll();
      }
    }, pauseTime);
  }

  // Función de auto-scroll
  function startAutoScroll() {
    // Limpiar cualquier intervalo existente para evitar duplicados
    if (scrollInterval) {
      clearInterval(scrollInterval);
    }
    
    // Crear un nuevo intervalo
    if (settings.autoScroll) {
      scrollInterval = setInterval(() => {
        if (!isPaused) {
          goToNextSection();
        }
      }, settings.autoScrollInterval);
    }
  }

  // Función para actualizar el indicador activo
  function updateActiveIndicator(sectionIndex) {
    if (!indicatorsContainer) return;
    
    Array.from(indicatorsContainer.children).forEach((child, i) => {
      if (i === sectionIndex) {
        child.classList.add('hover');
      } else {
        child.classList.remove('hover');
      }
    });
  }

  // Agregar evento de scroll para actualizar indicadores
  container.addEventListener('scroll', () => {
    if (!indicatorsContainer) return;
    
    const currentScrollPosition = container.scrollLeft;
    const currentSection = Math.floor(currentScrollPosition / (settings.itemsVisible * itemWidth));
    updateActiveIndicator(currentSection);
    
    // Comprobar si los botones deben estar deshabilitados
    updateButtonStates(currentScrollPosition);
  });
  
  // Función para actualizar el estado de los botones
  function updateButtonStates(currentPosition) {
    if (prevButton) {
      // Deshabilitar el botón anterior si estamos al inicio
      if (currentPosition <= 0) {
        prevButton.classList.add('disabled');
      } else {
        prevButton.classList.remove('disabled');
      }
    }
    
    if (nextButton) {
      // Deshabilitar el botón siguiente si estamos al final
      if (currentPosition + container.clientWidth >= container.scrollWidth - 1) {
        nextButton.classList.add('disabled');
      } else {
        nextButton.classList.remove('disabled');
      }
    }
  }

  // Iniciar auto-scroll si está activado
  if (settings.autoScroll) {
    startAutoScroll();
  }
  
  // Inicializar el estado de los botones
  updateButtonStates(container.scrollLeft);

  // Devolver objeto con métodos públicos
  return {
    pauseScroll,
    startAutoScroll,
    goToNextSection,
    goToPrevSection,
    updateActiveIndicator,
    updateButtonStates,
    // Método para detener completamente el auto-scroll
    stopAutoScroll: () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
      }
      if (pauseTimeout) {
        clearTimeout(pauseTimeout);
        pauseTimeout = null;
      }
      isPaused = true;
    },
    // Método para reiniciar el auto-scroll
    restartAutoScroll: () => {
      isPaused = false;
      if (pauseTimeout) {
        clearTimeout(pauseTimeout);
        pauseTimeout = null;
      }
      startAutoScroll();
    }
  };
}
// Slider de planes
const plansSlider = createSlider({
  containerSelector: '.plans-container',
  itemSelector: '.plan-card',
  indicatorsContainerSelector: '.indicadores',
  prevButtonSelector: '.plans-prev-button',
  nextButtonSelector: '.plans-next-button',
  itemsVisible: 1,
  itemsToScroll: 1,
  autoScroll: true,
  autoScrollInterval: 3000,
  pauseTime: 5000  // Reducido de 12000 a 5000 para una mejor experiencia
});
const skillsSlider = createSlider({
  containerSelector: '.skills__grid',
  itemSelector: '.grid__item',
  indicatorsContainerSelector: '.skills__indicators',
  prevButtonSelector: '.flecha-isq',
  nextButtonSelector: '.flecha-der',
  itemsVisible: 3,
  itemsToScroll: 1,
  autoScroll: false,
});