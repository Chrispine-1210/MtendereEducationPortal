import { createRoot } from "react-DOM/client";
import App from "./App";
import "./index.css";

createRoot (document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )