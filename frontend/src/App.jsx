import KonvaCanvas from "./components/KonvaCanvas";
import { useState } from "react";

function App() {
  const [customPlaceholders, setCustomPlaceholders] = useState([]);

  const addCustomPlaceholder = (placeholder) => {
    setCustomPlaceholders((prev) => [...prev, `{${placeholder}}`]);
  };

  return (
    <div>
      <KonvaCanvas
        addCustomPlaceholder={addCustomPlaceholder}
        customPlaceholders={customPlaceholders}
      />
    </div>
  );
}

export default App;