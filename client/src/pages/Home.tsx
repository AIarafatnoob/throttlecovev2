import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Bike, Wrench, Users, TrafficCone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="bg-[#1A1A1A] text-white relative h-[45vh] md:h-[55vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10"></div>
        <motion.img 
          src="https://images.unsplash.com/photo-1558980394-4c7c9299fe96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" 
          alt="Bike in garage" 
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
        />
        <div className="container mx-auto px-4 py-10 relative z-20 h-full flex flex-col justify-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-header leading-tight max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            YOUR DIGITAL GARAGE
          </motion.h1>
          <motion.p 
            className="mt-4 text-base md:text-lg max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Track your bikes, schedule maintenance, connect with riders, and pamper your 
            <span className="font-semibold text-[#FF3B30]"> THROTTLE</span> machines
          </motion.p>
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/garage">
              <Button 
                className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 transition-all text-white px-6 py-5 rounded font-medium text-lg group"
              >
                OPEN YOUR GARAGE
                <motion.div
                  className="inline-block ml-2"
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <TrafficCone className="h-5 w-5" />
                </motion.div>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold font-header text-[#1A1A1A]">
              Your Complete Bike Companion
            </h2>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              Manage all aspects of your motorcycle journey in one streamlined platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="text-center p-5 rounded-lg border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <motion.div 
                className="bg-[#FF3B30]/10 w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Bike className="h-7 w-7 text-[#FF3B30]" />
              </motion.div>
              <h3 className="text-lg font-bold font-header mb-2">Digital Garage</h3>
              <p className="text-gray-600 text-sm">
                Create detailed profiles for your motorcycles and track their complete history
              </p>
            </motion.div>

            <motion.div 
              className="text-center p-5 rounded-lg border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <motion.div 
                className="bg-[#FF3B30]/10 w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Wrench className="h-7 w-7 text-[#FF3B30]" />
              </motion.div>
              <h3 className="text-lg font-bold font-header mb-2">Maintenance Tracker</h3>
              <p className="text-gray-600 text-sm">
                Set reminders and keep your bikes in prime condition with our smart tools
              </p>
            </motion.div>

            <motion.div 
              className="text-center p-5 rounded-lg border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <motion.div 
                className="bg-[#FF3B30]/10 w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Users className="h-7 w-7 text-[#FF3B30]" />
              </motion.div>
              <h3 className="text-lg font-bold font-header mb-2">Rider Community</h3>
              <p className="text-gray-600 text-sm">
                Connect with fellow riders, share experiences, and join local motorcycle events
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold font-header text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What Riders Are Saying
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <motion.div 
              className="p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex items-center mb-3">
                <img
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <h4 className="font-bold text-sm">Alex Johnson</h4>
                  <p className="text-xs text-gray-500">Ducati Owner</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm italic">
                "ThrottleCove changed how I manage my bikes. The maintenance reminders have saved me from costly repairs!"
              </p>
            </motion.div>

            <motion.div 
              className="p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex items-center mb-3">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <h4 className="font-bold text-sm">Jessica Taylor</h4>
                  <p className="text-xs text-gray-500">Sport Bike Enthusiast</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm italic">
                "I've met my closest riding buddies through ThrottleCove. The ride planning tools make group rides so easy!"
              </p>
            </motion.div>

            <motion.div 
              className="p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="flex items-center mb-3">
                <img
                  src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <h4 className="font-bold text-sm">Mike Smith</h4>
                  <p className="text-xs text-gray-500">Vintage Collector</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm italic">
                "As a vintage motorcycle collector, keeping track of maintenance was a nightmare before ThrottleCove."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-12 bg-[#1A1A1A] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold font-header mb-4">
              Ready to Start Your Bike Journey?
            </h2>
            <p className="mb-6 max-w-lg mx-auto text-gray-400 text-sm">
              Join ThrottleCove today to manage your motorcycles, track maintenance, and connect with riders
            </p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/register">
                <Button 
                  className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white px-6 py-2 group"
                >
                  Create Free Account
                  <motion.div
                    className="inline-block ml-2"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </Button>
              </Link>
              <Link href="/garage">
                <Button variant="outline" className="border-2 border-white text-white px-6 py-2 hover:bg-white hover:text-[#1A1A1A] transition-colors font-medium relative overflow-hidden group">
                  <span className="relative z-10">Explore Features</span>
                  <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
