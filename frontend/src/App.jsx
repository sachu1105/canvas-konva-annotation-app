import KonvaCanvas from "./components/KonvaCanvas";
import { useState } from "react";
import templates from './templates.json'; // Import templates JSON

function App() {
  const [customPlaceholders, setCustomPlaceholders] = useState([]);
  const [activeSection, setActiveSection] = useState('upload'); // Add this state
  const [selectedTemplate, setSelectedTemplate] = useState(null); // State to store the selected template
  const [previewImage, setPreviewImage] = useState(null); // State to store the preview image
  console.log(templates)


  const addCustomPlaceholder = (placeholder) => {
    setCustomPlaceholders((prev) => [...prev, `{${placeholder}}`]);
  };

  const handleTemplateLoad = (template) => {
    setSelectedTemplate(template); // Set the selected template
  };

  const previewSavedCanvas = (image) => {
    setPreviewImage(image); // Set the preview image
  };

  const closePreview = () => {
    setPreviewImage(null); // Close the preview
  };

  console.log(templates);


  return (
    <div className="font-poppins">
      <KonvaCanvas
        addCustomPlaceholder={addCustomPlaceholder}
        customPlaceholders={customPlaceholders}
        activeSection={activeSection} // Pass activeSection as a prop
        setActiveSection={setActiveSection} // Pass setActiveSection as a prop
        templates={templates} // Pass templates as a prop
        handleTemplateLoad={handleTemplateLoad} // Pass handleTemplateLoad as a prop
        selectedTemplate={selectedTemplate} // Pass selectedTemplate as a prop
        previewSavedCanvas={previewSavedCanvas} // Pass previewSavedCanvas as a prop
        closePreview={closePreview} // Pass closePreview as a prop
        previewImage={previewImage} // Pass previewImage as a prop
      />
    </div>
  );
}

export default App;