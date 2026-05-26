// src/components/UI.js
import React from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── TopBar ──────────────────────────────────────────────────────────────────
export function TopBar({ title, subtitle, onBack, right }) {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));

  return (
    <div className="topbar">
      <button className="topbar-back" onClick={handleBack} aria-label="Volver">
        <ChevronLeft size={22} />
      </button>
      <div className="topbar-info">
        <div className="topbar-title">{title}</div>
        {subtitle && <div className="topbar-sub">{subtitle}</div>}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

// ── Pill ────────────────────────────────────────────────────────────────────
export function Pill({ variant = 'neutral', children }) {
  return <span className={`pill pill-${variant}`}>{children}</span>;
}

// ── Btn ─────────────────────────────────────────────────────────────────────
export function Btn({ variant = 'primary', size, onClick, children, disabled, type = 'button' }) {
  const cls = ['btn', `btn-${variant}`, size ? `btn-${size}` : ''].filter(Boolean).join(' ');
  return (
    <button className={cls} onClick={onClick} disabled={disabled} type={type}>
      {children}
    </button>
  );
}

// ── TaskCheck ────────────────────────────────────────────────────────────────
export function TaskCheck({ done, onToggle }) {
  return (
    <div className={`task-check${done ? ' done' : ''}`} onClick={onToggle} role="checkbox" aria-checked={done}>
      {done && <Check size={13} color="#fff" strokeWidth={3} />}
    </div>
  );
}

// ── SectionLabel ─────────────────────────────────────────────────────────────
export function SectionLabel({ children }) {
  return <div className="section-label">{children}</div>;
}

// ── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', onClick }) {
  return (
    <div className={`card ${className}`} onClick={onClick} style={onClick ? { cursor: 'pointer' } : {}}>
      {children}
    </div>
  );
}

// ── StatGrid ──────────────────────────────────────────────────────────────────
export function StatGrid({ children }) {
  return <div className="stat-grid">{children}</div>;
}

export function StatCard({ label, value, sub, valueColor }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={valueColor ? { color: valueColor } : {}}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

// ── Formato moneda ────────────────────────────────────────────────────────────
export function formatPeso(n) {
  return '$' + Math.round(n).toLocaleString('es-AR');
}
