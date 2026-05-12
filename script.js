/**
 * -------------------------------------------------------------
 * RENDERING LOGIC
 * Automatically generates HTML based on the data.json file.
 * -------------------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Fetch data from data.json
    let data;
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        data = await response.json();
    } catch (error) {
        console.error("Could not load data.json:", error);
        return; // Exit if data fails to load
    }

    // Helper: inject a loading spinner into a container and return it
    function addSpinner(container) {
        const spinner = document.createElement('div');
        spinner.className = 'video-spinner';
        spinner.innerHTML = '<div class="video-spinner-ring"></div>';
        container.appendChild(spinner);
        return spinner;
    }

    // 1. Dynamic Years of Experience
    const startDate = new Date('2023-07-08');
    const currentDate = new Date();
    let yearsOfExperience = currentDate.getFullYear() - startDate.getFullYear();
    const m = currentDate.getMonth() - startDate.getMonth();
    if (m < 0 || (m === 0 && currentDate.getDate() < startDate.getDate())) {
        yearsOfExperience--;
    }

    // 2. Experience Subtitle
    const subtitleEl = document.getElementById('experience-subtitle');
    if (subtitleEl) {
        subtitleEl.textContent = `${yearsOfExperience} years building immersive games, advanced systems, and bringing ideas to life.`;
    }

    // 3. Availability Status
    const availabilityEl = document.getElementById('availability-status');
    if (availabilityEl && data.hasOwnProperty('availableToWork')) {
        availabilityEl.style.display = 'inline-flex';
        if (data.availableToWork) {
            availabilityEl.className = 'status-badge available';
            availabilityEl.innerHTML = `<span class="status-indicator online"></span> Open for Commissions`;
        } else {
            availabilityEl.className = 'status-badge unavailable';
            availabilityEl.innerHTML = `<span class="status-indicator offline"></span> Commissions Closed`;
        }
    }

    // Helper function to generate video HTML (handles YouTube vs MP4)
    function generateVideoHTML(url) {
        if (!url) return '';

        // Check if it's a YouTube link
        let youtubeId = null;
        if (url.includes('youtu.be/')) {
            youtubeId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('youtube.com/watch')) {
            const urlParams = new URLSearchParams(new URL(url).search);
            youtubeId = urlParams.get('v');
        } else if (url.includes('youtube.com/embed/')) {
            youtubeId = url.split('youtube.com/embed/')[1].split('?')[0];
        }

        if (youtubeId) {
            return `<iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&rel=0&modestbranding=1&controls=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;"></iframe>`;
        } else {
            return `<video src="${url}" autoplay loop muted playsinline disablePictureInPicture controlsList="nopictureinpicture"></video>`;
        }
    }

    // Render Skills
    const skillsContainer = document.getElementById('skills-container');
    if (data.skills && skillsContainer) {
        skillsContainer.innerHTML = '';
        skillsContainer.className = 'skills-layout';

        for (const [category, skills] of Object.entries(data.skills)) {
            const categoryEl = document.createElement('div');
            categoryEl.className = 'skill-category fade-in visible';

            const categoryTitle = document.createElement('h3');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = category;
            categoryEl.appendChild(categoryTitle);

            const cardsGrid = document.createElement('div');
            cardsGrid.className = 'skill-card-grid';

            skills.forEach(skill => {
                const skillEl = document.createElement(skill.link ? 'a' : 'div');
                skillEl.className = 'skill-tag';
                if (skill.link) {
                    skillEl.href = skill.link;
                    skillEl.target = '_blank';
                    skillEl.style.textDecoration = 'none';
                    skillEl.style.color = 'inherit';
                }

                let iconHtml = '';
                if (skill.iconUrl) {
                    iconHtml = `<img src="${skill.iconUrl}" alt="${skill.name}" style="width: 24px; height: 24px; border-radius: 2px; object-fit: contain;">`;
                } else if (skill.icon) {
                    iconHtml = `<i class="${skill.icon}"></i>`;
                }

                if (skill.description) {
                    skillEl.classList.add('has-desc');
                    skillEl.innerHTML = `
                        <div class="skill-header">
                            ${iconHtml} <span>${skill.name}</span>
                        </div>
                        <div class="skill-desc">${skill.description}</div>
                    `;
                } else {
                    skillEl.innerHTML = `${iconHtml} ${skill.name}`;
                }
                cardsGrid.appendChild(skillEl);
            });

            categoryEl.appendChild(cardsGrid);
            skillsContainer.appendChild(categoryEl);
        }
    }

    // Render Games
    const gamesContainer = document.getElementById('games-container');
    if (data.games && gamesContainer) {
        data.games.forEach(game => {
            const gameEl = document.createElement('div');
            gameEl.className = 'card game-card';
            gameEl.innerHTML = `
                <div class="video-container">
                    ${generateVideoHTML(game.videoUrl)}
                </div>
                <h3>${game.title}</h3>
                <p>${game.description}</p>
                ${game.gameLink ? `<a href="${game.gameLink}" target="_blank" class="btn btn-primary">Play on Roblox</a>` : ''}
            `;
            gamesContainer.appendChild(gameEl);
            const vc = gameEl.querySelector('.video-container');
            const spinner = addSpinner(vc);
            const vid = vc.querySelector('video');
            if (vid) {
                vid.addEventListener('canplay', () => spinner.classList.add('hidden'), { once: true });
            } else {
                spinner.classList.add('hidden'); // iframes load instantly
            }
        });
    }

    // Render Systems
    const systemsContainer = document.getElementById('systems-container');
    if (data.systems && systemsContainer) {
        data.systems.forEach(system => {
            const sysEl = document.createElement('div');
            sysEl.className = 'card media-card';
            sysEl.innerHTML = `
                <div class="video-container">
                    ${generateVideoHTML(system.videoUrl)}
                </div>
                <h3>${system.title}</h3>
            `;
            systemsContainer.appendChild(sysEl);
            const vc = sysEl.querySelector('.video-container');
            const spinner = addSpinner(vc);
            const vid = vc.querySelector('video');
            if (vid) {
                vid.addEventListener('canplay', () => spinner.classList.add('hidden'), { once: true });
            } else {
                spinner.classList.add('hidden');
            }
        });
    }

    // Set Copyright Year
    document.getElementById('year').textContent = new Date().getFullYear();

    // UTC-3 Time Update
    const timeEl = document.getElementById('current-time-utc');
    if (timeEl) {
        function updateTime() {
            const now = new Date();
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            const utcMinus3 = new Date(utc - (3600000 * 3));
            const timeString = utcMinus3.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            timeEl.innerHTML = `<i class="fas fa-clock"></i> Time (UTC-3): ${timeString}`;
        }
        updateTime();
        setInterval(updateTime, 60000);
    }

    /**
     * -------------------------------------------------------------
     * SCROLL ANIMATIONS (Intersection Observer)
     * -------------------------------------------------------------
     */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    /**
     * -------------------------------------------------------------
     * MOBILE MENU & UX
     * -------------------------------------------------------------
     */
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li a');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
            });
        });
    }

    // Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
