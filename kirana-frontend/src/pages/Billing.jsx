import React, { useState, useRef } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingBag, CheckCircle, Printer } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PAYMENT_MODES } from '../data/seedData';

export default function Billing() {
  const { state, dispatch } = useStore();
  const { products, cart } = state;
  const [search, setSearch] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [customerName, setCustomerName] = useState('');
  const [saleComplete, setSaleComplete] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const receiptRef = useRef();

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode?.includes(search);
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const addToCart = (product) => {
    if (product.stock <= 0) return;
    dispatch({ type: 'ADD_TO_CART', payload: { productId: product.id, name: product.name, price: product.price, maxStock: product.stock } });
  };

  const updateQty = (productId, qty) => dispatch({ type: 'UPDATE_CART_QTY', payload: { productId, qty } });
  const removeItem = (productId) => dispatch({ type: 'REMOVE_FROM_CART', payload: productId });

  const completeSale = () => {
    if (cart.length === 0) return;
    const sale = { items: cart.map(i => ({ productId: i.productId, name: i.name, qty: i.qty, price: i.price })), total: cartTotal, paymentMode, customerName };
    dispatch({ type: 'COMPLETE_SALE', payload: sale });
    setSaleComplete({ ...sale, id: Date.now(), date: new Date().toISOString() });
    setCustomerName('');
    setPaymentMode('Cash');
  };

  if (saleComplete) {
    return (
      <div style={{ padding: 24, maxWidth: 500, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <CheckCircle size={48} color="#1D9E75" />
          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 12 }}>Sale Complete!</h2>
          <p style={{ color: '#666', fontSize: 14 }}>Payment received via {saleComplete.paymentMode}</p>
        </div>
        <div ref={receiptRef} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
          <div style={{ textAlign: 'center', borderBottom: '1px dashed #ddd', paddingBottom: 16, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{state.storeName}</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{new Date(saleComplete.date).toLocaleString('en-IN')}</div>
            {saleComplete.customerName && <div style={{ fontSize: 13, marginTop: 4 }}>Customer: {saleComplete.customerName}</div>}
          </div>
          <div style={{ marginBottom: 16 }}>
            {saleComplete.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '4px 0', borderBottom: '1px solid #f5f5f5' }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>₹{item.price} × {item.qty}</div>
                </div>
                <div style={{ fontWeight: 600 }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18, borderTop: '2px solid #1a1a1a', paddingTop: 12 }}>
            <span>Total</span>
            <span>₹{saleComplete.total.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#888' }}>Thank you! Please visit again.</div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button onClick={() => window.print()} style={{ flex: 1, padding: '10px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 14 }}>
            <Printer size={16} /> Print
          </button>
          <button onClick={() => setSaleComplete(null)} style={{ flex: 2, padding: '10px', borderRadius: 8, background: '#1D9E75', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            New Sale
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Products Panel */}
      <div style={{ overflow: 'auto', padding: 20, background: '#f9fafb' }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: '#999' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products or scan barcode..." style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, background: '#fff', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)} style={{ padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap', background: categoryFilter === cat ? '#1D9E75' : '#e5e7eb', color: categoryFilter === cat ? '#fff' : '#444', fontWeight: categoryFilter === cat ? 600 : 400 }}>{cat}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {filtered.map(product => (
            <div key={product.id} onClick={() => addToCart(product)} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px', cursor: product.stock > 0 ? 'pointer' : 'not-allowed', opacity: product.stock <= 0 ? 0.5 : 1, transition: 'border-color 0.15s' }}
              onMouseEnter={e => { if (product.stock > 0) e.currentTarget.style.borderColor = '#1D9E75'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 4, lineHeight: 1.3 }}>{product.name}</div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{product.category}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#1D9E75' }}>₹{product.price}</span>
                <span style={{ fontSize: 12, color: product.stock <= product.minStock ? '#D85A30' : '#888' }}>Stock: {product.stock}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', background: '#fff', borderLeft: '1px solid #e5e7eb' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShoppingBag size={18} color="#1D9E75" /> Current Bill
          {cart.length > 0 && <span style={{ marginLeft: 'auto', fontSize: 12, color: '#888' }}>{cart.reduce((s, i) => s + i.qty, 0)} items</span>}
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '12px 20px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#bbb', padding: '60px 0', fontSize: 14 }}>
              <ShoppingBag size={40} style={{ opacity: 0.3, marginBottom: 12, display: 'block', margin: '0 auto 12px' }} />
              Click products to add to bill
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', flex: 1, marginRight: 8, lineHeight: 1.3 }}>{item.name}</div>
                  <button onClick={() => removeItem(item.productId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', padding: 0 }}><Trash2 size={13} /></button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => updateQty(item.productId, item.qty - 1)} style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #e5e7eb', background: '#f9f9f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={12} /></button>
                    <span style={{ fontSize: 15, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.productId, item.qty + 1)} style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #e5e7eb', background: '#f9f9f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={12} /></button>
                  </div>
                  <span style={{ fontWeight: 600, color: '#1a1a1a' }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #e5e7eb' }}>
            <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Customer name (optional)" style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, marginBottom: 12, boxSizing: 'border-box' }} />
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 6, fontWeight: 500 }}>Payment Mode</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {PAYMENT_MODES.map(mode => (
                  <button key={mode} onClick={() => setPaymentMode(mode)} style={{ flex: 1, padding: '8px', border: `1.5px solid ${paymentMode === mode ? '#1D9E75' : '#e5e7eb'}`, borderRadius: 8, background: paymentMode === mode ? '#E1F5EE' : '#fff', color: paymentMode === mode ? '#0F6E56' : '#444', fontSize: 12, cursor: 'pointer', fontWeight: paymentMode === mode ? 600 : 400 }}>{mode}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '12px', background: '#f9fafb', borderRadius: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 16 }}>Total</span>
              <span style={{ fontWeight: 700, fontSize: 22, color: '#1D9E75' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <button onClick={completeSale} style={{ width: '100%', padding: '14px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
              Complete Sale
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
