import React, { useState, useRef, useContext } from "react";
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
    price: null,
    discount: null,
    count: null,
    imageUrl: "",
  });

  const [image, setImage] = useState(null);
  const inputRef = useRef(null);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  //File input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    if (file) {
      setImage(file);
      console.log("Image state updated:", file.name, file.size);
    }
  };

  const productUploadImage = () => {
    inputRef.current.click();
  };

  //Add product
  const handleAddProduct = async () => {
    try {
      let imageUrl = "";

      // Upload image to Cloudinary if a file is selected
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        console.log("FormData entries:");
        for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

        const uploadRes = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/upload/image`,
          formData
        );

        console.log(
          "Cloudinary upload response:",
          JSON.stringify(uploadRes.data, null, 2)
        );

        imageUrl = uploadRes.data.url; // Cloudinary URL
      }

      // Now add product with imageUrl
      const fd = {
        ...product,
        count: parseInt(product.count, 10) || 0,
        price: parseFloat(product.price) || 0,
        discount: parseFloat(product.discount) || 0,
        imageUrl: imageUrl || "/add_image_default.jpg", // fallback,
      };

      console.log("fd var holds:", JSON.stringify(fd, null, 2));

      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/products`,
        fd
      );
      const newProduct = res.data.product;
      // console.log(res);

      setProducts((prev) => [newProduct, ...prev]);

      // Reset form
      setProduct({
        name: "",
        description: "",
        count: "",
        price: "",
        discount: "",
        imageUrl: "",
      });
      setImage(null);
      if (inputRef.current) inputRef.current.value = "";

      setToast({
        show: true,
        message: "Product added to Inventory!",
        type: "success",
      });
    } catch (err) {
      if (err.response) {
        console.error(
          "Server error:",
          JSON.stringify(err.response.data, null, 2)
        );
      } else if (err.request) {
        console.error("No response received:", err.request);
      } else {
        console.error("Error:", err.message);
      }
      setToast({
        show: true,
        message: "Failed to add product!",
        type: "warning",
      });
    }
  };

  //delete product
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/products/${id}`
      );
      const refreshed = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/products`
      );
      setProducts(refreshed.data.products || refreshed.data);

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

  //increase product quantity
  const handleIncreaseProduct = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/products/increase/${id}`
      );
      const refreshed = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/products`
      );
      setProducts(refreshed.data.products || refreshed.data);

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

  // Reduce product quantity
  const handleReduceProduct = async (id) => {
    try {
      // setProducts(updatedProducts);
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
              className="product-upload-choose-file"
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
            required
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
            required
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
            required
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
            required
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
            required
            min={0}
          />
        </div>
        <div className="col-md-1 text-center mt-2">
          <button className="btn btn-success" onClick={handleAddProduct}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>

      {/* Product history */}
      <div className="row">
        <div className="product-add-history">
          {/* {console.log(products)} */}
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
