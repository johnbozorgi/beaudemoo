import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck, ShoppingCart, Info, Sparkles } from "lucide-react";
import { ExplainabilityPanel } from "@/components/ExplainabilityPanel";

export default function Marketplace() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Marketplace</h1>
          <p className="text-slate-400">Products personalized for your biology</p>
        </div>
        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800"><ShoppingCart className="h-4 w-4 mr-2" /> Cart (0)</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg text-slate-200">Custom Vitamin D3 + K2</CardTitle>
              <div className="bg-emerald-900/40 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full flex items-center border border-emerald-800/50">
                <BadgeCheck className="h-3 w-3 mr-1" /> 98% Match
              </div>
            </div>
            <CardDescription>Daily Supplement</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-32 bg-slate-800 rounded-md flex items-center justify-center mb-4 border border-slate-700/50">
              <span className="text-slate-500">Product Image</span>
            </div>
            
            <div className="mb-4">
              <ExplainabilityPanel 
                title="Why this is recommended"
                sources={["23andMe VDR Gene Variant", "Goal: Improve Bone Health"]}
                method="Cross-referencing genetic absorption rates with current health goals."
                recency="Real-time match"
                confidence="Very High"
                interpretation="Your VDR gene variant indicates lower absorption of Vitamin D. This specific formulation includes K2 to maximize absorption and supports your goal of improving bone health."
                action="Take daily with a meal containing healthy fats for optimal absorption."
              />
            </div>
            
            <div className="text-xl font-bold text-slate-100">$24.99 <span className="text-sm font-normal text-slate-500">/ mo</span></div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Add to Plan</Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg text-slate-200">Omega-3 Bio-Available</CardTitle>
              <div className="bg-emerald-900/40 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full flex items-center border border-emerald-800/50">
                <BadgeCheck className="h-3 w-3 mr-1" /> 95% Match
              </div>
            </div>
            <CardDescription>Heart & Brain Health</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-32 bg-slate-800 rounded-md flex items-center justify-center mb-4 border border-slate-700/50">
              <span className="text-slate-500">Product Image</span>
            </div>
            
            <div className="mb-4">
              <ExplainabilityPanel 
                title="Why this is recommended"
                sources={["Lipid Panel Trends", "Genomic Inflammation Markers"]}
                method="Analyzing systemic inflammation markers and lipid ratios."
                recency="Real-time match"
                confidence="High"
                interpretation="Your recent lipid panel shows a slightly elevated Omega-6 to Omega-3 ratio. This high-potency EPA/DHA blend will help balance your inflammatory response and support cognitive longevity."
                action="Take two softgels daily with your largest meal."
              />
            </div>
            
            <div className="text-xl font-bold text-slate-100">$34.00 <span className="text-sm font-normal text-slate-500">/ mo</span></div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Add to Plan</Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col bg-slate-900 border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full -z-10" />
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg text-slate-200">Microbiome Test Kit</CardTitle>
              <div className="bg-blue-900/40 text-blue-400 text-xs font-bold px-2 py-1 rounded-full flex items-center border border-blue-800/50">
                <Sparkles className="h-3 w-3 mr-1" /> Data Gap
              </div>
            </div>
            <CardDescription>At-home Gut Health Test</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-32 bg-slate-800 rounded-md flex items-center justify-center mb-4 border border-slate-700/50">
              <span className="text-slate-500">Product Image</span>
            </div>
            
            <div className="mb-4">
              <ExplainabilityPanel 
                title="Why this is recommended"
                sources={["Digital Twin Completeness Scan"]}
                method="Identifying missing data layers that would significantly improve predictive accuracy."
                recency="Real-time scan"
                confidence="High"
                interpretation="Your digital twin is currently missing gut microbiome data. Adding this layer will improve the accuracy of your nutritional recommendations by an estimated 40%."
                action="Order kit, collect sample at home, and mail back for analysis."
              />
            </div>
            
            <div className="text-xl font-bold text-slate-100">$149.00 <span className="text-sm font-normal text-slate-500">one-time</span></div>
          </CardContent>
          <CardFooter>
            <Button className="w-full border-slate-700 text-slate-300 hover:bg-slate-800" variant="outline">Buy Now</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
