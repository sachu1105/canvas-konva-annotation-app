import KonvaCanvas from "./components/KonvaCanvas";
import { useState } from "react";

function App() {
  const [customPlaceholders, setCustomPlaceholders] = useState([]);
  const [activeSection, setActiveSection] = useState('upload'); // Add this state

  const addCustomPlaceholder = (placeholder) => {
    setCustomPlaceholders((prev) => [...prev, `{${placeholder}}`]);
  };

  return (
    <div className="font-poppins">
      <KonvaCanvas
        addCustomPlaceholder={addCustomPlaceholder}
        customPlaceholders={customPlaceholders}
        activeSection={activeSection} // Pass activeSection as a prop
        setActiveSection={setActiveSection} // Pass setActiveSection as a prop
      />
    </div>
  );
}

export default App;