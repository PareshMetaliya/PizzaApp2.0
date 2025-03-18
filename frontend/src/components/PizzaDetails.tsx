import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PizzaResponse } from "@/schema/pizzaSchema";
import { getPizzaByIdApi } from "@/api/pizzaAPI";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addToCart } from "@/redux/slices/cartSlice";
import toast from 'react-hot-toast';

const PizzaDetails = () => {

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();


  const { id } = useParams();
  const [pizza, setPizza] = useState<PizzaResponse | null>(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [finalPrice, setFinalPrice] = useState();

  useEffect(() => {
    const fetchPizza = async () => {
      if (!id) return;

      try {
        const response = await getPizzaByIdApi(id);
        if (response.success) {
          setPizza(response.pizza);
          setSelectedSize(response.pizza.sizes[0]); // ✅ Set default size after fetching
        }
      } catch (error) {
      
      }
    };

    fetchPizza();
  }, [id]);

  // Handle size selection
  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  // Handle topping selection
  const handleToppingChange = (topping) => {
    setSelectedToppings((prevToppings) => {
      const isToppingSelected = prevToppings.some((item) => item.name === topping.name);
      return isToppingSelected
        ? prevToppings.filter((item) => item.name !== topping.name)
        : [...prevToppings, topping];
    });
  };

  // Handle quantity change
  const handleQuantityChange = (type) => {
    setQuantity((prev) => (type === "increment" ? prev + 1 : prev > 1 ? prev - 1 : prev));
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    const basePrice = selectedSize?.price || 0; // ✅ Avoid undefined errors
    const toppingsPrice = selectedToppings.reduce((sum, topping) => sum + topping.price, 0);
    const price = (basePrice + toppingsPrice)
    setFinalPrice(price);
  };

  useEffect(()=>{
    calculateTotalPrice();
  },[pizza,selectedSize,selectedToppings,quantity])

  const handleAddToCart = () => {
    const data = {
      pizzaDetails: {
        id: pizza?._id,
        name: pizza?.name,
        image: pizza?.image
      },
      size: selectedSize?.size,
      extraToppings: selectedToppings,
      quantity: quantity,
      price: finalPrice,
    }

    dispatch(addToCart(data));
    toast.success('Added to Cart !')
    navigate('/menu')
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!pizza || !selectedSize) return <p>Loading...</p>; // ✅ Prevent rendering errors

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-xl mt-6 sm:mt-14">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img src={pizza.image} alt={pizza.name} className="w-full h-56 sm:h-auto object-cover rounded-lg sm:p-8" />

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{pizza.name}</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">{pizza.description}</p>
            <p className="text-lg font-semibold mt-2">
              Category: <span className="text-green-600">{pizza.category}</span>
            </p>

            {/* Size Selection */}
            <div className="mt-4">
              <h3 className="text-lg sm:text-xl font-semibold">Select Size:</h3>
              <div className="flex flex-wrap gap-3 mt-2">
                {pizza.sizes.map((size) => (
                  <button
                    key={size.size}
                    className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition ${selectedSize.size === size.size ? "bg-blue-600 text-white" : "bg-gray-100 text-black"
                      }`}
                    onClick={() => handleSizeChange(size)}
                  >
                    {size.size} - ₹{size.price}
                  </button>
                ))}
              </div>
            </div>

            {/* Extra Toppings Selection */}
            <div className="mt-4">
              <h3 className="text-lg sm:text-xl font-semibold">Select Extra Toppings:</h3>
              <div className="flex flex-col mt-2 gap-2">
                {pizza.extraToppings?.map((topping) => (
                  <label key={topping.name} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedToppings.some((item) => item.name === topping.name)}
                      onChange={() => handleToppingChange(topping)}
                      className="w-4 h-4 sm:w-5 sm:h-5 accent-yellow-500"
                    />
                    <span className="text-base sm:text-lg">
                      {topping.name} - ₹{topping.price}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-4 flex items-center gap-3 sm:gap-4">
              <h3 className="text-lg sm:text-xl font-semibold">Quantity:</h3>
              <button
                className="bg-gray-200 px-3 py-1 rounded-lg text-lg font-bold"
                onClick={() => handleQuantityChange("decrement")}
              >
                -
              </button>
              <span className="text-lg sm:text-xl font-semibold">{quantity}</span>
              <button
                className="bg-gray-200 px-3 py-1 rounded-lg text-lg font-bold"
                onClick={() => handleQuantityChange("increment")}
              >
                +
              </button>
            </div>

            {/* Total Price */}
            <div className="mt-4 text-xl sm:text-2xl font-semibold">Total Price: ₹{finalPrice}</div>
          </div>

          {/* Add to Cart Button */}
          <button className="mt-6 bg-blue-600 text-white py-3 rounded-lg text-lg font-medium w-full sm:w-auto hover:bg-blue-700 transition" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaDetails;
