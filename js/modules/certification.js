/* ========================================================================
   MODUL CONTROLLER: CERTIFICATION (js/modules/certification.js)
   Mengurus penyuntikan data kredensial asinkron dari profile.json secara aman.
======================================================================== */

export function inisialisasiCertification(data) {
    const listSertifikat = document.getElementById('certification-list');

    // Pengaman: Jika elemen sasaran tidak ada di halaman aktif, segera hentikan proses
    if (!listSertifikat || !data.certifications) return;

    listSertifikat.innerHTML = ''; // Hilangkan loading-state

    data.certifications.forEach(cert => {
        const kartu = document.createElement('div');
        kartu.className = 'certification-card';

        // Tautan verifikasi kredensial dinamis
        const tautanHTML = cert.url !== "#" 
            ? `<a href="${cert.url}" target="_blank" class="certification-link">Lihat Kredensial &rarr;</a>` 
            : `<span class="certification-link" style="opacity: 0.5; cursor: not-allowed;">Kredensial Internal</span>`;

        kartu.innerHTML = `
            <div class="certification-card-left">
                <h3 class="certification-name">${cert.name}</h3>
                <p class="certification-issuer">${cert.issuer}</p>
            </div>
            <div class="certification-card-right">
                <span class="certification-year">${cert.year}</span>
                ${tautanHTML}
            </div>
        `;

        listSertifikat.appendChild(kartu);
    });
}