import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import { ArrowRight } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axios.get(`${API}/properties?featured=true`);
        setFeaturedProperties(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="bg-midnight" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-end pb-24 md:pb-32">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
            alt="Luxury estate"
            className="w-full h-full object-cover img-muted opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl text-ivory leading-[0.95] tracking-tight">
              Residences of<br />
              <span className="italic text-champagne">Quiet Distinction</span>
            </h1>
            <p className="mt-8 font-sans text-base md:text-lg text-stone max-w-lg leading-relaxed">
              Selected properties. Privately presented. For those who understand that true luxury whispers.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <Link
                to="/properties"
                className="btn-luxury-filled inline-flex items-center justify-center gap-3"
                data-testid="hero-view-properties-btn"
              >
                View Collection
                <ArrowRight strokeWidth={1} size={16} />
              </Link>
              <Link
                to="/contact"
                className="btn-luxury inline-flex items-center justify-center"
                data-testid="hero-contact-btn"
              >
                Private Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Statement */}
      <section className="py-24 md:py-32 border-t border-stone/10">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center"
          >
            <div className="md:col-span-5">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-ivory leading-[1.1]">
                Where Architecture<br />
                <span className="italic text-champagne">Meets Discretion</span>
              </h2>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <p className="font-sans text-base text-stone leading-relaxed">
                We represent properties of exceptional character—residences that transcend real estate 
                to become personal sanctuaries. Each offering is curated through established relationships, 
                presented to qualified individuals with the confidentiality they expect.
              </p>
              <p className="mt-6 font-sans text-base text-stone leading-relaxed">
                No public listings. No open houses. Only private presentations 
                for those prepared to acquire the extraordinary.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 md:py-32 bg-charcoal">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          >
            <div>
              <span className="font-sans text-xs tracking-[0.3em] uppercase text-champagne">Featured</span>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl text-ivory">
                Selected Properties
              </h2>
            </div>
            <Link
              to="/properties"
              className="font-sans text-sm tracking-[0.15em] uppercase text-stone hover:text-champagne transition-colors duration-300 flex items-center gap-2"
              data-testid="view-all-properties-link"
            >
              View All
              <ArrowRight strokeWidth={1} size={14} />
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-midnight" />
                  <div className="mt-6 space-y-3">
                    <div className="h-6 bg-midnight w-3/4" />
                    <div className="h-4 bg-midnight w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProperties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80"
            alt="Interior"
            className="w-full h-full object-cover img-muted opacity-30"
          />
          <div className="absolute inset-0 bg-midnight/80" />
        </div>
        <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-ivory">
              Begin Your Private Search
            </h2>
            <p className="mt-6 font-sans text-base text-stone max-w-lg mx-auto">
              Schedule a confidential consultation to discuss your requirements.
            </p>
            <Link
              to="/contact"
              className="btn-luxury-filled inline-block mt-10"
              data-testid="cta-contact-btn"
            >
              Request Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
