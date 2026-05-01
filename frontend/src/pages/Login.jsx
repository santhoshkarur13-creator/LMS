import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', address: ''
  });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    
    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:5000/api/auth/login', { 
          email: formData.email, 
          password: formData.password 
        });
        login(res.data.token, res.data.user);
        navigate(res.data.user.role === 'admin' ? '/admin' : '/catalog');
      } else {
        const res = await axios.post('http://localhost:5000/api/auth/register', formData);
        setMsg(`Registration successful! Your Membership No: ${res.data.membership_no}`);
        setIsLogin(true);
        setFormData({ ...formData, password: '' }); // keep email for easy login
      }
    } catch (err) {
      setError(err.response?.data?.message || (isLogin ? 'Login failed' : 'Registration failed'));
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-box glass-panel">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--primary-color)', padding: '1rem', borderRadius: '50%', boxShadow: '0 4px 20px rgba(59,130,246,0.5)' }}>
            <BookOpen size={40} color="white" />
          </div>
        </div>
        <h1 className="auth-title" style={{ marginBottom: '1rem' }}>
          {isLogin ? 'Welcome Back' : 'Become a Member'}
        </h1>
        
        {error && <div style={{ color: 'var(--error-color)', marginBottom: '1rem', textAlign: 'center', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>{error}</div>}
        {msg && <div style={{ color: 'var(--success-color)', marginBottom: '1rem', textAlign: 'center', padding: '0.5rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>{msg}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
          )}
          
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="admin@library.com" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="admin123" />
          </div>

          {!isLogin && (
            <>
              <div className="input-group">
                <label>Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already a member? "}
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(''); setMsg(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600, fontSize: '1rem', fontFamily: 'inherit' }}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
