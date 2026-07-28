import ApplicationForm from './components/ApplicationForm'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-12">
      <div className="max-w-xl w-full mb-8">
        <h1 className="font-display font-700 text-3xl md:text-4xl tracking-tight">
          Apply to join the team
        </h1>
        <p className="mt-3 text-ink/60">
          Fill out the form below. Every field is validated as you go, and again on the server.
        </p>
      </div>
      <ApplicationForm />
    </div>
  )
}
