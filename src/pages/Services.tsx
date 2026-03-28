import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Sparkles, Star, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'barbering',
    name: 'Barbering',
    icon: Scissors,
    description: "Expert grooming for the modern man. From classic fades to precision beard shaping.",
    services: [
      { name: "Men's Haircut", price: "800", duration: "45 min", desc: "Precision cut with hot towel finish." },
      { name: "Beard Trimming & Shaping", price: "500", duration: "30 min", desc: "Expert shaping and line-up." },
      { name: "Hot Towel Shave", price: "1000", duration: "45 min", desc: "Traditional straight razor shave." },
      { name: "Hair Coloring", price: "1500", duration: "60 min", desc: "Professional grey coverage or highlights." },
    ]
  },
  {
    id: 'hair-salon',
    name: 'Hair Salon',
    icon: Sparkles,
    description: "Specializing in natural hairstyles, braiding, and modern women's styling.",
    services: [
      { name: "Natural Hairstyles", price: "2000", duration: "90 min", desc: "Creative styling for natural hair." },
      { name: "Braiding", price: "2500", duration: "180 min", desc: "All types of braids and cornrows." },
      { name: "Weaves & Extensions", price: "3500", duration: "120 min", desc: "Professional installation and styling." },
      { name: "Relaxing & Treatment", price: "1800", duration: "60 min", desc: "Deep conditioning and chemical relaxing." },
      { name: "Women's Haircut", price: "1500", duration: "60 min", desc: "Modern cuts and trims." },
    ]
  },
  {
    id: 'spa',
    name: 'Spa & Wellness',
    icon: Star,
    description: "Rejuvenating treatments to refresh your body and mind.",
    services: [
      { name: "Full Body Massage", price: "3500", duration: "60 min", desc: "Swedish or deep tissue massage." },
      { name: "Moroccan Bath", price: "4500", duration: "90 min", desc: "Traditional exfoliating steam bath." },
      { name: "Facial Treatment", price: "2500", duration: "60 min", desc: "Deep cleansing and hydration." },
      { name: "Body Scrub", price: "3000", duration: "60 min", desc: "Full body exfoliation." },
    ]
  }
];

export default function Services() {
  return (
    <div className="bg-black min-h-screen pb-24">
      {/* Header */}
      <section className="pt-32 pb-20 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8">SERVICES & PRICING</h1>
            <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
              Transparent pricing and expert care. Select from our wide range of grooming and wellness treatments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-32">
          {categories.map((cat, idx) => (
            <div key={cat.id} id={cat.id} className="scroll-mt-32">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                <div className="lg:col-span-1">
                  <div className="sticky top-32">
                    <cat.icon className="h-12 w-12 text-orange-500 mb-8" />
                    <h2 className="text-4xl font-bold tracking-tighter mb-6 uppercase">{cat.name}</h2>
                    <p className="text-white/50 leading-relaxed mb-8">{cat.description}</p>
                    <Link
                      to="/booking"
                      className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-orange-500 hover:text-black transition-all"
                    >
                      <span>Book {cat.name}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                
                <div className="lg:col-span-2 space-y-6">
                  {cat.services.map((service, sIdx) => (
                    <motion.div
                      key={service.name}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: sIdx * 0.05 }}
                      viewport={{ once: true }}
                      className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <h3 className="text-2xl font-bold group-hover:text-orange-500 transition-colors">{service.name}</h3>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-white/40 text-xs font-medium uppercase tracking-widest">
                            <Clock className="h-4 w-4 mr-2" />
                            {service.duration}
                          </div>
                          <span className="text-2xl font-bold text-white">KES {service.price}</span>
                        </div>
                      </div>
                      <p className="text-white/40 text-sm leading-relaxed">{service.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-orange-500 rounded-[50px] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Scissors className="h-64 w-64" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-black tracking-tighter mb-8 relative z-10">READY FOR A TRANSFORMATION?</h2>
          <p className="text-black/70 text-lg font-medium mb-12 max-w-2xl mx-auto relative z-10">
            Book your appointment today and experience the Sasyl difference. Our team is ready to help you look and feel your best.
          </p>
          <Link
            to="/booking"
            className="inline-block bg-black text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform relative z-10"
          >
            Book Now
          </Link>
        </div>
      </section>
    </div>
  );
}
