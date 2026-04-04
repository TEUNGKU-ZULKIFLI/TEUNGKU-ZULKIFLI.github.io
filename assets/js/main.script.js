document.addEventListener('DOMContentLoaded', function() {
    let globalDataCenter = null;

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

    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');
    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => navLinks.classList.toggle('nav-active'));
    }

    function updateDynamicUI(lang) {
        if (!globalDataCenter) return; 

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
    }

    async function initDataCenter() {
        try {
            const response = await fetch('assets/data/data-center.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            globalDataCenter = await response.json();
            
            const currentLang = localStorage.getItem('preferredLanguage') || navigator.language.split('-')[0] || 'id';
            updateDynamicUI(currentLang);
        } catch (error) {
            console.error("Gagal memuat Pusat Data:", error);
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