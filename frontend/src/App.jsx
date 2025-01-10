import KonvaCanvas from "./components/KonvaCanvas";
import { useState } from "react";
import templates from './templates.json'; // Import templates JSON

function App() {
  const [customPlaceholders, setCustomPlaceholders] = useState([]);
  const [activeSection, setActiveSection] = useState('upload'); // Add this state
  const [selectedTemplate, setSelectedTemplate] = useState(null); // State to store the selected template
  console.log(templates)


  const addCustomPlaceholder = (placeholder) => {
    setCustomPlaceholders((prev) => [...prev, `{${placeholder}}`]);
  };

  const handleTemplateLoad = (template) => {
    setSelectedTemplate(template); // Set the selected template
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
        
      />
    </div>
  );
}

export default App;