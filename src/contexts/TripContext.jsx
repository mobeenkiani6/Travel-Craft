import React, { useState, useContext, useEffect, createContext } from 'react';
const TripContext = createContext();

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's posts from backend
  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'GET',
        credentials: 'include', // Important: This sends session cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          console.log('User not authenticated');
          setUserPosts([]);
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setUserPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
      setUserPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Save a trip to backend
  const saveTrip = async (trip) => {
    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        credentials: 'include', // Important: This sends session cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Trip to ${trip.destination}`,
          description: JSON.stringify(trip), // Store the entire trip object as JSON string
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const savedPost = await res.json();
      
      // Update userPosts state
      setUserPosts(prev => [savedPost, ...prev]);
      
      return savedPost;
    } catch (err) {
      console.error('Failed to save trip', err);
      throw err;
    }
  };

  // Delete a trip from backend
  const deleteTrip = async (postId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Update userPosts state
      setUserPosts(prev => prev.filter(post => post._id !== postId));
    } catch (err) {
      console.error('Failed to delete trip', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const generateTrip = (destination, days, budget, travelers) => {
    const tripId = Date.now().toString();

    const mockHotels = [
      {
        id: '1',
        name: 'Grand Palace Hotel',
        location: `Downtown ${destination}`,
        price: budget === 'luxury' ? '$200-300/night' : budget === 'moderate' ? '$100-150/night' : '$50-80/night',
        rating: budget === 'luxury' ? 4.8 : budget === 'moderate' ? 4.2 : 3.8,
        image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: '2',
        name: 'City Center Inn',
        location: `Central ${destination}`,
        price: budget === 'luxury' ? '$180-250/night' : budget === 'moderate' ? '$90-120/night' : '$40-70/night',
        rating: budget === 'luxury' ? 4.6 : budget === 'moderate' ? 4.0 : 3.6,
        image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: '3',
        name: 'Riverside Resort',
        location: `Riverside ${destination}`,
        price: budget === 'luxury' ? '$250-350/night' : budget === 'moderate' ? '$120-180/night' : '$60-100/night',
        rating: budget === 'luxury' ? 4.9 : budget === 'moderate' ? 4.4 : 4.0,
        image: 'https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ];

    const mockActivities = [
      {
        time: 'morning',
        title: `${destination} Historic Fort`,
        description: `Explore the majestic ${destination} Fort, a UNESCO World Heritage site.`,
        image: 'https://images.pexels.com/photos/1838640/pexels-photo-1838640.jpeg?auto=compress&cs=tinysrgb&w=400',
        price: 'Ticket: $15 per person'
      },
      {
        time: 'afternoon',
        title: 'Grand Mosque',
        description: `Visit the stunning Grand Mosque, one of the largest mosques in the region.`,
        image: 'https://images.pexels.com/photos/337901/pexels-photo-337901.jpeg?auto=compress&cs=tinysrgb&w=400', // Use the imported mosque image
        price: 'Ticket: Free'
      },
      {
        time: 'evening',
        title: 'Cultural Center',
        description: `Experience local culture and cuisine at the vibrant cultural center.`,
        image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
        price: 'Entry: $10 per person'
      }
    ];

    const itinerary = Array.from({ length: days }, (_, index) => ({
      day: index + 1,
      activities: mockActivities
    }));

    const trip = {
      id: tripId,
      destination,
      days,
      budget,
      travelers,
      createdAt: new Date().toISOString(),
      hotels: mockHotels,
      itinerary
    };

    return trip;
  };

  const addTrip = async (trip) => {
    try {
      await saveTrip(trip);
      // Add to local state as well for immediate UI update
      setTrips(prev => [...prev, trip]);
    } catch (error) {
      console.error('Failed to save trip:', error);
      // Optionally show error message to user
      throw error;
    }
  };

  const value = {
    trips,
    currentTrip,
    addTrip,
    setCurrentTrip,
    generateTrip,
    userPosts,
    saveTrip,
    deleteTrip,
    fetchUserPosts,
    loading,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};