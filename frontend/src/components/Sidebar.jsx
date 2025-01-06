import ShapeControls from './ShapeControls';
import ImageUpload from './ImageUpload';
import ColorPicker from './ColorPicker';

function Sidebar({ setShapes, setImage, setColor, currentColor }) {
  return (
    <div className="sidebar">
      <ShapeControls setShapes={setShapes} />
      <ImageUpload setImage={setImage} />
      <ColorPicker setColor={setColor} currentColor={currentColor} />
    </div>
  );
}

export default Sidebar;
