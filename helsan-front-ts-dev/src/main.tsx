import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import App from "./App.tsx";
import Wrapper from "./components/wrapper/index.tsx";

createRoot(document.getElementById("root")!).render(
  <Wrapper>
    <StrictMode>
      <App />
    </StrictMode>
  </Wrapper>
);
