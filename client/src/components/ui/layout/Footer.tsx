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
    <footer className="bg-[#1A1A1A] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <h3 className="text-lg font-bold font-header uppercase">ThrottleCove</h3>
            <p className="text-gray-400 text-sm text-center md:text-left">
              Your digital garage and motorcycle community platform.
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white transition-all h-8 w-8">
                <Facebook size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white transition-all h-8 w-8">
                <Twitter size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white transition-all h-8 w-8">
                <Instagram size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white transition-all h-8 w-8">
                <Youtube size={16} />
              </Button>
            </div>
            
            <div className="flex space-x-4 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-all">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-all">
                Terms
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-4 mt-4 text-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} ThrottleCove. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
