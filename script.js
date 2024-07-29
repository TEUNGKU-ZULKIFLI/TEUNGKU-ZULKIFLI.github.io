let currentIndex = 0;
const items = document.querySelectorAll('.highlight-item');
const totalItems = items.length;

function showNextItem() {
    currentIndex = (currentIndex + 1) % totalItems;
    const offset = -currentIndex * 100;
    document.querySelector('.carousel').style.transform = `translateX(${offset}%)`;
}

setInterval(showNextItem, 3000);