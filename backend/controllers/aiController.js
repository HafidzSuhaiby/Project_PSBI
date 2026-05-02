import Groq from "groq-sdk";
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const analyzeWithGemini = async (req, res) => {
    try {
        const { text: extractedText } = req.body;

        if (!extractedText) {
            return res.status(400).json({ success: false, error: "Tidak ada teks yang diekstrak." });
        }

        // Membersihkan dan membatasi teks agar tidak melebihi context window
        const cleanText = extractedText.slice(0, 12000).replace(/\s+/g, ' ');

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: `Anda adalah Pynara, asisten AI pakar Python untuk siswa SMK. 
Tugas Anda adalah merangkum teks PDF menjadi modul belajar dalam format JSON murni.

TUGAS UTAMA:
Ubah materi Pemrograman Berorientasi Objek (PBO) dari teks PDF menjadi modul belajar Python interaktif dalam format JSON.

ATURAN OUTPUT:
1. Output HARUS berupa JSON object yang valid.
2. JANGAN sertakan markdown seperti \`\`\`json di awal atau penjelasan teks di luar JSON.
3. Jika teks PDF tidak cukup jelas, buatkan materi dasarnya berdasarkan topik yang terdeteksi.

STRATEGI MENGAJAR SMK:
1. Gunakan analogi dunia nyata yang dekat dengan anak muda (Game RPG, Skin Mobile Legends, Spesifikasi HP, atau Komponen Motor).
2. Hindari bahasa dewa/teoretis yang membosankan. Gunakan sapaan "Bro/Sis/Kamu".
3. Narasi harus panjang dan jelas, menjelaskan "Kenapa ini penting?" bukan hanya "Apa itu?".
4. Pecah materi menjadi minimal 3-5 halaman (pages) agar tidak menumpuk.

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
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" },
            temperature: 0.3, 
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content;

        if (!aiResponse) {
            throw new Error("AI tidak memberikan respon valid.");
        }

        // Mengirimkan hasil sebagai objek JSON agar bisa langsung diproses Frontend
        res.json({ 
            success: true, 
            data: JSON.parse(aiResponse) 
        });

    } catch (error) {
        console.error("AI Analysis Error:", error);
        res.status(500).json({ 
            success: false, 
            error: error.message || "Terjadi kesalahan saat memproses materi." 
        });
    }
};