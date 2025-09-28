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
    price: "",
    discount: "",
    count: "",
    image: "",
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
    if (file) {
      setImage(file);
    }
  };

  const productUploadImage = () => {
    inputRef.current.click();
  };

  //Add product
  const handleAddProduct = async () => {
    try {
      const fd = new FormData();
      fd.append("name", product.name);
      fd.append("description", product.description);
      fd.append("count", product.count);
      fd.append("price", product.price);
      fd.append("discount", product.discount);
      if (image) fd.append("image", image);

      const res = await axios.post(
        "https://basketbay-backend-production.up.railway.app/api/products",
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newProduct = res.data.product;

      //When setting new product after upload
      newProduct.image = getProductImage(newProduct.image);

      setProducts((prev) => [newProduct, ...prev]);

      // Reset form
      setProduct({
        name: "",
        description: "",
        count: "",
        price: "",
        discount: "",
        image: "",
      });
      setImage(null);
      if (inputRef.current) inputRef.current.value = "";

      setToast({
        show: true,
        message: "Product added to Inventory!",
        type: "success",
      });
    } catch (err) {
      console.error(err);
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
        `https://basketbay-backend-production.up.railway.app/api/products/${id}`
      );
      const refreshed = await axios.get(
        "https://basketbay-backend-production.up.railway.app/api/products"
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
        `https://basketbay-backend-production.up.railway.app/api/products/increase/${id}`
      );
      const refreshed = await axios.get(
        "https://basketbay-backend-production.up.railway.app/api/products"
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
        `https://basketbay-backend-production.up.railway.app/api/products/decrease/${id}`
      );
      const updatedProduct = res.data.product;

      setProducts((prev) =>
        prev.map((p) =>
          p._id === id
            ? {
                ...updatedProduct,
                image: getProductImage(updatedProduct.image),
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
          {products.map((p) => (
            <div key={p._id} className="outer-card">
              <div className="product-card">
                <div className="product-image-div">
                  <img src={getProductImage(p.image)} alt={p.name} />
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
