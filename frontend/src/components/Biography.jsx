import React from "react";

const Biography = ({ imageUrl }) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="Ashwani Arogya" />
        </div>
        <div className="banner">
          <p>Biography</p>
          <h3>Who We Are</h3>
          <p>
            <strong>Ashwani Arogya</strong> is a health-tech initiative inspired by the wisdom of ancient Indian healing and powered by modern web technologies. Our mission is to make healthcare smarter, more accessible, and reliable for everyone through digital innovation.
          </p>
          <p>
            Founded by a passionate team of developers, designers, and visionaries, we aim to bridge the gap between patients and quality healthcare services using the power of the <strong>MERN Stack</strong> — MongoDB, Express, React, and Node.js.
          </p>
          <p>
            From managing appointments and connecting with qualified doctors, to maintaining medical history and streamlining admin operations, Ashwani Arogya is your one-stop solution for all things healthcare.
          </p>
          <p>
            In 2024 and beyond, we are committed to transforming how people experience medical care. Because at Ashwani Arogya, we believe — <em>"Technology with empathy can heal the world."</em>
          </p>
          <p>
            Thank you for being a part of this journey. Together, we build healthier futures.
          </p>
        </div>
      </div>
    </>
  );
};

export default Biography;
