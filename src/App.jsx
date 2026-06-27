import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from 'framer-motion';

import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import AllPets from './pages/AllPets';
import PetDetails from './pages/PetDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import DashboardHome from './dashboard/DashboardHome';
import MyRequests from './dashboard/MyRequests';
import MyListings from './dashboard/MyListings';
import AddPet from './dashboard/AddPet';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pets" element={<AllPets />} />
          <Route path="/pets/:id" element={
            <ProtectedRoute><PetDetails /></ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardLayout /></ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="my-requests" element={<MyRequests />} />
          <Route path="my-listings" element={<MyListings />} />
          <Route path="add-pet" element={<AddPet />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AnimatedRoutes />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
