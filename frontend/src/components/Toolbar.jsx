import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react";

const Toolbar = ({ handleZoomIn, handleZoomOut, handleResetZoom }) => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
      <button
        onClick={handleZoomIn}
        className="p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
      >
        <ZoomIn size={20} />
      </button>
      <button
        onClick={handleZoomOut}
        className="p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
      >
        <ZoomOut size={20} />
      </button>
      <button
        onClick={handleResetZoom}
        className="p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
      >
        <RefreshCw size={20} />
      </button>
    </div>
  );
};

export default Toolbar;