import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import ImageUploader from '../components/ImageUploader';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, slideUp } from '../utils/variants';

const speciesList = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Guinea Pig', 'Turtle'];

const AddPet = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', species: '', breed: '', age: '', gender: 'Male', image: '',
    healthStatus: '', vaccinationStatus: '', location: '', adoptionFee: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const update = (key, val) => setForm({ ...form, [key]: val });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ['name', 'species', 'breed', 'age', 'image', 'healthStatus', 'vaccinationStatus', 'location', 'adoptionFee', 'description'];
    for (const field of required) {
      if (!form[field]) return toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
    }
    setLoading(true);
    try {
      await api.post('/pets', { ...form, adoptionFee: Number(form.adoptionFee) });
      toast.success('Pet added successfully!');
      navigate('/dashboard/my-listings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add pet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <motion.button whileHover={{ x: -3 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 mb-4 font-medium transition-colors"
      >
        <FiArrowLeft /> Back
      </motion.button>
      <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight"
      >
        Add New Pet
      </motion.h2>

      <motion.form variants={staggerContainer} initial="hidden" animate="visible"
        onSubmit={handleSubmit}
        className="glass-card rounded-2xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div variants={slideUp}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Pet Name *</label>
            <input value={form.name} onChange={(e) => update('name', e.target.value)} className="input-field" placeholder="Max" />
          </motion.div>
          <motion.div variants={slideUp}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Species *</label>
            <select value={form.species} onChange={(e) => update('species', e.target.value)} className="input-field">
              <option value="">Select species</option>
              {speciesList.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </motion.div>
          <motion.div variants={slideUp}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Breed *</label>
            <input value={form.breed} onChange={(e) => update('breed', e.target.value)} className="input-field" placeholder="Golden Retriever" />
          </motion.div>
          <motion.div variants={slideUp}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Age *</label>
            <input value={form.age} onChange={(e) => update('age', e.target.value)} className="input-field" placeholder="2 years" />
          </motion.div>
          <motion.div variants={slideUp}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gender *</label>
            <select value={form.gender} onChange={(e) => update('gender', e.target.value)} className="input-field">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </motion.div>
          <motion.div variants={slideUp} className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Image *</label>
            <ImageUploader onUpload={(url) => update('image', url)} currentUrl={form.image} />
          </motion.div>
          <motion.div variants={slideUp}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Health Status *</label>
            <input value={form.healthStatus} onChange={(e) => update('healthStatus', e.target.value)} className="input-field" placeholder="Vaccinated, Healthy" />
          </motion.div>
          <motion.div variants={slideUp}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Vaccination Status *</label>
            <input value={form.vaccinationStatus} onChange={(e) => update('vaccinationStatus', e.target.value)} className="input-field" placeholder="Fully vaccinated" />
          </motion.div>
          <motion.div variants={slideUp}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Location *</label>
            <input value={form.location} onChange={(e) => update('location', e.target.value)} className="input-field" placeholder="New York, NY" />
          </motion.div>
          <motion.div variants={slideUp}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Adoption Fee * ($)</label>
            <input type="number" value={form.adoptionFee} onChange={(e) => update('adoptionFee', e.target.value)} className="input-field" placeholder="50" />
          </motion.div>
          <motion.div variants={slideUp} className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Owner Email</label>
            <input value={user?.email || ''} readOnly className="input-field text-gray-400" />
          </motion.div>
          <motion.div variants={slideUp} className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description *</label>
            <textarea rows={4} value={form.description} onChange={(e) => update('description', e.target.value)}
              className="input-field resize-none" placeholder="Tell us about this pet personality, habits, and why someone should adopt them..." />
          </motion.div>
        </div>

        <motion.button type="submit" disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="mt-6 px-8 py-3 gradient-btn rounded-xl font-semibold flex items-center gap-2">
          <FiSave /> {loading ? 'Adding Pet...' : 'Add Pet'}
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default AddPet;
