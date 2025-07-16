import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bike, Users, Shield, Calendar, Wrench, FileText } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Welcome to <span className="text-[#FF3B30]">ThrottleCove</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Your ultimate digital garage and motorcycle community platform. 
            Manage your rides, connect with fellow enthusiasts, and keep track of your maintenance.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#FF3B30] hover:bg-[#D32F2F] text-white px-8 py-3 text-lg"
              onClick={() => window.location.href = '/api/login'}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Everything You Need for Your Motorcycle Journey
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            From digital garage management to community rides, ThrottleCove has all the tools you need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Bike className="w-10 h-10 text-[#FF3B30] mb-2" />
              <CardTitle className="text-white">Digital Garage</CardTitle>
              <CardDescription className="text-gray-300">
                Manage multiple motorcycles with detailed specifications, photos, and documentation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Wrench className="w-10 h-10 text-[#FF3B30] mb-2" />
              <CardTitle className="text-white">Maintenance Tracking</CardTitle>
              <CardDescription className="text-gray-300">
                Never miss a service with scheduled maintenance reminders and complete service history.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Users className="w-10 h-10 text-[#FF3B30] mb-2" />
              <CardTitle className="text-white">Community</CardTitle>
              <CardDescription className="text-gray-300">
                Connect with fellow riders, organize group rides, and share your experiences.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <FileText className="w-10 h-10 text-[#FF3B30] mb-2" />
              <CardTitle className="text-white">Document Vault</CardTitle>
              <CardDescription className="text-gray-300">
                Securely store all your vehicle documents with expiration alerts and easy access.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Calendar className="w-10 h-10 text-[#FF3B30] mb-2" />
              <CardTitle className="text-white">Events & Rides</CardTitle>
              <CardDescription className="text-gray-300">
                Discover local events, plan group rides, and never miss a motorcycle gathering.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Shield className="w-10 h-10 text-[#FF3B30] mb-2" />
              <CardTitle className="text-white">Secure & Private</CardTitle>
              <CardDescription className="text-gray-300">
                Your data is protected with enterprise-grade security and privacy controls.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="bg-gray-800 border-gray-700 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Ready to Get Started?</CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Join thousands of motorcycle enthusiasts already using ThrottleCove.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              size="lg" 
              className="bg-[#FF3B30] hover:bg-[#D32F2F] text-white px-8 py-3 text-lg"
              onClick={() => window.location.href = '/api/login'}
            >
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}