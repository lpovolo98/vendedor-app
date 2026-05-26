// src/screens/NoCompraScreen.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Ban, Package, UserX, Tag, Store, Clock, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TopBar, Btn } from '../components/UI';
import { MOTIVOS_NO_COMPRA } from '../data/mockData';

const ICONOS = { ban: Ban, package: Package, 'user-x': UserX, tag: Tag, 'store-off': Store, clock: Clock };

export function NoCompraScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [seleccionado, setSeleccionado] = useState(null);
  const [obs, setObs] = useState('');

  const handleRegistrar = () => {
    if (!seleccionado) return;
    dispatch({
      type: 'REGISTRAR_NO_COMPRA',
      clienteId: Number(id),
      motivo: seleccionado,
      observaciones: obs,
    });
    navigate('/');
  };

  return (
    <div className="screen">
      <TopBar title="Motivo sin venta" onBack={() => navigate(`/cliente/${id}`)} />
      <div style={{ padding: '16px', flex: 1 }}>
        <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 14 }}>
          Seleccioná el motivo principal:
        </p>
        {MOTIVOS_NO_COMPRA.map(m => {
          const Icono = ICONOS[m.icono] || Ban;
          const selected = seleccionado === m.texto;
          return (
            <button
              key={m.id}
              className={`motivo-btn${selected ? ' selected' : ''}`}
              onClick={() => setSeleccionado(m.texto)}
            >
              <Icono size={16} />
              {m.texto}
            </button>
          );
        })}
        <textarea
          placeholder="Observaciones adicionales (opcional)..."
          value={obs}
          onChange={e => setObs(e.target.value)}
          style={{ width: '100%', minHeight: 72, marginTop: 4, resize: 'none', borderRadius: 'var(--radius-md)', padding: 10, fontSize: 13, border: '1px solid var(--gray-200)', background: '#fff', color: 'var(--gray-900)' }}
          aria-label="Observaciones"
        />
        <div style={{ marginTop: 12 }}>
          <Btn onClick={handleRegistrar} disabled={!seleccionado}>
            <Check size={15} />
            Registrar y continuar ruta
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// src/screens/PedidoConfirmadoScreen.js
import { useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { formatPeso } from '../components/UI';

export function PedidoConfirmadoScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const resumen = location.state?.resumen || { total: 0, items: 0, unidades: 0 };

  return (
    <div className="screen" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px 24px' }}>
      <div className="success-icon">
        <CheckCircle2 size={34} color="var(--green-600)" />
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 8 }}>
        Pedido enviado a ODOO
      </div>
      <div style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 4 }}>
        Pedido confirmado exitosamente
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--gray-900)', margin: '16px 0' }}>
        {formatPeso(resumen.total)}
      </div>
      <div style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 32 }}>
        {resumen.items} productos · {resumen.unidades} unidades · Lista A
      </div>
      <Btn onClick={() => navigate('/')}>
        Continuar con siguiente cliente
      </Btn>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// src/screens/PedidosScreen.js
import { useApp as useAppPedidos } from '../context/AppContext';
import { TopBar as TopBarP, SectionLabel as SL, StatGrid as SG, StatCard as SC, Pill as P, formatPeso as fp } from '../components/UI';

export function PedidosScreen() {
  const navigate = useNavigate();
  const { state } = useAppPedidos();

  const visitados = state.clientes.filter(c => c.estado === 'visitado');
  const conPedido = visitados.filter(c => c.resultado === 'pedido');
  const sinPedido = visitados.filter(c => c.resultado === 'no_compra');
  const totalFacturado = conPedido.reduce((s, c) => s + (c.pedidoHoy || 0), 0);
  const efectividad = visitados.length > 0 ? Math.round((conPedido.length / visitados.length) * 100) : 0;

  return (
    <div className="screen">
      <TopBarP title="Mis pedidos de hoy" onBack={() => navigate('/')} />
      <div className="scroll-content">
        <SG>
          <SC label="Total facturado" value={fp(totalFacturado)} />
          <SC label="Efectividad" value={`${efectividad}%`} valueColor={efectividad >= 70 ? 'var(--green-600)' : 'var(--gray-900)'} />
        </SG>

        {conPedido.length > 0 && (
          <>
            <SL>Con pedido ({conPedido.length})</SL>
            <div className="card-list">
              {conPedido.map(c => (
                <div key={c.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>{c.nombre}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{c.direccion}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--green-600)' }}>{fp(c.pedidoHoy)}</div>
                    <P variant="success">Pedido</P>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {sinPedido.length > 0 && (
          <>
            <SL>Sin venta ({sinPedido.length})</SL>
            <div className="card-list">
              {sinPedido.map(c => (
                <div key={c.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>{c.nombre}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{c.motivo || 'Sin motivo registrado'}</div>
                  </div>
                  <P variant="danger">Sin pedido</P>
                </div>
              ))}
            </div>
          </>
        )}

        {visitados.length === 0 && (
          <div style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--gray-400)' }}>
            <div style={{ fontSize: 14 }}>Todavía no visitaste ningún cliente hoy.</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// src/screens/EstadisticasScreen.js
export function EstadisticasScreen() {
  const navigate = useNavigate();
  const { state } = useAppPedidos();

  const visitados = state.clientes.filter(c => c.estado === 'visitado');
  const conPedido = visitados.filter(c => c.resultado === 'pedido');
  const totalFacturado = conPedido.reduce((s, c) => s + (c.pedidoHoy || 0), 0);
  const ticketProm = conPedido.length > 0 ? Math.round(totalFacturado / conPedido.length) : 0;
  const efectividad = visitados.length > 0 ? Math.round((conPedido.length / visitados.length) * 100) : 0;

  return (
    <div className="screen">
      <TopBarP title="Estadísticas" onBack={() => navigate('/')} />
      <div className="scroll-content">
        <SG>
          <SC label="Total facturado" value={fp(totalFacturado)} />
          <SC label="Efectividad" value={`${efectividad}%`} valueColor="var(--green-600)" />
          <SC label="Ticket promedio" value={fp(ticketProm)} />
          <SC label="Clientes" value={`${visitados.length} / ${state.clientes.length}`} sub="visitados" />
        </SG>

        <SL>Ranking de clientes</SL>
        <div className="card-list">
          {conPedido
            .sort((a, b) => b.pedidoHoy - a.pedidoHoy)
            .map((c, i) => (
              <div key={c.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--green-600)', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>{c.nombre}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{c.direccion}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--green-600)' }}>{fp(c.pedidoHoy)}</div>
              </div>
            ))}
        </div>

        {conPedido.length === 0 && (
          <div style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--gray-400)', fontSize: 14 }}>
            Sin datos todavía. Visitá clientes para ver estadísticas.
          </div>
        )}
      </div>
    </div>
  );
}
