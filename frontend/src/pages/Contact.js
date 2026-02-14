import { motion } from 'framer-motion';
import InquiryForm from '../components/InquiryForm';
import { MapPin, Mail, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-midnight min-h-screen pt-24" data-testid="contact-page">
      {/* Header */}
      <section className="py-16 md:py-24 border-b border-stone/10">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-champagne">Contact</span>
            <h1 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl text-ivory">
              Begin the Conversation
            </h1>
            <p className="mt-6 font-sans text-base text-stone max-w-xl">
              Every exceptional acquisition begins with a private conversation. 
              Share your requirements, and we'll present properties worthy of your consideration.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-4"
            >
              <div className="space-y-12">
                <div>
                  <div className="flex items-center gap-3 text-champagne mb-4">
                    <MapPin strokeWidth={1} size={20} />
                    <h3 className="font-sans text-xs tracking-[0.2em] uppercase">Office</h3>
                  </div>
                  <p className="font-sans text-base text-ivory/80">
                    By appointment only<br />
                    Private consultations arranged<br />
                    at your preferred location
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 text-champagne mb-4">
                    <Mail strokeWidth={1} size={20} />
                    <h3 className="font-sans text-xs tracking-[0.2em] uppercase">Email</h3>
                  </div>
                  <p className="font-sans text-base text-ivory/80">
                    inquiries@quietwealth.com
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 text-champagne mb-4">
                    <Clock strokeWidth={1} size={20} />
                    <h3 className="font-sans text-xs tracking-[0.2em] uppercase">Response</h3>
                  </div>
                  <p className="font-sans text-base text-ivory/80">
                    All inquiries receive a response<br />
                    within 24 hours
                  </p>
                </div>

                <div className="pt-8 border-t border-stone/10">
                  <p className="font-serif text-xl text-ivory italic">
                    "Discretion is not merely policy—<br />
                    it is principle."
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="lg:col-span-7 lg:col-start-6"
            >
              <div className="bg-charcoal p-8 md:p-12">
                <h2 className="font-serif text-2xl md:text-3xl text-ivory mb-2">
                  Request a Consultation
                </h2>
                <p className="font-sans text-sm text-stone mb-10">
                  Tell us about your requirements. All communications are held in strict confidence.
                </p>
                <InquiryForm />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="relative h-[50vh] md:h-[60vh]">
        <img
          src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=80"
          alt="Luxury interior"
          className="w-full h-full object-cover img-muted opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-midnight/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="text-center"
          >
            <p className="font-serif text-3xl md:text-4xl text-ivory">
              Where privacy meets<br />
              <span className="italic text-champagne">possibility</span>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
