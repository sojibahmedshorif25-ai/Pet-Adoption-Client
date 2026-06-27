import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiEye, FiUsers, FiX, FiCheck, FiXCircle, FiMessageSquare, FiCalendar, FiHeart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUploader from '../components/ImageUploader';
import { pageTransition, staggerContainer, slideUp, modalBackdrop, modalCard } from '../utils/variants';

const MyListings = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState(null);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = () => {
    api.get('/pets/my/listings').then(({ data }) => {
      setPets(data);
      setLoading(false);
    });
  };

  const openRequests = async (pet) => {
    setSelectedPet(pet);
    setRequestsLoading(true);
    try {
      const { data } = await api.get(`/adoptions/pet/${pet._id}`);
      setRequests(data);
    } catch {
      toast.error('Failed to load requests');
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleApprove = async (reqId) => {
    try {
      await api.put(`/adoptions/${reqId}/status`, { status: 'approved' });
      toast.success('Request approved!');
      openRequests(selectedPet);
      loadPets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async (reqId) => {
    try {
      await api.put(`/adoptions/${reqId}/reject`);
      toast.success('Request rejected');
      openRequests(selectedPet);
    } catch {
      toast.error('Failed to reject');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/pets/${deleteModal._id}`);
      toast.success('Pet deleted successfully');
      setDeleteModal(null);
      loadPets();
    } catch {
      toast.error('Failed to delete pet');
    }
  };

  const openEdit = (pet) => {
    setEditForm({ ...pet });
    setEditModal(pet);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { name, species, breed, age, gender, image, healthStatus, vaccinationStatus, location, adoptionFee, description } = editForm;
      await api.put(`/pets/${editModal._id}`, {
        name, species, breed, age, gender, image, healthStatus, vaccinationStatus, location,
        adoptionFee: Number(adoptionFee), description,
      });
      toast.success('Pet updated successfully!');
      setEditModal(null);
      loadPets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const available = pets.filter(p => p.status === 'available').length;
  const adopted = pets.filter(p => p.status === 'adopted').length;

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
        className="text-xl font-bold text-gray-900 dark:text-white mb-4"
      >
        My Listings
      </motion.h2>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex gap-4 mb-6"
      >
        {[
          { label: 'Total Listings', value: pets.length, color: 'text-gray-900 dark:text-white' },
          { label: 'Available', value: available, color: 'text-green-600' },
          { label: 'Adopted', value: adopted, color: 'text-blue-600' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={slideUp}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-5 py-3 flex-1"
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {pets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
        >
          <FiHeart className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No listings yet</p>
          <Link to="/dashboard/add-pet" className="inline-block mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm">Add Your First Pet</Link>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {pets.map((pet) => (
            <motion.div
              key={pet._id}
              variants={slideUp}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex"
            >
              <img src={pet.image} alt={pet.name} className="w-28 h-28 object-cover shrink-0" />
              <div className="p-4 flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{pet.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pet.status === 'available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                    {pet.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">${pet.adoptionFee} • {pet.species}</p>
                <div className="flex gap-1.5 mt-2">
                  <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                    onClick={() => openRequests(pet)} className="p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg hover:bg-blue-100 text-xs flex items-center gap-1"
                    title="Requests"><FiUsers size={13} /></motion.button>
                  <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                    onClick={() => openEdit(pet)} className="p-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-lg hover:bg-amber-100 text-xs"
                    title="Edit"><FiEdit2 size={13} /></motion.button>
                  <Link to={`/pets/${pet._id}`} className="p-1.5 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 text-xs"
                    title="View"><FiEye size={13} /></Link>
                  <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setDeleteModal(pet)} className="p-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 rounded-lg hover:bg-red-100 text-xs"
                    title="Delete"><FiTrash2 size={13} /></motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {selectedPet && (
          <motion.div
            key="requests-modal"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              variants={modalCard}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Requests for {selectedPet.name}
                </h3>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  onClick={() => setSelectedPet(null)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <FiX size={20} className="text-gray-500" />
                </motion.button>
              </div>
              <div className="p-5">
                {requestsLoading ? (
                  <LoadingSpinner />
                ) : requests.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No requests yet</p>
                ) : (
                  <div className="space-y-4">
                    {requests.map((req) => (
                      <motion.div
                        key={req._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{req.userName}</p>
                            <p className="text-xs text-gray-500">{req.userEmail}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            req.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            req.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>{req.status}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1"><FiCalendar size={12} /> Pickup: {req.pickupDate}</span>
                          {req.message && <span className="flex items-center gap-1"><FiMessageSquare size={12} /> {req.message}</span>}
                        </div>
                        {req.status === 'pending' && (
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleApprove(req._id)}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg flex items-center gap-1">
                              <FiCheck size={14} /> Approve
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleReject(req._id)}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg flex items-center gap-1">
                              <FiXCircle size={14} /> Reject
                            </motion.button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editModal && (
          <motion.div
            key="edit-modal"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 bg-black/50 overflow-y-auto backdrop-blur-sm"
          >
            <motion.div
              variants={modalCard}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Update {editModal.name}</h3>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  onClick={() => setEditModal(null)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <FiX size={20} className="text-gray-500" />
                </motion.button>
              </div>
              <form onSubmit={handleUpdate} className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['name', 'species', 'breed', 'age', 'healthStatus', 'vaccinationStatus', 'location'].map((field, i) => (
                    <motion.div
                      key={field}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                      <input value={editForm[field] || ''} onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                    </motion.div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image</label>
                    <ImageUploader onUpload={(url) => setEditForm({ ...editForm, image: url })} currentUrl={editForm.image} />
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                    <select value={editForm.gender} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adoption Fee ($)</label>
                    <input type="number" value={editForm.adoptionFee} onChange={(e) => setEditForm({ ...editForm, adoptionFee: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </motion.div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea rows={3} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" disabled={saving}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-xl transition-colors">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                  <button type="button" onClick={() => setEditModal(null)}
                    className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteModal && (
          <motion.div
            key="delete-modal"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              variants={modalCard}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Pet</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Are you sure you want to delete <strong>{deleteModal.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl text-sm">
                  Delete
                </motion.button>
                <button onClick={() => setDeleteModal(null)} className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl text-sm">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyListings;
