import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Bike, Wrench, Users, TrafficCone } from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="bg-[#1A1A1A] text-white relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1558980394-4c7c9299fe96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" 
          alt="Bike in garage" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="container mx-auto px-4 py-12 relative z-20 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold font-header leading-tight max-w-2xl">
            YOUR DIGITAL GARAGE
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-xl">
            Marvel at your ride collection, connect with riders, build up your squad, and let us help 
            <span className="font-semibold"> maintain, build, upgrade</span>, and pamper your 
            <span className="text-[#FF3B30] font-semibold"> THROTTLE</span> machines
          </p>
          <div className="mt-8">
            <Link href="/garage">
              <Button className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 transition-all text-white px-8 py-6 rounded font-medium text-lg">
                OPEN YOUR GARAGE
                <TrafficCone className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-header text-[#1A1A1A]">
              Your Complete Bike Companion
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              ThrottleCove helps you manage all aspects of your motorcycle ownership experience in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all">
              <div className="bg-[#007AFF]/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Bike className="h-8 w-8 text-[#007AFF]" />
              </div>
              <h3 className="text-xl font-bold font-header mb-3">Digital Garage</h3>
              <p className="text-gray-600">
                Create profiles for all your motorcycles with detailed specifications and track maintenance history
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all">
              <div className="bg-[#FF3B30]/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Wrench className="h-8 w-8 text-[#FF3B30]" />
              </div>
              <h3 className="text-xl font-bold font-header mb-3">Maintenance Tracker</h3>
              <p className="text-gray-600">
                Set service reminders and keep your bikes in peak condition with our maintenance tools
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all">
              <div className="bg-[#1A1A1A]/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-[#1A1A1A]" />
              </div>
              <h3 className="text-xl font-bold font-header mb-3">Rider Community</h3>
              <p className="text-gray-600">
                Connect with fellow enthusiasts, share your rides, and join motorcycle events near you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-[#F6F6F6]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-header mb-6">
            Ready to Start Your Bike Journey?
          </h2>
          <p className="mb-8 max-w-2xl mx-auto text-gray-600">
            Join ThrottleCove today and discover the perfect place to manage your motorcycles,
            track maintenance, and connect with a community of passionate riders.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white px-6 py-2">
                Create Free Account
              </Button>
            </Link>
            <Link href="/garage">
              <Button variant="outline" className="border-[#1A1A1A] text-[#1A1A1A] px-6 py-2">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-header text-center mb-12">
            What Riders Are Saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold">Alex Johnson</h4>
                  <p className="text-sm text-gray-500">Ducati Owner</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "ThrottleCove has completely changed how I manage my motorcycles. The maintenance reminders
                have saved me from costly repairs multiple times!"
              </p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold">Jessica Taylor</h4>
                  <p className="text-sm text-gray-500">Sport Bike Enthusiast</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I've met some of my closest riding buddies through ThrottleCove's community features.
                The ride planning tools make organizing group rides so easy!"
              </p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold">Mike Smith</h4>
                  <p className="text-sm text-gray-500">Vintage Collector</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As someone with multiple vintage motorcycles, keeping track of maintenance was a nightmare before.
                ThrottleCove's digital garage is perfect for collectors like me."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
