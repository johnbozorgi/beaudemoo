import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Microscope, 
  Search, 
  BookOpen, 
  ExternalLink, 
  Bookmark, 
  Share2, 
  Sparkles, 
  Dna, 
  HeartPulse, 
  PawPrint,
  TrendingUp,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDashboard } from "@/context/DashboardContext";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  summary: string;
  category: 'Individual' | 'Family' | 'Pet';
  tags: string[];
  date: string;
  source: string;
  relevance: number;
  image: string;
  readTime: string;
}

const MOCK_ARTICLES: Article[] = [
  {
    id: "art1",
    title: "Breakthrough in Personalized CRISPR Gene Editing for Longevity",
    summary: "New research shows how individual genetic markers can be used to tailor CRISPR treatments, potentially extending healthy lifespan by up to 15%.",
    category: "Individual",
    tags: ["Genetics", "Longevity", "CRISPR"],
    date: "Mar 28, 2026",
    source: "Nature Biotechnology",
    relevance: 98,
    image: "https://picsum.photos/seed/gene/800/400",
    readTime: "8 min"
  },
  {
    id: "art2",
    title: "The Impact of Shared Microbiomes on Family Health Dynamics",
    summary: "A comprehensive study reveals how living in the same environment shapes the family microbiome, influencing collective immunity and metabolic health.",
    category: "Family",
    tags: ["Microbiome", "Immunity", "Environment"],
    date: "Mar 25, 2026",
    source: "Cell Host & Microbe",
    relevance: 92,
    image: "https://picsum.photos/seed/family/800/400",
    readTime: "12 min"
  },
  {
    id: "art4",
    title: "Epigenetic Clock Synchronization in Multi-Generational Households",
    summary: "Research explores how shared lifestyle factors in multi-generational homes can synchronize biological aging markers among family members.",
    category: "Family",
    tags: ["Epigenetics", "Aging", "Lifestyle"],
    date: "Mar 15, 2026",
    source: "Aging Cell",
    relevance: 88,
    image: "https://picsum.photos/seed/aging/800/400",
    readTime: "10 min"
  }
];

export default function ResearchArticles() {
  const { activeContext } = useDashboard();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);

  useEffect(() => {
    // Auto-filter based on context
    if (activeContext === 'individual') setSelectedCategory('Individual');
    else if (activeContext === 'family') setSelectedCategory('Family');
  }, [activeContext]);

  const filteredArticles = articles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory ? art.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleSave = (id: string) => {
    toast.success("Article saved to your research library");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500 mb-2">Scientific Grounding</h2>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic serif flex items-center gap-3">
            Research Articles <Microscope className="h-8 w-8 text-blue-500" />
          </h1>
          <p className="text-zinc-500 mt-2 text-sm">Discover the latest breakthroughs in biological intelligence and personalized health.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/5">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${!selectedCategory ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:text-white'}`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedCategory('Individual')}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${selectedCategory === 'Individual' ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:text-white'}`}
          >
            Individual
          </button>
          <button
            onClick={() => setSelectedCategory('Family')}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${selectedCategory === 'Family' ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-white'}`}
          >
            Family
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-black/40 border border-white/5 p-4 rounded-3xl">
        <Search className="h-5 w-5 text-zinc-600 ml-2" />
        <Input 
          placeholder="Search by topic, gene, or discovery..." 
          className="bg-transparent border-none outline-none text-sm font-bold uppercase tracking-widest text-white placeholder:text-zinc-700 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="ghost" className="text-zinc-600 hover:text-white">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-black/40 border-white/5 hover:border-white/10 transition-all overflow-hidden group h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge className={
                      article.category === 'Individual' ? "bg-blue-600" : 
                      article.category === 'Family' ? "bg-indigo-600" : "bg-emerald-600"
                    }>
                      {article.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/80 uppercase tracking-widest">
                      <TrendingUp className="h-3 w-3 text-emerald-400" />
                      {article.relevance}% Match
                    </div>
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{article.readTime} Read</span>
                  </div>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{article.source}</span>
                      <span className="h-1 w-1 rounded-full bg-zinc-700" />
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{article.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight mb-3 group-hover:text-blue-400 transition-colors leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3 mb-4">
                      {article.summary}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {article.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 border border-white/5 rounded-lg text-zinc-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <Button variant="ghost" className="text-zinc-500 hover:text-white p-0 h-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                      <BookOpen className="h-4 w-4" /> Read Full Article
                    </Button>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleSave(article.id)} className="p-2 rounded-xl hover:bg-white/5 text-zinc-600 hover:text-blue-400 transition-all">
                        <Bookmark className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-xl hover:bg-white/5 text-zinc-600 hover:text-white transition-all">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Personalized Insights */}
      <section className="mt-12">
        <Card className="bg-blue-600/5 border-blue-500/10 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Sparkles className="h-32 w-32 text-blue-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400 mb-4">AI Research Synthesis</h3>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic serif mb-6 max-w-2xl">
              Why these articles matter for your unique biological profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                  <Dna className="h-5 w-5 text-blue-400" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-widest">Genetic Alignment</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  The CRISPR research directly relates to your <span className="text-blue-400">FOXO3</span> gene variant identified in your last DNA upload.
                </p>
              </div>
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                  <HeartPulse className="h-5 w-5 text-purple-400" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-widest">Metabolic Impact</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Microbiome synchronization studies explain the recent shift in your family's collective metabolic markers.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
