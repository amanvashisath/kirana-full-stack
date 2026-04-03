export const initialProducts = [
  { id: 1, name: "Tata Salt (1kg)", category: "Grocery", price: 22, costPrice: 18, stock: 45, minStock: 10, unit: "packet", barcode: "8901234567890" },
  { id: 2, name: "Amul Butter (500g)", category: "Dairy", price: 275, costPrice: 255, stock: 8, minStock: 5, unit: "packet", barcode: "8901234567891" },
  { id: 3, name: "Fortune Sunflower Oil (1L)", category: "Grocery", price: 145, costPrice: 130, stock: 20, minStock: 8, unit: "bottle", barcode: "8901234567892" },
  { id: 4, name: "Britannia Biscuit (100g)", category: "Snacks", price: 35, costPrice: 28, stock: 60, minStock: 15, unit: "packet", barcode: "8901234567893" },
  { id: 5, name: "Maggi Noodles (70g)", category: "Snacks", price: 14, costPrice: 11, stock: 3, minStock: 20, unit: "packet", barcode: "8901234567894" },
  { id: 6, name: "Dettol Soap (75g)", category: "Personal Care", price: 48, costPrice: 40, stock: 25, minStock: 10, unit: "piece", barcode: "8901234567895" },
  { id: 7, name: "Colgate Toothpaste (150g)", category: "Personal Care", price: 99, costPrice: 85, stock: 15, minStock: 8, unit: "tube", barcode: "8901234567896" },
  { id: 8, name: "Aashirvaad Atta (5kg)", category: "Grocery", price: 285, costPrice: 260, stock: 12, minStock: 5, unit: "bag", barcode: "8901234567897" },
  { id: 9, name: "Tata Tea Gold (500g)", category: "Beverages", price: 265, costPrice: 240, stock: 2, minStock: 5, unit: "packet", barcode: "8901234567898" },
  { id: 10, name: "Amul Milk (1L)", category: "Dairy", price: 68, costPrice: 62, stock: 30, minStock: 10, unit: "packet", barcode: "8901234567899" },
  { id: 11, name: "Surf Excel (1kg)", category: "Household", price: 178, costPrice: 158, stock: 18, minStock: 8, unit: "packet", barcode: "8901234567900" },
  { id: 12, name: "Parle-G Biscuit (800g)", category: "Snacks", price: 80, costPrice: 65, stock: 40, minStock: 15, unit: "packet", barcode: "8901234567901" },
  { id: 13, name: "Pepsi (750ml)", category: "Beverages", price: 45, costPrice: 35, stock: 24, minStock: 12, unit: "bottle", barcode: "8901234567902" },
  { id: 14, name: "Ponds Cream (50g)", category: "Personal Care", price: 95, costPrice: 80, stock: 10, minStock: 5, unit: "piece", barcode: "8901234567903" },
  { id: 15, name: "Vim Dishwash Bar (200g)", category: "Household", price: 32, costPrice: 25, stock: 35, minStock: 10, unit: "piece", barcode: "8901234567904" },
];

const today = new Date();
const fmt = (daysAgo, h = 10, m = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

export const initialSales = [
  { id: 1, items: [{ productId: 1, name: "Tata Salt (1kg)", qty: 2, price: 22 }, { productId: 3, name: "Fortune Sunflower Oil (1L)", qty: 1, price: 145 }], total: 189, paymentMode: "Cash", date: fmt(0, 9, 15), customerName: "" },
  { id: 2, items: [{ productId: 5, name: "Maggi Noodles (70g)", qty: 5, price: 14 }, { productId: 4, name: "Britannia Biscuit (100g)", qty: 3, price: 35 }], total: 175, paymentMode: "UPI", date: fmt(0, 11, 30), customerName: "Ramesh" },
  { id: 3, items: [{ productId: 8, name: "Aashirvaad Atta (5kg)", qty: 1, price: 285 }, { productId: 2, name: "Amul Butter (500g)", qty: 2, price: 275 }], total: 835, paymentMode: "UPI", date: fmt(0, 14, 0), customerName: "" },
  { id: 4, items: [{ productId: 6, name: "Dettol Soap (75g)", qty: 3, price: 48 }, { productId: 7, name: "Colgate Toothpaste (150g)", qty: 1, price: 99 }], total: 243, paymentMode: "Cash", date: fmt(1, 10, 0), customerName: "" },
  { id: 5, items: [{ productId: 10, name: "Amul Milk (1L)", qty: 5, price: 68 }, { productId: 9, name: "Tata Tea Gold (500g)", qty: 1, price: 265 }], total: 605, paymentMode: "Cash", date: fmt(1, 8, 45), customerName: "Sunita Devi" },
  { id: 6, items: [{ productId: 12, name: "Parle-G Biscuit (800g)", qty: 2, price: 80 }, { productId: 13, name: "Pepsi (750ml)", qty: 4, price: 45 }], total: 340, paymentMode: "UPI", date: fmt(1, 16, 20), customerName: "" },
  { id: 7, items: [{ productId: 11, name: "Surf Excel (1kg)", qty: 1, price: 178 }, { productId: 15, name: "Vim Dishwash Bar (200g)", qty: 2, price: 32 }], total: 242, paymentMode: "Cash", date: fmt(2, 11, 0), customerName: "" },
  { id: 8, items: [{ productId: 1, name: "Tata Salt (1kg)", qty: 1, price: 22 }, { productId: 8, name: "Aashirvaad Atta (5kg)", qty: 2, price: 285 }], total: 592, paymentMode: "UPI", date: fmt(2, 15, 30), customerName: "Vijay Kumar" },
  { id: 9, items: [{ productId: 3, name: "Fortune Sunflower Oil (1L)", qty: 2, price: 145 }, { productId: 10, name: "Amul Milk (1L)", qty: 3, price: 68 }], total: 494, paymentMode: "Cash", date: fmt(3, 9, 0), customerName: "" },
  { id: 10, items: [{ productId: 4, name: "Britannia Biscuit (100g)", qty: 6, price: 35 }, { productId: 13, name: "Pepsi (750ml)", qty: 2, price: 45 }], total: 300, paymentMode: "UPI", date: fmt(3, 17, 10), customerName: "" },
  { id: 11, items: [{ productId: 14, name: "Ponds Cream (50g)", qty: 1, price: 95 }, { productId: 6, name: "Dettol Soap (75g)", qty: 2, price: 48 }], total: 191, paymentMode: "Cash", date: fmt(4, 10, 30), customerName: "Priya Sharma" },
  { id: 12, items: [{ productId: 9, name: "Tata Tea Gold (500g)", qty: 2, price: 265 }, { productId: 2, name: "Amul Butter (500g)", qty: 1, price: 275 }], total: 805, paymentMode: "UPI", date: fmt(4, 12, 0), customerName: "" },
  { id: 13, items: [{ productId: 5, name: "Maggi Noodles (70g)", qty: 10, price: 14 }, { productId: 12, name: "Parle-G Biscuit (800g)", qty: 3, price: 80 }], total: 380, paymentMode: "Cash", date: fmt(5, 14, 45), customerName: "" },
  { id: 14, items: [{ productId: 11, name: "Surf Excel (1kg)", qty: 2, price: 178 }, { productId: 15, name: "Vim Dishwash Bar (200g)", qty: 3, price: 32 }], total: 452, paymentMode: "UPI", date: fmt(5, 10, 0), customerName: "Mohit Yadav" },
  { id: 15, items: [{ productId: 8, name: "Aashirvaad Atta (5kg)", qty: 1, price: 285 }, { productId: 3, name: "Fortune Sunflower Oil (1L)", qty: 1, price: 145 }, { productId: 10, name: "Amul Milk (1L)", qty: 2, price: 68 }], total: 566, paymentMode: "Cash", date: fmt(6, 9, 30), customerName: "" },
];

export const CATEGORIES = ["Grocery", "Dairy", "Snacks", "Beverages", "Personal Care", "Household", "Other"];
export const PAYMENT_MODES = ["Cash", "UPI", "Card", "Credit"];
