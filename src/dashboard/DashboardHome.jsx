import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FiGrid, FiList, FiPlusCircle, FiHeart, FiDatabase, FiRefreshCw, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, slideUp } from '../utils/variants';

const DashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ listings: 0, requests: 0 });
  const [seeding, setSeeding] = useState(false);

  useEffect(() => { loadStats(); }, []);

  const loadStats = () => {
    Promise.all([
      api.get('/pets/my/listings'),
      api.get('/adoptions/my'),
    ]).then(([petsRes, adoptionsRes]) => {
      setStats({ listings: petsRes.data.length, requests: adoptionsRes.data.length });
    });
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const { data } = await api.post('/seed');
      toast.success(data.message);
      loadStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to seed data. Register first then try again.');
    } finally {
      setSeeding(false);
    }
  };

  const cards = [
    { label: 'My Listings', value: stats.listings, icon: FiList, gradient: 'from-blue-500 to-indigo-600', to: '/dashboard/my-listings' },
    { label: 'My Requests', value: stats.requests, icon: FiHeart, gradient: 'from-emerald-500 to-green-600', to: '/dashboard/my-requests' },
    { label: 'Add Pet', value: 'New', icon: FiPlusCircle, gradient: 'from-purple-500 to-pink-600', to: '/dashboard/add-pet' },
  ];

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name}!</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here is your dashboard overview.</p>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {cards.map((card) => (
          <motion.div key={card.label} variants={slideUp}>
            <Link to={card.to}
              className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all block group"
            >
              <div className="flex items-start justify-between mb-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <card.icon className="text-white" size={22} />
                </motion.div>
                <FiArrowRight className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" size={18} />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{card.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{card.label}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-4 mb-5">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20"
          >
            <FiDatabase className="text-white" size={20} />
          </motion.div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Sample Data</h3>
            <p className="text-sm text-gray-500">Populate the database with sample pets</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSeed}
          disabled={seeding}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          {seeding ? <><FiRefreshCw className="animate-spin" /> Adding...</> : <><FiDatabase /> Add 10 Sample Pets</>}
        </motion.button>
        <p className="text-xs text-gray-400 mt-3">Adds sample pets (dogs, cats, birds, rabbits, hamsters) with real images. Your existing pets will be replaced.</p>
      </motion.div>
    </motion.div>
  );
};

export default DashboardHome;
