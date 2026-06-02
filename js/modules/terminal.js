/* ========================================================================
   MODUL CONTROLLER: TERMINAL (js/modules/terminal.js)
   Mengurus logika interaksi command-line, logs, dan dynamic responses.
======================================================================== */

export function inisialisasiTerminal(data) {
    const commandInput = document.getElementById('terminal-command-input');
    const terminalScreen = document.getElementById('terminal-screen');
    
    // Pengaman DOM: segera hentikan jika elemen tidak terdeteksi di halaman aktif
    if (!commandInput || !terminalScreen) return;

    // Otomatis fokus ke input teks saat seluruh area hitam terminal diklik
    terminalScreen.addEventListener('click', () => {
        commandInput.focus();
    });

    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = commandInput.value.trim().toLowerCase();
            prosesSistemPerintah(command, data);
            commandInput.value = ''; // Kosongkan baris ketikan kembali
        }
    });
}

function prosesSistemPerintah(perintah, data) {
    const logOutput = document.querySelector('.terminal-log-output');
    const terminalScreen = document.getElementById('terminal-screen');
    if (!logOutput || !terminalScreen) return;

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
            respon = `<p><strong>Keahlian Teknis:</strong> ${data.skills.join(', ')}</p>`;
            break;
        case 'project':
            respon = data.projects.map(p => `
                <p style="margin-bottom:0.5rem;">• <strong style="color:#34d399">${p.title}</strong><br>
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
            logOutput.innerHTML = '';
            return;
        case '':
            respon = '';
            break;
        default:
            respon = `<p>Perintah <span style="color:#ef4444">'${perintah}'</span> tidak dikenali. Ketik <span style="color:#34d399">help</span> untuk menu.</p>`;
    }

    // Buat elemen baris log baru untuk menampung baris perintah
    const barisLogBaru = document.createElement('div');
    barisLogBaru.style.marginBottom = '0.75rem';
    barisLogBaru.innerHTML = `
        <p style="margin: 0; color:#fbbf24;"><span>teungku@server:~$</span> <span style="color:#ffffff">${perintah}</span></p>
        <div style="margin-top: 0.25rem;">${respon}</div>
    `;
    logOutput.appendChild(barisLogBaru);

    // Auto-scroll ke bawah secara halus
    requestAnimationFrame(() => {
        terminalScreen.scrollTop = terminalScreen.scrollHeight;
    });
}