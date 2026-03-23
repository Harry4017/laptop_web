import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LaptopCard from "../components/LaptopCard";
import { deleteLaptop, fetchLaptops, updateLaptop } from "../lib/api";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({ items: [], page: 1, totalPages: 1 });
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const params = useMemo(() => {
    const q = searchParams.get("q") || "";
    const page = Number(searchParams.get("page") || 1);
    return { q, page };
  }, [searchParams]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    fetchLaptops({
      q: params.q || undefined,
      page: params.page,
      limit: 16
    })
      .then((res) => {
        if (!alive) return;
        setData(res);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Có lỗi xảy ra");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [params]);

  function updateParam(next) {
    const sp = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([k, v]) => {
      if (v === "" || v == null) sp.delete(k);
      else sp.set(k, String(v));
    });
    if (!("page" in next)) sp.set("page", "1");
    setSearchParams(sp);
  }

  function goPage(p) {
    const sp = new URLSearchParams(searchParams);
    sp.set("page", String(p));
    setSearchParams(sp);
  }

  function openEdit(item) {
    setEditing(item);
    setEditForm({
      ten: item.ten || "",
      danhMuc: item.danhMuc || "Laptop",
      giaVND: item.giaVND ?? 0,
      tonKho: item.tonKho ?? 0,
      hinhAnhUrl: item.hinhAnhUrl || ""
    });
  }

  function closeEdit() {
    setEditing(null);
    setEditForm(null);
  }

  async function saveEdit() {
    if (!editing || !editForm) return;
    setError("");
    try {
      const patch = {
        ten: String(editForm.ten || "").trim(),
        danhMuc: String(editForm.danhMuc || "").trim(),
        giaVND: Number(editForm.giaVND || 0),
        tonKho: Number(editForm.tonKho || 0),
        hinhAnhUrl: String(editForm.hinhAnhUrl || "").trim() || undefined
      };
      const updated = await updateLaptop(editing._id, patch);
      setData((d) => ({ ...d, items: d.items.map((x) => (x._id === updated._id ? updated : x)) }));
      closeEdit();
    } catch (e) {
      setError(e?.message || "Không thể lưu thay đổi");
    }
  }

  async function handleDelete(item) {
    const ok = confirm(`Xóa sản phẩm "${item.ten}"?`);
    if (!ok) return;
    setError("");
    try {
      await deleteLaptop(item._id);
      setData((d) => ({ ...d, items: d.items.filter((x) => x._id !== item._id) }));
    } catch (e) {
      setError(e?.message || "Không thể xóa");
    }
  }

  return (
    <div className="container">
      <div className="simpleTop">
        <input
          className="input"
          placeholder="Tìm theo tên..."
          value={params.q}
          onChange={(e) => updateParam({ q: e.target.value })}
        />
      </div>

      {error ? <div className="alert">{error}</div> : null}
      {loading ? <div className="muted">Đang tải dữ liệu...</div> : null}

      <div className="simpleGrid">
        {data.items.map((item) => (
          <LaptopCard key={item._id} item={item} onEdit={openEdit} onDelete={handleDelete} />
        ))}
      </div>

      <div className="pagination">
        <button className="btnGhost" onClick={() => goPage(Math.max(1, (data.page || 1) - 1))} disabled={(data.page || 1) <= 1}>
          Trang trước
        </button>
        <div className="muted">
          Trang {data.page || 1} / {data.totalPages || 1}
        </div>
        <button
          className="btnGhost"
          onClick={() => goPage(Math.min(data.totalPages || 1, (data.page || 1) + 1))}
          disabled={(data.page || 1) >= (data.totalPages || 1)}
        >
          Trang sau
        </button>
      </div>

      {editing && editForm ? (
        <div className="modalOverlay" onMouseDown={closeEdit}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <div className="modalTitle">Sửa sản phẩm</div>
              <button className="btnGhost" onClick={closeEdit}>
                Đóng
              </button>
            </div>
            <div className="modalBody">
              <label className="field">
                <div className="fieldLabel">Tên</div>
                <input className="input" value={editForm.ten} onChange={(e) => setEditForm((f) => ({ ...f, ten: e.target.value }))} />
              </label>
              <label className="field">
                <div className="fieldLabel">Danh mục</div>
                <input
                  className="input"
                  value={editForm.danhMuc}
                  onChange={(e) => setEditForm((f) => ({ ...f, danhMuc: e.target.value }))}
                />
              </label>
              <label className="field">
                <div className="fieldLabel">Giá (VND)</div>
                <input
                  className="input"
                  inputMode="numeric"
                  value={String(editForm.giaVND)}
                  onChange={(e) => setEditForm((f) => ({ ...f, giaVND: e.target.value.replace(/[^\d]/g, "") }))}
                />
              </label>
              <label className="field">
                <div className="fieldLabel">Tồn kho</div>
                <input
                  className="input"
                  inputMode="numeric"
                  value={String(editForm.tonKho)}
                  onChange={(e) => setEditForm((f) => ({ ...f, tonKho: e.target.value.replace(/[^\d]/g, "") }))}
                />
              </label>
              <label className="field">
                <div className="fieldLabel">Ảnh (URL)</div>
                <input
                  className="input"
                  value={editForm.hinhAnhUrl}
                  onChange={(e) => setEditForm((f) => ({ ...f, hinhAnhUrl: e.target.value }))}
                />
              </label>
            </div>
            <div className="modalFooter">
              <button className="btnPrimary" onClick={saveEdit}>
                Lưu
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

