import User from "../models/User.js";

// Runs after authMiddleware, which populates req.userData.userId.
//
// The role is read from the database rather than a JWT claim so that revoking
// someone's admin takes effect immediately instead of waiting out the token's
// one-hour expiry.
export default async function requireAdmin(req, res, next) {
  try {
    const user = await User.findById(req.userData.userId).select(
      "role username",
    );

    // 403, not 401: the caller authenticated fine, they just lack the role.
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = user;
    next();
  } catch {
    res.status(403).json({ message: "Forbidden" });
  }
}
