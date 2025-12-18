// Three.js Background Animation
const initThreeJS = () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20; // Spread elements
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Create material
    const material = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x3B82F6,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    // Light
    const pointLight = new THREE.PointLight(0xffffff, 0.1);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    scene.add(pointLight);

    camera.position.z = 5;

    // Mouse interaction variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const animate = () => {
        requestAnimationFrame(animate);

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

        // Continuous subtle movement
        particlesMesh.rotation.y += 0.0005;

        renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Mouse movement
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });
};

// 3D Tilt Effect for Cards
const initTiltEffect = () => {
    // Exclude navbar from tilt effect
    const cards = document.querySelectorAll('.glass:not(#navbar)');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;

            gsap.to(card, {
                duration: 0.5,
                rotateX: rotateX,
                rotateY: rotateY,
                scale: 1.02,
                transformPerspective: 1000,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.5,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                ease: "power2.out"
            });
        });
    });
};

// Magnetic Button Effect
const initMagneticButtons = () => {
    const buttons = document.querySelectorAll('.btn-glow, .magnetic-btn');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                duration: 0.3,
                x: x * 0.3,
                y: y * 0.3,
                ease: "power2.out"
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                duration: 0.3,
                x: 0,
                y: 0,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
};

// Initialize everything when DOM is ready
$(document).ready(function () {

    // Init Three.js
    initThreeJS();

    // Init Owl Carousel
    $(".owl-carousel").owlCarousel({
        loop: true,
        margin: 20,
        nav: false,
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
            0: { items: 1 },
            600: { items: 2 },
            1000: { items: 3 }
        }
    });

    // Mobile Menu Toggle
    // Mobile Menu Toggle
    const navLinks = $('#mobile-menu');

    const toggleMenu = () => {
        navLinks.toggleClass('hidden flex flex-col absolute top-full left-0 w-full bg-darker/95 backdrop-blur-lg p-6 space-y-4 border-b border-white/10');

        if (navLinks.hasClass('flex')) {
            // Menu is OPENING
            navLinks.removeClass('md:flex items-center gap-8');
            navLinks.find('a.btn-glow').removeClass('w-auto').addClass('w-full text-center');

            // Stagger animate menu items in
            gsap.from(navLinks.children(), {
                y: 20,
                opacity: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: "power2.out"
            });
        } else {
            // Menu is CLOSING
            navLinks.addClass('hidden md:flex items-center gap-8');
            navLinks.find('a.btn-glow').addClass('w-auto').removeClass('w-full text-center');
        }
    };

    $('.fa-bars').on('click', toggleMenu);

    // Close mobile menu when a link is clicked
    navLinks.find('a').on('click', function () {
        if (navLinks.hasClass('flex')) {
            toggleMenu();
        }
    });

    // Close mobile menu when clicking outside
    $(document).on('click', function (e) {
        if (navLinks.hasClass('flex') &&
            !$(e.target).closest('#mobile-menu').length &&
            !$(e.target).closest('.fa-bars').length) {
            toggleMenu();
        }
    });

    // Dynamic Date for Scarcity Banner
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    $('#current-month').text(month);

    // FAQ Accordion
    $('.faq-btn').on('click', function () {
        const content = $(this).next();
        const icon = $(this).find('i');

        if (content.height() === 0) {
            $('.faq-content').css('height', '0');
            $('.faq-btn i').removeClass('rotate-45 text-secondary').addClass('text-accent');

            content.css('height', content[0].scrollHeight + 'px');
            icon.addClass('rotate-45 text-secondary').removeClass('text-accent');

            // Animate content fade in
            gsap.fromTo(content.children(),
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.3, delay: 0.1 }
            );
        } else {
            content.css('height', '0');
            icon.removeClass('rotate-45 text-secondary').addClass('text-accent');
        }
    });

    // GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Call Advanced Effects
    initTiltEffect();
    initMagneticButtons();

    // Header Blur on Scroll (Disabled)
    /*
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 50) {
            nav.classList.add('bg-darker/80', 'backdrop-blur-xl', 'shadow-lg', 'border-white/10');
            nav.classList.remove('glass', 'border-white/5');
        } else {
            nav.classList.remove('bg-darker/80', 'backdrop-blur-xl', 'shadow-lg', 'border-white/10');
            nav.classList.add('glass', 'border-white/5');
        }
    });
    */

    // ---------------------------------------------
    // ADVANCED GSAP ANIMATIONS
    // ---------------------------------------------

    // 1. Hero Text Reveal (Staggered & Fancy)
    const tlHero = gsap.timeline();

    tlHero.from(".hero-title", {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: "power3.out"
    })
        .from(".hero-title + p", {
            duration: 1,
            y: 20,
            opacity: 0,
            ease: "power3.out"
        }, "-=0.8")
        .from(".hero-buttons a", {
            duration: 1,
            y: 20,
            // opacity: 0, // Removed for visibility
            stagger: 0.1,
            clearProps: "all",
            ease: "power2.out"
        }, "-=0.8")
        .from(".animate-pulse-slow", {
            duration: 2,
            opacity: 0,
            stagger: 0.3,
            ease: "power2.out"
        }, "-=1.5");


    // 2. Parallax Effects (Disabled)
    // gsap.to(".hero-title", { ... });
    // gsap.to("header .container > p", { ... });


    // 3. Section Titles Reveal (Split-like effect)
    gsap.utils.toArray("section h2").forEach(heading => {
        gsap.from(heading, {
            scrollTrigger: {
                trigger: heading,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            duration: 1,
            y: 50,
            opacity: 0,
            clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
            ease: "power4.out"
        });

        // Final state
        gsap.to(heading, {
            scrollTrigger: {
                trigger: heading,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 1
        });
    });


    // 4. Staggered Card Entrances with 3D feel
    const revealCards = (selector) => {
        gsap.utils.toArray(selector).forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 90%",
                },
                duration: 1,
                y: 100,
                opacity: 0,
                rotationX: 15,
                transformOrigin: "center top",
                ease: "power3.out",
                delay: i * 0.1 // Stagger based on index
            });
        });
    };

    revealCards("#how-it-works .glass");
    revealCards("#features .glass");

    // Special stagger for Testimonials
    gsap.from("#reviews .glass", {
        scrollTrigger: {
            trigger: "#reviews",
            start: "top 75%",
        },
        duration: 1,
        x: 100,
        opacity: 0,
        stagger: 0.2,
        ease: "power3.out"
    });


    // 5. Counters
    gsap.utils.toArray(".count-up").forEach(counter => {
        const target = parseInt(counter.getAttribute("data-target"));
        ScrollTrigger.create({
            trigger: counter,
            start: "top 85%",
            once: true,
            onEnter: () => {
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2.5,
                    snap: { innerHTML: 1 },
                    ease: "circ.out"
                });
            }
        });
    });

    // 6. Timeline / Path Animation (Simulated)
    // If there were SVG lines, we would draw them here. 
    // Instead we'll animate the step numbers in "How It Works"
    gsap.utils.toArray("#how-it-works .w-16").forEach((circle, i) => {
        gsap.from(circle, {
            scrollTrigger: {
                trigger: circle,
                start: "top 80%",
            },
            scale: 0,
            rotation: -180,
            duration: 1,
            ease: "elastic.out(1, 0.5)",
            delay: i * 0.2
        });
    });



    // ---------------------------------------------
    // MODAL LOGIC
    // ---------------------------------------------
    const modal = $('#application-modal');

    const openModal = () => {
        modal.removeClass('hidden').addClass('flex');
        // Animate In
        gsap.fromTo("#modal-backdrop",
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );
        gsap.fromTo("#modal-content",
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
        );
        $('body').addClass('overflow-hidden');
    };

    const closeModal = () => {
        // Animate Out
        gsap.to("#modal-backdrop", { opacity: 0, duration: 0.2 });
        gsap.to("#modal-content", {
            opacity: 0,
            scale: 0.95,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {
                modal.removeClass('flex').addClass('hidden');
                $('body').removeClass('overflow-hidden');
            }
        });
    };

    // Open Modal Triggers (Any link to #contact or explicit buttons)
    $('a[href="#contact"]').on('click', function (e) {
        e.preventDefault();
        openModal();
    });

    // Close Modal Triggers
    $('#close-modal, #modal-backdrop').on('click', closeModal);

    // Form Submission
    // Form Submission (WhatsApp Redirect)
    $('#application-form').on('submit', function (e) {
        e.preventDefault();

        const btn = $(this).find('button[type="submit"]');
        const originalText = btn.text();

        // Gather Data
        const fullName = $('#full-name').val();
        const email = $('#email').val();
        const whatsapp = $('#whatsapp').val();
        const businessType = $('#business-type').val();
        const website = $('#website').val() || "N/A";
        const description = $('#description').val();

        // Construct Message
        const message = `*New Project Inquiry from WebWizBD* 🚀\n\n` +
            `👤 *Name:* ${fullName}\n` +
            `📧 *Email:* ${email}\n` +
            `📱 *WhatsApp:* ${whatsapp}\n` +
            `🏢 *Business Type:* ${businessType}\n` +
            `🌐 *Website:* ${website}\n\n` +
            `📝 *Project Details:* \n${description}`;

        // Encode for URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappNumber = "+8801764355195";
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // UI Feedback
        btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin mr-2"></i> Redirecting to WhatsApp...');

        setTimeout(() => {
            // Redirect
            window.open(whatsappURL, '_blank');

            // Reset UI
            closeModal();
            btn.prop('disabled', false).text(originalText);
            $('#application-form')[0].reset();
        }, 1500);
    });

});
