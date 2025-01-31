const Booking = require('../Model/booking');
const Driver = require('../Model/driver'); // Import your Driver model
const Provider = require('../Model/provider'); // Import your Provider model
const multer = require('multer')



// Controller to create a booking

exports.createBooking = async (req, res) => {
    try {
        const bookingData = req.body;

        // Handle the case where 'company' is an empty string
        if (!bookingData.company || bookingData.company === "") {
            bookingData.company = null; // Or you can delete the field entirely if required
        }

        // Create the booking document
        const newBooking = new Booking(bookingData);

        await newBooking.save();

        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
};

// Controller to get Order completed booking  by search query

exports.getOrderCompletedBookings = async (req, res) => {
    try {
        let { search, startDate, endDate, page = 1, limit = 10 } = req.query;

        // Convert page and limit to integers
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);

        const query = {
            status: "Order Completed", // Filter only bookings with this status
        };
        

        // Handle search
        if (search) {
            search = search.trim();
            const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (dateRegex.test(search)) {
                const [day, month, year] = search.split('/');
                const startOfDay = new Date(`${year}-${month}-${day}T00:00:00Z`);
                const endOfDay = new Date(`${year}-${month}-${day}T23:59:59Z`);

                query.createdAt = {
                    $gte: startOfDay,
                    $lte: endOfDay,
                };
            } else {
                const searchRegex = new RegExp(search.replace(/\s+/g, ''), 'i');
                const matchingDrivers = await Driver.find({ phone: searchRegex }).select('_id');
                const matchingProviders = await Provider.find({ phone: searchRegex }).select('_id');

                query.$or = [
                    { fileNumber: searchRegex },
                    { mob1: searchRegex },
                    { customerVehicleNumber: searchRegex },
                    { bookedBy: searchRegex },
                    { driver: { $in: matchingDrivers.map(d => d._id) } },
                    { provider: { $in: matchingProviders.map(p => p._id) } },
                ];
            }
        }

        // Handle date range filter
        if (startDate || endDate) {
            query.createdAt = query.createdAt || {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        // Pagination and sorting by createdAt in descending order
        const total = await Booking.countDocuments(query);
        const bookings = await Booking.find(query)
            .populate('baselocation')
            .populate('showroom')
            .populate('serviceType')
            .populate('company')
            .populate('driver')
            .populate('provider')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });  // Sorting by createdAt in descending order

        res.status(200).json({
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            bookings,
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error while fetching bookings' });
    }
};


// Controller to get Booking Completed by search query

exports.getAllBookings = async (req, res) => {
    try {
        let { search, startDate, endDate, page = 1, limit = 10 } = req.query;

        // Convert page and limit to integers
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);

        const query = {
            status: "Booking Added", // Filter only bookings with this status
        };
        

        // Handle search
        if (search) {
            search = search.trim();
            const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (dateRegex.test(search)) {
                const [day, month, year] = search.split('/');
                const startOfDay = new Date(`${year}-${month}-${day}T00:00:00Z`);
                const endOfDay = new Date(`${year}-${month}-${day}T23:59:59Z`);

                query.createdAt = {
                    $gte: startOfDay,
                    $lte: endOfDay,
                };
            } else {
                const searchRegex = new RegExp(search.replace(/\s+/g, ''), 'i');
                const matchingDrivers = await Driver.find({ phone: searchRegex }).select('_id');
                const matchingProviders = await Provider.find({ phone: searchRegex }).select('_id');

                query.$or = [
                    { fileNumber: searchRegex },
                    { mob1: searchRegex },
                    { customerVehicleNumber: searchRegex },
                    { bookedBy: searchRegex },
                    { driver: { $in: matchingDrivers.map(d => d._id) } },
                    { provider: { $in: matchingProviders.map(p => p._id) } },
                ];
            }
        }

        // Handle date range filter
        if (startDate || endDate) {
            query.createdAt = query.createdAt || {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        // Pagination and sorting by createdAt in descending order
        const total = await Booking.countDocuments(query);
        const bookings = await Booking.find(query)
            .populate('baselocation')
            .populate('showroom')
            .populate('serviceType')
            .populate('company')
            .populate('driver')
            .populate('provider')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });  // Sorting by createdAt in descending order

        res.status(200).json({
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            bookings,
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error while fetching bookings' });
    }
};


// Controller to get a booking by ID

exports.getBookingById = async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await Booking.findById(id)
            .populate('baselocation') // Populate related documents
            .populate('showroom')
            .populate('serviceType')
            .populate('company')
            .populate('driver')
            .populate('provider');
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        res.status(200).json(booking);
    } catch (error) {
        console.error('Error fetching booking by ID:', error);
        res.status(500).json({ message: 'Server error while fetching the booking' });
    }
};

// Controller to update a booking by ID

exports.updateBooking = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    console.log("adjust", updatedData);

    try {
        // Handle the case where 'company' is an empty string in update
        if (!updatedData.company || updatedData.company === "") {
            updatedData.company = null; // Or you can delete the field entirely if required
        }

        // Check if the body contains 'driver' and handle 'provider' if it exists
        if (updatedData.driver) {
            const booking = await Booking.findById(id); // Fetch the existing booking to check for the provider
            if (booking && booking.provider) {
                // If there's a provider and driver is being set, remove provider and set driver
                await Booking.updateOne({ _id: id }, { $unset: { provider: "" } }); // Remove provider
            }
        }

        // Check if the body contains 'provider' and handle 'driver' if it exists
        if (updatedData.provider) {
            const booking = await Booking.findById(id); // Fetch the existing booking to check for the driver
            if (booking && booking.driver) {
                // If there's a driver and provider is being set, remove driver and set provider
                await Booking.updateOne({ _id: id }, { $unset: { driver: "" } }); // Remove driver
            }
        }

        const updatedBooking = await Booking.findByIdAndUpdate(id, updatedData, { new: true })
            .populate('baselocation') // Populate related documents
            .populate('showroom')
            .populate('serviceType')
            .populate('company')
            .populate('driver')
            .populate('provider');

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Error updating booking', error: error.message });
    }
};


// Controller to delete a booking by ID

// exports.deleteBooking = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const deletedBooking = await Booking.findByIdAndDelete(id);

//         if (!deletedBooking) {
//             return res.status(404).json({ message: 'Booking not found' });
//         }

//         res.status(200).json({ message: 'Booking deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting booking:', error);
//         res.status(500).json({ message: 'Error deleting booking', error: error.message });
//     }
// };


// Controller for updatatin pickup details from admin side 

exports.updatePickupByAdmin = async (req, res) => {
  
    try {
        const { id } = req.params;
        const {
            totalDistence,
            totalAmount,
            pickupTime,
            dropoffTime,
            serviceVehicleNumber,
            driverSalaryCheck,
            compnayAmountCheck,
            remark,
        } = req.body;
        console.log(req.body)
        console.log(id)

      

        // Update the booking
        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            {
                totalDistence,
                totalAmount,
                pickupTime,
                dropoffTime,
                driverSalaryCheck,
                compnayAmountCheck,
                remark,
                serviceVehicleNumber,
                status: 'Order Completed',
            },
            { new: true } // Return the updated document
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        res.status(200).json({
            message: 'Booking updated successfully.',
            booking: updatedBooking,
        });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};


// remove the pickup image 

exports.removePickupImages = async (req, res) => {
    const { id, index } = req.params;

    if (!id) {
        return res.status(400).json({ message: "ID is required" });
    }

    try {
        // Find the booking by ID
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const pickupImages = booking.pickupImages;

        // Check if the index is valid
        if (index < 0 || index >= pickupImages.length) {
            return res.status(400).json({ message: "Invalid index" });
        }

        // Remove the image at the specified index
        const removedImage = pickupImages.splice(index, 1);

        // Save the updated booking
        booking.pickupImages = pickupImages;
        await booking.save();

        res.status(200).json({
            message: "Image removed successfully",
            removedImage,
        });
    } catch (error) {
        console.error("Error removing pickup image:", error);
        res.status(500).json({ error: error.message });
    }
};


// add pickup images

exports.addPickupImages = async (req, res) => {
    console.log("first");
  
    const { id } = req.params;
    console.log("id", req.params);
  
    try {
      // Find the booking document by ID
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      // Get new image paths from the uploaded files
      const newImages = req.files && req.files.length ? req.files.map(file => file.filename) : [];
      console.log(newImages)
  
      if (!newImages.length) {
        return res.status(400).json({ message: 'No images were uploaded.' });
      }
  
      // Calculate the total number of images (existing + new)
      const totalImages = booking.pickupImages.length + newImages.length; // For pickup
  
      // If total images exceed the limit, return an error
      if (totalImages > 6) {
        return res.status(400).json({
          message: `Limit exceeded. You can upload a maximum of 6 images for pickup images. You already have ${booking.pickupImages.length} images.`,
        });
      }
  
      // Push new images to the pickupImages array
      booking.pickupImages.push(...newImages);
  
      // Save the updated booking
      await booking.save();
  
      // Respond with the updated pickup images
      res.status(200).json({
        message: 'Pickup images added successfully',
        pickupImages: booking.pickupImages,
      });
    } catch (error) {
      console.error('Error in addPickupImages:', error);
      res.status(500).json({ message: 'Error updating booking', error: error.message });
    }
  };
  

  // remove the dropoff image 

exports.removeDropoffImages = async (req, res) => {
    const { id, index } = req.params;

    if (!id) {
        return res.status(400).json({ message: "ID is required" });
    }

    try {
        // Find the booking by ID
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const dropoffImages = booking.dropoffImages;

        // Check if the index is valid
        if (index < 0 || index >= dropoffImages.length) {
            return res.status(400).json({ message: "Invalid index" });
        }

        // Remove the image at the specified index
        const removedImage = dropoffImages.splice(index, 1);

        // Save the updated booking
        booking.dropoffImages = dropoffImages;
        await booking.save();

        res.status(200).json({
            message: "Image removed successfully",
            removedImage,
        });
    } catch (error) {
        console.error("Error removing dropoff image:", error);
        res.status(500).json({ error: error.message });
    }
};


// add dropoff images

exports.addDropoffImages = async (req, res) => {
    
  
    const { id } = req.params;
  
    try {
      // Find the booking document by ID
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      // Get new image paths from the uploaded files
      const newImages = req.files && req.files.length ? req.files.map(file => file.filename) : [];
      console.log(newImages)
  
      if (!newImages.length) {
        return res.status(400).json({ message: 'No images were uploaded.' });
      }
  
      // Calculate the total number of images (existing + new)
      const totalImages = booking.dropoffImages.length + newImages.length; // For dropoff
  
      // If total images exceed the limit, return an error
      if (totalImages > 6) {
        return res.status(400).json({
          message: `Limit exceeded. You can upload a maximum of 6 images for dropoff images. You already have ${booking.dropoffImages.length} images.`,
        });
      }
  
      // Push new images to the pickupImages array
      booking.dropoffImages.push(...newImages);
  
      // Save the updated booking
      await booking.save();
  
      // Respond with the updated dropoff images
      res.status(200).json({
        message: 'Dropoff images added successfully',
        dropoffImages: booking.dropoffImages,
      });
    } catch (error) {
      console.error('Error in addDropoffImages:', error);
      res.status(500).json({ message: 'Error updating booking', error: error.message });
    }
  };

  //Editing filenumber 

  exports.updateFilenumber = async (req, res) => {
    const { fileNumber } = req.body; // Destructure fileNumber from the request body
    const { id } = req.params; // Extract id from the request parameters
  
    try {
      // Find the booking by ID and update the fileNumber
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      booking.fileNumber = fileNumber; // Update the fileNumber
      await booking.save(); // Save the updated booking
  
      res.status(200).json({ message: "Filenumber updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating booking", error: error.message });
    }
  };
  
//   Booking verify 

exports.verifyBooking = async (req, res) => {
  
    try {
        const { id } = req.params;
        
        console.log(id,'this is id')

        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            {
                verified:true
            },
            { new: true } // Return the updated document
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        res.status(200).json({
            message: 'Booking verified successfully.',
            booking: updatedBooking,
        });
    } catch (error) {
        console.error('Error verifying booking:', error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};