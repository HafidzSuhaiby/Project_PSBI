import db from '../config/db.js';

export const getProfileById = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM profiles WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.json({ data: rows[0] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    const { xp } = req.body;
    try {
        const [current] = await db.execute('SELECT * FROM profiles WHERE id = ?', [req.params.id]);
        if (current.length === 0) return res.status(404).json({ message: "Profile not found" });

        let newXP = xp !== undefined ? Number(xp) : current[0].xp;
        let newLevel = Number(current[0].level);
        
        // Gunakan WHILE agar jika XP melonjak drastis, level naik beberapa kali
        while (newXP >= newLevel * 100) {
            newXP -= (newLevel * 100);
            newLevel += 1;
        }

        await db.execute(
            'UPDATE profiles SET xp = ?, level = ? WHERE id = ?',
            [newXP, newLevel, req.params.id]
        );
        
        res.json({ 
            message: "Progress updated successfully",
            data: { xp: newXP, level: newLevel } 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};