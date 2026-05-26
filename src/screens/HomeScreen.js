// src/screens/HomeScreen.js
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CheckCircle2, TrendingUp, Clock, BarChart2, FileText, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VENDEDOR, META_DIA } from '../data/mockData';
import { StatGrid, StatCard, SectionLabel, Pill, Btn, formatPeso } from '../components/UI';

function StopBadge({ numero, estado }) {
  const cls = estado === 'visitado' ? 'stop-done' : estado === 'activo' ? 'stop-current' : 'stop-pending';
  return (
    <div className={`stop-badge ${cls}`}>
      {estado === 'visitado' ? <CheckCircle2 size={14} /> : numero}
    </div>
  );
}

function ClienteCard({ cliente, numero, onPress }) {
  const esCurrent = cliente.estado === 'pendiente' && numero === 3; // primer pendiente
  const esVisitado = cliente.estado === 'visitado';

  const pillaVariant = cliente.resultado === 'pedido' ? 'success'
    : cliente.resultado === 'no_compra' ? 'danger'
    : esCurrent ? 'warning' : 'neutral';

  const pillaTexto = cliente.resultado === 'pedido' ? 'Pedido'
    : cliente.resultado === 'no_compra' ? 'Sin pedido'
    : esCurrent ? 'Siguiente' : 'Pendiente';

  return (
    <div
      className={`client-card animate-in ${esCurrent ? 'is-current' : ''} ${esVisitado ? 'is-done' : ''}`}
      onClick={() => !esVisitado && onPress(cliente.id)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <StopBadge numero={numero} estado={esVisitado ? 'visitado' : esCurrent ? 'activo' : 'pendiente'} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 2 }}>
            {cliente.nombre}
          </div>
          <div style={{ fontSize: 12, color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={11} />
            {cliente.direccion}
            {cliente.resultado === 'pedido' && (
              <span style={{ color: 'var(--green-600)', fontWeight: 600, marginLeft: 4 }}>
                · {formatPeso(cliente.pedidoHoy)}
              </span>
            )}
          </div>
        </div>
        <Pill variant={pillaVariant}>{pillaTexto}</Pill>
      </div>

      {esCurrent && (
        <div style={{ marginTop: 12 }}>
          <Btn onClick={(e) => { e.stopPropagation(); onPress(cliente.id); }}>
            <Play size={14} />
            Iniciar visita · {cliente.distancia}
          </Btn>
        </div>
      )}
    </div>
  );
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const { state } = useApp();

  const { clientes } = state;

  const stats = useMemo(() => {
    const visitados = clientes.filter(c => c.estado === 'visitado').length;
    const conPedido = clientes.filter(c => c.resultado === 'pedido').length;
    const totalFacturado = clientes.reduce((s, c) => s + (c.pedidoHoy || 0), 0);
    return { visitados, conPedido, total: clientes.length, totalFacturado };
  }, [clientes]);

  const metaPct = Math.min(100, Math.round((stats.totalFacturado / META_DIA) * 100));

  return (
    <div className="screen">
      {/* Header */}
      <div className="topbar" style={{ paddingTop: 'calc(12px + var(--safe-top))' }}>
        <div style={{ flex: 1 }}>
          <div className="topbar-title">Buenos días, {VENDEDOR.nombre.split(' ')[0]}</div>
          <div className="topbar-sub">
            {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Pill variant="success">Online</Pill>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'var(--green-50)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: 'var(--green-600)',
            border: '1px solid var(--green-100)',
          }}>
            {VENDEDOR.iniciales}
          </div>
        </div>
      </div>

      <div className="scroll-content">
        {/* Stats */}
        <StatGrid>
          <StatCard
            label="Clientes hoy"
            value={`${stats.visitados} / ${stats.total}`}
            sub={`${stats.conPedido} con pedido`}
          />
          <StatCard
            label="Facturado"
            value={formatPeso(stats.totalFacturado)}
            sub={`meta ${formatPeso(META_DIA)}`}
          />
        </StatGrid>

        {/* Barra de progreso meta */}
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: 'var(--gray-400)' }}>
            <span>Progreso de meta</span>
            <span style={{ fontWeight: 600, color: metaPct >= 100 ? 'var(--green-600)' : 'var(--gray-600)' }}>{metaPct}%</span>
          </div>
          <div style={{ height: 6, background: 'var(--gray-200)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${metaPct}%`,
              background: metaPct >= 100 ? 'var(--green-400)' : 'var(--green-400)',
              borderRadius: 99,
              transition: 'width 600ms ease',
            }} />
          </div>
        </div>

        {/* Mapa placeholder */}
        <div className="map-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
          <MapPin size={24} color="var(--green-400)" />
          <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>Mapa de ruta — {stats.total} paradas</span>
          <span style={{ fontSize: 11, color: 'var(--gray-200)' }}>Se activa con leaflet en producción</span>
        </div>

        {/* Lista de clientes */}
        <SectionLabel>Ruta del día</SectionLabel>
        <div className="card-list">
          {clientes.map((cliente, i) => (
            <ClienteCard
              key={cliente.id}
              cliente={cliente}
              numero={i + 1}
              onPress={(id) => {
                navigate(`/cliente/${id}`);
              }}
            />
          ))}
        </div>

        {/* Accesos rápidos */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '16px 16px' }}>
          <Btn variant="secondary" onClick={() => navigate('/pedidos')}>
            <FileText size={15} />
            Mis pedidos
          </Btn>
          <Btn variant="secondary" onClick={() => navigate('/estadisticas')}>
            <BarChart2 size={15} />
            Estadísticas
          </Btn>
        </div>
      </div>
    </div>
  );
}
