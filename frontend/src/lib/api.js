const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" }
  });
  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data?.message || "Không thể tải dữ liệu");
  }
  return res.json();
}

async function apiJson(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data?.message || "Không thể thực hiện yêu cầu");
  }
  return res.json();
}

async function apiNoContent(method, path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { Accept: "application/json" }
  });
  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data?.message || "Không thể thực hiện yêu cầu");
  }
  return safeJson(res);
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchLaptops(params) {
  const usp = new URLSearchParams();
  if (params?.q) usp.set("q", params.q);
  if (params?.hang) usp.set("hang", params.hang);
  if (params?.minGia != null) usp.set("minGia", String(params.minGia));
  if (params?.maxGia != null) usp.set("maxGia", String(params.maxGia));
  if (params?.sort) usp.set("sort", params.sort);
  if (params?.page) usp.set("page", String(params.page));
  if (params?.limit) usp.set("limit", String(params.limit));
  const query = usp.toString() ? `?${usp.toString()}` : "";
  return apiGet(`/api/laptops${query}`);
}

export async function fetchLaptopById(id) {
  return apiGet(`/api/laptops/${id}`);
}

export async function fetchHangs() {
  const data = await apiGet("/api/meta/hangs");
  return data?.hangs || [];
}

export async function updateLaptop(id, patch) {
  return apiJson("PUT", `/api/laptops/${id}`, patch);
}

export async function deleteLaptop(id) {
  return apiNoContent("DELETE", `/api/laptops/${id}`);
}

