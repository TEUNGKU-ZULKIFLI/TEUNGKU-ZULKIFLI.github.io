/* ========================================================================
   LOGIKA UTAMA APLIKASI (Router, Jalur Navigasi, & Pengendali Global)
======================================================================== */

let dataProfil = null;
let dataResume = null;

// Mengambil database profil secara aman
async function ambilDataProfil() {
    if (dataProfil) return dataProfil;
    try {
        const respon = await fetch('./data/profile.json');
        dataProfil = await respon.json();
        return dataProfil;
    } catch (e) {
        console.error("Gagal memuat profil:", e);
        return null;
    }
}

// Mengambil database resume (CV)
async function ambilDataResume() {
    if (dataResume) return dataResume;
    try {
        const respon = await fetch('./data/resume_idn.json');
        dataResume = await respon.json();
        return dataResume;
    } catch (e) {
        console.error("Gagal memuat resume:", e);
        return null;
    }
}

// Menyuntikkan data dinamis ke halaman
async function isiDataHalaman(namaHalaman) {
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
    // LAZY LOAD MODULES: Memuat logika modul secara Asynchronous hanya jika rute aktif
    else if (namaHalaman === 'terminal') {
        try {
            const modulTerminal = await import('./modules/terminal.js');
            modulTerminal.inisialisasiTerminal(data);
        } catch (err) {
            console.error("Gagal memuat modular terminal:", err);
        }
    }
    else if (namaHalaman === 'blog') {
        try {
            const modulBlog = await import('./modules/blog.js');
            modulBlog.inisialisasiKomponenBlog();
        } catch (err) {
            console.error("Gagal memuat modular blog:", err);
        }
    }
}

// Memuat file HTML halaman
async function muatHalaman(namaHalaman) {
    const kontainerKonten = document.getElementById('app-content');
    kontainerKonten.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:2rem;">Memuat konten...</p>`;

    try {
        const respon = await fetch(`./pages/${namaHalaman}.html`);
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

document.addEventListener('DOMContentLoaded', async () => {
    aturRute();
    inisialisasiTema();
    window.addEventListener('hashchange', aturRute);

    try {
        const modulBg = await import('./modules/canvas-bg.js');
        modulBg.inisialisasiLatarBelakang();
    } catch (err) {
        console.error("Gagal memuat modul latar belakang:", err);
    }
});