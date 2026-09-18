import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import { ProtectedRoute, AdminRoute, GuestOnlyRoute } from '../components/RouteGuards';

import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import VerifyOtp from '../pages/Auth/VerifyOtp';
import EventsList from '../pages/Events/EventsList';
import EventDetails from '../pages/Events/EventDetails';
import MyBookings from '../pages/Bookings/MyBookings';
import Profile from '../pages/Profile/Profile';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import EventForm from '../pages/Admin/EventForm';
import NotFound from '../pages/NotFound/NotFound';
import AllBookings from "../pages/Admin/AllBookings";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/events" element={<EventsList />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<AllBookings />} />
          <Route path="/admin/events/new" element={<EventForm />} />
          <Route path="/admin/events/:id/edit" element={<EventForm />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<GuestOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Route>

      {/* Verify-otp must stay reachable even mid-session (403-from-login redirect),
          so it intentionally sits outside GuestOnlyRoute. */}
      <Route element={<AuthLayout />}>
        <Route path="/verify-otp" element={<VerifyOtp />} />
      </Route>
    </Routes>
  );
}
