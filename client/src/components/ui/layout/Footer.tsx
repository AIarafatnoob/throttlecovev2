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
                <Link href="/garage">
                  <a className="text-gray-400 hover:text-white transition-all">Digital Garage</a>
                </Link>
              </li>
              <li>
                <Link href="/maintenance">
                  <a className="text-gray-400 hover:text-white transition-all">Maintenance Tracker</a>
                </Link>
              </li>
              <li>
                <Link href="/community">
                  <a className="text-gray-400 hover:text-white transition-all">Rider Community</a>
                </Link>
              </li>
              <li>
                <Link href="/catalog">
                  <a className="text-gray-400 hover:text-white transition-all">Motorcycle Catalog</a>
                </Link>
              </li>
              <li>
                <Link href="/rides">
                  <a className="text-gray-400 hover:text-white transition-all">Ride Planning</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help">
                  <a className="text-gray-400 hover:text-white transition-all">Help Center</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-400 hover:text-white transition-all">Contact Us</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-gray-400 hover:text-white transition-all">Privacy Policy</a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-gray-400 hover:text-white transition-all">Terms of Service</a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="text-gray-400 hover:text-white transition-all">FAQ</a>
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
            <Link href="/privacy">
              <a className="text-gray-400 hover:text-white transition-all">Privacy</a>
            </Link>
            <Link href="/terms">
              <a className="text-gray-400 hover:text-white transition-all">Terms</a>
            </Link>
            <Link href="/cookies">
              <a className="text-gray-400 hover:text-white transition-all">Cookies</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
