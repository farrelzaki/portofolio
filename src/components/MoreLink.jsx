import { Link } from '../lib/router.jsx'

/** Tautan "lihat semua" dari beranda ke halaman lengkap sebuah bagian. */
export default function MoreLink({ to, label, align = 'center' }) {
  return (
    <div className={`more more-${align}`}>
      <Link to={to} className="more-link">
        <span>{label}</span>
        <i aria-hidden="true">→</i>
      </Link>
    </div>
  )
}
