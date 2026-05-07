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
            // Return YouTube iframe embed
            return `<iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;"></iframe>`;
        } else {
            // Return standard video tag
            return `<video src="${url}" autoplay loop muted playsinline></video>`;
        }
    }

    // Render Skills
    const skillsContainer = document.getElementById('skills-container');
    if (data.skills) {
        data.skills.forEach(skill => {
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
                iconHtml = `<img src="${skill.iconUrl}" alt="${skill.name}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: contain;">`;
            } else if (skill.icon) {
                iconHtml = `<i class="${skill.icon}"></i>`;
            }

            skillEl.innerHTML = `${iconHtml} ${skill.name}`;
            skillsContainer.appendChild(skillEl);
        });
    }

    // Render Games
    const gamesContainer = document.getElementById('games-container');
    if (data.games) {
        data.games.forEach(game => {
            const gameEl = document.createElement('div');
            gameEl.className = 'card game-card';
            gameEl.innerHTML = `
                <div class="video-container">
                    ${generateVideoHTML(game.videoUrl)}
                </div>
                <h3>${game.title}</h3>
                <p>${game.description}</p>
                <a href="${game.gameLink}" target="_blank" class="btn btn-primary">Play on Roblox</a>
            `;
            gamesContainer.appendChild(gameEl);
        });
    }

    // Render Systems
    const systemsContainer = document.getElementById('systems-container');
    if (data.systems) {
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
        });
    }

    // Render Commissions
    const commissionsContainer = document.getElementById('commissions-container');
    if (data.commissions) {
        data.commissions.forEach(comm => {
            const commEl = document.createElement('div');
            commEl.className = 'card media-card';
            commEl.innerHTML = `
                <div class="video-container">
                    ${generateVideoHTML(comm.videoUrl)}
                </div>
                <h3>${comm.title}</h3>
            `;
            commissionsContainer.appendChild(commEl);
        });
    }

    // Set Copyright Year
    document.getElementById('year').textContent = new Date().getFullYear();

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
});
