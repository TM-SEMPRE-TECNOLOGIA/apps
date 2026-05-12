/* 
    TM-MEUS-APPS PORTFÓLIO: SCRIPT INTERATIVO
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- NAVBAR GLASMORPHISM NO SCROLL ---
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- DIGITAÇÃO DINÂMICA (TYPE EFFECT) ---
    const typeEffect = document.querySelector('.type-effect');
    if (typeEffect) {
        const words = ['Soluções Robustas.', 'Sistemas Escaláveis.', 'Interfaces Elegantes.', 'Automação Python.', 'APIs React+FastAPI.'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let timeout;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typeEffect.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typeEffect.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = 80; // Vel padrão de digitação

            if (isDeleting) typeSpeed /= 2;

            // Transições
            if (!isDeleting && charIndex === currentWord.length) {
                // Terminou de digitar a palavra (Pausa longa antes de apagar)
                isDeleting = true;
                typeSpeed = 1500;
            } else if (isDeleting && charIndex === 0) {
                // Terminou de apagar
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 300;
            }

            timeout = setTimeout(type, typeSpeed);
        }
        
        // Iniciar
        setTimeout(type, 1000);
    }

    // --- TIMELINE INTERSECTION OBSERVER ---
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -150px 0px', // Aciona um pouco antes de chegar no limite inferior da tela
        threshold: 0.1
    };

    const timelineObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Adicional: podemos iluminar o pontinho caso tenhamos feito scroll até lá
                const dot = entry.target.querySelector('.timeline-dot');
                if (dot && !dot.classList.contains('highlight-node')) {
                    // Efeito sutil ao entrar na view
                    dot.style.transform = 'scale(1.2)';
                    setTimeout(() => { dot.style.transform = 'scale(1)'; }, 300);
                }
            } else {
                // Se quisermos que volte a esconder ao sair da view, ative a linha abaixo
                // entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    // --- SCROLL SUAVE PARA LINKS ÂNCORA ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Compensar o header fixo
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });

    // --- EFEITO PARALLAX SUTIL NO MOUSE (Hero Background Glow) ---
    const heroSection = document.getElementById('hero');
    const heroGlow = document.querySelector('.hero-bg-glow');

    if (heroSection && heroGlow) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            // Movemos de forma sutil inversamente ao mouse
            heroGlow.style.transform = `translate(-50%, -50%) translate(${x * 50}px, ${y * 50}px)`;
        });
    }

});
