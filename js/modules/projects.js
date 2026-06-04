/* ========================================================================
   MODUL CONTROLLER: PROJECTS (js/modules/projects.js)
   Mengurus rendering dinamis kartu proyek dari profile.json secara aman.
======================================================================== */

export function inisialisasiProjects(data) {
    const gridProyek = document.getElementById('projects-grid');
    
    // Pengaman: Hentikan eksekusi jika elemen target tidak ditemukan di DOM
    if (!gridProyek || !data.projects) return;

    gridProyek.innerHTML = ''; // Hapus loading-state

    data.projects.forEach(proyek => {
        const kartu = document.createElement('div');
        kartu.className = 'projects-card';

        // Susun lencana teknologi (tech-badge)
        const techBadgesHTML = proyek.tech.map(t => 
            `<span class="projects-tech-badge">${t}</span>`
        ).join('');

        // Tautan default: Selalu mengarah ke Repositori Git utama
        let aksiHTML = `<a href="${proyek.repo}" target="_blank" class="projects-card-link">Repositori Git &rarr;</a>`;

        // Integrasikan tautan dokumentasi internal secara kondisional
        if (proyek.blog) {
            aksiHTML += `<a href="#blog?buka=projects/${proyek.blog}" class="projects-card-link link-primary">Baca Dokumentasi &rarr;</a>`;
        }

        // Integrasikan tautan video demo / website live secara kondisional
        if (proyek.demo) {
            aksiHTML += `<a href="${proyek.demo}" target="_blank" class="projects-card-link link-primary">Lihat Demo &rarr;</a>`;
        }

        kartu.innerHTML = `
            <div class="projects-card-header">
                <h3 class="projects-card-title">${proyek.title}</h3>
            </div>
            <p class="projects-card-desc">${proyek.description}</p>
            <div class="projects-card-tech">${techBadgesHTML}</div>
            <div class="projects-card-actions">${aksiHTML}</div>
        `;

        gridProyek.appendChild(kartu);
    });
}