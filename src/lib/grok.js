export const analyzeWithGemini = async (extractedText) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY?.trim();
  const url = "https://api.groq.com/openai/v1/chat/completions";

  // Mengambil potongan teks yang cukup luas untuk mendapatkan konteks materi PDF
  const cleanText = extractedText.slice(0, 15000).replace(/\s+/g, ' ');

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { 
            role: "system", 
            content: `Anda adalah Pynara, asisten AI pakar Python yang mengajar siswa SMK dengan gaya santai, seru, dan mudah dimengerti.
            
            TUGAS UTAMA:
            Ubah materi Pemrograman Berorientasi Objek (PBO) dari teks PDF menjadi modul belajar Python interaktif dalam format JSON.

            STRATEGI MENGAJAR SMK:
            1. Gunakan analogi dunia nyata yang dekat dengan anak muda (Game RPG, Skin Mobile Legends, Spesifikasi HP, atau Komponen Motor).
            2. Hindari bahasa dewa/teoretis yang membosankan. Gunakan sapaan "Bro/Sis/Kamu".
            3. Narasi harus panjang dan jelas, menjelaskan "Kenapa ini penting?" bukan hanya "Apa itu?".
            4. Pecah materi menjadi minimal 3-5 halaman (pages) agar tidak menumpuk.

            STRUKTUR JSON WAJIB:
            {
              "title": "Judul Bab yang Menarik",
              "pages": [
                { 
                  "narrative": "Penjelasan mendalam menggunakan analogi (Gunakan Markdown untuk bold/italic). Jelaskan konsep Class sebagai 'Cetakan' dan Object sebagai 'Hasil Cetakan'.", 
                  "mission": "Instruksi praktikum sederhana, misal: 'Buatlah objek ksatria dari class Hero'.", 
                  "defaultCode": "Template kode Python yang sudah ada sebagian.", 
                  "check": "Kata kunci kode yang harus ada untuk lulus.", 
                  "successMsg": "Pesan semangat saat berhasil!" 
                }
              ]
            }` 
          },
          { 
            role: "user", 
            content: `Berdasarkan teks PDF ini: "${cleanText}", buatlah modul belajar Python. 
            Fokus pada konsep utama yang ada di teks tersebut (seperti Class, Object, Encapsulation, atau Inheritance). 
            Pastikan penjelasannya sangat mudah dipahami anak SMK dan berikan contoh kode yang relevan.` 
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Terjadi kesalahan pada API Groq");
    }

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      throw new Error("AI tidak memberikan jawaban, coba lagi.");
    }

  } catch (error) {
    console.error("Detail Error Groq:", error);
    throw error;
  }
};