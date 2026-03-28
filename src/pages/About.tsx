import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Target, Award } from 'lucide-react';

const team = [
  { name: 'Sally', role: 'Owner & Lead Stylist', bio: 'With over 15 years of experience, Sally founded Sasyl to bring premium grooming to Donholm.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
  { name: 'James', role: 'Master Barber', bio: 'Specialist in classic fades and traditional hot towel shaves.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' },
  { name: 'Grace', role: 'Natural Hair Expert', bio: 'The magic behind our signature TikTok natural hairstyles and braiding.', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400' },
  { name: 'David', role: 'Spa Therapist', bio: 'Expert in Moroccan baths and deep tissue massage therapy.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400' },
];

export default function About() {
  return (
    <div className="bg-black min-h-screen pb-24">
      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-orange-500 font-bold uppercase tracking-[0.3em] text-xs mb-6 block">Our Story</span>
              <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
                THE HEART <br />
                BEHIND <span className="text-orange-500">SASYL.</span>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Founded by Sally, Sasyl Barber, Spa and Salon was born out of a passion for excellence in grooming and a commitment to the Donholm community. What started as a small barber shop has grown into a full-service sanctuary for both men and women.
              </p>
              <p className="text-white/40 leading-relaxed">
                Our name represents our core values: Style, Authenticity, Service, Youthfulness, and Luxury. Every client who walks through our doors is treated with the utmost care and professionalism.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="aspect-square rounded-[60px] overflow-hidden border-8 border-white/5">
                <img
                  src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=1000"
                  alt="Sally at work"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-zinc-900 p-8 rounded-3xl border border-white/10 hidden md:block">
                <Heart className="h-8 w-8 text-orange-500 mb-4" />
                <p className="text-white font-bold text-xl">Built on Passion</p>
                <p className="text-white/40 text-sm">Since 2014</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-24 px-4 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Target, title: 'Our Mission', desc: 'To provide world-class grooming and wellness services that empower our clients to look and feel their absolute best.' },
              { icon: Users, title: 'Our Community', desc: 'We are proud to be a cornerstone of the Donholm community, providing a space for connection and care.' },
              { icon: Award, title: 'Our Quality', desc: 'We never compromise on quality, from the products we use to the continuous training of our expert team.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-10 rounded-3xl bg-white/5 border border-white/10"
              >
                <item.icon className="h-10 w-10 text-orange-500 mb-8" />
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-white/50 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 uppercase">Meet the Experts</h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Our team of highly skilled professionals is dedicated to providing you with an exceptional experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-6 relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <p className="text-white/80 text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-1">{member.name}</h4>
                <p className="text-orange-500 text-xs font-bold uppercase tracking-widest">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
