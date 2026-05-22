import { ThemeProvider }       from "./context/ThemeContext";
import { DeviceColorProvider } from "./context/DeviceColorContext";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes, Route } from "./router";
import ProtectedRoute from "./components/ProtectedRoute";

import Home             from "./pages/Home";
import NetworkingPage   from "./pages/NetworkingPage";
import SoftwarePage     from "./pages/SoftwarePage";
import ServicesPage     from "./pages/ServicesPage";
import ContactPage      from "./pages/ContactPage";
import LoginPage        from "./pages/LoginPage";
import AdminLogin       from "./pages/AdminLogin";
import HardwarePage     from "./pages/HardwarePage";
import AdminDashboard   from "./pages/AdminDashboard";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
            <DeviceColorProvider>
              <Routes>
                <Route path="/"                     element={<Home />} />
                <Route path="/networking"           element={<NetworkingPage />} />
                <Route path="/software-development" element={<SoftwarePage />} />
                <Route path="/services"             element={<ServicesPage />} />
                <Route path="/studio"               element={<ServicesPage />} />
                <Route path="/hardware"             element={<HardwarePage />} />
                <Route path="/contact"              element={<ContactPage />} />
                <Route path="/login"                element={<LoginPage />} />
                <Route path="/register"             element={<RegisterPage />} />
                <Route path="/forgot-password"      element={<ForgotPasswordPage />} />
                <Route path="/reset-password"       element={<ResetPasswordPage />} />
                <Route path="/admin/login"          element={<AdminLogin />} />
                <Route path="/admin-login"          element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={(
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/admin/dashboard"
                  element={(
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/admin/messages"
                  element={(
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  )}
                />
                <Route path="*"                     element={<NotFoundPage />} />
              </Routes>
            </DeviceColorProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
