// src/components/Notif.jsx
import { useEffect } from 'react'

export default function Notif({ msg, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [])
  return <div className="notif">✓ {msg}</div>
}
