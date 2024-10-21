document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const loading = document.getElementById('loading');

    // Event listener untuk setiap link
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Mencegah action default link

            // Tampilkan GIF loading
            loading.style.display = 'block';

            // Simulasi pemuatan halaman dengan timeout
            setTimeout(() => {
                // Sembunyikan GIF setelah "pemuatan selesai"
                loading.style.display = 'none';
                // Arahkan ke halaman atau lakukan action lainnya
                // alert('Navigating to ' + link.dataset.link);
            }, 8000); // Waktu tunggu 2 detik (bisa disesuaikan)
        });
    });
});
