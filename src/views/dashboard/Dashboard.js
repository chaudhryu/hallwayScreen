import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardImage,
  CCardTitle,
  CCardText,
  CHeader,
} from '@coreui/react';
// Import images
import bryan from 'src/assets/images/bryan2.jpg';
import pat from 'src/assets/images/pat.jpg';
import medic from 'src/assets/images/medic.jpg';
import tee from 'src/assets/images/tee.jpg';
import metroLogo from 'src/assets/images/metroITSLogo.png';
import map from 'src/assets/images/crazyNewMap2.png';

const Dashboard = () => {
  // Array of room IDs and their names
  const rooms = [
    { id: 94, name: 'East Wing (05-76)' },
    { id: 2194, name: 'Innovation Lab (05-92)' },
    { id: 139, name: 'Valencia (05-43)' },
    { id: 140, name: 'West Wing (05-20)' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0); // Keeps track of current slide
  const [bookings, setBookings] = useState({}); // State to store the bookings for each room, keyed by room ID
  const [aggregatedBookings, setAggregatedBookings] = useState([]); // State to store aggregated bookings

  // Fetches bookings from each room from the server
  const fetchBookings = async () => {
    try {
      // Helper function to format date and time
      const formatDateTime = (date) => {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };

      // Set startDateTime to the current local time
      const startDateTime = formatDateTime(new Date());

      // Set endDateTime to the end of the day (11:59:59 PM)
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const endDateTime = formatDateTime(endOfDay);

      const allBookings = {}; // Object to store all the data

      for (const room of rooms) {
        const roomId = room.id;

        // Make a request to backend server
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
        const roomBookings = data.bookings || data;

        if (roomBookings && roomBookings.length > 0) {
          // Add room name to each booking for identification
          roomBookings.forEach((booking) => {
            booking.roomName = room.name;
          });

          allBookings[roomId] = roomBookings;
          console.log(`Bookings for room ${roomId}:`, roomBookings);
        } else {
          console.log(`No bookings for room ${roomId}`);
        }
      }

      setBookings(allBookings); // Update bookings state

      // Aggregate bookings into a single array
      const aggregated = Object.values(allBookings).flat();

      // Sort the aggregated bookings by start time
      aggregated.sort((a, b) => new Date(a.timeFrom) - new Date(b.timeFrom));

      // Update the aggregated bookings state
      setAggregatedBookings(aggregated);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Fetch bookings initially and refresh every hour
  useEffect(() => {
    // Fetch bookings initially
    fetchBookings();

    // Set interval to fetch bookings data every hour
    const fetchInterval = setInterval(() => {
      console.log('Fetching bookings data...');
      fetchBookings();
    }, 3600000); // 1 hour (3,600,000 ms)

    // Set interval to refresh the page every 7 minutes
    const refreshInterval = setInterval(() => {
      console.log('Refreshing the page...');
      window.location.reload();
    }, 420000); // 7 minutes (420,000 ms)

    // Cleanup on component unmount
    return () => {
      clearInterval(fetchInterval);
      clearInterval(refreshInterval);
    };
  }, []);

  // Define the slides array, including a slide for aggregated bookings
  const bookingSlides = rooms
    .filter((room) => bookings[room.id] && bookings[room.id].length > 0)
    .map((room) => ({
      type: 'bookings',
      roomId: room.id,
      title: `Meeting Time for ${room.name}`,
    }));

  const slides = [
    {
      src: bryan,
      title: 'Bryan M. Sastokas, Chief Information Technology Officer (CITO)',
    },
    {
      src: pat,
      title: 'Patrick Astredo, EO IT Business Applications',
    },
    {
      src: medic,
      title: 'Medik Ghazikhanian, EO Center of Excellence (CoE)',
    },
    {
      src: tee,
      title: 'Vincent Tee, EO Enterprise Architecture & Technology Integration',
    },
    // Aggregated bookings slide
    {
      type: 'aggregatedBookings',
      title: 'All Meeting Times',
    },
  ];

  useEffect(() => {
    const currentSlide = slides[currentIndex];
    let delay = 7000; // Default delay

    if (currentSlide.type === 'aggregatedBookings') {
      delay = 55000; // 55 seconds for aggregated bookings slide
    } else if (currentSlide.type === 'bookings') {
      delay = 15000; // 15 seconds for individual bookings slides
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
          height: 50vh; /* Adjusted to make room for the static map and title */
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
          position: relative;
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

        .bookings-list.small-font {
          font-size: 1.5rem;
        }

        .bookings-list li {
          margin-bottom: 20px;
        }

        /* Logo Positioning */
        .logo-bottom-left {
          position: absolute;
          bottom: 20px;
          left: 20px;
        }

        /* Static Map Container */
        .static-map-container {
          width: 100%;
          height: 45vh; /* Adjusted to make room for the carousel and title */
          background-color: white;
        }

        .static-map-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        /* Title Container */
        .title-container {
          text-align: center;
          background-color: white;
        }

        .title-text {
          font-size: 3rem;
          font-weight: bold;
          margin: 0;
        }
      `}</style>

      {/* Title Component */}
      <CCard>
        <div className="title-container">
          <h1 className="title-text">Welcome to the 5th Floor</h1>
        </div>

        {/* Static Map Image */}
        <div className="static-map-container">
          <img src={map} alt="Map" className="static-map-image" />
        </div>
      </CCard>
      {/* Carousel */}
      <div className="carousel-container">
        <div className="carousel-content">
          {slides[currentIndex].type === 'aggregatedBookings' ? (
            // Render the aggregated bookings slide
            <CCard className="carousel-card pt-4">
              <CCardBody>
                <CHeader style={{ marginBottom: '10px' }}>
                  <CCardTitle
                    className="text-center"
                    style={{ fontSize: '2.8rem', fontWeight: 'bold' }}
                  >
                    {slides[currentIndex].title}
                  </CCardTitle>
                </CHeader>
                {aggregatedBookings.length > 0 ? (
                  <ul
                    className={`bookings-list ${
                      aggregatedBookings.length > 2 ? 'small-font' : ''
                    }`}
                  >
                    {aggregatedBookings.map((booking) => {
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
                          <strong>
                            {booking.meetingTitle} - {booking.creatorName}
                          </strong>
                          <br />
                          {formatTime(startTime)} - {formatTime(endTime)}
                          <br />
                          <em>{booking.roomName}</em>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  // Display the no meetings message when there are no bookings
                  <p
                    className="bookings-list"
                    style={{ fontSize: '2rem', textAlign: 'center' }}
                  >
                    No meetings booked in any rooms currently.
                  </p>
                )}
                <img
                  src={metroLogo}
                  alt="Metro Logo"
                  className="logo-bottom-left"
                  style={{ height: '70px' }}
                />
              </CCardBody>
            </CCard>
          ) : slides[currentIndex].type === 'bookings' ? (
            // Render the bookings slide for the specific room
            <CCard className="carousel-card pt-4">
              <CCardBody>
                <CHeader style={{ marginBottom: '10px' }}>
                  <CCardTitle
                    className="text-center"
                    style={{ fontSize: '2.8rem', fontWeight: 'bold' }}
                  >
                    {slides[currentIndex].title}
                  </CCardTitle>
                </CHeader>
                <ul
                  className={`bookings-list ${
                    bookings[slides[currentIndex].roomId].length > 2
                      ? 'small-font'
                      : ''
                  }`}
                >
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
                        <strong>
                          {booking.meetingTitle} - {booking.creatorName}
                        </strong>
                        <br />
                        {formatTime(startTime)} - {formatTime(endTime)}
                      </li>
                    );
                  })}
                </ul>
                <img
                  src={metroLogo}
                  alt="Metro Logo"
                  className="logo-bottom-left"
                  style={{ height: '70px' }}
                />
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
                  style={{ fontSize: '2.1rem', marginBottom: '70px' }}
                >
                  {slides[currentIndex].text}
                </CCardText>
                <img
                  src={metroLogo}
                  alt="Metro Logo"
                  className="logo-bottom-left"
                  style={{ height: '70px' }}
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
