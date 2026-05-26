// src/context/AppContext.js
import React, { createContext, useContext, useReducer } from 'react';
import { CLIENTES, PRODUCTOS } from '../data/mockData';

const AppContext = createContext(null);

const initialState = {
  clientes: CLIENTES,
  productos: PRODUCTOS,
  pedidoActual: {}, // { productoId: cantidad }
  visitaActiva: null, // id del cliente en visita
};

function reducer(state, action) {
  switch (action.type) {

    case 'INICIAR_VISITA':
      return { ...state, visitaActiva: action.clienteId, pedidoActual: {} };

    case 'ACTUALIZAR_CANTIDAD':
      return {
        ...state,
        pedidoActual: {
          ...state.pedidoActual,
          [action.productoId]: Math.max(0, action.cantidad),
        },
      };

    case 'TOGGLE_TAREA': {
      const clientes = state.clientes.map(c => {
        if (c.id !== action.clienteId) return c;
        return {
          ...c,
          tareas: c.tareas.map(t =>
            t.id === action.tareaId ? { ...t, done: !t.done } : t
          ),
        };
      });
      return { ...state, clientes };
    }

    case 'CONFIRMAR_PEDIDO': {
      const clientes = state.clientes.map(c => {
        if (c.id !== action.clienteId) return c;
        return {
          ...c,
          estado: 'visitado',
          resultado: 'pedido',
          pedidoHoy: action.total,
        };
      });
      return { ...state, clientes, pedidoActual: {}, visitaActiva: null };
    }

    case 'REGISTRAR_NO_COMPRA': {
      const clientes = state.clientes.map(c => {
        if (c.id !== action.clienteId) return c;
        return {
          ...c,
          estado: 'visitado',
          resultado: 'no_compra',
          motivo: action.motivo,
        };
      });
      return { ...state, clientes, visitaActiva: null };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
