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
  const slides = [
    {
      src: bryan,
      title:
        'Bryan M. Sastokas, Chief Information Technology Officer (CITO)',
      text: 'Deputy Chief, CITO, Bryan M. Sastokas leads Metro\'s ITS organization and is dedicated to helping customers and business stakeholders address today’s increasingly complex software and hardware infrastructure challenges.',
    },
    {
      src: pat,
      title: 'Patrick Astredo, EO IT Business Applications',
      text: 'The IT Business Applications group is comprised of Transit Applications, Business Application Services, and Digital Strategy & Innovation, & Web App. Patrick encompasses the values of Metro as proven by his continued commitment to exellence.',
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
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Determine the delay based on the current slide
    const isMapSlide = slides[currentIndex].text === 'Map';
    const delay = isMapSlide ? 20000 : 8000; // 15 seconds for map, 10 seconds for others

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
                    overflow:hidden;

        }
      `}</style>

      <div className="carousel-container ">
        <div className="carousel-content">
          {slides[currentIndex].title ? (
            <CCard className="carousel-card  pt-4">
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
            <img
              src={slides[currentIndex].src}
              alt="Map"
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
