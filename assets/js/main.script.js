/* === FASE 4 (REFAKTOR): FUNGSIONALITAS OTOMATIS === */

document.addEventListener('DOMContentLoaded', function() {

    // --- BAGIAN 1: DEFINISI FUNGSI ---
    
    // Fungsi untuk memuat daftar artikel dari manifest.json
    function loadBlogPosts() {
        const container = document.getElementById('articles-container');
        if (!container) return;

        // AMBIL DATA DARI MANIFEST.JSON
        fetch('manifest.json')
            .then(response => response.ok ? response.json() : Promise.reject('Gagal memuat manifest'))
            .then(posts => {
                container.innerHTML = '';

                if (!posts || posts.length === 0) {
                    container.innerHTML = '<p>Belum ada artikel yang dipublikasikan.</p>';
                    return;
                }

                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.className = 'project-card';
                    
                    // Tampilkan tags jika ada
                    const tagsHTML = post.tags ? `<p class="tags">Tags: ${post.tags.join(', ')}</p>` : '';

                    postElement.innerHTML = `
                        <h3>${post.title}</h3>
                        <p>Kategori: ${post.category} | Tanggal: ${post.date}</p>
                        ${tagsHTML}
                        <a href="article.html?post=${post.file}" class="cta-button">Baca Selengkapnya</a>
                    `;
                    container.appendChild(postElement);
                });
            })
            .catch(error => {
                console.error("Gagal memuat manifest artikel:", error);
                container.innerHTML = '<p>Gagal memuat daftar artikel.</p>';
            });
    }

    // Fungsi untuk memuat konten satu artikel di article.html
    function loadSingleArticle() {
        const params = new URLSearchParams(window.location.search);
        const postFile = params.get('post');
        const contentContainer = document.getElementById('article-content');

        if (postFile && contentContainer) {
            fetch(postFile)
                .then(response => response.ok ? response.text() : Promise.reject('File not found'))
                .then(markdown => {
                    // Ambil hanya konten di bawah front matter
                    const content = markdown.split('---').slice(2).join('---').trim();
                    contentContainer.innerHTML = marked.parse(content);
                    
                    const firstHeading = contentContainer.querySelector('h1');
                    if (firstHeading) {
                        document.title = firstHeading.textContent;
                    }
                })
                .catch(err => {
                    console.error("Gagal memuat artikel:", err);
                    contentContainer.innerHTML = "<p>Gagal memuat artikel atau file tidak ditemukan.</p>";
                });
        }
    }

    // --- BAGIAN 2: LOGIKA UMUM (NAVIGASI MOBILE) ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', function() {
            navLinks.classList.toggle('nav-active');
        });
    }

    // --- BAGIAN 3: EKSEKUSI / "ROUTER" ---
    const path = window.location.pathname;

    if (path.endsWith('/') || path.endsWith('index.html') || path.includes('/TEUNGKU-ZULKIFLI.github.io/')) {
        // Logika untuk halaman utama (smooth scroll)
        const scrollLinks = document.querySelectorAll('nav a[href^="#"]');
        scrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const id = this.getAttribute('href');
                const targetElement = document.querySelector(id);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

    } else if (path.endsWith('blog.html')) {
        loadBlogPosts();
    } else if (path.endsWith('article.html')) {
        loadSingleArticle();
    }

});

