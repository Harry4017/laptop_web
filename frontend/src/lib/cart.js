const KEY = "laptop_web_cart_v2";

export function loadCart() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || !Array.isArray(parsed.items)) return { items: [] };
    return { items: parsed.items };
  } catch {
    return { items: [] };
  }
}

export function saveCart(cart) {
  localStorage.setItem(KEY, JSON.stringify(cart));
}

export function addToCart(cart, product, quantity) {
  const qty = Math.max(1, Number(quantity || 1));
  const items = [...cart.items];
  const idx = items.findIndex((x) => x.id === product._id);
  if (idx >= 0) {
    items[idx] = { ...items[idx], quantity: items[idx].quantity + qty };
  } else {
    items.push({
      id: product._id,
      name: product.name,
      category: product.category,
      priceUSD: product.priceUSD,
      imageUrl: product.imageUrl,
      stock: product.stock,
      quantity: qty
    });
  }
  return { items };
}

export function setQuantity(cart, id, quantity) {
  const qty = Math.max(1, Number(quantity || 1));
  const items = cart.items.map((x) => (x.id === id ? { ...x, quantity: qty } : x));
  return { items };
}

export function removeFromCart(cart, id) {
  return { items: cart.items.filter((x) => x.id !== id) };
}

export function clearCart() {
  return { items: [] };
}

export function cartSummary(cart) {
  const soLuong = cart.items.reduce((sum, x) => sum + x.quantity, 0);
  const tongTien = cart.items.reduce((sum, x) => sum + x.quantity * (x.priceUSD || 0), 0);
  return { soLuong, tongTien };
}

