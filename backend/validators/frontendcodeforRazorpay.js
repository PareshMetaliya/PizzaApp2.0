const handlePayment = async () => {
    const res = await fetch("/api/order/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        address,
        products,
        totalAmount,
        paymentMethod: "Online",
      }),
    });
  
    const data = await res.json();
  
    if (data.success) {
      const options = {
        key: data.key, // Razorpay Key
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        handler: async function (response) {
          const verifyRes = await fetch("/api/order/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
  
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Payment Successful! Order Placed.");
          } else {
            alert("Payment verification failed.");
          }
        },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      alert("Error creating order.");
    }
  };
  