import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { FiMapPin, FiClock, FiDollarSign, FiHeart, FiShield, FiActivity, FiX, FiSend, FiCalendar, FiMessageSquare, FiUser, FiMail, FiChevronLeft, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, slideUp, modalBackdrop, modalCard } from '../utils/variants';

const PetDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ pickupDate: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/pets/${id}`).then(({ data }) => {
      setPet(data);
      setLoading(false);
    }).catch(() => {
      toast.error('Pet not found');
      navigate('/pets');
    });
  }, [id, navigate]);

  const handleAdopt = () => {
    if (!user) return navigate('/login');
    if (user.email === pet.ownerEmail) {
      return toast.error('You cannot adopt your own pet');
    }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pickupDate) return toast.error('Please select a pickup date');
    setSubmitting(true);
    try {
      await api.post('/adoptions', { petId: id, ...form });
      toast.success('Adoption request submitted successfully!');
      setShowForm(false);
      setForm({ pickupDate: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!pet) return null;

  const infoItems = [
    { label: 'Species', value: pet.species },
    { label: 'Breed', value: pet.breed },
    { label: 'Age', value: pet.age, icon: FiClock },
    { label: 'Gender', value: pet.gender },
    { label: 'Health', value: pet.healthStatus, icon: FiActivity },
    { label: 'Vaccination', value: pet.vaccinationStatus, icon: FiShield },
    { label: 'Location', value: pet.location, icon: FiMapPin },
    { label: 'Fee', value: `$${pet.adoptionFee}`, icon: FiDollarSign },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Link to="/pets" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors font-medium">
          <FiChevronLeft size={16} /> Back to All Pets
        </Link>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-3"
        >
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="relative h-[400px] lg:h-[500px] overflow-hidden">
              <motion.img
                src={pet.image}
                alt={pet.name}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{pet.name}</h1>
                <p className="text-white/70 text-lg">{pet.species} • {pet.breed}</p>
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium text-white shadow-lg backdrop-blur-sm ${pet.status === 'available' ? 'bg-emerald-500/90' : 'bg-gray-500/90'}`}>
                  {pet.status === 'available' ? 'Available for Adoption' : 'Adopted'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Details</h2>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                className="text-3xl font-bold text-indigo-600 dark:text-indigo-400"
              >
                ${pet.adoptionFee}
              </motion.span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              {pet.description}
            </p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-2 gap-3"
            >
              {infoItems.map((item) => (
                <motion.div
                  key={item.label}
                  variants={slideUp}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3"
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 font-medium">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-2xl p-6"
          >
            {pet.status === 'available' ? (
              <>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-4">
                  <FiCheckCircle size={18} />
                  <span className="font-semibold text-sm">Available for adoption</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAdopt}
                  className="w-full py-3.5 gradient-btn rounded-xl font-semibold flex items-center justify-center gap-2 text-base"
                >
                  <FiHeart size={20} /> Adopt Now
                </motion.button>
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4 font-medium text-sm">
                This pet has been adopted
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            key="adoption-modal"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              variants={modalCard}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <FiHeart className="text-white" size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Adoption Request</h2>
                    <p className="text-xs text-gray-500">for {pet.name}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
                >
                  <FiX size={18} className="text-gray-500" />
                </motion.button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Pet Name</label>
                    <div className="px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {pet.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Adoption Fee</label>
                    <div className="px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-600 dark:text-gray-400 font-medium">
                      ${pet.adoptionFee}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                    <FiUser className="inline mr-1" size={12} /> Your Name
                  </label>
                  <input value={user?.name || ''} readOnly className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                    <FiMail className="inline mr-1" size={12} /> Your Email
                  </label>
                  <input value={user?.email || ''} readOnly className="input-field" />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                    <FiCalendar className="inline mr-1" size={12} /> Pickup Date *
                  </label>
                  <input type="date" value={form.pickupDate} onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
                    className="input-field" required />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                    <FiMessageSquare className="inline mr-1" size={12} /> Message
                  </label>
                  <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us why you'd like to adopt this pet..."
                    className="input-field resize-none" />
                </motion.div>
                <motion.button type="submit" disabled={submitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3 gradient-btn rounded-xl font-semibold flex items-center justify-center gap-2 mt-2">
                  {submitting ? 'Submitting...' : <><FiSend size={16} /> Submit Request</>}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PetDetails;
