import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import BlogFormModal from "../../components/admin/BlogFormModal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatDate } from "../../lib/format.js";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

const STATUS_STYLES = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-amber-100 text-amber-700",
};

// Posts written before the status field existed are published by definition.
const statusOf = (post) => post.status ?? "published";

function SectionMessage({ children }) {
  return <p className="py-8 text-center text-sm text-gray-500">{children}</p>;
}

export default function Blogs() {
  const { token } = useAuth();

  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // null = closed. { post: null } = create; { post } = edit.
  const [editor, setEditor] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/v1/admin/blogs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load blog posts");
        return res.json();
      })
      .then((data) => !cancelled && setPosts(data))
      .catch((err) => !cancelled && setError(err.message));

    return () => {
      cancelled = true;
    };
  }, [token]);

  const needle = query.trim().toLowerCase();
  const visible = (posts ?? []).filter((post) => {
    if (statusFilter !== "all" && statusOf(post) !== statusFilter) return false;
    if (!needle) return true;
    return `${post.title} ${post.author}`.toLowerCase().includes(needle);
  });

  // Replace the edited post in place, or prepend a newly created one. The list
  // is sorted newest-first server-side, and a new post is the newest.
  function handleSaved(saved) {
    setPosts((prev) =>
      prev.some((p) => p._id === saved._id)
        ? prev.map((p) => (p._id === saved._id ? saved : p))
        : [saved, ...prev],
    );
    setEditor(null);
  }

  async function handleDelete(id) {
    setConfirmingId(null);
    try {
      const res = await fetch(`/api/v1/admin/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete post");
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <Sidebar />

      <div className="min-w-0 flex-1 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900">
            Blog posts
          </h1>
          <button
            type="button"
            onClick={() => setEditor({ post: null })}
            className="rounded-full bg-purple-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-purple-800"
          >
            New post
          </button>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title or author…"
              aria-label="Search posts"
              className="w-full max-w-xs rounded-full border border-gray-300 px-4 py-1.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            />

            <div className="flex gap-1 rounded-full bg-gray-100 p-1">
              {FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatusFilter(value)}
                  aria-pressed={statusFilter === value}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    statusFilter === value
                      ? "bg-white text-purple-700 shadow-sm"
                      : "text-gray-600 hover:text-purple-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <SectionMessage>{error}</SectionMessage>
          ) : !posts ? (
            <SectionMessage>Loading posts…</SectionMessage>
          ) : visible.length === 0 ? (
            <SectionMessage>
              {posts.length === 0 ? "No posts yet." : "No posts match."}
            </SectionMessage>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Title</th>
                    <th className="px-5 py-3 font-semibold">Author</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Updated</th>
                    <th className="px-5 py-3 font-semibold text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visible.map((post) => (
                    <tr key={post._id}>
                      <td className="max-w-xs truncate px-5 py-3 font-medium text-gray-900">
                        {post.title}
                      </td>
                      <td className="px-5 py-3 text-gray-600">{post.author}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                            STATUS_STYLES[statusOf(post)]
                          }`}
                        >
                          {statusOf(post)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-600">
                        {formatDate(
                          (post.updatedAt ?? post.createdAt)?.slice(0, 10),
                        )}
                      </td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        {confirmingId === post._id ? (
                          <>
                            <span className="mr-2 text-xs text-gray-500">
                              Delete?
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDelete(post._id)}
                              className="font-semibold text-rose-600 hover:underline"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmingId(null)}
                              className="ml-3 font-semibold text-gray-500 hover:underline"
                            >
                              No
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => setEditor({ post })}
                              className="font-semibold text-purple-700 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmingId(post._id)}
                              className="ml-3 font-semibold text-rose-600 hover:underline"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {editor && (
        <BlogFormModal
          initialPost={editor.post}
          token={token}
          onClose={() => setEditor(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
