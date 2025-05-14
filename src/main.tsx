import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-datepicker/dist/react-datepicker.css";
import 'react-tooltip/dist/react-tooltip.css'


createRoot(document.getElementById("root")!).render(<App />);
