import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import InquiryForm from '../components/InquiryForm';
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin, Bed, Bath, Square, X } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`${API}/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="animate-pulse font-serif text-2xl text-stone">Loading...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-midnight pt-32 text-center">
        <h1 className="font-serif text-3xl text-ivory">Property Not Found</h1>
        <Link to="/properties" className="btn-luxury mt-8 inline-block">
          Return to Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-midnight min-h-screen" data-testid="property-detail-page">
      {/* Back Button */}
      <div className="fixed top-24 left-6 md:left-12 z-30">
        <Link
          to="/properties"
          className="flex items-center gap-2 font-sans text-xs tracking-[0.15em] uppercase text-stone hover:text-ivory transition-colors duration-300"
          data-testid="back-to-properties-link"
        >
          <ArrowLeft strokeWidth={1} size={16} />
          Back
        </Link>
      </div>

      {/* Hero Image */}
      <section className="relative h-[70vh] md:h-[80vh]">
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          src={property.images[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover img-muted cursor-pointer"
          onClick={() => setIsGalleryOpen(true)}
          data-testid="property-hero-image"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent" />

        {/* Image Navigation */}
        {property.images.length > 1 && (
          <div className="absolute bottom-8 right-8 flex items-center gap-4">
            <button
              onClick={prevImage}
              className="w-12 h-12 flex items-center justify-center border border-stone/30 text-ivory hover:bg-ivory/10 transition-colors duration-300"
              data-testid="prev-image-btn"
              aria-label="Previous image"
            >
              <ChevronLeft strokeWidth={1} size={20} />
            </button>
            <span className="font-sans text-sm text-stone">
              {currentImageIndex + 1} / {property.images.length}
            </span>
            <button
              onClick={nextImage}
              className="w-12 h-12 flex items-center justify-center border border-stone/30 text-ivory hover:bg-ivory/10 transition-colors duration-300"
              data-testid="next-image-btn"
              aria-label="Next image"
            >
              <ChevronRight strokeWidth={1} size={20} />
            </button>
          </div>
        )}
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            {/* Main Content */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {property.featured && (
                  <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-champagne">
                    Featured Property
                  </span>
                )}
                <h1 className="mt-2 font-serif text-4xl md:text-5xl lg:text-6xl text-ivory leading-[1.1]" data-testid="property-title">
                  {property.title}
                </h1>
                <div className="mt-6 flex items-center gap-2 text-stone">
                  <MapPin strokeWidth={1} size={16} />
                  <span className="font-sans text-base" data-testid="property-location">{property.location}</span>
                </div>

                {/* Stats */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-b border-stone/10">
                  <div>
                    <div className="flex items-center gap-2 text-champagne">
                      <Bed strokeWidth={1} size={18} />
                      <span className="font-serif text-2xl" data-testid="property-bedrooms">{property.bedrooms}</span>
                    </div>
                    <p className="mt-1 font-sans text-xs tracking-[0.1em] uppercase text-stone">Bedrooms</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-champagne">
                      <Bath strokeWidth={1} size={18} />
                      <span className="font-serif text-2xl" data-testid="property-bathrooms">{property.bathrooms}</span>
                    </div>
                    <p className="mt-1 font-sans text-xs tracking-[0.1em] uppercase text-stone">Bathrooms</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-champagne">
                      <Square strokeWidth={1} size={18} />
                      <span className="font-serif text-2xl" data-testid="property-area">{property.area.toLocaleString()}</span>
                    </div>
                    <p className="mt-1 font-sans text-xs tracking-[0.1em] uppercase text-stone">Sq Ft</p>
                  </div>
                  <div>
                    <span className="font-serif text-2xl text-champagne capitalize" data-testid="property-type">{property.property_type}</span>
                    <p className="mt-1 font-sans text-xs tracking-[0.1em] uppercase text-stone">Type</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-12">
                  <h2 className="font-serif text-2xl text-ivory mb-6">About This Property</h2>
                  <p className="font-sans text-base text-stone leading-relaxed" data-testid="property-description">
                    {property.description}
                  </p>
                </div>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div className="mt-12">
                    <h2 className="font-serif text-2xl text-ivory mb-6">Features</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.features.map((feature, index) => (
                        <div
                          key={index}
                          className="py-3 px-4 border border-stone/10 font-sans text-sm text-stone"
                        >
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="sticky top-32"
              >
                {/* Price Card */}
                <div className="bg-charcoal p-8 md:p-12">
                  <span className="font-sans text-xs tracking-[0.2em] uppercase text-stone">Asking Price</span>
                  <p className="mt-2 font-serif text-4xl md:text-5xl text-champagne" data-testid="property-price">
                    {formatPrice(property.price)}
                  </p>
                </div>

                {/* Inquiry Form */}
                <div className="mt-8 bg-charcoal p-8 md:p-12">
                  <h3 className="font-serif text-2xl text-ivory mb-2">Schedule a Private Viewing</h3>
                  <p className="font-sans text-sm text-stone mb-8">
                    Inquire about this exceptional property.
                  </p>
                  <InquiryForm propertyId={property.id} propertyTitle={property.title} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Gallery */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-midnight/98 flex items-center justify-center"
            data-testid="fullscreen-gallery"
          >
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-8 right-8 text-ivory hover:text-champagne transition-colors duration-300"
              data-testid="close-gallery-btn"
              aria-label="Close gallery"
            >
              <X strokeWidth={1} size={32} />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-8 text-ivory hover:text-champagne transition-colors duration-300"
              data-testid="gallery-prev-btn"
              aria-label="Previous image"
            >
              <ChevronLeft strokeWidth={1} size={48} />
            </button>

            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="max-w-[90vw] max-h-[80vh] object-contain"
            />

            <button
              onClick={nextImage}
              className="absolute right-8 text-ivory hover:text-champagne transition-colors duration-300"
              data-testid="gallery-next-btn"
              aria-label="Next image"
            >
              <ChevronRight strokeWidth={1} size={48} />
            </button>

            <div className="absolute bottom-8 font-sans text-sm text-stone">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyDetail;
