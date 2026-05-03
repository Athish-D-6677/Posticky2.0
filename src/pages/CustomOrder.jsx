import { motion } from 'framer-motion'

const STEPS = [
  { num: '01', title: 'Tell Us Your Idea', desc: 'Share your concept — logo, quote, art, or vibe. Any format works.' },
  { num: '02', title: 'We Design It', desc: 'Our team mocks up your design and sends you a preview within 24hrs.' },
  { num: '03', title: 'Approve & Pay', desc: 'Happy with the preview? Confirm and pay. No hidden charges.' },
  { num: '04', title: 'Shipped to You', desc: 'Your custom piece is printed and dispatched within 48 hours.' },
]

const PRODUCTS = [
  { icon: '🎨', label: 'Custom Stickers', desc: 'Any shape, any size. Your art on premium vinyl.' },
  { icon: '👕', label: 'Custom T-Shirts', desc: '100% cotton. Front, back, sleeve — you decide.' },
  { icon: '🖼️', label: 'Wall Decals', desc: 'Giant custom wall art for rooms, studios, offices.' },
  { icon: '🎁', label: 'Gift Packs', desc: 'Curated custom sets for birthdays, events & more.' },
]

export default function CustomOrder() {
  const waLink = `https://wa.me/916385322412?text=Hi! I want to place a custom order on Posticky.`

  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Glow orbs */}
      <div className="fixed top-1/4 left-1/3 w-96 h-96 rounded-full opacity-6 blur-3xl pointer-events-none" style={{ background: '#00ff88' }} />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-5 blur-3xl pointer-events-none" style={{ background: '#ff2d78' }} />

      <div className="relative max-w-5xl mx-auto px-4 py-16">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-bold tracking-widest"
            style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.25)', color: '#00ff88', fontFamily: 'Syne, sans-serif' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            CUSTOM ORDERS OPEN
          </span>

          <h1
            className="text-5xl md:text-7xl font-extrabold leading-none mb-6"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            <span style={{ color: '#f0f0f0' }}>MAKE IT</span>
            <br />
            <span style={{ color: '#00ff88', textShadow: '0 0 40px rgba(0,255,136,0.4)' }}>YOURS.</span>
          </h1>

          <p
            className="text-base md:text-lg max-w-md mx-auto mb-10 leading-relaxed"
            style={{ color: '#777', fontFamily: 'DM Sans, sans-serif' }}
          >
            Your design. Your rules. We print anything — logos, quotes, art, memes. Minimum 1 piece.
          </p>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              color: '#fff',
              fontFamily: 'Syne, sans-serif',
              boxShadow: '0 0 30px rgba(37,211,102,0.3)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 50px rgba(37,211,102,0.5)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(37,211,102,0.3)'}
          >
            {/* WhatsApp icon */}
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Start on WhatsApp
          </a>
        </motion.div>

        {/* What we customize */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest block mb-1" style={{ color: '#ff2d78', fontFamily: 'Syne, sans-serif' }}>WHAT WE DO</span>
            <h2 className="text-2xl md:text-3xl font-extrabold" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>Custom Products</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PRODUCTS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-2xl text-center transition-all duration-300"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = '1px solid rgba(0,255,136,0.25)'
                  e.currentTarget.style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="text-sm font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>{p.label}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest block mb-1" style={{ color: '#00ff88', fontFamily: 'Syne, sans-serif' }}>THE PROCESS</span>
            <h2 className="text-2xl md:text-3xl font-extrabold" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5 p-6 rounded-2xl"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span
                  className="text-3xl font-extrabold shrink-0 leading-none"
                  style={{ fontFamily: 'Syne, sans-serif', color: 'rgba(0,255,136,0.2)' }}
                >
                  {step.num}
                </span>
                <div>
                  <h3 className="font-bold text-sm mb-1" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>{step.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>{step.desc}</p>
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
            background: 'linear-gradient(135deg, #0d1f0d 0%, #0a0a1a 50%, #0d1f0d 100%)',
            border: '1px solid rgba(0,255,136,0.2)',
          }}
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #00ff88 0%, transparent 50%), radial-gradient(circle at 70% 50%, #25D366 0%, transparent 50%)' }} />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>
              Ready to create?
            </h2>
            <p className="mb-8 text-sm" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>
              Drop us a message on WhatsApp. We reply within 1 hour.
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', fontFamily: 'Syne, sans-serif', boxShadow: '0 0 30px rgba(37,211,102,0.3)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 50px rgba(37,211,102,0.5)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(37,211,102,0.3)'}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp →
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  )
}