import { content, formatPeriod, t } from '../content/index.js'
import TwoTone from '../components/TwoTone.jsx'

const { settings, experiences } = content

export default function Journey({ lang }) {
  const sec = settings.sections.journey
  return (
    <section className="journey" id="journey" data-theme="light">
      <header className="sec-head left">
        <TwoTone as="h2" className="small" lead={t(lang, sec.lead)} tail={t(lang, sec.tail)} />
      </header>
      <ol className="jlist">
        {experiences.map((e) => (
          <li key={e.id} className="jrow">
            <span className="mono">{formatPeriod(lang, e.start, e.end)}</span>
            <h3>{t(lang, e.title)}</h3>
            <span className="jorg">{e.organization}</span>
            <p>{t(lang, e.description)}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
