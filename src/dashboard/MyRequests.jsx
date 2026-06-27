import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { FiEye, FiXCircle, FiCalendar, FiClock, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, slideUp } from '../utils/variants';

const MyRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/adoptions/my').then(({ data }) => {
      setRequests(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    try {
      await api.delete(`/adoptions/${id}`);
      toast.success('Request cancelled');
      setRequests(requests.filter((r) => r._id !== id));
    } catch {
      toast.error('Failed to cancel request');
    }
  };

  const statusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return `px-2.5 py-1 text-xs font-medium rounded-full ${styles[status] || ''}`;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold text-gray-900 dark:text-white mb-6"
      >
        My Adoption Requests
      </motion.h2>

      {requests.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
        >
          <FiHeart className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No adoption requests yet</p>
          <Link to="/pets" className="inline-block mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm">Browse Pets</Link>
        </motion.div>
      ) : (
        <div className="overflow-x-auto glass-card rounded-2xl">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pet Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Request Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pickup Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {requests.map((req, i) => (
                <motion.tr
                  key={req._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  whileHover={{ backgroundColor: 'rgba(99,102,241,0.03)' }}
                  className="transition-colors"
                >
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{req.petName}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><FiCalendar size={13} /> {new Date(req.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><FiClock size={13} /> {req.pickupDate}</span>
                  </td>
                  <td className="px-4 py-4">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.04 + 0.15, type: 'spring', stiffness: 200 }}
                      className={statusBadge(req.status)}
                    >
                      {req.status}
                    </motion.span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/pets/${req.petId}`}
                        className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title="View Pet"><FiEye size={15} /></Link>
                      {req.status === 'pending' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleCancel(req._id)}
                          className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          title="Cancel Request"><FiXCircle size={15} /></motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default MyRequests;
