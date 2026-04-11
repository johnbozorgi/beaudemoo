import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Stethoscope, 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  ChevronRight,
  User,
  Activity,
  ArrowLeft
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PROVIDERS = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    title: "Longevity Specialist",
    specialty: "Internal Medicine",
    rating: 4.9,
    reviews: 128,
    location: "San Francisco, CA",
    availability: "Next: Tomorrow, 9:00 AM",
    image: "https://images.unsplash.com/photo-1559839734-2b71f153678f?auto=format&fit=crop&q=80&w=200&h=200",
    tags: ["Genomics", "Bio-hacking", "Nutrition"]
  },
  {
    id: "2",
    name: "Dr. Marcus Thorne",
    title: "Veterinary Surgeon",
    specialty: "Pet Longevity",
    rating: 4.8,
    reviews: 94,
    location: "New York, NY",
    availability: "Next: Today, 2:00 PM",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200",
    tags: ["Surgery", "Stem Cell", "Canine Health"]
  },
  {
    id: "3",
    name: "Dr. Elena Rodriguez",
    title: "Biological Dentist",
    specialty: "Oral Microbiome",
    rating: 5.0,
    reviews: 215,
    location: "Austin, TX",
    availability: "Next: Monday, 10:30 AM",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200",
    tags: ["Microbiome", "Toxicity", "Holistic"]
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    title: "Precision Oncologist",
    specialty: "Cancer Prevention",
    rating: 4.7,
    reviews: 82,
    location: "Seattle, WA",
    availability: "Next: Wednesday, 1:00 PM",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200&h=200",
    tags: ["Oncology", "Early Detection", "AI Diagnostics"]
  }
];

export default function Providers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const filteredProviders = PROVIDERS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "All" || p.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-black/50 backdrop-blur-xl border-b border-white/5 px-8">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.2)] group-hover:scale-110 transition-transform duration-500 border border-blue-500/20">
                <Logo className="h-6 w-6" color="#60A5FA" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic serif">BeauGene</span>
            </Link>
            <div className="h-8 w-px bg-white/10" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Provider Directory</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
          </Button>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic serif mb-4">
              World-Class <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                Health Providers
              </span>
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest max-w-2xl leading-relaxed">
              Connect with elite medical professionals specializing in longevity, precision medicine, and biological optimization.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
              <Input 
                placeholder="SEARCH BY NAME, SPECIALTY, OR KEYWORD..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white placeholder:text-zinc-700 focus:border-blue-500/50 transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {["All", "Internal Medicine", "Pet Longevity", "Oral Microbiome", "Cancer Prevention"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSpecialty(s)}
                  className={cn(
                    "px-6 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all",
                    selectedSpecialty === s 
                      ? "bg-white text-black border-white" 
                      : "bg-white/5 text-zinc-500 border-white/10 hover:border-white/20"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Provider Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProviders.map((provider, i) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 transition-all group">
                  <CardContent className="p-8">
                    <div className="flex gap-8">
                      <div className="relative flex-shrink-0">
                        <div className="h-32 w-32 rounded-3xl overflow-hidden border-2 border-white/10 group-hover:border-blue-500/50 transition-all">
                          <img 
                            src={provider.image} 
                            alt={provider.name}
                            className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center border-4 border-[#050505]">
                          <Stethoscope className="h-5 w-5 text-white" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic serif">{provider.name}</h3>
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{provider.title}</p>
                          </div>
                          <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                            <Star className="h-3 w-3 text-amber-500 fill-current" />
                            <span className="text-[10px] font-black text-white">{provider.rating}</span>
                          </div>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            <MapPin className="h-3.5 w-3.5" /> {provider.location}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                            <Clock className="h-3.5 w-3.5" /> {provider.availability}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {provider.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="bg-white/5 border-white/10 text-[8px] font-black uppercase tracking-widest py-1 px-3 rounded-lg text-zinc-400">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 flex gap-4">
                      <Button className="flex-1 h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                        Book Appointment
                      </Button>
                      <Button variant="outline" className="flex-1 h-14 bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredProviders.length === 0 && (
            <div className="text-center py-20">
              <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
                <Search className="h-8 w-8 text-zinc-700" />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic serif mb-2">No Providers Found</h3>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
