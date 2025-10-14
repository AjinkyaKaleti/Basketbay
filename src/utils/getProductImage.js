const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

/**
 * Returns a full image URL for a product.
 * If image is missing, returns the default image.
 */
export function getProductImage(imagePath) {
  if (!imagePath) return "/add_image_default.jpg";
  if (imagePath.startsWith("http")) return imagePath;
  return `${SERVER_URL}${imagePath}`;
}
