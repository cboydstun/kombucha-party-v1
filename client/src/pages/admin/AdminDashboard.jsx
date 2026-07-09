import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatPrice, formatDate, productTitle } from "../../lib/format.js";

const PERIODS = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" },
];

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  shipped: "bg-sky-100 text-sky-700",
  delivered: "bg-purple-100 text-purple-700",
  refunded: "bg-rose-100 text-rose-700",
};

// Server stores money as integer cents.
const money = (cents) => formatPrice(cents / 100);

function KpiCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </p>
        <span aria-hidden="true" className="text-xl">
          {icon}
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}

function SectionMessage({ children }) {
  return <p className="py-8 text-center text-sm text-gray-500">{children}</p>;
}

export default function AdminDashboard() {
  const { token } = useAuth();

  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState(null);

  const [period, setPeriod] = useState("month");
  // Tagged with the period it answers, so a stale result reads as "still
  // loading" for the newly selected period without resetting state in an effect.
  const [topResult, setTopResult] = useState(null);

  const topLoading = topResult?.period !== period;
  const topError = topResult?.error;
  const topProducts = topResult?.products;

  useEffect(() => {
    let cancelled = false;

    fetch("/api/v1/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load dashboard stats");
        return res.json();
      })
      .then((data) => !cancelled && setStats(data))
      .catch((err) => !cancelled && setStatsError(err.message));

    return () => {
      cancelled = true;
    };
  }, [token]);

  // Only the leaderboard depends on the period, so only it refetches on toggle.
  useEffect(() => {
    let cancelled = false;

    fetch(`/api/v1/admin/stats/top-products?period=${period}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load top products");
        return res.json();
      })
      .then(
        (data) =>
          !cancelled && setTopResult({ period, products: data.products }),
      )
      .catch(
        (err) => !cancelled && setTopResult({ period, error: err.message }),
      );

    return () => {
      cancelled = true;
    };
  }, [token, period]);

  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <Sidebar />

      <div className="min-w-0 flex-1 space-y-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900">
          Admin Dashboard
        </h1>

        {/* KPIs */}
        <section>
          {statsError ? (
            <SectionMessage>{statsError}</SectionMessage>
          ) : !stats ? (
            <SectionMessage>Loading stats…</SectionMessage>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard
                label="Sales"
                value={money(stats.totalSales)}
                icon="💰"
              />
              <KpiCard label="Orders" value={stats.orderCount} icon="📦" />
              <KpiCard label="Users" value={stats.userCount} icon="👤" />
              <KpiCard label="Products" value={stats.productCount} icon="🫙" />
            </div>
          )}
        </section>

        {/* Recent activity */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <h2 className="border-b border-gray-200 px-5 py-4 font-display text-lg font-semibold text-gray-900">
            Recent orders
          </h2>

          {statsError ? (
            <SectionMessage>{statsError}</SectionMessage>
          ) : !stats ? (
            <SectionMessage>Loading orders…</SectionMessage>
          ) : stats.recentOrders.length === 0 ? (
            <SectionMessage>No orders yet.</SectionMessage>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Customer</th>
                    <th className="px-5 py-3 font-semibold">Items</th>
                    <th className="px-5 py-3 font-semibold">Total</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-5 py-3">
                        <span className="font-medium text-gray-900">
                          {order.user?.username ?? "Deleted user"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-600">
                        {order.items.reduce((n, i) => n + i.qty, 0)}
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-900">
                        {money(order.total)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                            STATUS_STYLES[order.status]
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-600">
                        {formatDate(order.createdAt.slice(0, 10))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Popular products */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-gray-900">
              Top products
            </h2>

            <div className="flex gap-1 rounded-full bg-gray-100 p-1">
              {PERIODS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPeriod(value)}
                  aria-pressed={period === value}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    period === value
                      ? "bg-white text-purple-700 shadow-sm"
                      : "text-gray-600 hover:text-purple-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {topLoading ? (
            <SectionMessage>Loading top products…</SectionMessage>
          ) : topError ? (
            <SectionMessage>{topError}</SectionMessage>
          ) : topProducts.length === 0 ? (
            <SectionMessage>No sales in this period.</SectionMessage>
          ) : (
            <ul className="divide-y divide-gray-100">
              {topProducts.map((product, i) => (
                <li
                  key={product.productId}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">
                      {productTitle(product.name)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.units} sold
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {money(product.revenue)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
