

// import { useEffect } from "react";
// import { Link } from "react-router";
// import { useDispatch, useSelector } from "react-redux";
// import { selectUser } from "@/redux/slices/authSlice";
// import { AppDispatch } from "@/redux/store";
// import { fetchUserOrders } from "@/redux/thunk/orderThunks";
// import { selectOrders } from "@/redux/slices/orderSlice";

// const UserProfile = () => {
//   const user = useSelector(selectUser);
//   const dispatch = useDispatch<AppDispatch>();
//   const orders = useSelector(selectOrders);

//   useEffect(() => {
//     dispatch(fetchUserOrders());
//   }, [dispatch]);

//   return (
//     <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>
//         {orders.length > 0 ? (
//           <div className="space-y-6">
//             {orders.map((order) => (
//               <div
//                 key={order._id}
//                 className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
//               >
//                 <Link to={`/order-status/${order._id}`} className="block">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <h2 className="text-lg font-semibold text-gray-800">
//                         Order ID: {order._id}
//                       </h2>
//                       <p className="text-sm text-gray-500">
//                         Status:{" "}
//                         <span
//                           className={`font-medium ${
//                             order.orderStatus === "Delivered"
//                               ? "text-green-600"
//                               : order.orderStatus === "Cancelled"
//                               ? "text-red-600"
//                               : "text-yellow-600"
//                           }`}
//                         >
//                           {order.orderStatus}
//                         </span>
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm text-gray-500">
//                         Total Amount:{" "}
//                         <span className="font-semibold text-gray-800">
//                           ${order.totalAmount.toFixed(2)}
//                         </span>
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         Payment Method:{" "}
//                         <span className="font-semibold text-gray-800">
//                           {order.paymentMethod}
//                         </span>
//                       </p>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-600">No orders found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserProfile;

// ---------------------------------------------------------------------------- 


// import { useEffect } from "react";
// import { Link } from "react-router"; // Fix: Updated import path
// import { useDispatch, useSelector } from "react-redux";
// import { selectUser } from "@/redux/slices/authSlice";
// import { AppDispatch } from "@/redux/store";
// import { fetchUserOrders } from "@/redux/thunk/orderThunks";
// import { selectOrders } from "@/redux/slices/orderSlice";

// const UserProfile = () => {
//   const user = useSelector(selectUser);
//   const dispatch = useDispatch<AppDispatch>();
//   const orders = useSelector(selectOrders);

//   useEffect(() => {
//     dispatch(fetchUserOrders());
//   }, [dispatch]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>
//         {orders.length > 0 ? (
//           <div className="space-y-6">
//             {orders.map((order) => (
//               <div
//                 key={order._id}
//                 className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
//               >
//                 <Link to={`/order-status/${order._id}`} className="block">
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                     {/* Order Details (Left Side) */}
//                     <div className="flex-1">
//                       <h2 className="text-sm sm:text-lg font-semibold text-gray-800  sm:truncate">
//                         Order ID:  {order._id}
//                       </h2>
//                       <p className="text-sm text-gray-500 mt-1">
//                         Status:{" "}
//                         <span
//                           className={`font-medium ${
//                             order.orderStatus === "Delivered"
//                               ? "text-green-600"
//                               : order.orderStatus === "Cancelled"
//                               ? "text-red-600"
//                               : "text-yellow-600"
//                           }`}
//                         >
//                           {order.orderStatus}
//                         </span>
//                       </p>
//                     </div>

//                     {/* Payment Details (Right Side) */}
//                     <div className="text-right">
//                       <p className="text-sm text-gray-500">
//                         Total Amount:{" "}
//                         <span className="font-semibold text-gray-800">
//                         ₹{order.totalAmount.toFixed(2)}
//                         </span>
//                       </p>
//                       <p className="text-sm text-gray-500 mt-1">
//                         Payment Method:{" "}
//                         <span className="font-semibold text-gray-800">
//                           {order.paymentMethod}
//                         </span>
//                       </p>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-600">No orders found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserProfile;

// ------------------------------------------------------------------------ 

import { useEffect } from "react";
import { Link } from "react-router"; // Fix: Updated import path
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/redux/slices/authSlice";
import { AppDispatch } from "@/redux/store";
import { fetchUserOrders } from "@/redux/thunk/orderThunks";
import { selectOrders } from "@/redux/slices/orderSlice";

const UserProfile = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector(selectOrders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 mt-8">
      <div className="max-w-4xl mx-auto">
        {/* User Details Section */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            {/* User Image */}
            <img
              src={user?.image || "https://randomuser.me/api/portraits/men/10.jpg"} // Fallback to a default image if user.image is not available
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              {/* User Name */}
              <h2 className="text-xl font-semibold text-gray-800">
                {user?.name}
              </h2>
              {/* User Email */}
              <p className="text-sm text-gray-500">{user?.email}</p>
              {/* Admin Link (Conditional) */}
              {user?.isAdmin && (
                <Link
                  to="/admin"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Go to Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
              >
                <Link to={`/order-status/${order._id}`} className="block">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Order Details (Left Side) */}
                    <div className="flex-1">
                      <h2 className="text-sm sm:text-lg font-semibold text-gray-800 sm:truncate">
                        Order ID: {order._id}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Status:{" "}
                        <span
                          className={`font-medium ${
                            order.orderStatus === "Delivered"
                              ? "text-green-600"
                              : order.orderStatus === "Cancelled"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </p>
                    </div>

                    {/* Payment Details (Right Side) */}
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Total Amount:{" "}
                        <span className="font-semibold text-gray-800">
                          ₹{order.totalAmount.toFixed(2)}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Payment Method:{" "}
                        <span className="font-semibold text-gray-800">
                          {order.paymentMethod}
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;