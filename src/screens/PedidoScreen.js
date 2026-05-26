// src/screens/PedidoScreen.js
import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, AlertTriangle, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TopBar, SectionLabel, Btn, Pill, formatPeso } from '../components/UI';

function ProductoRow({ producto, cantidad, onChange }) {
  const precioConDto = producto.descuento > 0
    ? producto.precio * (1 - producto.descuento / 100)
    : producto.precio;

  return (
    <div className="product-row">
      <div className="product-info">
        <div className="product-name">
          {producto.nombre}
          {producto.esNuevo && (
            <span className="pill pill-warning" style={{ marginLeft: 6, fontSize: 10 }}>Nuevo</span>
          )}
        </div>
        <div className="product-price" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {producto.descuento > 0 ? (
            <>
              <span style={{ textDecoration: 'line-through', color: 'var(--gray-200)' }}>
                {formatPeso(producto.precio)}
              </span>
              <span style={{ color: 'var(--green-600)', fontWeight: 600 }}>
                {formatPeso(precioConDto)}
              </span>
              <span style={{ background: 'var(--green-50)', color: 'var(--green-800)', fontSize: 10, padding: '1px 6px', borderRadius: 99, fontWeight: 600 }}>
                -{producto.descuento}%
              </span>
            </>
          ) : (
            <span>{formatPeso(producto.precio)}</span>
          )}
          {producto.stockBajo ? (
            <span style={{ color: 'var(--red-600)', display: 'flex', alignItems: 'center', gap: 3, fontSize: 11 }}>
              <AlertTriangle size={11} /> stock: {producto.stock}
            </span>
          ) : (
            <span style={{ color: 'var(--gray-200)', fontSize: 11 }}>stock: {producto.stock}</span>
          )}
        </div>
      </div>
      <div className="qty-ctrl">
        <button className="qty-btn" onClick={() => onChange(cantidad - 1)} aria-label="Reducir">−</button>
        <span className={`qty-val${cantidad > 0 ? ' active' : ''}`}>{cantidad}</span>
        <button className="qty-btn" onClick={() => onChange(cantidad + 1)} aria-label="Aumentar">+</button>
      </div>
    </div>
  );
}

export default function PedidoScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [busqueda, setBusqueda] = useState('');

  const cliente = state.clientes.find(c => c.id === Number(id));
  const { productos, pedidoActual } = state;

  const productosFiltrados = useMemo(() =>
    productos.filter(p =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.sku.toLowerCase().includes(busqueda.toLowerCase())
    ), [productos, busqueda]);

  const resumen = useMemo(() => {
    let total = 0;
    let unidades = 0;
    let items = 0;
    productos.forEach(p => {
      const qty = pedidoActual[p.id] || 0;
      if (qty > 0) {
        const precio = p.descuento > 0 ? p.precio * (1 - p.descuento / 100) : p.precio;
        total += precio * qty;
        unidades += qty;
        items++;
      }
    });
    return { total, unidades, items };
  }, [pedidoActual, productos]);

  const handleCantidad = (productoId, qty) => {
    dispatch({ type: 'ACTUALIZAR_CANTIDAD', productoId, cantidad: qty });
  };

  const handleConfirmar = () => {
    dispatch({ type: 'CONFIRMAR_PEDIDO', clienteId: Number(id), total: resumen.total });
    navigate(`/pedido-confirmado/${id}`, { state: { resumen } });
  };

  if (!cliente) return null;

  return (
    <div className="screen">
      <TopBar
        title="Cargar pedido"
        subtitle={`${cliente.nombre} · Lista A`}
        onBack={() => navigate(`/cliente/${id}`)}
      />

      <div style={{ padding: '10px 16px 0' }}>
        <div className="input-wrap">
          <Search size={16} className="icon" />
          <input
            type="search"
            className="input-with-icon"
            placeholder="Buscar producto o SKU..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            aria-label="Buscar producto"
          />
        </div>
      </div>

      {/* Sugerencia destacada */}
      {cliente.sugerencias.length > 0 && !busqueda && (
        <div style={{ padding: '8px 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tag size={13} color="var(--amber-600)" />
          <span style={{ fontSize: 12, color: 'var(--amber-800)' }}>
            Sugerido: <strong>{cliente.sugerencias[0].producto}</strong> con {cliente.sugerencias[0].descuento}% dto.
          </span>
        </div>
      )}

      <SectionLabel>Productos ({productosFiltrados.length})</SectionLabel>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px' }}>
        <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '4px 16px' }}>
          {productosFiltrados.length === 0 ? (
            <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--gray-400)', fontSize: 14 }}>
              Sin resultados para "{busqueda}"
            </div>
          ) : (
            productosFiltrados.map(p => (
              <ProductoRow
                key={p.id}
                producto={p}
                cantidad={pedidoActual[p.id] || 0}
                onChange={(qty) => handleCantidad(p.id, qty)}
              />
            ))
          )}
        </div>
      </div>

      {/* Footer con total */}
      <div className="order-footer">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>Total del pedido</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--gray-900)' }}>
              {formatPeso(resumen.total)}
            </div>
          </div>
          {resumen.items > 0 && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{resumen.items} productos</div>
              <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{resumen.unidades} unidades</div>
            </div>
          )}
        </div>
        <Btn
          onClick={handleConfirmar}
          disabled={resumen.items === 0}
        >
          Confirmar pedido → ODOO
        </Btn>
      </div>
    </div>
  );
}
