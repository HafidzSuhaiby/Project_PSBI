export const modules = [
  {
    id: 1,
    title: "Modul 1: Class & Object",
    pages: [
      {
        subtitle: "Pengenalan Class",
        youtubeId: "6e0NSwbKOAw",
        content: [
          {
            text: `Class adalah **blueprint** untuk membuat variabel, class bisa diartikan juga sebagai tipe data. Di Python, setiap data pasti memiliki tipe data yang tipe tersebut adalah class. Sebagai contoh:

          * Data string \` "noval" \` tipe datanya adalah class \` str \`
          * Data numerik \` 24 \` tipe datanya adalah class \` int \`
          * Data floating point \` 3.1567 \` tipe datanya adalah class \` float \`
          


  Selain menggunakan class-class yang tersedia di Python Standard Library, kita bisa membuat custom class via keyword \`class\`. Topik custom class ini merupakan inti pembahasan chapter ini.
          
  Custom class (atau cukup class) digunakan untuk membuat variabel object. Cara termudah memahami hubungan antara class dan objek adalah melalui analogi berikut: dimisalkan ada sebuah class bernama \'Car\', class tersebut kemudian digunakan untuk mendeklarasikan tiga buah variabel bernama **\'bmw_m3_gtr\', \'mazda_rx8\', dan \'audi_le_mans\'**. Ketiga object tipe datanya adalah class \'Car\'`,
            code: null
          },
          {
            text: "Deklarasi class dilakukan dengan menggunakan keyword **class** diikuti oleh nama class yang diinginkan. Lalu di dalam block class tersebut perlu dideklarasikan suatu fungsi dengan skema **\' def__init__(self)\'** dengan isi body fungsi adalah deklarasi attribute. Contohnya:",
            code: "class Car:\n    def __init__(self):\n        self.nama=\"\"\n        self.manufaktur=\"\"\n        self.year=0",
          },
          {
            text: "Pada contoh diatas class **Car** memiliki tiga attribute: **name**, **manufaktur**, dan **year**. Nantinya, variabel objek yang dibuat dari class tersebut akan memiliki tiga atribut sesuai dengan yang dideklarsikan. ",
            code: ""
          },
          {
            text: "***Deklarasi class tanpa attribute***\n\n dengan mengunakaan keyword **pass**, suatu class bisa dideklarasikan tanpa memiliki attribute. Contoh penerapannya:",
            code: "class Car:\n    def __init-_(self):\n        pass\n\n# Atau dapat juga ditulis seperti ini :\n class Car:\n     pass"
          },
        ],
        mission: "Tantangan: Buatlah sebuah blueprint (class) bernama 'Hero' dengan tiga attribute: 'nama', 'Peran', dan 'level'. lalu, jangan lupa gunakan keyword  'pass' jika kamu belum mengisi logika didalamnya",
        defaultCode: `# Definisikan class Hero di bawah ini
class Hero:
    def __init__(self):
        # Deklarasikan attribute: nama, peran, dan level
        # Gunakan pass jika belum ada isinya`,
        check: "class Hero",
        answerCode: "class Hero:\n    def __init__(self):\n        self.nama = \"\"\n        self.peran = \"\"\n        self.level = 0",
        successMsg: "Mantap! Mari kita buat cetakan pertamamu di halaman selanjutnya.",
        voiceSummary: "Bagus! Kamu baru saja berhasil membuat blueprint atau cetakan pertama bernama Hero. Ingat, class hanyalah sebuah rancangan. Sama seperti denah rumah, ia belum menjadi rumah yang nyata sampai kita membuat objek darinya nanti."
      },
      {
        subtitle: "Pembuatan Instance object",
        youtubeId: null,
        content: [
          {
            text: "Object (atau instance object) adalah variabel yang dibuat dari class. Cara pembuatan object adalah memanggil nama class diikuti oleh tanda kurung *()* (seperti memanggil fungsi). Statement tersebut mengembalikan nilai balik berupa object baru yang bertipe data sesuai dengan class yang digunakan.",
            code: null,
          },
          {
            text: "Contoh deklarasi class **Person** beserta pembuatan variabel object bernama **person1**:",
            code: "class Person:\n     def __init__(self):\n          self.first_name = \"\"\n          self.last_name = \"\"\n\nperson1 = person()\nprint(f\"instance object: {person1}\")\nprint(f\"type:  {type(person1)}\")",
          },
         {
          text: `Penjelasan:\n

        * Class \'Person\* dideklarasikan dengan dua attribut, yaitu \'first_name\' dan
          \'last_name\'
        * Class \`Person\` di panggil seperti pemanggilan fungsi (menggunakan sintaks 
          \'Person()\') dan menghasilkan variabel objek baru bertipe \'Person\', yang kemudian 
          ditampung dalam variabel \'Person1\'.`,
          code: null
        },
        {
            text: "Contoh lainnya pembuatan instance object dari class **Car**:",
            code: "class Car:\n     def __init__(self):\n          self.name = \"\"\n          self.manufacturer = \"\"\n          self.year = 0\n\ncar1 = Car()\ncar2 = Car()\ncar3 = Car()",
          }
        ],
        mission: "Tantangan: Buatlah sebuah class bernama 'Hero'. Kemudian, buatlah satu object bernama 'hero1' dari class tersebut",
        defaultCode: "# 1. Definisikan class Hero di sini\n\n\n# 2. Buat instance object hero1 di sini\n",
        check: "hero1 = Hero()",
        answerCode: "class Hero:\n    pass\n\nhero1 = Hero()",
        successMsg: "Luar biasa! Kamu sudah berhasil membuat blueprint 'Hero' dan mencetak pahlawan pertamamu (hero1) ke dalam memori.",
        voiceSummary: "Luar biasa! Sekarang kamu sudah punya pahlawan yang nyata di dalam memori komputer. Dengan memanggil nama class diikuti tanda kurung, kamu baru saja melakukan proses instansiasi untuk melahirkan objek hero1 dari blueprint Hero yang sudah kamu buat."
      },
      {
        subtitle: "Instance Attribute",
        youtubeId: null,
        content: [
          {
            text: `Salah satu property class adalah attribute. Attribute adalah variabel yang terisolasi dengan class, jadi dalam pengaksesannya harus dilakukan melalui class dan/atau instance object.
            
    Sebelumnya, kita telah membuat class **Car** yang memiliki tiga 3 attribute:
        * \'name\' untuk menyimpan informasi nama/seri mobil
        * \'manufacturer\' untuk menyimpan informasi manufaktur atau pembuat mobil
        * \'year\' untuk menyimpan informasi tahun rilis mobil
    Attribute sebenarnya ada 2 jenis, yaitu instance attribute dan class attribute. 
    Yang sedang kita pelajari pada chapter ini adalah instance attribute. `,
            code: null
          },
          {
            text: `Cara deklarasi instance attribute mirip dengan deklarasi variabel, perbedaannya pada penulisannya diawali dengan **self.**. Selain itu deklarasinya harus berada di dalam body fungsi **__init__(self)**.
            
    Untuk mengakses instance attribute, kita dapat melakukannya melalui varibel objek yang 
    dibuat dari class dengan notasi pengaksesan:
    <object>.<attribute>.
    
    Contoh :`,
            code: "class Car:\n    def __init__(self):\n        self.name = \"\"\n        self.manufacturer = \"\"\n        self.year = 0\n\ncar1 = Car()\nprint(f\"car1 name: {car1.name}\")\nprint(f\"car1 manufacturer: {car1.manufacturer}\")\nprint(f\"car1 year: {car1.year}\") "
          },
          {
            text: "Saat di-print, dapat dilihat bahwa semua nilai instance attribute milik car1 sesuai dengan nilai default yang ditentukan saat deklarasi attribute dalam fungsi **__init__(self),** yaitu: string kosong\"\" untuk attribute **name** & **manufacturer,** dan **0** untuk attribute **year**.",
            code: null
          }
        ],
        mission: "Tantangan: Lengkapi class 'Hero' dengan instance attribute 'name' (string kosong) dan 'level' (angka 0). Kemudian, buatlah satu object bernama 'pahlawan_pertama' dan cetaklah atribut 'name' miliknya menggunakan fungsi print.",
        defaultCode: "class Hero:\n    def __init__(self):\n        # 1. Deklarasikan instance attribute di sini\n        \n\n# 2. Buat instance object 'pahlawan_pertama' di sini\n\n\n# 3. Cetak attribute name dari pahlawan_pertama\n",
        check: "pahlawan_pertama.name",
        answerCode: "class Hero:\n    def __init__(self):\n        self.name = \"\"\n        self.level = 0\n\npahlawan_pertama = Hero()\nprint(pahlawan_pertama.name)",
        successMsg: "Sempurna! Kamu telah berhasil memberikan 'identitas' pada Hero dan belajar cara memanggil data tersebut melalui object.",
        voiceSummary: "Mantap! Sekarang pahlawanmu sudah punya identitas. Menggunakan self dalam fungsi init memungkinkan setiap objek Hero memiliki datanya masing-masing, seperti nama dan level yang unik, meskipun mereka berasal dari blueprint yang sama."
      },
      {
        subtitle: "Pengecekan instance object",
        youtubeId: null,
        content: [
          {
            text: "Fungsi **isinstance()** cukup berguna untuk mengecek apakah suatu instance object tipe datanya adalah class tertentu atau class yang meng-inherit class tertentu.",
            code: null
          },
          {
            text: "Misalnya, variabel **car1** diatas kita cek apakah tipe datanya adalah class **Car**. Cara penggunaanya cukup panggil fungsi **isinstance()** lalu sertakan variabel objct yang ingin dicek sebagai argument pertama dan tipe data class sebagai argument ke-dua.",
            code: "car1 = Car()\ncar1.name = \"M3 GTR\"\ncar1.manufacturer = \"BMW\"\ncar1.year = 2001\n\nif isinstance(car1, Car):\n    print(f\"car1 class is Car\")\n# output -> car1 class is Car"
          }
        ],
        mission: "Tantangan: Buatlah sebuah object bernama 'pahlawan_pertama' dari class 'Hero'. Kemudian, gunakan fungsi 'isinstance()' di dalam fungsi print() untuk mengecek apakah 'pahlawan_pertama' benar-benar merupakan bagian dari class 'Hero'.",
        defaultCode: "class Hero:\n    pass\n\n# 1. Buat object 'pahlawan_pertama' di sini\n\n\n# 2. Cek tipe data object menggunakan isinstance() dan cetak hasilnya\n",
        check: "isinstance(pahlawan_pertama,Hero)",
        answerCode: "class Hero:\n    pass\n\npahlawan_pertama = Hero()\nprint(isinstance(pahlawan_pertama, Hero))",
        successMsg: "Bagus! Kamu telah berhasil melakukan validasi. Output 'True' membuktikan bahwa pahlawan_pertama adalah instance sah dari blueprint Hero.",
        voiceSummary: "Kerja bagus! Fungsi isinstance adalah cara kita memastikan bahwa sebuah objek benar-benar berasal dari class yang kita inginkan. Ini sangat berguna untuk menjaga keamanan kode agar tidak terjadi error saat memproses berbagai macam tipe data."
      },
      {
        subtitle: "Class turunan object",
        youtubeId: null,
        content: [
          {
            text: "Setiap class yang ada di python baik itu class bawaan Python Standard Library ataupun custom class, secara otomatis adalah turunan dari class bernama **object**.\n\nJadi, class **str**,**float**, custom class **Car** yang telah dibuat, dan lainnya, kesemua class-nya adalah turunan dari class object.\n\nSilakan cek menggunakan fungsi **isinstance()** untuk membuktikannya:",
            code: "data1 = Car():\nif isinstance(data1, Car):\n    print(f\"data1 class inherit from Car\")\nif isinstance(data1, object):\n    print(f\"data1 class inherit from object\")\n\ndata2 = \"Noval Agung\"\nif isinstance(data2, str):\n    print(f\"data2 class inherit from str\")\nif isinstance(data2, object):\n    print(f\"data2 class inherit from object\")\n\n# output :\n\n# data1 class inherit from Car\n# data1 class inherit from object\n# data2 class inherit from str\n#data2 class inherit from object"
          }
        ],
        mission: "Tantangan: Buktikan bahwa class 'Hero' adalah turunan dari class 'object'. Buatlah object 'pahlawan_pertama', lalu gunakan 'isinstance()' untuk mengecek apakah pahlawan_pertama merupakan instance dari 'object'. Cetak hasilnya!",
        defaultCode: "class Hero:\n    pass\n\n# 1. Buat object 'pahlawan_pertama'\n\n\n# 2. Gunakan isinstance untuk mengecek pahlawan_pertama terhadap class 'object'\n# Lalu cetak menggunakan print()\n",
        check: "isinstance(pahlawan_pertama, object)",
        answerCode: "class Hero:\n    pass\n\npahlawan_pertama = Hero()\nprint(isinstance(pahlawan_pertama, object))",
        successMsg: "Keren! Kamu baru saja membuktikan rahasia Python: semua hal (termasuk Hero buatanmu) pada dasarnya adalah sebuah 'object'.",
        voiceSummary: "Sempurna! Kamu telah membuktikan rahasia terbesar di Python: semuanya adalah objek. Baik itu string, angka, maupun class Hero buatanmu, semuanya merupakan keturunan dari leluhur yang sama, yaitu class object."
      },

    ],
   evaluation: [
      {
        question: "Apa fungsi dari keyword 'class' dalam Python?",
        options: [
          "Untuk membuat fungsi",
          "Sebagai blueprint untuk membuat object",
          "Untuk menghapus variabel",
          "Untuk mencetak teks ke terminal"
        ],
        answer: 1
      },
      {
        question: "Manakah cara yang benar untuk membuat instance dari class 'Car'?",
        options: [
          "car1 = class Car()",
          "new Car()",
          "car1 = Car()",
          "car1 = Car"
        ],
        answer: 2
      },
      {
        question: "Bagaimana cara mengakses atribut 'name' dari sebuah objek bernama 'hero1'?",
        options: [
          "hero1(name)",
          "hero1.name",
          "hero1->name",
          "hero1['name']"
        ],
        answer: 1
      },
      {
        question: "Apa kegunaan utama dari fungsi isinstance()?",
        options: [
          "Mengubah tipe data suatu variabel",
          "Menghapus sebuah objek dari memori",
          "Mengecek apakah objek merupakan instansiasi dari class tertentu",
          "Membuat class baru secara otomatis"
        ],
        answer: 2
      },
      {
        question: "Di Python, semua custom class secara otomatis merupakan turunan dari class apa?",
        options: [
          "str",
          "int",
          "object",
          "main"
        ],
        answer: 2
      }
    ]
  },
  {
    id: 2,
    title: "Modul 2: Constructor",
    pages: [
      {
        subtitle: "Pengenalan Constructor",
        youtubeId: "cNA5m90OXL0",
        content: [
          {
            text: "Di bahasa yang mengadopsi konsep OOP, setiap class memiliki default *constructor*. Sebagai contoh pada statement pembuatan onject bertipe class **Car**, syntax **Car()** digunakan dan syntax tersebut merupakan contoh penerapan pengaksesan konstruktor.\n\nAgar makin jelas, silakan perhatikan kode sederhana berikut:",
            code: "class Mountain:\n    pass\n\nmount_everest = Mountain()\nprint(mount_everest)\n# output -> <__main__.Mountain object at 0x0000019118A13390"
          },
          {
            text: "Class **Mountain** dideklarasikan tanpa berisi apapun (oleh karena itu keyword **pass** digunakan). Kelas tersebut bisa digunakan untuk membuat variabel object **mount_everest** dan **mount_kilimanjaro** dengan cara memanggil konstruktornya, yaitu **Mountain()**.\n\nDalam deklarasi class yang memiliki attribute, construktor wajib di-replace (atau istilah OOP-nya adalah di-override) dengan custom constructor yang didalamnya berisi deklarasi instance attribute\n\nSebagai contoh, class **Mountain** yang telah dibuat dimodifikasi dengan ditambahkan tiga buah instance attribute didalamnya yaitu **name**, **regionon**, dan **elevation**.",
            code: "class Mountain:\n    def __init__(self):\n        self.name=\"\"\n        self.region=\"\"\n        self.elevation=0\n\n    def info(self):\n        print(f\"name: {self.name}\")\n        print(f\"region: {self.region}\")\n        print(f\"elevation: {self.elevation}m\")\n\nmount_everest = Mountain()\nmount-everest.name = \"Everest\"\nmount_everest.region = \"Asia\"\nmount_everest.elevation = 8848\n# output :\n\n#name: Everest\n# regio: Asia\n# elevation: 8848m\n\nmount_kilimanjaro = Mountain()",
          },
          {
            text: "Pada contoh diatas, konstruktor **__init__(self)** meng-override default construktor milik class **Mountain** dan digunakan untuk deklarasi instance attribute ",
            code: ""
          },
        ],
        mission: "Tantangan: Modifikasi class 'Hero' dengan menambahkan sebuah constructor (__init__). Di dalamnya, deklarasikan dua instance attribute: 'name' (string kosong) dan 'health' (angka 100).",
        defaultCode: "class Hero:\n    # 1. Ganti 'pass' dengan constructor __init__\n    pass\n\n# 2. Buat object 'pahlawan_pertama' dari class Hero\n\n\n# 3. Cetak atribut health milik pahlawan_pertama\n",
        check: "self.health = 100",
        answerCode: "class Hero:\n    def __init__(self):\n        self.name = \"\"\n        self.health = 100\n\npahlawan_pertama = Hero()\nprint(pahlawan_pertama.health)",
        successMsg: "Luar biasa! Kamu baru saja meng-override constructor bawaan. Sekarang, setiap Hero yang lahir otomatis memiliki health sebesar 100.",
        voiceSummary: "Pada bagian ini kamu belajar bahwa setiap class di Python memiliki constructor bawaan. Constructor adalah method yang otomatis dipanggil saat object dibuat. Jika class memiliki atribut seperti nama atau data lain, maka constructor biasanya diubah menggunakan __init__ agar object langsung memiliki nilai awal saat dibuat."
      },
      {
        subtitle: "Construktor dengan custom param",
        youtubeId: null,
        content: [
          {
            text: "Konstruktor dapat didesain untuk memiliki parameter, dan metode ini sangat umum diteapkan.\n\nSebagai contoh, pada kode berikut class **Mountain** konstruktornya dimodifikasi agar bisa menampung data argumet untuk parameter **name**, **region**, dan **elevation**.",
            code: "class Mountain:\n    def __init__(self):\n        self.name=\"\"\n        self.region=\"\"\n        self.elevation=0\n\n    def info(self):\n        print(f\"name: {self.name}\")\n        print(f\"region: {self.region}\")\n        print(f\"elevation: {self.elevation}m\")\n\nmount_everest = Mountain()\nmount-everest.name = \"Everest\"\nmount_everest.region = \"Asia\"\nmount_everest.elevation = 8848\n# output :\n\n#name: Everest\n# regio: Asia\n# elevation: 8848m\n\nmount_kilimanjaro = Mountain(\"Kilimanjaro\", \"Africa\", 5859)",
          },
          {
            text: "Seperti halnya method, parameter pertama konstruktor harus **self**. Dari sini bisa disimpulkan berarti penambahan parameter harus dituliskan setelah **self**. Bisa dilihat di deklarasikan kosntruktor class **Mountain**, disitu ada tiga buah parameter dideklarasikan setelah self",
            code: null,
          }
        ],
        mission: "Tantangan: Ubah constructor class 'Hero' agar menerima dua parameter: 'nama' dan 'peran'. Masukkan nilai parameter tersebut ke dalam instance attribute 'self.name' dan 'self.role'. Terakhir, buatlah object 'pahlawan_pertama' dengan argumen ('Arjuna', 'Pemanah').",
        defaultCode: "class Hero:\n    def __init__(self, nama, peran):\n        # 1. Isi attribute dengan parameter di sini\n        self.name = \n        self.role = \n\n# 2. Buat object pahlawan_pertama dengan nama 'Arjuna' dan peran 'Pemanah'\npahlawan_pertama = \n\n# 3. Cetak nama pahlawan_pertama\nprint(pahlawan_pertama.name)",
        check: "Hero('Arjuna', 'Pemanah')",
        answerCode: "class Hero:\n    def __init__(self, nama, peran):\n        self.name = nama\n        self.role = peran\n\npahlawan_pertama = Hero('Arjuna', 'Pemanah')\nprint(pahlawan_pertama.name)",
        successMsg: "Luar biasa! Kamu telah menguasai Custom Constructor. Sekarang pembuatan objek menjadi jauh lebih efisien dan dinamis.",
        voiceSummary: "Di bagian ini kamu mempelajari bahwa constructor dapat menerima parameter. Dengan parameter, data object bisa langsung diisi saat object dibuat. Contohnya object Hero dapat langsung memiliki nama Arjuna dan peran Pemanah. Cara ini membuat pembuatan object menjadi lebih praktis dan efisien."
      },
      {
        subtitle: "Construktor overloading",
        youtubeId: null,
        content: [
          {
            text: "Overloading merupakan istilah OOP untuk pembuatan banyak kosntruktor dengan jumlah dan tipe parameter berbeda.\n\nPython tidak menyediakan API untuk penerapan constructor overloading, namun pada praktiknya bisa dicapai dengan hack, misalnya menggunakan opsional/keyword parameter, atau menggunakan *args/**kwargs.\n\nContoh constructor overloading menggunakan opsional parameter:",
            code: "class Mountain:\n    def __init__(self, name = \"\", region = \"\", elevation = 0):\n        self.name = name\n        self.region = region\n        self.elevation = elevation\n\n    def info(self):\n        print(f\"name: {self.name}\")\n        print(f\"region: {self.region}\")\n        print(f\"elevation: {self.elevation}m\")",
          },
          {
            text: `Penjelasan • Konstruktor class **Mountain** didesain memiliki 3 buah parameter yang kesumuanya memiliki nilai default. • Variabel object **mount_everest** dibuat dengan mengisi kesemua parameter konstruktornya. •Variabel object **mount_kilimanjaro** dibuat dengan hanya mengisi dua parameter pertama konstruktor.
      Silakan coba explore dengan mempraktekan penggunaan *args/**kwargs pada konstruktor.`,
            code: null,
          }
        ],
        mission: "Tantangan: Modifikasi constructor 'Hero' agar memiliki dua parameter opsional: 'nama' (default: 'Hero Baru') dan 'hp' (default: 100). Dengan begini, kamu bisa membuat objek Hero tanpa argumen, atau dengan argumen lengkap.",
        defaultCode: "class Hero:\n    # 1. Buat constructor dengan default parameter\n    def __init__(self, ...):\n        self.name = \n        self.health = \n\n# 2. Buat object 'h1' tanpa argumen apapun\nh1 = \n\n# 3. Buat object 'h2' dengan nama 'Gatotkaca' dan hp 500\nh2 = \n\nprint(f'{h1.name} HP: {h1.health}')\nprint(f'{h2.name} HP: {h2.health}')",
        check: "Gatotkaca",
        answerCode: "class Hero:\n    def __init__(self, nama='Hero Baru', hp=100):\n        self.name = nama\n        self.health = hp\n\nh1 = Hero()\nh2 = Hero('Gatotkaca', 500)\n\nprint(f'{h1.name} HP: {h1.health}')\nprint(f'{h2.name} HP: {h2.health}')",
        successMsg: "Hebat! Kamu telah berhasil mensimulasikan 'Overloading'. Sekarang class Hero milikmu sangat fleksibel untuk berbagai kondisi awal.",
        voiceSummary: "Pada bagian ini dijelaskan bahwa Python tidak memiliki constructor overloading secara langsung. Namun kita bisa menirunya dengan menggunakan parameter default. Jadi object bisa dibuat tanpa argumen atau dengan argumen lengkap sesuai kebutuhan program."
      },
      {
        subtitle: "Construktor dengan return type **None**",
        youtubeId: null,
        content: [
          {
            text: "Constructor dipaggil saat inisialisasi object, maka bisa dibilang bahwa construkctor tersebut selalu mengembalikan tipe data bertipe class dimana construkctor tersebut dideklarasikan.\n\nDalam pembuatan konstructor, tidak perlu menuliskan return type maupun return statement.\n\nMeski demikian, sebenarnya ada 1 lagi bentuk penulisan konstruktor, yaitu dengan ditambahkan tipe adat **None** dibelakangnya, dan ini diperbolehkan.\nContohnya:",
            code: "class Mountain:\n    def __init__(self, name = \"\", region = \"\", elevation = 0) -> None:\n        self.name = name\n        self.region= region\n        self.elevation = elevation",
          },
          {
            text: "Kode diatas adalah ekuivalen dengan kode berikut:",
            code: "class Mountain:\n    def __init__(self, name = \"\", region = \"\", elevation = 0):\n        self.name = name\n        self.region= region\n        self.elevation = elevation",
          }
        ],
        mission: "Tantangan: Tambahkan Type Hinting '-> None' pada constructor class 'Hero'. Constructor ini harus menerima parameter 'name' dan menyimpannya ke dalam instance attribute.",
        defaultCode: "class Hero:\n    # 1. Tambahkan '-> None' setelah definisi parameter constructor\n    def __init__(self, name):\n        self.name = name\n\n# 2. Buat object 'pahlawan_pertama'\n\n\n# 3. Cetak nama pahlawan tersebut\n",
        check: "-> None:",
        answerCode: "class Hero:\n    def __init__(self, name) -> None:\n        self.name = name\n\npahlawan_pertama = Hero(\"Arjuna\")\nprint(pahlawan_pertama.name)",
        successMsg: "Luar biasa! Kamu sudah belajar menulis kode Python yang lebih 'clean' dan informatif dengan menggunakan Type Hinting.",
        voiceSummary: "Di bagian ini kamu belajar bahwa constructor bisa ditulis dengan type hinting panah None. Ini menandakan bahwa constructor tidak mengembalikan nilai, melainkan hanya menjalankan proses inisialisasi data pada object."
      }
    ],
    evaluation: [
      {
        question: "Apa nama method khusus yang digunakan sebagai constructor dalam Python?",
        options: [
          "def constructor(self):",
          "def __init__(self):",
          "def build(self):",
          "def __start__(self):"
        ],
        answer: 1
      },
      {
        question: "Apa tujuan utama dari proses 'override' pada default constructor?",
        options: [
          "Untuk menghapus class dari memori",
          "Untuk mempercepat jalannya program",
          "Untuk mendefinisikan instance attribute saat objek dibuat",
          "Agar class tidak bisa dibuat menjadi objek"
        ],
        answer: 2
      },
      {
        question: "Di posisi manakah parameter tambahan harus diletakkan pada method __init__?",
        options: [
          "Sebelum parameter 'self'",
          "Di dalam body fungsi, bukan di parameter",
          "Setelah parameter 'self'",
          "Bebas di mana saja"
        ],
        answer: 2
      },
      {
        question: "Bagaimana cara mensimulasikan 'Constructor Overloading' di Python?",
        options: [
          "Membuat dua method __init__ dalam satu class",
          "Menggunakan default parameter atau *args/**kwargs",
          "Menggunakan keyword 'overload'",
          "Python sudah mendukung overloading secara otomatis"
        ],
        answer: 1
      },
      {
        question: "Manakah penulisan Type Hinting yang benar untuk menyatakan bahwa constructor tidak mengembalikan nilai?",
        options: [
          "def __init__(self) -> None:",
          "def __init__(self) -> object:",
          "def __init__(self) -> void:",
          "def __init__(self) -> return False:"
        ],
        answer: 0
      }
    ]
  },
  {
      "id": 3,
      "title": "Modul 3: Attribute & Method (Lanjutan)",
      "pages": [
        {
          "subtitle": "Anatomi Method dan Parameter self",
          "youtubeId": "oqzzgZ2TaP8",
          "content": [
            {
              "text": "Dalam Python, fungsi yang didefinisikan di dalam sebuah class disebut sebagai **method**. Ciri khas utama method adalah adanya parameter pertama yang wajib bernama **self**. \n\n**self** bukan sekadar nama, melainkan referensi ke **object instance** itu sendiri. Tanpa self, Python tidak akan tahu attribute mana yang harus diakses saat sebuah object memanggil method tersebut.",
              "code": "class Hero:\n    def __init__(self, nama):\n        self.name = nama\n\n    def salam(self):\n        print(f\"Halo, saya {self.name}\")\n\npahlawan = Hero(\"Arjuna\")\npahlawan.salam() # Python otomatis mengirim 'pahlawan' ke parameter 'self'"
            },
            {
              "text": "Saat kita memanggil method seperti **obj.salam()**, Python secara otomatis mengirimkan **obj** sebagai argumen untuk parameter **self**. Itulah sebabnya kita tidak perlu mengisi argumen self secara manual saat memanggil method.",
              "code": null
            }
          ],
          "mission": "Tantangan: Tambahkan sebuah method bernama 'teriak' pada class 'Hero'. Method tersebut harus mencetak pesan '[Nama Hero]: SERANG!!!' menggunakan attribute 'self.name'.",
          "defaultCode": "class Hero:\n    def __init__(self, nama):\n        self.name = nama\n\n    # Buat method teriak di sini\n\n\npahlawan1 = Hero(\"Gatotkaca\")\npahlawan1.teriak()",
          "check": "Gatotkaca: SERANG!!!",
          "answerCode": "class Hero:\n    def __init__(self, nama):\n        self.name = nama\n\n    def teriak(self):\n        print(f\"{self.name}: SERANG!!!\")\n\npahlawan1 = Hero(\"Gatotkaca\")\npahlawan1.teriak()",
          "successMsg": "Keren! Kamu sekarang paham bagaimana method menggunakan 'self' untuk mengenali identitas object-nya sendiri.",
          voiceSummary: "Pada bagian ini kamu belajar bahwa fungsi yang dibuat di dalam class disebut method. Setiap method di Python memiliki parameter pertama bernama self. Self adalah referensi ke object yang sedang menggunakan method tersebut. Saat object memanggil method, Python otomatis mengirim object itu ke parameter self. Dengan begitu method dapat mengakses attribute milik object seperti nama, health, dan data lainnya."
        },
        {
          "subtitle": "Instance vs Class Attribute",
          "youtubeId": null,
          "content": [
            {
              "text": "Penting untuk membedakan di mana data disimpan. \n\n1. **Instance Attribute**: Dibuat di dalam `__init__` dengan `self`. Bersifat unik (setiap object punya nilai berbeda).\n2. **Class Attribute**: Dibuat di luar method. Nilainya dipakai bersama oleh semua object dari class tersebut.",
              "code": "class Hero:\n    species = \"Human\" # Class Attribute\n\n    def __init__(self, nama):\n        self.name = nama # Instance Attribute\n\nprint(Hero.species)\np1 = Hero(\"Arjuna\")\nprint(p1.species) # Output: Human"
            }
          ],
          "mission": "Tantangan: Tambahkan class attribute bernama 'kategori' dengan nilai 'Karakter Game' ke dalam class Hero. Lalu cetak attribute tersebut melalui object 'pahlawan_pertama'.",
          "defaultCode": "class Hero:\n    # 1. Tambahkan class attribute kategori di sini\n    \n    def __init__(self, nama):\n        self.name = nama\n\npahlawan_pertama = Hero(\"Lancelot\")\n# 2. Cetak attribute kategori dari pahlawan_pertama\n",
          "check": "kategori = \"Karakter Game\"",
          "answerCode": "class Hero:\n    kategori = \"Karakter Game\"\n    \n    def __init__(self, nama):\n        self.name = nama\n\npahlawan_pertama = Hero(\"Lancelot\")\nprint(pahlawan_pertama.kategori)",
          "successMsg": "Tepat sekali! Class attribute sangat berguna untuk menyimpan data yang sifatnya umum bagi semua object.",
          voiceSummary: "Di bagian ini kamu mempelajari perbedaan antara instance attribute dan class attribute. Instance attribute dibuat menggunakan self di dalam constructor, sehingga setiap object memiliki nilainya sendiri. Sedangkan class attribute dibuat langsung di dalam class dan nilainya dipakai bersama oleh semua object. Pemahaman ini penting agar kamu tahu data mana yang bersifat pribadi dan mana yang bersifat umum."
        },
        {
          "subtitle": "Simulasi Constructor Overloading",
          "youtubeId": null,
          "content": [
            {
              "text": "Python tidak mengizinkan dua method `__init__` dalam satu class. Namun, kita bisa menggunakan **Default Parameter** agar pembuatan object menjadi fleksibel (bisa diisi argumen atau tidak).",
              "code": "class Hero:\n    def __init__(self, nama, health=100):\n        self.name = nama\n        self.health = health\n\n# Tanpa argumen health (otomatis 100)\nh1 = Hero(\"Arjuna\") \n# Dengan argumen health custom\nh2 = Hero(\"Gatotkaca\", 200)"
            }
          ],
          "mission": "Tantangan: Ubah constructor Hero agar parameter 'peran' memiliki nilai default 'Petarung'. Buat object 'h1' hanya dengan nama 'Miya' tanpa mengisi parameter peran.",
          "defaultCode": "class Hero:\n    # Berikan nilai default pada parameter peran\n    def __init__(self, nama, peran):\n        self.name = nama\n        self.role = peran\n\n# Buat object h1 di sini\n",
          "check": "Petarung",
          "answerCode": "class Hero:\n    def __init__(self, nama, peran=\"Petarung\"):\n        self.name = nama\n        self.role = peran\n\nh1 = Hero(\"Miya\")\nprint(h1.role)",
          "successMsg": "Luar biasa! Dengan default parameter, kamu baru saja mensimulasikan 'Overloading' di Python.",
          voiceSummary: "Pada bagian ini dijelaskan bahwa Python tidak mendukung constructor overloading secara langsung. Namun kita bisa mensimulasikannya menggunakan default parameter. Dengan cara ini, object dapat dibuat dengan argumen lengkap atau hanya sebagian saja. Teknik ini membuat constructor lebih fleksibel dan memudahkan pembuatan object sesuai kebutuhan program."
        }
      ],
      "evaluation": [
        {
          "question": "Apa peran utama dari parameter 'self' pada method di Python?",
          "options": [
            "Sebagai kata kunci untuk membuat variable global",
            "Sebagai referensi ke instance/object yang sedang aktif",
            "Untuk menghapus object dari memori",
            "Untuk menghubungkan Python dengan database"
          ],
          "answer": 1
        },
        {
          "question": "Di mana Class Attribute biasanya dideklarasikan?",
          "options": [
            "Di dalam method __init__",
            "Di luar deklarasi class",
            "Langsung di bawah class, di luar method",
            "Hanya bisa diakses di dalam loop"
          ],
          "answer": 2
        },
        {
          "question": "Apa yang terjadi jika kita membuat dua method __init__ dalam satu class Python?",
          "options": [
            "Python akan menjalankan keduanya sekaligus",
            "Python akan menggunakan yang paling bawah (terakhir didefinisikan)",
            "Akan terjadi error compile secara otomatis",
            "Keduanya akan digabung secara otomatis"
          ],
          "answer": 1
        },
        {
          "question": "Bagaimana cara menandai sebuah attribute sebagai 'Private' (secara konvensi) agar tidak mudah diakses dari luar?",
          "options": [
            "Menggunakan keyword 'private'",
            "Menggunakan awalan dua underscore (__) pada nama attribute",
            "Menulis attribute di file yang berbeda",
            "Mengunci class dengan decorator @final"
          ],
          "answer": 1
        },
        {
          "question": "Manakah pernyataan yang benar mengenai Instance Attribute?",
          "options": [
            "Nilainya selalu sama untuk semua object",
            "Dideklarasikan menggunakan self di dalam method",
            "Tidak bisa diubah setelah object dibuat",
            "Hanya bisa berupa tipe data angka"
          ],
          "answer": 1
        }
      ]
  },
  {
      "id": 4,
      "title": "Modul 4: Encapsulation (Enkapsulasi)",
      "pages": [
        {
          "subtitle": "Konsep Pembungkusan Data",
          "youtubeId": "anqROyvAAd0",
          "content": [
            {
              "text": "Encapsulation adalah proses membungkus data (attribute) dan fungsi (method) menjadi satu kesatuan dalam class, serta membatasi akses langsung dari luar[cite: 1]. \n\nTujuannya adalah untuk melindungi integritas data agar tidak diubah secara sembarangan oleh kode di luar class. Dalam Python, kita menggunakan tanda underscore (_) untuk menandai tingkat akses.",
              "code": "class Bank:\n    def __init__(self, saldo):\n        self.__saldo = saldo # Private attribute\n\natm = Bank(1000)\n# print(atm.__saldo) # Ini akan menyebabkan Error!"
            }
          ],
          "mission": "Tantangan: Buatlah class 'Akun' dengan satu private attribute bernama '__password' yang diisi melalui constructor.",
          "defaultCode": "class Akun:\n    def __init__(self, password):\n        # 1. Deklarasikan private attribute __password di sini\n        pass\n\n# 2. Buat object user1 dengan password 'rahasia123'\n\n# 3. Cetak __password dari user1",
          "check": "self.__password",
          "answerCode": "class Akun:\n    def __init__(self, password):\n        self.__password = password\n\nuser1 = Akun('rahasia123')\n",
          "successMsg": "Hebat! Kamu melihat bahwa Python melindungi attribute private agar tidak bisa diintip langsung.",
          "voiceSummary": "Bayangkan kamu memiliki sebuah ATM. Kamu tidak bisa langsung mengubah angka saldo di dalam mesinnya tanpa proses yang benar, kan? Nah, itulah Enkapsulasi. Kita membungkus data sensitif menggunakan tanda double underscore agar tidak bisa diubah sembarangan dari luar. Di tantangan tadi, kamu sudah berhasil mengunci password menggunakan konsep private attribute. Keren!"
        },
        {
          "subtitle": "Access Modifier: Public, Protected, & Private",
          "youtubeId": null,
          "content": [
            {
              "text": "Ada tiga tingkatan akses (Access Modifier) di Python:\n1. **Public**: Bisa diakses dari mana saja (tanpa underscore)[cite: 1].\n2. **Protected**: Disarankan hanya untuk internal class dan turunannya (menggunakan satu underscore `_`)[cite: 1].\n3. **Private**: Benar-benar disembunyikan dari luar class (menggunakan dua underscore `__`)[cite: 1].",
              "code": "class Senjata:\n    def __init__(self):\n        self.nama = \"Pedang\"      # Public\n        self._damage = 50         # Protected\n        self.__kode_rahasia = 123 # Private"
            }
          ],
          "mission": "Tantangan: Ubah attribute 'power' pada class 'Hero' menjadi Protected.",
          "defaultCode": "class Hero:\n    def __init__(self, power):\n        # Ubah menjadi protected\n        self.power = power",
          "check": "self._power = power",
          "answerCode": "class Hero:\n    def __init__(self, power):\n        # Menggunakan satu underscore untuk protected\n        self._power = power",
          "successMsg": "Bagus! Kamu sudah mulai memahami konvensi penamaan untuk keamanan data.",
          "voiceSummary": "Di Python, ada tiga level penjagaan. Pertama, Public yang bebas diakses siapa saja. Kedua, Protected dengan satu underscore, yang ibaratnya tanda 'tolong jangan sentuh kecuali kamu keluarga'. Dan terakhir, Private dengan dua underscore yang benar-benar dikunci rapat. Kamu baru saja belajar cara menandai mana data yang aman dibagikan dan mana yang harus dijaga ketat."
        },
        {
          "subtitle": "Getter: Mengambil Nilai Private",
          "youtubeId": null,
          "content": [
            {
              "text": "Karena attribute private tidak bisa diakses langsung, kita membutuhkan method **Getter**[cite: 1]. Getter berfungsi untuk mengembalikan (return) nilai dari attribute yang disembunyikan tersebut agar bisa digunakan di luar class tanpa merusak datanya.",
              "code": "class Hero:\n    def __init__(self, health):\n        self.__health = health\n\n    def get_health(self):\n        return self.__health"
            }
          ],
          "mission": "Tantangan: Buat method getter bernama 'ambil_nyawa' yang mengembalikan nilai dari private attribute '__health'.",
          "defaultCode": "class Hero:\n    def __init__(self, health):\n        self.__health = health\n\n    # Buat getter di sini",
          "check": "ambil_nyawa",
          "answerCode": "class Hero:\n    def __init__(self, health):\n        self.__health = health\n\n    def ambil_nyawa(self):\n        return self.__health",
          "successMsg": "Mantap! Sekarang kamu bisa membaca data private secara aman.",
          "voiceSummary": "Sekarang datanya sudah dikunci, lalu bagaimana cara melihatnya? Di sinilah kita butuh Getter. Anggap saja Getter itu seperti layar ATM yang hanya menampilkan saldo tanpa mengizinkan kamu menyentuh uangnya secara langsung. Method 'ambil_nyawa' yang kamu buat tadi adalah cara aman agar kode di luar bisa mengetahui isi data tanpa merusak strukturnya."
        },
        {
          "subtitle": "Setter: Mengubah Nilai dengan Validasi",
          "youtubeId": null,
          "content": [
            {
              "text": "Method **Setter** digunakan untuk mengubah nilai attribute private[cite: 1]. Keunggulan Setter adalah kita bisa menambahkan **validasi** atau logika pengecekan sebelum data benar-benar diubah, sehingga data tidak berisi nilai yang salah.",
              "code": "class Hero:\n    def set_health(self, nilai_baru):\n        if nilai_baru > 0: # Validasi\n            self.__health = nilai_baru"
            }
          ],
          "mission": "Tantangan: Tambahkan setter 'set_level' yang hanya akan mengubah '__level' jika nilai baru lebih besar dari 0.",
          "defaultCode": "class Hero:\n    def __init__(self):\n        self.__level = 1\n\n    def set_level(self, baru):\n        # Tambahkan validasi di sini\n        pass",
          "check": "baru > 0",
          "answerCode": "class Hero:\n    def __init__(self):\n        self.__level = 1\n\n    def set_level(self, baru):\n        if baru > 0:\n            self.__level = baru",
          "successMsg": "Luar biasa! Inilah inti dari enkapsulasi: Kendali penuh atas perubahan data.",
          "voiceSummary": "Enkapsulasi bukan cuma soal mengunci data, tapi soal kontrol. Dengan Setter, kita bisa memasang satpam sebelum data diubah. Seperti yang kamu lakukan pada method 'set_level' tadi, kita memberikan syarat agar level tidak boleh angka negatif. Inilah rahasia membuat aplikasi yang stabil dan bebas dari data yang tidak masuk akal!"
        },
        {
          "subtitle": "Name Mangling dalam Python",
          "youtubeId": null,
          "content": [
            {
              "text": "Saat kita menggunakan double underscore (`__`), Python sebenarnya melakukan **Name Mangling**[cite: 1]. Nama attribute diubah secara internal menjadi `_ClassName__AttributeName`. Ini dilakukan untuk menghindari konflik nama pada sistem pewarisan (inheritance).",
              "code": "class Hero:\n    def __init__(self):\n        self.__secret = \"123\"\n\nh1 = Hero()\n# print(h1._Hero__secret) # Cara 'ilegal' mengakses private"
            }
          ],
          "mission": "Tantangan: Buktikan name mangling dengan mencoba mengakses '__secret' milik class 'Hero' menggunakan format '_Hero__secret'.",
          "defaultCode": "class Hero:\n    def __init__(self):\n        self.__secret = \"BIM-SALA-BIM\"\n\nh1 = Hero()\n# Cetak menggunakan format name mangling\nprint()",
          "check": "print(h1._Hero__secret)",
          "answerCode": "class Hero:\n    def __init__(self):\n        self.__secret = \"BIM-SALA-BIM\"\n\nh1 = Hero()\n# Mengakses private attribute melalui name mangling internal Python\nprint(h1._Hero__secret)",
          "successMsg": "Selamat! Kamu telah menembus pertahanan Python. Namun ingat, jangan gunakan cara ini dalam proyek nyata!",
          "voiceSummary": "Kamu baru saja menemukan rahasia kecil Python! Ternyata, atribut private itu tidak benar-benar hilang, Python hanya mengubah namanya secara internal untuk menghindari bentrokan antar class. Kamu sudah berhasil melakukan 'trik ilegal' untuk mengaksesnya, tapi ingat ya, dalam standar pengembangan software profesional, kita harus tetap menghormati privasi atribut tersebut demi keamanan kode kita."
        }
      ],
      "evaluation": [
        {
          "question": "Apa simbol yang digunakan di Python untuk menyatakan sebuah attribute bersifat Private?",
          "options": [
            "Satu tanda pagar (#)",
            "Satu underscore (_)",
            "Dua underscore (__)",
            "Keyword 'private'"
          ],
          "answer": 2
        },
        {
          "question": "Apa fungsi utama dari method 'Setter'?",
          "options": [
            "Menghapus object dari memori",
            "Menampilkan nilai ke layar saja",
            "Mengubah nilai attribute dengan validasi tertentu",
            "Membuat object baru secara otomatis"
          ],
          "answer": 2
        },
        {
          "question": "Manakah tingkatan akses yang disarankan hanya digunakan untuk internal class dan turunannya saja?",
          "options": [
            "Public",
            "Protected (_)",
            "Private (__)",
            "Global"
          ],
          "answer": 1
        },
        {
          "question": "Apa yang dimaksud dengan 'Name Mangling' di Python?",
          "options": [
            "Proses menghapus attribute private",
            "Perubahan nama internal attribute private oleh Python",
            "Cara membuat method berjalan lebih cepat",
            "Teknik mengganti nama class secara otomatis"
          ],
          "answer": 1
        },
        {
          "question": "Mengapa kita sebaiknya tidak mengakses attribute private secara langsung?",
          "options": [
            "Karena akan menyebabkan komputer mati",
            "Karena melanggar prinsip keamanan dan integritas data",
            "Karena Python tidak mendukung attribute tersebut",
            "Karena penulisan kodenya terlalu panjang"
          ],
          "answer": 1
        }
      ]
  },
  {
      "id": 5,
      "title": "Modul 5: Inheritance (Pewarisan)",
      "pages": [
        {
          "subtitle": "Konsep Dasar Pewarisan",
          "youtubeId": null,
          "content": [
            {
              "text": "Inheritance atau pewarisan memungkinkan sebuah class (disebut **Child Class**) untuk mewarisi attribute dan method dari class lain (disebut **Parent Class**)[cite: 1]. \n\nKonsep ini sangat berguna untuk **reusability** (penggunaan kembali kode), di mana kita tidak perlu menulis ulang logika yang sama untuk class yang memiliki karakteristik serupa.",
              "code": "class Hero: # Parent Class\n    def __init__(self, nama):\n        self.name = nama\n\nclass Fighter(Hero): # Child Class mewarisi Hero\n    pass\n\nh1 = Fighter(\"Balmond\")\nprint(h1.name) # Output: Balmond"
            }
          ],
          "mission": "Tantangan: Buatlah class 'Mage' yang mewarisi class 'Hero'.",
          "defaultCode": "class Hero:\n    def __init__(self, nama):\n        self.name = nama\n\n# 1. Buat class Mage yang mewarisi Hero\n\n# 2. Buat object p1 dari class Mage dengan nama 'Alice'\n",
          "check": "p1 = Mage('Alice')",
          "answerCode": "class Hero:\n    def __init__(self, nama):\n        self.name = nama\n\nclass Mage(Hero):\n    pass\n\np1 = Mage('Alice')\nprint(p1.name)",
          "successMsg": "Hebat! Kamu telah berhasil membuat struktur hierarki pertama kamu.",
          "voiceSummary": "Selamat datang di konsep Pewarisan! Bayangkan kamu sedang membangun sistem game yang besar. Daripada menulis ulang kode nama dan kesehatan untuk setiap jenis karakter, kita cukup buat satu induk bernama Hero. Di tantangan tadi, kamu sudah berhasil membuat Mage yang secara otomatis 'mewarisi' sifat-sifat Hero. Ini akan sangat menghemat waktumu saat membuat banyak karakter nantinya!"
        },
        {
          "subtitle": "Menggunakan super()",
          "youtubeId": null,
          "content": [
            {
              "text": "Fungsi **super()** digunakan dalam Child Class untuk memanggil method atau constructor milik Parent Class[cite: 1]. Ini sangat penting ketika Child Class memiliki constructor-nya sendiri tetapi tetap ingin menjalankan logika inisialisasi yang ada di Parent Class.",
              "code": "class Hero:\n    def __init__(self, nama):\n        self.name = nama\n\nclass Tank(Hero):\n    def __init__(self, nama, armor):\n        super().__init__(nama) # Memanggil init milik Hero\n        self.armor = armor"
            }
          ],
          "mission": "Tantangan: Lengkapi constructor class 'Assassin' agar memanggil constructor 'Hero' menggunakan super() untuk mengisi attribute 'name'.",
          "defaultCode": "class Hero:\n    def __init__(self, nama):\n        self.name = nama\n\nclass Assassin(Hero):\n    def __init__(self, nama, speed):\n        # Gunakan super() di sini\n        self.speed = speed\n\nh1 = Assassin(\"Gusion\", 100)\nprint(h1.name)",
          "check": "super",
          "answerCode": "class Hero:\n    def __init__(self, nama):\n        self.name = nama\n\nclass Assassin(Hero):\n    def __init__(self, nama, speed):\n        super().__init__(nama)\n        self.speed = speed\n\nh1 = Assassin(\"Gusion\", 100)\nprint(h1.name)",
          "successMsg": "Luar biasa! super() memastikan semua attribute dari orang tua terwariskan dengan sempurna.",
          "voiceSummary": "Kadang-kadang, seorang anak ingin punya keahlian tambahan tapi tidak mau melupakan didikan orang tuanya. Itulah gunanya fungsi super. Dengan super, kamu memerintahkan Python untuk menjalankan inisialisasi dari Parent Class terlebih dahulu sebelum menambahkan atribut unik di Child Class. Gusion yang kamu buat tadi sekarang punya nama dari Hero dan kecepatan dari class Assassin itu sendiri. Kerja bagus!"
        },
        {
          "subtitle": "Method Overriding",
          "youtubeId": null,
          "content": [
            {
              "text": "Child Class dapat mendefinisikan ulang method yang sudah ada di Parent Class. Proses ini disebut **Method Overriding**[cite: 1]. Method yang dipanggil nantinya adalah method milik Child Class tersebut, bukan lagi milik Parent Class.",
              "code": "class Hero:\n    def attack(self):\n        print(\"Hero menyerang!\")\n\nclass Marksman(Hero):\n    def attack(self):\n        print(\"Marksman menembak dari jauh!\")"
            }
          ],
          "mission": "Tantangan: Lakukan overriding pada method 'skill' di class 'Fighter' agar mencetak 'Fighter menggunakan tinju!'.",
          "defaultCode": "class Hero:\n    def skill(self):\n        print(\"Hero menggunakan skill\")\n\nclass Fighter(Hero):\n    # Override method skill di sini\n    pass\n\np1 = Fighter()\np1.skill()",
          "check": "print(\"Fighter menggunakan tinju!\")",
          "answerCode": "class Hero:\n    def skill(self):\n        print(\"Hero menggunakan skill\")\n\nclass Fighter(Hero):\n    def skill(self):\n        print(\"Fighter menggunakan tinju!\")\n\np1 = Fighter()\np1.skill()",
          "successMsg": "Tepat sekali! Overriding memungkinkan setiap Child Class memiliki perilaku yang unik.",
          "voiceSummary": "Meskipun mewarisi sifat induknya, setiap anak boleh punya caranya sendiri dalam beraksi. Inilah yang disebut Overriding. Kamu sudah berhasil mengubah cara Fighter menyerang menggunakan tinju, meskipun di class induknya hanya serangan biasa. Teknik ini sangat penting agar setiap objek dalam aplikasimu memiliki identitas dan perilaku yang unik"
        },
        {
          "subtitle": "Multiple Inheritance",
          "youtubeId": null,
          "content": [
            {
              "text": "Python mendukung **Multiple Inheritance**, yaitu sebuah class dapat mewarisi lebih dari satu Parent Class sekaligus[cite: 1]. Caranya adalah dengan memisahkan nama-nama Parent Class menggunakan tanda koma di dalam kurung.",
              "code": "class LandAnimal:\n    def walk(self):\n        print(\"Berjalan...\")\n\nclass WaterAnimal:\n    def swim(self):\n        print(\"Berenang...\")\n\nclass Frog(LandAnimal, WaterAnimal):\n    pass"
            }
          ],
          "mission": "Tantangan: Buatlah class 'HybridHero' yang mewarisi dua class: 'Fighter' dan 'Mage'.",
          "defaultCode": "class Fighter: pass\nclass Mage: pass\n\n# Buat class HybridHero di sini",
          "check": "class HybridHero(Fighter, Mage)",
          "answerCode": "class Fighter: pass\nclass Mage: pass\n\nclass HybridHero(Fighter, Mage):\n    pass",
          "successMsg": "Selamat! Kamu telah menguasai salah satu fitur tercanggih di Python OOP.",
          "voiceSummary": "Luar biasa! Kamu baru saja mempelajari salah satu fitur paling kuat di Python, yaitu pewarisan ganda. Tidak semua bahasa pemrograman mengizinkan satu anak punya dua induk sekaligus, tapi Python bisa! Dengan membuat Hybrid Hero, karaktermu kini memiliki kekuatan dari Fighter sekaligus kecerdasan dari Mage. Kemampuan ini akan sangat berguna saat kamu membangun sistem yang kompleks di masa depan."
        }
      ],
      "evaluation": [
        {
          "question": "Apa istilah untuk class yang mewarisi attribute dari class lain?",
          "options": [
            "Parent Class",
            "Super Class",
            "Child Class",
            "Master Class"
          ],
          "answer": 2
        },
        {
          "question": "Fungsi apa yang digunakan untuk memanggil constructor milik Parent Class dari Child Class?",
          "options": [
            "this()",
            "super()",
            "parent()",
            "__init__()"
          ],
          "answer": 1
        },
        {
          "question": "Apa yang terjadi saat kita melakukan Method Overriding?",
          "options": [
            "Method di Parent Class dihapus secara permanen",
            "Child Class memiliki implementasi method yang berbeda dengan nama yang sama",
            "Program akan menghasilkan error karena nama method kembar",
            "Python akan menjalankan kedua method secara berurutan"
          ],
          "answer": 1
        },
        {
          "question": "Bagaimana cara menuliskan Multiple Inheritance di Python?",
          "options": [
            "class Child(Parent1 + Parent2):",
            "class Child(Parent1 & Parent2):",
            "class Child(Parent1, Parent2):",
            "class Child(Parent1 and Parent2):"
          ],
          "answer": 2
        },
        {
          "question": "Manakah pernyataan yang paling tepat mengenai manfaat utama Inheritance?",
          "options": [
            "Mempercepat waktu booting komputer",
            "Menghindari penulisan ulang kode yang sama (Code Reusability)",
            "Menghapus attribute private secara otomatis",
            "Membuat program bisa berjalan tanpa class"
          ],
          "answer": 1
        }
      ]
  },
  {
      "id": 6,
      "title": "Modul 6: Polymorphism (Polimorfisme)",
      "pages": [
        {
          "subtitle": "Apa itu Polimorfisme?",
          "youtubeId": null,
          "content": [
            {
              "text": "Polymorphism berasal dari bahasa Yunani yang berarti **'banyak bentuk'**. Dalam pemrograman OOP, polimorfisme memungkinkan satu interface (nama method yang sama) digunakan untuk berbagai tipe data atau class yang berbeda[cite: 1].\n\nIntinya, kita bisa memanggil method yang sama pada object yang berbeda, dan setiap object akan merespons dengan caranya masing-masing.",
              "code": "class Cat:\n    def sound(self):\n        print(\"Meow!\")\n\nclass Dog:\n    def sound(self):\n        print(\"Woof!\")\n\n# Keduanya punya method sound(), tapi hasilnya beda"
            }
          ],
          "mission": "Tantangan: Buat dua class 'Robot' dan 'Human', keduanya harus memiliki method bernama 'greet'.",
          "defaultCode": "class Robot:\n    # Buat method greet di sini\n    pass\n\nclass Human:\n    # Buat method greet di sini\n    pass",
          "check": "def greet",
          "answerCode": "class Robot:\n    def greet(self):\n        print(\"Halo, saya Robot\")\n\nclass Human:\n    def greet(self):\n        print(\"Halo, saya Manusia\")",
          "successMsg": "Hebat! Kamu baru saja menerapkan konsep dasar 'Banyak Bentuk'.",
          "voiceSummary": "Selamat datang di puncak konsep OOP, yaitu Polimorfisme! Sesuai namanya, 'Banyak Bentuk' berarti satu nama perintah bisa menghasilkan aksi yang berbeda. Tadi kamu sudah membuat Robot dan Manusia yang sama-sama bisa menyapa atau 'greet', tapi dengan cara mereka masing-masing. Di dunia nyata, ini seperti menekan tombol 'Play' yang bisa memutar musik, video, atau bahkan memulai game. Satu tombol, banyak fungsi!"
        },
        {
          "subtitle": "Polimorfisme dengan Inheritance",
          "youtubeId": null,
          "content": [
            {
              "text": "Polimorfisme paling sering terlihat saat kita menggunakan **Inheritance** (Pewarisan)[cite: 1]. Child class dapat melakukan *override* pada method milik Parent class untuk memberikan perilaku yang spesifik, namun tetap menggunakan nama method yang sama.",
              "code": "class Hero:\n    def attack(self):\n        print(\"Hero menyerang!\")\n\nclass Archer(Hero):\n    def attack(self):\n        print(\"Memanah target!\")\n\nclass Mage(Hero):\n    def attack(self):\n        print(\"Melempar bola api!\")"
            }
          ],
          "mission": "Tantangan: Buatlah class 'Fighter' yang mewarisi 'Hero' dan lakukan override pada method 'attack' agar mencetak 'Memukul musuh!'.",
          "defaultCode": "class Hero:\n    def attack(self):\n        print(\"Hero menyerang\")\n\nclass Fighter(Hero):\n    # Override di sini\n    pass",
          "check": "print(\"Memukul musuh!\")",
          "answerCode": "class Hero:\n    def attack(self):\n        print(\"Hero menyerang\")\n\nclass Fighter(Hero):\n    def attack(self):\n        print(\"Memukul musuh!\")",
          "successMsg": "Bagus! Ini membuktikan bahwa satu perintah 'attack' bisa menghasilkan aksi yang berbeda tergantung jenis Hero-nya.",
          "voiceSummary": "Polimorfisme benar-benar menunjukkan taringnya saat digabungkan dengan pewarisan. Kamu baru saja melihat bagaimana class Fighter memberikan respon unik pada perintah 'attack' dibanding Hero lainnya. Ini membuktikan bahwa meskipun mereka satu keluarga, setiap Child Class punya kebebasan untuk menentukan jati dirinya sendiri melalui overriding. Keren banget!"
        },
        {
          "subtitle": "Polimorfisme dalam Fungsi (Function)",
          "youtubeId": null,
          "content": [
            {
              "text": "Kita bisa membuat sebuah fungsi yang menerima parameter berupa object. Selama object tersebut memiliki method yang dibutuhkan, fungsi tersebut akan berjalan tanpa peduli dari class mana object itu berasal[cite: 1].",
              "code": "def cetak_suara(hewan):\n    hewan.sound() # Memanggil method sound dari object apapun\n\ncetak_suara(Cat())\ncetak_suara(Dog())"
            }
          ],
          "mission": "Tantangan: Buat fungsi 'aksi_hero' yang menerima parameter 'hero' dan memanggil method 'attack()' milik parameter tersebut.",
          "defaultCode": "def aksi_hero(hero):\n    # Panggil method attack di sini\n    pass",
          "check": "hero.attack",
          "answerCode": "def aksi_hero(hero):\n    hero.attack()",
          "successMsg": "Tepat sekali! Fungsi ini sekarang bersifat fleksibel untuk segala jenis Hero.",
          "voiceSummary": "Nah, ini adalah bagian yang sangat membantu efisiensi kodingmu. Dengan Polimorfisme, kamu bisa membuat satu fungsi universal seperti 'aksi_hero' yang bisa menerima hero apa saja. Kamu tidak perlu membuat fungsi berbeda untuk Archer, Mage, atau Fighter. Selama mereka punya method 'attack', fungsi tersebut akan bekerja dengan sempurna. Benar-benar hemat baris kode, kan?"
        },
        {
          "subtitle": "Polimorfisme dalam Perulangan (Loop)",
          "youtubeId": null,
          "content": [
            {
              "text": "Polimorfisme sangat kuat ketika digunakan dalam **List**. Kita bisa menyimpan berbagai object yang berbeda dalam satu list, lalu menjalankan method yang sama menggunakan perulangan[cite: 1].",
              "code": "list_hero = [Archer(), Mage(), Fighter()]\n\nfor hero in list_hero:\n    hero.attack() # Semua menyerang dengan gaya masing-masing"
            }
          ],
          "mission": "Tantangan: Buatlah list bernama 'pasukan' yang berisi satu object Archer dan satu object Mage. Lalu jalankan method 'attack' menggunakan loop 'for'.",
          "defaultCode": "class Archer: \n    def attack(self): print(\"Panah!\")\nclass Mage: \n    def attack(self): print(\"Sihir!\")\n\n# 1. Buat list pasukan\npasukan = \n\n# 2. Loop pasukan dan panggil attack\n",
          "check": "hero.attack()",
          "answerCode": "class Archer: \n    def attack(self): print(\"Panah!\")\nclass Mage: \n    def attack(self): print(\"Sihir!\")\n\npasukan = [Archer(), Mage()]\n\nfor hero in pasukan:\n    hero.attack()",
          "successMsg": "Luar biasa! Kamu telah melihat bagaimana polimorfisme menyederhanakan manajemen banyak object.",
          "voiceSummary": "Coba bayangkan kamu sedang mengelola ratusan unit dalam sebuah game. Dengan memasukkan semua unit ke dalam satu list 'pasukan', kamu cukup memanggil satu perintah perulangan untuk membuat mereka semua beraksi serentak. Kamu telah belajar cara mengelola banyak objek yang berbeda secara kolektif namun tetap menjaga keunikan perilaku masing-masing unit tersebut."
        },
        {
          "subtitle": "Duck Typing di Python",
          "youtubeId": null,
          "content": [
            {
              "text": "Python menggunakan filosofi **Duck Typing**: *\"Jika ia berjalan seperti bebek dan bersuara seperti bebek, maka ia adalah bebek\"*[cite: 1]. Artinya, Python tidak peduli tipe data object-nya, selama object tersebut memiliki method yang kita panggil.",
              "code": "class Bird:\n    def fly(self): print(\"Terbang\")\n\nclass Airplane:\n    def fly(self): print(\"Mesin hidup dan terbang\")\n\n# Keduanya bukan dari keluarga yang sama, tapi sama-sama bisa fly()"
            }
          ],
          "mission": "Tantangan: Buat class 'PaperPlane' (pesawat kertas) yang memiliki method 'fly' agar bisa digunakan bersama object Bird dan Airplane.",
          "defaultCode": "class PaperPlane:\n    # Buat method fly di sini\n    pass",
          "check": "def fly",
          "answerCode": "class PaperPlane:\n    def fly(self):\n        print(\"Meluncur di udara\")",
          "successMsg": "Selamat! Kamu telah menguasai konsep Duck Typing yang membuat Python sangat fleksibel.",
          "voiceSummary": "Terakhir, kita belajar filosofi paling terkenal di Python: Duck Typing. Python itu fleksibel, dia tidak peduli identitas asli sebuah objek, asalkan objek itu punya kemampuan yang diminta. Tadi kamu sudah membuktikannya dengan Pesawat Kertas yang bisa terbang layaknya Burung. Dengan memahami ini, kamu sekarang punya kebebasan penuh dalam merancang sistem yang dinamis dan fleksibel di Python!"
        }
      ],
      "evaluation": [
        {
          "question": "Apa arti harfiah dari istilah Polymorphism?",
          "options": [
            "Banyak data",
            "Banyak bentuk",
            "Banyak fungsi",
            "Satu tujuan"
          ],
          "answer": 1
        },
        {
          "question": "Manakah pernyataan yang paling tepat menggambarkan Polimorfisme?",
          "options": [
            "Kemampuan untuk menyembunyikan attribute private",
            "Kemampuan untuk mewarisi sifat dari Parent class",
            "Kemampuan satu method memiliki perilaku berbeda pada object yang berbeda",
            "Kemampuan untuk membuat object tanpa class"
          ],
          "answer": 2
        },
        {
          "question": "Dalam konteks polimorfisme, apa fungsi dari Method Overriding?",
          "options": [
            "Menghapus method lama agar hemat memori",
            "Menyediakan implementasi khusus pada Child class untuk method yang sama di Parent class",
            "Menghubungkan database dengan class",
            "Membuat method menjadi private secara otomatis"
          ],
          "answer": 1
        },
        {
          "question": "Apa syarat utama agar sebuah fungsi polimorfik dapat menjalankan method pada berbagai object berbeda?",
          "options": [
            "Object harus berasal dari class yang sama",
            "Object harus memiliki nama attribute yang sama",
            "Object harus memiliki nama method yang sesuai dengan yang dipanggil dalam fungsi",
            "Object harus didefinisikan sebagai global variable"
          ],
          "answer": 2
        },
        {
          "question": "Apa yang dimaksud dengan filosofi 'Duck Typing' di Python?",
          "options": [
            "Hanya bisa menggunakan class yang bernama Duck",
            "Tipe data tidak penting selama object memiliki perilaku (method) yang diminta",
            "Semua object harus mewarisi class Animal",
            "Program akan error jika tidak ada suara bebek"
          ],
          "answer": 1
        }
      ]
  }
];