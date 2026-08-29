import jwt from 'jsonwebtoken'

// Verifies the JWT and attaches req.userId — this is what makes a route
// "protected" on the backend, independent of anything the frontend does.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided. Please log in.' })
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch {
    return res.status(401).json({ message: 'Session expired or invalid. Please log in again.' })
  }
}
