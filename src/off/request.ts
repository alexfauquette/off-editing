export const OFF_IMAGE_URL = "https://images.openfoodfacts.org/images/products";

const slicedCode = (code) => {
  if (code.length === 13) {
    return `${code.slice(0, 3)}/${code.slice(3, 6)}/${code.slice(
      6,
      9
    )}/${code.slice(9, 13)}`;
  }
  return code;
};

export const getImageUrl = (code, imageId, coordinates_image_size) => {
  if (code == null || imageId == null || coordinates_image_size == null) {
    return "";
  }
  return `${OFF_IMAGE_URL}/${slicedCode(code)}/${imageId}${
    coordinates_image_size === "full" ? "" : `.${coordinates_image_size}`
  }.jpg`;
};
