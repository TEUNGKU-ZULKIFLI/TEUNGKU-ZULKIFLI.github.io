/* ========================================================================
   LOGIKA UTAMA APLIKASI (Router, Manajemen Data, Cetak & Pengendali Tema)
======================================================================== */

let dataProfil = null;
let dataResume = null;
let dataBlogIndeks = null;

// Mengambil database profil
async function ambilDataProfil() {
    if (dataProfil) return dataProfil;
    try {
        const respon = await fetch('data/profile.json');
        dataProfil = await respon.json();
        return dataProfil;
    } catch (e) {
        console.error("Gagal memuat profil:", e);
        return null;
    }
}

// Mengambil database resume (CV) khusus
async function ambilDataResume() {
    if (dataResume) return dataResume;
    try {
        const respon = await fetch('data/resume_idn.json');
        dataResume = await respon.json();
        return dataResume;
    } catch (e) {
        console.error("Gagal memuat resume:", e);
        return null;
    }
}

// Mengambil database indeks artikel blog (.md) yang di-generate Python
async function ambilIndeksBlog() {
    if (dataBlogIndeks) return dataBlogIndeks;
    try {
        const respon = await fetch('_posts/posts-index.json');
        dataBlogIndeks = await respon.json();
        return dataBlogIndeks;
    } catch (e) {
        console.error("Gagal memuat indeks blog:", e);
        return null;
    }
}

// Fungsi pembantu untuk membuang Front Matter (YAML Metadata) dari konten mentah .md
function bersihkanKontenMarkdown(teksMentah) {
    const matches = teksMentah.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+/);
    if (matches) {
        return teksMentah.replace(matches[0], '');
    }
    return teksMentah;
}

// Fungsi Inti Pengendali & Pembuat Antarmuka Blog Dua Kolom
async function inisialisasiKomponenBlog() {
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

    // Menghubungkan tombol "Kembali" di Mobile
    const btnBack = document.getElementById('btn-back-to-list');
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            window.location.hash = '#blog'; // Reset hash ke indeks utama
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

// Fungsi untuk menarik file .md asli dan merendernya ke Layar Pembaca
async function tampilkanArtikel(metaArtikel) {
    const wadahMembaca = document.getElementById('blog-content');
    const layout = document.querySelector('.blog-layout');
    
    if (!wadahMembaca) return;

    // Aktifkan mode membaca untuk menyembunyikan sidebar di mobile
    if (layout) {
        layout.classList.add('active-reading');
    }

    wadahMembaca.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:4rem;">📚 Membuka dokumen...</p>`;

    // Sorot link aktif di sidebar
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

        // SOLUSI WARN KUNING: Menggunakan requestAnimationFrame untuk menghindari forced reflow
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

// Menyuntikkan data dinamis ke elemen halaman standar
async function isiDataHalaman(namaHalaman) {
    if (namaHalaman === 'blog') {
        await inisialisasiKomponenBlog();
        return;
    }

    const data = await ambilDataProfil();
    if (!data) return;

    if (namaHalaman === 'home') {
        document.getElementById('hero-name').textContent = data.personal.name;
        document.getElementById('hero-role').textContent = data.personal.role;
        document.getElementById('hero-tagline').textContent = data.personal.tagline;
    } 
    else if (namaHalaman === 'about') {
        document.getElementById('about-bio').textContent = data.personal.bio;
        const wadahSkill = document.getElementById('skills-list');
        wadahSkill.innerHTML = ''; 
        data.skills.forEach(skill => {
            const badge = document.createElement('span');
            badge.className = 'skill-badge';
            badge.textContent = skill;
            wadahSkill.appendChild(badge);
        });
    }
    else if (namaHalaman === 'projects') {
        const gridProyek = document.getElementById('projects-grid');
        gridProyek.innerHTML = '';
        data.projects.forEach(proyek => {
            const kartu = document.createElement('div');
            kartu.className = 'project-card';
            let techBadges = proyek.tech.map(t => `<span class="tech-badge">${t}</span>`).join('');
            kartu.innerHTML = `
                <h3 class="project-title">${proyek.title}</h3>
                <p class="project-desc">${proyek.description}</p>
                <div class="project-tech">${techBadges}</div>
                <a href="${proyek.repo}" target="_blank" class="project-link">Repositori GitHub &rarr;</a>
            `;
            gridProyek.appendChild(kartu);
        });
    }
    else if (namaHalaman === 'sertifikasi') {
        const wadahSertifikat = document.getElementById('cert-list');
        wadahSertifikat.innerHTML = '';
        data.certifications.forEach(cert => {
            const item = document.createElement('div');
            item.className = 'cert-item';
            item.innerHTML = `
                <div class="cert-info">
                    <h3>${cert.name}</h3>
                    <p>${cert.issuer}</p>
                </div>
                <div class="cert-meta">
                    <span class="cert-year">${cert.year}</span>
                    ${cert.url !== "#" ? `<a href="${cert.url}" target="_blank" class="cert-link">Lihat Kredensial</a>` : ''}
                </div>
            `;
            wadahSertifikat.appendChild(item);
        });
    }
    else if (namaHalaman === 'contact') {
        const emailEl = document.getElementById('contact-email');
        emailEl.href = `mailto:${data.contact.email}`;
        emailEl.textContent = data.contact.email;
        document.getElementById('contact-github').href = data.contact.github;
        document.getElementById('contact-linkedin').href = data.contact.linkedin;
    }
    else if (namaHalaman === 'resume') {
        const cv = await ambilDataResume();
        if (!cv) return;

        document.getElementById('cv-nama').textContent = cv.header.nama;
        document.getElementById('cv-kontak').textContent = cv.header.kontak;
        const tautanEl = document.getElementById('cv-tautan');
        tautanEl.href = data.contact.github;
        tautanEl.textContent = cv.header.tautan;
        document.getElementById('cv-profil').textContent = cv.profil;

        document.getElementById('cv-pendidikan').innerHTML = cv.pendidikan.map(p => `
            <div class="cv-item">
                <div class="cv-item-header"><span>${p.institusi}</span><span>${p.periode}</span></div>
                <div class="cv-item-sub">${p.gelar} - ${p.lokasi}</div>
                <ul class="cv-list">${p.poin.map(pt => `<li>${pt}</li>`).join('')}</ul>
            </div>
        `).join('');

        document.getElementById('cv-pengalaman').innerHTML = cv.pengalaman.map(p => `
            <div class="cv-item">
                <div class="cv-item-header"><span>${p.perusahaan}</span><span>${p.periode}</span></div>
                <div class="cv-item-sub">${p.posisi} - ${p.lokasi}</div>
                <ul class="cv-list">${p.poin.map(pt => `<li>${pt}</li>`).join('')}</ul>
            </div>
        `).join('');

        document.getElementById('cv-proyek').innerHTML = cv.proyek.map(p => `
            <div class="cv-item">
                <div class="cv-item-header"><span>${p.nama}</span><span>${p.periode}</span></div>
                <div class="cv-item-sub">${p.peran}</div>
                <ul class="cv-list">${p.poin.map(pt => `<li>${pt}</li>`).join('')}</ul>
            </div>
        `).join('');

        document.getElementById('cv-skill-jaringan').textContent = cv.keahlian.jaringan_server;
        document.getElementById('cv-skill-dev').textContent = cv.keahlian.pengembangan;
        document.getElementById('cv-bahasa').textContent = cv.keahlian.bahasa;
    }
}

// Memuat file HTML halaman
async function muatHalaman(namaHalaman) {
    const kontainerKonten = document.getElementById('app-content');
    kontainerKonten.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:2rem;">Memuat konten...</p>`;

    try {
        const respon = await fetch(`pages/${namaHalaman}.html`);
        if (!respon.ok) throw new Error(`Halaman ${namaHalaman} tidak ditemukan (404)`);
        
        kontainerKonten.innerHTML = await respon.text();
        await isiDataHalaman(namaHalaman);
    } catch (error) {
        kontainerKonten.innerHTML = `
            <div style="text-align:center; padding: 4rem;">
                <h2 style="font-size: 1.75rem; margin-bottom:1rem;">🚧 Halaman Sedang Dibuat</h2>
                <p style="color: var(--text-muted); font-size: 0.95rem;">Halaman ${namaHalaman} belum selesai dirakit.</p>
            </div>
        `;
    }
}

function aturNavigasiAktif(namaHalaman) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-link') === namaHalaman) {
            link.classList.add('active');
        }
    });
}

function aturRute() {
    let hashMentah = window.location.hash.replace('#', '');
    let namaHalaman = hashMentah.split('?')[0];

    if (!namaHalaman) {
        namaHalaman = 'home';
        window.history.replaceState(null, null, '#home');
    }
    
    muatHalaman(namaHalaman);
    aturNavigasiAktif(namaHalaman);
}

// Pengendali Inisialisasi Tema
function inisialisasiTema() {
    const tombolTema = document.getElementById('theme-toggle');
    if (!tombolTema) return;

    const temaTersimpan = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (temaTersimpan === 'dark' || (!temaTersimpan && prefersDark)) {
        document.documentElement.classList.add('dark');
        tombolTema.textContent = '☀️';
    } else {
        document.documentElement.classList.remove('dark');
        tombolTema.textContent = '🌙';
    }

    tombolTema.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        tombolTema.textContent = isDark ? '☀️' : '🌙';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    aturRute();
    inisialisasiTema();
    window.addEventListener('hashchange', aturRute);
});