import jwt from 'jsonwebtoken'

/**
 * Reads the "Authorization: Bearer <token>" header, verifies the JWT,
 * and attaches the decoded user id to req.userId. Rejects the request
 * with 401 if the token is missing or invalid — this is what makes a
 * route "protected".
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided. Please log in.' })
  }

  const token = header.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Session expired or invalid. Please log in again.' })
  }
}
