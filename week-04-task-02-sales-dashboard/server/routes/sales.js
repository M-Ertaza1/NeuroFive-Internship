import { Router } from 'express'
import Sale, { CATEGORY_OPTIONS, REGION_OPTIONS } from '../models/Sale.js'

const router = Router()

// GET /api/sales/meta — filter options for the frontend dropdown
router.get('/meta', (req, res) => {
  res.json({ categories: CATEGORY_OPTIONS, regions: REGION_OPTIONS })
})

// GET /api/sales/summary?category=&region=&from=&to=
router.get('/summary', async (req, res) => {
  try {
    const { category, region, from, to } = req.query

    const match = {}
    if (category) match.category = category
    if (region) match.region = region
    if (from || to) {
      match.date = {}
      if (from) match.date.$gte = new Date(from)
      if (to) match.date.$lte = new Date(to)
    }

    const [result] = await Sale.aggregate([
      { $match: match },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: '$amount' },
                totalOrders: { $sum: 1 },
              },
            },
          ],
          byMonth: [
            {
              $group: {
                _id: { year: { $year: '$date' }, month: { $month: '$date' } },
                revenue: { $sum: '$amount' },
              },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
          ],
          byCategory: [
            { $group: { _id: '$category', revenue: { $sum: '$amount' } } },
            { $sort: { revenue: -1 } },
          ],
          byRegion: [
            { $group: { _id: '$region', revenue: { $sum: '$amount' } } },
            { $sort: { revenue: -1 } },
          ],
        },
      },
    ])

    const totals = result.totals[0] || { totalRevenue: 0, totalOrders: 0 }
    const avgOrderValue = totals.totalOrders > 0 ? totals.totalRevenue / totals.totalOrders : 0

    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    res.json({
      totalRevenue: Math.round(totals.totalRevenue * 100) / 100,
      totalOrders: totals.totalOrders,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
      revenueByMonth: result.byMonth.map((m) => ({
        label: `${MONTH_NAMES[m._id.month - 1]} ${m._id.year}`,
        revenue: Math.round(m.revenue * 100) / 100,
      })),
      revenueByCategory: result.byCategory.map((c) => ({
        label: c._id,
        revenue: Math.round(c.revenue * 100) / 100,
      })),
      revenueByRegion: result.byRegion.map((r) => ({
        label: r._id,
        revenue: Math.round(r.revenue * 100) / 100,
      })),
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch sales summary.' })
  }
})

export default router
