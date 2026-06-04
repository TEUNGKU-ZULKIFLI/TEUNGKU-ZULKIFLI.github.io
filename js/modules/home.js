/* ========================================================================
   MODUL CONTROLLER: HOME (js/modules/home.js)
   Mengambil file SVG eksternal, menyuntikkannya ke DOM, dan mengaktifkan
   fitur interaktif pelacakan arah kursor mouse (Eye-Tracking).
======================================================================== */

export async function inisialisasiHome(data) {
    const homeName = document.getElementById('home-name');
    const homeRole = document.getElementById('home-role');
    const homeTagline = document.getElementById('home-tagline');
    const avatarContainer = document.getElementById('home-avatar-container');

    // Pengaman DOM
    if (!homeName || !homeRole || !homeTagline) return;

    // 1. Suntikkan Data Tekstual dari JSON
    homeName.textContent = data.personal.name;
    homeRole.textContent = data.personal.role;
    homeTagline.textContent = data.personal.tagline;

    // Efek Transisi Halus (Fade-In) Teks
    homeName.style.opacity = '0';
    homeName.style.transform = 'translateY(10px)';
    homeName.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    requestAnimationFrame(() => {
        homeName.style.opacity = '1';
        homeName.style.transform = 'translateY(0)';
    });

    // 2. DYNAMIC SVG INJECTION & INTERACTIVE EYE TRACKING
    if (avatarContainer) {
        try {
            // Ambil berkas SVG 4.8MB dari folder assets/
            const respon = await fetch('./assets/Avatar-main.svg');
            if (!respon.ok) throw new Error("Gagal mengambil berkas Avatar-main.svg");
            
            const dataSVG = await respon.text();
            
            // Suntikkan kode SVG langsung ke dalam kontainer
            avatarContainer.innerHTML = dataSVG;

            const elemenSVG = avatarContainer.querySelector('svg');
            if (elemenSVG) {
                elemenSVG.removeAttribute('width');
                elemenSVG.removeAttribute('height');
                elemenSVG.classList.add('home-avatar-svg');
            }

            // --- AKTIFKAN INTERAKSI BOLA MATA (EYE-TRACKING) ---
            const bolaMata = document.getElementById('eyes-main');
            
            if (bolaMata) {
                // Tambahkan transisi CSS halus agar gerakan bola mata tidak patah-patah
                bolaMata.style.transition = 'transform 0.15s ease-out';

                const lacakGerakanMouse = (e) => {
                    // Ambil posisi koordinat pusat dari elemen mata di layar
                    const rectMata = bolaMata.getBoundingClientRect();
                    const pusatMataX = rectMata.left + rectMata.width / 2;
                    const pusatMataY = rectMata.top + rectMata.height / 2;

                    // Hitung selisih jarak antara kursor mouse dengan pusat mata
                    const selisihX = e.clientX - pusatMataX;
                    const selisihY = e.clientY - pusatMataY;

                    // Tentukan sudut kemiringan lirikan menggunakan Trigonometri Arc Tangen
                    const sudutLirikan = Math.atan2(selisihY, selisihX);

                    // Batasi radius lirikan maksimum (dalam satuan piksel) agar mata tidak keluar batas
                    const radiusMaksimum = 5.0; 
                    const jarakKursor = Math.hypot(selisihX, selisihY);
                    
                    // Semakin dekat kursor ke mata, lirikan akan semakin sedikit mengecil secara proporsional
                    const kekuatanLirikan = Math.min(jarakKursor * 0.03, radiusMaksimum);

                    // Hitung koordinat pergeseran (Translate X & Y)
                    const pergeseranX = Math.cos(sudutLirikan) * kekuatanLirikan;
                    const pergeseranY = Math.sin(sudutLirikan) * kekuatanLirikan;

                    // Terapkan translasi koordinat ke elemen mata
                    bolaMata.style.transform = `translate(${pergeseranX}px, ${pergeseranY}px)`;
                };

                // Kembalikan mata ke posisi tengah secara otomatis jika mouse keluar dari jendela peramban
                const kembalikanMataKeTengah = () => {
                    bolaMata.style.transform = 'translate(0px, 0px)';
                };

                // Pasang event listener ke window
                window.addEventListener('mousemove', lacakGerakanMouse);
                window.addEventListener('mouseout', kembalikanMataKeTengah);

                // Bersihkan event listener jika rute berpindah demi mencegah kebocoran memori (Memory Leak)
                window.addEventListener('hashchange', function bersihkanEvent() {
                    window.removeEventListener('mousemove', lacakGerakanMouse);
                    window.removeEventListener('mouseout', kembalikanMataKeTengah);
                    window.removeEventListener('hashchange', bersihkanEvent);
                });
            }

        } catch (error) {
            console.warn("[Avatar Loader Warning] Gagal memproses SVG dinamis:", error.message);
            avatarContainer.innerHTML = `
                <div class="home-avatar-fallback">
                    <span style="font-size: 3rem;">👤</span>
                </div>
            `;
        }
    }
}