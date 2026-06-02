/* ========================================================================
   MODUL CONTROLLER: HOME (js/modules/home.js)
   Mengurus penyuntikan data profil asinkron khusus untuk halaman Beranda.
======================================================================== */

export function inisialisasiHome(data) {
    const homeName = document.getElementById('home-name');
    const homeRole = document.getElementById('home-role');
    const homeTagline = document.getElementById('home-tagline');

    // Pengaman: Jika elemen tidak ditemukan di HTML, hentikan logika agar tidak terjadi error
    if (!homeName || !homeRole || !homeTagline) return;

    // Suntikkan data asli secara presisi
    homeName.textContent = data.personal.name;
    homeRole.textContent = data.personal.role;
    homeTagline.textContent = data.personal.tagline;

    // Animasi pudar masuk halus (Fade In) saat pertama kali dimuat
    homeName.style.opacity = '0';
    homeName.style.transform = 'translateY(10px)';
    homeName.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    requestAnimationFrame(() => {
        homeName.style.opacity = '1';
        homeName.style.transform = 'translateY(0)';
    });
}