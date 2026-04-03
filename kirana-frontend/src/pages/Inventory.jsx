import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, AlertTriangle, X, Save, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/seedData';

const emptyProduct = { name: '', category: 'Grocery', price: '', costPrice: '', stock: '', minStock: '', unit: 'packet', barcode: '' };

export default function Inventory() {
  const { state, dispatch } = useStore();
  const { products } = state;
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [sortBy, setSortBy] = useState('name');
  const [stockFilter, setStockFilter] = useState('All');

  const openAdd = () => { setForm(emptyProduct); setEditProduct(null); setShowModal(true); };
  const openEdit = (p) => { setForm({ ...p }); setEditProduct(p); setShowModal(true); };

  const saveProduct = () => {
    if (!form.name || !form.price || !form.stock) return alert('Please fill in Name, Price, and Stock.');
    const payload = { ...form, price: Number(form.price), costPrice: Number(form.costPrice), stock: Number(form.stock), minStock: Number(form.minStock || 5) };
    if (editProduct) dispatch({ type: 'UPDATE_PRODUCT', payload });
    else dispatch({ type: 'ADD_PRODUCT', payload });
    setShowModal(false);
  };

  const deleteProduct = (id) => { if (window.confirm('Delete this product?')) dispatch({ type: 'DELETE_PRODUCT', payload: id }); };

  const categories = ['All', ...CATEGORIES];
  let filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchStock = stockFilter === 'All' || (stockFilter === 'Low' && p.stock <= p.minStock) || (stockFilter === 'Out' && p.stock === 0);
    return matchSearch && matchCat && matchStock;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'stock') return a.stock - b.stock;
    if (sortBy === 'price') return b.price - a.price;
    return 0;
  });

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Inventory</h1>
          <p style={{ color: '#666', margin: '4px 0 0', fontSize: 14 }}>{products.length} products {lowStockCount > 0 && <span style={{ color: '#D85A30', fontWeight: 500 }}>· {lowStockCount} low stock</span>}</p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: 11, color: '#999' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ width: '100%', padding: '10px 10px 10px 32px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13 }}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13 }}>
          <option value="All">All Stock</option>
          <option value="Low">Low Stock</option>
          <option value="Out">Out of Stock</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13 }}>
          <option value="name">Sort: Name</option>
          <option value="stock">Sort: Stock</option>
          <option value="price">Sort: Price</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Product', 'Category', 'Price', 'Cost Price', 'Stock', 'Min Stock', 'Margin', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#666', fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const margin = p.costPrice ? Math.round(((p.price - p.costPrice) / p.price) * 100) : null;
              const isLow = p.stock <= p.minStock;
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid #f5f5f5', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 500, color: '#1a1a1a' }}>{p.name}</div>
                    {p.barcode && <div style={{ fontSize: 11, color: '#bbb' }}>{p.barcode}</div>}
                  </td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: '#f0f9f5', color: '#0F6E56', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>{p.category}</span></td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>₹{p.price}</td>
                  <td style={{ padding: '12px 16px', color: '#666' }}>₹{p.costPrice || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {isLow && <AlertTriangle size={13} color="#D85A30" />}
                      <span style={{ fontWeight: 600, color: p.stock === 0 ? '#D85A30' : isLow ? '#BA7517' : '#1a1a1a' }}>{p.stock} {p.unit}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#666' }}>{p.minStock}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {margin !== null ? <span style={{ color: margin > 20 ? '#1D9E75' : margin > 10 ? '#BA7517' : '#D85A30', fontWeight: 500 }}>{margin}%</span> : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(p)} style={{ padding: '5px 8px', border: '1px solid #e5e7eb', borderRadius: 6, background: '#fff', cursor: 'pointer', color: '#666' }}><Edit2 size={13} /></button>
                      <button onClick={() => deleteProduct(p.id)} style={{ padding: '5px 8px', border: '1px solid #fee', borderRadius: 6, background: '#fff', cursor: 'pointer', color: '#D85A30' }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#bbb' }}>
            <Package size={32} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.4 }} />
            No products found
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 500, padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <Label>Product Name *</Label>
                <Input value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Tata Salt 1kg" />
              </div>
              <div>
                <Label>Category</Label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <Label>Unit</Label>
                <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} style={inputStyle}>
                  {['packet', 'bottle', 'piece', 'kg', 'g', 'litre', 'bag', 'tube', 'box', 'can'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <Label>Selling Price (₹) *</Label>
                <Input type="number" value={form.price} onChange={v => setForm(f => ({ ...f, price: v }))} placeholder="0" />
              </div>
              <div>
                <Label>Cost Price (₹)</Label>
                <Input type="number" value={form.costPrice} onChange={v => setForm(f => ({ ...f, costPrice: v }))} placeholder="0" />
              </div>
              <div>
                <Label>Current Stock *</Label>
                <Input type="number" value={form.stock} onChange={v => setForm(f => ({ ...f, stock: v }))} placeholder="0" />
              </div>
              <div>
                <Label>Min Stock Alert</Label>
                <Input type="number" value={form.minStock} onChange={v => setForm(f => ({ ...f, minStock: v }))} placeholder="5" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <Label>Barcode (optional)</Label>
                <Input value={form.barcode} onChange={v => setForm(f => ({ ...f, barcode: v }))} placeholder="Scan or enter barcode" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '11px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 14 }}>Cancel</button>
              <button onClick={saveProduct} style={{ flex: 2, padding: '11px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Save size={15} /> {editProduct ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' };
const Label = ({ children }) => <div style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 5 }}>{children}</div>;
const Input = ({ onChange, ...props }) => <input {...props} onChange={e => onChange(e.target.value)} style={inputStyle} />;
