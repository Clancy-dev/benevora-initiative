import { getAllFacebookLinks } from '@/actions/facebook';
import { getAllInstagramLinks } from '@/actions/instagram';
import { getAllLinkedinLinks } from '@/actions/linkedin';
import {
  getAllWhatsappLinks,
} from '@/actions/whatsapp';
import { getAllXLinks } from '@/actions/x';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaXTwitter } from 'react-icons/fa6';

interface SocialLink {
  type: string;
  url: string;
  handle?: string;
  phoneNumber?: string;
}

export async function Footer() {
  const [
    whatsappResult,
    facebookResult,
    instagramResult,
    xResult,
    linkedinResult,
  ] = await Promise.all([
    getAllWhatsappLinks(),
    getAllFacebookLinks(),
    getAllInstagramLinks(),
    getAllXLinks(),
    getAllLinkedinLinks(),
  ]);

  const socialLinks: SocialLink[] = [];

  const whatsappLinks =
    whatsappResult.success && whatsappResult.data
      ? whatsappResult.data
      : [];

  const facebookLinks =
    facebookResult.success && facebookResult.data
      ? facebookResult.data
      : [];

  const instagramLinks =
    instagramResult.success && instagramResult.data
      ? instagramResult.data
      : [];

  const xLinks =
    xResult.success && xResult.data
      ? xResult.data
      : [];

  const linkedinLinks =
    linkedinResult.success && linkedinResult.data
      ? linkedinResult.data
      : [];

  whatsappLinks.forEach((item: any) => {
    if (item.isActive) {
      socialLinks.push({
        type: 'whatsapp',
        url: `https://wa.me/${item.phoneNumber.replace(
          /[^0-9]/g,
          ''
        )}`,
        phoneNumber: item.phoneNumber,
      });
    }
  });

  facebookLinks.forEach((item: any) => {
    if (item.isActive) {
      socialLinks.push({
        type: 'facebook',
        url: item.url,
      });
    }
  });

  instagramLinks.forEach((item: any) => {
    if (item.isActive) {
      socialLinks.push({
        type: 'instagram',
        url: `https://instagram.com/${item.handle}`,
        handle: item.handle,
      });
    }
  });

  xLinks.forEach((item: any) => {
    if (item.isActive) {
      socialLinks.push({
        type: 'x',
        url: `https://x.com/${item.handle}`,
        handle: item.handle,
      });
    }
  });

  linkedinLinks.forEach((item: any) => {
    if (item.isActive) {
      socialLinks.push({
        type: 'linkedin',
        url: item.url,
      });
    }
  });

  if (socialLinks.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    // KEEP ALL YOUR CURRENT SVG ICONS HERE
  };

  const getLabel = (type: string) => {
    const labels: Record<string, string> = {
      whatsapp: 'WhatsApp',
      facebook: 'Facebook',
      instagram: 'Instagram',
      x: 'X',
      linkedin: 'LinkedIn',
    };

    return labels[type] || type;
  };
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
            <div className="flex gap-4 flex-wrap">
  {socialLinks.map((link) => (
    <a
      key={link.url}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        p-2 rounded-full text-white transition-all
        ${
          link.type === 'whatsapp'
            ? 'bg-green-500 hover:bg-green-600'
            : link.type === 'facebook'
            ? 'bg-blue-600 hover:bg-blue-700'
            : link.type === 'instagram'
            ? 'bg-pink-600 hover:bg-pink-700'
            : link.type === 'x'
            ? 'bg-black hover:bg-gray-800'
            : 'bg-blue-700 hover:bg-blue-800'
        }
      `}
    >
      {link.type === 'whatsapp' && (
        <FaWhatsapp className="w-5 h-5" />
      )}

      {link.type === 'facebook' && (
        <FaFacebook className="w-5 h-5" />
      )}

      {link.type === 'instagram' && (
        <FaInstagram className="w-5 h-5" />
      )}

      {link.type === 'x' && (
        <FaXTwitter className="w-5 h-5" />
      )}

      {link.type === 'linkedin' && (
        <FaLinkedin className="w-5 h-5" />
      )}
    </a>
  ))}
</div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary-foreground/20 pt-6 mt-6"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-75">
          <p> &copy; {new Date().getFullYear()} Benevora Initiative. All rights reserved.</p>
          <Link href="/login" className="mt-4 md:mt-0 text-sm font-semibold hover:underline">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  )
}
