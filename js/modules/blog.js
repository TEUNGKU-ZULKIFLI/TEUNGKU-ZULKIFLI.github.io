/* ========================================================================
   MODUL CONTROLLER: BLOG (js/modules/blog.js)
   Mengurus rendering dinamis daftar isi artikel dan konversi Markdown (.md).
======================================================================== */

let dataBlogIndeks = null;

// Mengambil berkas indeks blog yang dihasilkan Python Indexer
async function ambilIndeksBlog() {
    if (dataBlogIndeks) return dataBlogIndeks;
    try {
        const respon = await fetch('./_posts/posts-index.json');
        if (!respon.ok) throw new Error("Gagal mengambil posts-index.json");
        dataBlogIndeks = await respon.json();
        return dataBlogIndeks;
    } catch (e) {
        console.error("[Blog Controller Error] Gagal memuat indeks:", e);
        return null;
    }
}

// Menghilangkan Front Matter (YAML Metadata) bawaan dari teks markdown murni
function bersihkanKontenMarkdown(teksMentah) {
    const matches = teksMentah.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+/);
    if (matches) {
        return teksMentah.replace(matches[0], '');
    }
    return teksMentah;
}

export async function inisialisasiKomponenBlog() {
    const wadahNavigasi = document.getElementById('blog-navigation');
    const indeks = await ambilIndeksBlog();

    // Pengaman DOM: Segera hentikan fungsi jika kita tidak berada di halaman blog aktif
    if (!wadahNavigasi || !indeks) return;

    wadahNavigasi.innerHTML = ''; // Hapus loading-state

    // Bangun kelompok kategori dan tautan artikel secara dinamis di Sidebar
    Object.keys(indeks).forEach(kategori => {
        if (indeks[kategori].length === 0) return;

        const grupKategori = document.createElement('div');
        grupKategori.style.marginBottom = '1.25rem';

        const labelKategori = document.createElement('h4');
        labelKategori.className = 'blog-category-label';
        labelKategori.textContent = kategori.replace('-', ' ');
        grupKategori.appendChild(labelKategori);

        const daftarLink = document.createElement('ul');
        daftarLink.className = 'blog-links-list';

        indeks[kategori].forEach(artikel => {
            const itemLi = document.createElement('li');
            const linkArtikel = document.createElement('a');
            linkArtikel.href = `#blog?buka=${kategori}/${artikel.filename}`;
            linkArtikel.className = 'blog-sidebar-link';
            linkArtikel.textContent = artikel.title;

            // Pemicu Klik untuk membuka artikel
            linkArtikel.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.hash = `#blog?buka=${kategori}/${artikel.filename}`;
                tampilkanArtikel(artikel);
            });

            itemLi.appendChild(linkArtikel);
            daftarLink.appendChild(itemLi);
        });

        grupKategori.appendChild(daftarLink);
        wadahNavigasi.appendChild(grupKategori);
    });

    // Menghubungkan Tombol "Kembali" di Mobile
    const btnBack = document.getElementById('blog-btn-back');
    if (btnBack) {
        btnBack.onclick = () => {
            window.location.hash = '#blog'; // Reset Hash
            const kontainerBlog = document.querySelector('.blog-container');
            if (kontainerBlog) {
                kontainerBlog.classList.remove('active-reading');
            }
        };
    }

    // Cek otomatis rute hash saat ini (Deeplinking support)
    const hashSaatIni = window.location.hash;
    if (hashSaatIni.includes('?buka=')) {
        const pathTarget = hashSaatIni.split('?buka=')[1];
        if (pathTarget) {
            const [kat, file] = pathTarget.split('/');
            if (indeks[kat]) {
                const artikelDitemukan = indeks[kat].find(a => a.filename === file);
                if (artikelDitemukan) {
                    tampilkanArtikel(artikelDitemukan);
                    return;
                }
            }
        }
    }
}

// Menarik dokumen fisik .md dari folder _posts/ secara asinkron dan merendernya
async function tampilkanArtikel(metaArtikel) {
    const wadahMembaca = document.getElementById('blog-content');
    const kontainerBlog = document.querySelector('.blog-container');
    
    if (!wadahMembaca) return;

    // Aktifkan transisi split-screen pembaca di Mobile
    if (kontainerBlog) {
        kontainerBlog.classList.add('active-reading');
    }

    wadahMembaca.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:4rem;">📚 Membuka dokumen...</p>`;

    // Sorot tautan sidebar yang aktif saat ini
    document.querySelectorAll('.blog-sidebar-link').forEach(link => {
        if (link.getAttribute('href').endsWith(metaArtikel.filename)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    try {
        const respon = await fetch(metaArtikel.filepath);
        if (!respon.ok) throw new Error("Gagal mengambil berkas markdown");
        
        const teksMentah = await respon.text();
        const teksMarkdownMurni = bersihkanKontenMarkdown(teksMentah);
        
        // Render menggunakan Marked.js local library
        const kontenHtmlHasilCompile = marked.parse(teksMarkdownMurni);

        // Buat baris tag / lencana lencana kategori
        const lencanaTagHTML = metaArtikel.tags.map(t => 
            `<span class="blog-post-tag">${t}</span>`
        ).join('');
        
        wadahMembaca.innerHTML = `
            <div id="post-header" class="blog-post-header">
                <h1 class="blog-post-title">${metaArtikel.title}</h1>
                <div class="blog-post-meta">
                    <span>📅 Terbit: <strong>${metaArtikel.date}</strong></span>
                    <div class="blog-post-tags">${lencanaTagHTML}</div>
                </div>
            </div>
            <div class="markdown-body">
                ${kontenHtmlHasilCompile}
            </div>
        `;

        // Atasi warning forced-reflow browser menggunakan requestAnimationFrame
        requestAnimationFrame(() => {
            const headerPost = document.getElementById('post-header');
            if (headerPost) {
                headerPost.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

    } catch (er) {
        console.error(er);
        wadahMembaca.innerHTML = `
            <div style="text-align:center; padding: 4rem 1rem; color: var(--accent);">
                <h3>⚠️ Kegagalan Memuat Catatan</h3>
                <p style="font-size:0.9rem; color:var(--text-muted); margin-top:0.5rem;">Silakan periksa ketersediaan berkas markdown lokal Anda.</p>
            </div>
        `;
    }
}