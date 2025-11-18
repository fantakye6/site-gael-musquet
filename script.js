// Animation des images de la galerie au scroll
const galleryImages = document.querySelectorAll('.gallery img');

window.addEventListener('scroll', () => {
    const triggerBottom = window.innerHeight * 0.9;

    galleryImages.forEach(img => {
        const imgTop = img.getBoundingClientRect().top;

        if(imgTop < triggerBottom){
            img.style.opacity = 1;
            img.style.transform = 'translateY(0)';
        }
    });
});
