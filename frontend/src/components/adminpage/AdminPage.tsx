
import { useState, useEffect } from "react";
import PizzaForm from "./PizzaForm";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { selectpizzas } from "@/redux/slices/pizzaSlice";
import { getAllPizzaThunk } from "@/redux/thunk/pizzaThunks";
import { fetchAllOrders, updateOrderStatus } from "@/redux/thunk/orderThunks";
import { selectOrders, selectStats } from "@/redux/slices/orderSlice";
import { createPizzaApi, deletePizzaApi, updatePizzaApi } from "@/api/pizzaAPI";
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pizzas, totalPages } = useSelector(selectpizzas);
  const orders = useSelector(selectOrders);
  const { totalOrders, completedOrders, pendingOrders, totalEarnings } =
    useSelector(selectStats);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [statusChange, setStatusChange] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [type, setType] = useState<"add" | "edit">("add");
  const [activeTab, setActiveTab] = useState<"pizza" | "orders">("orders");

  // Pizza Filters
  const [pizzaFilters, setPizzaFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: undefined as "priceAsc" | "priceDesc" | undefined,
    category: undefined as "Veg" | "Non-Veg" | undefined,
    size: undefined as "Small" | "Medium" | "Large" | undefined,
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
  });

  // Order Filters
  const [orderFilters, setOrderFilters] = useState({
    page: 1,
    limit: 10,
    orderStatus: undefined as string | undefined,
    paymentStatus: undefined as string | undefined,
    paymentMethod: undefined as string | undefined,
  });

  useEffect(() => {
    if (activeTab === "pizza") {
      dispatch(getAllPizzaThunk(pizzaFilters));
    } else {
      dispatch(fetchAllOrders(orderFilters));
    }
  }, [activeTab, pizzaFilters, orderFilters, statusChange]);

  // Handle order status update
  const handleUpdateStatus = async (orderId: string, status: string) => {
    dispatch(updateOrderStatus({ orderId, status }));
  
    setStatusChange(!statusChange);
  };

  const handleDeletePizza = async (id: string) => {
    const response = await deletePizzaApi(id);
    if (response.success) {
      toast.success("Pizza deleted successfully...");
    }
    setStatusChange(!statusChange);
  };

  const handleAddPizza = () => {
    setSelectedPizza(null);
    setType("add");
    setIsFormOpen(true);
  };

  const handleEditPizza = (pizza: any) => {
    setSelectedPizza(pizza);
    setType("edit");
    setIsFormOpen(true);
  };

  const handleSubmit = async ({
    data,
    type,
    id,
  }: {
    data: any;
    type: "add" | "edit";
    id?: string;
  }) => {
    if (type === "add") {
      const response = await createPizzaApi(data);
      if (response.success) {
        toast.success("Pizza added successfully...");
      }
    }
    if (type === "edit" && id) {
      const response = await updatePizzaApi({ id, pizza: data });
      if (response.success) {
        toast.success("Pizza edited successfully...");
      }
    }
    setIsFormOpen(false);
    setStatusChange(!statusChange);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Pizza Admin Dashboard</h1>

      {/* Tabs for Pizza and Orders */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("pizza")}
          className={`px-4 py-2 rounded ${activeTab === "pizza" ? "bg-blue-500" : "bg-gray-700"
            }`}
        >
          Pizza
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded ${activeTab === "orders" ? "bg-blue-500" : "bg-gray-700"
            }`}
        >
          Orders
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Orders */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white">Total Orders</h3>
          <p className="text-2xl font-bold text-blue-400">{totalOrders}</p>
        </div>
        {/* Pending Orders */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white">Pending Orders</h3>
          <p className="text-2xl font-bold text-yellow-400">{pendingOrders}</p>
        </div>
        {/* Completed Orders */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white">Completed Orders</h3>
          <p className="text-2xl font-bold text-green-400">{completedOrders}</p>
        </div>
        {/* Total Earnings */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white">Total Earnings</h3>
          <p className="text-2xl font-bold text-purple-400">₹{totalEarnings}</p>
        </div>
      </div>

      {/* Pizza Management */}
      {activeTab === "pizza" && (
        <div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Pizza List</h2>
              <button
                onClick={handleAddPizza}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Pizza
              </button>
            </div>

            {/* Pizza Filters */}

            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <select
                value={pizzaFilters.category}
                onChange={(e) =>
                  setPizzaFilters({
                    ...pizzaFilters,
                    category: e.target.value as "Veg" | "Non-Veg",
                  })
                }
                className="bg-gray-700 text-white px-3 py-2 rounded"
              >
                <option value="">All Categories</option>
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
              </select>
              <select
                value={pizzaFilters.size}
                onChange={(e) =>
                  setPizzaFilters({
                    ...pizzaFilters,
                    size: e.target.value as "Small" | "Medium" | "Large",
                  })
                }
                className="bg-gray-700 text-white px-3 py-2 rounded"
              >
                <option value="">All Sizes</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
              <input
                type="number"
                placeholder="Min Price"
                value={pizzaFilters.minPrice || ""}
                onChange={(e) =>
                  setPizzaFilters({
                    ...pizzaFilters,
                    minPrice: parseInt(e.target.value),
                  })
                }
                className="bg-gray-700 text-white px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={pizzaFilters.maxPrice || ""}
                onChange={(e) =>
                  setPizzaFilters({
                    ...pizzaFilters,
                    maxPrice: parseInt(e.target.value),
                  })
                }
                className="bg-gray-700 text-white px-3 py-2 rounded"
              />
            </div> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {/* Category Dropdown */}
              <select
                value={pizzaFilters.category}
                onChange={(e) => {
                  const value = e.target.value;
                  setPizzaFilters((prevFilters) => {
                    const updatedFilters = { ...prevFilters, page: 1 };
                
                    if (value) {
                      updatedFilters.category = value as "Veg" | "Non-Veg";
                    } else {
                      delete updatedFilters.category; // Remove category key
                    }
                
                    return updatedFilters;
                  });
                }}
                className="bg-gray-700 text-white px-3 py-2 rounded w-full max-w-full text-sm"
              >
                <option value="">All Categories</option>
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
              </select>

              {/* Size Dropdown */}
              <select
                value={pizzaFilters.size}
                onChange={(e) => {
                  const value = e.target.value;
                  setPizzaFilters((prevFilters) => {
                    const updatedFilters = { ...prevFilters, page: 1 };
                
                    if (value) {
                      updatedFilters.size = value as "Small" | "Medium" | "Large";
                    } else {
                      delete updatedFilters.size; // Remove size key
                    }
                
                    return updatedFilters;
                  });
                }}
                
                className="bg-gray-700 text-white px-3 py-2 rounded w-full max-w-full text-sm"
              >
                <option value="">All Sizes</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>

              {/* Min Price Input */}
              <input
                type="number"
                placeholder="Min Price"
                value={pizzaFilters.minPrice || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setPizzaFilters((prevFilters) => {
                    const updatedFilters = { ...prevFilters, page: 1 };
              
                    if (value) {
                      updatedFilters.minPrice = parseInt(value, 10);
                    } else {
                      delete updatedFilters.minPrice; // Remove minPrice if empty
                    }
              
                    return updatedFilters;
                  });
                }}
                className="bg-gray-700 text-white px-3 py-2 rounded w-full max-w-full text-sm"
              />

              {/* Max Price Input */}
              <input
                type="number"
                placeholder="Max Price"
                value={pizzaFilters.maxPrice || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setPizzaFilters((prevFilters) => {
                    const updatedFilters = { ...prevFilters, page: 1 };
              
                    if (value) {
                      updatedFilters.maxPrice = parseInt(value, 10);
                    } else {
                      delete updatedFilters.maxPrice; // Remove maxPrice if empty
                    }
              
                    return updatedFilters;
                  });
                }}
                className="bg-gray-700 text-white px-3 py-2 rounded w-full max-w-full text-sm"
              />
            </div>

            {/* Pizza List */}
            <div className="space-y-4">
              {pizzas.map((pizza) => (
                <div
                  key={pizza._id}
                  className="flex flex-col sm:flex-row justify-between items-center bg-gray-700 p-4 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={pizza.image}
                      alt={pizza.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {pizza.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {pizza.description}
                      </p>
                      <p className="text-sm text-gray-400">
                        Category: {pizza.category} | Price: ₹
                        {pizza.sizes[0].price}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                      onClick={() => handleEditPizza(pizza)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDeletePizza(pizza._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination for Pizza */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() =>
                  setPizzaFilters({
                    ...pizzaFilters,
                    page: pizzaFilters.page - 1,
                  })
                }
                disabled={pizzaFilters.page === 1}
                className="bg-gray-700 text-white px-4 py-2 rounded-l"
              >
                Previous
              </button>
              <span className="bg-gray-700 text-white px-4 py-2">
                Page {pizzaFilters.page} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setPizzaFilters({
                    ...pizzaFilters,
                    page: pizzaFilters.page + 1,
                  })
                }
                disabled={pizzaFilters.page === totalPages}
                className="bg-gray-700 text-white px-4 py-2 rounded-r"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Management */}
      {activeTab === "orders" && (
        <div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              Order List
            </h2>

            {/* Order Filters */}


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {/* Order Status Dropdown */}
              <select
                value={orderFilters.orderStatus}
                onChange={(e) =>
                  setOrderFilters({
                    ...orderFilters,page:1,
                    orderStatus: e.target.value,
                  })
                }
                className="bg-gray-700 text-white px-3 py-2 rounded w-full max-w-full text-sm"
              >
                <option value="">All Statuses</option>
                <option value="Placed">Placed</option>
                <option value="Processing">Processing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {/* Payment Status Dropdown */}
              <select
                value={orderFilters.paymentStatus}
                onChange={(e) =>
                  setOrderFilters({
                    ...orderFilters,page:1,
                    paymentStatus: e.target.value,
                  })
                }
                className="bg-gray-700 text-white px-3 py-2 rounded w-full max-w-full text-sm"
              >
                <option value="">All Payment Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </select>

              {/* Payment Method Dropdown */}
              <select
                value={orderFilters.paymentMethod}
                onChange={(e) =>
                  setOrderFilters({
                    ...orderFilters,page:1,
                    paymentMethod: e.target.value,
                  })
                }
                className="bg-gray-700 text-white px-3 py-2 rounded w-full max-w-full text-sm"
              >
                <option value="">All Payment Methods</option>
                <option value="Online">Online</option>
                <option value="COD">Cash on Delivery</option>
              </select>
            </div>

            {/* Order List */}
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Order #{order._id}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Customer: {order.userId.name} ({order.userId.email})
                      </p>
                      <p className="text-sm text-gray-400">
                        Total: ₹{order.totalAmount} <br />
                        Status:{" "}
                        <span
                          className={
                            order.orderStatus === "Placed"
                              ? "text-blue-500"
                              : order.orderStatus === "Processing"
                                ? "text-yellow-500"
                                : order.orderStatus === "Out for Delivery"
                                  ? "text-purple-500"
                                  : order.orderStatus === "Delivered"
                                    ? "text-green-500"
                                    : order.orderStatus === "Cancelled"
                                      ? "text-red-500"
                                      : "text-gray-500"
                          }
                        >
                          {order.orderStatus}
                        </span>{" "}
                        <br />
                        Payment Status:{" "}
                        <span
                          className={
                            order.paymentStatus === "Pending"
                              ? "text-yellow-500"
                              : order.paymentStatus === "Paid"
                                ? "text-green-500"
                                : order.paymentStatus === "Failed"
                                  ? "text-red-500"
                                  : "text-gray-500"
                          }
                        >
                          {order.paymentStatus}
                        </span>{" "}
                        <br />
                        Payment Mode:{" "}
                        <span
                          className={
                            order.paymentMethod === "Online"
                              ? "text-blue-500"
                              : order.paymentMethod === "COD"
                                ? "text-purple-500"
                                : "text-gray-500"
                          }
                        >
                          {order.paymentMethod}
                        </span>
                      </p>
                      <div className="mt-2">
                        <h4 className="text-sm font-semibold text-white">
                          Pizzas:
                        </h4>
                        {order.products.map((item) => (
                          <div
                            key={item.pizzaDetails._id}
                            className="text-sm text-gray-400"
                          >
                            <p>
                              {item.pizzaDetails.name} ({item.size}) - ₹
                              {item.price}
                            </p>
                            {item.extraToppings.length > 0 &&
                              <p>
                                Extras:{" "}
                                <ul className="list-disc list-inside">
                                  {item.extraToppings.map((topping, i) => (
                                    <li key={i} className="text-sm text-gray-400">
                                      {topping.name}
                                    </li>
                                  ))}
                                </ul>
                              </p>
                            }
                          </div>
                        ))}
                      </div>
                    </div>
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleUpdateStatus(order._id, e.target.value)
                      }
                      className="bg-gray-600 text-white px-3 py-1 rounded"
                    >
                      <option value="Placed">Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination for Orders */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() =>
                  setOrderFilters({
                    ...orderFilters,
                    page: orderFilters.page - 1,
                  })
                }
                disabled={orderFilters.page === 1}
                className="bg-gray-700 text-white px-4 py-2 rounded-l"
              >
                Previous
              </button>
              <span className="bg-gray-700 text-white px-4 py-2">
                Page {orderFilters.page}
              </span>
              <button
                onClick={() =>
                  setOrderFilters({
                    ...orderFilters,
                    page: orderFilters.page + 1,
                  })
                }
                disabled={orders.length < orderFilters.limit}
                className="bg-gray-700 text-white px-4 py-2 rounded-r"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pizza Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl mx-4 bg-gray-800 rounded-lg shadow-lg overflow-y-auto max-h-[90vh] relative">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full"
            >
              &times;
            </button>
            <PizzaForm
              onSubmit={handleSubmit}
              defaultValues={selectedPizza}
              onClose={() => setIsFormOpen(false)}
              type={type}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
