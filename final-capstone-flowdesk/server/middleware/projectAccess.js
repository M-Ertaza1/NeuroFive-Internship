import Project from '../models/Project.js'

/**
 * Loads the project, checks the logged-in user is a member, and attaches
 * both `req.project` and `req.membership` (their role on this project) for
 * downstream handlers to use. This is the server-side enforcement of
 * role-based permissions — the frontend hiding a button is just UX, this
 * middleware is what actually stops an unauthorized request.
 */
export async function requireProjectMember(req, res, next) {
  try {
    const project = await Project.findById(req.params.projectId || req.params.id)
    if (!project) return res.status(404).json({ message: 'Project not found.' })

    const membership = project.members.find((m) => m.user.toString() === req.userId)
    if (!membership) {
      return res.status(403).json({ message: 'You are not a member of this project.' })
    }

    req.project = project
    req.membership = membership
    next()
  } catch (err) {
    res.status(500).json({ message: 'Failed to verify project access.' })
  }
}

// Use after requireProjectMember — restricts to owners only (invite/remove
// members, change roles, delete the project).
export function requireProjectOwner(req, res, next) {
  if (req.membership.role !== 'owner') {
    return res.status(403).json({ message: 'Only project owners can do this.' })
  }
  next()
}
