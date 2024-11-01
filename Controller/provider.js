const Provider = require('../Model/provider');

// Create a new provider
exports.createProvider = async (req, res) => {
    try {
      const providerData = {
        ...req.body,
        image: req.file ? req.file.filename : null, // Save the image path
      };
      const provider = new Provider(providerData);
      await provider.save();
      res.status(201).json(provider);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

// Get all providers
exports.getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find().populate('baseLocation serviceType');
    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a provider by ID
exports.getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).populate('baseLocation serviceType');
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a provider by ID
exports.updateProvider = async (req, res) => {
    try {
      const providerData = {
        ...req.body,
        image: req.file ? req.file.filename : null, // Update the image path
      };
      const provider = await Provider.findByIdAndUpdate(req.params.id, providerData, { new: true, runValidators: true });
      if (!provider) return res.status(404).json({ message: 'Provider not found' });
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
