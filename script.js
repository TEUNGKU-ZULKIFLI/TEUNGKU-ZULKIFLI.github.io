// Untuk membuat animasi pada nama
document.addEventListener('DOMContentLoaded', function () {
    var nama = document.querySelector('.nama');
    nama.style.opacity = 0;
    nama.style.transform = 'translateY(50px)';

    setTimeout(function () {
        nama.style.opacity = 1;
        nama.style.transform = 'translateY(0)';
    }, 500);
});

// Mendapatkan elemen gambar dan overlay teks
const profil = document.getElementById('profil');
const overlayText = document.getElementById('overlayText');

// Menambahkan event listener untuk event hover
profil.addEventListener('mouseenter', function () {
    // Menampilkan overlay teks ketika dihover
    overlayText.style.display = 'block';
});

profil.addEventListener('mouseleave', function () {
    // Menyembunyikan overlay teks ketika tidak dihover
    overlayText.style.display = 'none';
});
