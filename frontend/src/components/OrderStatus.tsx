import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getOrderByIdApi } from "@/api/orderAPI";
import { OrderResponse } from "@/schema/orderSchema";

const OrderStatus = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {

        if (!orderId) {
          console.error("Order ID is missing");
          return;
        }

        const response = await getOrderByIdApi(orderId);
        if (response.success) {
         
          setOrder(response.order);
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        setError("Failed to fetch order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1 className="text-xl text-gray-700">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Order not found.</p>
      </div>
    );
  }

  // Define the steps for the order status progress bar
  const orderSteps = [
    { status: "Placed", label: "Order Placed" },
    { status: "Processing", label: "Processing" },
    { status: "Out for Delivery", label: "Out for Delivery" },
    { status: "Delivered", label: "Delivered" },
  ];

  // Find the current step index
  const currentStepIndex = orderSteps.findIndex(
    (step) => step.status === order.orderStatus
  );

  return (
    <div className="min-h-screen  mt-16 bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Order Status</h1>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center relative">
            {/* Progress Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2"></div>
            <div
              className="absolute top-1/2 left-0 h-1 bg-green-500 transform -translate-y-1/2"
              style={{
                width: `${(currentStepIndex / (orderSteps.length - 1)) * 100}%`,
              }}
            ></div>

            {/* Steps */}
            {orderSteps.map((step, index) => (
              <div
                key={step.status}
                className="flex flex-col items-center relative z-10"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStepIndex
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {index + 1}
                </div>
                <p
                  className={`mt-2 text-sm text-center ${index <= currentStepIndex
                      ? "text-green-600 font-medium"
                      : "text-gray-500"
                    }`}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
            <div className="flex justify-between items-center border-b pb-4">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="text-sm font-semibold text-gray-800">{order._id}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-sm font-semibold text-gray-800">
                ₹{order.totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="text-sm font-semibold text-gray-800">
                {order.paymentMethod}
              </p>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <p className="text-sm text-gray-500">Payment Status</p>
              <p
                className={`text-sm font-semibold ${order.paymentStatus === "Paid"
                    ? "text-green-600"
                    : order.paymentStatus === "Failed"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
              >
                {order.paymentStatus}
              </p>
            </div>
          </div>

          {/* Pizza Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Your Pizzas</h2>
            {order.products.map((product, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-800">
                    {product.pizzaDetails.name} ({product.size})
                  </p>
                  <p className="text-sm text-gray-500">
                    ₹{product.price.toFixed(2)} x {product.quantity}
                  </p>
                </div>
                {product.extraToppings.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Extra Toppings:</p>
                    <ul className="list-disc list-inside">
                      {product.extraToppings.map((topping, i) => (
                        <li key={i} className="text-sm text-gray-600">
                          {topping.name} (₹{topping.price.toFixed(2)})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;