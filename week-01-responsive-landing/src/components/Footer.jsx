export default function Footer() {
  return (
    <footer className="border-t border-ink/10">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-display font-700 text-lg">
          Flow<span className="text-teal">Board</span>
        </span>
        <p className="text-sm text-ink/50">© 2026 FlowBoard. Built as a NeuroFive Solutions internship task.</p>
        <div className="flex gap-4 text-sm text-ink/60">
          <a href="#product" className="hover:text-teal">Product</a>
          <a href="#pricing" className="hover:text-teal">Pricing</a>
          <a href="#customers" className="hover:text-teal">Customers</a>
        </div>
      </div>
    </footer>
  )
}
