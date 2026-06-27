import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';

const LoadingSpinner = ({ fullScreen = false }) => {
  const container = fullScreen
    ? 'min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'
    : 'flex items-center justify-center py-20';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={container}
    >
      <div className="text-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30"
        >
          <FiHeart className="text-white text-xl" />
        </motion.div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-gray-500 dark:text-gray-400 text-sm font-medium"
        >
          Loading...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingSpinner;
