import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiHeart, FiShield, FiUsers, FiArrowRight, FiMapPin, FiClock, FiDroplet, FiStar, FiChevronRight } from 'react-icons/fi';
import { motion, useInView } from 'framer-motion';
import { slideUp, fadeIn, staggerContainer } from '../utils/variants';

const FloatingShape = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full opacity-20 ${className}`}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay, duration: 1.5, ease: 'easeOut' }}
    style={{
      animation: `float ${6 + delay}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }}
  />
);

const AnimatedCounter = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 30;
    const increment = parseInt(value.replace(/\D/g, '')) / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= parseInt(value.replace(/\D/g, ''))) {
        setCount(parseInt(value.replace(/\D/g, '')));
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const Home = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/pets?status=available').then(({ data }) => {
      setPets(data.slice(0, 6));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleAdoptClick = () => {
    if (!user) { navigate('/login'); }
    else { navigate('/pets'); }
  };

  return (
    <div>
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-20" />
        <FloatingShape className="w-64 h-64 bg-pink-300 -top-20 -left-20" delay={0} />
        <FloatingShape className="w-48 h-48 bg-yellow-300 top-1/3 -right-10" delay={1.5} />
        <FloatingShape className="w-36 h-36 bg-indigo-300 bottom-1/4 left-1/4" delay={3} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/10"
                >
                  <FiStar className="text-yellow-300" size={14} />
                  Trusted by 2,100+ families
                </motion.span>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6">
                  Find Your{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-300 to-orange-300">
                    Perfect Companion
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 max-w-lg">
                  Give a loving home to a pet in need. Browse hundreds of adorable dogs, cats, and more waiting for their forever family.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAdoptClick}
                  className="px-8 py-3.5 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-2xl flex items-center gap-2 group"
                >
                  <FiHeart className="group-hover:scale-110 transition-transform" /> Adopt Now <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <Link
                  to="/pets"
                  className="px-8 py-3.5 bg-white/5 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                >
                  Browse Pets
                </Link>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-[40px] backdrop-blur-sm border border-white/10" />
                <div className="absolute inset-4 bg-gradient-to-br from-yellow-300/20 to-pink-300/20 rounded-[32px]" />
                <div className="absolute inset-8 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-center"
                  >
                    <FiHeart className="text-7xl text-white/80 mx-auto mb-4" />
                    <p className="text-2xl font-bold">Adopt Love</p>
                    <p className="text-white/60 text-sm">Give a pet a forever home</p>
                  </motion.div>
                </div>
                {['top-0 right-0', 'bottom-0 left-0', 'top-1/2 -left-4'].map((pos, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    transition={{ delay: 1 + i * 0.3, type: 'spring' }}
                    className={`absolute w-4 h-4 bg-yellow-300 rounded-full ${pos}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 dark:from-gray-900" />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {[
            { icon: FiHeart, label: 'Pets Rescued', value: '2,500+', gradient: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/20' },
            { icon: FiUsers, label: 'Happy Families', value: '2,100+', gradient: 'from-emerald-500 to-green-600', shadow: 'shadow-emerald-500/20' },
            { icon: FiShield, label: 'Years of Trust', value: '12+', gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={slideUp}
              custom={i}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="glass-card rounded-2xl p-6 flex items-center gap-4 group cursor-default"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.7 }}
                className={`p-3.5 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg ${stat.shadow} shrink-0`}
              >
                <stat.icon className="text-xl text-white" />
              </motion.div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.span variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium mb-4">
            <FiStar size={14} /> Meet Our Pets
          </motion.span>
          <motion.h2 variants={slideUp} custom={0} className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Featured Pets
          </motion.h2>
          <motion.p variants={slideUp} custom={1} className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg">
            These adorable companions are looking for their forever homes. Could you be the one?
          </motion.p>
        </motion.div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {pets.map((pet, i) => (
              <motion.div
                key={pet._id}
                variants={slideUp}
                custom={i}
                whileHover={{ y: -8 }}
                className="glass-card rounded-2xl overflow-hidden group cursor-pointer"
              >
                <div className="relative overflow-hidden h-56">
                  <motion.img
                    src={pet.image}
                    alt={pet.name}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs font-medium rounded-full text-gray-700 dark:text-gray-300 shadow-sm">
                      {pet.species}
                    </span>
                    <span className="px-3 py-1 bg-indigo-500/90 text-white text-xs font-medium rounded-full shadow-sm">
                      {pet.gender}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-sm font-bold rounded-full">
                      ${pet.adoptionFee}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{pet.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <FiClock size={12} /> {pet.age}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <FiMapPin size={14} className="shrink-0" />
                    <span className="truncate">{pet.location}</span>
                  </div>
                  <Link
                    to={`/pets/${pet._id}`}
                    className="group/btn inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    View Details <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/pets"
            className="gradient-btn inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold"
          >
            View All Pets <FiArrowRight />
          </Link>
        </motion.div>
      </section>

      <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.span variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-medium mb-4">
              <FiHeart size={14} /> Why Choose Us
            </motion.span>
            <motion.h2 variants={slideUp} custom={0} className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Why Adopt a Pet?
            </motion.h2>
            <motion.p variants={slideUp} custom={1} className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg">
              Adoption is the first step to giving a loving home to an animal in need.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: FiHeart, title: 'Save a Life', desc: 'Give a second chance to a pet in need of a loving home.', gradient: 'from-rose-500 to-pink-500' },
              { icon: FiUsers, title: 'Reduce Loneliness', desc: 'Pets provide unconditional love and emotional support.', gradient: 'from-blue-500 to-indigo-500' },
              { icon: FiShield, title: 'Fight Puppy Mills', desc: 'Adoption reduces demand for unethical breeding practices.', gradient: 'from-emerald-500 to-green-500' },
              { icon: FiDroplet, title: 'Health Benefits', desc: 'Pets lower stress, blood pressure, and improve wellbeing.', gradient: 'from-purple-500 to-pink-500' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={slideUp}
                custom={i}
                whileHover={{ y: -6 }}
                className="glass-card rounded-2xl p-8 text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.12, rotate: 5 }}
                  className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  <item.icon className="text-2xl text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.span variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-sm font-medium mb-4">
              <FiQuote size={14} /> Happy Families
            </motion.span>
            <motion.h2 variants={slideUp} custom={0} className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Success Stories
            </motion.h2>
            <motion.p variants={slideUp} custom={1} className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg">
              Heartwarming stories of pets and their new families.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { name: 'The Johnson Family', pet: 'Max', text: 'Adopting Max was the best decision we ever made. He brought so much joy to our home!', img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400' },
              { name: 'Sarah & Whiskers', pet: 'Whiskers', text: 'Whiskers was shy at first but now she is the queen of the house. We love her dearly.', img: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400' },
              { name: 'The Parkers', pet: 'Coco', text: 'Coco is the most energetic bunny we have ever met. She fits perfectly into our family.', img: 'https://images.unsplash.com/photo-1535241749838-299277b6305f?w=400' },
            ].map((story, i) => (
              <motion.div
                key={story.name}
                variants={slideUp}
                custom={i}
                whileHover={{ y: -6 }}
                className="glass-card rounded-2xl overflow-hidden group"
              >
                <div className="relative overflow-hidden h-52">
                  <motion.img
                    src={story.img}
                    alt={story.pet}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-6">
                  <FiStar className="text-indigo-200 dark:text-indigo-800 text-3xl mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-5 italic">
                    "{story.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {story.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{story.name}</p>
                      <p className="text-xs text-gray-500 font-medium">Adopted {story.pet}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzEuNjU3IDAgMy0xLjM0MyAzLTNzLTEuMzQzLTMtMy0zLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzem0wIDM2YzEuNjU3IDAgMy0xLjM0MyAzLTNzLTEuMzQzLTMtMy0zLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzem0tMTgtMThjMS42NTcgMCAzLTEuMzQzIDMtM3MtMS4zNDMtMy0zLTMtMyAxLjM0My0zIDMgMS4zNDMgMyAzIDN6bTM2IDBjMS42NTcgMCAzLTEuMzQzIDMtM3MtMS4zNDMtMy0zLTMtMyAxLjM0My0zIDMgMS4zNDMgMyAzIDN6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <FloatingShape className="w-72 h-72 bg-white/10 -top-20 -right-20" delay={0} />
        <FloatingShape className="w-48 h-48 bg-white/10 -bottom-10 -left-10" delay={2} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
            >
              Ready to Meet Your New Best Friend?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/70 mb-10 max-w-lg mx-auto text-lg"
            >
              Start your adoption journey today and give a loving home to a pet in need.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdoptClick}
              className="px-10 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-2xl inline-flex items-center gap-2 group text-lg"
            >
              <FiHeart className="group-hover:scale-110 transition-transform" /> Get Started <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.span variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
              <FiStar size={14} /> Expert Advice
            </motion.span>
            <motion.h2 variants={slideUp} custom={0} className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Pet Care Tips
            </motion.h2>
            <motion.p variants={slideUp} custom={1} className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg">
              Essential advice for new and experienced pet owners.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { title: 'Nutrition Matters', desc: 'Provide a balanced diet with high-quality pet food appropriate for your pet age, size, and health needs.', icon: '🍎', gradient: 'from-green-400 to-emerald-500' },
              { title: 'Regular Exercise', desc: 'Keep your pet active with daily walks, playtime, and mental stimulation to maintain a healthy weight.', icon: '🏃', gradient: 'from-blue-400 to-indigo-500' },
              { title: 'Vet Checkups', desc: 'Schedule regular veterinary visits for vaccinations, dental care, and early detection of health issues.', icon: '🏥', gradient: 'from-purple-400 to-pink-500' },
            ].map((tip, i) => (
              <motion.div
                key={tip.title}
                variants={slideUp}
                custom={i}
                whileHover={{ y: -6 }}
                className="glass-card rounded-2xl p-8 group"
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  className={`w-16 h-16 bg-gradient-to-br ${tip.gradient} rounded-2xl flex items-center justify-center mb-5 text-3xl shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  {tip.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{tip.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{tip.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
