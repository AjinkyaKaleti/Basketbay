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

  const [page, setPage] = useState(1); // current page
  const [totalPages, setTotalPages] = useState(1); // total pages
  const limit = 6; // how many products per page (adjust as you like)

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

  //reset form
  const resetForm = () => {
    setProduct({
      name: "",
      description: "",
      count: "",
      price: "",
      discount: "",
      imageUrl: "",
    });
    setImage(null);
    if (inputRef.current) inputRef.current.value = null;
  };

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
    } else {
    }
  };

  const productUploadImage = () => {
    inputRef.current.click();
  };

  // Check if all required fields are filled
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

  //Add product
  const handleAddProduct = async () => {
    try {
      let imageUrl = "";

      // Upload image if selected
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const uploadRes = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/upload/image`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (uploadRes.data.url) {
          imageUrl = uploadRes.data.url;
        } else {
          throw new Error("No image URL returned from server");
        }
      }

      const fd = {
        ...product,
        count: parseInt(product.count, 10) || 0,
        price: parseFloat(product.price) || 0,
        discount: parseFloat(product.discount) || 0,
        imageUrl: imageUrl || "/add_image_default.jpg",
      };

      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/products`,
        fd
      );

      const newProduct = res.data.product;
      setProducts((prev) => [newProduct, ...prev]);

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/products?page=${page}&limit=${limit}`
        );
        const productsArray = res.data.products || [];
        const productsWithImages = productsArray.map((p) => ({
          ...p,
          image: getProductImage(p.image || p.imageUrl),
          initialStock: p.count,
        }));
        setProducts(productsWithImages);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching products", err);
        setProducts([]); // fallback to empty array
      }
    };
    fetchProducts();
  }, [page, setProducts]);

  // Generate an array of page numbers for buttons
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

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
          <button
            className="btn btn-success"
            onClick={handleAddProduct}
            disabled={!isFormValid()}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>

      {/* Bootstrap Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Product page navigation" className="my-3 mt-auto">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
            </li>

            {pageNumbers.map((num) => (
              <li
                key={num}
                className={`page-item ${num === page ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setPage(num)}>
                  {num}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${page === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

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
