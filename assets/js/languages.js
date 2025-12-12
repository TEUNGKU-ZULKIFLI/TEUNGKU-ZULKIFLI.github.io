const languages = {
    id: {
        // Komponen Umum
        common: {
            navHome: "Beranda",
            navAbout: "Tentang",
            navContact: "Kontak",
            navProjects: "Proyek",
            navBlog: "Blog",
        },
        // Teks khusus per halaman
        pages: {
            home: {
                heroTitle: "Hi 👋, Saya TEUNGKU ZULKIFLI",
                heroSubtitle: "Mahasiswa Teknologi Komputer & Jaringan | Web & Mobile Developer",
                heroPersonal: "Kaleuh pajoeh 🍚bue?",
                heroButton: "Lihat Proyek Saya",
                aboutTitle: "Tentang Saya",
                aboutIntro: "Mahasiswa Teknologi Rekayasa Komputer dan Jaringan (IPK 3.62) dengan minat mendalam pada pengembangan web & mobile, jaringan, dan IoT. Saya terbiasa beradaptasi cepat dengan teknologi baru dan aktif memanfaatkan AI untuk mempercepat riset dan pengembangan solusi kreatif.",
                downloadCV_ID: "Unduh CV (ID)",
                downloadCV_EN: "Unduh CV (EN)",
                philosophyTitle: "Filosofi & Misi Saya",
                philosophyText: "Misi saya adalah membangun solusi digital yang tidak hanya berfungsi, tetapi juga intuitif dan efisien. Saya percaya dalam memanfaatkan kekuatan otomasi dan AI untuk mempercepat proses pengembangan, memungkinkan saya untuk fokus pada pemecahan masalah inti dan menciptakan produk yang berdampak positif.",
                skillsTitle: "Keahlian Teknis & Kompetensi",
                skillsText: "Perjalanan saya di dunia teknologi didorong oleh rasa ingin tahu yang tak pernah padam. Berikut adalah beberapa keahlian yang saya kembangkan:",
                certsTitle: "Validasi & Sertifikasi Unggulan",
                certsText: "Saya percaya pada pembelajaran berkelanjutan dan validasi pengetahuan melalui sertifikasi yang diakui.",
                contactTitle: "Terhubung Dengan Saya",
                contactText: "Saya selalu terbuka untuk diskusi, kolaborasi, atau sekadar menyapa. Pilih cara yang paling sesuai untuk Anda.",
                contactRecruiterTitle: "Untuk Perekrut",
                contactRecruiterText: "Tertarik untuk menawarkan kesempatan? Saya siap untuk tantangan baru. Silakan hubungi saya melalui email.",
                contactCollabTitle: "Untuk Kolaborasi",
                contactCollabText: "Punya ide proyek yang menarik? Mari kita diskusikan bagaimana kita bisa bekerja sama. Lihat kode saya di GitHub.",
                contactConnectTitle: "Tetap Terhubung",
                contactConnectText: "Ikuti perjalanan profesional saya dan mari bertukar pikiran lebih lanjut melalui LinkedIn.",
            },
            projects: {
                pageTitle: "Proyek - TEUNGKU ZULKIFLI",
                mainTitle: "Galeri Proyek",
                introText: "Kumpulan karya yang mencerminkan perjalanan teknis saya, mulai dari solusi IoT hingga aplikasi mobile dan web.",
                techStack: "Teknologi:",
                codeButton: "Lihat Kode",
                demoButton: "Lihat Live",
                projectDetailButton: "Lihat Detail",

                // --- TIER 1: FEATURED PROJECTS ---
                smartBinTitle: "SmartBin - IoT Waste Management",
                smartBinDesc: "Sistem tempat sampah pintar berbasis IoT yang terintegrasi dengan sensor ultrasonik & ESP8266 untuk memonitor kapasitas sampah secara realtime ke dashboard Laravel.",
                
                finTrackTitle: "Apok FinTrack - Manajemen Keuangan",
                finTrackDesc: "Aplikasi mobile (Flutter) untuk mencatat arus kas harian, manajemen kartu, dan visualisasi data keuangan pribadi.",
                
                attcTitle: "Aceh Ticket Travel Car (ATTC)",
                attcDesc: "Platform reservasi tiket travel mobil berbasis mobile. Memudahkan pencarian rute, cek ketersediaan, dan booking tiket antar kota.",
                
                apotekTitle: "Sistem Manajemen Poliklinik/Apotek",
                apotekDesc: "Aplikasi manajemen data obat, staf, dan pasien menggunakan Flutter dan Firebase sebagai backend realtime.",

                // --- TIER 2: WEB & SYSTEM ---
                tier2Title: "Sistem & Web Eksperimental",
                tier2Desc: "Eksplorasi mendalam dalam pengembangan web, backend system, dan keamanan.",

                osApokTitle: "OS-APOK (Web Portfolio)",
                osApokDesc: "Eksperimen frontend unik yang mensimulasikan antarmuka Sistem Operasi di dalam browser menggunakan HTML, CSS, dan JS murni.",
                
                authSystemTitle: "Sistem Autentikasi Laravel JWT",
                authSystemDesc: "Backend service yang aman mengimplementasikan Login, Register, dan manajemen token JWT (JSON Web Token).",
                
                craftTitle: "Teungku Craft - E-Commerce",
                craftDesc: "Website toko online statis yang responsif dengan dukungan multi-bahasa dasar.",

                // --- TIER 3: LABS & EXPERIMENTS ---
                tier3Title: "Laboratorium Kode (The Lab)",
                tier3Desc: "Kumpulan eksperimen kecil, latihan logika, dan eksplorasi widget UI (Flutter & Lainnya).",

                flutterLabTitle: "Flutter UI & Logic Lab",
                flutterLabDesc: "Kumpulan 18+ eksperimen modul Flutter termasuk: Logika Algoritma, Custom Widgets (Drawer, Stepper), REST API Integration, dan SQLite CRUD.",
                
                iotJourneyTitle: "IoT & IoRT Journey",
                iotJourneyDesc: "Dokumentasi perjalanan belajar dan eksperimen dalam Internet of Things dan Robotika.",
            },
            blog: {
                pageTitle: "Blog - TEUNGKU ZULKIFLI",
                mainTitle: "Blog & Catatan",
                introText: "Tempat saya berbagi tutorial, catatan kuliah, dan hal-hal menarik lainnya.",
            }
        }
    },
    en: {
        // Common components
        common: {
            navHome: "Home",
            navAbout: "About",
            navContact: "Contact",
            navProjects: "Projects",
            navBlog: "Blog",
        },
        // Page-specific text
        pages: {
            home: {
                heroTitle: "Hi 👋, I'm TEUNGKU ZULKIFLI",
                heroSubtitle: "Computer & Network Engineering Student | Web & Mobile Developer",
                heroPersonal: "Have you eaten rice? 🍚",
                heroButton: "View My Projects",
                aboutTitle: "About Me",
                aboutIntro: "Computer and Network Engineering student (GPA 3.62) with a deep interest in web & mobile development, networking, and IoT. I quickly adapt to new technologies and actively leverage AI to accelerate research and develop creative solutions.",
                downloadCV_ID: "Download CV (ID)",
                downloadCV_EN: "Download CV (EN)",
                philosophyTitle: "My Philosophy & Mission",
                philosophyText: "My mission is to build digital solutions that are not only functional but also intuitive and efficient. I believe in leveraging the power of automation and AI to speed up the development process, allowing me to focus on core problem-solving and creating impactful products.",
                skillsTitle: "Technical Skills & Competencies",
                skillsText: "My journey in technology is driven by a relentless curiosity. Here are some of the skills I've developed:",
                certsTitle: "Key Validations & Certifications",
                certsText: "I believe in continuous learning and validating knowledge through recognized certifications.",
                contactTitle: "Connect With Me",
                contactText: "I'm always open to discussions, collaborations, or just a friendly hello. Choose the way that suits you best.",
                contactRecruiterTitle: "For Recruiters",
                contactRecruiterText: "Interested in offering an opportunity? I'm ready for new challenges. Please feel free to contact me via email.",
                contactCollabTitle: "For Collaboration",
                contactCollabText: "Have an interesting project idea? Let's discuss how we can work together. Check out my code on GitHub.",
                contactConnectTitle: "Stay Connected",
                contactConnectText: "Follow my professional journey and let's exchange more ideas on LinkedIn.",
            },
            projects: {
                pageTitle: "Projects - TEUNGKU ZULKIFLI",
                mainTitle: "Project Gallery",
                introText: "A collection of works that reflect my technical journey, from IoT solutions to mobile and web applications.",
                techStack: "Technology:",
                codeButton: "View Code",
                demoButton: "View Live",
                projectDetailButton: "View Details",

                // --- TIER 1: FEATURED PROJECTS ---
                smartBinTitle: "SmartBin - IoT Waste Management",
                smartBinDesc: "IoT-based smart trash can system integrated with ultrasonic sensors & ESP8266 to monitor trash capacity in real time to the Laravel dashboard.",
                
                finTrackTitle: "Apok FinTrack - Finance Tracker",
                finTrackDesc: "Mobile app (Flutter) for recording daily cash flow, card management, and visualization of personal financial data.",
                
                attcTitle: "Aceh Ticket Travel Car (ATTC)",
                attcDesc: "A mobile-based car travel ticket reservation platform. Simplifying route searches, checking availability, and booking intercity tickets.",
                
                apotekTitle: "Polyclinic/Pharmacy Management System",
                apotekDesc: "Drug, staff, and patient data management application using Flutter and Firebase as a real-time backend.",

                // --- TIER 2: WEB & SYSTEM ---
                tier2Title: "Experimental Systems & Web",
                tier2Desc: "Deep exploration in web development, backend systems, and security.",

                osApokTitle: "OS-APOK (Web Portfolio)",
                osApokDesc: "A unique frontend experiment that simulates an Operating System interface inside the browser using pure HTML, CSS and JS.",
                
                authSystemTitle: "Laravel JWT Authentication System",
                authSystemDesc: "Secure backend service implementing Login, Register, and JWT (JSON Web Token) token management.",
                
                craftTitle: "Teungku Craft - E-Commerce",
                craftDesc: "Responsive static online store website with basic multi-language support.",

                // --- TIER 3: LABS & EXPERIMENTS ---
                tier3Title: "Code Laboratory (The Lab)",
                tier3Desc: "A collection of small experiments, logic exercises, and UI widget explorations (Flutter & Others).",

                flutterLabTitle: "Flutter UI & Logic Lab",
                flutterLabDesc: "A collection of 18+ Flutter module experiments including: Algorithm Logic, Custom Widgets (Drawer, Stepper), REST API Integration, and SQLite CRUD.",
                
                iotJourneyTitle: "IoT & IoRT Journey",
                iotJourneyDesc: "Documentation of learning journey and experiments in Internet of Things and Robotics.",
            },
            blog: {
                pageTitle: "Blog - TEUNGKU ZULKIFLI",
                mainTitle: "Blog & Notes",
                introText: "A place where I share tutorials, lecture notes, and other interesting things.",
            }
        }
    }
};