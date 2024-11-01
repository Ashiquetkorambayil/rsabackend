// controllers/staffController.js
const Staff = require('../Model/staff');

// Create Staff
exports.createStaff = async (req, res) => {
    try {
      const staffData = new Staff({
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        userName: req.body.userName,
        password: req.body.password,
        image: req.file ? req.file.filename : null, // Store the image 
        role: req.body.role,
      });
  
      await staffData.save();
      res.status(201).json({ message: 'Staff created successfully!', data: staffData });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Read Staff (Get all staff)
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().populate('role');
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read Staff by ID
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).populate('role');
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Staff
exports.updateStaff = async (req, res) => {
    try {
      const updatedData = {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        userName: req.body.userName,
        password: req.body.password,
        image: req.file ? req.file.filename : null, // Update the image if a new one is uploaded
        role: req.body.role,
      };
  
      const staff = await Staff.findByIdAndUpdate(req.params.id, updatedData, { new: true });
      if (!staff) return res.status(404).json({ message: 'Staff not found' });
      res.status(200).json({ message: 'Staff updated successfully!', data: staff });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Delete Staff
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.status(200).json({ message: 'Staff deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
