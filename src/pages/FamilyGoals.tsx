import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function FamilyGoals() {
  const navigate = useNavigate();
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white serif">
          Family Health Goals
        </h1>
      </div>
      <Card className="bg-[#0a0a0a] border-zinc-800 rounded-[2rem]">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-blue-400">
            <Target className="h-5 w-5" />
            Shared Wellness Objectives
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12 text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-blue-600/10 flex items-center justify-center mx-auto border border-blue-500/20">
            <Sparkles className="h-8 w-8 text-blue-400" />
          </div>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">
            Set and track collective family goals like sleep, movement, and nutrition.
          </p>
          <p className="text-zinc-600 text-xs">
            This module is currently being initialized for your family profile.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
