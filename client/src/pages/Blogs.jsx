import { useState, useEffect } from "react";
import { Link } from "react-router";
import BlogCover from "../components/blogs/BlogCover.jsx";
import { formatDate } from "../lib/format.js";

const emojis = ["📖", "🍓", "🛠️", "🫧", "🧋"];

function Blogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/v1/blogs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load blog posts");
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-500">
        Loading posts…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl py-32 text-center">
        <div className="text-6xl">🫙</div>
        <p className="mt-4 text-gray-600">{error}</p>
      </div>
    );
  }

  const sorted = [...posts].sort((a, b) =>
    (b.createdAt || "").localeCompare(a.createdAt || ""),
  );

  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl from-purple-600 via-fuchsia-600 to-pink-500 px-6 py-16 text-center text-white sm:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <span className="absolute left-10 top-10 h-16 w-16 rounded-full bg-white/20 blur-md" />
          <span className="absolute right-14 bottom-8 h-24 w-24 rounded-full bg-lime-300/30 blur-lg" />
        </div>
        <div className="relative mx-auto max-w-2xl">
          <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-semibold tracking-wide backdrop-blur">
            📝 The Brew Blog
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Tips, flavors & fizz
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/90">
            Guides, recipes, and troubleshooting to help you brew better
            kombucha at home.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((post, i) => (
          <article
            key={post._id}
            className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <Link to={`/blog/${post._id}`}>
              <BlogCover
                src={post.image}
                alt={post.title}
                emoji={emojis[i % emojis.length]}
                className="h-44 w-full"
              />
            </Link>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-fuchsia-600">
                {formatDate(post.createdAt?.slice(0, 10))} · {post.author}
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold text-gray-900">
                <Link
                  to={`/blog/${post._id}`}
                  className="hover:text-purple-700"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 flex-1 text-sm text-gray-600">
                {post.content?.length > 140
                  ? `${post.content.slice(0, 140)}…`
                  : post.content}
              </p>
              <Link
                to={`/blog/${post._id}`}
                className="mt-4 inline-block text-sm font-semibold text-purple-700 hover:underline"
              >
                Read more
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default Blogs;
