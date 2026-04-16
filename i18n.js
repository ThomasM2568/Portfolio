document.addEventListener('DOMContentLoaded', () => {
    let currentLang = localStorage.getItem('preferredLang') || 'fr';
    let currentTheme = localStorage.getItem('preferredTheme') || 'nebula';
    let siteData = null;
    let typingTimer = null;

    const langToggle = document.getElementById('lang-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    
    // CLI Typing Animation
    const typeName = (text) => {
        const element = document.getElementById('name-animation');
        if (!element) return;
        
        element.textContent = '';
        let i = 0;
        if (typingTimer) clearInterval(typingTimer);
        
        typingTimer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingTimer);
            }
        }, 100);
    };

    // Function to update the UI based on language and theme
    const updateUI = (lang) => {
        if (!siteData) return;
        const data = siteData[lang];
        
        // Update simple text elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (data[key]) {
                el.textContent = data[key];
            }
        });

        // Trigger CLI animation for name
        if (data.name) {
            typeName(data.name);
        }

        // Update dynamic lists if they exist on the page
        renderExperiences(data.experiences);
        renderEducation(data.education);
        renderCertifications(data.certifications);
        renderProjects(data.projects, data.see_details);
        renderContact(data);
        
        // Update button texts
        langToggle.textContent = lang === 'fr' ? 'EN' : 'FR';
        updateThemeButtonText(lang);
        document.documentElement.lang = lang;
    };

    const updateThemeButtonText = (lang) => {
        if (!siteData) return;
        const data = siteData[lang];
        themeToggle.textContent = currentTheme === 'nebula' ? data.theme_aurora : data.theme_nebula;
    };

    const applyTheme = (theme) => {
        document.body.className = `theme-${theme}`;
        if (siteData) updateThemeButtonText(currentLang);
    };

    const toggleDetails = (id) => {
        const panel = document.getElementById(`details-${id}`);
        const chevron = document.getElementById(`chevron-${id}`);
        if (panel) {
            panel.classList.toggle('active');
            if (chevron) chevron.classList.toggle('active-chevron');
        }
    };

    const renderExperiences = (exps) => {
        const container = document.getElementById('exp-container');
        if (!container) return;
        container.innerHTML = `<div class="timeline">` + exps.map(exp => `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="collapsible-item d-flex align-items-center" onclick="window.toggleDetails('${exp.id}')">
                    <img src="${exp.logo}" alt="${exp.company}" class="company-logo" />
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-start flex-wrap">
                            <h5 class="mb-1"><strong>${exp.role}</strong></h5>
                            <span class="badge bg-primary rounded-pill" style="background-color: var(--accent-color) !important;">${exp.date}</span>
                        </div>
                        <div class="text-muted mb-1"><em>${exp.company}</em></div>
                        <div class="small">${exp.desc}</div>
                    </div>
                    <span class="chevron ms-3" id="chevron-${exp.id}">▼</span>
                </div>
                <div class="details-panel" id="details-${exp.id}">
                    <div class="p-2 border-start border-3" style="border-color: var(--accent-color) !important;">
                        ${exp.details}
                    </div>
                </div>
            </div>
        `).join('') + `</div>`;
    };

    const renderEducation = (edu) => {
        const container = document.getElementById('edu-container');
        if (!container) return;
        container.innerHTML = edu.map(item => `
            <div class="edu-card collapsible-item" onclick="window.toggleDetails('${item.id}')">
                <div class="edu-icon">
                    <i class="bi bi-mortarboard"></i>
                </div>
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start flex-wrap">
                        <h5 class="mb-1"><strong>${item.title}</strong></h5>
                        <span class="text-muted small">${item.date}</span>
                    </div>
                    <div class="details-panel mt-2" id="details-${item.id}">
                        ${item.details}
                    </div>
                </div>
                <span class="chevron ms-2" id="chevron-${item.id}">▼</span>
            </div>
        `).join('');
    };

    const renderCertifications = (certs) => {
        const container = document.getElementById('cert-container');
        if (!container) return;
        container.innerHTML = certs.map(cert => `
            <li>
                <a href="${cert.url}" target="_blank" rel="noopener" class="cert-card">
                    <i class="bi bi-patch-check-fill"></i>
                    <div class="cert-info">${cert.name}</div>
                </a>
            </li>
        `).join('');
    };

    const renderProjects = (projs, seeDetailsText) => {
        const container = document.getElementById('proj-container');
        if (!container) return;
        container.innerHTML = projs.map(proj => `
            <a href="${proj.link}" class="project-card" aria-label="${proj.title}">
                <img src="${proj.icon}" alt="Icon" class="project-icon" />
                <div>
                    <strong>${proj.title}</strong><br />
                    <em>${proj.date}</em><br />
                    <span>${proj.desc}</span><br />
                    <span class="see-details-link">${seeDetailsText}</span>
                </div>
            </a>
        `).join('');
    };

    const renderContact = (data) => {
        const container = document.getElementById('contact-container');
        if (!container) return;
        container.innerHTML = `
            <div class="contact-grid">
                <a href="mailto:thomas.mirbey@edu.univ-fcomte.fr" class="contact-card">
                    <i class="bi bi-envelope-at"></i>
                    <label>Email</label>
                    <span>thomas.mirbey@edu.univ-fcomte.fr</span>
                </a>
                <a href="https://www.linkedin.com/in/thomas-mirbey" target="_blank" rel="noopener" class="contact-card">
                    <i class="bi bi-linkedin"></i>
                    <label>LinkedIn</label>
                    <span>thomas-mirbey</span>
                </a>
                <a href="https://github.com/ThomasMirbey" target="_blank" rel="noopener" class="contact-card">
                    <i class="bi bi-github"></i>
                    <label>GitHub</label>
                    <span>ThomasMirbey</span>
                </a>
            </div>
        `;
    };

    // Expose toggleDetails to global scope for onclick
    window.toggleDetails = toggleDetails;

    // Initialize theme immediately to avoid flash
    applyTheme(currentTheme);

    // Load data and initialize
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            siteData = data;
            updateUI(currentLang);
        })
        .catch(err => console.error('Error loading translations:', err));

    // Toggle language
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'fr' ? 'en' : 'fr';
        localStorage.setItem('preferredLang', currentLang);
        updateUI(currentLang);
    });

    // Toggle theme
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'nebula' ? 'aurora' : 'nebula';
        localStorage.setItem('preferredTheme', currentTheme);
        applyTheme(currentTheme);
    });
});
