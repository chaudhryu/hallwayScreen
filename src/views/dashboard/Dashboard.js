import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardImage,
  CCardTitle,
  CCardText,
} from '@coreui/react'

import puppy from 'src/assets/images/puppy.jpg'
import bryan from 'src/assets/images/bryan2.jpg'

const Dashboard = () => {
  const slides = [
    {
      src: bryan,
      title: 'Bryan M. Sastokas, Deputy Chief, Chief Information Technology Officer (CITO)',
      text: 'Some representative placeholder content for the first slide.',
    },
    {
      src: bryan,
      title: 'Medik Ghazikhanian, ​Executive OfficerCenter of Excellence (CoE)',
      text: 'Some representative placeholder content for the second slide.',
    },
    {
      src: puppy,
      title: 'Patrick Astredo, Executive Officer IT Business Applications',
      text: 'Some representative placeholder content for the third slide.',
    },
    {
      src: puppy,
      title: 'Joe Giba, Executive Officer IT Operations & Service Delivery',
      text: 'Some representative placeholder content for the fourth slide.',
    },
    {
      src: puppy,
      title: 'Vincent Tee, Executive Officer Enterprise Architecture & Technology Integration​​​​​​​​​​​​​​',
      text: 'Some representative placeholder content for the fifth slide.',
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
    }, 3000) // Change slide every 3 seconds
    return () => clearInterval(interval)
  }, [slides.length])

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length)
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
  }

  return (
    <>
      <style>{`
        /* Carousel Container */
        .carousel-container {
          position: relative;
          width: 100%;
          margin: 0 auto;
          overflow: hidden;
          height: 100vh; /* Full viewport height */
        }

        /* Carousel Content */
        .carousel-content {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          transition: transform 0.5s ease-in-out;
        }

        /* Navigation Controls */
        .carousel-control-prev,
        .carousel-control-next {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
          border: none;
          color: #fff;
          font-size: 30px;
          padding: 10px;
          cursor: pointer;
          opacity: 0.7;
          z-index: 3; /* Above indicators and content */
        }

        .carousel-control-prev:hover,
        .carousel-control-next:hover {
          opacity: 1;
        }

        .carousel-control-prev {
          left: 10px;
        }

        .carousel-control-next {
          right: 10px;
        }

        /* Carousel Indicators */
        .carousel-indicators {
          position: absolute;
          bottom: 15px;
          width: 70%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2; /* Above content but below controls */
        }

        .indicator-dot {
          width: 12px;
          height: 12px;
          margin: 0 6px;
          background-color: black; /* White dots */
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
          width: 70%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center; /* Center the content horizontally */
          justify-content: center; /* Center the content vertically */
        }

        /* Circular Image */
        .carousel-image {
          width: 300px;
          height: 300px;
          border-radius: 50%; /* Make image circular */
          object-fit: cover;
          margin-bottom: 20px; /* Space between image and text */
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .carousel-card {
            width: 90%;
          }

          .carousel-control-prev,
          .carousel-control-next {
            font-size: 24px;
            padding: 8px;
          }

          .carousel-indicators {
            bottom: 10px;
          }

          .indicator-dot {
            width: 10px;
            height: 10px;
            margin: 0 4px;
          }

          .carousel-image {
            width: 150px;
            height: 150px;
            margin-bottom: 15px;
          }
        }
      `}</style>

      <div className="carousel-container">
        <div className="carousel-content">
          <CCard className="carousel-card">
            <CCardImage
              orientation="top"
              src={slides[currentIndex].src}
              className="carousel-image"
            />
            <CCardBody>
              <CCardTitle>{slides[currentIndex].title}</CCardTitle>
              <CCardText>{slides[currentIndex].text}</CCardText>
            </CCardBody>
          </CCard>
        </div>
        <button
          className="carousel-control-prev"
          onClick={prevSlide}
          aria-label="Previous Slide"
        >
          &#10094;
        </button>
        <button
          className="carousel-control-next"
          onClick={nextSlide}
          aria-label="Next Slide"
        >
          &#10095;
        </button>
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`indicator-dot ${currentIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-current={currentIndex === index ? 'true' : 'false'}
              aria-label={`Slide ${index + 1}`}
            ></span>
          ))}
        </div>
      </div>

      {/* Remove the standalone CCard below if it's no longer needed */}
      {/* <CCard style={{ width: '18rem' }}>
        <CCardImage orientation="top" src={puppy} />
        <CCardBody>
          <CCardText>
            Some quick example text to build on the card title and make up the bulk of the card's content.
          </CCardText>
        </CCardBody>
      </CCard> */}
    </>
  )
}

export default Dashboard
