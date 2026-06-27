import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiUser, FiImage, FiEye, FiEyeOff, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { pageTransition } from '../utils/variants';

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', photoURL: '', password: '', confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain one lowercase letter';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, photoURL, password, confirmPassword } = form;
    if (!name || !email || !password || !confirmPassword) {
      return toast.error('Please fill in all required fields');
    }
    const pwError = validatePassword(password);
    if (pwError) return toast.error(pwError);
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await register({ name, email, photoURL, password });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const update = (key, val) => setForm({ ...form, [key]: val });

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/20"
          >
            <FiHeart className="text-3xl text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Join our pet adoption community</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Name *', key: 'name', icon: FiUser, placeholder: 'John Doe', delay: 0.35 },
              { label: 'Email *', key: 'email', icon: FiMail, placeholder: 'you@example.com', delay: 0.38 },
              { label: 'Photo URL', key: 'photoURL', icon: FiImage, placeholder: 'https://example.com/photo.jpg', delay: 0.41 },
            ].map(({ label, key, icon: Icon, placeholder, delay }) => (
              <motion.div key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type={key === 'email' ? 'email' : key === 'photoURL' ? 'url' : 'text'}
                    placeholder={placeholder} value={form[key]}
                    onChange={(e) => update(key, e.target.value)}
                    className="input-field pl-10" />
                </div>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.44 }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password *</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type={showPassword ? 'text' : 'password'} placeholder="Min 6 chars, uppercase & lowercase"
                  value={form.password} onChange={(e) => update('password', e.target.value)}
                  className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.47 }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password *</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type={showPassword ? 'text' : 'password'} placeholder="Repeat your password"
                  value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)}
                  className="input-field pl-10" />
              </div>
            </motion.div>
            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full py-3 gradient-btn rounded-xl font-semibold"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </form>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400"
          >
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Sign In
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Register;
