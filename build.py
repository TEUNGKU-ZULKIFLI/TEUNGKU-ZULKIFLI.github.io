import os
import json
from datetime import datetime

# Konfigurasi
posts_directory = '_posts'
output_file = 'manifest.json'

all_posts = []

# Berjalan melalui semua folder dan file di dalam _posts
for root, dirs, files in os.walk(posts_directory):
    for filename in files:
        if filename.endswith('.md'):
            filepath = os.path.join(root, filename).replace("\\", "/")
            
            post_data = {'file': filepath} # Simpan path file

            # Buka file dan baca metadata (Front Matter)
            with open(filepath, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                if lines[0].strip() == '---':
                    in_front_matter = True
                    front_matter_lines = []
                    for line in lines[1:]:
                        if line.strip() == '---':
                            break
                        front_matter_lines.append(line)
                    
                    # Proses metadata
                    for fm_line in front_matter_lines:
                        key, value = fm_line.split(':', 1)
                        key = key.strip()
                        value = value.strip()
                        # Jika value adalah list (untuk tags)
                        if value.startswith('[') and value.endswith(']'):
                            post_data[key] = [tag.strip() for tag in value[1:-1].split(',')]
                        else:
                            post_data[key] = value.strip('"\'') # Hapus tanda kutip

            all_posts.append(post_data)

# Urutkan artikel dari yang paling baru berdasarkan tanggal
all_posts.sort(key=lambda x: datetime.strptime(x.get('date', '1970-01-01'), '%Y-%m-%d'), reverse=True)

# Tulis hasilnya ke file manifest.json
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(all_posts, f, indent=4, ensure_ascii=False)

print(f"✅ Sukses! {len(all_posts)} artikel telah diproses ke dalam {output_file}")
