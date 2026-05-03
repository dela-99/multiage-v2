import { ThemeProvider }       from "./context/ThemeContext";
import { DeviceColorProvider } from "./context/DeviceColorContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { BrowserRouter, Routes, Route } from "./router";
import ProtectedRoute from "./components/ProtectedRoute";

import Home             from "./pages/Home";
import StorePage        from "./pages/StorePage";
import NetworkingPage   from "./pages/NetworkingPage";
import SoftwarePage     from "./pages/SoftwarePage";
import ServicesPage     from "./pages/ServicesPage";
import ContactPage      from "./pages/ContactPage";
import LoginPage        from "./pages/LoginPage";
import AdminLogin       from "./pages/AdminLogin";
import HardwarePage     from "./pages/HardwarePage";
import AdminDashboard   from "./pages/AdminDashboard";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import RegisterPage from "./pages/RegisterPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import NotFoundPage from "./pages/NotFoundPage";
import PaymentCallbackPage from "./pages/PaymentCallbackPage";
import ProductDetails from "./pages/ProductDetails";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import CartPage from "./pages/CartPage";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <DeviceColorProvider>
              <Routes>
                <Route path="/"                     element={<Home />} />
                <Route path="/store"                element={<StorePage />} />
                <Route path="/networking"           element={<NetworkingPage />} />
                <Route path="/software-development" element={<SoftwarePage />} />
                <Route path="/services"             element={<ServicesPage />} />
                <Route path="/hardware"             element={<HardwarePage />} />
                <Route path="/contact"              element={<ContactPage />} />
                <Route path="/product/:id"          element={<ProductDetails />} />
                <Route path="/cart"                 element={<CartPage />} />
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
                  path="/payment/callback"
                  element={<PaymentCallbackPage />}
                />
                <Route
                  path="/order-confirmation"
                  element={(
                    <ProtectedRoute>
                      <OrderConfirmationPage />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/my-orders"
                  element={(
                    <ProtectedRoute>
                      <MyOrdersPage />
                    </ProtectedRoute>
                  )}
                />
                <Route path="*"                     element={<NotFoundPage />} />
              </Routes>
            </DeviceColorProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
