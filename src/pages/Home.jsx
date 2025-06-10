import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, MapPin, Clock, Users, Star, ArrowRight } from 'lucide-react';
import MapboxMap from '../components/MapBoxMap';

const Home = () => {
  const features = [
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Smart Destination Matching',
      description: 'AI-powered recommendations based on your preferences and travel style.'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Instant Itineraries',
      description: 'Get detailed day-by-day plans in seconds, perfectly tailored to your trip duration.'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Group Optimization',
      description: 'Plans adapt to solo travelers, couples, families, or groups for the best experience.'
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: 'Premium Recommendations',
      description: 'Curated hotels, restaurants, and attractions matched to your budget.'
    }
  ];

  const testimonials = [
    {
      name: 'Mobeen Zaheer',
      location: 'New York, USA',
      text: 'Travel Craft planned the perfect week in Japan. Every detail was spot-on!',
      rating: 5
    },
    {
      name: 'Abdul Moiz',
      location: 'Toronto, Canada',
      text: 'Best travel planning experience ever. Saved hours of research!',
      rating: 5
    },
    {
      name: 'Shahbaz Hussain',
      location: 'Barcelona, Spain',
      text: 'The AI recommendations were incredibly accurate to our preferences.',
      rating: 5
    }
  ];

  // const render = (status) => {
  //   switch (status) {
  //     case Status.LOADING:
  //       return (
  //         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
  //           <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
  //             <h3 className="text-2xl font-bold text-white mb-4">Explore Destinations</h3>
  //           </div>
  //           <div className="flex items-center justify-center h-96 lg:h-[500px]">
  //             <div className="text-center">
  //               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //               <p className="text-gray-600">Loading Google Maps...</p>
  //             </div>
  //           </div>
  //         </div>
  //       );
  //     case Status.FAILURE:
  //       return (
  //         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
  //           <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
  //             <h3 className="text-2xl font-bold text-white mb-4">Explore Destinations</h3>
  //           </div>
  //           <div className="flex items-center justify-center h-96 lg:h-[500px]">
  //             <div className="text-center">
  //               <p className="text-red-600 mb-2">Failed to load Google Maps</p>
  //               <p className="text-gray-600 text-sm">Please check your internet connection and try again.</p>
  //             </div>
  //           </div>
  //         </div>
  //       );
  //     default:
  //       return <GoogleMap />;
  //   }
  // };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-teal-600"></div>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white bg-opacity-10 rounded-full"
              style={{
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your Perfect Trip
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Starts Here
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
              AI-powered travel planning that creates personalized itineraries in seconds. 
              Just tell us your preferences, and we'll craft your dream adventure.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/plan-trip"
              className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center gap-2"
            >
              Start Planning Now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
        
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 text-sm text-gray-300"
          >
            ✨ No credit card required • 🚀 Get started in 60 seconds
          </motion.div>
        </div>
      </section>

      {/* Google Maps Section */}
       <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Discover Your Next Destination
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Search and explore destinations around the world. Get inspired by seeing 
              exactly where your next adventure could take you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <MapboxMap />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Travel Craft?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI technology combines millions of travel data points to create 
              the perfect itinerary for your unique journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
              >
                <div className="text-blue-600 mb-4 flex justify-center group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Plan Your Trip in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From dream to itinerary in minutes, not hours.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Tell Us Your Preferences',
                description: 'Choose your destination, travel dates, budget, and travel companions.'
              },
              {
                step: '02',
                title: 'AI Creates Your Plan',
                description: 'Our intelligent system generates a personalized itinerary with recommendations.'
              },
              {
                step: '03',
                title: 'Download & Go',
                description: 'Get your complete travel plan with hotels, activities, and booking links.'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-6xl font-bold text-blue-100 mb-4">{item.step}</div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-300"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of happy travelers who've discovered their perfect trips.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.location}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Craft Your Perfect Trip?
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Join millions of travelers who trust Travel Craft to plan their dream adventures.
            </p>
            <Link
              to="/plan-trip"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
            >
              Start Your Journey
              <Plane className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;