import { useState } from "react";

// Shows the post image when available, otherwise a branded gradient cover with
// an emoji — so missing image files still look intentional.
function BlogCover({ src, alt, emoji = "🫧", className = "" }) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div
        aria-hidden="true"
        className={`flex items-center justify-center bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 text-5xl ${className}`}
      >
        {emoji}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

export default BlogCover;
