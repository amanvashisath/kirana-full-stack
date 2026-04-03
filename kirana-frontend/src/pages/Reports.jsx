import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { useStore } from '../context/StoreContext';

export default function Reports() {
  const { state } = useStore();
  const { sales, products } = state;
  const [period, setPeriod] = useState('30');

  const cutoff = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() - Number(period)); d.setHours(0, 0, 0, 0); return d;
  }, [period]);

  const filtered = sales.filter(s => new Date(s.date) >= cutoff);

  const dailyData = useMemo(() => {
    const map = {};
    for (let i = Number(period) - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
      const key = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      map[key] = { date: key, revenue: 0, profit: 0, orders: 0 };
    }
    filtered.forEach(sale => {
      const key = new Date(sale.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      if (map[key]) {
        map[key].revenue += sale.total;
        map[key].orders += 1;
        sale.items.forEach(item => {
          const p = products.find(pr => pr.id === item.productId);
          if (p) map[key].profit += (item.price - p.costPrice) * item.qty;
        });
      }
    });
    return Object.values(map).map(d => ({ ...d, profit: Math.round(d.profit) }));
  }, [filtered, period, products]);

  const productPerf = useMemo(() => {
    const map = {};
    filtered.forEach(sale => {
      sale.items.forEach(item => {
        if (!map[item.name]) map[item.name] = { name: item.name, qty: 0, revenue: 0, profit: 0 };
        map[item.name].qty += item.qty;
        map[item.name].revenue += item.price * item.qty;
        const p = products.find(pr => pr.id === item.productId);
        if (p) map[item.name].profit += (item.price - p.costPrice) * item.qty;
      });
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 10).map(p => ({ ...p, name: p.name.length > 20 ? p.name.slice(0, 20) + '…' : p.name, profit: Math.round(p.profit) }));
  }, [filtered, products]);

  const totalRevenue = filtered.reduce((s, sale) => s + sale.total, 0);
  const totalProfit = filtered.reduce((sum, sale) => sum + sale.items.reduce((s, item) => {
    const p = products.find(pr => pr.id === item.productId);
    return s + (p ? (item.price - p.costPrice) * item.qty : 0);
  }, 0), 0);
  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Reports & Analytics</h1>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['7', '7 Days'], ['30', '30 Days'], ['90', '3 Months']].map(([val, label]) => (
            <button key={val} onClick={() => setPeriod(val)} style={{ padding: '7px 14px', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, background: period === val ? '#1D9E75' : '#f0f0f0', color: period === val ? '#fff' : '#444', fontWeight: period === val ? 600 : 400 }}>{label}</button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Revenue', value: `₹${Math.round(totalRevenue).toLocaleString('en-IN')}`, color: '#1D9E75' },
          { label: 'Total Profit', value: `₹${Math.round(totalProfit).toLocaleString('en-IN')}`, color: '#378ADD' },
          { label: 'Profit Margin', value: `${profitMargin}%`, color: '#7F77DD' },
          { label: 'Orders', value: filtered.length, color: '#BA7517' },
        ].map(kpi => (
          <div key={kpi.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{kpi.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Revenue + Profit Chart */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 16px' }}>Revenue vs Profit Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#aaa' }} axisLine={false} tickLine={false} interval={Math.floor(dailyData.length / 6)} />
            <YAxis tick={{ fontSize: 11, fill: '#aaa' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
            <Tooltip formatter={(v, n) => [`₹${v.toLocaleString('en-IN')}`, n === 'revenue' ? 'Revenue' : 'Profit']} contentStyle={{ borderRadius: 8, fontSize: 13 }} />
            <Line type="monotone" dataKey="revenue" stroke="#1D9E75" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="profit" stroke="#378ADD" strokeWidth={2} dot={false} strokeDasharray="4 4" />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 20, marginTop: 8, fontSize: 12, color: '#666' }}>
          <span><span style={{ display: 'inline-block', width: 20, height: 2, background: '#1D9E75', marginRight: 6, verticalAlign: 'middle' }} />Revenue</span>
          <span><span style={{ display: 'inline-block', width: 20, height: 2, background: '#378ADD', borderTop: '2px dashed #378ADD', marginRight: 6, verticalAlign: 'middle' }} />Profit</span>
        </div>
      </div>

      {/* Product Performance */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 16px' }}>Top Products by Revenue</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={productPerf} layout="vertical">
            <XAxis type="number" tick={{ fontSize: 11, fill: '#aaa' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#555' }} axisLine={false} tickLine={false} width={150} />
            <Tooltip formatter={(v, n) => [`₹${v.toLocaleString('en-IN')}`, n === 'revenue' ? 'Revenue' : 'Profit']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="revenue" fill="#1D9E75" radius={[0, 4, 4, 0]} />
            <Bar dataKey="profit" fill="#378ADD" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
