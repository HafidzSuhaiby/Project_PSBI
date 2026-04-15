export const modules = [
  {
    id: 1,
    title: "Modul 1: Class & Object 🎮",
    narrative: "Bayangkan kamu sedang men-desain karakter untuk game RPG. Sebelum ada karakter 'Ksatria' atau 'Penyihir' di layar, kamu butuh sebuah cetakan dasar atau 'blueprint'. Di dunia PBO, cetakan ini disebut Class, dan karakter nyata yang muncul di game disebut Object[cite: 151, 159].",
    mission: "Tantangan: Buatlah sebuah class kosong bernama 'Hero' untuk memulai desain karaktermu!",
    defaultCode: "# Buat blueprint Hero di sini\n\n\n\n# Tekan Run untuk validasi",
    check: "class Hero",
    successMsg: "Mantap! Blueprint Hero sudah siap. Sekarang kamu punya cetakan untuk membuat ribuan karakter game[cite: 151]."
  },
  {
    id: 2,
    title: "Modul 2: Attributes & Methods 📱",
    narrative: "Sekarang bayangkan profil Media Sosial. Setiap profil punya data (Attributes) seperti nama dan bio, serta aksi (Methods) seperti 'post' atau 'edit_foto'[cite: 160]. Di Python, kita menggunakan __init__ untuk memasukkan data awal saat objek dibuat[cite: 152].",
    mission: "Tantangan: Lengkapi method __init__ agar user bisa memiliki atribut 'username'!",
    defaultCode: "class User:\n    def __init__(self, username):\n        # Masukkan atribut username di sini\n        \n\n# Membuat objek user baru\nuser1 = User('User')\nprint(user1.username)",
    check: "self.username = username",
    successMsg: "Keren! Objek User sekarang punya identitas digital yang tersimpan rapi[cite: 152, 160]."
  },
  {
    id: 3,
    title: "Modul 3: Inheritance (Pewarisan) 🚗",
    narrative: "Dalam dunia kendaraan, Mobil dan Motor sama-sama punya mesin, tapi mereka punya fitur unik masing-masing[cite: 161]. Daripada membuat kode dari nol, kita bisa menggunakan 'Inheritance' agar kelas anak (Mobil) mewarisi sifat dari kelas induk (Kendaraan)[cite: 153, 161].",
    mission: "Tantangan: Buat class 'Mobil' yang mewarisi (inheritance) dari class 'Kendaraan'!",
    defaultCode: "class Kendaraan:\n    bahan_bakar = 'Bensin'\n\n# Buat class Mobil di bawah ini agar mewarisi Kendaraan\n",
    check: "class Mobil(Kendaraan)",
    successMsg: "Silsilah keluarga kendaraan berhasil dibuat! Mobilmu kini otomatis punya atribut bahan_bakar tanpa perlu ditulis ulang[cite: 153, 161]."
  },
  {
    id: 4,
    title: "Modul 4: Polymorphism 🐾",
    narrative: "Polymorphism berarti 'banyak bentuk'[cite: 153]. Bayangkan perintah 'Bersuara'. Kucing akan mengeong, Anjing akan menggonggong. Satu perintah yang sama, tapi hasilnya berbeda tergantung siapa objeknya[cite: 161]. Ini membuat kodemu jadi sangat fleksibel!",
    mission: "Tantangan: Panggil method 'bersuara' pada objek yang berbeda untuk melihat perbedaannya!",
    defaultCode: "class Kucing: \n    def bersuara(self): return 'Meong!'\n\nclass Anjing: \n    def bersuara(self): return 'Guk!'\n\nhewan = [Kucing(), Anjing()]\nfor h in hewan:\n    # Panggil method bersuara di sini\n    print()",
    check: "h.bersuara()",
    successMsg: "Boom! Itulah Polymorphism. Satu perintah, ribuan aksi berbeda sesuai konteksnya[cite: 153, 161]."
  }
];