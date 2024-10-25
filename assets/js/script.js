document.addEventListener('DOMContentLoaded', function () {
    const aboutLink = document.querySelector('.nav-link[data-link="about"]');
    const projectLink = document.querySelector('.nav-link[data-link="project"]');
    const contactLink = document.querySelector('.nav-link[data-link="contact"]');
    const aboutWindow = document.getElementById('about-window');
    const projectWindow = document.getElementById('project-window');
    const contactWindow = document.getElementById('contact-window');

    // Function to show window
    function showWindow(windowElement) {
        hideAllWindows();
        windowElement.style.display = 'block';
        windowElement.classList.add('fade-in');
    }

    // Function to hide all windows
    function hideAllWindows() {
        [aboutWindow, projectWindow, contactWindow].forEach(window => {
            window.style.display = 'none';
            window.classList.remove('fade-in');
        });
    }

    // Event listeners for navigation links
    aboutLink.addEventListener('click', () => showWindow(aboutWindow));
    projectLink.addEventListener('click', () => showWindow(projectWindow));
    contactLink.addEventListener('click', () => showWindow(contactWindow));

    // Event listeners for window controls
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', hideAllWindows);
    });

    document.querySelectorAll('.minimize').forEach(minimizeBtn => {
        minimizeBtn.addEventListener('click', (event) => {
            const windowElement = event.target.closest('.app-window');
            windowElement.style.display = 'none';
        });
    });

    document.querySelectorAll('.fullscreen').forEach(fullscreenBtn => {
        fullscreenBtn.addEventListener('click', (event) => {
            const windowElement = event.target.closest('.app-window');
            if (windowElement.classList.contains('fullscreen')) {
                windowElement.style.width = '400px';
                windowElement.classList.remove('fullscreen');
            } else {
                windowElement.style.width = '100vw';
                windowElement.classList.add('fullscreen');
            }
        });
    });
});
