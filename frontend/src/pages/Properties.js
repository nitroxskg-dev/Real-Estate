import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { SlidersHorizontal, X } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    property_type: '',
    min_price: '',
    max_price: '',
    bedrooms: '',
  });

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.property_type) params.append('property_type', filters.property_type);
      if (filters.min_price) params.append('min_price', filters.min_price);
      if (filters.max_price) params.append('max_price', filters.max_price);
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);

      const response = await axios.get(`${API}/properties?${params.toString()}`);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      property_type: '',
      min_price: '',
      max_price: '',
      bedrooms: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="bg-midnight min-h-screen pt-24" data-testid="properties-page">
      {/* Header */}
      <section className="py-16 md:py-24 border-b border-stone/10">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-champagne">Collection</span>
            <h1 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl text-ivory">
              Our Properties
            </h1>
            <p className="mt-6 font-sans text-base text-stone max-w-xl">
              A curated selection of extraordinary residences, each representing the pinnacle of architectural achievement and refined living.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-stone/10">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 font-sans text-xs tracking-[0.15em] uppercase text-stone hover:text-ivory transition-colors duration-300"
              data-testid="toggle-filters-btn"
            >
              <SlidersHorizontal strokeWidth={1} size={16} />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-champagne" />
              )}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 font-sans text-xs tracking-[0.1em] uppercase text-stone hover:text-ivory transition-colors duration-300"
                data-testid="clear-filters-btn"
              >
                <X strokeWidth={1} size={14} />
                Clear All
              </button>
            )}
          </div>

          {/* Filter Options */}
          <motion.div
            initial={false}
            animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8">
              <div>
                <label className="block font-sans text-xs tracking-[0.1em] uppercase text-stone mb-3">
                  Property Type
                </label>
                <Select
                  value={filters.property_type}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, property_type: value }))}
                >
                  <SelectTrigger className="w-full bg-charcoal border-stone/20 text-ivory" data-testid="filter-type-select">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal border-stone/20">
                    <SelectItem value="estate" className="text-ivory">Estate</SelectItem>
                    <SelectItem value="penthouse" className="text-ivory">Penthouse</SelectItem>
                    <SelectItem value="villa" className="text-ivory">Villa</SelectItem>
                    <SelectItem value="apartment" className="text-ivory">Apartment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block font-sans text-xs tracking-[0.1em] uppercase text-stone mb-3">
                  Min Price
                </label>
                <Select
                  value={filters.min_price}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, min_price: value }))}
                >
                  <SelectTrigger className="w-full bg-charcoal border-stone/20 text-ivory" data-testid="filter-min-price-select">
                    <SelectValue placeholder="No Minimum" />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal border-stone/20">
                    <SelectItem value="10000000" className="text-ivory">$10M+</SelectItem>
                    <SelectItem value="20000000" className="text-ivory">$20M+</SelectItem>
                    <SelectItem value="30000000" className="text-ivory">$30M+</SelectItem>
                    <SelectItem value="40000000" className="text-ivory">$40M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block font-sans text-xs tracking-[0.1em] uppercase text-stone mb-3">
                  Max Price
                </label>
                <Select
                  value={filters.max_price}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, max_price: value }))}
                >
                  <SelectTrigger className="w-full bg-charcoal border-stone/20 text-ivory" data-testid="filter-max-price-select">
                    <SelectValue placeholder="No Maximum" />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal border-stone/20">
                    <SelectItem value="25000000" className="text-ivory">Up to $25M</SelectItem>
                    <SelectItem value="35000000" className="text-ivory">Up to $35M</SelectItem>
                    <SelectItem value="45000000" className="text-ivory">Up to $45M</SelectItem>
                    <SelectItem value="100000000" className="text-ivory">Up to $100M</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block font-sans text-xs tracking-[0.1em] uppercase text-stone mb-3">
                  Bedrooms
                </label>
                <Select
                  value={filters.bedrooms}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, bedrooms: value }))}
                >
                  <SelectTrigger className="w-full bg-charcoal border-stone/20 text-ivory" data-testid="filter-bedrooms-select">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal border-stone/20">
                    <SelectItem value="3" className="text-ivory">3+ Bedrooms</SelectItem>
                    <SelectItem value="4" className="text-ivory">4+ Bedrooms</SelectItem>
                    <SelectItem value="5" className="text-ivory">5+ Bedrooms</SelectItem>
                    <SelectItem value="6" className="text-ivory">6+ Bedrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-charcoal" />
                  <div className="mt-6 space-y-3">
                    <div className="h-6 bg-charcoal w-3/4" />
                    <div className="h-4 bg-charcoal w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-serif text-2xl text-stone">No properties match your criteria</p>
              <button
                onClick={clearFilters}
                className="btn-luxury mt-8"
                data-testid="no-results-clear-btn"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {properties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Properties;
