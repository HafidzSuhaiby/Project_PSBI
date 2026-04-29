export const analyzeWithGemini = async (extractedText) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY?.trim();
  const url = "https://api.groq.com/openai/v1/chat/completions";

  // Membatasi teks agar tidak melebihi context window Groq (llama 3.1 8b cukup sensitif)
  const cleanText = extractedText.slice(0, 12000).replace(/\s+/g, ' ');

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
            // PERBAIKAN: Menambahkan instruksi eksplisit tentang format JSON murni
            content: `Anda adalah Pynara, asisten AI pakar Python untuk siswa SMK. 
            Tugas Anda adalah merangkum teks PDF menjadi modul belajar dalam format JSON murni.
            
            ATURAN OUTPUT:
            1. Output HARUS berupa JSON object yang valid.
            2. JANGAN sertakan markdown seperti \`\`\`json di awal atau penjelasan teks di luar JSON.
            3. Jika teks PDF tidak cukup jelas, buatkan materi dasarnya berdasarkan topik yang terdeteksi.

            STRUKTUR JSON:
            {
              "title": "Judul Seru",
              "pages": [
                { 
                  "narrative": "Penjelasan detail (Markdown support)", 
                  "mission": "Tugas praktikum", 
                  "defaultCode": "Template kode", 
                  "check": "Kata kunci validasi", 
                  "successMsg": "Pesan sukses" 
                }
              ]
            }` 
          },
          { 
            role: "user", 
            content: `Teks PDF: "${cleanText}". Buatlah modul minimal 3 halaman berdasarkan teks tersebut.` 
          }
        ],
        // PERBAIKAN: Menurunkan temperature agar AI lebih patuh pada format JSON
        response_format: { type: "json_object" },
        temperature: 0.3, 
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // Menangani error 400 atau error API lainnya
      throw new Error(data.error?.message || `API Error: ${response.status}`);
    }

    if (data.choices && data.choices[0].message.content) {
      // Pastikan output adalah string JSON yang bisa di-parse
      return data.choices[0].message.content;
    } else {
      throw new Error("AI tidak memberikan respon valid.");
    }

  } catch (error) {
    console.error("Detail Error Groq:", error);
    throw error;
  }
};