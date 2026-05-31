/* ========================================================================
   LOGIKA KONTROLER TERMINAL SIMULATOR (Modular JavaScript)
   Menangani input, auto-scroll, pencarian perintah, dan rendering logs.
======================================================================== */

export function inisialisasiTerminal(dataProfil) {
    const terminalInput = document.getElementById('terminal-input');
    const terminalBody = document.getElementById('terminal-body');
    if (!terminalInput || !terminalBody) return;

    // Otomatis fokus ketika area dalam terminal diklik
    terminalBody.addEventListener('click', () => {
        terminalInput.focus();
    });

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim().toLowerCase();
            prosesPerintah(command, dataProfil);
            terminalInput.value = ''; // Bersihkan baris input
        }
    });
}

function prosesPerintah(perintah, data) {
    const outputKontainer = document.querySelector('.terminal-output');
    const terminalBody = document.getElementById('terminal-body');
    if (!outputKontainer || !terminalBody) return;

    let respon = '';

    switch (perintah) {
        case 'help':
            respon = `
<p>Daftar perintah yang tersedia:</p>
<p>  <span style="color:#fbbf24">whoami</span>   - Informasi ringkas mengenai Teungku Zulkifli</p>
<p>  <span style="color:#fbbf24">skill</span>   - Daftar kompetensi dan spesialisasi teknis</p>
<p>  <span style="color:#fbbf24">project</span> - Proyek rekayasa sistem pilihan</p>
<p>  <span style="color:#fbbf24">contact</span> - Informasi kontak</p>
<p>  <span style="color:#fbbf24">clear</span>   - Membersihkan log layar terminal</p>
            `;
            break;
        case 'whoami':
            respon = `<p>${data.personal.bio}</p>`;
            break;
        case 'skill':
            respon = `<p><strong>Spesialisasi:</strong> ${data.skills.join(', ')}</p>`;
            break;
        case 'project':
            respon = data.projects.map(p => `
                <p style="margin-bottom:0.5rem;">• <strong>${p.title}</strong><br>
                <span style="color:var(--text-secondary); font-size:0.85rem;">${p.description}</span></p>
            `).join('');
            break;
        case 'contact':
            respon = `
<p>Hubungi saya atau lihat portofolio eksternal di:</p>
<p>• email: <a href="mailto:${data.contact.email}" style="color:#38bdf8; text-decoration:underline;">${data.contact.email}</a></p>
<p>• GitHub: <a href="${data.contact.github}" target="_blank" style="color:#38bdf8; text-decoration:underline;">${data.contact.github}</a></p>
<p>• LinkedIn: <a href="${data.contact.linkedin}" target="_blank" style="color:#38bdf8; text-decoration:underline;">${data.contact.linkedin}</a></p>
<p>• YouTube: <a href="${data.contact.youtube}" target="_blank" style="color:#38bdf8; text-decoration:underline;">${data.contact.youtube}</a></p>
<p>• Instagram: <a href="${data.contact.instagram}" target="_blank" style="color:#38bdf8; text-decoration:underline;">${data.contact.instagram}</a></p>
<p>• X: <a href="${data.contact.x}" target="_blank" style="color:#38bdf8; text-decoration:underline;">${data.contact.x}</a></p>
            `;
            break;
        case 'clear':
            outputKontainer.innerHTML = '';
            return;
        case '':
            respon = '';
            break;
        default:
            respon = `<p>Perintah <span style="color:#ef4444">'${perintah}'</span> tidak terdaftar. Ketik <span style="color:#34d399">help</span> untuk melihat menu.</p>`;
    }

    // Buat elemen log baru untuk output perintah
    const barisLog = document.createElement('div');
    barisLog.style.marginBottom = '0.75rem';
    barisLog.innerHTML = `
        <p style="margin: 0; color:#fbbf24;"><span>teungku@server:~$</span> <span style="color:#ffffff">${perintah}</span></p>
        <div style="margin-top: 0.25rem; color:#f8fafc;">${respon}</div>
    `;
    outputKontainer.appendChild(barisLog);

    // Auto-scroll ke bawah secara halus tanpa forced reflow
    requestAnimationFrame(() => {
        terminalBody.scrollTop = terminalBody.scrollHeight;
    });
}