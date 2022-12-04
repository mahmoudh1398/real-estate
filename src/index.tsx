import ReactDOM from "react-dom/client";
import "mapbox-gl/dist/mapbox-gl.css";
// import "./index.css";
import App from "./pages/App";
import "./assets/styles/main.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
