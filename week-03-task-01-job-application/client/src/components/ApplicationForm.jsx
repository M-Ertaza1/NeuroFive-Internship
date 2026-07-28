import { useEffect, useState } from 'react'
import Toast from './Toast'
import { getRoles, submitApplication } from '../api'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[0-9\s-]{7,15}$/
const MAX_RESUME_MB = 5
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx']

const initialValues = {
  fullName: '',
  email: '',
  phone: '',
  role: '',
  availableFrom: '',
  coverLetter: '',
}

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

export default function ApplicationForm() {
  const [roles, setRoles] = useState([])
  const [values, setValues] = useState(initialValues)
  const [resumeFile, setResumeFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState({ type: '', message: '' })

  useEffect(() => {
    getRoles()
      .then(setRoles)
      .catch(() => setToast({ type: 'error', message: 'Could not load role options. Refresh to try again.' }))
  }, [])

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function handleFileChange(file) {
    setResumeFile(file)
    if (errors.resume) setErrors((prev) => ({ ...prev, resume: '' }))
  }

  function validate() {
    const next = {}

    if (!values.fullName.trim() || values.fullName.trim().length < 2) {
      next.fullName = 'Full name must be at least 2 characters.'
    }
    if (!EMAIL_RE.test(values.email)) {
      next.email = 'Please enter a valid email address.'
    }
    if (!PHONE_RE.test(values.phone)) {
      next.phone = 'Please enter a valid phone number (7–15 digits).'
    }
    if (!values.role) {
      next.role = 'Please select a role.'
    }
    if (!values.availableFrom) {
      next.availableFrom = 'Availability date is required.'
    } else if (values.availableFrom < todayISO()) {
      next.availableFrom = 'Date must be today or later.'
    }
    if (values.coverLetter.length > 1000) {
      next.coverLetter = 'Cover letter must be under 1000 characters.'
    }
    if (!resumeFile) {
      next.resume = 'Please attach your resume.'
    } else {
      const ext = resumeFile.name.slice(resumeFile.name.lastIndexOf('.')).toLowerCase()
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        next.resume = 'Resume must be a PDF or Word document.'
      } else if (resumeFile.size > MAX_RESUME_MB * 1024 * 1024) {
        next.resume = `File must be under ${MAX_RESUME_MB}MB.`
      }
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setToast({ type: '', message: '' })

    if (!validate()) return

    setSubmitting(true)
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, val]) => formData.append(key, val))
      formData.append('resume', resumeFile)

      await submitApplication(formData)

      setToast({ type: 'success', message: 'Application submitted successfully!' })
      setValues(initialValues)
      setResumeFile(null)
      e.target.reset()
    } catch (err) {
      setToast({ type: 'error', message: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Toast {...toast} onDismiss={() => setToast({ type: '', message: '' })} />

      <form onSubmit={handleSubmit} noValidate className="bg-white rounded-xl border border-ink/10 p-6 space-y-5 max-w-xl w-full">
        <Field label="Full name" error={errors.fullName}>
          <input
            type="text"
            value={values.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className={inputClass(errors.fullName)}
            placeholder="Jane Doe"
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={inputClass(errors.email)}
            placeholder="jane@example.com"
          />
        </Field>

        <Field label="Phone" error={errors.phone}>
          <input
            type="tel"
            value={values.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={inputClass(errors.phone)}
            placeholder="+92 300 1234567"
          />
        </Field>

        <Field label="Role you're applying for" error={errors.role}>
          <select
            value={values.role}
            onChange={(e) => handleChange('role', e.target.value)}
            className={inputClass(errors.role)}
          >
            <option value="">Select a role…</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Available from" error={errors.availableFrom}>
          <input
            type="date"
            min={todayISO()}
            value={values.availableFrom}
            onChange={(e) => handleChange('availableFrom', e.target.value)}
            className={inputClass(errors.availableFrom)}
          />
        </Field>

        <Field label="Resume (PDF or Word, max 5MB)" error={errors.resume}>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e.target.files[0] ?? null)}
            className={`w-full border rounded-lg px-4 py-2.5 text-sm ${
              errors.resume ? 'border-coral' : 'border-ink/15'
            }`}
          />
        </Field>

        <Field label="Cover letter (optional)" error={errors.coverLetter}>
          <textarea
            value={values.coverLetter}
            onChange={(e) => handleChange('coverLetter', e.target.value)}
            rows={4}
            maxLength={1000}
            className={`${inputClass(errors.coverLetter)} resize-none`}
            placeholder="A few lines about why you're a good fit..."
          />
          <p className="text-xs text-ink/40 mt-1">{values.coverLetter.length}/1000</p>
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-white font-semibold px-5 py-3 rounded-lg hover:bg-amber hover:text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting && (
            <span className="spinner inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
          )}
          {submitting ? 'Submitting…' : 'Submit application'}
        </button>
      </form>
    </>
  )
}

function inputClass(error) {
  return `w-full border rounded-lg px-4 py-2.5 transition-colors ${
    error ? 'border-coral focus:border-coral' : 'border-ink/15 focus:border-teal'
  }`
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1.5">{label}</label>
      {children}
      {error && <p className="text-sm text-coral mt-1.5">{error}</p>}
    </div>
  )
}
