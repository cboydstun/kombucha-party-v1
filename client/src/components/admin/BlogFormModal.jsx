import { useEffect, useRef, useState } from "react";

const inputClass =
  "mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200";

const emptyPost = { title: "", image: "", status: "published", content: "" };

// initialPost === null means "create"; otherwise we edit that post.
export default function BlogFormModal({
  initialPost,
  token,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState(() =>
    initialPost
      ? {
          title: initialPost.title ?? "",
          image: initialPost.image ?? "",
          status: initialPost.status ?? "published",
          content: initialPost.content ?? "",
        }
      : emptyPost,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const editing = Boolean(initialPost);
    const url = editing
      ? `/api/v1/admin/blogs/${initialPost._id}`
      : "/api/v1/admin/blogs";

    try {
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(
          editing ? "Failed to save post" : "Failed to create post",
        );
      }

      onSaved(await res.json());
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gray-900/50 p-4 backdrop-blur-sm sm:p-8"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={initialPost ? "Edit post" : "New post"}
        className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-lg"
      >
        <h2 className="border-b border-gray-200 px-5 py-4 font-display text-lg font-semibold text-gray-900">
          {initialPost ? "Edit post" : "New post"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Title
            </span>
            <input
              ref={titleRef}
              type="text"
              required
              value={form.title}
              onChange={update("title")}
              className={inputClass}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Cover image URL
              </span>
              <input
                type="url"
                value={form.image}
                onChange={update("image")}
                placeholder="https://…"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </span>
              <select
                value={form.status}
                onChange={update("status")}
                className={inputClass}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Content
            </span>
            <textarea
              required
              rows={12}
              value={form.content}
              onChange={update("content")}
              className={`${inputClass} resize-y font-mono`}
            />
          </label>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="flex justify-end gap-2 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-purple-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-purple-800 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
