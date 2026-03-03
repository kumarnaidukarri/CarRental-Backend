import BookingModel from "../models/Booking.js";
import CarModel from "../models/Car.js";

//  Utility Function to check Availability of a Car for a given data.
const checkAvailability = async (car, startDate, endDate) => {
  const bookings = await BookingModel.find({
    car,
    returnDate: { $gte: startDate },
    pickupDate: { $lte: endDate },
  }); // checks 'car is available between two dates.'
  /*
    1 -> 5,  
    10 -> 15, 
    20 -> 25
    new booking: 6 -> 9
    start > old return
    end   < old pickup
   */

  /* ex: 
      i) OldBooking: (1 - 5),   NewBooking: (10 - 14).     so, (1,2,3,4,5)  (10,11,12,13,14)  
         they don't overlap. so, booking allowed 
      ii) OldBooking: (2 - 8),   NewBooking: (6 - 12)      so, (2,3,4,5,6,7,8)  (6,7,8,9,10,11,12)
         they overlapping.   so, booking is not allowed. 
      
      conditions:
      newbooking start  >  previous return date
      new booking end   <  previous pickup date  
  */

  return bookings.length === 0;
};

// controller function - API to 'Check Availability of Cars' in a specific Location for for the given 'Date range'.
const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    // Fetch all available cars for the given location
    const cars = await CarModel.find({ location, isAvailable: true });

    // Check car availability for the given date range using Promise
    const availableCarsPromises = cars.map(async (car) => {
      const isAvailable = await checkAvailability(
        car._id,
        pickupDate,
        returnDate,
      );
      return { ...car.toObject(), isAvailable: isAvailable }; // converts 'car Mongoose Document Object' into 'Plain Javascript Object'
    });

    let availableCars = await Promise.all(availableCarsPromises);
    availableCars = availableCars.filter((car) => car.isAvailable === true);

    res.json({ success: true, availableCars });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// controller function - API to Create a Booking
const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    const isAvailable = await checkAvailability(car, pickupDate, returnDate);
    if (!isAvailable) {
      return res.json({ success: false, message: "Car is not available" });
    }

    const carData = await CarModel.findById(car);

    // Calculate price based on pickup date and return date.
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
    const price = carData.pricePerDay * noOfDays;

    const booking = await BookingModel.create({
      car,
      owner: carData.owner,
      user: _id,
      pickupDate,
      returnDate,
      price,
    }); // Inserts new data into booking

    res.json({ success: true, message: "Booking Created", booking });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// controller function - API to List the 'User Bookings'
const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;

    const bookings = await BookingModel.find({ user: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// controller function - API to Get 'Owner Bookings'
const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const bookings = await BookingModel.find({ owner: req.user._id })
      .populate("car user")
      .select("-user.password")
      .sort({ createdAt: -1 }); // Find DB Query

    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
