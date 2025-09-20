// ... (kode lain di atasnya biarkan saja)

function loadBlogPosts() {
    const container = document.getElementById('articles-container');
    if (!container) return; 

    container.innerHTML = '';

    if (posts.length === 0) {
        container.innerHTML = '<p>Belum ada artikel yang dipublikasikan.</p>';
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'project-card'; 
        
        // Perbarui link 'href' untuk mengarah ke article.html dengan parameter
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>Kategori: ${post.category} | Tanggal: ${post.date}</p>
            <a href="article.html?post=${post.file}" class="cta-button">Baca Selengkapnya</a>
        `;
        container.appendChild(postElement);
    });
}

// ... (sisa kode biarkan saja)
