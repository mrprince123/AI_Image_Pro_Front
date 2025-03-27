import "./App.css";
import AutoLogoutHandler from "./middleware/AutoLogoutHandler";
import MainRoutes from "./routes/MainRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// export const baseUrl = "http://localhost:5000/api/v1";
export const baseUrl = "https://ai-image-pro-back.onrender.com/api/v1";



function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AutoLogoutHandler />
      <MainRoutes />
    </QueryClientProvider>
  );
}

export default App;
