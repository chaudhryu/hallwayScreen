// Dashboard.js

import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardImage,
  CCardTitle,
  CCardText,
} from '@coreui/react';
// Import your images
import bryan from 'src/assets/images/bryan2.jpg';
import pat from 'src/assets/images/pat.jpg';
import medic from 'src/assets/images/medic.jpg';
import tee from 'src/assets/images/tee.jpg';
import metroLogo from 'src/assets/images/metroITSLogo.png';
import map from 'src/assets/images/mapFixedTitle.png';

const Dashboard = () => {
  // Array of room IDs and their corresponding names
  const rooms = [
    { id: 94, name: 'East Wing (05-76)' },
    { id: 180, name: 'Huddle A (05-44)' },
    { id: 163, name: 'Huddle B (05-67)' },
    { id: 1609, name: 'Huddle C (05-98)' },
    { id: 2189, name: 'Huddle Room D' },
    { id: 2194, name: 'Innovation Lab (05-92)' },
    { id: 139, name: 'Valencia (05-43)' },
    { id: 140, name: 'West Wing (05-20)' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [bookings, setBookings] = useState({}); // Key: roomId, Value: array of bookings

  // Function to fetch bookings for all rooms
  const fetchBookings = async () => {
    try {
      const startDateTime = new Date().toISOString().split('T')[0] + ' 00:00:00';
      const endDateTime =
        new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] +
        ' 00:00:00';

      const allBookings = {};

      for (const room of rooms) {
        const roomId = room.id;

        // Make a request to your backend server
        const response = await fetch(
          `http://localhost:5001/api/bookings?startDateTime=${encodeURIComponent(
            startDateTime
          )}&endDateTime=${encodeURIComponent(
            endDateTime
          )}&roomId=${encodeURIComponent(roomId)}`
        );

        if (!response.ok) {
          console.error(`Network response was not ok for room ${roomId}`);
          continue; // Skip to next room
        }

        const data = await response.json();
        const roomBookings = data.bookings || data; // Adjust based on actual response

        if (roomBookings && roomBookings.length > 0) {
          allBookings[roomId] = roomBookings;
          console.log(`Bookings for room ${roomId}:`, roomBookings);
        } else {
          console.log(`No bookings for room ${roomId}`);
        }
      }

      setBookings(allBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Fetch bookings initially and refresh every seven minutes
  useEffect(() => {
    fetchBookings(); // Initial fetch

    const interval = setInterval(() => {
      console.log('Refreshing bookings data...');
      fetchBookings();
    }, 420000); // Refresh every 7 minutes (420,000 ms)

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  // Define the slides array, including a slide for each room's bookings
  // Only include rooms that have bookings
  const bookingSlides = rooms
    .filter((room) => bookings[room.id] && bookings[room.id].length > 0)
    .map((room) => ({
      type: 'bookings',
      roomId: room.id,
      title: `Room Bookings for ${room.name}`,
    }));

  const slides = [
    {
      src: bryan,
      title: 'Bryan M. Sastokas, Chief Information Technology Officer (CITO)',
      text: "Deputy Chief, CITO, Bryan M. Sastokas leads Metro's ITS organization and is dedicated to helping customers and business stakeholders address today’s increasingly complex software and hardware infrastructure challenges.",
    },
    {
      src: pat,
      title: 'Patrick Astredo, EO IT Business Applications',
      text: 'The IT Business Applications group is comprised of Transit Applications, Business Application Services, and Digital Strategy & Innovation, & Web App. Patrick encompasses the values of Metro as proven by his continued commitment to excellence.',
    },
    {
      src: medic,
      title: 'Medik Ghazikhanian, EO Center of Excellence (CoE)',
      text: 'The ITS CoE is composed of Governance, Program Management Office (PMO), ITS Training, ITS Communications, Geospatial Business Intelligence (GBI), and ITS Budget and Admin. This department is headed by Medik Ghazikhanian.',
    },
    {
      src: tee,
      title:
        'Vincent Tee, EO Enterprise Architecture & Technology Integration',
      text: 'The Enterprise Architecture & Tech Integration group comprises IT Capacity Management, Network Engineering, IT Service Continuity - Database and Storage Management, Configuration & Data Center Management.',
    },
    // Include the booking slides
    ...bookingSlides,
  ];

  useEffect(() => {
    const currentSlide = slides[currentIndex];
    let delay = 8000; // Default delay

    if (currentSlide.type === 'bookings') {
      delay = 15000; // 15 seconds for bookings slides
    } else if (currentSlide.text === 'Map') {
      delay = 20000; // 20 seconds for map slide
    }

    const timeout = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, delay);

    return () => clearTimeout(timeout);
  }, [currentIndex, slides]);

  return (
    <>
      <style>{`
        /* Carousel styles */
        .carousel-container {
          position: relative;
          width: 100%;
          margin: 0 auto;
          height: 100vh;
        }

        .carousel-content {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          transition: transform 0.5s ease-in-out;
        }

        /* Carousel Indicators */
        .carousel-indicators {
          position: absolute;
          bottom: 15px;
          width: 70%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2;
        }

        .indicator-dot {
          width: 12px;
          height: 12px;
          margin: 0 6px;
          background-color: black;
          border-radius: 50%;
          opacity: 0.5;
          cursor: pointer;
          transition: opacity 0.3s;
        }

        .indicator-dot.active {
          opacity: 1;
        }

        /* Carousel Card */
        .carousel-card {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* Circular Image */
        .carousel-image {
          width: 400px;
          height: 400px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 20px;
          overflow: hidden;
        }

        /* Bookings Slide Styles */
        .bookings-list {
          list-style-type: none;
          padding: 0;
          font-size: 2rem;
        }

        .bookings-list li {
          margin-bottom: 10px;
        }
      `}</style>

      <div className="carousel-container">
        <div className="carousel-content">
          {slides[currentIndex].type === 'bookings' ? (
            // Render the bookings slide for the specific room
            <CCard className="carousel-card pt-4">
              <CCardBody>
                <CCardTitle
                  className="text-center"
                  style={{ fontSize: '2.8rem', fontWeight: 'bold' }}
                >
                  {slides[currentIndex].title}
                </CCardTitle>
                <ul className="bookings-list">
                  {bookings[slides[currentIndex].roomId].map((booking) => {
                    const startTime = new Date(booking.timeFrom);
                    const endTime = new Date(booking.timeTo);

                    // Function to format the time to 'h:mm a.m./p.m.'
                    const formatTime = (date) => {
                      let hours = date.getHours();
                      const minutes = date.getMinutes();
                      const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
                      hours = hours % 12;
                      hours = hours ? hours : 12; // the hour '0' should be '12'
                      const minutesStr = minutes < 10 ? '0' + minutes : minutes;
                      return `${hours}:${minutesStr} ${ampm}`;
                    };

                    return (
                      <li key={booking.bookingID}>
                        <strong>{booking.meetingTitle} - {booking.creatorName}</strong> <br />
                        {formatTime(startTime)} - {formatTime(endTime)}
                      </li>
                    );
                  })}
                </ul>
              </CCardBody>
            </CCard>
          ) : slides[currentIndex].title ? (
            // Render the regular slides
            <CCard className="carousel-card pt-4">
              <CCardImage
                orientation="top"
                src={slides[currentIndex].src}
                className="carousel-image"
              />
              <CCardBody>
                <CCardTitle
                  className="text-center"
                  style={{ fontSize: '2.8rem', fontWeight: 'bold' }}
                >
                  {slides[currentIndex].title}
                </CCardTitle>
                <CCardText
                  className="text-center"
                  style={{ fontSize: '2.1rem' }}
                >
                  {slides[currentIndex].text}
                </CCardText>
                <img
                  src={metroLogo}
                  alt="Metro Logo"
                  style={{ height: '100px', marginRight: '8px', bottom: 0 }}
                />
              </CCardBody>
            </CCard>
          ) : (
            // Render image-only slides
            <img
              src={slides[currentIndex].src}
              alt="Slide"
              style={{
                width: '100%',
                height: '100vh',
              }}
            />
          )}
        </div>

        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`indicator-dot ${
                currentIndex === index ? 'active' : ''
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-current={currentIndex === index ? 'true' : 'false'}
              aria-label={`Slide ${index + 1}`}
            ></span>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
