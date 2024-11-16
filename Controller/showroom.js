const Showroom = require('../Model/showroom');
const bcrypt = require('bcrypt');

// Create a showroom
exports.createShowroom = async (req, res) => {
  try {
    const {
     name, showroomId, description, location, latitude, longitude,
      username, password, helpline, phone, mobile, state, district, services
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const imagePath = req.file ? req.file.filename : null;

    const showroom = new Showroom({
      name,
      showroomId,
      description,
      location,
      latitude,
      longitude,
      username,
      password: hashedPassword,
      helpline,
      phone,
      mobile,
      state,
      district,
      image: imagePath,
      services: {
        serviceCenter: {
          selected: services.serviceCenter.selected,
          amount: services.serviceCenter.amount || null
        },
        bodyShop: {
          selected: services.bodyShop.selected,
          amount: services.bodyShop.amount || null
        },
        showroom: {
          selected: services.showroom.selected
        }
      }
    });

    const savedShowroom = await showroom.save();
    res.status(201).json(savedShowroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all showrooms
exports.getShowrooms = async (req, res) => {
  try {
    const showrooms = await Showroom.find();
    res.json(showrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a showroom
exports.updateShowroom = async (req, res) => {
  try {
    const { id } = req.params;
    const {
         name, showroomId, description, location, latitude, longitude,
      username, password, helpline, phone, mobile, state, district, services
    } = req.body;

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const imagePath = req.file ? req.file.filename : null

    const updatedFields = {
      name,
      showroomId,
      description,
      location,
      latitude,
      longitude,
      username,
      phone,
      mobile,
      state,
      district,
      helpline,
      ...(hashedPassword && { password: hashedPassword }),
      ...(imagePath && { image: imagePath }),
      services: {
        serviceCenter: {
          selected: services.serviceCenter.selected,
          amount: services.serviceCenter.amount || null
        },
        bodyShop: {
          selected: services.bodyShop.selected,
          amount: services.bodyShop.amount || null
        },
        showroom: {
          selected: services.showroom.selected
        }
      }
    };

    const updatedShowroom = await Showroom.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedShowroom) {
      return res.status(404).json({ message: 'Showroom not found' });
    }

    res.json(updatedShowroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a showroom
exports.deleteShowroom = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedShowroom = await Showroom.findByIdAndDelete(id);
    if (!deletedShowroom) {
      return res.status(404).json({ message: 'Showroom not found' });
    }
    res.json({ message: 'Showroom deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
