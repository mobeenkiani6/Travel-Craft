import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Users, ArrowRight, Plane, AlertCircle } from 'lucide-react';
import { useTrip } from '../contexts/TripContext';
import { useAuth } from '../contexts/AuthContext';

const countries = [
  'United States', 'Canada', 'United Kingdom', 'France', 'Germany', 'Italy', 'Spain',
  'Japan', 'South Korea', 'China', 'India', 'Australia', 'New Zealand', 'Brazil',
  'Argentina', 'Mexico', 'Egypt', 'Morocco', 'South Africa', 'Thailand', 'Vietnam',
  'Singapore', 'Malaysia', 'Indonesia', 'Philippines', 'Turkey', 'Greece', 'Portugal',
  'Netherlands', 'Switzerland', 'Austria', 'Norway', 'Sweden', 'Denmark', 'Finland',
  'Russia', 'Ukraine', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria',
  'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Myanmar', 'Cambodia', 'Laos'
];

const budgetOptions = [
  {
    id: 'cheap',
    title: 'Budget',
    subtitle: 'Stay conscious of costs',
    icon: '💵',
    color: 'from-green-400 to-green-600'
  },
  {
    id: 'moderate',
    title: 'Moderate',
    subtitle: 'Keep cost on the average side',
    icon: '💰',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'luxury',
    title: 'Luxury',
    subtitle: "Don't worry about cost",
    icon: '💎',
    color: 'from-purple-400 to-pink-600'
  }
];

const travelerOptions = [
  {
    id: 'solo',
    title: 'Just Me',
    subtitle: 'A sole traveler in exploration',
    icon: '✈️'
  },
  {
    id: 'couple',
    title: 'A Couple',
    subtitle: 'Two travelers in tandem',
    icon: '👫'
  },
  {
    id: 'family',
    title: 'Family',
    subtitle: 'A group of fun loving adventurers',
    icon: '🏠'
  }
];

const PlanTrip = () => {
  const [formData, setFormData] = useState({
    destination: '',
    days: '',
    budget: '',
    travelers: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [formError, setFormError] = useState('');
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  
  const navigate = useNavigate();
  const { generateTrip, setCurrentTrip, addTrip } = useTrip();
  const { 
    user, 
    loading: authLoading, 
    authError, 
    sessionActive, 
    isAuthenticated, 
    updateActivity,
    clearError 
  } = useAuth();

  // Clear errors when component mounts or user changes
  useEffect(() => {
    setFormError('');
    setShowAuthPrompt(false);
    if (authError) {
      clearError();
    }
  }, [user, clearError, authError]);

  // Update activity when user interacts with form
  const handleActivityUpdate = () => {
    if (isAuthenticated()) {
      updateActivity();
    }
  };

  const validateForm = () => {
    if (!formData.destination) {
      setFormError('Please select a destination');
      return false;
    }
    if (!formData.days || parseInt(formData.days) < 1 || parseInt(formData.days) > 30) {
      setFormError('Please enter a valid number of days (1-30)');
      return false;
    }
    if (!formData.budget) {
      setFormError('Please select your budget preference');
      return false;
    }
    if (!formData.travelers) {
      setFormError('Please select who you\'re traveling with');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Check authentication status
    if (!isAuthenticated() || !sessionActive) {
      setShowAuthPrompt(true);
      setFormError('Please sign in to plan your trip. Your session may have expired.');
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsGenerating(true);
    
    try {
      // Update activity before generating trip
      updateActivity();
      
      // Simulate API call delay - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const trip = generateTrip(
        formData.destination,
        parseInt(formData.days),
        formData.budget,
        formData.travelers
      );
      
      setCurrentTrip(trip);
      addTrip(trip);
      navigate('/trip-plan');
    } catch (error) {
      console.error('Error generating trip:', error);
      setFormError('Failed to generate trip. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setFormError(''); // Clear error when user starts typing
    handleActivityUpdate(); // Update session activity
  };

  const handleSignInRedirect = () => {
    // Save form data to sessionStorage before redirecting
    sessionStorage.setItem('pendingTripForm', JSON.stringify(formData));
    navigate('/signin', { state: { returnTo: '/plan-trip' } });
  };

  // Restore form data if user returns from sign in
  useEffect(() => {
    const savedFormData = sessionStorage.getItem('pendingTripForm');
    if (savedFormData && isAuthenticated()) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
        sessionStorage.removeItem('pendingTripForm');
      } catch (error) {
        console.error('Error restoring form data:', error);
      }
    }
  }, [isAuthenticated]);

  // Loading state during authentication check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <Plane className="h-12 w-12 text-blue-600 mx-auto" />
          </motion.div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Trip generation loading state
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-8"
          >
            <Plane className="h-16 w-16 text-blue-600 mx-auto" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Crafting Your Perfect Trip...
          </h2>
          <p className="text-gray-600">
            Our AI is analyzing thousands of options to create your personalized itinerary
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Destination: {formData.destination} • {formData.days} days • {budgetOptions.find(b => b.id === formData.budget)?.title}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tell us your travel preferences 🏔️ 🏝️
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
          </p>
          
          {/* Authentication Status */}
          {isAuthenticated() ? (
            <div className="mt-4 text-green-600 text-sm flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Signed in as {user?.email || user?.name}
            </div>
          ) : (
            <div className="mt-4 text-amber-600 text-sm flex items-center justify-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Sign in required to save and access your trip plans
            </div>
          )}
        </motion.div>

        {/* Error Display */}
        {(formError || authError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
          >
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span>{formError || authError}</span>
            </div>
            {showAuthPrompt && (
              <button
                onClick={handleSignInRedirect}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Go to Sign In
              </button>
            )}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Destination Selection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                What is your destination of choice?
              </h2>
            </div>
            <select
              value={formData.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              required
            >
              <option value="">Select...</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Days Selection */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                How many days are you planning your trip?
              </h2>
            </div>
            <input
              type="number"
              min="1"
              max="30"
              value={formData.days}
              onChange={(e) => handleInputChange('days', e.target.value)}
              placeholder="Ex: 4"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              required
            />
          </motion.div>

          {/* Budget Selection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                What is Your Budget?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {budgetOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleInputChange('budget', option.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                    formData.budget === option.id
                      ? `border-blue-500 bg-gradient-to-r ${option.color} text-white`
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="text-3xl mb-2">{option.icon}</div>
                  <h3 className="text-xl font-semibold mb-1">{option.title}</h3>
                  <p className={`text-sm ${formData.budget === option.id ? 'text-white' : 'text-gray-600'}`}>
                    {option.subtitle}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Traveler Selection */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Who do you plan on traveling with on your next adventure?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {travelerOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleInputChange('travelers', option.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                    formData.travelers === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="text-3xl mb-2">{option.icon}</div>
                  <h3 className="text-xl font-semibold mb-1">{option.title}</h3>
                  <p className="text-sm text-gray-600">{option.subtitle}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center"
          >
            <button
              type="submit"
              disabled={!isAuthenticated() || isGenerating}
              className={`px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center gap-2 mx-auto ${
                isAuthenticated() && !isGenerating
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {!isAuthenticated() ? (
                <>Sign In Required</>
              ) : (
                <>
                  Generate My Trip Plan
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
            
            {!isAuthenticated() && (
              <button
                type="button"
                onClick={handleSignInRedirect}
                className="mt-4 text-blue-600 hover:text-blue-800 underline text-sm"
              >
                Sign in to continue
              </button>
            )}
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default PlanTrip;