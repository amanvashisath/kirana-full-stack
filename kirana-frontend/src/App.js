import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Inventory from './pages/Inventory';
import SalesHistory from './pages/SalesHistory';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { LayoutDashboard, ShoppingCart, Package, ClipboardList, BarChart2, Settings as SettingsIcon, AlertTriangle, Store } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'billing', label: 'Billing', icon: <ShoppingCart size={18} /> },
  { id: 'inventory', label: 'Inventory', icon: <Package size={18} /> },
  { id: 'sales', label: 'Sales History', icon: <ClipboardList size={18} /> },
  { id: 'reports', label: 'Reports', icon: <BarChart2 size={18} /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon size={18} /> },
];

function AppInner() {
  const [page, setPage] = useState('dashboard');
  const { state } = useStore();
  const lowStockCount = state.products.filter(p => p.stock <= p.minStock).length;
  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard setPage={setPage} />;
      case 'billing': return <Billing />;
      case 'inventory': return <Inventory />;
      case 'sales': return <SalesHistory />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: return <Dashboard setPage={setPage} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#f9fafb' }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, background: '#1D9E75', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Store size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', lineHeight: 1.2 }}>{state.storeName}</div>
              <div style={{ fontSize: 11, color: '#888' }}>{state.storeOwner}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px' }}>
          {NAV_ITEMS.map(item => {
            const isActive = page === item.id;
            return (
              <button key={item.id} onClick={() => setPage(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 2, background: isActive ? '#E1F5EE' : 'transparent', color: isActive ? '#0F6E56' : '#555', fontWeight: isActive ? 600 : 400, fontSize: 14, textAlign: 'left', position: 'relative' }}>
                <span style={{ color: isActive ? '#1D9E75' : '#999' }}>{item.icon}</span>
                {item.label}
                {item.id === 'inventory' && lowStockCount > 0 && (
                  <span style={{ marginLeft: 'auto', background: '#D85A30', color: '#fff', borderRadius: 20, fontSize: 10, fontWeight: 700, padding: '1px 6px', minWidth: 16, textAlign: 'center' }}>{lowStockCount}</span>
                )}
                {item.id === 'billing' && cartCount > 0 && (
                  <span style={{ marginLeft: 'auto', background: '#1D9E75', color: '#fff', borderRadius: 20, fontSize: 10, fontWeight: 700, padding: '1px 6px', minWidth: 16, textAlign: 'center' }}>{cartCount}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Low stock warning */}
        {lowStockCount > 0 && (
          <div style={{ margin: '0 10px 14px', padding: '10px 12px', background: '#FFF4F0', borderRadius: 8, border: '1px solid #F5C4B3' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#993C1D', fontWeight: 600 }}>
              <AlertTriangle size={13} /> {lowStockCount} low stock
            </div>
            <button onClick={() => setPage('inventory')} style={{ marginTop: 4, fontSize: 11, color: '#D85A30', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>View now →</button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {renderPage()}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  );
}
