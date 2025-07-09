import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plane, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSession } from '../contexts/SessionContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const location = useLocation();
  const navigate = useNavigate();

  const { 
    user, 
    loading, 
    authError, 
    signin, 
    signup, 
    logout, 
    isAuthenticated,
    clearError,
    updateActivity 
  } = useAuth();
  
  const { sessionActive } = useSession();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Plan Trip', path: '/plan-trip' },
    { name: 'MyTrips', path: '/my-trips' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  // Update activity when user interacts with navbar
  const handleUserInteraction = () => {
    updateActivity();
  };

  // Handle form submission for auth modal
  const handleSubmit = async (e) => {
    e.preventDefault();
    handleUserInteraction();
    clearError();

    if (authMode === 'signin') {
      const result = await signin(formData.email, formData.password);
      if (result.success) {
        setIsAuthModalOpen(false);
        setFormData({ email: '', password: '', name: '', confirmPassword: '' });
      }
    } else {
      // Registration validation
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      
      const result = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        setIsAuthModalOpen(false);
        setFormData({ email: '', password: '', name: '', confirmPassword: '' });
      }
    }
  };

  // Handle logout with session management
  const handleLogout = async () => {
    handleUserInteraction();
    const result = await logout();
    if (result.success) {
      setShowUserMenu(false);
      navigate('/');
    }
  };

  // Handle input changes for auth form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Switch between login and register modes
  const switchAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
    clearError();
    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
  };

  // Show session status (for debugging - remove in production)
  const getSessionStatus = () => {
    if (loading) return 'Loading...';
    if (sessionActive && isAuthenticated()) return 'Active Session';
    if (sessionActive && !user) return 'Session Active, No User';
    if (!sessionActive && user) return 'No Session, User Present';
    return 'No Session';
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 backdrop-blur-lg bg-opacity-90 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-white font-bold text-xl"
              onClick={handleUserInteraction}
            >
              <Plane className="h-8 w-8" />
              <span>Travel Craft</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                // Only show MyTrips if user is authenticated
                if (item.name === 'MyTrips' && !isAuthenticated()) {
                  return null;
                }
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={handleUserInteraction}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-white bg-opacity-20 text-white'
                        : 'text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated() ? (
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      handleUserInteraction();
                    }}
                    className="flex items-center space-x-2 text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-md transition-all duration-200"
                  >
                    <User className="h-5 w-5" />
                    <span>{user?.name || user?.email}</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left disabled:opacity-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{loading ? 'Logging out...' : 'Logout'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setAuthMode('signin');
                    handleUserInteraction();
                  }}
                  className="bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-all duration-200 shadow-md"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                  handleUserInteraction();
                }}
                className="text-white p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white bg-opacity-10 backdrop-blur-lg rounded-lg mt-2 mb-4">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => {
                  // Only show MyTrips if user is authenticated
                  if (item.name === 'MyTrips' && !isAuthenticated()) {
                    return null;
                  }
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleUserInteraction();
                      }}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-white bg-opacity-20 text-white'
                          : 'text-white hover:bg-white hover:bg-opacity-10'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
                
                {/* Mobile Auth Section */}
                {!isAuthenticated() && (
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setAuthMode('login');
                      setIsMenuOpen(false);
                      handleUserInteraction();
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:bg-opacity-10"
                  >
                    Sign In
                  </button>
                )}
                {isAuthenticated() && (
                  <div className="px-3 py-2">
                    <p className="text-white text-sm mb-2">
                      Welcome, {user?.name || user?.email}
                    </p>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      disabled={loading}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Logging out...' : 'Logout'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Enhanced Auth Modal with Session Management */}
      {isAuthModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAuthModalOpen(false);
              clearError();
            }
          }}
        >
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {authMode === 'signin' ? 'Login to Travel Craft' : 'Join Travel Craft'}
            </h2>
            
            {authError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {authError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 hover:from-blue-700 hover:via-purple-700 hover:to-teal-700 text-white py-2 px-4 rounded-md font-medium transition-all duration-200 disabled:opacity-50"
              >
                {loading 
                  ? (authMode === 'signin' ? 'Logging in...' : 'Signing up...')
                  : (authMode === 'signup' ? 'Sign Up' : 'Sign In')
                }
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={switchAuthMode}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {authMode === 'signin' 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Login"
                }
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsAuthModalOpen(false);
                  clearError();
                }}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Cancel
              </button>
            </div>

            {/* Debug info - remove in production */}
            <div className="mt-4 text-xs text-gray-500 text-center">
              Session: {getSessionStatus()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;