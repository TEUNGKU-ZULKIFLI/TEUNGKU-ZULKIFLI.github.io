/* ========================================================================
   LOGIKA KONTROLER BLOG/MARKDOWN READER (Modular JavaScript)
   Menangani parsing markdown dan navigasi sidebar kategori blog.
======================================================================== */

let dataBlogIndeks = null;

async function ambilIndeksBlog() {
    if (dataBlogIndeks) return dataBlogIndeks;
    try {
        // Path disesuaikan agar selalu ditarik relatif terhadap root situs utama
        const respon = await fetch('./_posts/posts-index.json');
        dataBlogIndeks = await respon.json();
        return dataBlogIndeks;
    } catch (e) {
        console.error("Gagal memuat indeks blog:", e);
        return null;
    }
}

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

    if (!indeks || !wadahNavigasi) return;
    wadahNavigasi.innerHTML = '';

    Object.keys(indeks).forEach(kategori => {
        if (indeks[kategori].length === 0) return;

        const grupKategori = document.createElement('div');
        grupKategori.style.marginBottom = '1.25rem';

        const labelKategori = document.createElement('h4');
        labelKategori.style.cssText = 'font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--accent); margin-bottom: 0.5rem; padding-left: 0.25rem; border-left: 2px solid var(--border-color);';
        labelKategori.textContent = kategori.replace('-', ' ');
        grupKategori.appendChild(labelKategori);

        const daftarLink = document.createElement('ul');
        daftarLink.style.cssText = 'list-style: none; padding-left: 0.5rem; display: flex; flex-direction: column; gap: 0.4rem;';

        indeks[kategori].forEach(artikel => {
            const itemLi = document.createElement('li');
            const linkArtikel = document.createElement('a');
            linkArtikel.href = `#blog?buka=${kategori}/${artikel.filename}`;
            linkArtikel.className = 'blog-sidebar-link';
            linkArtikel.style.cssText = 'font-size: 0.9rem; color: var(--text-secondary); text-decoration: none; display: block; padding: 0.35rem 0.5rem; border-radius: var(--radius-sm); transition: all var(--transition-fast);';
            linkArtikel.textContent = artikel.title;

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

    const btnBack = document.getElementById('btn-back-to-list');
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            window.location.hash = '#blog';
            const layout = document.querySelector('.blog-layout');
            if (layout) layout.classList.remove('active-reading');
        });
    }

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

async function tampilkanArtikel(metaArtikel) {
    const wadahMembaca = document.getElementById('blog-content');
    const layout = document.querySelector('.blog-layout');
    
    if (!wadahMembaca) return;

    if (layout) {
        layout.classList.add('active-reading');
    }

    wadahMembaca.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:4rem;">📚 Membuka dokumen...</p>`;

    document.querySelectorAll('.blog-sidebar-link').forEach(link => {
        if (link.getAttribute('href').endsWith(metaArtikel.filename)) {
            link.style.backgroundColor = 'var(--bg-tertiary)';
            link.style.color = 'var(--accent)';
            link.style.fontWeight = '600';
        } else {
            link.style.backgroundColor = 'transparent';
            link.style.color = 'var(--text-secondary)';
            link.style.fontWeight = '500';
        }
    });

    try {
        const respon = await fetch(metaArtikel.filepath);
        if (!respon.ok) throw new Error("File markdown gagal ditarik.");
        
        const teksMentah = await respon.text();
        const teksMarkdownMurni = bersihkanKontenMarkdown(teksMentah);
        const kontenHtmlHasilCompile = marked.parse(teksMarkdownMurni);

        let lencanaTag = metaArtikel.tags.map(t => `<span class="tech-badge" style="font-size:0.75rem; background:var(--bg-tertiary); color:var(--text-secondary); padding:0.2rem 0.5rem; border-radius:var(--radius-sm); margin-right:0.4rem; display:inline-block;">${t}</span>`).join('');
        
        wadahMembaca.innerHTML = `
            <div id="post-header" class="post-header-area" style="margin-bottom: 2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1.5rem;">
                <h1 style="font-size: 2.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem; line-height: 1.2;">${metaArtikel.title}</h1>
                <div style="font-size: 0.9rem; color: var(--text-muted); display: flex; flex-wrap: wrap; gap: 1rem; align-items: center;">
                    <span>📅 Terbit: <strong>${metaArtikel.date}</strong></span>
                    <div class="post-tags-container">${lencanaTag}</div>
                </div>
            </div>
            <div class="entry-content-markdown">
                ${kontenHtmlHasilCompile}
            </div>
        `;

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
            </div>
        `;
    }
}