const Provider = require('../Model/provider');

// Create a new provider
exports.createProvider = async (req, res) => {
    try {
      const { name, companyName, baseLocation, idNumber, creditAmountLimit, phone, personalPhoneNumber, password, serviceDetails } = req.body;
  
      const serviceData = Array.isArray(serviceDetails) ? serviceDetails.map(s => ({
        serviceType: s.serviceType,
        basicAmount: s.basicAmount,
        kmForBasicAmount: s.kmForBasicAmount,
        overRideCharge: s.overRideCharge,
      })) : [];
  
      const provider = new Provider({
        name,
        companyName,
        baseLocation,
        idNumber,
        creditAmountLimit,
        phone,
        personalPhoneNumber,
        password,
        image: req.file ? req.file.filename : null,
        serviceDetails: serviceData,
      });
  
      await provider.save();
      res.status(201).json(provider);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

// Get all providers
exports.getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find().populate('baseLocation serviceDetails.serviceType');
    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a provider by ID
exports.getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).populate('baseLocation serviceDetails.serviceType');
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a provider by ID
exports.updateProvider = async (req, res) => {
    try {
      const { name, companyName, baseLocation, idNumber, creditAmountLimit, phone, personalPhoneNumber, password, serviceDetails } = req.body;
  
      const provider = await Provider.findById(req.params.id);
      if (!provider) return res.status(404).json({ message: 'Provider not found' });
  
      provider.name = name || provider.name;
      provider.companyName = companyName || provider.companyName;
      provider.baseLocation = baseLocation || provider.baseLocation;
      provider.idNumber = idNumber || provider.idNumber;
      provider.creditAmountLimit = creditAmountLimit || provider.creditAmountLimit;
      provider.phone = phone || provider.phone;
      provider.personalPhoneNumber = personalPhoneNumber || provider.personalPhoneNumber;
      provider.password = password || provider.password;
      provider.image = req.file ? req.file.filename : provider.image;
  
      if (serviceDetails) {
        provider.serviceDetails = serviceDetails.map(s => ({
          serviceType: s.serviceType,
          basicAmount: s.basicAmount,
          kmForBasicAmount: s.kmForBasicAmount,
          overRideCharge: s.overRideCharge,
        }));
      }
  
      await provider.save();
      res.status(200).json(provider);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

// Delete a provider by ID
exports.deleteProvider = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndDelete(req.params.id);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
