/* ==========================================================================
   config.js — SEMUA ISI WEBSITE DIATUR DI SINI
   Kamu cukup edit file ini. Jangan sentuh app.js kecuali mau ubah fitur.

   Cara pakai singkat:
   - Baris yang diawali // adalah contoh. Hapus // lalu ganti isinya.
   - Taruh gambar/lagu di folder, lalu tulis path-nya, misal "photos/ig/1.jpg".
   - Nama file harus SAMA PERSIS (huruf besar-kecil juga) karena GitHub Pages peka.
   - "ago" artinya "berapa menit yang lalu". ago: 90 = 1,5 jam lalu.
   ========================================================================== */

const CONFIG = {
  siteName: "onriwishville",   // judul tab + tulisan kecil di lock screen
  igName: "wishgram",          // nama + logo aplikasi Instagram

  /* ======================== LOCKSCREEN ======================== */
  // Wallpaper: taruh gambar di folder "wallpaper/", lalu tulis path-nya.
  // Kalau salah satu dikosongin, dia pakai yang satunya. Dua-duanya kosong = gradien ungu-pink.
  // Saran: foto vertikal (rasio HP), contoh 1170x2532.
  wallpaperLock: "wallpaper/lock.jpg",   // taruh fotonya di folder wallpaper/
  wallpaperHome: "wallpaper/home.jpg",

  // Kode sandi 4 angka. Kosongkan ("") kalau nggak mau pakai passcode.
  // Catatan: ini cuma gaya-gayaan, bukan keamanan sungguhan (isinya bisa dilihat lewat view-source).
  passcode: "1121",

  // Notifikasi yang tampil di lockscreen sebelum dibuka. Pesannya juga masuk ke chat-nya.
  // text = isi pesan, ago = berapa menit yang lalu. Tap notifikasi -> minta passcode -> buka chat.
  lockNotifications: [
    { from: "rrikulvv", text: "Pesan baru", ago: 2 },   // GANTI text dengan isi pesan yang kamu mau
  ],

  /* ======================== INSTAGRAM ======================== */

  // Akun milik kamu (muncul di tab profil + "Cerita kamu")
  me: {
    username: "osion.nn",
    avatar: "",                // contoh: "photos/avatar/osion.jpg" (kosong = huruf awal)
    bio: "",
    followers: "0",
    following: "0",
    stories: [                 // foto story kamu, urut dari yang pertama
      // "photos/story/osion1.jpg",
    ]
  },

  // Akun-akun yang muncul di beranda (urutan = urutan story)
  accounts: [
    { username: "rriku.maeda", avatar: "", stories: [] },
    { username: "daeyoung.j",  avatar: "", stories: [] },
    { username: "tknoyuu",     avatar: "", stories: [] },
    { username: "hiro.seryo",  avatar: "", stories: [] },
    { username: "f.sakuuy",    avatar: "", stories: [] }
  ],
  // contoh isi story:  stories: ["photos/story/riku1.jpg", "photos/story/riku2.jpg"]

  // Postingan di beranda, urut dari atas. user = salah satu username di atas.
  // Kalau dikosongin, beranda menampilkan kotak placeholder.
  posts: [
    // { user: "rriku.maeda", img: "photos/ig/1.jpg", caption: "isi caption", likes: 120 },
    // { user: "osion.nn",    img: "photos/ig/2.jpg", caption: "",            likes: 98  },
  ],

  /* ======================== PESAN (iMessage) ======================== */

  // id dipakai di bagian lain (incoming, calls). name = nama yang tampil.
  chats: [
    {
      id: "rrikulvv", name: "rrikulvv", avatar: "",
      messages: [
        // { me: false, text: "halo", ago: 60 },   // me:false = pesan masuk
        // { me: true,  text: "hai",  ago: 58 },   // me:true  = pesan darimu
      ],
      // BALASAN OTOMATIS: tiap kali pengunjung kirim pesan di chat ini,
      // balasan dikeluarkan BERURUTAN dari daftar ini (habis -> mulai lagi dari awal).
      replies: [
        // "iya?", "hehe", "nanti ya",
      ]
    },
    { id: "sakusaku", name: "sakusaku", avatar: "", messages: [], replies: [] },
    { id: "daengje",  name: "daengje",  avatar: "", messages: [], replies: [] },
    { id: "yuchi",    name: "yuchi",    avatar: "", messages: [], replies: [] },
    { id: "ryose",    name: "ryose",    avatar: "", messages: [], replies: [] }
  ],

  // PESAN MASUK OTOMATIS: muncul sebagai notifikasi di atas layar,
  // "after" detik setelah pengunjung membuka kunci layar.
  incoming: [
    { from: "rrikulvv", text: "lagi apa?",        after: 15 },   // GANTI isinya sesukamu
    { from: "sakusaku", text: "jangan lupa ya",   after: 40 },
    { from: "rrikulvv", text: "kangen tau 🥺",     after: 75 },
  ],

  /* ======================== CATATAN ======================== */
  // Baris pertama = judul catatan.
  notes: [
    { text: "Untuk Riku 💌\nKalau aku bisa milih satu hal yang bikin hariku selalu baik, jawabannya kamu. Dari dulu sampai sekarang, selalu kamu.", ago: 20 },
    { text: "Hal-hal yang aku suka dari kamu\n1. Cara kamu ketawa sampai matamu hilang\n2. Suara kamu pas baru bangun tidur\n3. Cara kamu manggil namaku\n4. Semuanya, jujur aja.", ago: 95 },
    { text: "Maaf ya, Riku\nAku sering lupa bilang ini, tapi aku bersyukur banget kamu masih sabar sama aku. Aku sayang kamu lebih dari yang bisa aku tulis di sini.", ago: 400 },
    { text: "Janji kecil\nAku bakal selalu ada. Waktu kamu capek, waktu kamu senang, waktu kamu diam aja. Kamu nggak perlu jelasin apa-apa, cukup bilang 'temenin' dan aku datang.", ago: 1500 },
    { text: "Seoul, someday 🌸\nNanti kita jalan berdua ke Seoul, naik ke N Seoul Tower, makan jajanan di Myeongdong sampai kenyang. Pegang tanganku ya, jangan dilepas.", ago: 3000 },
    { text: "Aku cinta kamu, Riku\nBukan karena kamu sempurna, tapi karena bareng kamu semuanya terasa pas. Terima kasih sudah jadi rumahku.", ago: 5000 },
  ],

  /* ======================== TELEPON (log panggilan) ======================== */
  mainContact: "rrikulvv",   // kontak yang paling sering muncul di log otomatis

  // Kalau dikosongkan, log dibuat otomatis (mainContact paling banyak).
  // Kalau mau atur sendiri: type = "in" (masuk) | "out" (keluar) | "missed" (tak terjawab)
  calls: [
    { who: "rrikulvv", type: "in",     ago: 25,    duration: "42:10" },
    { who: "rrikulvv", type: "out",    ago: 140,   duration: "18:35" },
    { who: "rrikulvv", type: "missed", ago: 260 },
    { who: "sakusaku", type: "in",     ago: 330,   duration: "3:12"  },
    { who: "rrikulvv", type: "in",     ago: 600,   duration: "1:05:22" },
    { who: "daengje",  type: "missed", ago: 780 },
    { who: "rrikulvv", type: "out",    ago: 1300,  duration: "27:48" },
    { who: "rrikulvv", type: "missed", ago: 1400 },
    { who: "yuchi",    type: "out",    ago: 1700,  duration: "5:40"  },
    { who: "rrikulvv", type: "in",     ago: 2000,  duration: "52:03" },
    { who: "ryose",    type: "in",     ago: 2400,  duration: "2:21"  },
    { who: "rrikulvv", type: "out",    ago: 2900,  duration: "33:17" },
    { who: "sakusaku", type: "missed", ago: 3300 },
    { who: "rrikulvv", type: "in",     ago: 4000,  duration: "1:12:09" },
    { who: "daengje",  type: "out",    ago: 4600,  duration: "7:54"  },
    { who: "rrikulvv", type: "missed", ago: 5200 },
    { who: "rrikulvv", type: "out",    ago: 6000,  duration: "21:30" },
    { who: "yuchi",    type: "in",     ago: 7000,  duration: "9:08"  },
    { who: "ryose",    type: "missed", ago: 8000 },
    { who: "rrikulvv", type: "in",     ago: 9500,  duration: "46:55" },
  ],

  /* ======================== PETA (Seoul) ======================== */
  places: [
    { name: "Seoul (pusat kota)", note: "Ibu kota Korea Selatan", lat: 37.5665, lon: 126.9780, span: 0.10 },
    { name: "N Seoul Tower",      note: "Namsan",                  lat: 37.5512, lon: 126.9882, span: 0.02 },
    { name: "Gyeongbokgung",      note: "Istana Joseon",           lat: 37.5796, lon: 126.9770, span: 0.02 },
    { name: "Myeongdong",         note: "Belanja & jajanan",       lat: 37.5636, lon: 126.9827, span: 0.015 },
    { name: "Hongdae",            note: "Area anak muda",          lat: 37.5563, lon: 126.9236, span: 0.02 },
    { name: "Gangnam",            note: "Distrik modern",          lat: 37.4979, lon: 127.0276, span: 0.025 },
    { name: "Yeouido Hangang Park", note: "Tepi Sungai Han",       lat: 37.5283, lon: 126.9326, span: 0.025 }
  ],

  /* ======================== FOTO ======================== */
  photos: [
    // { src: "photos/foto1.jpg", caption: "Judul foto", date: "2026-10-01" },
  ],

  /* ======================== MUSIK ======================== */
  // Cara 1: file mp3 sendiri (taruh di folder "music/")
  tracks: [
    // { title: "Judul lagu", artist: "Nama artis", src: "music/lagu1.mp3", cover: "photos/cover1.jpg" },
  ],

  // Cara 2: playlist Spotify / Apple Music (ditampilkan sebagai pemutar tertanam).
  // Tempel link playlist-nya. Contoh:
  //   "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M"
  //   "https://music.apple.com/us/playlist/nama/pl.xxxxxxxx"
  // Catatan: tanpa login, pengunjung biasanya cuma dapat cuplikan 30 detik.
  playlist: ""
};
