import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, MapPin, Phone, Scissors, Sparkles, Star } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Salon"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-500 text-xs font-bold uppercase tracking-[0.2em]">
            Premium Grooming & Wellness
          </span>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
            ALL YOUR <span className="text-orange-500">GROOMING</span> <br />
            NEEDS ADDRESSED.
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Experience the ultimate blend of traditional barbering, modern styling, and rejuvenating spa treatments in the heart of Donholm, Nairobi.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/booking"
              className="w-full sm:w-auto bg-orange-500 text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-orange-400 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Book Appointment</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/services"
              className="w-full sm:w-auto bg-white/5 backdrop-blur-md border border-white/10 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              View Services
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 z-10 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-white/40 text-xs uppercase tracking-[0.3em]">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span>Donholm / Lenana Road Theta Lane, Nairobi</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <span>Open until 8:00 PM</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-orange-500" />
            <span>0722 226501</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const PromotionBanner = () => {
  return (
    <div className="bg-orange-500 py-4 overflow-hidden relative">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="text-black font-black uppercase tracking-tighter text-2xl mx-8">
            10% OFF ON MASSAGE AND MOROCCAN BATH / MARCH 2026 SPECIAL / BOOK NOW /
          </span>
        ))}
      </div>
    </div>
  );
};

const QuickServices = () => {
  const services = [
    { name: "Men's Cut", price: '800', icon: Scissors, category: 'Barbering' },
    { name: 'Braiding', price: '2500', icon: Sparkles, category: 'Hair Salon' },
    { name: 'Moroccan Bath', price: '4500', icon: Star, category: 'Spa' },
  ];

  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">POPULAR SERVICES</h2>
            <p className="text-white/50 leading-relaxed">
              Our most requested treatments, delivered by experts who care about your style and well-being.
            </p>
          </div>
          <Link to="/services" className="text-orange-500 font-bold uppercase tracking-widest text-sm flex items-center space-x-2 hover:text-orange-400">
            <span>All Services</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-orange-500/50 transition-all cursor-pointer"
            >
              <div className="mb-8">
                <service.icon className="h-10 w-10 text-orange-500" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 block">{service.category}</span>
              <h3 className="text-2xl font-bold mb-4">{service.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Starting from</span>
                <span className="text-xl font-bold text-orange-500">KES {service.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Philosophy = () => {
  return (
    <section className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=1000"
                alt="Our Philosophy"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-orange-500 p-10 rounded-[40px] hidden md:block">
              <p className="text-black font-black text-6xl leading-none">10+</p>
              <p className="text-black/70 font-bold text-sm uppercase tracking-widest mt-2">Years of Excellence</p>
            </div>
          </div>
          <div>
            <span className="text-orange-500 font-bold uppercase tracking-[0.3em] text-xs mb-6 block">Our Philosophy</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 leading-tight">
              MORE THAN JUST A <br />
              <span className="italic font-serif font-light text-white/40">HAIRCUT.</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-10">
              At Sasyl, we believe that grooming is an essential part of self-care. Our mission is to provide a sanctuary where you can relax, rejuvenate, and leave feeling like the best version of yourself.
            </p>
            <ul className="space-y-6 mb-12">
              {[
                'Expert Stylists & Therapists',
                'Premium Products & Equipment',
                'Warm & Welcoming Atmosphere',
                'Personalized Client Care',
              ].map((item) => (
                <li key={item} className="flex items-center space-x-4">
                  <CheckCircle2 className="h-6 w-6 text-orange-500" />
                  <span className="text-white/80 font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/about"
              className="inline-flex items-center space-x-3 text-white font-bold uppercase tracking-widest text-sm border-b-2 border-orange-500 pb-2 hover:text-orange-500 transition-colors"
            >
              <span>Learn Our Story</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <div className="bg-black">
      <Hero />
      <PromotionBanner />
      <QuickServices />
      <Philosophy />

      <section className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-12">VISIT US TODAY</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-orange-500" />
              </div>
              <h4 className="font-bold mb-2">Location</h4>
              <p className="text-white/50 text-sm">Lenana Road Theta Lane, Donholm, Nairobi</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Phone className="h-8 w-8 text-orange-500" />
              </div>
              <h4 className="font-bold mb-2">Call Us</h4>
              <p className="text-white/50 text-sm">0722 226501</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
              <h4 className="font-bold mb-2">Hours</h4>
              <p className="text-white/50 text-sm">Mon-Sat: 7:30 AM - 8:00 PM</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
