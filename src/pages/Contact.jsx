import { useState } from 'react'
import { motion } from 'framer-motion'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '916385322412'

const CONTACT_INFO = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#25D366">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    label: 'WhatsApp',
    value: '+91 63853 22412',
    sub: 'Usually replies in under 1 hour',
    href: `https://wa.me/${WHATSAPP}`,
    accent: '#25D366',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#00d4ff" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Email',
    value: 'support@posticky.in',
    sub: 'We reply within 24 hours',
    href: 'mailto:support@posticky.in',
    accent: '#00d4ff',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#ff2d78" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Location',
    value: 'Chennai, Tamil Nadu',
    sub: 'India 🇮🇳 · Shipping nationwide',
    href: null,
    accent: '#ff2d78',
  },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = encodeURIComponent(
      `Hi Posticky! 👋\n\nName: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\nMessage:\n${form.message}`
    )
    window.open(`https://wa.me/${WHATSAPP}?text=${text}`, '_blank')
    setSent(true)
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#f0f0f0',
    fontFamily: 'DM Sans, sans-serif',
  }

  const focusStyle = (e) => {
    e.target.style.borderColor = 'rgba(0,255,136,0.4)'
    e.target.style.boxShadow = '0 0 0 3px rgba(0,255,136,0.06)'
  }
  const blurStyle = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
    e.target.style.boxShadow = 'none'
  }

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
      <div className="fixed top-1/4 left-1/3 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none" style={{ background: '#00d4ff' }} />
      <div className="fixed bottom-1/4 right-1/3 w-80 h-80 rounded-full opacity-4 blur-3xl pointer-events-none" style={{ background: '#ff2d78' }} />

      <div className="relative max-w-5xl mx-auto px-4 py-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-14">
          <span className="text-xs font-bold tracking-widest block mb-3" style={{ color: '#00d4ff', fontFamily: 'Syne, sans-serif' }}>
            GET IN TOUCH
          </span>
          <h1
            className="text-5xl md:text-6xl font-extrabold leading-none mb-4"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            <span style={{ color: '#f0f0f0' }}>LET'S</span>
            <br />
            <span style={{ color: '#00d4ff', textShadow: '0 0 40px rgba(0,212,255,0.4)' }}>TALK.</span>
          </h1>
          <p className="text-sm" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif', maxWidth: '28rem' }}>
            Questions, custom orders, collabs, or just vibes — we're always open. Pick your channel below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left: contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {CONTACT_INFO.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                {c.href ? (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 rounded-2xl block transition-all duration-300"
                    style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.border = `1px solid ${c.accent}33`
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${c.accent}15`, border: `1px solid ${c.accent}25` }}
                    >
                      {c.icon}
                    </div>
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>{c.label}</p>
                      <p className="text-sm font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>{c.value}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}>{c.sub}</p>
                    </div>
                  </a>
                ) : (
                  <div
                    className="flex items-center gap-4 p-5 rounded-2xl"
                    style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${c.accent}15`, border: `1px solid ${c.accent}25` }}
                    >
                      {c.icon}
                    </div>
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>{c.label}</p>
                      <p className="text-sm font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>{c.value}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}>{c.sub}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Hours */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-5 rounded-2xl mt-2"
              style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.12)' }}
            >
              <p className="text-xs font-bold mb-3 tracking-widest" style={{ color: '#00ff88', fontFamily: 'Syne, sans-serif' }}>SUPPORT HOURS</p>
              <div className="flex flex-col gap-1">
                {[
                  { day: 'Mon – Sat', time: '9 AM – 9 PM' },
                  { day: 'Sunday', time: '10 AM – 6 PM' },
                ].map((h, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>{h.day}</span>
                    <span style={{ color: '#aaa', fontFamily: 'DM Sans, sans-serif' }}>{h.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div
              className="rounded-2xl p-6 md:p-8"
              style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="#25D366" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-extrabold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>
                    Message sent!
                  </h3>
                  <p className="text-sm mb-6" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>
                    We've opened WhatsApp with your message. We'll reply ASAP!
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                    className="text-sm px-5 py-2 rounded-xl transition-all duration-200"
                    style={{ color: '#00ff88', border: '1px solid rgba(0,255,136,0.25)', fontFamily: 'DM Sans, sans-serif' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,136,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    Send another →
                  </button>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-lg font-extrabold mb-6" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>
                    Send a Message
                  </h2>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold mb-1.5 block" style={{ color: '#666', fontFamily: 'Syne, sans-serif', letterSpacing: '0.08em' }}>YOUR NAME</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={set('name')}
                          placeholder="Arjun Kumar"
                          required
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                          style={inputStyle}
                          onFocus={focusStyle}
                          onBlur={blurStyle}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold mb-1.5 block" style={{ color: '#666', fontFamily: 'Syne, sans-serif', letterSpacing: '0.08em' }}>EMAIL</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={set('email')}
                          placeholder="you@example.com"
                          required
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                          style={inputStyle}
                          onFocus={focusStyle}
                          onBlur={blurStyle}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold mb-1.5 block" style={{ color: '#666', fontFamily: 'Syne, sans-serif', letterSpacing: '0.08em' }}>SUBJECT</label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={set('subject')}
                        placeholder="Custom order / Question / Feedback..."
                        required
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                        style={inputStyle}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold mb-1.5 block" style={{ color: '#666', fontFamily: 'Syne, sans-serif', letterSpacing: '0.08em' }}>MESSAGE</label>
                      <textarea
                        value={form.message}
                        onChange={set('message')}
                        placeholder="Tell us what's on your mind..."
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 resize-none"
                        style={inputStyle}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                      />
                    </div>

                    <button type="submit" className="btn-neon w-full py-3.5 text-sm mt-1">
                      Send via WhatsApp →
                    </button>
                    <p className="text-xs text-center" style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}>
                      Your message will open in WhatsApp — no app install needed on desktop.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  )
}