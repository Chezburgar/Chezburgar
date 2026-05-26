import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Grades from "./pages/Grades";
import Suggest from "./pages/Suggest";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";

// The base path is `/Chezburgar/` on GitHub Pages but `/` in dev.
// `import.meta.env.BASE_URL` resolves to whatever Vite is configured for.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <BrowserRouter basename={basename || "/"}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="grades" element={<Grades />} />
          <Route path="suggest" element={<Suggest />} />
          <Route path="settings" element={<Settings />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
