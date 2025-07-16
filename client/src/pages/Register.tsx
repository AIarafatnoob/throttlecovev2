import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, Users, Wrench, Calendar, MessageSquare, Trophy, Camera } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import logo from "@/assets/tclogov2h2.svg";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const features = [
  {
    icon: Shield,
    title: "Digital Garage",
    description: "Store and manage all your motorcycles in one secure place"
  },
  {
    icon: Calendar,
    title: "Maintenance Tracking",
    description: "Never miss important service dates with smart reminders"
  },
  {
    icon: Users,
    title: "Community Hub",
    description: "Connect with riders, join group rides, and share experiences"
  },
  {
    icon: Trophy,
    title: "Achievements",
    description: "Unlock badges and track your riding milestones"
  }
];

const reviews = [
  {
    name: "Jake Rodriguez",
    rating: 5,
    comment: "Finally, a platform that gets motorcycle enthusiasts! Love the maintenance tracking.",
    avatar: "JR",
    location: "Los Angeles, CA",
    text: "This app has revolutionized how I manage my motorcycles. The maintenance tracking is a lifesaver!",
  },
  {
    name: "Sarah Chen",
    rating: 5,
    comment: "The community features are amazing. Found my local riding group here!",
    avatar: "SC",
    location: "New York, NY",
    text: "I've connected with so many riders in my area thanks to this app's community features. It's been an incredible experience!",
  },
  {
    name: "Mike Thompson",
    rating: 4,
    comment: "Great for organizing my bikes and keeping track of service history.",
    avatar: "MT",
    location: "Chicago, IL",
    text: "Organizing my bikes and tracking their service history has never been easier. A must-have for any motorcycle owner!",
  }
];

const Register = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registerData } = data;

    try {
      const res = await apiRequest("POST", "/api/auth/register", registerData);
      const user = await res.json();

      setUser(user);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/session'] });

      toast({
        title: "Registration Successful",
        description: `Welcome to ThrottleCove, ${user.fullName}!`,
      });

      navigate("/garage");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "This username or email may already be in use. Please try another.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">

          {/* Main Registration Section - Primary Focus */}
          <div className="text-center mb-8 sm:mb-12 px-4">
            <div className="flex justify-center mb-1">
              <img
                src={logo}
                alt="ThrottleCove Logo"
                className="h-20 sm:h-24 w-auto"
              />
            </div>
            <h1 className="text-lg sm:text-xl font-light text-[#1A1A1A]/70 mb-4">
              Everything You Need To Manage Your Motorcycle Life
            </h1>
          </div>

          {/* Registration Form */}
          <Card className="w-full max-w-md mx-auto mb-12 sm:mb-16 rounded-3xl shadow-2xl border-0 backdrop-blur-sm bg-white/90">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Full Name"
                      {...form.register("fullName")}
                      className="w-full h-11 sm:h-12 rounded-full"
                    />
                    {form.formState.errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.fullName.message}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      {...form.register("email")}
                      className="w-full h-11 sm:h-12 rounded-full"
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="text"
                      placeholder="Username"
                      {...form.register("username")}
                      className="w-full h-11 sm:h-12 rounded-full"
                    />
                    {form.formState.errors.username && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.username.message}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...form.register("password")}
                      className="w-full h-11 sm:h-12 rounded-full"
                    />
                    {form.formState.errors.password && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...form.register("confirmPassword")}
                      className="w-full h-11 sm:h-12 rounded-full"
                    />
                    {form.formState.errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-3/4 mx-auto bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white rounded-full px-12 disabled:opacity-50"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                <CardFooter className="text-center px-0 pb-0">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#FF3B30] hover:underline font-medium">
                      Sign in
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </CardContent>
          </Card>

          {/* Secondary Content - Features and Reviews */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-6xl mx-auto px-4">

            {/* Features Section */}
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-3">
                  Why Choose ThrottleCove?
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Everything you need in one place
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {features.map((feature, index) => (
                  <Card key={index} className="p-3 sm:p-4 bg-gray-50/50 border-gray-200 hover:bg-white hover:shadow-md transition-all">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#FF3B30]/10 rounded-lg flex items-center justify-center">
                        <feature.icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#FF3B30]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1A1A1A] mb-1 text-sm sm:text-base">
                          {feature.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

             {/* Reviews Section */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-3">
                  Trusted by Riders
                </h2>
                <p className="text-gray-600">
                  See what our community says
                </p>
              </div>

              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <Card key={index} className="p-4 bg-gray-50/50 border-gray-200">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < review.rating 
                                ? "text-yellow-400 fill-current" 
                                : "text-gray-300"
                            }`} 
                          />
                        ))}
                      </div>

                      <p className="text-gray-700 text-sm leading-relaxed italic">
                        "{review.comment}"
                      </p>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#FF3B30] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {review.avatar}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-[#1A1A1A]">
                            {review.name}
                          </p>
                          <p className="text-xs text-gray-500">Verified Rider</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                <Card className="p-4 bg-gradient-to-r from-[#FF3B30]/5 to-[#FF3B30]/10 border-[#FF3B30]/20">
                  <div className="text-center">
                    <div className="flex justify-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      4.9/5 from 2,847+ riders
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Join thousands of satisfied members
                    </p>
                  </div>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;