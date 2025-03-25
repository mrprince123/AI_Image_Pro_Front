import "./App.css";
import MainRoutes from "./routes/MainRoutes";

// export const baseUrl = "http://localhost:5000/api/v1";
export const baseUrl = "https://ai-image-pro-back.onrender.com/api/v1";

function App() {
  return (
    <>
      <MainRoutes />
    </>
  );
}

export default App;
