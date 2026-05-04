import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const STATS = [
  { value: '10K+', label: 'Happy Customers', color: '#00ff88' },
  { value: '500+', label: 'Unique Designs', color: '#00d4ff' },
  { value: '4.9★', label: 'Average Rating', color: '#ff2d78' },
  { value: '48hr', label: 'Fast Delivery', color: '#00ff88' },
]

const VALUES = [
  {
    icon: '⚡',
    title: 'Born from Obsession',
    desc: 'Posticky started in a bedroom with one simple belief — your space and your style should scream who you are, not whisper it.',
    accent: '#00ff88',
  },
  {
    icon: '🎨',
    title: 'Design is Everything',
    desc: 'Every sticker, every tee goes through a rigorous design process. We obsess over details so you don\'t have to.',
    accent: '#00d4ff',
  },
  {
    icon: '💎',
    title: 'No Compromise on Quality',
    desc: 'Vinyl-grade stickers that outlast walls. 100% cotton tees that survive a thousand washes. That\'s the Posticky promise.',
    accent: '#ff2d78',
  },
]

const TEAM = [
  { initials: 'AT', name: 'Athish D.', role: 'Founder & Designer', color: '#00ff88' },
  { initials: 'AT', name: 'Athish D.', role: 'Creative Head', color: '#ff2d78' },
  { initials: 'AT', name: 'Athish D.', role: 'Operations', color: '#00d4ff' },
]

export default function About() {
  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="fixed top-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none" style={{ background: '#00d4ff' }} />
      <div className="fixed bottom-1/3 left-1/4 w-80 h-80 rounded-full opacity-4 blur-3xl pointer-events-none" style={{ background: '#00ff88' }} />

      <div className="relative max-w-5xl mx-auto px-4 py-16">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <span className="text-xs font-bold tracking-widest block mb-3" style={{ color: '#00d4ff', fontFamily: 'Syne, sans-serif' }}>
            OUR STORY
          </span>
          <h1
            className="text-5xl md:text-7xl font-extrabold leading-none mb-8"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            <span style={{ color: '#f0f0f0' }}>WE ARE</span>
            <br />
            <span style={{ color: '#00d4ff', textShadow: '0 0 40px rgba(0,212,255,0.4)' }}>POSTICKY.</span>
          </h1>

          <div className="max-w-2xl">
            <p
              className="text-base md:text-lg leading-relaxed mb-4"
              style={{ color: '#999', fontFamily: 'DM Sans, sans-serif' }}
            >
              Posticky is your one-stop destination for premium wall stickers and custom printed T-shirts — made for people who refuse to blend in.
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
            >
              Founded with a passion for design, we craft every product with obsessive care — from hand-picked sticker collections to high-quality fabric prints. Whether you're transforming your bedroom, gifting someone special, or expressing yourself through fashion, Posticky has something loud for you.
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl text-center"
              style={{ background: '#111', border: `1px solid ${s.color}22` }}
            >
              <p
                className="text-3xl font-extrabold mb-1"
                style={{ fontFamily: 'Syne, sans-serif', color: s.color, textShadow: `0 0 20px ${s.color}44` }}
              >
                {s.value}
              </p>
              <p className="text-xs" style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="mb-10">
            <span className="text-xs font-bold tracking-widest block mb-1" style={{ color: '#00ff88', fontFamily: 'Syne, sans-serif' }}>WHAT DRIVES US</span>
            <h2 className="text-2xl md:text-3xl font-extrabold" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {VALUES.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl flex flex-col gap-3 transition-all duration-300"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = `1px solid ${v.accent}33`
                  e.currentTarget.style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <span className="text-2xl">{v.icon}</span>
                <h3 className="font-bold text-sm" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>{v.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>{v.desc}</p>
                <div className="mt-auto pt-4 h-0.5 w-8 rounded-full" style={{ background: v.accent, opacity: 0.5 }} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="mb-10">
            <span className="text-xs font-bold tracking-widest block mb-1" style={{ color: '#ff2d78', fontFamily: 'Syne, sans-serif' }}>THE PEOPLE</span>
            <h2 className="text-2xl md:text-3xl font-extrabold" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>Behind the Brand</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TEAM.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl flex items-center gap-4"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-extrabold shrink-0"
                  style={{
                    background: `${t.color}15`,
                    border: `2px solid ${t.color}33`,
                    color: t.color,
                    fontFamily: 'Syne, sans-serif',
                    textShadow: `0 0 12px ${t.color}66`,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-10 md:p-14 text-center"
          style={{
            background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1a1f 50%, #0a1a0a 100%)',
            border: '1px solid rgba(0,212,255,0.2)',
          }}
        >
          <div className="absolute inset-0 opacity-8" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #00d4ff 0%, transparent 50%), radial-gradient(circle at 70% 50%, #00ff88 0%, transparent 50%)' }} />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>
              Join the movement.
            </h2>
            <p className="mb-8 text-sm" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>
              10,000+ customers already wearing & sticking their vibe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop" className="btn-neon px-8 py-3.5 text-sm">Shop Collection →</Link>
              <Link to="/custom-order" className="btn-outline-neon px-8 py-3.5 text-sm">Custom Order</Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}