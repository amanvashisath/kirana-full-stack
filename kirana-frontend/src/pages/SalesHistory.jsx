import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, IndianRupee, Receipt } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function SalesHistory() {
  const { state } = useStore();
  const { sales } = state;
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const getStart = () => {
    if (dateFilter === 'Today') return today;
    if (dateFilter === 'Yesterday') { const d = new Date(today); d.setDate(d.getDate() - 1); return d; }
    if (dateFilter === 'Week') { const d = new Date(today); d.setDate(d.getDate() - 7); return d; }
    if (dateFilter === 'Month') { const d = new Date(today); d.setDate(d.getDate() - 30); return d; }
    return null;
  };

  const filtered = sales.filter(s => {
    const matchSearch = s.customerName?.toLowerCase().includes(search.toLowerCase()) || s.paymentMode.toLowerCase().includes(search.toLowerCase()) || String(s.id).includes(search);
    const matchDate = !getStart() || new Date(s.date) >= getStart();
    const matchPayment = paymentFilter === 'All' || s.paymentMode === paymentFilter;
    return matchSearch && matchDate && matchPayment;
  });

  const totalRevenue = filtered.reduce((s, sale) => s + sale.total, 0);
  const avgSale = filtered.length ? Math.round(totalRevenue / filtered.length) : 0;

  const paymentBreakdown = filtered.reduce((acc, s) => {
    acc[s.paymentMode] = (acc[s.paymentMode] || 0) + s.total;
    return acc;
  }, {});

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Sales History</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>{filtered.length} transactions</p>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 20 }}>
        <SummaryCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} color="#1D9E75" />
        <SummaryCard label="Transactions" value={filtered.length} color="#378ADD" />
        <SummaryCard label="Avg Sale" value={`₹${avgSale.toLocaleString('en-IN')}`} color="#7F77DD" />
        {Object.entries(paymentBreakdown).map(([mode, amt]) => (
          <SummaryCard key={mode} label={`Via ${mode}`} value={`₹${amt.toLocaleString('en-IN')}`} color="#BA7517" />
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 180px' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: 11, color: '#999' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer, ID..." style={{ width: '100%', padding: '9px 10px 9px 30px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, boxSizing: 'border-box' }} />
        </div>
        {['All', 'Today', 'Yesterday', 'Week', 'Month'].map(d => (
          <button key={d} onClick={() => setDateFilter(d)} style={{ padding: '8px 14px', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, background: dateFilter === d ? '#1D9E75' : '#f0f0f0', color: dateFilter === d ? '#fff' : '#444', fontWeight: dateFilter === d ? 600 : 400 }}>{d}</button>
        ))}
        <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13 }}>
          {['All', 'Cash', 'UPI', 'Card', 'Credit'].map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      {/* Sales List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, color: '#bbb' }}>
            <Receipt size={32} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.4 }} />
            No sales found
          </div>
        )}
        {filtered.map(sale => (
          <div key={sale.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
            <div onClick={() => setExpanded(expanded === sale.id ? null : sale.id)} style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', cursor: 'pointer', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: sale.paymentMode === 'UPI' ? '#E6F1FB' : sale.paymentMode === 'Cash' ? '#E1F5EE' : '#FAEEDA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IndianRupee size={16} color={sale.paymentMode === 'UPI' ? '#185FA5' : sale.paymentMode === 'Cash' ? '#0F6E56' : '#854F0B'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>
                  {sale.customerName || 'Walk-in Customer'}
                  <span style={{ marginLeft: 8, fontSize: 11, color: '#888', fontWeight: 400 }}>#{sale.id}</span>
                </div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                  {new Date(sale.date).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · {sale.items.reduce((s, i) => s + i.qty, 0)} items
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>₹{sale.total.toLocaleString('en-IN')}</div>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: sale.paymentMode === 'UPI' ? '#E6F1FB' : sale.paymentMode === 'Cash' ? '#E1F5EE' : '#FAEEDA', color: sale.paymentMode === 'UPI' ? '#185FA5' : sale.paymentMode === 'Cash' ? '#0F6E56' : '#854F0B' }}>{sale.paymentMode}</span>
              </div>
              {expanded === sale.id ? <ChevronUp size={16} color="#aaa" /> : <ChevronDown size={16} color="#aaa" />}
            </div>
            {expanded === sale.id && (
              <div style={{ borderTop: '1px solid #f0f0f0', padding: '12px 18px', background: '#fafafa' }}>
                <table style={{ width: '100%', fontSize: 13 }}>
                  <thead>
                    <tr>
                      {['Item', 'Qty', 'Price', 'Total'].map(h => <th key={h} style={{ textAlign: 'left', padding: '4px 0', fontWeight: 600, color: '#888', fontSize: 11 }}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {sale.items.map((item, i) => (
                      <tr key={i}>
                        <td style={{ padding: '4px 0', color: '#1a1a1a' }}>{item.name}</td>
                        <td style={{ padding: '4px 0', color: '#666' }}>{item.qty}</td>
                        <td style={{ padding: '4px 0', color: '#666' }}>₹{item.price}</td>
                        <td style={{ padding: '4px 0', fontWeight: 600 }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} style={{ paddingTop: 8, fontWeight: 600, borderTop: '1px solid #e5e7eb' }}>Total</td>
                      <td style={{ paddingTop: 8, fontWeight: 700, color: '#1D9E75', fontSize: 15, borderTop: '1px solid #e5e7eb' }}>₹{sale.total.toLocaleString('en-IN')}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 16px' }}>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}
