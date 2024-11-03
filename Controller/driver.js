// controllers/driver.controller.js
const Driver = require('../Model/driver');

exports.createDriver = async (req, res) => {
  try {
    const { name, idNumber, phone, personalPhoneNumber, password, vehicle } = req.body;

    const vehicleData = Array.isArray(vehicle) ? vehicle.map(v => ({
      serviceType: v.serviceType,
      basicAmount: v.basicAmount,
      kmForBasicAmount: v.kmForBasicAmount,
      overRideCharge: v.overRideCharge,
      vehicleNumber: v.vehicleNumber,
    })) : [];

    const driver = new Driver({
      name,
      idNumber,
      phone,
      personalPhoneNumber,
      password,
      image: req.file ? req.file.filename : null,
      vehicle: vehicleData,
    });

    await driver.save();
    res.status(201).json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().populate('vehicle.serviceType');
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).populate('vehicle.serviceType');
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDriver = async (req, res) => {
  try {
    const { name, idNumber, phone, personalPhoneNumber, password, vehicle } = req.body;

    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });

    driver.name = name || driver.name;
    driver.idNumber = idNumber || driver.idNumber;
    driver.phone = phone || driver.phone;
    driver.personalPhoneNumber = personalPhoneNumber || driver.personalPhoneNumber;
    driver.password = password || driver.password;
    driver.image = req.file ? req.file.filename : driver.image;

    if (vehicle) {
      driver.vehicle = vehicle.map(v => ({
        serviceType: v.serviceType,
        basicAmount: v.basicAmount,
        kmForBasicAmount: v.kmForBasicAmount,
        overRideCharge: v.overRideCharge,
        vehicleNumber: v.vehicleNumber,
      }));
    }

    await driver.save();
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json({ message: 'Driver deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

