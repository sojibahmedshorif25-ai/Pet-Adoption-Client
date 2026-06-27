import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiMapPin, FiClock, FiFilter, FiX, FiSliders, FiGrid } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { staggerContainer, slideUp } from '../utils/variants';

const speciesList = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish'];

const AllPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [species, setSpecies] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (species) params.set('species', species);
    params.set('status', 'available');
    api.get(`/pets?${params.toString()}`).then(({ data }) => {
      setPets(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search, species]);

  const handleAdoptClick = (petId) => {
    if (!user) { navigate('/login'); }
    else { navigate(`/pets/${petId}`); }
  };

  const clearFilters = () => { setSearch(''); setSpecies(''); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Browse Pets</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-lg">Find your perfect companion</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-5 mb-8"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by pet name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <FiSliders className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              className="input-field pl-10 min-w-[160px] appearance-none cursor-pointer"
            >
              <option value="">All Species</option>
              {speciesList.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {(search || species) && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={clearFilters}
              className="px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl flex items-center gap-1.5 transition-colors font-medium"
            >
              <FiX size={16} /> Clear
            </motion.button>
          )}
        </div>
      </motion.div>

      {loading ? (
        <LoadingSpinner />
      ) : pets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24"
        >
          <FiGrid className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 dark:text-gray-500 text-lg font-medium">No pets found matching your criteria</p>
          <button onClick={clearFilters} className="mt-4 gradient-btn px-5 py-2.5 rounded-xl text-sm font-medium">Clear Filters</button>
        </motion.div>
      ) : (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-400 dark:text-gray-500 mb-4"
          >
            Showing {pets.length} pet{pets.length !== 1 ? 's' : ''}
          </motion.p>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {pets.map((pet) => (
              <motion.div
                key={pet._id}
                variants={slideUp}
                whileHover={{ y: -6 }}
                className="glass-card rounded-2xl overflow-hidden group cursor-pointer"
                onClick={() => handleAdoptClick(pet._id)}
              >
                <div className="relative overflow-hidden h-52">
                  <motion.img
                    src={pet.image}
                    alt={pet.name}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs font-medium rounded-full text-gray-700 dark:text-gray-300 shadow-sm">
                      {pet.species}
                    </span>
                    <span className="px-3 py-1 bg-indigo-500/90 text-white text-xs font-medium rounded-full shadow-sm">
                      {pet.gender}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-black/40 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                      ${pet.adoptionFee}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{pet.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1"><FiMapPin size={14} /> {pet.location}</span>
                    <span className="flex items-center gap-1"><FiClock size={14} /> {pet.age}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/pets/${pet._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 text-center py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors text-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default AllPets;
