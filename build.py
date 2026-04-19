"""
build.py v2.0 (MINIMAL VERSION)
Static Site Generator untuk teungku.me

Author: Teungku Zulkifli (with AI guidance)
Purpose: Convert Markdown blog posts to HTML

Usage:
    python3 build.py

Pipeline:
    _posts/**/*.md  →  posts/**/*.html
"""

# ============================================================
# IMPORT LIBRARY
# ============================================================
# Library standar Python (sudah ada di Python 3)
import os                  # Untuk operasi file/folder
import shutil              # Untuk hapus folder
from pathlib import Path   # Untuk path yang cross-platform (Windows/Linux)
from datetime import datetime  # Untuk handle tanggal

# Library third-party (kita install via pip)
import frontmatter         # Parser YAML metadata di .md
import markdown            # Converter Markdown → HTML
from jinja2 import Environment, FileSystemLoader  # Template engine


# ============================================================
# KONFIGURASI
# ============================================================
# Path semua dibuat sebagai Path object (lebih reliable)
ROOT_DIR = Path(__file__).parent.resolve()  # Folder dimana script ini berada
POSTS_INPUT_DIR = ROOT_DIR / "_posts"        # Sumber: file .md
POSTS_OUTPUT_DIR = ROOT_DIR / "posts"        # Output: file .html
TEMPLATES_DIR = ROOT_DIR / "templates"  # Folder template Jinja2

# Setup Jinja2 environment
jinja_env = Environment(
    loader=FileSystemLoader(TEMPLATES_DIR),
    trim_blocks=True,        # Bersihkan whitespace setelah block tag
    lstrip_blocks=True,      # Bersihkan whitespace sebelum block tag
)

# Konfigurasi situs (akan dipakai di template)
SITE_CONFIG = {
    'site_name': 'Teungku Zulkifli',
    'site_description': 'Portofolio dan blog Teungku Zulkifli - Mahasiswa Teknologi Komputer & Jaringan',
    'site_author': 'Teungku Zulkifli',
    'site_url': 'https://teungku.me',
    'current_year': datetime.now().year,
}

# Konfigurasi markdown extensions
# Ini menambah fitur: code blocks, tables, dll
MARKDOWN_EXTENSIONS = [
    'fenced_code',    # Support ```code``` block
    'tables',         # Support markdown tables
    'toc',            # Generate table of contents
    'attr_list',      # Support {.class} di markdown
    'meta',           # Parse metadata (kita pakai frontmatter, ini cadangan)
    'sane_lists',     # List behavior yang lebih konsisten
    'smarty',         # Smart quotes (curly quotes)
]


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def print_header(text):
    """Cetak header cantik di terminal."""
    print(f"\n{'=' * 60}")
    print(f"  {text}")
    print(f"{'=' * 60}\n")


def print_step(emoji, text):
    """Cetak step dengan emoji."""
    print(f"  {emoji}  {text}")


def clean_output_dir():
    """
    Hapus folder output lama, lalu buat baru.
    Ini memastikan tidak ada file 'sampah' dari build sebelumnya.
    """
    if POSTS_OUTPUT_DIR.exists():
        shutil.rmtree(POSTS_OUTPUT_DIR)
        print_step("🗑️ ", f"Hapus folder output lama: {POSTS_OUTPUT_DIR.name}/")
    
    POSTS_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print_step("📁", f"Buat folder output baru: {POSTS_OUTPUT_DIR.name}/")


def find_all_markdown_files():
    """
    Cari semua file .md di folder _posts/ secara rekursif.
    Returns: list of Path objects
    """
    md_files = list(POSTS_INPUT_DIR.rglob("*.md"))
    print_step("🔍", f"Ditemukan {len(md_files)} file .md di {POSTS_INPUT_DIR.name}/")
    return md_files


def parse_markdown_file(md_file_path):
    """
    Parse satu file markdown.
    Returns: dictionary dengan metadata + html content
    
    Contoh return:
    {
        'title': 'Judul Artikel',
        'date': '2025-09-23',
        'category': 'Course',
        'tags': ['debian', 'server'],
        'html_content': '<h1>...</h1><p>...</p>',
        'source_path': PosixPath('_posts/debian/xxx.md'),
        'output_path': PosixPath('posts/debian/xxx.html'),
        'url_path': 'posts/debian/xxx.html'
    }
    """
    # Baca file dan parse frontmatter
    with open(md_file_path, 'r', encoding='utf-8') as f:
        post = frontmatter.load(f)
    
    # Convert markdown content ke HTML
    md = markdown.Markdown(extensions=MARKDOWN_EXTENSIONS)
    html_content = md.convert(post.content)
    
    # Hitung path output
    # Contoh: _posts/debian/file.md → posts/debian/file.html
    relative_path = md_file_path.relative_to(POSTS_INPUT_DIR)
    output_path = POSTS_OUTPUT_DIR / relative_path.with_suffix('.html')
    url_path = f"posts/{relative_path.with_suffix('.html')}"
    
    # Gabungkan semua data
    result = {
        # Metadata dari frontmatter (dengan fallback default)
        'title': post.metadata.get('title', 'Untitled'),
        'date': str(post.metadata.get('date', '1970-01-01')),
        'category': post.metadata.get('category', 'Uncategorized'),
        'tags': post.metadata.get('tags', []),
        'author': post.metadata.get('author', 'Teungku Zulkifli'),
        'description': post.metadata.get('description', ''),
        
        # Content
        'html_content': html_content,
        'raw_content': post.content,
        
        # Paths
        'source_path': md_file_path,
        'output_path': output_path,
        'url_path': url_path,
    }
    
    return result


def render_html(post_data):
    """
    Render HTML pakai Jinja2 template.
    Template: templates/post.html
    """
    template = jinja_env.get_template('post.html')
    
    # Hitung asset_path: berapa kali "../" diperlukan untuk reach root
    # Contoh: posts/debian/xxx.html → 2 level dalam → "../../"
    depth = len(post_data['output_path'].relative_to(POSTS_OUTPUT_DIR).parts) - 1
    asset_path = "../" * (depth + 1)  # +1 karena kita di dalam posts/
    
    # Render template dengan data
    html = template.render(
        post=post_data,
        asset_path=asset_path,
        **SITE_CONFIG  # Spread config (site_name, dll)
    )
    
    return html


def write_html_file(post_data, html_content):
    """
    Tulis HTML ke file output.
    Otomatis buat folder kalau belum ada.
    """
    output_path = post_data['output_path']
    
    # Pastikan parent folder ada (contoh: posts/debian/)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Tulis file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)


# ============================================================
# MAIN PIPELINE
# ============================================================

def main():
    """Pipeline utama build process."""
    
    print_header("🚀 BUILD SYSTEM v2.0 - Teungku Zulkifli Site")
    
    # STEP 1: Persiapan
    print_step("📌", "STEP 1: Persiapan folder output")
    clean_output_dir()
    
    # STEP 2: Cari semua file markdown
    print_step("📌", "STEP 2: Scan file markdown")
    md_files = find_all_markdown_files()
    
    if not md_files:
        print("\n⚠️  Tidak ada file .md ditemukan. Build dibatalkan.")
        return
    
    # STEP 3: Process tiap file
    print_step("📌", f"STEP 3: Build {len(md_files)} artikel")
    print()
    
    successful = 0
    failed = 0
    failed_files = []
    
    for md_file in md_files:
        try:
            # Parse markdown
            post_data = parse_markdown_file(md_file)
            
            # Render HTML (versi minimal)
            # html = render_html_minimal(post_data)
            html = render_html(post_data)
            
            # Tulis ke file
            write_html_file(post_data, html)
            
            # Log sukses
            relative = md_file.relative_to(ROOT_DIR)
            print(f"     ✅ {relative}  →  {post_data['url_path']}")
            successful += 1
            
        except Exception as e:
            # Log error tapi lanjut ke file berikutnya
            relative = md_file.relative_to(ROOT_DIR)
            print(f"     ❌ {relative}  →  ERROR: {e}")
            failed += 1
            failed_files.append((str(relative), str(e)))
    
    # STEP 4: Summary
    print_header("📊 BUILD SUMMARY")
    print(f"  ✅ Sukses:  {successful} artikel")
    print(f"  ❌ Gagal:   {failed} artikel")
    print(f"  📁 Output:  {POSTS_OUTPUT_DIR.relative_to(ROOT_DIR)}/")
    
    if failed_files:
        print(f"\n  ⚠️  Detail file yang gagal:")
        for filepath, error in failed_files:
            print(f"     - {filepath}")
            print(f"       Error: {error}")
    
    print(f"\n  🎉 Build selesai pada {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()


# ============================================================
# ENTRY POINT
# ============================================================
if __name__ == "__main__":
    main()