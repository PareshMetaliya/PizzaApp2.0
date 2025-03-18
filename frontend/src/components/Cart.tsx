import { Trash2 } from "lucide-react"; // Delete icon
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  selectCart,
  selectTotalAmount,
} from "@/redux/slices/cartSlice";
import { AppDispatch } from "@/redux/store";
import { useEffect, useState } from "react";
import CheckoutModal from "./CheckoutModal";
import { createOrder, verifyPayment } from "@/redux/thunk/orderThunks";
import { selectIsAuthenticated, selectUser } from "@/redux/slices/authSlice";
import { createOrderApi } from "@/api/orderAPI";
import { useNavigate } from "react-router";
import { selectOrders } from "@/redux/slices/orderSlice";
import toast from 'react-hot-toast';
import { CreateOrderInput } from "@/schema/orderSchema";

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items } = useSelector(selectCart);
  const calculateTotalPrice = useSelector(selectTotalAmount);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const orders = useSelector(selectOrders);
  const lastOrder = orders.length > 0 ? orders[orders.length - 1] : null;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false); // Track if order is placed

  // Handle quantity change
  const handleQuantityChange = ({
    type,
    pizzaId,
    size,
    extraToppings,
  }: any) => {
    if (type === "increment") {
      dispatch(increaseQuantity({ pizzaId, size, extraToppings }));
    }
    if (type === "decrement") {
      dispatch(decreaseQuantity({ pizzaId, size, extraToppings }));
    }
  };

  // Handle item removal
  const handleRemoveItem = ({ pizzaId, size, extraToppings }: any) => {
    dispatch(removeFromCart({ pizzaId, size, extraToppings }));
    toast.success("Removed from Cart !");
  };

  // Handle checkout button click
  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login/cart")

      toast.success('Login Required !')
    }
    setIsModalOpen(true);
  };

  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Failed to load Razorpay script"));
      document.body.appendChild(script);
    });
  };

  const handleOrderSubmit = async (orderData: any) => {

    if (!user) {
      alert("Login First....")
    } else {

      const Data: CreateOrderInput = {
        paymentMethod: orderData.paymentMethod,
        userId: user._id,
        address: orderData.address,
        products: items.map(
          ({ pizzaDetails, size, extraToppings, quantity, price }) => ({
            pizzaDetails: pizzaDetails.id, // Only the pizza ID
            size,
            extraToppings,
            quantity,
            price,
          })
        ),
        totalAmount: calculateTotalPrice,
      };


      if (orderData.paymentMethod === "COD") {

        dispatch(createOrder(Data));
        setIsModalOpen(false);
        setOrderPlaced(true);

        toast.success('Order Placed Successfully !')


      }

      if (orderData.paymentMethod === "Online") {
        // 🔥 Online Payment Flow
        try {
          await loadRazorpayScript();

          // 1️⃣ Call backend to create a Razorpay order
          const result = await createOrderApi(Data);

          if (!result.success) {
            toast.error("Failed to create order")
            // alert("Failed to create order");
            return;
          }

          // 2️⃣ Open Razorpay payment UI
          const options = {
            key: result.key, // Razorpay API Key
            amount: result.amount,
            currency: result.currency,
            order_id: result.orderId,
            name: "Pizza Rush",
            description: "Order Payment",
            handler: async (response: any) => {
              // 3️⃣ On Success, send payment details to backend
              const paymentData = {
                userId: user?._id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              };

              dispatch(verifyPayment(paymentData)); // Dispatch action with payment details
              setOrderPlaced(true);
              setIsModalOpen(false);

              toast.success('Order Placed Successfully !')

            },
            prefill: {
              name: user?.name,
              email: user?.email,
              contact: 9999999999,
            },
            theme: { color: "#F1C93B" },
          };

          alert(
            "Now Razorpay page will open. Use the following details to complete the payment:\n\n" +
            "1. For UPI: Enter UPI ID 'success@razorpay'\n" +
            "2. For Card: Use card number '4111 1111 1111 1111', any future expiry date, and any CVV\n" +
            "3. Use any 4 digit OTP when use Card for Payment.\n\n" +
            "Click OK to proceed."
          );

          const razorpay = new (window as any).Razorpay(options);
          razorpay.open();
        } catch (error) {

          toast.error("Payment failed. Try again.")
        }
      }
    }

  };
  useEffect(() => {
    if (orderPlaced && orders.length > 0) {
      const lastOrder = orders[orders.length - 1];
      navigate(`/order-status/${lastOrder._id}`);
      setOrderPlaced(false); // Reset state to avoid unwanted navigation
    }
  }, [orders, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="container max-w-6xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-xl mt-20 flex flex-col md:flex-row gap-6">
      {/* Cart Items Section */}

      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>

        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.pizzaDetails.id}
                className="flex flex-col sm:grid sm:grid-cols-[80px_1.5fr_1fr_1fr_1fr_40px] items-center gap-4 border-b pb-4"
              >
                {/* Image */}
                <img
                  src={item.pizzaDetails.image}
                  alt={item.pizzaDetails.name}
                  className="w-20 h-20 rounded-md shadow"
                />

                {/* Item Details */}
                <div className="flex flex-col text-center sm:text-left">
                  <h3 className="text-lg font-semibold">
                    {item.pizzaDetails.name}
                  </h3>
                  <p className="text-gray-600">Size: {item.size}</p>
                  {item.extraToppings && item.extraToppings.length > 0 && (
                    <p className="text-sm text-gray-500">
                      Extra:{" "}
                      {item.extraToppings
                        .map((topping) => topping.name)
                        .join(", ")}
                    </p>
                  )}
                </div>

                {/* Price */}
                <p className="text-lg font-semibold text-blue-600 sm:text-center">
                  ₹{item.price}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <button
                    className="bg-gray-200 px-3 py-1 rounded-md text-lg font-bold"
                    onClick={() =>
                      handleQuantityChange({
                        pizzaId: item.pizzaDetails.id,
                        type: "decrement",
                        size: item.size,
                        extraToppings: item.extraToppings,
                      })
                    }
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold">{item.quantity}</span>
                  <button
                    className="bg-gray-200 px-3 py-1 rounded-md text-lg font-bold"
                    onClick={() =>
                      handleQuantityChange({
                        pizzaId: item.pizzaDetails.id,
                        type: "increment",
                        size: item.size,
                        extraToppings: item.extraToppings,
                      })
                    }
                  >
                    +
                  </button>
                </div>

                {/* Total Price for Item */}
                <p className="text-lg font-semibold sm:text-center">
                  ₹{item.price * item.quantity}
                </p>

                {/* Delete Button */}
                <button
                  onClick={() =>
                    handleRemoveItem({
                      pizzaId: item.pizzaDetails.id,
                      size: item.size,
                      extraToppings: item.extraToppings,
                    })
                  }
                  className="text-red-500"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-6">Your cart is empty.</p>
        )}
      </div>

      {/* Checkout Section (Sticky on Right for Desktop) */}
      {items.length > 0 && (
        <div className="w-full md:w-80 bg-gray-100 p-6 rounded-lg shadow-md md:sticky md:top-40 h-fit">
          <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
          <p className="text-lg font-semibold">
            Total: <span className="text-blue-600">₹{calculateTotalPrice}</span>
          </p>
          <button
            className="mt-4 bg-blue-600 text-white py-3 w-full rounded-lg text-lg font-medium hover:bg-blue-700 transition"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>

          {/* Checkout Modal */}
          <CheckoutModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleOrderSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default Cart;
