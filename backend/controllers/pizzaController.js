import Pizza from "../models/Pizza.js";


//  Create a new pizza (Admin only)
// POST: /api/pizzas/ - login required, admin only 
export const createPizza = async (req, res) => {
  try {
    const { name, description, image, category, sizes, extraToppings } = req.body;

    if (!name || !image || !category || !sizes.length) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const newPizza = new Pizza({ name, description, image, category, sizes, extraToppings });
    const savedPizza = await newPizza.save();

    res.status(201).json({ success: true, message: "Pizza created successfully", pizza: savedPizza });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//  Get all pizzas with pagination, sorting, and filtering
// GET: /api/pizzas/ - login not required  
export const getAllPizzas = async (req, res) => {
  try {
    let { page = 1, limit = 10, sortBy, category, size, minPrice, maxPrice } = req.query;

    // Convert to numbers
    page = parseInt(page);
    limit = parseInt(limit);
    minPrice = minPrice ? parseFloat(minPrice) : null;
    maxPrice = maxPrice ? parseFloat(maxPrice) : null;

    // Base query
    let query = {};

    // Filter by category (Veg/Non-Veg)
    if (category) {
      query.category = category;
    }

    // Filter by size (Small, Medium, Large)
    if (size) {
      query["sizes.size"] = size; // Matches pizzas where the given size exists
    }

    // Filter by price range
    if (minPrice !== null || maxPrice !== null) {
      query["sizes.price"] = {}; // Initialize price filter
      if (minPrice !== null) query["sizes.price"].$gte = minPrice;
      if (maxPrice !== null) query["sizes.price"].$lte = maxPrice;
    }

    // Sorting logic
    let sortOptions = {};
    if (sortBy === "priceAsc") {
      sortOptions["sizes.price"] = 1; // Sort by lowest size price ascending
    } else if (sortBy === "priceDesc") {
      sortOptions["sizes.price"] = -1; // Sort by lowest size price descending
    }

    // Fetch pizzas with pagination, filtering, and sorting
    const pizzas = await Pizza.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    // Get total count for pagination
    const totalPizzas = await Pizza.countDocuments(query);

    res.json({
      success: true,
      message: "Pizzas fetched successfully",
      totalPizzas,
      totalPages: Math.ceil(totalPizzas / limit),
      currentPage: page,
      pizzas,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//  Get a single pizza by ID
// GET: /api/pizzas/:id - login not required  
export const getPizzaById = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ success: false, message: "Pizza not found" });
    }
    res.json({ success: true, message: "Pizza fetched successfully", pizza });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Update a pizza (Admin only)
// PUT: /api/pizzas/:id - login required, admin only  
export const updatePizza = async (req, res) => {
  try {
    const updatedPizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPizza) {
      return res.status(404).json({ success: false, message: "Pizza not found" });
    }
    res.json({ success: true, message: "Pizza updated successfully", pizza: updatedPizza });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Delete a pizza (Admin only)
// DELETE: /api/pizzas/:id - login required, admin only 
export const deletePizza = async (req, res) => {
  try {
    const deletedPizza = await Pizza.findByIdAndDelete(req.params.id);
    if (!deletedPizza) {
      return res.status(404).json({ success: false, message: "Pizza not found" });
    }
    res.json({ success: true, message: "Pizza deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

