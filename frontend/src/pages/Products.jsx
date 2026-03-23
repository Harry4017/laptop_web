import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LaptopCard from "../components/LaptopCard";
import { fetchLaptops } from "../lib/api";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({ items: [], page: 1, totalPages: 1 });

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

  return (
    <div className="container">
      <div className="simpleTop">
        <input
          className="input"
          placeholder="Search products..."
          value={params.q}
          onChange={(e) => updateParam({ q: e.target.value })}
        />
      </div>

      {error ? <div className="alert">{error}</div> : null}
      {loading ? <div className="muted">Loading...</div> : null}

      <div className="simpleGrid">
        {data.items.map((item) => (
          <LaptopCard key={item._id} item={item} />
        ))}
      </div>

      <div className="pagination">
        <button className="btnGhost" onClick={() => goPage(Math.max(1, (data.page || 1) - 1))} disabled={(data.page || 1) <= 1}>
          Prev
        </button>
        <div className="muted">
          Page {data.page || 1} / {data.totalPages || 1}
        </div>
        <button
          className="btnGhost"
          onClick={() => goPage(Math.min(data.totalPages || 1, (data.page || 1) + 1))}
          disabled={(data.page || 1) >= (data.totalPages || 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

