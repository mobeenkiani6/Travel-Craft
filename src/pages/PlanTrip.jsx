import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Users, ArrowRight, Plane } from 'lucide-react';
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
  const navigate = useNavigate();
  const { generateTrip, setCurrentTrip, addTrip } = useTrip();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please sign in to plan your trip');
      return;
    }

    if (!formData.destination || !formData.days || !formData.budget || !formData.travelers) {
      alert('Please fill in all fields');
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const trip = generateTrip(
        formData.destination,
        parseInt(formData.days),
        formData.budget,
        formData.travelers
      );
      
      setCurrentTrip(trip);
      addTrip(trip);
      setIsGenerating(false);
      navigate('/trip-plan');
    }, 2000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
        </motion.div>

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
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-full font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center gap-2 mx-auto"
            >
              Generate My Trip Plan
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default PlanTrip;