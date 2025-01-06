
const OverlayImageUpload = ({ handleOverlayImageUpload }) => {
  return (
    <div className="mb-4">
      <label htmlFor="upload-overlay-image" className="p-2 border border-gray-300 rounded cursor-pointer">
        Upload Overlay Image
      </label>
      <input
        id="upload-overlay-image"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleOverlayImageUpload}
      />
    </div>
  );
};

export default OverlayImageUpload;
