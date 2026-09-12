document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Matrix Rain Background (Original subtle matrix)
    const initMatrixRain = () => {
        const canvas = document.getElementById('matrix-bg');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        const chars = '01アイウエオカキクケコサシスセソ'.split('');
        const fontSize = 14;
        let columns = Math.floor(width / fontSize);
        let drops = [];
        
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
        
        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, width, height);
            
            ctx.fillStyle = '#00ff88'; // Green text
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        
        let interval = setInterval(draw, 50);
        
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            columns = Math.floor(width / fontSize);
            drops = [];
            for (let x = 0; x < columns; x++) {
                drops[x] = 1;
            }
            clearInterval(interval);
            interval = setInterval(draw, 50);
        });
    };

    // 2. Interactive Floating Memoji (3D Head & Eyes Follow Mouse Cursor)
    const initMemojiTracker = () => {
        const tracker = document.getElementById('memojiTracker');
        const img = document.getElementById('memojiImg');
        if (!tracker || !img) return;

        let targetRotX = 0;
        let targetRotY = 0;
        let targetTransX = 0;
        let targetTransY = 0;

        let currentRotX = 0;
        let currentRotY = 0;
        let currentTransX = 0;
        let currentTransY = 0;

        const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        if (!isTouch) {
            window.addEventListener('mousemove', (e) => {
                const rect = tracker.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const deltaX = e.clientX - centerX;
                const deltaY = e.clientY - centerY;

                // Max rotation of 22 degrees in Y and 18 degrees in X
                targetRotY = Math.max(-22, Math.min(22, deltaX * 0.035));
                targetRotX = Math.max(-18, Math.min(18, -deltaY * 0.035));

                // Slight 3D shift towards mouse
                targetTransX = Math.max(-14, Math.min(14, deltaX * 0.015));
                targetTransY = Math.max(-14, Math.min(14, deltaY * 0.015));
            });

            window.addEventListener('mouseleave', () => {
                targetRotX = 0;
                targetRotY = 0;
                targetTransX = 0;
                targetTransY = 0;
            });
        }

        const animateMemoji = () => {
            // Smooth interpolation (lerp)
            currentRotX += (targetRotX - currentRotX) * 0.08;
            currentRotY += (targetRotY - currentRotY) * 0.08;
            currentTransX += (targetTransX - currentTransX) * 0.08;
            currentTransY += (targetTransY - currentTransY) * 0.08;

            // Subtle continuous floating wave
            const floatOffset = Math.sin(Date.now() * 0.0022) * 8;

            img.style.transform = `perspective(900px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) translate3d(${currentTransX.toFixed(2)}px, ${(currentTransY + floatOffset).toFixed(2)}px, 0)`;

            requestAnimationFrame(animateMemoji);
        };

        animateMemoji();
    };

    // 3. Terminal Typewriter Effect
    const initTypewriter = () => {
        const typeEl = document.getElementById('typewriter');
        if (!typeEl) return;
        
        const sequences = [
            { cmd: 'whoami', output: 'Piyush Vishwakarma' },
            { cmd: 'cat headline.txt', output: 'Cybersecurity | Python, Linux & Network Security | AWS Certified' },
            { cmd: 'nmap -sV target.local', output: 'Ports: 22/SSH, 80/HTTP, 443/HTTPS | Status: Secured' },
            { cmd: 'cat arsenal.txt', output: 'Wireshark • Nmap • Metasploit • Burp Suite • Python • AWS' }
        ];
        
        let seqIndex = 0;
        let charIndex = 0;
        let isTyping = true;
        let isDeleting = false;
        let showOutput = false;
        
        const typeSpeed = 70;
        const deleteSpeed = 35;
        const pauseAfterCmd = 500;
        const pauseAfterOutput = 2200;
        
        const type = () => {
            const currentSeq = sequences[seqIndex];
            
            if (showOutput) {
                typeEl.textContent = currentSeq.output;
                setTimeout(() => {
                    showOutput = false;
                    isDeleting = true;
                    type();
                }, pauseAfterOutput);
                return;
            }
            
            if (isDeleting) {
                typeEl.textContent = '';
                isDeleting = false;
                isTyping = true;
                seqIndex = (seqIndex + 1) % sequences.length;
                setTimeout(type, typeSpeed);
                return;
            }
            
            if (isTyping) {
                typeEl.textContent = currentSeq.cmd.substring(0, charIndex + 1);
                charIndex++;
                
                if (charIndex === currentSeq.cmd.length) {
                    isTyping = false;
                    setTimeout(() => {
                        showOutput = true;
                        charIndex = 0;
                        type();
                    }, pauseAfterCmd);
                } else {
                    setTimeout(type, typeSpeed);
                }
            }
        };
        
        type();
    };

    // 4. Role Text Cycling
    const initRoleCycle = () => {
        const roleEl = document.getElementById('roleCycle');
        if (!roleEl) return;
        
        const roles = [
            'Network Security & Analysis',
            'Python Security Tool Development',
            'AWS Certified Cloud Practitioner',
            'Threat Detection & Digital Forensics',
            'MCA Cybersecurity Student'
        ];
        let roleIndex = 0;
        
        roleEl.style.transition = 'opacity 0.5s ease';
        roleEl.textContent = roles[0];
        
        setInterval(() => {
            roleEl.style.opacity = '0';
            setTimeout(() => {
                roleIndex = (roleIndex + 1) % roles.length;
                roleEl.textContent = roles[roleIndex];
                roleEl.style.opacity = '1';
            }, 500);
        }, 3200);
    };

    // 5. Custom Cursor
    const initCustomCursor = () => {
        const dot = document.querySelector('.cursor-dot');
        const ring = document.querySelector('.cursor-ring');
        
        if (!dot || !ring) return;
        if (window.matchMedia('(pointer: coarse)').matches) return;
        
        let mouseX = -100;
        let mouseY = -100;
        let ringX = -100;
        let ringY = -100;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
        });
        
        const renderRing = () => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0)`;
            requestAnimationFrame(renderRing);
        };
        renderRing();
        
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card, .cert-card, .tool-badge');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                ring.style.transform = `translate3d(${ringX - 27}px, ${ringY - 27}px, 0) scale(1.5)`;
                ring.style.borderColor = '#00ff88';
            });
            el.addEventListener('mouseleave', () => {
                ring.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0) scale(1)`;
                ring.style.borderColor = 'var(--accent-cyan)';
            });
        });
    };

    // 6. Mobile Menu Toggle
    const initMobileMenu = () => {
        const toggle = document.getElementById('mobileMenu');
        const links = document.getElementById('navLinks');
        
        if (!toggle || !links) return;
        
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            links.classList.toggle('active');
        });
        
        links.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                links.classList.remove('active');
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !links.contains(e.target)) {
                toggle.classList.remove('active');
                links.classList.remove('active');
            }
        });
    };

    // 7. Navbar Scroll Effect
    const initNavbarScroll = () => {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    };

    // 8. Active Nav Link Highlighting (Scroll Spy)
    const initNavHighlight = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        if (sections.length === 0 || navLinks.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${currentId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.3 });
        
        sections.forEach(section => observer.observe(section));
    };

    // 9. Scroll Reveal Animation
    const initScrollReveal = () => {
        const reveals = document.querySelectorAll('.reveal');
        if (reveals.length === 0) return;
        
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        reveals.forEach(el => observer.observe(el));
    };

    // 10. Skill Bars Animation
    const initSkillBars = () => {
        const skillFills = document.querySelectorAll('.skill-fill');
        if (skillFills.length === 0) return;
        
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-width');
                    if (width) {
                        entry.target.style.width = `${width}%`;
                    }
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        skillFills.forEach(fill => {
            fill.style.width = '0%';
            observer.observe(fill);
        });
    };

    // 11. Smooth Scroll for all anchor links
    const initSmoothScroll = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const offset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // Run all initializations
    initMatrixRain();
    initMemojiTracker();
    initTypewriter();
    initRoleCycle();
    initCustomCursor();
    initMobileMenu();
    initNavbarScroll();
    initNavHighlight();
    initScrollReveal();
    initSkillBars();
    initSmoothScroll();
});
