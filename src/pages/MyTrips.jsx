import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, DollarSign, Star, Eye, Trash2, RefreshCw } from 'lucide-react';
import { useTrip } from '../contexts/TripContext';
import { useAuth } from '../contexts/AuthContext';

const MyTrips = () => {
  const { userPosts, deleteTrip, fetchUserPosts, loading, setCurrentTrip } = useTrip();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    // Fetch trips when component mounts
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const handleViewTrip = (post) => {
    try {
      // Parse the trip data from the post description
      const tripData = JSON.parse(post.description);
      setCurrentTrip(tripData);
      navigate('/trip-plan');
    } catch (error) {
      console.error('Error parsing trip data:', error);
      // Fallback: create basic trip object from post title
      const basicTrip = {
        id: post._id,
        destination: post.title.replace('Trip to ', ''),
        days: 3,
        budget: 'moderate',
        travelers: 'solo',
        createdAt: post.createdAt,
        hotels: [],
        itinerary: []
      };
      setCurrentTrip(basicTrip);
      navigate('/trip-plan');
    }
  };

  const handleDeleteTrip = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) {
      return;
    }

    try {
      setDeleting(postId);
      await deleteTrip(postId);
    } catch (error) {
      console.error('Failed to delete trip:', error);
      alert('Failed to delete trip. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const parseTrip = (post) => {
    try {
      return JSON.parse(post.description);
    } catch (error) {
      // Fallback for posts that don't have proper trip JSON
      return {
        id: post._id,
        destination: post.title.replace('Trip to ', ''),
        days: 3,
        budget: 'moderate',
        travelers: 'solo',
        createdAt: post.createdAt,
        hotels: [{
          name: 'Hotel information not available',
          image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400',
          price: 'N/A'
        }],
        itinerary: []
      };
    }
  };

  const getBudgetIcon = (budget) => {
    switch (budget) {
      case 'cheap': return '💵';
      case 'moderate': return '💰';
      case 'luxury': return '💎';
      default: return '💰';
    }
  };

  const getTravelersIcon = (travelers) => {
    switch (travelers) {
      case 'solo': return '✈️';
      case 'couple': return '👫';
      case 'family': return '🏠';
      default: return '✈️';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-8">You need to be signed in to view your trips</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            My Trips
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            All your personalized travel plans in one place
          </p>
          
          {/* Refresh Button */}
          <button
            onClick={fetchUserPosts}
            disabled={loading}
            className="mt-4 flex items-center gap-2 mx-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </motion.div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your trips...</p>
          </div>
        ) : userPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-6">✈️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No trips yet</h2>
            <p className="text-gray-600 mb-8">Start planning your dream vacation today!</p>
            <button
              onClick={() => navigate('/plan-trip')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Plan Your First Trip
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userPosts.map((post, index) => {
              const trip = parseTrip(post);
              return (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {/* Trip Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{trip.destination}</h3>
                    <p className="text-blue-100">
                      Created on {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Trip Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">{trip.days} Days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium flex items-center gap-1">
                          {getBudgetIcon(trip.budget)}
                          {trip.budget.charAt(0).toUpperCase() + trip.budget.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium flex items-center gap-1">
                          {getTravelersIcon(trip.travelers)}
                          {trip.travelers.charAt(0).toUpperCase() + trip.travelers.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{trip.hotels?.length || 0} Hotels</span>
                      </div>
                    </div>

                    {/* Hotel Preview */}
                    {trip.hotels && trip.hotels.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Top Hotel</h4>
                        <div className="flex items-center gap-3">
                          <img
                            src={trip.hotels[0]?.image}
                            alt={trip.hotels[0]?.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <div className="font-medium text-sm">{trip.hotels[0]?.name}</div>
                            <div className="text-xs text-gray-600">{trip.hotels[0]?.price}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewTrip(post)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteTrip(post._id)}
                        disabled={deleting === post._id}
                        className="flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        {deleting === post._id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Plan New Trip Button */}
        {userPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-12"
          >
            <button
              onClick={() => navigate('/plan-trip')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Plan Another Trip
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;