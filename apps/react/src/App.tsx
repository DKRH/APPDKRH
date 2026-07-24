
import './App.css'
import {
	Routes,
	Route,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from './pages/RegisterPage';
import GuestRoute from './components/GuestRoute';
import ProtectedRoute from './components/ProtectedRoute';

import AppLayout from './layouts/AppLayout';

import Dashboard from './pages/dashboard';
import ServerBrowserPage from "./pages/ServerBrowserPage";
import RoomPage from "./pages/RoomPage";
import Weapons from './pages/weapon';
import PassbankPage from './pages/passbank';

import EntertainmentLayout from './layouts/EntertainmentLayout';
import EntertainmentPage from './pages/entertainment';
import EntertainmentTypePage from './pages/entertainment/type';


function App() {

  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/weapons" element={<Weapons />} />
          <Route path="/passbank" element={<PassbankPage />} />

          <Route element={<EntertainmentLayout />}>
            <Route path="/entertainment" element={<EntertainmentPage />} />
            <Route path="/entertainment-types" element={<EntertainmentTypePage />} />
          </Route>

          <Route path="/servers" element={<ServerBrowserPage />} />
          <Route path="/room" element={<RoomPage />} />
        </Route>
      </Route>

    </Routes>
  )
}

export default App
