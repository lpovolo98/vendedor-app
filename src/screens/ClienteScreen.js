// src/screens/ClienteScreen.js
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lightbulb, Phone, Clock, ShoppingCart, XCircle, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTimer } from '../hooks/useTimer';
import { TopBar, Pill, Btn, TaskCheck, SectionLabel, formatPeso } from '../components/UI';

export default function ClienteScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const timer = useTimer();

  const cliente = state.clientes.find(c => c.id === Number(id));

  useEffect(() => {
    if (cliente) {
      dispatch({ type: 'INICIAR_VISITA', clienteId: cliente.id });
      timer.start();
    }
    return () => timer.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!cliente) {
    return (
      <div className="screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--gray-400)' }}>Cliente no encontrado</p>
        <Btn onClick={() => navigate('/')}>Volver</Btn>
      </div>
    );
  }

  const tareasCompletadas = cliente.tareas.filter(t => t.done).length;

  return (
    <div className="screen">
      <TopBar
        title={cliente.nombre}
        subtitle={cliente.direccion}
        onBack={() => navigate('/')}
        right={<Pill variant="warning">En visita</Pill>}
      />

      <div className="scroll-content">
        {/* Timer */}
        <div className="timer-strip">
          <div className="timer-dot" />
          <Clock size={16} color="var(--gray-400)" />
          <span style={{ fontSize: 13, color: 'var(--gray-400)', flex: 1 }}>Tiempo en visita</span>
          <span className="timer-value">{timer.display}</span>
        </div>

        {/* Info rápida */}
        <div style={{ display: 'flex', gap: 8, padding: '0 16px 4px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--gray-400)', background: 'var(--gray-100)', padding: '4px 10px', borderRadius: 20 }}>
            Última compra: {cliente.ultimaCompra}
          </span>
          <span style={{ fontSize: 12, color: 'var(--gray-400)', background: 'var(--gray-100)', padding: '4px 10px', borderRadius: 20 }}>
            Promedio: {formatPeso(cliente.promedio)}
          </span>
        </div>

        {/* Sugerencias IA */}
        {cliente.sugerencias.map(s => (
          <div key={s.id} className="suggestion-card">
            <Lightbulb size={16} className="suggestion-icon" />
            <div>
              <div className="suggestion-title">Sugerencia de incorporación</div>
              <div className="suggestion-body">
                {s.mensaje}{' '}
                Ofrecer con <strong>{s.descuento}% de descuento</strong> en primer pedido.
              </div>
            </div>
          </div>
        ))}

        {/* Tareas */}
        {cliente.tareas.length > 0 && (
          <>
            <SectionLabel>
              Tareas en punto de venta · {tareasCompletadas}/{cliente.tareas.length}
            </SectionLabel>
            <div style={{ margin: '0 16px', background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '4px 16px' }}>
              {cliente.tareas.map(tarea => (
                <div key={tarea.id} className="task-row">
                  <TaskCheck
                    done={tarea.done}
                    onToggle={() => dispatch({ type: 'TOGGLE_TAREA', clienteId: cliente.id, tareaId: tarea.id })}
                  />
                  <span className={`task-text${tarea.done ? ' done' : ''}`}>{tarea.texto}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Navegación */}
        <SectionLabel>Navegación</SectionLabel>
        <div style={{ padding: '0 16px 16px' }}>
          <Btn variant="secondary" onClick={() => window.open(`https://maps.google.com?q=${cliente.lat},${cliente.lng}`, '_blank')}>
            <Navigation size={15} />
            Abrir en Google Maps
          </Btn>
        </div>

        {/* Acciones */}
        <SectionLabel>Acciones</SectionLabel>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Btn onClick={() => navigate(`/pedido/${cliente.id}`)}>
            <ShoppingCart size={16} />
            Tomar pedido
          </Btn>
          <Btn variant="danger" onClick={() => navigate(`/no-compra/${cliente.id}`)}>
            <XCircle size={15} />
            Registrar sin venta
          </Btn>
        </div>

        <div style={{ padding: '12px 16px', textAlign: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--gray-200)' }}>
            GPS activo · ubicación registrándose
          </span>
        </div>
      </div>
    </div>
  );
}
