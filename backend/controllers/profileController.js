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
    const { last_page_index, completed_modules, xp } = req.body;
    try {
        const [current] = await db.execute('SELECT * FROM profiles WHERE id = ?', [req.params.id]);
        if (current.length === 0) return res.status(404).json({ message: "Profile not found" });

        const newXP = xp !== undefined ? xp : current[0].xp;
        const newPage = last_page_index !== undefined ? last_page_index : current[0].last_page_index;
        const newModules = completed_modules !== undefined ? completed_modules : current[0].completed_modules;

        await db.execute(
            'UPDATE profiles SET last_page_index = ?, completed_modules = ?, xp = ? WHERE id = ?',
            [newPage, newModules, newXP, req.params.id]
        );
        res.json({ message: "Progress updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};