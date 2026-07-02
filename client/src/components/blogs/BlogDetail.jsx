import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import BlogCover from "./BlogCover.jsx";
import { formatDate } from "../../lib/format.js";

function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/v1/blogs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load blog posts");
        return res.json();
      })
      .then((data) => {
        const found = data.find((p) => p._id === slug);
        setPost(found ?? null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-500">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-xl text-center">
        <div className="text-6xl">🫙</div>
        <p className="mt-4 text-gray-600">{error}</p>
        <Link
          to="/blogs"
          className="mt-6 inline-block rounded-full bg-purple-700 px-6 py-3 font-semibold text-white hover:bg-purple-800"
        >
          ← Back to the blog
        </Link>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="mx-auto max-w-xl text-center">
        <div className="text-6xl">🫙</div>
        <h1 className="mt-4 font-display text-3xl font-bold text-gray-900">
          Post not found
        </h1>
        <p className="mt-2 text-gray-600">
          That article may have fermented away.
        </p>
        <Link
          to="/blogs"
          className="mt-6 inline-block rounded-full bg-purple-700 px-6 py-3 font-semibold text-white hover:bg-purple-800"
        >
          ← Back to the blog
        </Link>
      </section>
    );
  }

  return (
    <article className="mx-auto max-w-2xl">
      <Link
        to="/blogs"
        className="text-sm font-medium text-purple-700 hover:underline"
      >
        ← Back to the blog
      </Link>

      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-fuchsia-600">
        {formatDate(post.createdAt?.slice(0, 10))} · {post.author}
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold leading-tight tracking-tight text-gray-900">
        {post.title}
      </h1>

      <BlogCover
        src={post.image}
        alt={post.title}
        emoji="🫧"
        className="mt-6 h-64 w-full rounded-3xl"
      />

      <div className="mt-8 space-y-4 leading-relaxed text-gray-700">
        {(post.content ?? "")
          .split("\n")
          .filter((para) => para.trim())
          .map((para, i) => (
            <p key={i}>{para}</p>
          ))}
      </div>

      <div className="mt-10 rounded-2xl bg-purple-50 p-6 text-center">
        <p className="font-display text-lg font-semibold text-gray-900">
          Ready to put this into practice?
        </p>
        <Link
          to="/products"
          className="mt-4 inline-block rounded-full bg-purple-700 px-6 py-3 font-semibold text-white hover:bg-purple-800"
        >
          Shop brewing kits
        </Link>
      </div>
    </article>
  );
}

export default BlogDetail;
