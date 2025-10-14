import { useContext } from "react";
import Context from "../Context/Context";

const { serverUrl } = useContext(Context);

/**
 * Returns a full image URL for a product.
 * If image is missing, returns the default image.
 */
export function getProductImage(imagePath) {
  if (!imagePath) return "/add_image_default.jpg";
  if (imagePath.startsWith("http")) return imagePath;
  return `${serverUrl}${imagePath}`;
}
