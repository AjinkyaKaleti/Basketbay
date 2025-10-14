import React, { useContext, useEffect, useMemo } from "react";
import Context from "../Context/Context";
import axios from "axios";
import "./RecentOrder.css";

function RecentOrder() {
  const { formValues, recentOrders, setRecentOrders, view } =
    useContext(Context);

  useEffect(() => {
    if (view === "recentOrders" && formValues && formValues._id) {
      axios
<<<<<<< HEAD
        .get(`${process.env.REACT_APP_SERVER_URL}/api/orders/${formValues._id}`)
=======
        .get(`http://localhost:5000/api/orders/${formValues._id}`)
>>>>>>> f3d6455f9be41e902a033d33d2c3d78f5d925657
        .then((res) => setRecentOrders(res.data))
        .catch((err) => console.error(err));
    }
  }, [view, formValues, setRecentOrders]);

  const { groupedOrders, sortedDates } = useMemo(() => {
    const grouped = recentOrders.reduce((acc, order) => {
      const dateKey = new Date(order.createdAt).toLocaleDateString("en-GB");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(order);
      return acc;
    }, {});

    const sorted = Object.keys(grouped).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split("/").map(Number);
      const [dayB, monthB, yearB] = b.split("/").map(Number);
      return (
        new Date(yearB, monthB - 1, dayB) - new Date(yearA, monthA - 1, dayA)
      );
    });

    return { groupedOrders: grouped, sortedDates: sorted };
  }, [recentOrders]);

  return (
    <div className="recent-orders-container">
      <h1 className="text-center">Recent Orders</h1>

      {sortedDates.length === 0 && (
        <p className="text-center">No recent orders</p>
      )}

      <div className="accordion" id="recentOrdersAccordion">
        {sortedDates.map((dateKey, index) => {
          const orders = groupedOrders[dateKey];

          const totalAmount = orders.reduce(
            (sum, o) => sum + (o.totalAmount || 0),
            0
          );

          const totalItems = orders.reduce(
            (sum, o) =>
              sum +
              o.products.reduce((qtySum, p) => qtySum + (p.quantity || 0), 0),
            0
          );

<<<<<<< HEAD
          //console.log(orders);

=======
>>>>>>> f3d6455f9be41e902a033d33d2c3d78f5d925657
          return (
            <div
              className="accordion-item col-xl-10 col-lg-10 col-md-12 col-sm-12 offset-xl-1 offset-lg-1 my-1"
              key={dateKey}
            >
              <h2 className="accordion-header" id={`heading-${index}`}>
                <button
                  className="accordion-button collapsed d-flex align-items-center justify-content-between"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${index}`}
                  aria-expanded="false"
                  aria-controls={`collapse-${index}`}
                >
                  <span className="me-auto accordion-order-date">
                    {dateKey}
                  </span>
                  <strong className="me-3">
                    {totalItems} item{totalItems > 1 ? "s" : ""}
                  </strong>
                  <strong>₹{totalAmount.toFixed(2)}</strong>
                </button>
              </h2>

              <div
                id={`collapse-${index}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading-${index}`}
                data-bs-parent="#recentOrdersAccordion"
              >
                <div className="accordion-body">
                  {orders.map((order) =>
                    order.products.map((product) => {
                      const orderTime = new Date(
                        order.createdAt
                      ).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      });

<<<<<<< HEAD
                      const statusColor =
                        order.status.toLowerCase() === "completed" || "paid"
                          ? "green"
                          : "orange";
                      const paymentMethod = order.paymentMethod || "N/A";

=======
>>>>>>> f3d6455f9be41e902a033d33d2c3d78f5d925657
                      return (
                        <div
                          key={product._id}
                          className="border rounded p-2 mb-2 bg-light d-flex flex-column flex-md-row align-items-center"
                        >
<<<<<<< HEAD
                          {product.image && (
                            <div>
                              <img
                                src={product.image}
=======
                          {product.imageUrl && (
                            <div>
                              <img
                                src={product.imageUrl}
>>>>>>> f3d6455f9be41e902a033d33d2c3d78f5d925657
                                alt={product.name}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  marginRight: "15px",
                                }}
                              />
                            </div>
                          )}
                          <div>
                            <b>Order ID:</b> {order._id} | <b>Status:</b>{" "}
<<<<<<< HEAD
                            <span
                              style={{ color: statusColor, fontWeight: "bold" }}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>{" "}
                            | <b>Payment:</b> {paymentMethod} |{" "}
                            <b>Placed At:</b> {orderTime} | <b>Name: </b>
=======
                            {order.status} | <b>Placed At:</b> {orderTime} |{" "}
                            <b>Name: </b>
>>>>>>> f3d6455f9be41e902a033d33d2c3d78f5d925657
                            {product.name} | <b>Qty: </b> {product.quantity} |{" "}
                            <b>Price:</b> ₹{product.price} <b>| Discount:</b>{" "}
                            {product.discount || 0}% <b>| Final:</b> ₹
                            {(
                              (product.price -
                                (product.price * (product.discount || 0)) /
                                  100) *
                              product.quantity
                            ).toFixed(2)}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentOrder;
