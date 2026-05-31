/* ========================================================================
   MODUL LATAR BELAKANG INTERAKTIF - PARTIKEL JARINGAN (Vanilla JS Canvas)
   Menggambar jaringan node dinamis yang bereaksi dengan kursor mouse.
======================================================================== */

export function inisialisasiLatarBelakang() {
    // Cari atau buat elemen canvas
    let canvas = document.getElementById('network-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'network-canvas';
        canvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none; opacity: 0.15; transition: opacity var(--transition-normal);';
        document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let partikel = [];
    const maxPartikel = 60;
    const jarakKoneksi = 120;
    
    // Posisi Mouse pelacak
    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Menyesuaikan ukuran canvas terhadap viewport browser
    function aturUkuran() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    aturUkuran();
    window.addEventListener('resize', aturUkuran);

    // Representasi Objek Partikel Node
    class NodePartikel {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5; // Kecepatan gerak lambat arah X
            this.vy = (Math.random() - 0.5) * 0.5; // Kecepatan gerak lambat arah Y
            this.radius = Math.random() * 2 + 1.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Batas pantulan layar
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Interaksi gaya tolak dari kursor mouse
            if (mouse.x !== null && mouse.y !== null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let jarak = Math.hypot(dx, dy);
                if (jarak < mouse.radius) {
                    let gaya = (mouse.radius - jarak) / mouse.radius;
                    let sudut = Math.atan2(dy, dx);
                    this.x += Math.cos(sudut) * gaya * 2;
                    this.y += Math.sin(sudut) * gaya * 2;
                }
            }
        }

        draw() {
            // Menyesuaikan warna partikel berdasarkan class tema sistem (light/dark)
            const isDark = document.documentElement.classList.contains('dark');
            ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Inisialisasi awal partikel
    function buatPartikel() {
        partikel = [];
        for (let i = 0; i < maxPartikel; i++) {
            partikel.push(new NodePartikel());
        }
    }
    buatPartikel();

    // Loop animasi rendering
    function jalankanAnimasi() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const isDark = document.documentElement.classList.contains('dark');
        const warnaGaris = isDark ? '56, 189, 248' : '2, 132, 199';

        for (let i = 0; i < partikel.length; i++) {
            partikel[i].update();
            partikel[i].draw();

            // Hubungkan garis antar partikel yang berdekatan
            for (let j = i + 1; j < partikel.length; j++) {
                let dx = partikel[i].x - partikel[j].x;
                let dy = partikel[i].y - partikel[j].y;
                let jarak = Math.hypot(dx, dy);

                if (jarak < jarakKoneksi) {
                    // Semakin dekat jarak, garis semakin solid (transparansi dinamis)
                    let alfa = (jarakKoneksi - jarak) / jarakKoneksi * 0.18;
                    ctx.strokeStyle = `rgba(${warnaGaris}, ${alfa})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(partikel[i].x, partikel[i].y);
                    ctx.lineTo(partikel[j].x, partikel[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(jalankanAnimasi);
    }
    jalankanAnimasi();
}