// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import './index.css';

import HomeScreen from './screens/HomeScreen';
import ClienteScreen from './screens/ClienteScreen';
import PedidoScreen from './screens/PedidoScreen';
import {
  NoCompraScreen,
  PedidoConfirmadoScreen,
  PedidosScreen,
  EstadisticasScreen,
} from './screens/OtherScreens';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Routes>
            <Route path="/"                        element={<HomeScreen />} />
            <Route path="/cliente/:id"             element={<ClienteScreen />} />
            <Route path="/pedido/:id"              element={<PedidoScreen />} />
            <Route path="/no-compra/:id"           element={<NoCompraScreen />} />
            <Route path="/pedido-confirmado/:id"   element={<PedidoConfirmadoScreen />} />
            <Route path="/pedidos"                 element={<PedidosScreen />} />
            <Route path="/estadisticas"            element={<EstadisticasScreen />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
