
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="w-full h-[300px] md:h-[500px] bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/seed/hero/1600/500')"}}>
      <div className="w-full h-full bg-black bg-opacity-40">
        {/* Promotional text removed as per user request */}
      </div>
    </section>
  );
};

export default HeroSection;