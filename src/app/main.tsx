import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import "@/shared/lib/i18n";

createRoot(document.getElementById("root")!).render(<App />);
