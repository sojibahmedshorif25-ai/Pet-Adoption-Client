import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiList, FiPlusCircle, FiGrid, FiHeart } from 'react-icons/fi';
import { fadeIn } from '../utils/variants';

const navItems = [
  { to: '/dashboard', icon: FiGrid, label: 'Overview', end: true },
  { to: '/dashboard/my-listings', icon: FiList, label: 'My Listings' },
  { to: '/dashboard/add-pet', icon: FiPlusCircle, label: 'Add Pet' },
  { to: '/dashboard/my-requests', icon: FiHeart, label: 'My Requests' },
];

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight"
        >
          Dashboard
        </motion.h1>
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-56 shrink-0">
            <motion.nav
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-2"
            >
              {navItems.map(({ to, icon: Icon, label, end }) => (
                <motion.div key={to} whileHover={{ x: 3 }} transition={{ duration: 0.15 }}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 shadow-sm'
                          : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-gray-700/50'
                      }`
                    }
                  >
                    <Icon size={18} /> {label}
                  </NavLink>
                </motion.div>
              ))}
            </motion.nav>
          </aside>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="flex-1 min-w-0"
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
