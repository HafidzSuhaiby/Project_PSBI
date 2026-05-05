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

        const cleanText = extractedText.slice(0, 12000).replace(/\s+/g, ' ');

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: `Anda adalah Pynara, asisten AI pakar Python untuk siswa SMK. 
Tugas Anda adalah merangkum materi Pemrograman Berorientasi Objek (PBO) dari teks PDF menjadi modul belajar dalam format JSON murni.

STRATEGI KONTEN:
1. Analogi: Gunakan dunia nyata (Game RPG, Motor, HP). Sapaan: "Bro/Sis".
2. Struktur Materi: Pecah menjadi 3-5 halaman (pages).
3. Evaluasi: Tambahkan 5 soal pilihan ganda di akhir modul.

WAJIB MENGIKUTI STRUKTUR JSON BERIKUT:
{
  "id": number,
  "title": "Judul Modul",
  "pages": [
    {
      "subtitle": "Subjudul Halaman",
      "youtubeId": null,
      "content": [
        {
          "text": "Penjelasan konsep (Markdown support)",
          "code": "Contoh kode Python atau null jika tidak ada kode"
        }
      ],
      "mission": "Instruksi tugas praktikum",
      "defaultCode": "Template kode awal untuk dikerjakan siswa",
      "check": "String kunci untuk validasi jawaban",
      "answerCode": "Solusi kode yang benar",
      "successMsg": "Pesan motivasi saat berhasil",
      "voiceSummary": "Ringkasan materi dalam 2-3 kalimat untuk narasi suara"
    }
  ],
  "evaluation": [
    {
      "question": "Pertanyaan soal",
      "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
      "answer": index_jawaban_benar (0-3)
    }
  ]
}` 
                },
                { 
                    role: "user", 
                    content: `Teks PDF: "${cleanText}". Buatlah satu modul lengkap dengan format tersebut.` 
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

        // Parsing hasil untuk memastikan formatnya benar sebelum dikirim
        const parsedData = JSON.parse(aiResponse);

        res.json({ 
            success: true, 
            data: parsedData 
        });

    } catch (error) {
        console.error("AI Analysis Error:", error);
        res.status(500).json({ 
            success: false, 
            error: error.message || "Terjadi kesalahan saat memproses materi." 
        });
    }
};