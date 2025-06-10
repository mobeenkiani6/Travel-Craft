import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Star, 
  Download, 
  Clock,
  ArrowLeft,
  Plane
} from 'lucide-react';
import { useTrip } from '../contexts/TripContext';

const TripPlan = () => {
  const { currentTrip } = useTrip();
  const navigate = useNavigate();

  if (!currentTrip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Trip Plan Found</h2>
          <p className="text-gray-600 mb-8">Please create a trip plan first</p>
          <button
            onClick={() => navigate('/plan-trip')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Plan a Trip
          </button>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    const tripData = JSON.stringify(currentTrip, null, 2);
    const blob = new Blob([tripData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTrip.destination}-trip-plan.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate('/plan-trip')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Planning
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <Download className="h-5 w-5" />
            Download Plan
          </button>
        </motion.div>

        {/* Trip Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{currentTrip.destination}</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">Duration</div>
                <div className="font-semibold">{currentTrip.days} Days</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm text-gray-600">Budget</div>
                <div className="font-semibold flex items-center gap-1">
                  {getBudgetIcon(currentTrip.budget)}
                  {currentTrip.budget.charAt(0).toUpperCase() + currentTrip.budget.slice(1)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-4 bg-purple-50 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-sm text-gray-600">Travelers</div>
                <div className="font-semibold flex items-center gap-1">
                  {getTravelersIcon(currentTrip.travelers)}
                  {currentTrip.travelers.charAt(0).toUpperCase() + currentTrip.travelers.slice(1)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-4 bg-orange-50 rounded-lg">
              <Plane className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-sm text-gray-600">Trip Type</div>
                <div className="font-semibold">Adventure</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hotel Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Hotel Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentTrip.hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{hotel.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{hotel.location}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{hotel.rating}</span>
                  </div>
                  <div className="text-lg font-bold text-blue-600">{hotel.price}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Itinerary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Places to Visit</h2>
          <div className="space-y-8">
            {currentTrip.itinerary.map((dayPlan) => (
              <div key={dayPlan.day} className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Day {dayPlan.day}</h3>
                
                <div className="space-y-6">
                  {['morning', 'afternoon', 'evening'].map((timeSlot) => {
                    const activity = dayPlan.activities.find(a => a.time === timeSlot);
                    if (!activity) return null;

                    return (
                      <div key={timeSlot} className="border-l-4 border-blue-500 pl-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <span className="text-lg font-semibold text-blue-600 capitalize">
                            {timeSlot}
                          </span>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-4">
                          <img
                            src={activity.image}
                            alt={activity.title}
                            className="w-full md:w-32 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="text-xl font-semibold text-gray-900 mb-2">
                              {activity.title}
                            </h4>
                            <p className="text-gray-600 mb-2">{activity.description}</p>
                            {activity.price && (
                              <div className="text-sm font-medium text-green-600">
                                💰 {activity.price}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
        >
          <button
            onClick={() => navigate('/plan-trip')}
            className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Plan Another Trip
          </button>
          <button
            onClick={() => navigate('/my-trips')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            View My Trips
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default TripPlan;