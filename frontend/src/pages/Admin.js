import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Check, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Admin = () => {
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('properties');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    property_type: 'estate',
    bedrooms: '',
    bathrooms: '',
    area: '',
    description: '',
    features: '',
    images: '',
    featured: false,
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [propertiesRes, inquiriesRes] = await Promise.all([
        axios.get(`${API}/properties`),
        axios.get(`${API}/inquiries`),
      ]);
      setProperties(propertiesRes.data);
      setInquiries(inquiriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const seedData = async () => {
    try {
      const response = await axios.post(`${API}/seed`);
      toast.success(response.data.message);
      fetchData();
    } catch (error) {
      console.error('Error seeding data:', error);
      toast.error('Failed to seed data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (property = null) => {
    if (property) {
      setEditingProperty(property);
      setFormData({
        title: property.title,
        location: property.location,
        price: property.price.toString(),
        property_type: property.property_type,
        bedrooms: property.bedrooms.toString(),
        bathrooms: property.bathrooms.toString(),
        area: property.area.toString(),
        description: property.description,
        features: property.features.join(', '),
        images: property.images.join('\n'),
        featured: property.featured,
      });
    } else {
      setEditingProperty(null);
      setFormData({
        title: '',
        location: '',
        price: '',
        property_type: 'estate',
        bedrooms: '',
        bathrooms: '',
        area: '',
        description: '',
        features: '',
        images: '',
        featured: false,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProperty(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const propertyData = {
      title: formData.title,
      location: formData.location,
      price: parseInt(formData.price),
      property_type: formData.property_type,
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      area: parseInt(formData.area),
      description: formData.description,
      features: formData.features.split(',').map((f) => f.trim()).filter((f) => f),
      images: formData.images.split('\n').map((i) => i.trim()).filter((i) => i),
      featured: formData.featured,
    };

    try {
      if (editingProperty) {
        await axios.put(`${API}/properties/${editingProperty.id}`, propertyData);
        toast.success('Property updated successfully');
      } else {
        await axios.post(`${API}/properties`, propertyData);
        toast.success('Property created successfully');
      }
      closeModal();
      fetchData();
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Failed to save property');
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    
    try {
      await axios.delete(`${API}/properties/${id}`);
      toast.success('Property deleted');
      fetchData();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    }
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    
    try {
      await axios.delete(`${API}/inquiries/${id}`);
      toast.success('Inquiry deleted');
      fetchData();
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      toast.error('Failed to delete inquiry');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-midnight min-h-screen pt-24" data-testid="admin-page">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12"
        >
          <div>
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-champagne">Admin</span>
            <h1 className="mt-2 font-serif text-3xl md:text-4xl text-ivory">Property Management</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={seedData}
              className="btn-luxury"
              data-testid="seed-data-btn"
            >
              Seed Sample Data
            </button>
            <button
              onClick={() => openModal()}
              className="btn-luxury-filled flex items-center gap-2"
              data-testid="add-property-btn"
            >
              <Plus strokeWidth={1} size={16} />
              Add Property
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-stone/10 mb-8">
          <button
            onClick={() => setActiveTab('properties')}
            className={`pb-4 font-sans text-sm tracking-[0.1em] uppercase transition-colors duration-300 ${
              activeTab === 'properties' ? 'text-champagne border-b border-champagne' : 'text-stone hover:text-ivory'
            }`}
            data-testid="tab-properties"
          >
            Properties ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-4 font-sans text-sm tracking-[0.1em] uppercase transition-colors duration-300 ${
              activeTab === 'inquiries' ? 'text-champagne border-b border-champagne' : 'text-stone hover:text-ivory'
            }`}
            data-testid="tab-inquiries"
          >
            Inquiries ({inquiries.length})
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="font-serif text-xl text-stone">Loading...</p>
          </div>
        ) : activeTab === 'properties' ? (
          <div className="space-y-4">
            {properties.length === 0 ? (
              <div className="text-center py-12 bg-charcoal">
                <p className="font-serif text-xl text-stone">No properties yet</p>
                <p className="font-sans text-sm text-stone/60 mt-2">Click "Seed Sample Data" or "Add Property" to get started</p>
              </div>
            ) : (
              properties.map((property) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-charcoal p-6 flex flex-col md:flex-row gap-6"
                  data-testid={`admin-property-${property.id}`}
                >
                  <div className="w-full md:w-48 h-32 flex-shrink-0">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-xl text-ivory">{property.title}</h3>
                        <p className="font-sans text-sm text-stone mt-1">{property.location}</p>
                      </div>
                      {property.featured && (
                        <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-champagne bg-champagne/10 px-2 py-1">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-6 mt-4">
                      <span className="font-serif text-lg text-champagne">{formatPrice(property.price)}</span>
                      <span className="font-sans text-xs text-stone">
                        {property.bedrooms} BD · {property.bathrooms} BA · {property.area.toLocaleString()} SF
                      </span>
                    </div>
                  </div>
                  <div className="flex md:flex-col gap-2 flex-shrink-0">
                    <Link
                      to={`/properties/${property.id}`}
                      className="p-2 border border-stone/20 text-stone hover:text-ivory hover:border-stone/40 transition-colors duration-300"
                      data-testid={`view-property-${property.id}`}
                      title="View"
                    >
                      <Eye strokeWidth={1} size={18} />
                    </Link>
                    <button
                      onClick={() => openModal(property)}
                      className="p-2 border border-stone/20 text-stone hover:text-ivory hover:border-stone/40 transition-colors duration-300"
                      data-testid={`edit-property-${property.id}`}
                      title="Edit"
                    >
                      <Pencil strokeWidth={1} size={18} />
                    </button>
                    <button
                      onClick={() => deleteProperty(property.id)}
                      className="p-2 border border-stone/20 text-stone hover:text-red-400 hover:border-red-400/40 transition-colors duration-300"
                      data-testid={`delete-property-${property.id}`}
                      title="Delete"
                    >
                      <Trash2 strokeWidth={1} size={18} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <div className="text-center py-12 bg-charcoal">
                <p className="font-serif text-xl text-stone">No inquiries yet</p>
              </div>
            ) : (
              inquiries.map((inquiry) => (
                <motion.div
                  key={inquiry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-charcoal p-6"
                  data-testid={`admin-inquiry-${inquiry.id}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-serif text-xl text-ivory">{inquiry.name}</h3>
                        <span className="font-sans text-xs text-stone">{formatDate(inquiry.created_at)}</span>
                      </div>
                      <p className="font-sans text-sm text-champagne">{inquiry.email}</p>
                      {inquiry.phone && <p className="font-sans text-sm text-stone">{inquiry.phone}</p>}
                      {inquiry.property_title && (
                        <p className="font-sans text-xs text-stone/60 mt-2">Property: {inquiry.property_title}</p>
                      )}
                      <p className="font-sans text-base text-ivory/80 mt-4 p-4 bg-midnight/50 border-l-2 border-champagne/30">
                        {inquiry.message}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteInquiry(inquiry.id)}
                      className="p-2 border border-stone/20 text-stone hover:text-red-400 hover:border-red-400/40 transition-colors duration-300 flex-shrink-0"
                      data-testid={`delete-inquiry-${inquiry.id}`}
                      title="Delete"
                    >
                      <Trash2 strokeWidth={1} size={18} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/90 backdrop-blur-sm" data-testid="property-modal">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-charcoal w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-stone/10 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-ivory">
                {editingProperty ? 'Edit Property' : 'Add Property'}
              </h2>
              <button
                onClick={closeModal}
                className="text-stone hover:text-ivory transition-colors duration-300"
                data-testid="close-modal-btn"
              >
                <X strokeWidth={1} size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-xs tracking-[0.1em] uppercase text-stone mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="input-luxury"
                    data-testid="modal-title-input"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs tracking-[0.1em] uppercase text-stone mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    className="input-luxury"
                    data-testid="modal-location-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block font-sans text-xs tracking-[0.1em] uppercase text-stone mb-2">Price ($)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="input-luxury"
                    data-testid="modal-price-input"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs tracking-[0.1em] uppercase text-stone mb-2">Type</label>
                  <select
                    value={formData.property_type}
                    onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                    className="input-luxury bg-transparent"
                    data-testid="modal-type-select"
                  >
                    <option value="estate" className="bg-charcoal">Estate</option>
                    <option value="penthouse" className="bg-charcoal">Penthouse</option>
                    <option value="villa" className="bg-charcoal">Villa</option>
                    <option value="apartment" className="bg-charcoal">Apartment</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                    data-testid="modal-featured-checkbox"
                  />
                  <label htmlFor="featured" className="font-sans text-sm text-stone">Featured Property</label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block font-sans text-xs tracking-[0.1em] uppercase text-stone mb-2">Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    required
                    className="input-luxury"
                    data-testid="modal-bedrooms-input"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs tracking-[0.1em] uppercase text-stone mb-2">Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    required
                    className="input-luxury"
                    data-testid="modal-bathrooms-input"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs tracking-[0.1em] uppercase text-stone mb-2">Area (sq ft)</label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    required
                    className="input-luxury"
                    data-testid="modal-area-input"
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-xs tracking-[0.1em] uppercase text-stone mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="textarea-luxury"
                  rows={4}
                  data-testid="modal-description-input"
                />
              </div>

              <div>
                <label className="block font-sans text-xs tracking-[0.1em] uppercase text-stone mb-2">Features (comma separated)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Pool, Wine Cellar, Home Theater"
                  className="input-luxury"
                  data-testid="modal-features-input"
                />
              </div>

              <div>
                <label className="block font-sans text-xs tracking-[0.1em] uppercase text-stone mb-2">Image URLs (one per line)</label>
                <textarea
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="textarea-luxury"
                  rows={3}
                  data-testid="modal-images-input"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-luxury flex-1"
                  data-testid="modal-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-luxury-filled flex-1 flex items-center justify-center gap-2"
                  data-testid="modal-submit-btn"
                >
                  <Check strokeWidth={1} size={16} />
                  {editingProperty ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Admin;
