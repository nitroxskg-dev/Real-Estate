import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const InquiryForm = ({ propertyId, propertyTitle }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/inquiries`, {
        ...formData,
        property_id: propertyId,
        property_title: propertyTitle,
      });

      toast.success('Your inquiry has been received. We will be in touch shortly.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Unable to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      onSubmit={handleSubmit}
      className="space-y-8"
      data-testid="inquiry-form"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="input-luxury"
            data-testid="inquiry-name-input"
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="input-luxury"
            data-testid="inquiry-email-input"
          />
        </div>
      </div>

      <div>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone (Optional)"
          className="input-luxury"
          data-testid="inquiry-phone-input"
        />
      </div>

      <div>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your message..."
          required
          className="textarea-luxury"
          data-testid="inquiry-message-input"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-luxury-filled w-full md:w-auto disabled:opacity-50"
          data-testid="inquiry-submit-button"
        >
          {isSubmitting ? 'Sending...' : 'Send Inquiry'}
        </button>
      </div>
    </motion.form>
  );
};

export default InquiryForm;
