import axiosInstance from "../lib/axios";

//  Create Order
export const createOrderApi = async (orderData: any) => {
  try {
    // Send API request
    const response = await axiosInstance.post("/api/orders/create", orderData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;  // Return response data directly
  } catch (error) {
  
    return { success: false, message: "Something went wrong" };  // Default error message
  }
};

//  Get User Orders
export const getUserOrdersApi = async () => {
  try {
    const response = await axiosInstance.get("/api/orders/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;  // Return response data directly
  } catch (error) {
    return { success: false, message: "Something went wrong" };  // Default error message
  }
};

//  Verify Payment
export const verifyPaymentApi = async (paymentDetails: { userId: string; razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
  try {
    const response = await axiosInstance.post("/api/orders/verify", paymentDetails, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

  
    return response.data;  // Return response data directly
  } catch (error) {
   
    return { success: false, message: "Something went wrong" };  // Default error message
  }
};

//  Get All Orders (Admin)
export const getAllOrdersApi = async (filters: { page: number; limit: number; orderStatus?: string; paymentStatus?: string; paymentMethod?: string }) => {
  try {
    const response = await axiosInstance.get("/api/orders/admin", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: filters,
    });
    return response.data;  // Return response data directly
  } catch (error) {
    return { success: false, message: "Something went wrong" };  // Default error message
  }
};

//  Update Order Status
export const updateOrderStatusApi = async (orderId: string, status: string) => {
  try {
    const response = await axiosInstance.put(`/api/orders/update/${orderId}`, { status }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;  // Return response data directly
  } catch (error) {
    return { success: false, message: "Something went wrong" };  // Default error message
  }
};



//  Get Order by Id 
export const getOrderByIdApi = async (orderId: string) => {
  try {
    const response = await axiosInstance.get(`/api/orders/${orderId}`,  {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;  // Return response data directly
  } catch (error) {
    return { success: false, message: "Something went wrong" };  // Default error message
  }
};