import React from 'react';
import { motion } from 'framer-motion';
import { Play, Maximize2 } from 'lucide-react';

const galleryItems = [
  { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800', category: 'Haircuts & Styles' },
  { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1593702295094-ada74bc4a19a?auto=format&fit=crop&q=80&w=800', category: 'Haircuts & Styles' },
  { id: 3, type: 'image', url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=800', category: 'Spa & Relaxation' },
  { id: 4, type: 'image', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800', category: 'Braids & Natural Hair' },
  { id: 5, type: 'image', url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800', category: 'Haircuts & Styles' },
  { id: 6, type: 'image', url: 'https://images.unsplash.com/photo-1519415510236-8559b198b52e?auto=format&fit=crop&q=80&w=800', category: 'Spa & Relaxation' },
  { id: 7, type: 'image', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800', category: 'Braids & Natural Hair' },
  { id: 8, type: 'image', url: 'https://images.unsplash.com/photo-1512690196252-741ef2c5a72c?auto=format&fit=crop&q=80&w=800', category: 'Haircuts & Styles' },
  { id: 9, type: 'image', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800', category: 'Spa & Relaxation' },
];

export default function Gallery() {
  const [filter, setFilter] = React.useState('All');
  const categories = ['All', 'Haircuts & Styles', 'Braids & Natural Hair', 'Spa & Relaxation'];

  const filteredItems = filter === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  return (
    <div className="bg-black min-h-screen pb-24">
      {/* Header */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8">OUR PORTFOLIO</h1>
            <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed mb-12">
              A visual journey through our finest work. From precision cuts to intricate braids and relaxing spa moments.
            </p>
            
            {/* Filter */}
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                    filter === cat 
                      ? 'bg-orange-500 text-black' 
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group relative aspect-square rounded-[40px] overflow-hidden bg-white/5 cursor-pointer"
              >
                <img
                  src={item.url}
                  alt={item.category}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-8 text-center">
                  <Maximize2 className="h-8 w-8 text-orange-500 mb-4" />
                  <span className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">{item.category}</span>
                  <h4 className="text-xl font-bold">Signature Style</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TikTok Integration Placeholder */}
      <section className="py-24 px-4 bg-zinc-950 mt-24">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-12 uppercase">Follow us on TikTok</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[9/16] rounded-3xl bg-white/5 flex items-center justify-center relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <Play className="h-10 w-10 text-white/50 group-hover:text-orange-500 transition-colors relative z-10" />
                <div className="absolute bottom-6 left-6 right-6 text-left z-10">
                  <p className="text-xs font-bold text-white/80">@sasyl_salon</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
