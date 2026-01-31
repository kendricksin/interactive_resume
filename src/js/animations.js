class AnimationManager {
    constructor() {
        this.initAnimations();
    }

    initAnimations() {
        // Add scroll animations
        this.addScrollAnimations();

        // Add hover effects for better interactivity
        this.addHoverEffects();

        // Add flower interactive animations
        this.initFlowerAnimation();
    }

    initFlowerAnimation() {
        const flower = document.querySelector('.flower');
        if (!flower) return;

        // Add hover effect - flower perks up when hovered
        flower.addEventListener('mouseenter', () => {
            flower.style.animation = 'none';
            flower.style.transform = 'rotate(0deg) scale(1.15)';
            flower.style.transition = 'transform 0.3s ease';

            // Make petals bloom slightly
            const petals = flower.querySelectorAll('.petal');
            petals.forEach((petal, index) => {
                petal.style.transform = `scale(1.1) translateY(-2px)`;
                petal.style.transition = 'transform 0.3s ease';
            });
        });

        flower.addEventListener('mouseleave', () => {
            flower.style.transition = 'transform 0.3s ease';
            flower.style.transform = '';

            // Reset petals
            const petals = flower.querySelectorAll('.petal');
            petals.forEach(petal => {
                petal.style.transform = '';
                petal.style.transition = 'transform 0.3s ease';
            });

            // Resume swaying animation after transition
            setTimeout(() => {
                flower.style.animation = '';
                flower.style.transition = '';
            }, 300);
        });

        // Add click effect - flower bounces
        flower.addEventListener('click', () => {
            flower.style.animation = 'none';
            flower.style.transform = 'scale(0.9)';

            setTimeout(() => {
                flower.style.transform = 'scale(1.2)';
                flower.style.transition = 'transform 0.15s ease';
            }, 100);

            setTimeout(() => {
                flower.style.transform = '';
                flower.style.transition = 'transform 0.2s ease';
            }, 250);

            setTimeout(() => {
                flower.style.animation = '';
                flower.style.transition = '';
            }, 500);
        });
    }

    addScrollAnimations() {
        // Observer for elements entering viewport
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Apply to cards and sections
        const animatedElements = document.querySelectorAll('.work-item, .education-item, .project-item, .skill-category, .interest-item, .award-item, .certificate-item, .language-item');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    addHoverEffects() {
        // Add subtle hover effects to make the site feel more interactive
        const hoverables = document.querySelectorAll('a, button, .work-item, .education-item, .project-item');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.cursor = 'pointer';
            });
        });
    }
}

const animationManager = new AnimationManager();
