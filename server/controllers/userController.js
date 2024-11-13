const admin = require('../config/firebase');

const userController = {
  // Obtener perfil de usuario
  getProfile: async (req, res) => {
    try {
      const uid = req.user.uid;
      const userRecord = await admin.auth().getUser(uid);
      res.json({ user: userRecord });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar perfil de usuario
  updateProfile: async (req, res) => {
    try {
      const uid = req.user.uid;
      const updates = req.body;
      await admin.auth().updateUser(uid, updates);
      res.json({ message: 'Perfil actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = userController; 