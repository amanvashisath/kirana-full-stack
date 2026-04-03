import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, AlertTriangle, ShoppingCart, IndianRupee, ArrowUpRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const COLORS = ['#1D9E75', '#378ADD', '#D85A30', '#BA7517', '#D4537E', '#7F77DD'];

export default function Dashboard({ setPage }) {
  const { state } = useStore();
  const { products, sales } = state;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaySales = sales.filter(s => new Date(s.date) >= today);
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
  const weekRevenue = sales.filter(s => {
    const d = new Date(today); d.setDate(d.getDate() - 7);
    return new Date(s.date) >= d;
  }).reduce((sum, s) => sum + s.total, 0);

  const lowStock = products.filter(p => p.stock <= p.minStock);

  const todayProfit = todaySales.reduce((sum, sale) => {
    return sum + sale.items.reduce((s, item) => {
      const prod = products.find(p => p.id === item.productId);
      return s + (prod ? (item.price - prod.costPrice) * item.qty : 0);
    }, 0);
  }, 0);

  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const next = new Date(d); next.setDate(d.getDate() + 1);
      const daySales = sales.filter(s => {
        const sd = new Date(s.date);
        return sd >= d && sd < next;
      });
      days.push({
        day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        revenue: daySales.reduce((sum, s) => sum + s.total, 0),
        orders: daySales.length,
      });
    }
    return days;
  }, [sales]);

  const categoryData = useMemo(() => {
    const map = {};
    sales.forEach(sale => {
      sale.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        const cat = prod?.category || 'Other';
        map[cat] = (map[cat] || 0) + item.price * item.qty;
      });
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [sales, products]);

  const topProducts = useMemo(() => {
    const map = {};
    sales.forEach(sale => {
      sale.items.forEach(item => {
        map[item.name] = (map[item.name] || 0) + item.qty;
      });
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, qty]) => ({ name: name.length > 22 ? name.slice(0, 22) + '…' : name, qty }));
  }, [sales]);

  return (
    <div style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#1a1a1a', margin: 0 }}>Dashboard</h1>
        <p style={{ color: '#666', marginTop: 4, fontSize: 14 }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <MetricCard icon={<IndianRupee size={18} />} label="Today's Revenue" value={`₹${todayRevenue.toLocaleString('en-IN')}`} sub={`${todaySales.length} orders`} color="#1D9E75" />
        <MetricCard icon={<TrendingUp size={18} />} label="Today's Profit" value={`₹${Math.round(todayProfit).toLocaleString('en-IN')}`} sub="Estimated" color="#378ADD" />
        <MetricCard icon={<ShoppingCart size={18} />} label="Week Revenue" value={`₹${weekRevenue.toLocaleString('en-IN')}`} sub="Last 7 days" color="#7F77DD" />
        <MetricCard
          icon={<AlertTriangle size={18} />}
          label="Low Stock Items"
          value={lowStock.length}
          sub={lowStock.length > 0 ? "Needs reorder" : "All stocked"}
          color={lowStock.length > 0 ? "#D85A30" : "#1D9E75"}
          onClick={() => setPage('inventory')}
          clickable
        />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 16px', color: '#1a1a1a' }}>Revenue — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={last7Days}>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#666' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
              <Tooltip formatter={v => [`₹${v}`, 'Revenue']} contentStyle={{ borderRadius: 8, fontSize: 13 }} />
              <Bar dataKey="revenue" fill="#1D9E75" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 16px', color: '#1a1a1a' }}>Sales by Category</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={v => [`₹${v.toLocaleString('en-IN')}`, '']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 8 }}>
            {categoryData.slice(0, 4).map((c, i) => (
              <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '2px 0', color: '#444' }}>
                <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: COLORS[i % COLORS.length], marginRight: 6 }} />{c.name}</span>
                <span style={{ fontWeight: 500 }}>₹{c.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Top Products */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 16px', color: '#1a1a1a' }}>Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={topProducts} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#444' }} axisLine={false} tickLine={false} width={140} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="qty" fill="#378ADD" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Low Stock Alert */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: '#1a1a1a' }}>Low Stock Alerts</h3>
            {lowStock.length > 0 && (
              <button onClick={() => setPage('inventory')} style={{ fontSize: 12, color: '#D85A30', background: '#FFF4F0', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                View All <ArrowUpRight size={12} />
              </button>
            )}
          </div>
          {lowStock.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#1D9E75', padding: '30px 0', fontSize: 14 }}>
              All items well stocked!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {lowStock.slice(0, 5).map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: p.stock === 0 ? '#FFF0EE' : '#FFFBF5', borderRadius: 8, border: `1px solid ${p.stock === 0 ? '#F5C4B3' : '#FAC775'}` }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{p.category}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: p.stock === 0 ? '#D85A30' : '#BA7517' }}>{p.stock} left</div>
                    <div style={{ fontSize: 11, color: '#888' }}>Min: {p.minStock}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, sub, color, onClick, clickable }) {
  return (
    <div onClick={onClick} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 20px', cursor: clickable ? 'pointer' : 'default', transition: 'box-shadow 0.15s' }}
      onMouseEnter={e => { if (clickable) e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
        <span style={{ fontSize: 13, color: '#666' }}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{sub}</div>
    </div>
  );
}
