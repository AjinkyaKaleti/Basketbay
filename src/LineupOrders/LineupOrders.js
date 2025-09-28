import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LineupOrders.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrint,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

function LineupOrders() {
  const [orders, setOrders] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders/all"); // backend route
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders", err);
      }
    };
    fetchOrders();
  }, []);

  const handlePrint = (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    if (!order) return;

    const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice - ${order._id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          thead { background-color: #f2f2f2; }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Invoice - ${order._id}</h2>
        </div>

        <p><b>Date:</b> ${new Date(order.createdAt).toLocaleString()}</p>
        <p><b>Customer:</b> ${order.customerName}</p>
        <p><b>Contact:</b> ${order.mobile || ""}</p>
        <p><b>Address:</b> ${order.address || ""}</p>

        <h3>Products:</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price (₹)</th>
              <th>Subtotal (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${order.products
              .map(
                (p) => `
                <tr>
                  <td>${p.name}</td>
                  <td>${p.quantity}</td>
                  <td>${p.price}</td>
                  <td>${p.quantity * p.price}</td>
                </tr>`
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="text-align: right;"><b>Total:</b></td>
              <td><b>₹${order.totalAmount}</b></td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right;"><b>Payment:</b></td>
              <td><b>${order.paymentMethod}</b></td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  `;

    // Create hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    // Write content to iframe
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(printContent);
    iframe.contentWindow.document.close();

    // Trigger print
    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    // Remove iframe after printing
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };

  const toggleRow = (orderId) => {
    setExpandedRow(expandedRow === orderId ? null : orderId);
  };

  return (
    <div className="lineup-orders">
      <h2 className="text-center my-3 all-lineup-title">All Lineup Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th className="text-center">Order ID</th>
              <th className="text-center">Date</th>
              <th className="text-center">Customer</th>
              <th className="text-center">Payment</th>
              <th className="text-center">Total(₹)</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order._id}>
                <tr className="order-table-row">
                  <td className="text-center">{order._id}</td>
                  <td className="text-center">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="text-center">{order.customerName}</td>
                  <td className="text-center">{order.paymentMethod}</td>
                  <td className="text-center">{order.totalAmount}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => toggleRow(order._id)}
                      title="Show Products"
                    >
                      <FontAwesomeIcon
                        icon={
                          expandedRow === order._id
                            ? faChevronUp
                            : faChevronDown
                        }
                      />
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handlePrint(order._id)}
                      title="Print Invoice"
                    >
                      <FontAwesomeIcon icon={faPrint} />
                    </button>
                  </td>
                </tr>
                {expandedRow === order._id && (
                  <tr>
                    <td colSpan="6">
                      <div className="p-2">
                        <p>
                          <b>Contact:</b> {order.mobile || "N/A"}
                        </p>
                        <p>
                          <b>Address:</b> {order.address || "N/A"}
                        </p>
                        <h6>Products:</h6>
                        <ul className="mb-0">
                          {order.products.map((p, idx) => (
                            <li key={idx}>
                              {p.name} - {p.quantity} x ₹{p.price} = ₹
                              {p.quantity * p.price}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}{" "}
    </div>
  );
}

export default LineupOrders;
