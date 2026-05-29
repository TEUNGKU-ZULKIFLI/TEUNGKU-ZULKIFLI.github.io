#!/usr/bin/env python3
import os
import json
import re
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer
import sys

# Konfigurasi Path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS_DIR = os.path.join(BASE_DIR, "_posts")
OUTPUT_JSON = os.path.join(POSTS_DIR, "posts-index.json")

def extract_youtube_id(url):
    """
    Ekstrak ID unik dari berbagai format URL YouTube.
    Contoh: 'https://youtu.be/p4zs7A_xUks' -> 'p4zs7A_xUks'
    """
    if not url:
        return ""
    url = url.strip().strip('"').strip("'")
    pattern = r'(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})'
    match = re.search(pattern, url)
    return match.group(1) if match else url

def parse_front_matter(file_path):
    """
    Membaca blok metadata YAML di awal file markdown.
    Mendukung format youtube_id dalam bentuk teks tunggal atau array/list.
    """
    metadata = {
        "title": os.path.basename(file_path).replace(".md", "").replace("-", " ").title(),
        "date": "1970-01-01",
        "tags": [],
        "excerpt": "Baca artikel selengkapnya.",
        "youtube_ids": []
    }
    
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Regex mendeteksi blok --- ... ---
        match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
        if match:
            front_matter_text = match.group(1)
            
            # Kita lakukan parsing baris per baris secara hati-hati
            lines = front_matter_text.split("\n")
            in_youtube_list = False
            
            for line in lines:
                line_str = line.strip()
                if not line_str:
                    continue
                
                # Deteksi jika list youtube_id bertipe baris baru (YAML list)
                if line_str.startswith("-") and in_youtube_list:
                    val = line_str.replace("-", "", 1).strip()
                    extracted = extract_youtube_id(val)
                    if extracted:
                        metadata["youtube_ids"].append(extracted)
                    continue
                
                if ":" in line_str:
                    key, value = line_str.split(":", 1)
                    key = key.strip().lower()
                    value = value.strip()
                    
                    if key == "title":
                        metadata["title"] = value.strip('"').strip("'")
                    elif key == "date":
                        metadata["date"] = value.strip('"').strip("'")
                    elif key == "excerpt":
                        metadata["excerpt"] = value.strip('"').strip("'")
                    elif key == "tags":
                        # Bersihkan format array [tag1, tag2]
                        cleaned_val = value.replace("[", "").replace("]", "")
                        metadata["tags"] = [t.strip().strip('"').strip("'") for t in cleaned_val.split(",") if t.strip()]
                    elif key == "youtube_id":
                        # Deteksi jika bertipe inline array [url1, url2]
                        if value.startswith("[") and value.endswith("]"):
                            urls = value.replace("[", "").replace("]", "").split(",")
                            for url in urls:
                                extracted = extract_youtube_id(url)
                                if extracted:
                                    metadata["youtube_ids"].append(extracted)
                        else:
                            # Jika hanya URL tunggal
                            extracted = extract_youtube_id(value)
                            if extracted:
                                metadata["youtube_ids"].append(extracted)
                            # Flag jika di baris selanjutnya ada baris list (-)
                            in_youtube_list = True
        
    except Exception as e:
        print(f"Gagal memproses metadata file: {file_path}. Error: {e}")
        
    return metadata

def generate_index():
    """
    Memindai semua kategori di dalam _posts/ dan membuat file posts-index.json
    """
    print("🧹 Memulai proses indeksing file markdown...")
    blog_data = {}

    if not os.path.exists(POSTS_DIR):
        print(f"Error: Folder {POSTS_DIR} tidak ditemukan!")
        sys.exit(1)

    # Ambil semua sub-folder kategori
    categories = [d for d in os.listdir(POSTS_DIR) if os.path.isdir(os.path.join(POSTS_DIR, d))]
    
    for category in sorted(categories):
        category_path = os.path.join(POSTS_DIR, category)
        blog_data[category] = []
        
        for file in sorted(os.listdir(category_path)):
            if file.endswith(".md"):
                file_path = os.path.join(category_path, file)
                meta = parse_front_matter(file_path)
                
                # Alamat relatif untuk fetch sisi klien
                relative_path = f"_posts/{category}/{file}"
                
                blog_data[category].append({
                    "filename": file,
                    "filepath": relative_path,
                    "title": meta["title"],
                    "date": meta["date"],
                    "tags": meta["tags"],
                    "excerpt": meta["excerpt"],
                    "youtube_ids": meta["youtube_ids"]
                })
                
        blog_data[category].sort(key=lambda x: x["date"], reverse=True)
        print(f"✓ Kategori '{category}': {len(blog_data[category])} artikel terindeks.")

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(blog_data, f, indent=4, ensure_ascii=False)
        
    print(f"\n✨ Sukses! Indeks blog disimpan di: {OUTPUT_JSON}\n")

def run_server(port=8000):
    """
    Menjalankan local development server tanpa caching browser
    """
    os.chdir(BASE_DIR)
    
    class NoCacheHTTPRequestHandler(SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            super().end_headers()

    print(f"🚀 Server lokal aktif di: http://localhost:{port}")
    print("Tekan Ctrl+C untuk mematikan server.")
    
    TCPServer.allow_reuse_address = True
    with TCPServer(("", port), NoCacheHTTPRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer dihentikan.")
            sys.exit(0)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Penggunaan CLI:")
        print("  python3 core_scripts/manage.py index   -> Jalankan auto-index")
        print("  python3 core_scripts/manage.py serve   -> Jalankan server dev")
        print("  python3 core_scripts/manage.py all     -> Jalankan keduanya")
        sys.exit(1)
        
    action = sys.argv[1].lower()
    
    if action == "index":
        generate_index()
    elif action == "serve":
        run_server()
    elif action == "all":
        generate_index()
        run_server()