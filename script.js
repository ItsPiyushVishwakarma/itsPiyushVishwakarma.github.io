document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Binary / Matrix Rain Background
    const initMatrixRain = () => {
        const canvas = document.getElementById('matrix-bg');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Mostly binary, with a sprinkle of hex and katakana for texture
        const chars = '0101010101010101ABCDEF0x{}#$アカサタナ'.split('');
        const fontSize = 15;
        let width, height, columns, drops, colors, speeds;

        const setup = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            columns = Math.floor(width / fontSize);
            // Random start heights so the screen is already "raining" on load
            drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -height / fontSize));
            // ~1 in 4 columns cyan, rest green
            colors = Array.from({ length: columns }, () => (Math.random() < 0.25 ? '#00e5ff' : '#00ff88'));
            // Slightly different speeds per column
            speeds = Array.from({ length: columns }, () => 0.6 + Math.random() * 0.6);
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, width, height);
        };

        const draw = () => {
            // Fade previous frame to leave a trail
            ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
            ctx.fillRect(0, 0, width, height);
            ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

            for (let i = 0; i < columns; i++) {
                const y = Math.floor(drops[i]) * fontSize;
                if (y > 0) {
                    const text = chars[Math.floor(Math.random() * chars.length)];
                    // Trail character just above the head in the column color
                    ctx.fillStyle = colors[i];
                    ctx.fillText(text, i * fontSize, y - fontSize);
                    // Bright leading character
                    ctx.fillStyle = '#d9fff0';
                    ctx.fillText(chars[Math.floor(Math.random() * 2)], i * fontSize, y);
                }

                if (y > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i] += speeds[i];
            }
        };

        setup();
        let last = 0;
        const loop = (t) => {
            if (t - last > 50) {
                draw();
                last = t;
            }
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(setup, 150);
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
            { cmd: 'cat role.txt', output: 'Cybersecurity Analyst | SOC | DFIR | VAPT' },
            { cmd: 'ufed --extract iphone.img', output: 'Extraction complete | hash verified | chain of custody logged' },
            { cmd: 'grep -c "Failed password" auth.log', output: '1,284 hits -> brute-force from 3 IPs flagged' },
            { cmd: 'cat arsenal.txt', output: 'Cellebrite • Autopsy • FTK • Wireshark • Burp Suite • AWS' }
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
            'Digital Forensics',
            'SOC & Incident Response',
            'Vulnerability Assessment (VAPT)',
            'Threat Detection & Log Analysis',
            'Python Security Tooling',
            'AWS Cloud Security'
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
        
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card, .cert-card, .tool-badge, .lab-card');
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

    // 10. Project Filters
    const initProjectFilters = () => {
        const buttons = document.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll('.projects-grid .project-card');
        if (buttons.length === 0 || cards.length === 0) return;

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                buttons.forEach(b => b.classList.toggle('active', b === btn));
                cards.forEach(card => {
                    const cats = (card.dataset.category || '').split(' ');
                    const show = filter === 'all' || cats.includes(filter);
                    card.classList.toggle('is-hidden', !show);
                    if (show) card.classList.add('revealed');
                });
            });
        });
    };

    // 10b. Stat Count-Up
    const initCountUp = () => {
        const counters = document.querySelectorAll('.count-up');
        if (counters.length === 0) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10) || 0;
                const duration = 1200;
                const start = performance.now();
                const tick = (now) => {
                    const p = Math.min((now - start) / duration, 1);
                    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
                    if (p < 1) requestAnimationFrame(tick);
                };
                el.textContent = '0';
                requestAnimationFrame(tick);
                obs.unobserve(el);
            });
        }, { threshold: 0.6 });

        counters.forEach(c => observer.observe(c));
    };

    // 10c. Scroll Progress + Back to Top
    const initScrollUtils = () => {
        const bar = document.getElementById('scrollProgress');
        const topBtn = document.getElementById('backToTop');

        const update = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
            if (bar) bar.style.width = `${pct}%`;
            if (topBtn) topBtn.classList.toggle('visible', window.scrollY > 600);
        };

        window.addEventListener('scroll', update, { passive: true });
        update();
    };

    // 10d. Copy Email
    const initCopyEmail = () => {
        const btn = document.getElementById('copyEmail');
        if (!btn || !navigator.clipboard) {
            if (btn) btn.style.display = 'none';
            return;
        }
        const label = btn.querySelector('span');

        btn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(btn.dataset.copy);
                btn.classList.add('copied');
                if (label) label.textContent = 'Copied!';
            } catch (err) {
                if (label) label.textContent = 'Press Ctrl+C';
            }
            setTimeout(() => {
                btn.classList.remove('copied');
                if (label) label.textContent = 'Copy';
            }, 1800);
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
    initProjectFilters();
    initCountUp();
    initScrollUtils();
    initCopyEmail();
    initSmoothScroll();
});
