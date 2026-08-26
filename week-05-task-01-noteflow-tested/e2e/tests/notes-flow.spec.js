import { test, expect, request } from '@playwright/test'

const API_URL = 'http://localhost:5000'
const TITLE_PREFIX = 'E2E Test Note'

// Deletes any leftover notes from previous (especially previously-failed)
// test runs before starting, so this test can be re-run repeatedly without
// old data piling up and causing false failures like duplicate matches.
async function cleanupTestNotes() {
  const api = await request.newContext()
  const res = await api.get(`${API_URL}/api/notes`)
  const notes = await res.json()
  const testNotes = notes.filter((n) => n.title.startsWith(TITLE_PREFIX))
  for (const note of testNotes) {
    await api.delete(`${API_URL}/api/notes/${note._id}`)
  }
  await api.dispose()
}

test.beforeEach(async () => {
  await cleanupTestNotes()
})

test.afterEach(async () => {
  await cleanupTestNotes()
})

test('user can create a note and see it appear, then delete it', async ({ page }) => {
  const noteTitle = `${TITLE_PREFIX} ${Date.now()}`
  const noteContent = 'Created by an automated end-to-end test.'

  await page.goto('/')

  await page.getByLabel('Title').fill(noteTitle)
  await page.getByLabel('Content').fill(noteContent)
  await page.getByRole('button', { name: /add note/i }).click()

  const card = page.locator('[data-testid="note-card"]').filter({ hasText: noteTitle })
  await expect(card).toBeVisible()
  await expect(card.getByText(noteContent)).toBeVisible()

  await card.getByRole('button', { name: /delete/i }).click()
  await expect(card).toHaveCount(0)
})