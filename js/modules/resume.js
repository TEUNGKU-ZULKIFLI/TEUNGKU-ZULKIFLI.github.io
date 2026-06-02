/* ========================================================================
   MODUL CONTROLLER: RESUME (js/modules/resume.js)
   Menarik data resume_idn.json dan merendernya ke layout dokumen A4.
======================================================================== */

// Mengambil berkas data resume internal
async function ambilDataResume() {
    try {
        const respon = await fetch('./data/resume_idn.json');
        if (!respon.ok) throw new Error("Gagal mengambil data resume_idn.json");
        return await respon.json();
    } catch (e) {
        console.error("[Resume Controller Error] Gagal memuat data:", e);
        return null;
    }
}

export async function inisialisasiResume(dataProfil) {
    const resumeDoc = document.querySelector('.resume-document');
    const printBtn = document.getElementById('resume-print-btn');

    // Pengaman DOM: Jika kita tidak berada di halaman resume, segera hentikan fungsi
    if (!resumeDoc) return;

    // Aktifkan pemicu tombol cetak browser
    if (printBtn) {
        printBtn.onclick = () => window.print();
    }

    const cv = await ambilDataResume();
    if (!cv) return;

    // 1. Suntikkan Data Header Resume
    document.getElementById('resume-doc-name').textContent = cv.header.nama;
    document.getElementById('resume-doc-contact').textContent = cv.header.kontak;
    
    const tautanEl = document.getElementById('resume-doc-link');
    if (tautanEl && dataProfil.contact) {
        tautanEl.href = dataProfil.contact.github;
        tautanEl.textContent = cv.header.tautan;
    }
    
    document.getElementById('resume-doc-profile').textContent = cv.profil;

    // 2. Render Riwayat Pekerjaan (Pengalaman)
    const wadahPengalaman = document.getElementById('resume-doc-experience');
    if (wadahPengalaman && cv.pengalaman) {
        wadahPengalaman.innerHTML = cv.pengalaman.map(p => `
            <div class="resume-item-block">
                <div class="resume-item-title-row">
                    <span>${p.perusahaan}</span>
                    <span>${p.periode}</span>
                </div>
                <div class="resume-item-subtitle-row">${p.posisi} - ${p.lokasi}</div>
                <ul class="resume-item-bullets">
                    ${p.poin.map(pt => `<li>${pt}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    // 3. Render Riwayat Pendidikan
    const wadahPendidikan = document.getElementById('resume-doc-education');
    if (wadahPendidikan && cv.pendidikan) {
        wadahPendidikan.innerHTML = cv.pendidikan.map(p => `
            <div class="resume-item-block">
                <div class="resume-item-title-row">
                    <span>${p.institusi}</span>
                    <span>${p.periode}</span>
                </div>
                <div class="resume-item-subtitle-row">${p.gelar} - ${p.lokasi}</div>
                <ul class="resume-item-bullets">
                    ${p.poin.map(pt => `<li>${pt}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    // 4. Render Proyek Pilihan
    const wadahProyek = document.getElementById('resume-doc-projects');
    if (wadahProyek && cv.proyek) {
        wadahProyek.innerHTML = cv.proyek.map(p => `
            <div class="resume-item-block">
                <div class="resume-item-title-row">
                    <span>${p.nama}</span>
                    <span>${p.periode}</span>
                </div>
                <div class="resume-item-subtitle-row">${p.peran}</div>
                <ul class="resume-item-bullets">
                    ${p.poin.map(pt => `<li>${pt}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    // 5. Suntikkan Baris Keahlian
    document.getElementById('resume-skill-network').textContent = cv.keahlian.jaringan_server;
    document.getElementById('resume-skill-dev').textContent = cv.keahlian.pengembangan;
    document.getElementById('resume-skill-lang').textContent = cv.keahlian.bahasa;
}