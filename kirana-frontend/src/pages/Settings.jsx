import React, { useState } from 'react';
import { Save, Store, User, Bell, Database } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Settings() {
  const { state, dispatch } = useStore();
  const [storeName, setStoreName] = useState(state.storeName);
  const [storeOwner, setStoreOwner] = useState(state.storeOwner);
  const [saved, setSaved] = useState(false);

  const save = () => {
    dispatch({ type: 'UPDATE_STORE_INFO', payload: { storeName, storeOwner } });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const totalRevenue = state.sales.reduce((s, sale) => s + sale.total, 0);

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 24 }}>Settings</h1>

      {/* Store Info */}
      <Section icon={<Store size={16} />} title="Store Information">
        <Field label="Store Name">
          <input value={storeName} onChange={e => setStoreName(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Owner Name">
          <input value={storeOwner} onChange={e => setStoreOwner(e.target.value)} style={inputStyle} />
        </Field>
        <button onClick={save} style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: saved ? '#1D9E75' : '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14, transition: 'background 0.3s' }}>
          <Save size={15} /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </Section>

      {/* Store Stats */}
      <Section icon={<Database size={16} />} title="Store Data Summary">
        {[
          ['Total Products', state.products.length],
          ['Total Sales', state.sales.length],
          ['Total Revenue', `₹${Math.round(totalRevenue).toLocaleString('en-IN')}`],
          ['Low Stock Items', state.products.filter(p => p.stock <= p.minStock).length],
          ['Out of Stock', state.products.filter(p => p.stock === 0).length],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5', fontSize: 14 }}>
            <span style={{ color: '#666' }}>{label}</span>
            <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{value}</span>
          </div>
        ))}
      </Section>

      {/* About */}
      <Section icon={<Bell size={16} />} title="About This App">
        <div style={{ fontSize: 14, color: '#666', lineHeight: 1.7 }}>
          <p style={{ margin: '0 0 8px' }}><strong>Kirana Store Digitizer</strong> — Built by Aman Vashisath</p>
          <p style={{ margin: '0 0 8px' }}>A simple, free tool to help small kirana shop owners manage inventory, billing, and track their daily sales without needing expensive software.</p>
          <p style={{ margin: 0, fontSize: 12, color: '#aaa' }}>All data is stored locally in your browser. No cloud, no account needed.</p>
        </div>
      </Section>
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontWeight: 600, fontSize: 15 }}>
        <span style={{ color: '#1D9E75' }}>{icon}</span> {title}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' };
