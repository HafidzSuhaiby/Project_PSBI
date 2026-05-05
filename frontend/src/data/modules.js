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
        mission: "Tantangan: Cetak kalimat 'Siap membuat game RPG!' ke terminal.",
        defaultCode: "# Tulis kodemu di bawah baris ini\n\n",
        check: "print('Siap membuat game RPG!')",
        successMsg: "Mantap! Mari kita buat cetakan pertamamu di halaman selanjutnya."
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
        mission: "Tantangan: Buatlah sebuah class kosong bernama 'Hero'.",
        defaultCode: "# Buat blueprint Hero di bawah ini\n",
        check: "class Hero:",
        successMsg: "Bagus sekali! Blueprint Hero sudah tersimpan di memori."
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
        mission: "Tantangan: Ciptakan wujud nyata dari Hero dan simpan ke variabel 'pahlawan_pertama'.",
        defaultCode: "class Hero:\n    pass\n\n# Ciptakan object di bawah ini\n",
        check: "pahlawan_pertama = Hero()",
        successMsg: "Luar biasa! Karakter pertamamu sudah lahir ke dunia nyata."
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
        mission: "Tantangan: Ciptakan wujud nyata dari Hero dan simpan ke variabel 'pahlawan_pertama'.",
        defaultCode: "class Hero:\n    pass\n\n# Ciptakan object di bawah ini\n",
        check: "pahlawan_pertama = Hero()",
        successMsg: "Luar biasa! Karakter pertamamu sudah lahir ke dunia nyata."
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
        mission: "Tantangan: Ciptakan wujud nyata dari Hero dan simpan ke variabel 'pahlawan_pertama'.",
        defaultCode: "class Hero:\n    pass\n\n# Ciptakan object di bawah ini\n",
        check: "pahlawan_pertama = Hero()",
        successMsg: "Luar biasa! Karakter pertamamu sudah lahir ke dunia nyata."
      }
    ]
  },
  {
    id: 2,
    title: "Modul 2: Constructor",
    pages: [
      {
        subtitle: "Pengenalan Constructor",
        youtubeId: null,
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
        mission: "Tantangan: Cetak kalimat 'Siap membuat game RPG!' ke terminal.",
        defaultCode: "# Tulis kodemu di bawah baris ini\n\n",
        check: "print('Siap membuat game RPG!')",
        successMsg: "Mantap! Mari kita buat cetakan pertamamu di halaman selanjutnya."
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
        mission: "Tantangan: Buatlah sebuah class kosong bernama 'Hero'.",
        defaultCode: "# Buat blueprint Hero di bawah ini\n",
        check: "class Hero:",
        successMsg: "Bagus sekali! Blueprint Hero sudah tersimpan di memori."
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
        mission: "Tantangan: Buatlah sebuah class kosong bernama 'Hero'.",
        defaultCode: "# Buat blueprint Hero di bawah ini\n",
        check: "class Hero:",
        successMsg: "Bagus sekali! Blueprint Hero sudah tersimpan di memori."
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
        mission: "Tantangan: Buatlah sebuah class kosong bernama 'Hero'.",
        defaultCode: "# Buat blueprint Hero di bawah ini\n",
        check: "class Hero:",
        successMsg: "Bagus sekali! Blueprint Hero sudah tersimpan di memori."
      }
    ]
  }
];