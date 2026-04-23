export const modules = [
  {
    id: 1,
    title: "Modul 1: Class & Object 🎮",
    pages: [
      {
        youtubeId: "6e0NSwbKOAw", // Ganti dengan ID video YouTube pilihan Anda
        narrative: "Bayangkan kamu sedang men-desain karakter untuk game RPG. Sebelum ada karakter 'Ksatria' atau 'Penyihir' di layar, kamu butuh sebuah cetakan dasar atau 'blueprint'. Di dunia PBO, cetakan ini disebut Class.",
        mission: "Tantangan: Buatlah sebuah class kosong bernama 'Hero' untuk memulai desain karaktermu!",
        defaultCode: "# Buat blueprint Hero di sini\n\n\n\n# Tekan Run untuk validasi",
        check: "class Hero",
        successMsg: "Mantap! Blueprint Hero sudah siap."
      },
      {
        youtubeId: null, // Kosongkan jika tidak ada video di halaman ini
        narrative: "Sekarang cetakan 'Hero' sudah ada. Tapi pahlawan kita butuh wujud nyata agar bisa dimainkan. Wujud nyata dari sebuah Class disebut Object.",
        mission: "Tantangan: Buat sebuah object bernama 'pahlawanku' dari class Hero!",
        defaultCode: "class Hero:\n    pass\n\n# Buat wujud nyata (object) dari Hero di bawah ini\n",
        check: "pahlawanku = Hero()",
        successMsg: "Keren! Kamu berhasil mewujudkan cetakan menjadi objek nyata!"
      }
    ]
  },
  {
    id: 2,
    title: "Modul 2: Attributes & Methods 📱",
    pages: [
      {
        youtubeId: null,
        narrative: "Setiap profil media sosial punya data (Attributes) seperti nama dan bio. Di Python, kita menggunakan fungsi khusus bernama __init__ untuk memasukkan data awal saat objek dibuat.",
        mission: "Tantangan: Lengkapi method __init__ agar user bisa memiliki atribut 'username'!",
        defaultCode: "class User:\n    def __init__(self, username):\n        # Masukkan atribut username di sini\n        \n\nuser1 = User('Siswa_SMK')\nprint(user1.username)",
        check: "self.username = username",
        successMsg: "Keren! Objek User sekarang punya identitas digital."
      }
    ]
  }
];