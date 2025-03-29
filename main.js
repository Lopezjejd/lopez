
const menuButton = document.getElementById('nav__button');
const nav = document.querySelector('.nav__ul');
const navOriginalContainer = nav.parentElement; // Guarda el contenedor original del nav
const menu = document.querySelector('.menu');

// Función que se ejecutará cuando el ancho de la ventana cambie
function handleWindowResize() {
    if (window.innerWidth <= 768) {
        // Mueve el nav al body
        menu.appendChild(nav);
        console.log("Nav movido al body.");
    } else {
        // Devuelve el nav a su contenedor original
        navOriginalContainer.appendChild(nav);
        console.log("Nav devuelto a su contenedor original.");
    }
}

// Añadir el evento `resize` a la ventana
window.addEventListener('resize', handleWindowResize);

// Ejecutar la función al cargar la página para manejar el estado inicial
handleWindowResize();
menuButton.addEventListener('click',()=>{
menu.classList.toggle('show-menu')
});

function crearSlider({ 
  contenedor, 
  itemSelector, 
  flechaIzquierda, 
  flechaDerecha, 
  indicadoresSelector, 
  casillasMovil = 3, 
  casillasEscritorio = 5, 
  autoScroll = 5000 
}) {
  const fila = document.querySelector(contenedor);
  const items = document.querySelectorAll(itemSelector);
  const arrowLeft = document.querySelector(flechaIzquierda);
  const arrowRight = document.querySelector(flechaDerecha);
  const indicadores = document.querySelector(indicadoresSelector);

  if (!fila || items.length === 0 || !arrowLeft || !arrowRight || !indicadores) {
    console.error('❌ Error: Algunos elementos del slider no fueron encontrados.');
    return;
  }

  let gap = parseFloat(window.getComputedStyle(fila).gap) || 0;
  let casillas = window.innerWidth <= 800 ? casillasMovil : casillasEscritorio;
  let desplazamiento = (items[0].offsetWidth + gap) * casillas;
  let usuarioInteractuando = false;

  function actualizarCasillas() {
    casillas = window.innerWidth <= 800 ? casillasMovil : casillasEscritorio;
    desplazamiento = (items[0].offsetWidth + gap) * casillas;
    generarIndicadores();
  }

  function actualizarFlechas() {
    arrowLeft.disabled = fila.scrollLeft <= 0;
    arrowRight.disabled = fila.scrollLeft >= fila.scrollWidth - fila.clientWidth;
  }

  function generarIndicadores() {
    indicadores.innerHTML = '';
    const paginas = Math.ceil(items.length / casillas);
    
    for (let i = 0; i < paginas; i++) {
      const boton = document.createElement('button');
      boton.dataset.index = i;
      if (i === 0) {
        console.log("pornografia")
        boton.classList.add('activo')
      };
      boton.addEventListener('click', () =>{
         moverASeccion(i)
        classList.add('activo')
      });
      indicadores.appendChild(boton);
    }
  }

  function actualizarIndicadores() {
    const index = Math.round((fila.scrollLeft / (fila.scrollWidth - fila.clientWidth)) * (indicadores.children.length - 1));
  }

  function moverASeccion(index) {
    const maxScroll = fila.scrollWidth - fila.clientWidth;
    const targetScroll = maxScroll * (index / (indicadores.children.length - 1));
    fila.scrollTo({ left: targetScroll, behavior: 'smooth' });
    actualizarIndicadores();
    pausarAutoScroll();
  }

  let autoScrollInterval;
  function iniciarAutoScroll() {
    if (autoScroll > 0) {
      autoScrollInterval = setInterval(() => {
        if (fila.scrollLeft >= fila.scrollWidth - fila.clientWidth) {
          fila.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          fila.scrollBy({ left: desplazamiento, behavior: 'smooth' });
        }
        actualizarIndicadores();
      }, autoScroll);
    }
  }

  function pausarAutoScroll() {
    usuarioInteractuando = true;
    clearInterval(autoScrollInterval);
    setTimeout(() => {
      usuarioInteractuando = false;
      iniciarAutoScroll();
    }, 20000);
  }

  arrowRight.addEventListener('click', () => {
    fila.scrollBy({ left: desplazamiento, behavior: 'smooth' });
    actualizarIndicadores();
    pausarAutoScroll();
  });

  arrowLeft.addEventListener('click', () => {
    fila.scrollBy({ left: -desplazamiento, behavior: 'smooth' });
    actualizarIndicadores();
    pausarAutoScroll();
  });

  fila.addEventListener('scroll', () => {
    actualizarFlechas();
    actualizarIndicadores();
  });
  
  fila.addEventListener('mousedown', pausarAutoScroll);

  window.addEventListener('resize', actualizarCasillas);
  actualizarCasillas();
  iniciarAutoScroll();
}
document.addEventListener('DOMContentLoaded', () => {
  crearSlider({
    contenedor: '.skills__grid',
    itemSelector: '.grid__item',
    flechaIzquierda: '.flecha-isq',
    flechaDerecha: '.flecha-der',
    indicadoresSelector: '.skills__indicators',
    casillasMovil:3,
    casillasEscritorio:3,
    autoScroll:false
  });
});