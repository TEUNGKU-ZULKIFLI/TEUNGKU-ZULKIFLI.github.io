document.addEventListener('DOMContentLoaded', function() {

    // --- BAGIAN 1: DEFINISI FUNGSI ---
    // Semua fungsi yang bisa digunakan kembali kita definisikan di sini.
    
    // Fungsi untuk memuat daftar artikel di blog.html
    function loadBlogPosts() {
        const posts = [
            {
                title: "Ini Adalah Judul Artikel Pertama Saya",
                file: "_posts/tutorials/2025-09-20-tes-artikel-pertama.md",
                category: "Tutorial",
                date: "20 September 2025"
            }
        ];
        
        const container = document.getElementById('articles-container');
        if (!container) return; 

        container.innerHTML = ''; 

        if (posts.length === 0) {
            container.innerHTML = '<p>Belum ada artikel yang dipublikasikan.</p>';
            return;
        }

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'project-card';
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>Kategori: ${post.category} | Tanggal: ${post.date}</p>
                <a href="article.html?post=${post.file}" class="cta-button">Baca Selengkapnya</a>
            `;
            container.appendChild(postElement);
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
                    contentContainer.innerHTML = marked.parse(markdown);
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


    // --- BAGIAN 2: LOGIKA UMUM (BERLAKU DI SEMUA HALAMAN) ---
    // Contohnya adalah navigasi mobile.
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', function() {
            navLinks.classList.toggle('nav-active');
        });
    }


    // --- BAGIAN 3: EKSEKUSI / "ROUTER" (LOGIKA KHUSUS PER HALAMAN) ---
    // Menjalankan fungsi yang tepat berdasarkan halaman yang sedang dibuka.
    const path = window.location.pathname;

    if (path.endsWith('/') || path.endsWith('index.html') || path === '/TEUNGKU-ZULKIFLI.github.io/') {
        // Logika KHUSUS untuk halaman utama
        console.log("Halaman utama: Mengaktifkan smooth scroll.");
        
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
        // Logika KHUSUS untuk halaman blog
        loadBlogPosts();
    } else if (path.endsWith('article.html')) {
        // Logika KHUSUS untuk halaman artikel
        loadSingleArticle();
    }

});