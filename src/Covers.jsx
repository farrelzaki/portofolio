// Cover projek. LensaJentik memakai tangkapan layar asli dari pitch deck;
// sisanya digambar dengan kode sebagai fragmen antarmuka projek masing-masing.
const INK = '#0B1220'
const BLUE = '#2563EB'
const SKY = '#7DB2FF'
const PAPER = '#FFFFFF'
const SOFT = '#EAF0FF'

function Frame({ children, bg }) {
  return (
    <svg viewBox="0 0 640 480" role="img" preserveAspectRatio="xMidYMid slice" className="cover-svg">
      <rect width="640" height="480" fill={bg} />
      {children}
    </svg>
  )
}

function Sudepi() {
  return (
    <Frame bg={INK}>
      <rect x="40" y="40" width="560" height="400" fill="#101A30" />
      {[
        [90, 110], [550, 110], [90, 370], [550, 370],
      ].map(([x, y], i) => (
        <path
          key={i}
          d={`M${x - (x < 320 ? 0 : 36)} ${y + (y < 240 ? 36 : -36)} V${y} H${x + (x < 320 ? 36 : 0)}`}
          fill="none" stroke={SKY} strokeWidth="4"
        />
      ))}
      <g>
        <rect x="150" y="150" width="190" height="96" fill={BLUE} />
        <rect x="150" y="150" width="190" height="96" fill="none" stroke={PAPER} strokeWidth="3" />
        <text x="170" y="206" fill={PAPER} fontSize="34" fontWeight="800">Rp 50.000</text>
        <rect x="150" y="124" width="120" height="26" fill={PAPER} />
        <text x="160" y="143" fill={INK} fontSize="15" fontWeight="700">50 ribu · 0.93</text>
      </g>
      <g>
        <rect x="290" y="236" width="190" height="96" fill={SKY} />
        <rect x="290" y="236" width="190" height="96" fill="none" stroke={PAPER} strokeWidth="3" />
        <text x="310" y="292" fill={INK} fontSize="34" fontWeight="800">Rp 20.000</text>
        <rect x="290" y="332" width="120" height="26" fill={PAPER} />
        <text x="300" y="351" fill={INK} fontSize="15" fontWeight="700">20 ribu · 0.91</text>
      </g>
      <rect x="40" y="392" width="560" height="48" fill={PAPER} />
      <text x="62" y="424" fill={INK} fontSize="22" fontWeight="800">Total Rp 70.000</text>
      <circle className="pulse" cx="560" cy="416" r="10" fill={BLUE} />
    </Frame>
  )
}

function Reservaseat() {
  const tables = []
  const taken = new Set([1, 4, 6, 9, 10])
  let n = 0
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      const x = 96 + c * 130, y = 120 + r * 100
      const t = taken.has(n)
      tables.push(
        <g key={n}>
          <circle cx={x + 32} cy={y + 32} r="32" fill={t ? BLUE : PAPER} />
          <text x={x + 32} y={y + 39} textAnchor="middle" fontSize="20" fontWeight="800" fill={t ? PAPER : INK}>{n + 1}</text>
        </g>
      )
      n++
    }
  }
  return (
    <Frame bg={SOFT}>
      <rect x="40" y="36" width="560" height="52" fill={INK} />
      <text x="62" y="70" fill={PAPER} fontSize="20" fontWeight="800">Cabang Bogor · 19:00</text>
      {tables}
      {['18:30', '19:00', '19:30', '20:00'].map((t, i) => (
        <g key={t}>
          <rect x={96 + i * 130} y="408" width="104" height="38" fill={i === 1 ? INK : PAPER} />
          <text x={148 + i * 130} y="433" textAnchor="middle" fontSize="16" fontWeight="700" fill={i === 1 ? PAPER : INK}>{t}</text>
        </g>
      ))}
    </Frame>
  )
}

function Cocokin() {
  const rows = [['Informatika', 92], ['Sistem Informasi', 84], ['Statistika', 71], ['Teknik Elektro', 63]]
  return (
    <Frame bg={BLUE}>
      <rect x="40" y="40" width="560" height="400" fill={INK} />
      <text x="70" y="96" fill={PAPER} fontSize="30" fontWeight="800">Cocokin!</text>
      <text x="70" y="124" fill={SKY} fontSize="16" fontWeight="600">Kecocokan jurusan dari minat dan nilai</text>
      {rows.map(([name, v], i) => {
        const w = Math.round((v / 100) * 360)
        const y = 160 + i * 66
        return (
          <g key={name}>
            <text x="70" y={y + 14} fill={PAPER} fontSize="17" fontWeight="700">{name}</text>
            <text x="530" y={y + 14} textAnchor="end" fill={PAPER} fontSize="17" fontWeight="800">{v}%</text>
            <rect x="70" y={y + 24} width="460" height="16" fill="#1B2744" />
            {Array.from({ length: Math.round(w / 20) }).map((_, k) => (
              <rect key={k} x={70 + k * 20} y={y + 24} width="16" height="16" fill={i === 0 ? SKY : BLUE} />
            ))}
          </g>
        )
      })}
    </Frame>
  )
}

function Trisis() {
  const cells = []
  const seed = [1,1,1,0,1,0,1,1,0,1,0,1,1,0,0,1,1,1,0,1,1,0,1,0,0,1,1,1,0,1,0,1,1,0,1,1,1,0,0,1,0,1,1,0,1,0,1,1,1]
  for (let i = 0; i < 49; i++) {
    const r = Math.floor(i / 7), c = i % 7
    if (seed[i]) cells.push(<rect key={i} x={226 + c * 26} y={110 + r * 26} width="22" height="22" fill={INK} />)
  }
  return (
    <Frame bg={SOFT}>
      <rect x="196" y="80" width="248" height="248" fill={PAPER} />
      {cells}
      <rect className="scan" x="196" y="104" width="248" height="6" fill={BLUE} />
      <rect x="150" y="360" width="340" height="64" fill={INK} />
      <circle cx="184" cy="392" r="14" fill={BLUE} />
      <path d="M177 392l5 5 9-10" fill="none" stroke={PAPER} strokeWidth="3" />
      <text x="212" y="386" fill={PAPER} fontSize="17" fontWeight="800">Check-in berhasil</text>
      <text x="212" y="408" fill={SKY} fontSize="14" fontWeight="600">Member aktif</text>
    </Frame>
  )
}

export default function Cover({ project, className = '' }) {
  const { cover, image, name } = project
  if (cover === 'image') {
    return <img className={`cover-img ${className}`} src={image} alt={`Tampilan ${name}`} loading="lazy" />
  }
  const map = { sudepi: Sudepi, reservaseat: Reservaseat, cocokin: Cocokin, trisis: Trisis }
  const C = map[cover]
  return <div className={`cover-wrap ${className}`}><C /></div>
}
