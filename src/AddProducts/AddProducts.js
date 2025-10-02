import React, { useState, useRef, useContext, useEffect } from "react";
import "./AddProducts.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan, faMinus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Context from "../Context/Context";
import { getProductImage } from "../utils/getProductImage";
import ToastMessage from "../ToastMessage/ToastMessage";

function AddProducts() {
  const { products, setProducts, toast, setToast } = useContext(Context);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    count: "",
    imageUrl: "",
  });

  const [image, setImage] = useState(null);
  const inputRef = useRef(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  // Fetch products
  const fetchProducts = async () => {
    if (!hasMore) return;
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/products?limit=${limit}&page=${page}`
      );
      const fetchedProducts = res.data.products || [];
      setProducts((prev) => [...prev, ...fetchedProducts]);
      setPage((prev) => prev + 1);
      if (fetchedProducts.length < limit) setHasMore(false);
    } catch (err) {
      console.error(err);
      setToast({
        show: true,
        message: "Failed to load products!",
        type: "warning",
      });
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        hasMore &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 100
      ) {
        fetchProducts();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  // Reset form
  const resetForm = () => {
    setProduct({
      name: "",
      description: "",
      price: "",
      discount: "",
      count: "",
      imageUrl: "",
    });
    setImage(null);
    if (inputRef.current) inputRef.current.value = null;
  };

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // File input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const productUploadImage = () => inputRef.current.click();

  // Form validation
  const isFormValid = () => {
    return (
      product.name.trim() !== "" &&
      product.description.trim() !== "" &&
      product.price > 0 &&
      product.count > 0 &&
      product.discount >= 0 &&
      image
    );
  };

  // Add product
  const handleAddProduct = async () => {
    try {
      let imageUrl = "";

      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const uploadRes = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/upload/image`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (uploadRes.data.url) imageUrl = uploadRes.data.url;
      }

      const fd = {
        ...product,
        count: parseInt(product.count, 10),
        price: parseFloat(product.price),
        discount: parseFloat(product.discount),
        imageUrl: imageUrl || "/add_image_default.jpg",
      };

      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/products`,
        fd
      );

      setProducts((prev) => [res.data.product, ...prev]);
      resetForm();
      setToast({
        show: true,
        message: "Product added to Inventory!",
        type: "success",
      });
    } catch (err) {
      console.error(
        "Error adding product:",
        err.response || err.message || err
      );
      setToast({
        show: true,
        message: "Failed to add product!",
        type: "warning",
      });
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/products/${id}`
      );
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setToast({
        show: true,
        message: "Product removed from inventory!",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        show: true,
        message: "Failed to delete product!",
        type: "warning",
      });
    }
  };

  // Increase quantity locally
  const handleIncreaseProduct = async (id) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/products/increase/${id}`
      );
      const updatedProduct = res.data.product;
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? updatedProduct : p))
      );
      setToast({
        show: true,
        message: "1 Product added to inventory!",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        show: true,
        message: "Failed to increase stock",
        type: "warning",
      });
    }
  };

  // Reduce quantity locally
  const handleReduceProduct = async (id) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/products/decrease/${id}`
      );
      const updatedProduct = res.data.product;
      setProducts((prev) =>
        prev.map((p) =>
          p._id === id
            ? {
                ...updatedProduct,
                image: getProductImage(updatedProduct.imageUrl),
              }
            : p
        )
      );
      setToast({
        show: true,
        message: "1 Product removed from inventory!",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        show: true,
        message: "Failed to update product!",
        type: "warning",
      });
    }
  };

  return (
    <div className="upload-container">
      <div className="row py-1 add-product-title text-center">
        <h1>Add Product</h1>
      </div>

      {/* Upload image */}
      <div className="row py-2">
        <div className="col text-center">
          <div className="product-image-upload-div">
            <img
              src={
                image ? URL.createObjectURL(image) : "/add_image_default.jpg"
              }
              alt="preview"
              className="upload-image-default"
              onClick={productUploadImage}
            />
            <input
              type="file"
              ref={inputRef}
              name="image"
              onChange={handleImageChange}
              hidden
            />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="row py-2">
        <div className="col-md-2 mt-2">
          <input
            name="name"
            placeholder="Product Name"
            type="text"
            className="form-control"
            value={product.name}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 mt-2">
          <input
            name="description"
            placeholder="Product Description"
            type="text"
            className="form-control"
            value={product.description}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-1 mt-2">
          <input
            name="count"
            placeholder="Qty"
            type="number"
            className="form-control"
            value={product.count}
            onChange={handleChange}
            min={0}
          />
        </div>
        <div className="col-md-1 mt-2">
          <input
            name="price"
            placeholder="₹ Price"
            type="number"
            className="form-control"
            value={product.price}
            onChange={handleChange}
            min={0}
          />
        </div>
        <div className="col-md-1 mt-2">
          <input
            name="discount"
            placeholder="% Off"
            type="number"
            className="form-control"
            value={product.discount}
            onChange={handleChange}
            min={0}
          />
        </div>
        <div className="col-md-1 text-center mt-2">
          <button
            className="btn btn-success"
            onClick={handleAddProduct}
            disabled={!isFormValid()}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>

      {/* Product history */}
      <div className="row">
        <div className="product-add-history">
          {products.map((p) => (
            <div key={p._id} className="outer-card">
              <div className="product-card">
                <div className="product-image-div">
                  <img src={getProductImage(p.imageUrl)} alt={p.name} />
                </div>
                <div className="product-price-div">
                  <b>{p.discount}%</b> &nbsp; <i>₹{p.price}</i>
                </div>
                <div className="alter-product">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteProduct(p._id)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => handleIncreaseProduct(p._id)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleReduceProduct(p._id)}
                    disabled={p.count <= 1}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                </div>
                <div className="product-name">{p.name}</div>
                <div className="product-description">{p.description}</div>
                <div className="add-to-cart-div">Qty: {p.count}</div>
              </div>
            </div>
          ))}
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
    </div>
  );
}

export default AddProducts;
