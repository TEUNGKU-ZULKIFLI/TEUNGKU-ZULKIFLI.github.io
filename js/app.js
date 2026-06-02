/* ========================================================================
   LOGIKA UTAMA APLIKASI (Router & Pembuat Keputusan Rute Dinamis)
   Berkas ini murni bertindak sebagai perute saja (tidak mengolah DOM spesifik).
======================================================================== */

let dataProfil = null;

// Mengambil database profil secara aman (Single Source of Truth)
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

// Mengendalikan pendelegasian tugas ke Controller Halaman masing-masing
async function pendelegasianTugasHalaman(namaHalaman) {
    const data = await ambilDataProfil();
    if (!data) return;

    try {
        // Setiap halaman memanggil modul JS-nya sendiri secara dinamis (Lazy Loading)
        if (namaHalaman === 'home') {
            const modulHome = await import('./modules/home.js');
            modulHome.inisialisasiHome(data);
        } 
        else if (namaHalaman === 'about') {
            const modulAbout = await import('./modules/about.js');
            modulAbout.inisialisasiAbout(data);
        }
        else if (namaHalaman === 'projects') {
            const modulProjects = await import('./modules/projects.js');
            modulProjects.inisialisasiProjects(data);
        }
        else if (namaHalaman === 'certification') {
            const modulCertification = await import('./modules/certification.js');
            modulCertification.inisialisasiCertification(data);
        }
        else if (namaHalaman === 'resume') {
            const modulResume = await import('./modules/resume.js');
            modulResume.inisialisasiResume(data);
        }
        else if (namaHalaman === 'terminal') {
            const modulTerminal = await import('./modules/terminal.js');
            modulTerminal.inisialisasiTerminal(data);
        }
        else if (namaHalaman === 'blog') {
            const modulBlog = await import('./modules/blog.js');
            modulBlog.inisialisasiKomponenBlog();
        }
    } catch (error) {
        // Isolasi error: rute halaman lain tidak akan mati jika satu modul gagal
        console.warn(`[Modul Controller Error] Gagal memuat pengontrol untuk #${namaHalaman}:`, error.message);
    }
}

// Memuat file fisik HTML dari folder pages/
async function muatHalaman(namaHalaman) {
    const kontainerKonten = document.getElementById('app-content');
    kontainerKonten.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:2rem;">Memuat halaman...</p>`;

    try {
        const respon = await fetch(`./pages/${namaHalaman}.html`);
        if (!respon.ok) throw new Error(`Berkas pages/${namaHalaman}.html tidak ditemukan`);
        
        kontainerKonten.innerHTML = await respon.text();
        await pendelegasianTugasHalaman(namaHalaman);
    } catch (error) {
        console.error(`[Router Error]`, error);
        kontainerKonten.innerHTML = `
            <div style="text-align:center; padding: 4rem;">
                <h2 style="font-size: 1.75rem; margin-bottom:1rem;">🚧 Halaman Sedang Dibuat</h2>
                <p style="color: var(--text-muted); font-size: 0.95rem;">Halaman ${namaHalaman} sedang dalam proses perakitan.</p>
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

// Inisialisasi Tema
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

    // Latar belakang interaktif murni dimuat secara dinamis
    import('./modules/canvas-bg.js')
        .then(m => m.inisialisasiLatarBelakang())
        .catch(e => console.warn("Latar belakang opsional dilewati:", e.message));
});