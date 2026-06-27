import { Link } from 'react-router-dom';
import { FiHome, FiFrown } from 'react-icons/fi';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="text-center max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
          className="text-[140px] font-black leading-none gradient-text mb-2"
        >
          404
        </motion.div>
        <motion.div
          initial={{ rotate: -20, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <FiFrown className="text-5xl text-indigo-300 dark:text-indigo-600 mx-auto mb-6" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
        >
          Page Not Found
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-500 dark:text-gray-400 mb-8"
        >
          Oops! The page you are looking for does not exist or has been moved.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            to="/"
            className="gradient-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
          >
            <FiHome size={18} /> Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
