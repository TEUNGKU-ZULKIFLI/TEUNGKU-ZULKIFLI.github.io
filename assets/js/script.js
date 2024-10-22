document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const loading = document.getElementById('loading');

    // Event listener for each link
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default link action

            // Show loading GIF
            loading.style.display = 'block';

            // Simulate page load with a timeout
            setTimeout(() => {
                // Hide loading GIF after "loading is done"
                loading.style.display = 'none';
                // Navigate to the link or perform other actions
                window.location.href = link.href;
            }, 8000);
        });
    });
});
