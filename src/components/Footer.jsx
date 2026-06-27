import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiHeart, FiGithub, FiTwitter, FiLinkedin, FiArrowUp } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '../utils/variants';

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 relative">
      <motion.button
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={scrollToTop}
        className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 cursor-pointer"
      >
        <FiArrowUp className="text-white" size={18} />
      </motion.button>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          <motion.div variants={fadeUp} custom={0}>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiHeart className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-white">PetAdopt</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              Connecting loving families with pets in need of a forever home. Every pet deserves a second chance at happiness.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} custom={1}>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/pets', label: 'All Pets' },
                { to: '/login', label: 'Login' },
                { to: '/register', label: 'Register' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center gap-2">
                    <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div variants={fadeUp} custom={2}>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-center gap-3 text-gray-400">
                <span className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                  <FiMail className="text-indigo-400" size={14} />
                </span>
                contact@petadopt.com
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <span className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                  <FiPhone className="text-indigo-400" size={14} />
                </span>
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <span className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                  <FiMapPin className="text-indigo-400" size={14} />
                </span>
                123 Pet Street, New York, NY
              </li>
            </ul>
            <div className="flex gap-2.5 mt-6">
              {[
                { icon: FiGithub, href: '#' },
                { icon: FiTwitter, href: '#' },
                { icon: FiLinkedin, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 bg-gray-800 hover:bg-indigo-600 rounded-xl flex items-center justify-center transition-colors duration-200"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500"
        >
          <p>&copy; {new Date().getFullYear()} PetAdopt. All rights reserved. Made with <FiHeart className="inline text-red-400" size={13} /> for pets.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
