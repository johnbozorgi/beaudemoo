import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserPlus,
  Shield,
  Heart,
  Sparkles,
  Plus,
  Copy,
  Check,
  User,
  Stethoscope,
  Database,
  Activity,
  Calendar,
  GitBranch,
} from "lucide-react";
import { ExplainabilityPanel } from "@/components/ExplainabilityPanel";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  status: "connected" | "pending" | "manual";
  healthScore?: number;
}

const RELATIVE_OPTIONS = [
  "Mother",
  "Father",
  "Stepmother",
  "Stepfather",
  "Grandmother",
  "Grandfather",
  "Brother",
  "Sister",
  "Half-Brother",
  "Half-Sister",
  "Stepbrother",
  "Stepsister",
  "Spouse",
  "Partner",
  "Son",
  "Daughter",
  "Grandson",
  "Granddaughter",
  "Aunt",
  "Uncle",
  "Niece",
  "Nephew",
  "Other",
];

function normalizeRelation(relation: string) {
  return relation.trim().toLowerCase();
}

function isSelfRelation(relation: string) {
  return normalizeRelation(relation) === "self";
}

function isSpouseRelation(relation: string) {
  const r = normalizeRelation(relation);
  return r === "spouse" || r === "partner";
}

function isParentRelation(relation: string) {
  const r = normalizeRelation(relation);
  return ["mother", "father", "stepmother", "stepfather"].includes(r);
}

function isGrandparentRelation(relation: string) {
  const r = normalizeRelation(relation);
  return ["grandmother", "grandfather"].includes(r);
}

function isSiblingRelation(relation: string) {
  const r = normalizeRelation(relation);
  return ["brother", "sister", "half-brother", "half-sister", "stepbrother", "stepsister"].includes(r);
}

function isChildRelation(relation: string) {
  const r = normalizeRelation(relation);
  return ["son", "daughter"].includes(r);
}

function isGrandchildRelation(relation: string) {
  const r = normalizeRelation(relation);
  return ["grandson", "granddaughter"].includes(r);
}

function getNodeTheme(member: FamilyMember, isSelf: boolean) {
  if (isSelf) {
    return {
      ring: "border-blue-500/80 ring-4 ring-blue-500/20 bg-gradient-to-br from-blue-500/20 to-cyan-500/10",
      icon: "text-blue-300",
      badge: "bg-emerald-500/20 text-emerald-400",
    };
  }

  if (member.status === "connected") {
    return {
      ring: "border-emerald-400/60 bg-gradient-to-br from-emerald-500/15 to-zinc-900/50",
      icon: "text-zinc-100",
      badge: "bg-emerald-500/20 text-emerald-400",
    };
  }

  if (member.status === "pending") {
    return {
      ring: "border-amber-400/60 bg-gradient-to-br from-amber-500/15 to-zinc-900/50",
      icon: "text-zinc-100",
      badge: "bg-amber-500/20 text-amber-300",
    };
  }

  return {
    ring: "border-zinc-500/60 bg-gradient-to-br from-zinc-700/30 to-zinc-900/50",
    icon: "text-zinc-100",
    badge: "bg-zinc-700/50 text-zinc-300",
  };
}

function spreadPositions(count: number, start: number, end: number) {
  if (count <= 0) return [];
  if (count === 1) return [(start + end) / 2];
  return Array.from({ length: count }, (_, i) => start + ((end - start) * i) / (count - 1));
}

function aroundCenter(count: number, center: number, gap: number, min: number, max: number) {
  if (count <= 0) return [];
  if (count === 1) return [center];

  const totalWidth = gap * (count - 1);
  let start = center - totalWidth / 2;

  if (start < min) start = min;
  if (start + totalWidth > max) start = max - totalWidth;

  return Array.from({ length: count }, (_, i) => start + i * gap);
}

function TreeNode({ member }: { member: FamilyMember }) {
  const isSelf = isSelfRelation(member.relation);
  const theme = getNodeTheme(member, isSelf);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -8 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center z-20"
    >
      <div
        className={cn(
          "relative h-24 w-24 rounded-full border-[4px] shadow-[0_10px_40px_rgba(255,255,255,0.08)] backdrop-blur-xl flex items-center justify-center",
          theme.ring
        )}
      >
        <div className="absolute inset-[6px] rounded-full border border-white/10 bg-black/20" />
        {isSelf ? (
          <User className={cn("relative z-10 h-8 w-8", theme.icon)} />
        ) : (
          <Users className={cn("relative z-10 h-8 w-8", theme.icon)} />
        )}

        {member.healthScore !== undefined && (
          <div className="absolute -bottom-1 -right-1 h-9 w-9 rounded-full bg-black border-2 border-zinc-700 flex items-center justify-center shadow-xl z-20">
            <span className="text-[10px] font-black text-emerald-400">{member.healthScore}</span>
          </div>
        )}
      </div>

      <div className="mt-3 text-center">
        <h4 className="text-base font-black text-white uppercase tracking-wider leading-none">{member.name}</h4>
        <p className="text-[10px] text-zinc-400 uppercase tracking-[0.22em] mt-2">{member.relation}</p>
        <span
          className={cn(
            "inline-flex mt-3 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.18em]",
            theme.badge
          )}
        >
          {member.status}
        </span>
      </div>
    </motion.div>
  );
}

function TreePositionedNode({
  member,
  x,
  y,
}: {
  member: FamilyMember;
  x: number;
  y: number;
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <TreeNode member={member} />
    </div>
  );
}

function TreeLines({
  parents,
  grandparents,
  siblings,
  spouse,
  children,
  grandchildren,
  layout,
}: {
  parents: FamilyMember[];
  grandparents: FamilyMember[];
  siblings: FamilyMember[];
  spouse?: FamilyMember;
  children: FamilyMember[];
  grandchildren: FamilyMember[];
  layout: {
    y: {
      grandparents: number;
      parents: number;
      siblings: number;
      couple: number;
      children: number;
      grandchildren: number;
    };
    grandparentXs: number[];
    parentXs: number[];
    siblingXs: number[];
    spouseX?: number;
    selfX: number;
    childXs: number[];
    grandchildXs: number[];
  };
}) {
  const { y, grandparentXs, parentXs, siblingXs, spouseX, selfX, childXs, grandchildXs } = layout;

  const gpLineY = y.grandparents + 4;
  const parentLineY = y.parents + 4;
  const siblingLineY = y.siblings - 6;
  const coupleLineY = y.couple + 2;
  const childLineY = y.children - 6;
  const grandchildLineY = y.grandchildren - 6;

  const gpMid = grandparentXs.length ? (Math.min(...grandparentXs) + Math.max(...grandparentXs)) / 2 : 50;
  const parentMid = parentXs.length ? (Math.min(...parentXs) + Math.max(...parentXs)) / 2 : selfX;

  const siblingAllXs = [...siblingXs, selfX].sort((a, b) => a - b);
  const siblingStart = siblingAllXs.length ? Math.min(...siblingAllXs) : selfX;
  const siblingEnd = siblingAllXs.length ? Math.max(...siblingAllXs) : selfX;

  const coupleCenterX = spouseX !== undefined ? (spouseX + selfX) / 2 : selfX;

  const childStart = childXs.length ? Math.min(...childXs) : coupleCenterX;
  const childEnd = childXs.length ? Math.max(...childXs) : coupleCenterX;

  const grandchildStart = grandchildXs.length ? Math.min(...grandchildXs) : coupleCenterX;
  const grandchildEnd = grandchildXs.length ? Math.max(...grandchildXs) : coupleCenterX;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="treeGlow">
          <feGaussianBlur stdDeviation="0.15" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        stroke="rgba(255,255,255,0.92)"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        filter="url(#treeGlow)"
      >
        {grandparents.length >= 2 && (
          <line x1={Math.min(...grandparentXs)} y1={gpLineY} x2={Math.max(...grandparentXs)} y2={gpLineY} />
        )}

        {grandparents.length > 0 && parents.length > 0 && (
          <line x1={gpMid} y1={gpLineY} x2={gpMid} y2={parentLineY - 2} />
        )}

        {parents.length >= 2 && (
          <line x1={Math.min(...parentXs)} y1={parentLineY} x2={Math.max(...parentXs)} y2={parentLineY} />
        )}

        {parents.length > 0 && (
          <>
            <line x1={parentMid} y1={parentLineY} x2={parentMid} y2={siblingLineY} />
            <line x1={siblingStart} y1={siblingLineY} x2={siblingEnd} y2={siblingLineY} />
          </>
        )}

        {siblings.map((_, i) => (
          <line
            key={`sib-${i}`}
            x1={siblingXs[i]}
            y1={siblingLineY}
            x2={siblingXs[i]}
            y2={y.siblings - 3}
          />
        ))}

        <line x1={selfX} y1={siblingLineY} x2={selfX} y2={y.couple - 4} />

        {spouse && spouseX !== undefined && (
          <>
            <line x1={spouseX} y1={coupleLineY} x2={selfX} y2={coupleLineY} />
            <line x1={spouseX} y1={coupleLineY} x2={spouseX} y2={y.couple - 4} />
            <line x1={selfX} y1={coupleLineY} x2={selfX} y2={y.couple - 4} />
          </>
        )}

        {children.length > 0 && (
          <>
            <line x1={coupleCenterX} y1={coupleLineY} x2={coupleCenterX} y2={childLineY} />
            {children.length >= 2 && (
              <line x1={childStart} y1={childLineY} x2={childEnd} y2={childLineY} />
            )}
            {children.map((_, i) => (
              <line
                key={`child-${i}`}
                x1={childXs[i]}
                y1={childLineY}
                x2={childXs[i]}
                y2={y.children - 3}
              />
            ))}
          </>
        )}

        {grandchildren.length > 0 && (
          <>
            <line x1={coupleCenterX} y1={y.children + 4} x2={coupleCenterX} y2={grandchildLineY} />
            {grandchildren.length >= 2 && (
              <line x1={grandchildStart} y1={grandchildLineY} x2={grandchildEnd} y2={grandchildLineY} />
            )}
            {grandchildren.map((_, i) => (
              <line
                key={`grandchild-${i}`}
                x1={grandchildXs[i]}
                y1={grandchildLineY}
                x2={grandchildXs[i]}
                y2={y.grandchildren - 2.5}
              />
            ))}
          </>
        )}
      </g>
    </svg>
  );
}

export default function Family() {
  const navigate = useNavigate();

  const [treeCreated, setTreeCreated] = useState(false);
  const [members, setMembers] = useState<FamilyMember[]>([
    { id: "1", name: "Me", relation: "Self", status: "connected", healthScore: 92 },
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    name: "",
    relation: "Mother",
    email: "",
  });

  const personalCode = "BG-7X9P-2M";

  const familyData = useMemo(() => {
    const selfMember = members.find((m) => isSelfRelation(m.relation)) || members[0];
    const spouse = members.find((m) => isSpouseRelation(m.relation));
    const grandparents = members.filter((m) => isGrandparentRelation(m.relation));
    const parents = members.filter((m) => isParentRelation(m.relation));
    const siblings = members.filter((m) => isSiblingRelation(m.relation));
    const children = members.filter((m) => isChildRelation(m.relation));
    const grandchildren = members.filter((m) => isGrandchildRelation(m.relation));

    return {
      selfMember,
      spouse,
      grandparents,
      parents,
      siblings,
      children,
      grandchildren,
    };
  }, [members]);

  const layout = useMemo(() => {
    const y = {
      grandparents: 16,
      parents: 34,
      siblings: 52,
      couple: 68,
      children: 84,
      grandchildren: 96,
    };

    const grandparentXs =
      familyData.grandparents.length === 2
        ? [28, 72]
        : spreadPositions(familyData.grandparents.length, 18, 82);

    const parentXs =
      familyData.parents.length === 2
        ? [28, 72]
        : spreadPositions(familyData.parents.length, 18, 82);

    const selfX = familyData.spouse ? 60 : 50;
    const spouseX = familyData.spouse ? 40 : undefined;

    const siblingXs = familyData.siblings.length
      ? aroundCenter(familyData.siblings.length, 50, 14, 14, 86).filter((x) => Math.abs(x - selfX) > 6)
      : [];

    const childXs = familyData.children.length
      ? aroundCenter(familyData.children.length, familyData.spouse ? 50 : selfX, 14, 14, 86)
      : [];

    const grandchildXs = familyData.grandchildren.length
      ? aroundCenter(familyData.grandchildren.length, familyData.spouse ? 50 : selfX, 11, 14, 86)
      : [];

    return {
      y,
      grandparentXs,
      parentXs,
      siblingXs,
      spouseX,
      selfX,
      childXs,
      grandchildXs,
    };
  }, [familyData]);

  const handleCreateTree = () => {
    setTreeCreated(true);
    toast.success("Your family tree is ready. Start adding family members.");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(personalCode);
    setCopied(true);
    toast.success("Personal code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const addMember = (name: string, relation: string, status: "connected" | "pending" | "manual") => {
    const normalized = normalizeRelation(relation);

    const alreadyHasSelf = normalized === "self" && members.some((m) => isSelfRelation(m.relation));
    const alreadyHasSpouse = isSpouseRelation(relation) && members.some((m) => isSpouseRelation(m.relation));

    if (alreadyHasSelf) {
      toast.error("The family tree already has a self member.");
      return;
    }

    if (alreadyHasSpouse) {
      toast.error("You already added a spouse/partner.");
      return;
    }

    setMembers((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        relation,
        status,
      },
    ]);
  };

  const handleAddManual = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const relation = String(formData.get("relation") || "").trim();

    if (!name || !relation) {
      toast.error("Please complete the name and relation.");
      return;
    }

    if (!treeCreated) {
      toast.error("Please create the family tree first.");
      return;
    }

    addMember(name, relation, "manual");
    setShowManualModal(false);
    toast.success(`${name} added to your family tree.`);
    e.currentTarget.reset();
  };

  const handleInviteMember = () => {
    if (!inviteForm.name.trim() || !inviteForm.relation.trim()) {
      toast.error("Please enter a relative name and relation.");
      return;
    }

    if (!treeCreated) {
      toast.error("Please create the family tree first.");
      return;
    }

    addMember(inviteForm.name.trim(), inviteForm.relation.trim(), "pending");

    toast.success(
      inviteForm.email.trim()
        ? `Invitation prepared for ${inviteForm.name} (${inviteForm.email}).`
        : `${inviteForm.name} added as a pending family member.`
    );

    setInviteForm({ name: "", relation: "Mother", email: "" });
    setShowInviteModal(false);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden rounded-[3rem] mb-12">
        <div className="absolute inset-0 bg-[#08090c]">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_35%,rgba(107,114,128,0.25)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.12)_0%,transparent_40%)]" />
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <div className="h-px w-8 bg-amber-500/50" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-400">Lineage & Genetics</span>
            <div className="h-px w-8 bg-amber-500/50" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-light tracking-tighter text-white italic serif mb-6"
          >
            Family Health Tree
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 max-w-2xl mx-auto text-sm font-medium uppercase tracking-widest leading-relaxed"
          >
            Create your own family tree, start with yourself, and add relatives with connected lines.
          </motion.p>
        </div>
      </div>

      <section className="space-y-8 mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Family Tree Builder</h3>

          <div className="flex flex-wrap gap-4">
            {!treeCreated ? (
              <Button
                onClick={handleCreateTree}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-7 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.25)]"
              >
                <GitBranch className="h-3.5 w-3.5" />
                Create Family Tree
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => setShowManualModal(true)}
                  className="bg-amber-400 text-black hover:bg-amber-300 rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_30px_rgba(251,191,36,0.25)] border border-amber-200/60"
                >
                  <Plus className="h-3 w-3" />
                  Add Member
                </Button>

                <Button
                  onClick={() => setShowInviteModal(true)}
                  className="bg-[#5A5A40] hover:bg-[#4A4A30] text-white rounded-full px-6 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105"
                >
                  <UserPlus className="h-3 w-3" />
                  Invite Member
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="relative w-full h-[980px] rounded-[3rem] border border-white/10 bg-[linear-gradient(180deg,#0a0b0f_0%,#090a0d_100%)] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_30%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.08),transparent_28%)]" />
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:54px_54px]" />

          <div className="absolute top-8 left-8 z-30 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-xl shadow-xl">
            <h2 className="text-3xl italic serif text-white">{treeCreated ? "My Family Tree" : "Create Your Family Tree"}</h2>
            <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
              {treeCreated ? "Family Layout" : "Start With Yourself"}
            </p>
          </div>

          {!treeCreated ? (
            <div className="absolute inset-0 flex items-center justify-center z-20 px-6">
              <div className="max-w-xl text-center">
                <div className="mx-auto mb-8 h-24 w-24 rounded-full border border-blue-500/40 bg-blue-500/10 flex items-center justify-center">
                  <GitBranch className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className="text-4xl italic serif text-white mb-4">Build Your Family Tree</h3>
                <p className="text-zinc-400 text-sm uppercase tracking-widest leading-relaxed mb-8">
                  Click create family tree to begin. You will start with yourself, then add parents, spouse, siblings, children, and more.
                </p>
                <Button
                  onClick={handleCreateTree}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 mx-auto"
                >
                  <GitBranch className="h-4 w-4" />
                  Create Family Tree
                </Button>
              </div>
            </div>
          ) : (
            <>
              <TreeLines
                grandparents={familyData.grandparents}
                parents={familyData.parents}
                siblings={familyData.siblings}
                spouse={familyData.spouse}
                children={familyData.children}
                grandchildren={familyData.grandchildren}
                layout={layout}
              />

              <AnimatePresence>
                {familyData.grandparents.map((member, i) => (
                  <TreePositionedNode
                    key={member.id}
                    member={member}
                    x={layout.grandparentXs[i]}
                    y={layout.y.grandparents}
                  />
                ))}

                {familyData.parents.map((member, i) => (
                  <TreePositionedNode
                    key={member.id}
                    member={member}
                    x={layout.parentXs[i]}
                    y={layout.y.parents}
                  />
                ))}

                {familyData.siblings.map((member, i) => (
                  <TreePositionedNode
                    key={member.id}
                    member={member}
                    x={layout.siblingXs[i]}
                    y={layout.y.siblings}
                  />
                ))}

                {familyData.spouse && layout.spouseX !== undefined && (
                  <TreePositionedNode
                    member={familyData.spouse}
                    x={layout.spouseX}
                    y={layout.y.couple}
                  />
                )}

                <TreePositionedNode
                  member={familyData.selfMember}
                  x={layout.selfX}
                  y={layout.y.couple}
                />

                {familyData.children.map((member, i) => (
                  <TreePositionedNode
                    key={member.id}
                    member={member}
                    x={layout.childXs[i]}
                    y={layout.y.children}
                  />
                ))}

                {familyData.grandchildren.map((member, i) => (
                  <TreePositionedNode
                    key={member.id}
                    member={member}
                    x={layout.grandchildXs[i]}
                    y={layout.y.grandchildren}
                  />
                ))}
              </AnimatePresence>

              {members.length === 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 px-5 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                    You are added. Now add family members to grow the tree.
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-2">
        <div className="lg:col-span-2 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Database className="h-20 w-20 text-blue-400" />
              </div>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-400">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic serif">Family Health Data Bank</h3>
              </div>
              <p className="text-xs text-zinc-500 mb-6 leading-relaxed uppercase tracking-widest font-bold">
                Centralized repository for all family medical records and genomic data.
              </p>
              <Button
                onClick={() => navigate("/family-health-data")}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all"
              >
                Access Data Bank
              </Button>
            </div>

            <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity className="h-20 w-20 text-emerald-400" />
              </div>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-10 rounded-xl bg-emerald-600/10 border border-emerald-600/20 flex items-center justify-center text-emerald-400">
                  <Activity className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic serif">Family Health Goals</h3>
              </div>
              <p className="text-xs text-zinc-500 mb-6 leading-relaxed uppercase tracking-widest font-bold">
                Collective wellness objectives and synchronized activity targets.
              </p>
              <Button
                onClick={() => toast.info("Family goals dashboard coming soon")}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all"
              >
                View Goals
              </Button>
            </div>
          </div>

          <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic serif">Family Doctor</h3>
              </div>
              <Button
                onClick={() => navigate("/family-doctor")}
                className="h-10 px-6 bg-blue-600 text-white hover:bg-blue-700 font-black uppercase tracking-widest text-[9px] rounded-xl transition-all"
              >
                Manage Doctors
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "Dr. Elena Vance", specialty: "Family Medicine", status: "Primary Physician", icon: Stethoscope },
                { name: "Dr. Marcus Wright", specialty: "Pediatrics", status: "Specialist", icon: Heart },
              ].map((doc, i) => (
                <div key={i} className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-2xl group hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-blue-600/20 transition-colors">
                      <doc.icon className="h-6 w-6 group-hover:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">{doc.name}</h4>
                      <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{doc.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest bg-blue-400/10 px-2 py-1 rounded-full">
                      {doc.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Connected</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-10 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest rounded-xl flex items-center gap-2"
                      onClick={() => navigate("/family-doctor")}
                    >
                      <Calendar className="h-3 w-3" /> Schedule
                    </Button>
                    <Button
                      variant="outline"
                      className="h-10 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest rounded-xl flex items-center gap-2"
                      onClick={() => toast.success("Access granted to family health data")}
                    >
                      <Shield className="h-3 w-3" /> Grant Access
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-10 bg-zinc-900/30 border border-zinc-800 rounded-[3rem]">
            <ExplainabilityPanel
              title="Why add family history?"
              sources={["Clinical Genetics Guidelines", "BeauGene Polygenic Risk Models"]}
              method="Integration of self-reported family history with your genomic data to refine risk probabilities."
              recency="Static Information"
              confidence="High"
              interpretation="Many health conditions have a strong hereditary component. By mapping your family tree, the system can refine hereditary risk patterns and improve family health insight."
              action="Add close family members to improve the usefulness of the tree and connected health history."
            />
          </div>
        </div>

        <div className="space-y-8">
          <Card className="bg-[#0a0a0a] border border-zinc-800 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-zinc-800 bg-zinc-900/30">
              <CardTitle className="flex items-center gap-3 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">
                <Shield className="h-4 w-4 text-emerald-500" />
                Privacy & Sharing
              </CardTitle>
              <CardDescription className="text-[9px] font-medium text-zinc-600 uppercase tracking-widest mt-2">
                Control what family members can see
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {[
                { label: "Share Health Score", desc: "Allow family to see your overall score", active: true },
                { label: "Share Genetic Risks", desc: "Share inherited traits and risks", active: false },
                { label: "Share Activity Data", desc: "Sync daily movement metrics", active: true },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between group cursor-pointer"
                  onClick={() => toast.success(`Privacy setting updated for ${item.label}`)}
                >
                  <div>
                    <p className="text-[11px] font-bold text-white uppercase tracking-widest">{item.label}</p>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">{item.desc}</p>
                  </div>
                  <div className={cn("w-10 h-5 rounded-full relative transition-colors", item.active ? "bg-[#5A5A40]" : "bg-zinc-800")}>
                    <div className={cn("w-3 h-3 bg-white rounded-full absolute top-1 transition-all", item.active ? "right-1" : "left-1")} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
              <Sparkles className="h-24 w-24 text-white" />
            </div>
            <h4 className="text-xl font-light italic serif text-white mb-4">Genetic Insights</h4>
            <p className="text-zinc-400 text-[10px] font-medium uppercase tracking-widest leading-relaxed mb-6">
              Connecting family members helps create a clearer view of patterns across generations.
            </p>
            <Button
              variant="outline"
              className="w-full border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl font-bold uppercase tracking-widest text-[9px] h-12"
              onClick={() => toast.info("Generating genetic insights report...")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showInviteModal && treeCreated && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 max-w-md w-full relative"
            >
              <button onClick={() => setShowInviteModal(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white">
                ✕
              </button>

              <h3 className="text-2xl font-light italic serif text-white mb-2">Invite Family Member</h3>
              <p className="text-xs text-zinc-400 mb-8">
                Add a relative as a pending family member and share your personal code.
              </p>

              <div className="bg-black/50 border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center mb-6">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Your Personal Code</span>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-mono text-white tracking-wider">{personalCode}</span>
                  <button onClick={handleCopyCode} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 transition-colors">
                    {copied ? <Check className="h-5 w-5 text-emerald-400" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <input
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                  placeholder="Relative name"
                />
                <input
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                  placeholder="Email (optional)"
                />
                <select
                  value={inviteForm.relation}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, relation: e.target.value }))}
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                >
                  {RELATIVE_OPTIONS.map((relation) => (
                    <option key={relation} value={relation}>
                      {relation}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                className="w-full bg-[#5A5A40] hover:bg-[#4A4A30] text-white rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]"
                onClick={handleInviteMember}
              >
                Add Pending Invite
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showManualModal && treeCreated && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 max-w-md w-full relative"
            >
              <button onClick={() => setShowManualModal(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white">
                ✕
              </button>

              <h3 className="text-2xl font-light italic serif text-white mb-2">Add Family Member</h3>
              <p className="text-xs text-zinc-400 mb-8">
                Add a member manually and the tree will place them automatically.
              </p>

              <form onSubmit={handleAddManual} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Name</label>
                  <input
                    name="name"
                    required
                    className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Relation</label>
                  <select
                    name="relation"
                    required
                    className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                  >
                    {RELATIVE_OPTIONS.map((relation) => (
                      <option key={relation} value={relation}>
                        {relation}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-zinc-100 hover:bg-white text-black rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]"
                >
                  Add to Tree
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}