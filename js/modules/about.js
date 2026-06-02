/* ========================================================================
   MODUL CONTROLLER: ABOUT (js/modules/about.js)
   Mengurus penyuntikan data biografi dan kategorisasi dinamis keahlian.
======================================================================== */

export function inisialisasiAbout(data) {
    const bioText = document.getElementById('about-bio-text');
    const networkGrid = document.getElementById('about-skills-network');
    const devGrid = document.getElementById('about-skills-dev');

    // Pengaman: Jika elemen target tidak ada di DOM, segera hentikan proses
    if (!bioText) return;

    // 1. Suntikkan teks biografi
    bioText.textContent = data.personal.bio;

    // 2. Lakukan pengelompokan keahlian secara logis
    if (networkGrid && devGrid && data.skills) {
        networkGrid.innerHTML = '';
        devGrid.innerHTML = '';

        // Filter kata kunci khusus jaringan & server
        const networkKeywords = ['mikrotik', 'gns3', 'linux', 'proxmox', 'serat optik', 'apache', 'mysql', 'server'];
        
        const networkSkills = data.skills.filter(skill => 
            networkKeywords.some(keyword => skill.toLowerCase().includes(keyword))
        );
        const devSkills = data.skills.filter(skill => !networkSkills.includes(skill));

        // Render lencana ke seksi Jaringan
        networkSkills.forEach(skill => {
            const badge = document.createElement('span');
            badge.className = 'about-skill-badge';
            badge.textContent = skill;
            networkGrid.appendChild(badge);
        });

        // Render lencana ke seksi Pemrograman
        devSkills.forEach(skill => {
            const badge = document.createElement('span');
            badge.className = 'about-skill-badge';
            badge.textContent = skill;
            devGrid.appendChild(badge);
        });
    }
}