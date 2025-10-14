import React, { useContext, useState } from "react";
import "./Orders.css";
import Context from "../Context/Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { getProductImage } from "../utils/getProductImage";
import ToastMessage from "../ToastMessage/ToastMessage";
import Payment from "../Payment/Payment";

function Orders() {
  const {
    orders,
    setOrders,
    formValues,
    recentOrders,
    setRecentOrders,
    setProducts,
    products,
    toast,
    setToast,
    isPaymentModalVisible,
    setPaymentModalVisible,
    serverUrl,
  } = useContext(Context);

  const [selectedAmount, setSelectedAmount] = useState(0);

  // increment quantity
  const incrementCount = (id) => {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, count: item.count + 1 } : item
      )
    );
  };

  // decrement quantity (but not less than 1)
  const decrementCount = (id) => {
    setOrders((prev) =>
      prev
        .map((item) =>
          item.id === id && item.count > 1
            ? { ...item, count: item.count - 1 }
            : item
        )
        .filter((item) => item.count > 0)
    );
  };

  // remove item from cart
  const removeItem = (id) => {
    setOrders((prevOrders) => {
      const itemToRemove = prevOrders.find((item) => item.id === id);
      if (itemToRemove) {
        // restore stock in products
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === id ? { ...p, count: p.count + itemToRemove.count } : p
          )
        );
      }
      return prevOrders.filter((item) => item.id !== id);
    });
  };

  const handleCheckout = async () => {
    if (orders.length === 0) return;

    if (!formValues.isLoggedIn || !formValues._id) {
      setToast({
        show: true,
        message: "Please login to place an order.",
        type: "warning",
      });
      return;
    }

    const totalAmount = Math.round(totalPayable);
    setSelectedAmount(totalAmount);
    setPaymentModalVisible(true); // open payment modal
  };

  //handle payment success
  const handlePaymentSuccess = async (method, razorpayResponse = null) => {
    const orderData = {
      customerId: formValues._id,
      products: orders.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.count,
        imageUrl: item.image,
        discount: item.discount || 0,
      })),
      paymentMethod: method,
      paymentDetails: razorpayResponse, // store payment response for Razorpay
      totalAmount: selectedAmount,
    };

    try {
      const res = await axios.post(`${serverUrl}/api/orders`, orderData);
      const newOrder = res.data.order;

      // refresh products
      const refreshed = await axios.get(`${serverUrl}/api/products`);
      const productsArray = refreshed.data.products || refreshed.data;
      setProducts(productsArray);

      //update recent orders
      setRecentOrders([newOrder, ...recentOrders]);

      // show alert only after backend confirms email sent
      setToast({
        show: true,
        message: `${res.data.message} Order ID: ${newOrder._id}`,
        type: "success",
      });

      setOrders([]); // clear cart in the orders tab
    } catch (err) {
      console.error(err);
      setToast({
        show: true,
        message: "Failed to place order. Please try again.",
        type: "error",
      });
    }
  };

  //handle payment cancel
  const handlePaymentCancel = () => {
    setToast({ show: true, message: "Payment cancelled.", type: "warning" });
  };

  const totalPayable = orders.reduce(
    (sum, item) =>
      sum +
      (item.price - (item.price * (item.discount || 0)) / 100) * item.count,
    0
  );

  return (
    <>
      <div className="orders-container">
        <div className="row py-1 myorders-title text-center">
          <div className="text-center">
            <h1>Cart {orders.length ? `(${orders.length})` : "(0)"}</h1>
          </div>
        </div>

        {orders.length === 0
          ? ""
          : orders.map((item) => {
              // find matching product stock for this item
              const product = products.find((p) => p._id === item.id);

              return (
                <div className="row py-1 orders-single" key={item.id}>
                  {/* --- left side image & name --- */}
                  <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-1 offset-md-1 mt-2 text-center">
                    <div className="left-side">
                      <div className="order-image">
                        <img
                          src={getProductImage(item.image)}
                          alt={item.name}
                        />
                      </div>
                      {/* <div className="order-name pt-1">
                        <b>{item.name}</b>
                      </div> */}
                    </div>
                  </div>

                  {/* --- description --- */}
                  <div className="col-xs-12 col-sm-12 col-md-2 col-lg-4 col-xl-4 offset-md-1 mt-2 text-left">
                    <div className="center-side">
                      <div className="order-name">
                        <b>{item.name}</b>
                      </div>
                      <div className="order-description">
                        <p>{item.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* --- quantity + price details --- */}
                  <div className="col-xs-12 col-sm-12 col-md-3 col-lg-2 col-xl-2 offset-md-1 mt-2 text-center">
                    <div className="right-side">
                      <div className="order-count">
                        <div>
                          <button
                            className="decrement"
                            onClick={() => decrementCount(item.id || item._id)}
                            disabled={item.count === 1}
                          >
                            -
                          </button>
                        </div>
                        <div className="order-available-count">
                          {item.count}
                        </div>
                        <div>
                          <button
                            className="increment"
                            onClick={() => incrementCount(item.id || item._id)}
                            disabled={
                              !product || item.count >= product.initialStock
                            } // disable if reached max stock
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="order-count-inner">
                        <div className="inner-left-order-count">
                          <div>
                            <b>MRP</b>
                          </div>
                          <div>
                            <b>Discount</b>
                          </div>
                          <div>
                            <b>Final Price</b>
                          </div>
                        </div>

                        <div className="inner-right-order-count">
                          <div>{item.price}</div>
                          <div>{item.discount || 0}%</div>
                          <div>
                            {Math.round(
                              item.price -
                                (item.price * (item.discount || 0)) / 100
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* --- delete button --- */}
                  <div className="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1 mt-2 mb-2 text-left">
                    <div className="delete" onClick={() => removeItem(item.id)}>
                      <FontAwesomeIcon icon={faTrashCan} />
                    </div>
                  </div>
                </div>
              );
            })}
        <div className="row py-1 justify-content-space-evenly">
          <div className="col-4 pt-2 total-row">
            <h3 className="total-label">Total</h3>
          </div>

          <div className="col-4 pt-2 total-row">
            <button
              className={`PayNow ${orders.length === 0 ? "disabled" : ""}`}
              onClick={handleCheckout}
              disabled={orders.length === 0}
            >
              Check Out
            </button>
          </div>

          <div className="col-4 pt-2 total-row">
            <h4 className="payable-amount">
              Rs. {Math.round(totalPayable)}.00
            </h4>
          </div>
        </div>
      </div>
      {toast.show && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {isPaymentModalVisible && (
        <Payment
          amount={selectedAmount}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentCancel={handlePaymentCancel}
        />
      )}
    </>
  );
}

export default Orders;
