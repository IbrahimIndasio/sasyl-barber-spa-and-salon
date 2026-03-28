import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';

const defaultFormValues = {
  name: '',
  email: '',
  subject: 'General Inquiry',
  message: '',
};

export default function Contact() {
  const [formStatus, setFormStatus] = React.useState<'idle' | 'opening' | 'opened'>('idle');
  const [formValues, setFormValues] = React.useState(defaultFormValues);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormStatus('opening');

    const subject = encodeURIComponent(`${formValues.subject} - ${formValues.name}`);
    const body = encodeURIComponent(
      [
        `Name: ${formValues.name}`,
        `Email: ${formValues.email}`,
        '',
        formValues.message,
      ].join('\n'),
    );

    window.location.href = `mailto:sallykeshi@gmail.com?subject=${subject}&body=${body}`;
    setFormStatus('opened');
  };

  return (
    <div className="bg-black min-h-screen pb-24">
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 uppercase">Get in Touch</h1>
            <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
              Have a question or want to book a custom appointment? We&apos;re here to help. Reach out to us via any of the channels below.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <Phone className="h-8 w-8 text-orange-500 mb-6" />
                  <h4 className="font-bold mb-2 uppercase tracking-widest text-sm">Call Us</h4>
                  <a href="tel:0722226501" className="text-2xl font-bold hover:text-orange-500 transition-colors">0722 226501</a>
                </div>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <Mail className="h-8 w-8 text-orange-500 mb-6" />
                  <h4 className="font-bold mb-2 uppercase tracking-widest text-sm">Email Us</h4>
                  <a href="mailto:sallykeshi@gmail.com" className="text-lg font-bold hover:text-orange-500 transition-colors break-all">sallykeshi@gmail.com</a>
                </div>
              </div>

              <div className="p-10 rounded-3xl bg-white/5 border border-white/10">
                <MapPin className="h-8 w-8 text-orange-500 mb-6" />
                <h4 className="font-bold mb-4 uppercase tracking-widest text-sm">Visit Us</h4>
                <p className="text-2xl font-bold mb-6 leading-tight">Lenana Road Theta Lane, Donholm, Nairobi</p>
                <div className="aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-white/10">
                  <iframe
                    title="Sasyl Barber, Spa and Salon location"
                    src="https://www.google.com/maps?q=Lenana%20Road%20Theta%20Lane%2C%20Donholm%2C%20Nairobi&output=embed"
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <a
                  href="https://www.google.com/maps/search/Lenana+Road+Theta+Lane,+Donholm,+Nairobi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-orange-500 font-bold uppercase tracking-widest text-xs border-b border-orange-500 pb-1"
                >
                  Open in Maps
                </a>
              </div>

              <div className="p-10 rounded-3xl bg-zinc-950 border border-white/10">
                <Clock className="h-8 w-8 text-orange-500 mb-6" />
                <h4 className="font-bold mb-6 uppercase tracking-widest text-sm">Opening Hours</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="text-white/60">Monday - Saturday</span>
                    <span className="font-bold">7:30 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Sunday</span>
                    <span className="font-bold">8:00 AM - 12:00 AM</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-10 md:p-16 rounded-[60px]">
              <div className="mb-12">
                <MessageSquare className="h-10 w-10 text-orange-500 mb-6" />
                <h2 className="text-4xl font-bold tracking-tighter mb-4 uppercase">Send a Message</h2>
                <p className="text-white/50">This form opens a pre-filled email draft so you can reach the team from any static deployment.</p>
              </div>

              {formStatus === 'opened' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-orange-500/10 border border-orange-500/30 p-10 rounded-3xl text-center"
                >
                  <Send className="h-12 w-12 text-orange-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-2">Email Draft Opened</h3>
                  <p className="text-white/60 mb-8">If your mail app did not open, you can call us directly or create another draft.</p>
                  <button
                    onClick={() => {
                      setFormStatus('idle');
                      setFormValues(defaultFormValues);
                    }}
                    className="text-orange-500 font-bold uppercase tracking-widest text-xs border-b border-orange-500 pb-1"
                  >
                    Create another draft
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-4">Full Name</label>
                      <input
                        required
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formValues.name}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-orange-500 outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-4">Email Address</label>
                      <input
                        required
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formValues.email}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-orange-500 outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-4">Subject</label>
                    <select
                      name="subject"
                      value={formValues.subject}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-orange-500 outline-none transition-colors appearance-none"
                    >
                      <option className="bg-black">General Inquiry</option>
                      <option className="bg-black">Booking Question</option>
                      <option className="bg-black">Feedback</option>
                      <option className="bg-black">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-4">Message</label>
                    <textarea
                      required
                      name="message"
                      rows={6}
                      placeholder="How can we help you?"
                      value={formValues.message}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-orange-500 outline-none transition-colors resize-none"
                    ></textarea>
                  </div>
                  <button
                    disabled={formStatus === 'opening'}
                    className="w-full bg-orange-500 text-black py-5 rounded-full font-bold uppercase tracking-widest hover:bg-orange-400 transition-all disabled:opacity-50 flex items-center justify-center space-x-3"
                  >
                    <span>{formStatus === 'opening' ? 'Opening Email...' : 'Open Email Draft'}</span>
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
