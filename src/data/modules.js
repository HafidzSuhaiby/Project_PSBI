export const modules = [
  {
    id: 1,
    title: "Modul 1: Class & Object 🎮",
    pages: [
      {
        // Page 1: Pengenalan Konsep Analogi
        youtubeId: "6e0NSwbKOAw", // Ganti dengan ID video pengantar Anda
        narrative: "Bayangkan kamu sedang ditugaskan menjadi desainer karakter untuk sebuah game RPG baru. Di layar, kamu butuh berbagai macam karakter: ada Ksatria, Penyihir, dan Pemanah.\n\nDaripada memprogram tubuh, kepala, dan kaki setiap karakter dari nol satu per satu (yang pastinya capek banget!), programmer cerdas akan membuat sebuah 'cetakan dasar' atau 'blueprint' terlebih dahulu. Di dunia Pemrograman Berorientasi Objek (PBO), cetakan dasar inilah yang kita sebut sebagai Class.",
        mission: "Tantangan: Mari kita pemanasan! Cetak kalimat 'Siap membuat game RPG!' ke terminal.",
        defaultCode: "# Tulis kodemu di bawah baris ini\n\n\n",
        check: "print('Siap membuat game RPG!')", // Bisa disesuaikan dengan logika validasi Anda
        successMsg: "Mantap! Terminal sudah merespon. Mari kita buat cetakan pertamamu di halaman selanjutnya."
      },
      {
        // Page 2: Membuat Class Kosong
        youtubeId: null,
        narrative: "Nah, sekarang mari kita buat cetakan dasarmu. Di Python, membuat Class itu semudah berbicara. Kita menggunakan kata kunci `class` lalu diikuti dengan nama cetakannya. \n\nOh iya, ada aturan tidak tertulis (tapi sangat dianjurkan) di kalangan programmer: **Nama sebuah Class harus diawali dengan huruf kapital**.",
        mission: "Tantangan: Buatlah sebuah class kosong bernama 'Hero' (ingat huruf H kapital!).",
        defaultCode: "# Buat blueprint (Class) Hero di bawah ini\n\n",
        check: "class Hero:",
        successMsg: "Bagus sekali! Blueprint Hero sudah tersimpan di memori komputer."
      },
      {

      // Page 3: Konsep Object (Instansiasi)
        youtubeId: null,
        narrative: "Blueprint 'Hero' sudah jadi. Tapi ingat, blueprint itu cuma desain di atas kertas. Dia belum benar-benar muncul di dalam *game* kita.\n\nUntuk memunculkan karakter nyata dari blueprint tersebut, kita harus menciptakan sebuah **Object** (Objek). Proses mengubah Class menjadi Object disebut *Instansiasi*.\n\nCaranya sangat mudah, cukup panggil nama class-nya seolah-olah itu adalah sebuah fungsi, lalu simpan ke dalam sebuah variabel.",
        mission: "Tantangan: Ciptakan wujud nyata dari Hero dan simpan ke dalam variabel bernama 'pahlawan_pertama'.",
        defaultCode: "class Hero:\n    pass\n\n# Ciptakan object pahlawan_pertama di bawah ini\n# Contoh: nama_variabel = NamaClass()\n\n\nprint('Objek berhasil diciptakan!')",
        check: "pahlawan_pertama = Hero()",
        successMsg: "Luar biasa! Karakter pertamamu sudah lahir ke dunia nyata (walaupun masih polos)."
      },
      {
        // Page 4: Keajaiban Reusability (Banyak Object dari 1 Class)
        youtubeId: null,
        narrative: "Tadi kita sudah bahas, alasan kita menggunakan Class adalah agar kita tidak perlu membuat kode dari nol berkali-kali. \n\nSatu Class bisa digunakan untuk mencetak jutaan Object! Sama seperti satu pabrik mobil yang bisa mencetak ribuan mobil dengan bentuk yang sama.\n\nSekarang, bayangkan *game* kita ini dimainkan oleh banyak orang (Multiplayer). Kita butuh lebih dari satu pahlawan di layar.",
        mission: "Tantangan: Buatlah dua object baru! Simpan ke dalam variabel 'player_satu' dan 'player_dua' menggunakan Class Hero yang sama.",
        defaultCode: "class Hero:\n    pass\n\n# Buat dua object dari class Hero di sini:\n\n\nprint('Dua pemain telah memasuki arena!')",
        check: "player_dua = Hero()", // Pengecekan simpel memastikan variabel player_dua terbuat
        successMsg: "Sempurna! Inilah kehebatan PBO: Menghemat kodemu, memaksimalkan hasilnya."
      },
      {
        // Page 5: Jembatan menuju Modul 2 (Pemanasan Atribut)
        youtubeId: null,
        narrative: "Tunggu dulu... Kalau `player_satu` dan `player_dua` dicetak dari blueprint yang sama, berarti mereka kembar identik dong? Nggak seru!\n\nDi *game* sungguhan, setiap *player* punya nama, senjata, dan *Health Point* (HP) yang berbeda-beda. Data-data yang membedakan satu objek dengan objek lainnya ini disebut sebagai **Attributes**.\n\nKita akan membahas cara membuat Attributes yang dinamis di Modul 2. Tapi untuk sekarang, mari kita selesaikan Modul 1 dengan gaya!",
        mission: "Tantangan: Ketik `print('Saya siap belajar Atribut di Modul 2!')` untuk membuktikan kamu siap.",
        defaultCode: "class Hero:\n    pass\n\nplayer_satu = Hero()\nplayer_dua = Hero()\n\n# Tulis kodemu di bawah sini\n",
        check: "print('Saya siap belajar Atribut di Modul 2!')",
        successMsg: "Selamat! Kamu telah menguasai fondasi utama PBO. Level up!"
      }
    ]
  },
  // Modul 2 bisa kita siapkan strukturnya agar aplikasi tidak error jika mencoba load Modul 2
  {
    id: 2,
    title: "Modul 2: Attributes & Methods 📱",
    pages: [
      {
        youtubeId: null,
        narrative: "Selamat datang di Modul 2! Di modul sebelumnya kita membuat karakter game. Sekarang, kita beralih ke skenario media sosial. Setiap akun pasti punya Username, Follower, dan Bio. Ini yang kita sebut atribut.",
        mission: "Tantangan awal: Cukup jalankan kode untuk mengecek kesiapan terminal.",
        defaultCode: "print('Modul 2 siap dimulai!')",
        check: "print('Modul 2 siap dimulai!')",
        successMsg: "Sistem Modul 2 online!"
      }
    ]
  }
];