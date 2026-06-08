'use client'

import Link from 'next/link'
import { FaWhatsapp, FaFacebook, FaInstagram, FaXTwitter, FaLinkedin } from 'react-icons/fa6'

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-16 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="font-bold text-lg mb-4">Benevora Initiative</h3>
            <p className="text-sm opacity-90">
              Empowering lives and inspiring change in communities. Founded in 2021, we are committed to making a difference.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="/about" className="hover:underline">About</Link></li>
              <li><Link href="/events" className="hover:underline">Events</Link></li>
              <li><Link href="/blogs" className="hover:underline">Blogs</Link></li>
              <li><Link href="/membership" className="hover:underline">Membership</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
              <li><Link href="/donate" className="hover:underline">Donate</Link></li>
            </ul>
          </div>

          {/* Social & Admin */}
          <div>
            <h3 className="font-bold text-lg mb-4">Connect With Us</h3>
            <div className="flex gap-4">
              <a
                href="https://wa.me/256707015676"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-all"
                title="WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all"
                title="Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-pink-600 hover:bg-pink-700 text-white transition-all"
                title="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-black hover:bg-gray-800 text-white transition-all"
                title="X"
              >
                <FaXTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-blue-700 hover:bg-blue-800 text-white transition-all"
                title="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary-foreground/20 pt-6 mt-6"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-75">
          <p>&copy; 2026 Benevora Initiative. All rights reserved.</p>
          <Link href="/login" className="mt-4 md:mt-0 text-sm font-semibold hover:underline">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  )
}
