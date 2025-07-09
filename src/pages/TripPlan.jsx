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
    const createPDFContent = () => {
      const getBudgetDisplay = (budget) => {
        const icons = { cheap: '💵', moderate: '💰', luxury: '💎' };
        const icon = icons[budget] || '💰';
        const text = budget.charAt(0).toUpperCase() + budget.slice(1);
        return `${icon} ${text}`;
      };

      const getTravelersDisplay = (travelers) => {
        const icons = { solo: '✈️', couple: '👫', family: '🏠' };
        const icon = icons[travelers] || '✈️';
        const text = travelers.charAt(0).toUpperCase() + travelers.slice(1);
        return `${icon} ${text}`;
      };

      const formatItinerary = () => {
        return currentTrip.itinerary.map(dayPlan => `
          <div style="margin-bottom: 30px; page-break-inside: avoid;">
            <h3 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 20px;">
              Day ${dayPlan.day}
            </h3>
            ${['morning', 'afternoon', 'evening'].map(timeSlot => {
              const activity = dayPlan.activities.find(a => a.time === timeSlot);
              if (!activity) return '';
              
              return `
                <div style="margin-bottom: 20px; padding: 15px; background-color: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 8px;">
                  <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <strong style="color: #2563eb; text-transform: capitalize; font-size: 1.1em;">
                      🕐 ${timeSlot}
                    </strong>
                  </div>
                  <h4 style="margin: 10px 0; color: #1f2937; font-size: 1.2em;">${activity.title}</h4>
                  <p style="color: #6b7280; margin: 8px 0; line-height: 1.5;">${activity.description}</p>
                  ${activity.price ? `<div style="color: #059669; font-weight: 600; margin-top: 8px;">💰 ${activity.price}</div>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        `).join('');
      };

      const formatHotels = () => {
        return currentTrip.hotels.map(hotel => `
          <div style="margin-bottom: 20px; padding: 20px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e5e7eb;">
            <h4 style="color: #1f2937; margin: 0 0 10px 0; font-size: 1.3em;">${hotel.name}</h4>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="color: #6b7280;">📍 ${hotel.location}</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="color: #fbbf24;">⭐ ${hotel.rating}</span>
            </div>
            <div style="color: #2563eb; font-weight: bold; font-size: 1.1em;">${hotel.price}</div>
          </div>
        `).join('');
      };

      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Trip Plan - ${currentTrip.destination}</title>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #374151;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
              }
              .header {
                text-align: center;
                margin-bottom: 40px;
                padding: 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 16px;
              }
              .header h1 {
                margin: 0 0 10px 0;
                font-size: 3em;
                font-weight: bold;
              }
              .header p {
                margin: 0;
                font-size: 1.2em;
                opacity: 0.9;
              }
              .trip-overview {
                background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
                padding: 30px;
                border-radius: 16px;
                margin-bottom: 40px;
                border: 1px solid #e5e7eb;
              }
              .overview-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 20px;
                margin-top: 20px;
              }
              .overview-item {
                background: white;
                padding: 20px;
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .overview-item .label {
                font-size: 0.9em;
                color: #6b7280;
                margin-bottom: 8px;
              }
              .overview-item .value {
                font-size: 1.1em;
                font-weight: bold;
                color: #1f2937;
              }
              .section {
                margin-bottom: 40px;
              }
              .section h2 {
                color: #1f2937;
                font-size: 2.2em;
                margin-bottom: 25px;
                padding-bottom: 10px;
                border-bottom: 3px solid #3b82f6;
              }
              .page-break {
                page-break-before: always;
              }
              .footer {
                margin-top: 60px;
                text-align: center;
                color: #9ca3af;
                font-size: 0.9em;
                padding: 20px;
                border-top: 2px solid #e5e7eb;
              }
              @media print {
                body { 
                  margin: 0; 
                  padding: 15px;
                }
                .header { 
                  page-break-after: avoid; 
                  background: #667eea !important;
                  -webkit-print-color-adjust: exact;
                }
                .trip-overview { 
                  page-break-inside: avoid;
                  background: #f0f9ff !important;
                  -webkit-print-color-adjust: exact;
                }
                .section { 
                  page-break-inside: avoid; 
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🌍 ${currentTrip.destination}</h1>
              <p>Complete Trip Plan & Itinerary</p>
            </div>

            <div class="trip-overview">
              <h2 style="margin-top: 0; color: #1e40af;">Trip Overview</h2>
              <div class="overview-grid">
                <div class="overview-item">
                  <div class="label">📅 Duration</div>
                  <div class="value">${currentTrip.days} Days</div>
                </div>
                <div class="overview-item">
                  <div class="label">💰 Budget</div>
                  <div class="value">${getBudgetDisplay(currentTrip.budget)}</div>
                </div>
                <div class="overview-item">
                  <div class="label">👥 Travelers</div>
                  <div class="value">${getTravelersDisplay(currentTrip.travelers)}</div>
                </div>
                <div class="overview-item">
                  <div class="label">✈️ Trip Type</div>
                  <div class="value">Adventure</div>
                </div>
              </div>
            </div>

            <div class="section">
              <h2>🏨 Hotel Recommendations</h2>
              ${formatHotels()}
            </div>

            <div class="section page-break">
              <h2>📋 Daily Itinerary</h2>
              ${formatItinerary()}
            </div>

            <div class="footer">
              <p>Trip plan generated on ${new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p>Have an amazing trip! 🎉</p>
            </div>
          </body>
        </html>
      `;
    };

    // Create and open print window
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    const htmlContent = createPDFContent();
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Optional: close window after printing
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 500);
    };
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