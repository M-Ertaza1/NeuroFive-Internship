import { Router } from 'express'
import Project from '../models/Project.js'
import Task from '../models/Task.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

// GET /api/dashboard/summary — aggregated stats across ALL of the logged-in
// user's projects, for the dashboard charts. Aggregation happens server-side
// via MongoDB, not by shipping every task to the browser and summing there.
router.get('/summary', async (req, res) => {
  try {
    const projects = await Project.find({ 'members.user': req.userId }).select('_id')
    const projectIds = projects.map((p) => p._id)

    const [result] = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      {
        $facet: {
          byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
          byPriority: [{ $group: { _id: '$priority', count: { $sum: 1 } } }],
          totals: [{ $group: { _id: null, total: { $sum: 1 } } }],
        },
      },
    ])

    res.json({
      totalProjects: projects.length,
      totalTasks: result.totals[0]?.total || 0,
      byStatus: result.byStatus.map((s) => ({ label: s._id, count: s.count })),
      byPriority: result.byPriority.map((p) => ({ label: p._id, count: p.count })),
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dashboard summary.' })
  }
})

export default router
