
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

import MenuBarLayout from './layouts/MenuBarLayout';
import EntertainmentPage from './pages/entertainment';
import EntertainmentTypePage from './pages/entertainment/type';

import IWeaponPage from './pages/i-weapon/iWeapon';
import IWeaponClassPage from './pages/i-weapon/iWeaponClass';
import IWeaponCaliberPage from './pages/i-weapon/iWeaponCaliber';
import IWeaponOriginPage from './pages/i-weapon/iWeaponOrigin';
import WifiQr from './pages/qrcodegen';


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

          <Route path="/qrcode" element={<WifiQr />} />

          <Route element={<MenuBarLayout />}>
            <Route path="/entertainment" element={<EntertainmentPage />} />
            <Route path="/entertainment-types" element={<EntertainmentTypePage />} />
          </Route>
          
          <Route element={<MenuBarLayout
                menus={[
                    { label: "List Weapons", to: "/i-weapon" },
                    { label: "Classes", to: "/i-weapon-class" },
                    { label: "Calibers", to: "/i-weapon-caliber" },
                    { label: "Origins", to: "/i-weapon-origin" },
                ]}
            />}>
            <Route path="/i-weapon" element={<IWeaponPage />} />
            <Route path="/i-weapon-class" element={<IWeaponClassPage />} />
            <Route path="/i-weapon-caliber" element={<IWeaponCaliberPage />} />
            <Route path="/i-weapon-origin" element={<IWeaponOriginPage />} />
          </Route>

          <Route path="/servers" element={<ServerBrowserPage />} />
          <Route path="/room" element={<RoomPage />} />
        </Route>
      </Route>

    </Routes>
  )
}

export default App
