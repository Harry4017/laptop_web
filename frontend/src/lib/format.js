export function formatVND(value) {
  const n = Number(value || 0);
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

