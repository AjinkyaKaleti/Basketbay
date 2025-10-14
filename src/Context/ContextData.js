import React, { useState, useEffect } from "react";
import Context from "./Context.js";
import axios from "axios";
const addProductDefaultImage = "/";

export default function ContextData(props) {
  const [currentView, setCurrentView] = useState("Home");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [selectedMenu, setSelectedMenu] = useState(
    isOtpVerified ? "Products" : "Login"
  );
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [isLogoclick, setIsLogoClick] = useState(false);
  const [addProducts, setAddProducts] = useState({
    addProductName: "",
    addProductImageUrl: "",
    addProductDesc: "",
    addProductQuantity: "",
    addProductPrice: "",
    addProductDiscount: "",
  });
  const [formValues, setFormValues] = useState({
    _id: "",
    firstname: "",
    lastname: "",
    gender: "",
    age: "",
    email: "",
    address: "",
    pincode: "",
    mobileno: "",
    otp: "",
    isLoggedIn: false,
  });

  const [recentOrders, setRecentOrders] = useState(() => {
    const saved = localStorage.getItem("recentOrders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // fetch products from backend on mount
    const fetchProducts = async () => {
      try {
<<<<<<< HEAD
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/products`
        );
=======
        const res = await axios.get("/api/products");
>>>>>>> f3d6455f9be41e902a033d33d2c3d78f5d925657
        // res.data.products is array if API returns { products: [...] }
        setProducts(res.data.products || res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Fetch orders from MongoDB when user logs in
  useEffect(() => {
    if (formValues && formValues._id) {
      axios
<<<<<<< HEAD
        .get(`${process.env.REACT_APP_SERVER_URL}/api/orders/${formValues._id}`)
=======
        .get(`http://localhost:5000/api/orders/${formValues._id}`)
>>>>>>> f3d6455f9be41e902a033d33d2c3d78f5d925657
        .then((res) => {
          setRecentOrders(res.data);
          localStorage.setItem("recentOrders", JSON.stringify(res.data));
        })
        .catch((err) => console.error(err));
    }
  }, [formValues]);

  // keep localStorage in sync
  useEffect(() => {
    localStorage.setItem("recentOrders", JSON.stringify(recentOrders));
  }, [recentOrders]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormValues((prev) => ({ ...prev, ...user, isLoggedIn: true }));
      setIsOtpVerified(true);
      setView("Products");
    }
  }, []);
  const [logout, setLogout] = useState(false);

  const setView = (view) => {
    setCurrentView(view);
  };

  //customer orders
  const [orders, setOrders] = useState([
    // data is automatically added when product is added to cart
  ]);

  //Logout Handling
  const handleLogout = () => {
    // Remove saved auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.clear();
    setFormValues(null);
    setRecentOrders([]);
    localStorage.removeItem("recentOrders");

    setFormValues({
      _id: "",
      firstname: "",
      lastname: "",
      gender: "",
      age: "",
      email: "",
      address: "",
      pincode: "",
      mobileno: "",
      otp: "",
      isLoggedIn: false,
    });
    // Reset other states
    setLogout(true);
    setIsOtpVerified(false);
    setSelectedMenu("Login");
  };

  const [products, setProducts] = useState([]);

  // fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
<<<<<<< HEAD
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/products`
        );
=======
        const res = await axios.get("/api/products");
>>>>>>> f3d6455f9be41e902a033d33d2c3d78f5d925657
        const productsArray = Array.isArray(res.data.products)
          ? res.data.products
          : Array.isArray(res.data)
          ? res.data
          : [];
        setProducts(productsArray);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]); // fallback
      }
    };
    fetchProducts();
  }, []);

  // function to add product
  const addProduct = async (newProduct) => {
    try {
<<<<<<< HEAD
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/products`,
        newProduct
      );
=======
      const res = await axios.post("/api/products", newProduct);
>>>>>>> f3d6455f9be41e902a033d33d2c3d78f5d925657
      setProducts((prev) => [...prev, res.data]); // update state instantly
      return true;
    } catch (err) {
      console.error("Error adding product:", err);
      return false;
    }
  };

  return (
    <Context.Provider
      value={{
        currentView,
        setView,
        isPasswordVisible,
        setIsPasswordVisible,
        username,
        setUsername,
        password,
        setPassword,
        isFormValid,
        setIsFormValid,
        formValues,
        setFormValues,
        selectedMenu,
        setSelectedMenu,
        orders,
        setOrders,
        products,
        setProducts,
        logout,
        setLogout,
        isPaymentModalVisible,
        setPaymentModalVisible,
        isLogoclick,
        setIsLogoClick,
        addProducts,
        setAddProducts,
        addProductDefaultImage,
        isOtpVerified,
        setIsOtpVerified,
        handleLogout,
        recentOrders,
        setRecentOrders,
        addProduct,
        toast,
        setToast,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}
