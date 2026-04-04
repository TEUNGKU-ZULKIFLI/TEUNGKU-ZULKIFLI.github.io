document.addEventListener('DOMContentLoaded', function() {
    let globalDataCenter = null;

    // ==========================================
    // 1. MULTILINGUAL SYSTEM (LANGUAGE ENGINE)
    // ==========================================
    const langToggleButtonEN = document.getElementById('lang-en');
    const langToggleButtonID = document.getElementById('lang-id');

    const getNestedString = (obj, path) => {
        const keys = path.split('.');
        return keys.reduce((currentObj, key) => currentObj && currentObj[key], obj);
    };

    const setLanguage = (lang) => {
        const elements = document.querySelectorAll('[data-lang]');
        elements.forEach(el => {
            const key = el.getAttribute('data-lang');
            const text = getNestedString(languages[lang], key);
            
            if (text) {
                if (el.tagName === 'TITLE') el.textContent = text;
                else el.innerHTML = text;
            }
        });
        
        document.documentElement.lang = lang;
        localStorage.setItem('preferredLanguage', lang);
        
        if (lang === 'id') {
            langToggleButtonID.classList.add('active');
            langToggleButtonEN.classList.remove('active');
        } else {
            langToggleButtonEN.classList.add('active');
            langToggleButtonID.classList.remove('active');
        }

        updateDynamicUI(lang);
    };

    const initializeLanguage = () => {
        const savedLang = localStorage.getItem('preferredLanguage');
        const browserLang = navigator.language.split('-')[0];
        const initialLang = savedLang || (languages[browserLang] ? browserLang : 'id');
        setLanguage(initialLang);
    };

    if (langToggleButtonEN && langToggleButtonID) {
        langToggleButtonEN.addEventListener('click', () => setLanguage('en'));
        langToggleButtonID.addEventListener('click', () => setLanguage('id'));
    }

    // ==========================================
    // 2. BLOG & ARTICLE RENDERER
    // ==========================================
    function loadBlogPosts() {
        const container = document.getElementById('articles-container');
        const filterContainer = document.getElementById('filter-container');
        if (!container || !filterContainer) return;

        fetch('manifest.json')
            .then(response => response.ok ? response.json() : Promise.reject('Gagal memuat manifest'))
            .then(allPosts => {
                const posts = allPosts.filter(p => p.category !== 'Project');
                if (!posts || posts.length === 0) {
                    container.innerHTML = '<p>Belum ada artikel blog.</p>';
                    return;
                }

                const renderPosts = (postList) => {
                    container.innerHTML = '';
                    if (postList.length === 0) {
                        container.innerHTML = '<p>Tidak ada artikel.</p>';
                        return;
                    }
                    postList.forEach(post => {
                        const postElement = document.createElement('div');
                        postElement.className = 'project-card';
                        const tagsHTML = post.tags ? `<p class="tags">Tags: ${post.tags.join(', ')}</p>` : '';
                        postElement.innerHTML = `
                            <div class="project-content">
                                <h3>${post.title}</h3>
                                <p>Kategori: ${post.category} | Tanggal: ${post.date}</p>
                                ${tagsHTML}
                                <div class="project-links">
                                    <a href="article.html?post=${post.file}" class="cta-button">Baca Selengkapnya</a>
                                </div>
                            </div>
                        `;
                        container.appendChild(postElement);
                    });
                };

                const allCategories = ['Semua', ...new Set(posts.map(p => p.category))];
                const allTags = [...new Set(posts.flatMap(p => p.tags || []))];

                filterContainer.innerHTML = ''; 

                const categoryGroup = document.createElement('div');
                categoryGroup.className = 'filter-group';
                categoryGroup.innerHTML = '<strong>Kategori:</strong>';
                allCategories.forEach(category => {
                    const btn = document.createElement('button');
                    btn.className = 'filter-btn';
                    if (category === 'Semua') btn.classList.add('active');
                    btn.textContent = category;
                    btn.dataset.filterType = 'category';
                    categoryGroup.appendChild(btn);
                });
                filterContainer.appendChild(categoryGroup);
                
                if (allTags.length > 0) {
                    const tagGroup = document.createElement('div');
                    tagGroup.className = 'filter-group';
                    tagGroup.innerHTML = '<strong>Tags:</strong>';
                    allTags.forEach(tag => {
                        const btn = document.createElement('button');
                        btn.className = 'filter-btn';
                        btn.textContent = tag;
                        btn.dataset.filterType = 'tag';
                        tagGroup.appendChild(btn);
                    });
                    filterContainer.appendChild(tagGroup);
                }
                
                const filterButtons = filterContainer.querySelectorAll('.filter-btn');
                filterButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        filterButtons.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        
                        const filterValue = btn.textContent;
                        const filterType = btn.dataset.filterType;

                        if (filterValue === 'Semua') renderPosts(posts);
                        else if (filterType === 'category') renderPosts(posts.filter(p => p.category === filterValue));
                        else if (filterType === 'tag') renderPosts(posts.filter(p => p.tags && p.tags.includes(filterValue)));
                    });
                });

                renderPosts(posts);
            })
            .catch(error => {
                console.error("Gagal memuat manifest:", error);
                container.innerHTML = '<p>Gagal memuat daftar artikel.</p>';
            });
    }

    function loadSingleArticle() {
        const params = new URLSearchParams(window.location.search);
        const postFile = params.get('post');
        const contentContainer = document.getElementById('article-content');
        if (postFile && contentContainer) {
            fetch(postFile)
                .then(response => response.ok ? response.text() : Promise.reject('File not found'))
                .then(markdown => {
                    const content = markdown.split('---').slice(2).join('---').trim();
                    contentContainer.innerHTML = marked.parse(content);
                    const firstHeading = contentContainer.querySelector('h1');
                    if (firstHeading) document.title = firstHeading.textContent;
                })
                .catch(err => {
                    console.error("Gagal memuat artikel:", err);
                    contentContainer.innerHTML = "<p>Gagal memuat artikel atau file tidak ditemukan.</p>";
                });
        }
    }

    // ==========================================
    // 3. MOBILE NAVIGATION (HAMBURGER)
    // ==========================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');
    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => navLinks.classList.toggle('nav-active'));
    }

    // ==========================================
    // 4. DYNAMIC UI ENGINE (JSON TO HTML GENERATOR)
    // ==========================================
    function updateDynamicUI(lang) {
        if (!globalDataCenter) return; 

        // --- A. HERO & ABOUT SECTION ---
        const heroName = document.getElementById('hero-name');
        const heroRole = document.getElementById('hero-role');
        const aboutText = document.getElementById('about-text');

        if (heroName && heroRole) {
            heroName.textContent = globalDataCenter.profile.name;
            heroRole.textContent = globalDataCenter.profile.role[lang];
        }
        if (aboutText && globalDataCenter.profile.about[lang]) {
            aboutText.textContent = globalDataCenter.profile.about[lang];
        }

        // --- B. PROJECTS GALLERY ---
        const t1Container = document.getElementById('tier1-container');
        const t2Container = document.getElementById('tier2-container');
        const t3Container = document.getElementById('tier3-container');

        if (t1Container && t2Container && t3Container) {
            t1Container.innerHTML = '';
            t2Container.innerHTML = '';
            t3Container.innerHTML = '';

            const lblStack = lang === 'id' ? 'Teknologi:' : 'Tech Stack:';
            const lblDetail = lang === 'id' ? 'Lihat Detail' : 'View Details';
            const lblCode = lang === 'id' ? 'Lihat Kode' : 'Source Code';
            const lblRepo = lang === 'id' ? 'Lihat Repositori &rarr;' : 'View Repository &rarr;';

            globalDataCenter.projects.forEach(project => {
                let techListHTML = '';
                if (project.tech_stack && project.tech_stack.length > 0) {
                    techListHTML = project.tech_stack.map(tech => `<li>${tech}</li>`).join('');
                }
                const shortDesc = project.description[lang][0];

                if (project.tier === 'tier1' || project.tier === 'tier2') {
                    const detailBtn = project.detail_url ? `<a href="${project.detail_url}" class="cta-button outline">${lblDetail}</a>` : '';
                    const githubBtn = project.github_url ? `<a href="${project.github_url}" target="_blank" class="cta-button">${lblCode}</a>` : '';

                    const cardHTML = `
                        <div class="project-card">
                            <img src="${project.image_url}" onerror="this.src='https://placehold.co/600x400/2c2c2c/f0f0f0?text=${encodeURIComponent(project.title.en)}'" alt="${project.title[lang]}" class="project-image">
                            <div class="project-content">
                                <h3>${project.title[lang]}</h3>
                                <p>${shortDesc}</p>
                                <div class="tech-stack-wrapper">
                                    <p class="tech-stack-label">${lblStack}</p>
                                    <ul class="tech-stack">${techListHTML}</ul>
                                </div>
                                <div class="project-links">
                                    ${detailBtn}
                                    ${githubBtn}
                                </div>
                            </div>
                        </div>
                    `;
                    
                    if (project.tier === 'tier1') t1Container.innerHTML += cardHTML;
                    if (project.tier === 'tier2') t2Container.innerHTML += cardHTML;

                } else if (project.tier === 'tier3') {
                    const labHTML = `
                        <div class="lab-card">
                            <h4>${project.title[lang]}</h4>
                            <p>${shortDesc}</p>
                            <a href="${project.github_url}" target="_blank" class="lab-link">${lblRepo}</a>
                        </div>
                    `;
                    t3Container.innerHTML += labHTML;
                }
            });
        }

        // --- C. SKILLS SECTION ---
        const skillsContainer = document.getElementById('skills-container');
        if (skillsContainer && globalDataCenter.skills) {
            skillsContainer.innerHTML = ''; 
            globalDataCenter.skills.forEach(skillGroup => {
                const listItemsHTML = skillGroup.items.map(item => `<li>${item}</li>`).join('');
                const skillHTML = `
                    <div class="skill-category">
                        <h4 style="margin-bottom: 0.5rem; color: var(--primary-color);">${skillGroup.category}</h4>
                        <ul class="skills-list" style="margin-left: 1.2rem;">
                            ${listItemsHTML}
                        </ul>
                    </div>
                `;
                skillsContainer.innerHTML += skillHTML;
            });
        }

        // --- D. EXPERIENCE SECTION ---
        const experienceContainer = document.getElementById('experience-container');
        if (experienceContainer && globalDataCenter.experience) {
            experienceContainer.innerHTML = ''; 
            globalDataCenter.experience.forEach(exp => {
                const descListHTML = exp.description[lang].map(point => `<li style="margin-bottom: 0.5rem;">${point}</li>`).join('');
                const expHTML = `
                    <div class="timeline-item" style="border-left: 2px solid var(--primary-color); padding-left: 1.5rem; margin-bottom: 2rem; position: relative;">
                        <div style="position: absolute; width: 12px; height: 12px; background: var(--primary-color); border-radius: 50%; left: -7px; top: 5px;"></div>
                        <h4 style="color: var(--text-color); margin-bottom: 0.2rem;">${exp.role}</h4>
                        <div style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-bottom: 1rem; font-size: 0.9rem; color: var(--secondary-text-color);">
                            <strong>${exp.company}</strong>
                            <span>${exp.period}</span>
                        </div>
                        <ul style="margin-left: 1rem; color: var(--secondary-text-color);">
                            ${descListHTML}
                        </ul>
                    </div>
                `;
                experienceContainer.innerHTML += expHTML;
            });
        }

        // --- E. CERTIFICATIONS SECTION ---
        const certContainer = document.getElementById('certifications-container');
        if (certContainer && globalDataCenter.certifications) {
            certContainer.innerHTML = ''; 
            const issuedByLabel = lang === 'id' ? 'Dikeluarkan oleh' : 'Issued by';
            globalDataCenter.certifications.forEach(cert => {
                const certHTML = `
                    <a href="https://${cert.verify}" target="_blank" class="cert-card-link">
                        <div class="cert-card">
                            <h4>${cert.title}</h4>
                            <p>${issuedByLabel} <strong>${cert.issuer}</strong></p>
                            <p style="font-size: 0.8rem; margin-top: 0.5rem; opacity: 0.8;">Exp: ${cert.expiry}</p>
                        </div>
                    </a>
                `;
                certContainer.innerHTML += certHTML;
            });
        }
    }

    // ==========================================
    // 5. INITIALIZATION & ROUTER
    // ==========================================
    async function initDataCenter() {
        try {
            const response = await fetch('assets/data/data-center.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            globalDataCenter = await response.json();
            
            const currentLang = localStorage.getItem('preferredLanguage') || navigator.language.split('-')[0] || 'id';
            updateDynamicUI(currentLang);
        } catch (error) {
            console.error("Gagal memuat Pusat Data JSON:", error);
        }
    }

    const path = window.location.pathname;
    
    initDataCenter().then(() => {
        initializeLanguage();
    });

    if (path.endsWith('/') || path.endsWith('index.html') || path.includes('/TEUNGKU-ZULKIFLI.github.io/')) {
        const scrollLinks = document.querySelectorAll('nav a[href^="#"]');
        scrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const id = this.getAttribute('href');
                const targetElement = document.querySelector(id);
                if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
            });
        });
    } else if (path.endsWith('blog.html')) {
        loadBlogPosts();
    } else if (path.endsWith('article.html')) {
        loadSingleArticle();
    }
});