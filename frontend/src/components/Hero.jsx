import React from "react";

const Hero = ({ title, imageUrl }) => {
    return (
        <>
            <div className="hero container">
                <div className="banner">
                    <h1>{title}</h1>
                    <p>
                        <strong>Ashwani Arogya</strong> is a digital healthcare platform rooted in the values of ancient Indian healing and powered by modern technology. We combine compassion, care, and code to offer seamless medical services—from doctor consultations to appointment management—all under one secure system. Your health is our priority, and your trust is our strength.
                    </p>
                </div>
                <div className="banner">
                    <img src={imageUrl} alt="hero" className="animated-image" />
                    <span>
                        <img src="/Vector.png" alt="vector" />
                    </span>
                </div>
            </div>
        </>
    );
};

export default Hero;
