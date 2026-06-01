/* ========================================================================
   LOGIKA UTAMA APLIKASI (Router, Jalur Navigasi, & Pengendali Global)
   Dirancang modular, aman dengan try-catch, dan mudah dipelihara.
======================================================================== */

let dataProfil = null;
let dataResume = null;

// ========================================================================
// 1. DATA ACCESS LAYER (Mengambil Sumber Data JSON)
// ========================================================================

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

// ========================================================================
// 2. DOM MANIPULATION LAYER (Menyuntikkan Data ke Halaman Aktif)
// ========================================================================

async function isiDataHalaman(namaHalaman) {
    const data = await ambilDataProfil();
    if (!data) return;

    // Gunakan try-catch di setiap blok halaman agar kesalahan satu elemen 
    // tidak menghentikan atau merusak keseluruhan aplikasi web Anda.
    try {
        if (namaHalaman === 'home') {
            document.getElementById('hero-name').textContent = data.personal.name;
            document.getElementById('hero-role').textContent = data.personal.role;
            document.getElementById('hero-tagline').textContent = data.personal.tagline;
        } 
        
        else if (namaHalaman === 'about') {
            document.getElementById('about-bio').textContent = data.personal.bio;
            
            const wadahJaringan = document.getElementById('skills-network-list');
            const wadahDev = document.getElementById('skills-dev-list');

            if (wadahJaringan && wadahDev) {
                wadahJaringan.innerHTML = '';
                wadahDev.innerHTML = '';

                // Pengelompokan keahlian secara logis
                const keahlianJaringan = data.skills.filter(s => 
                    ['mikrotik', 'gns3', 'linux', 'proxmox', 'serat optik', 'apache', 'mysql', 'server'].some(keyword => s.toLowerCase().includes(keyword))
                );
                const keahlianDev = data.skills.filter(s => !keahlianJaringan.includes(s));

                keahlianJaringan.forEach(skill => {
                    const badge = document.createElement('span');
                    badge.className = 'skill-badge-item';
                    badge.textContent = skill;
                    wadahJaringan.appendChild(badge);
                });

                keahlianDev.forEach(skill => {
                    const badge = document.createElement('span');
                    badge.className = 'skill-badge-item';
                    badge.textContent = skill;
                    wadahDev.appendChild(badge);
                });
            }
        }
        
        else if (namaHalaman === 'projects') {
            const gridProyek = document.getElementById('projects-grid');
            if (gridProyek) {
                gridProyek.innerHTML = '';
                data.projects.forEach(proyek => {
                    const kartu = document.createElement('div');
                    kartu.className = 'project-card';
                    let techBadges = proyek.tech.map(t => `<span class="tech-badge">${t}</span>`).join('');
                    
                    let aksiHTML = `<a href="${proyek.repo}" target="_blank" class="project-link">Repositori Git &rarr;</a>`;
                    if (proyek.blog) {
                        aksiHTML += `<a href="#blog?buka=projects/${proyek.blog}" class="project-link link-primary">Baca Dokumentasi &rarr;</a>`;
                    }
                    if (proyek.demo) {
                        aksiHTML += `<a href="${proyek.demo}" target="_blank" class="project-link link-primary">Lihat Demo &rarr;</a>`;
                    }

                    kartu.innerHTML = `
                        <div class="project-card-header">
                            <h3 class="project-title">${proyek.title}</h3>
                        </div>
                        <p class="project-desc">${proyek.description}</p>
                        <div class="project-tech">${techBadges}</div>
                        <div class="project-actions">${aksiHTML}</div>
                    `;
                    gridProyek.appendChild(kartu);
                });
            }
        }
        
        else if (namaHalaman === 'sertifikasi') {
            const wadahSertifikat = document.getElementById('cert-list');
            if (wadahSertifikat) {
                wadahSertifikat.innerHTML = '';
                
                if (data.certifications && data.certifications.length > 0) {
                    data.certifications.forEach(cert => {
                        const item = document.createElement('div');
                        item.className = 'cert-card-item';
                        
                        const linkHTML = cert.url !== "#" 
                            ? `<a href="${cert.url}" target="_blank" class="cert-verify-link">Lihat Kredensial &rarr;</a>` 
                            : `<span class="cert-verify-link" style="opacity: 0.5; cursor: not-allowed;">Kredensial Internal</span>`;

                        item.innerHTML = `
                            <div class="cert-content-left">
                                <h3 class="cert-name-text">${cert.name}</h3>
                                <p class="cert-issuer-text">${cert.issuer}</p>
                            </div>
                            <div class="cert-content-right">
                                <span class="cert-year-badge">${cert.year}</span>
                                ${linkHTML}
                            </div>
                        `;
                        wadahSertifikat.appendChild(item);
                    });
                } else {
                    wadahSertifikat.innerHTML = `<p class="cert-loading-state">Belum ada data sertifikasi terdaftar.</p>`;
                }
            }
        }
        
        else if (namaHalaman === 'contact') {
            const emailEl = document.getElementById('contact-email');
            if (emailEl) {
                emailEl.href = `mailto:${data.contact.email}`;
                emailEl.textContent = data.contact.email;
                document.getElementById('contact-github').href = data.contact.github;
                document.getElementById('contact-linkedin').href = data.contact.linkedin;
            }
        }
        
        else if (namaHalaman === 'resume') {
            const cv = await ambilDataResume();
            if (!cv) return;

            document.getElementById('cv-nama').textContent = cv.header.nama;
            document.getElementById('cv-kontak').textContent = cv.header.kontak;
            
            const tautanEl = document.getElementById('cv-tautan');
            if (tautanEl) {
                tautanEl.href = data.contact.github;
                tautanEl.textContent = cv.header.tautan;
            }
            
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
        
        // LAZY LOAD MODULES: Dipanggil asinkron murni saat rute aktif
        else if (namaHalaman === 'terminal') {
            const modulTerminal = await import('./modules/terminal.js');
            modulTerminal.inisialisasiTerminal(data);
        }
        
        else if (namaHalaman === 'blog') {
            const modulBlog = await import('./modules/blog.js');
            modulBlog.inisialisasiKomponenBlog();
        }
    } catch (error) {
        // Melokalisasi error agar halaman lain tidak terimbas jika terjadi bug kelas DOM
        console.warn(`[Page Binder Warning] Gagal mengisi data untuk rute #${namaHalaman}:`, error.message);
    }
}

// ========================================================================
// 3. ROUTER LAYER (Pemuatan Berkas Fisik HTML & Pengendali Rute)
// ========================================================================

async function muatHalaman(namaHalaman) {
    const kontainerKonten = document.getElementById('app-content');
    kontainerKonten.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:2rem;">Memuat konten...</p>`;

    try {
        const respon = await fetch(`./pages/${namaHalaman}.html`);
        if (!respon.ok) throw new Error(`Halaman ${namaHalaman} tidak ditemukan (404)`);
        
        kontainerKonten.innerHTML = await respon.text();
        await isiDataHalaman(namaHalaman);
    } catch (error) {
        console.error(`[Router Error] Gagal memuat file pages/${namaHalaman}.html:`, error);
        kontainerKonten.innerHTML = `
            <div style="text-align:center; padding: 4rem;">
                <h2 style="font-size: 1.75rem; margin-bottom:1rem;">🚧 Halaman Sedang Dibuat</h2>
                <p style="color: var(--text-muted); font-size: 0.95rem;">Halaman ${namaHalaman} belum selesai dirakit atau jalur berkas salah.</p>
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

// ========================================================================
// 4. THEME & GLOBAL SYSTEM INITIALIZATION
// ========================================================================

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

// Inisialisasi awal saat dokumen selesai dimuat sempurna oleh peramban
document.addEventListener('DOMContentLoaded', async () => {
    aturRute();
    inisialisasiTema();
    window.addEventListener('hashchange', aturRute);

    // Muat canvas latar belakang secara dinamis
    try {
        const modulBg = await import('./modules/canvas-bg.js');
        modulBg.inisialisasiLatarBelakang();
    } catch (err) {
        console.warn("Modul latar belakang opsional gagal dimuat:", err.message);
    }
});