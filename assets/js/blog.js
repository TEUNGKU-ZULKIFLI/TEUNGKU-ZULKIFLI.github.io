const owner = 'TEUNGKU-ZULKIFLI';
const repo = 'TEUNGKU-ZULKIFLI.github.io';
const path = 'blog';

async function listPosts() {
  const api = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const res = await fetch(api);
  const ul = document.getElementById('posts-list');

  if (!res.ok) {
    ul.innerHTML = '<li>Tidak bisa mengambil daftar post.</li>';
    return;
  }

  const files = await res.json();
  const mdFiles = files
    .filter(f => f.name.endsWith('.md'))
    .sort((a, b) => b.name.localeCompare(a.name));

  ul.innerHTML = '';
  mdFiles.forEach(f => {
    const name = f.name.replace('.md', '');
    const parts = name.split('-');
    const date = parts.slice(0, 3).join('-');
    const title = parts.slice(3).join(' ').replace(/\b\w/g, c => c.toUpperCase());

    const li = document.createElement('li');
    li.className = 'post-item';
    li.innerHTML = `<a href="#" data-download="${f.download_url}">
                      <strong>${title}</strong> <small>${date}</small>
                    </a>`;
    ul.appendChild(li);
  });

  ul.addEventListener('click', async (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    e.preventDefault();
    await loadPost(a.dataset.download);
  });
}

async function loadPost(rawUrl) {
  const res = await fetch(rawUrl);
  const md = await res.text();
  const content = md.replace(/^---[\s\S]*?---\s*/, ''); // hapus YAML frontmatter
  document.getElementById('post-content').innerHTML = marked.parse(content);
  document.getElementById('list-view').style.display = 'none';
  document.getElementById('post-view').style.display = 'block';
  window.scrollTo(0, 0);
}

document.getElementById('back').addEventListener('click', () => {
  document.getElementById('post-view').style.display = 'none';
  document.getElementById('list-view').style.display = 'block';
});

document.addEventListener('DOMContentLoaded', listPosts);
