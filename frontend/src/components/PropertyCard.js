import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const PropertyCard = ({ property, index = 0 }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: 'easeOut' }}
    >
      <Link
        to={`/properties/${property.id}`}
        className="property-card block group"
        data-testid={`property-card-${property.id}`}
      >
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
          <img
            src={property.images[0]}
            alt={property.title}
            className="property-image w-full h-full object-cover img-muted"
          />
          {property.featured && (
            <div className="absolute top-4 left-4">
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-champagne bg-midnight/80 px-3 py-1">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mt-6 space-y-3">
          <h3 className="property-title font-serif text-xl md:text-2xl text-ivory">
            {property.title}
          </h3>
          <div className="flex items-center gap-2 text-stone">
            <MapPin strokeWidth={1} size={14} />
            <span className="font-sans text-sm">{property.location}</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="font-serif text-lg text-champagne">
              {formatPrice(property.price)}
            </span>
            <span className="font-sans text-xs text-stone tracking-wide">
              {property.bedrooms} BD · {property.bathrooms} BA · {property.area.toLocaleString()} SF
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
