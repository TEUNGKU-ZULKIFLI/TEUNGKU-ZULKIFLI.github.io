window.addEventListener('scroll', function() {
    var header = document.querySelector('header');
    header.classList.toggle('fixed-header', window.scrollY > 0);
});
