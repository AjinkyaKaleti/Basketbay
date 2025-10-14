import React, { useContext, useEffect, useState } from "react";
import Context from "../Context/Context";
import "./Products.css";
import axios from "axios";
import { getProductImage } from "../utils/getProductImage";
import ToastMessage from "../ToastMessage/ToastMessage";

function Products() {
  const { products, setProducts, setOrders, toast, setToast, serverUrl } =
    useContext(Context);

  const [page, setPage] = useState(1); // current page
  const [totalPages, setTotalPages] = useState(1); // total pages
  const limit = 6; // how many products per page (adjust as you like)
  const [sortBy, setSortBy] = useState("latest");

  const handleAddToCart = (product) => {
    setProducts((prevProducts) => {
      if (!product.count || product.count <= 0) {
        setToast({
          show: true,
          message: "Out of stock!",
          type: "error",
        });
        return prevProducts;
      }

      setOrders((prevOrders) => {
        const existing = prevOrders.find(
          (o) => o.id === product._id || o._id === product._id
        );

        if (existing) {
          // update count
          return prevOrders.map((o) =>
            o.id === product._id || o._id === product._id
              ? { ...o, count: o.count + 1 }
              : o
          );
        } else {
          const newOrderItem = {
            id: product._id, // always use MongoDB _id
            name: product.name,
            image: getProductImage(product.image || product.imageUrl),
            description: product.description,
            price: product.price,
            discount: product.discount || 0,
            count: 1,
          };
          return [...prevOrders, newOrderItem];
        }
      });

      setToast({
        show: true,
        message: "Product added to cart!",
        type: "success",
      });
      return prevProducts;
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/products?page=${page}&limit=${limit}&sort=${sortBy}`
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
  }, [page, sortBy, setProducts]);

  // Generate an array of page numbers for buttons
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  return (
    <>
      <div className="product-title-div py-1">
        <div className="text-center">
          <h1>Products</h1>
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center mt-2 mb-2">
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
      </div>

      <div className="d-flex justify-content-center align-items-center mt-2 mb-2">
        {/* sort filter */}
        <div className="dropdown ms-3">
          <button
            className="btn btn-outline-primary dropdown-toggle"
            type="button"
            id="sortDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Sort By:{" "}
            {sortBy === "latest"
              ? "Latest"
              : sortBy === "low-high"
              ? "Price: Low to High"
              : "Price: High to Low"}
          </button>
          <ul className="dropdown-menu" aria-labelledby="sortDropdown">
            <li>
              <button
                className="dropdown-item"
                onClick={() => setSortBy("latest")}
              >
                Latest{" "}
                {sortBy === "latest" && (
                  <span className="sort-tickmark">✔</span>
                )}
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => setSortBy("low-high")}
              >
                Price: Low to High{" "}
                {sortBy === "low-high" && (
                  <span className="sort-tickmark">✔</span>
                )}
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => setSortBy("high-low")}
              >
                Price: High to Low{" "}
                {sortBy === "high-low" && (
                  <span className="sort-tickmark">✔</span>
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="product-container">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => {
            return (
              <div key={product.id || product._id} className="outer-card">
                <div className="product-card">
                  <div className="product-image-div">
                    <img src={product.image} alt="product-image" />
                  </div>
                  <div className="product-price-div">
                    <b className="product-discounted-price">
                      {product.price - (product.price * product.discount) / 100}{" "}
                      ₹
                    </b>
                    &emsp;<i className="product-price">{product.price}</i>
                  </div>
                  <div>
                    <div
                      className="product-name"
                      data-bs-toggle="tooltip"
                      title={product.name}
                    >
                      {product.name}
                    </div>
                    <div
                      className="product-description"
                      data-bs-toggle="tooltip"
                      title={product.description}
                    >
                      {product.description}
                    </div>
                  </div>
                  <div className="add-to-cart-div">
                    <button
                      id="add-to-cart-button"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.count === 0}
                    >
                      {product.count > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="outer-card text-center">
            <p>No products available</p>
          </div>
        )}
      </div>

      {toast.show && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </>
  );
}

export default Products;
