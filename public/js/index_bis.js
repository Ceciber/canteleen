function initCarousel(carouselSelector) {
    let currentIndex = 0;
    const carousel = document.querySelector(carouselSelector);
    const slides = carousel.querySelectorAll('.slider-item');
    const totalSlides = slides.length;
  
    const leftArrow = carousel.querySelector('.arrow.left');
    const rightArrow = carousel.querySelector('.arrow.right');
  
    // Gérer le clic sur la flèche gauche
    leftArrow.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlider();
    });
  
    // Gérer le clic sur la flèche droite
    rightArrow.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider();
    });
  
    // Fonction pour mettre à jour la position du carrousel
    function updateSlider() {
      slides.forEach((slide, index) => {
        slide.classList.remove('active'); // Supprimer la classe 'active' de toutes les iframes
        if (index === currentIndex) {
          slide.classList.add('active'); // Ajouter la classe 'active' à l'iframe active
        }
      });
  
    }
  
  
    // Initialiser le carrousel
    updateSlider();
  }
  
  // Initialiser les carrousels pour les deux sections
  initCarousel('.carousel-entry-screen');
  initCarousel('.carousel-stand-screen');