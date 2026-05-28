/* ========================================================================
   LOGIKA UTAMA APLIKASI (Router & Pengelola Data Portofolio)
======================================================================== */

let dataProfil = null; // Menyimpan cache data profil

// Mengambil data profil dari satu file JSON terpusat
async function ambilDataProfil() {
    if (dataProfil) return dataProfil;
    try {
        const respon = await fetch('data/profile.json');
        if (!respon.ok) throw new Error('Gagal mengambil file JSON profil');
        dataProfil = await respon.json();
        return dataProfil;
    } catch (error) {
        console.error("Error data profil:", error);
        return null;
    }
}

// Menyuntikkan data dinamis ke elemen halaman spesifik
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
            badge.style.cssText = "padding: 0.5rem 1rem; background-color: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.9rem; font-weight: 500; color: var(--text-secondary);";
            badge.textContent = skill;
            wadahSkill.appendChild(badge);
        });
    }

    // --- LOGIKA BARU: MEMPROSES HALAMAN PROYEK ---
    else if (namaHalaman === 'projects') {
        const gridProyek = document.getElementById('projects-grid');
        gridProyek.innerHTML = ''; // Bersihkan teks "Memuat..."

        data.projects.forEach(proyek => {
            // Buat elemen kartu proyek
            const kartu = document.createElement('div');
            // Menerapkan gaya "Card" modern
            kartu.style.cssText = "background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem; display: flex; flex-direction: column; transition: transform var(--transition-fast), box-shadow var(--transition-fast); cursor: default;";
            
            // Efek hover sederhana menggunakan event listener karena kita pakai inline styles
            kartu.addEventListener('mouseenter', () => {
                kartu.style.transform = 'translateY(-4px)';
                kartu.style.boxShadow = 'var(--shadow-md)';
                kartu.style.borderColor = 'var(--accent)';
            });
            kartu.addEventListener('mouseleave', () => {
                kartu.style.transform = 'translateY(0)';
                kartu.style.boxShadow = 'none';
                kartu.style.borderColor = 'var(--border-color)';
            });

            // Rakit isi kartu
            let techBadges = proyek.tech.map(t => `<span style="font-size:0.75rem; background:var(--bg-tertiary); color:var(--text-secondary); padding:0.2rem 0.5rem; border-radius:var(--radius-sm); margin-right:0.4rem; margin-bottom:0.4rem; display:inline-block;">${t}</span>`).join('');
            
            kartu.innerHTML = `
                <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">${proyek.title}</h3>
                <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem; flex-grow: 1;">${proyek.description}</p>
                <div style="margin-bottom: 1.5rem;">${techBadges}</div>
                <div style="display: flex; gap: 1rem; margin-top: auto; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                    <a href="${proyek.repo}" target="_blank" style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary); text-decoration: none;">GitHub Repo &rarr;</a>
                </div>
            `;
            gridProyek.appendChild(kartu);
        });
    }
    // --- LOGIKA BARU: MEMPROSES HALAMAN SERTIFIKASI ---
    else if (namaHalaman === 'sertifikasi') {
        const wadahSertifikat = document.getElementById('cert-list');
        wadahSertifikat.innerHTML = ''; // Bersihkan teks "Memuat..."

        if (data.certifications && data.certifications.length > 0) {
            data.certifications.forEach(cert => {
                const item = document.createElement('div');
                item.style.cssText = "background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; transition: background-color var(--transition-fast);";
                
                // Efek hover
                item.addEventListener('mouseenter', () => item.style.backgroundColor = 'var(--bg-tertiary)');
                item.addEventListener('mouseleave', () => item.style.backgroundColor = 'var(--bg-secondary)');

                item.innerHTML = `
                    <div>
                        <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">${cert.name}</h3>
                        <p style="font-size: 0.9rem; color: var(--text-secondary);">${cert.issuer}</p>
                    </div>
                    <div style="text-align: right;">
                        <span style="display: block; font-weight: 600; color: var(--accent); font-size: 1.1rem;">${cert.year}</span>
                        ${cert.url !== "#" ? `<a href="${cert.url}" target="_blank" style="font-size: 0.8rem; color: var(--text-muted); text-decoration: underline;">Lihat Kredensial</a>` : ''}
                    </div>
                `;
                wadahSertifikat.appendChild(item);
            });
        } else {
            wadahSertifikat.innerHTML = `<p style="text-align:center; color:var(--text-muted);">Belum ada data sertifikasi.</p>`;
        }
    }
    // --- LOGIKA BARU: MEMPROSES HALAMAN SERTIFIKASI ---
    else if (namaHalaman === 'sertifikasi') {
        const wadahSertifikat = document.getElementById('cert-list');
        wadahSertifikat.innerHTML = ''; // Bersihkan teks "Memuat..."

        if (data.certifications && data.certifications.length > 0) {
            data.certifications.forEach(cert => {
                const item = document.createElement('div');
                item.style.cssText = "background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; transition: background-color var(--transition-fast);";
                
                // Efek hover
                item.addEventListener('mouseenter', () => item.style.backgroundColor = 'var(--bg-tertiary)');
                item.addEventListener('mouseleave', () => item.style.backgroundColor = 'var(--bg-secondary)');

                item.innerHTML = `
                    <div>
                        <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">${cert.name}</h3>
                        <p style="font-size: 0.9rem; color: var(--text-secondary);">${cert.issuer}</p>
                    </div>
                    <div style="text-align: right;">
                        <span style="display: block; font-weight: 600; color: var(--accent); font-size: 1.1rem;">${cert.year}</span>
                        ${cert.url !== "#" ? `<a href="${cert.url}" target="_blank" style="font-size: 0.8rem; color: var(--text-muted); text-decoration: underline;">Lihat Kredensial</a>` : ''}
                    </div>
                `;
                wadahSertifikat.appendChild(item);
            });
        } else {
            wadahSertifikat.innerHTML = `<p style="text-align:center; color:var(--text-muted);">Belum ada data sertifikasi.</p>`;
        }
    }
}

// Memuat file HTML halaman secara dinamis
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
                <h2 style="font-size: 1.75rem; margin-bottom:1rem;">🚧 Halaman Sedang Dibuat (Under Construction)</h2>
                <p style="color: var(--text-muted); font-size: 0.95rem;">Halaman ${namaHalaman} belum selesai dirakit.</p>
            </div>
        `;
    }
}

// Mengatur status navigasi aktif (Highlight menu)
function aturNavigasiAktif(namaHalaman) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-link') === namaHalaman) {
            link.classList.add('active');
        }
    });
}

// Mengatur rute URL halaman
function aturRute() {
    let hash = window.location.hash.replace('#', '');
    if (!hash) {
        hash = 'home';
        window.history.replaceState(null, null, '#home');
    }
    muatHalaman(hash);
    aturNavigasiAktif(hash);
}

// Inisialisasi awal saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    aturRute();
    window.addEventListener('hashchange', aturRute);
});