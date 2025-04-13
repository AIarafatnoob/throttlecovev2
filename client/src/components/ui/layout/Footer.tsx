import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  ArrowRight 
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold font-header mb-4 uppercase">ThrottleCove</h3>
            <p className="text-gray-400 mb-4">
              Your digital garage and motorcycle community platform. Maintain your rides, 
              connect with riders, and experience the joy of motorcycling.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white transition-all">
                <Facebook size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white transition-all">
                <Twitter size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white transition-all">
                <Instagram size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white transition-all">
                <Youtube size={20} />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Features</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/garage" className="text-gray-400 hover:text-white transition-all">
                  Digital Garage
                </Link>
              </li>
              <li>
                <Link href="/maintenance" className="text-gray-400 hover:text-white transition-all">
                  Maintenance Tracker
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-400 hover:text-white transition-all">
                  Rider Community
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-gray-400 hover:text-white transition-all">
                  Motorcycle Catalog
                </Link>
              </li>
              <li>
                <Link href="/rides" className="text-gray-400 hover:text-white transition-all">
                  Ride Planning
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition-all">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-all">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-all">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-all">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-all">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Stay updated with the latest features, motorcycle news, and community events.
            </p>
            <form className="flex mb-4">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-white/10 rounded-r-none focus:ring-0 border-0"
              />
              <Button className="bg-[#FF3B30] hover:bg-opacity-90 transition-all rounded-l-none">
                <ArrowRight size={18} />
              </Button>
            </form>
            <p className="text-xs text-gray-400">
              By subscribing you agree to our Privacy Policy
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© {new Date().getFullYear()} ThrottleCove. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-all">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-all">
              Terms
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white transition-all">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
