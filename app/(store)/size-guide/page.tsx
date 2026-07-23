import type { Metadata } from 'next'
import { Ruler } from 'lucide-react'

export const metadata: Metadata = { title: 'Size Guide' }

const womenSizes = [
  { size: 'XS', bust: '32"', waist: '24"', hips: '34"', uk: '6', eu: '34' },
  { size: 'S',  bust: '34"', waist: '26"', hips: '36"', uk: '8', eu: '36' },
  { size: 'M',  bust: '36"', waist: '28"', hips: '38"', uk: '10', eu: '38' },
  { size: 'L',  bust: '38"', waist: '30"', hips: '40"', uk: '12', eu: '40' },
  { size: 'XL', bust: '40"', waist: '32"', hips: '42"', uk: '14', eu: '42' },
  { size: 'XXL',bust: '42"', waist: '34"', hips: '44"', uk: '16', eu: '44' },
]

const menSizes = [
  { size: 'S',   chest: '36"', waist: '30"', shoulders: '17"', uk: 'S' },
  { size: 'M',   chest: '38"', waist: '32"', shoulders: '18"', uk: 'M' },
  { size: 'L',   chest: '40"', waist: '34"', shoulders: '19"', uk: 'L' },
  { size: 'XL',  chest: '42"', waist: '36"', shoulders: '20"', uk: 'XL' },
  { size: 'XXL', chest: '44"', waist: '38"', shoulders: '21"', uk: 'XXL' },
]

const kidsSizes = [
  { size: '2-3 Years', height: '92-98cm', chest: '54cm', waist: '51cm' },
  { size: '4-5 Years', height: '104-110cm', chest: '58cm', waist: '53cm' },
  { size: '6-7 Years', height: '116-122cm', chest: '64cm', waist: '56cm' },
  { size: '8-9 Years', height: '128-134cm', chest: '68cm', waist: '59cm' },
  { size: '10-11 Years', height: '140-146cm', chest: '74cm', waist: '62cm' },
  { size: '12-13 Years', height: '152-158cm', chest: '80cm', waist: '65cm' },
]

export default function SizeGuidePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="py-14 text-center bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-400">Find Your Perfect Fit</p>
          <h1 className="text-4xl font-black mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-dark)' }}>Size Guide</h1>
          <p className="text-gray-500">Use our comprehensive size charts to find the perfect fit every time.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

        {/* How to Measure */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            <Ruler size={20} style={{ color: 'var(--color-primary)' }} /> How to Measure
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Bust / Chest', desc: 'Measure around the fullest part of your chest, keeping the tape parallel to the ground.' },
              { title: 'Waist', desc: 'Measure around the narrowest part of your natural waist, usually about 1 inch above your navel.' },
              { title: 'Hips', desc: 'Stand with feet together and measure around the fullest part of your hips, about 8 inches below your waist.' },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-xl p-4">
                <p className="font-semibold text-sm text-gray-900 mb-2">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Women's Size Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
            <h2 className="font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>Women's Size Chart</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead><tr><th>Size</th><th>Bust</th><th>Waist</th><th>Hips</th><th>UK</th><th>EU</th></tr></thead>
              <tbody>
                {womenSizes.map(s => (
                  <tr key={s.size}>
                    <td><span className="font-bold text-sm px-2.5 py-0.5 rounded text-white" style={{ backgroundColor: 'var(--color-primary)' }}>{s.size}</span></td>
                    <td>{s.bust}</td><td>{s.waist}</td><td>{s.hips}</td><td>{s.uk}</td><td>{s.eu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Men's Size Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <h2 className="font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>Men's Size Chart</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead><tr><th>Size</th><th>Chest</th><th>Waist</th><th>Shoulders</th><th>UK</th></tr></thead>
              <tbody>
                {menSizes.map(s => (
                  <tr key={s.size}>
                    <td><span className="font-bold text-sm px-2.5 py-0.5 rounded text-white bg-blue-500">{s.size}</span></td>
                    <td>{s.chest}</td><td>{s.waist}</td><td>{s.shoulders}</td><td>{s.uk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kids' Size Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-400" />
            <h2 className="font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>Kids' Size Chart</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead><tr><th>Age</th><th>Height</th><th>Chest</th><th>Waist</th></tr></thead>
              <tbody>
                {kidsSizes.map(s => (
                  <tr key={s.size}>
                    <td><span className="font-bold text-xs px-2 py-0.5 rounded text-white bg-orange-400">{s.size}</span></td>
                    <td>{s.height}</td><td>{s.chest}</td><td>{s.waist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Sizing Tips</h3>
          <ul className="space-y-3">
            {[
              'If you\'re between sizes, we recommend going one size up for a more comfortable fit.',
              'For fitted styles like bodycon dresses, choose your exact measurements.',
              'For oversized or relaxed fits, you can go one size down.',
              'Different brands may have slight variations — always check the specific product\'s size chart.',
              'When in doubt, contact our support team — we\'re happy to help you find the perfect size!',
            ].map((tip, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-600">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: 'var(--color-primary)' }}>{i + 1}</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
