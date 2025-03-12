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
// scroll automatico

const plansContainer = document.querySelector('.plans-container');
const plansGap = parseFloat(window.getComputedStyle(plansContainer).gap);
const planCard = document.querySelectorAll('.plan-card');
const cardMove = planCard[0].offsetWidth + plansGap;

let intervalo; // Variable para almacenar el intervalo
let pausado = false; // Variable para controlar el estado de pausa

function autoScroll() {
  intervalo = setInterval(() => {
    if (!pausado) { // Solo ejecutar si no está pausado
      if (plansContainer.scrollLeft + plansContainer.clientWidth >= plansContainer.scrollWidth - 1) {
        // Volver al inicio
        plansContainer.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      } else {
        // Hacer scroll hacia la derecha
        plansContainer.scrollBy({
          left: cardMove,
          behavior: 'smooth'
        });
      }
    }
  }, 3000); // Intervalo de scroll cada 3 segundos
}

// Iniciar el autoScroll
autoScroll();
// Función para pausar y reactivar el intervalo
function pausarScroll(tiempoPausa) {
  pausado = true; // Pausar el intervalo
  console.log('Scroll pausado');

  // Reactivar después del tiempo de pausa
  setTimeout(() => {
    pausado = false; // Reactivar el intervalo
    console.log('Scroll reactivado');
  }, tiempoPausa);
}
const indicadores = document.querySelector('.indicadores');
   //planCard .leght = 3
   for(let i = 0;i < planCard.length;i++){
    const indicador = document.createElement('button');
    indicador.classList.add('indicador');
    indicador.setAttribute('data-section',`${i}`)
    indicador.addEventListener('click',(e)=>{
      pausarScroll(12000)
      const section = parseInt(indicador.dataset.section);
      plansContainer.scrollTo({
        left: plansContainer.scrollWidth * (section / 3) ,
        behavior: 'smooth'
      });
        for (const child of indicadores.children) {
          child.classList.remove('hover');
        }
      
      e.target.classList.add('hover');
    })
    document.querySelector('.indicadores').appendChild(indicador);
    
    
      
   }