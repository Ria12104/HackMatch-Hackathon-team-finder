"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ArrowLeft, User, BookOpen, Sparkles, Code, Clock, FileText, Link as LinkIcon, Check, X } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { safeRelativePath } from "@/lib/safe-redirect";
import type { Database } from "@pairup/shared";

type UserYear = Database["public"]["Enums"]["user_year"];
type ProfileStrength = Database["public"]["Enums"]["profile_strength"];

const yearOptions: UserYear[] = ["1st", "2nd", "3rd", "4th", "alumni"];

// Static placeholders for branch/major
const branchPlaceholders = [
  "Computer Science",
  "Data Science",
  "Information Technology",
  "Business Analytics",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Design & Media"
];

// Popular options for roles
const popularRoles = [
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "AI/ML Engineer",
  "UI/UX Designer",
  "Product Manager",
  "Mobile Developer",
  "Data Scientist"
];

// Popular skills list
const popularSkills = [
  "React",
  "TypeScript",
  "Python",
  "Figma",
  "Node.js",
  "Next.js",
  "AWS",
  "PostgreSQL",
  "TailwindCSS"
];

// Skill relation database for recommendations
const skillRecommendationsMap: Record<string, string[]> = {
  "React": ["Next.js", "Redux", "TailwindCSS", "TypeScript", "Vite"],
  "TypeScript": ["React", "Node.js", "Next.js", "Express", "GraphQL"],
  "Python": ["Django", "PyTorch", "FastAPI", "Pandas", "NumPy", "TensorFlow"],
  "Figma": ["UI/UX Designer", "TailwindCSS", "CSS", "Prototyping"],
  "Node.js": ["Express", "PostgreSQL", "MongoDB", "Docker", "GraphQL"],
  "Next.js": ["React", "TailwindCSS", "TypeScript", "Prisma", "Vercel"],
  "AWS": ["Docker", "Kubernetes", "Serverless", "PostgreSQL", "S3"],
  "PostgreSQL": ["Prisma", "Node.js", "Redis", "SQL"],
  "TailwindCSS": ["React", "CSS", "Figma", "Next.js", "HTML"]
};

// Commitment vibe options
const commitmentOptions = [
  { value: "casual", label: "Casual", desc: "Just exploring / Ideation & feedback" },
  { value: "hobbyist", label: "Hobbyist", desc: "Chill vibe / Learning & networking" },
  { value: "moderate", label: "Moderate", desc: "Regular builder / Looking to finish" },
  { value: "serious", label: "Serious", desc: "Aiming to win / Fully dedicated" }
];

// Bio Prompts
const bioPrompts = [
  "I'm looking to build...",
  "My hackathon superpower is...",
  "A project idea I have is...",
  "I work best with teammates who..."
];

function ProfileSetupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") ?? "/";
  const safeNext = safeRelativePath(nextParam);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 8 onboarding steps
  const [step, setStep] = useState(1);

  // State fields
  const [displayName, setDisplayName] = useState("");
  const [year, setYear] = useState<UserYear | "">("");
  const [branch, setBranch] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [commitment, setCommitment] = useState<string>("casual");
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [promptAnswer, setPromptAnswer] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  // Input typing state
  const [roleInput, setRoleInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  // Animated placeholder for Branch
  const [branchPlaceholderIdx, setBranchPlaceholderIdx] = useState(0);
  const [branchBlurState, setBranchBlurState] = useState<"in" | "out">("in");
  const [branchFocused, setBranchFocused] = useState(false);

  // References for inputs
  const branchInputRef = useRef<HTMLInputElement>(null);

  // URL validation helpers
  function isValidGithubUrl(url: string): boolean {
    if (!url.trim()) return true;
    const c = url.trim().replace(/^https?:\/\//, "");
    return /^github\.com\/[a-zA-Z0-9_.-]+/.test(c);
  }
  function isValidLinkedinUrl(url: string): boolean {
    if (!url.trim()) return true;
    const c = url.trim().replace(/^https?:\/\//, "").replace(/^www\./, "");
    return /^linkedin\.com\/in\/[a-zA-Z0-9_-]+/.test(c);
  }
  function normalizeGithubUrl(url: string): string {
    const t = url.trim();
    if (!t) return "";
    if (t.startsWith("http://") || t.startsWith("https://")) return t;
    return `https://${t}`;
  }
  function normalizeLinkedinUrl(url: string): string {
    const t = url.trim();
    if (!t) return "";
    if (t.startsWith("http://") || t.startsWith("https://")) return t;
    return `https://${t}`;
  }

  // 1.73s vertical sliding placeholder interval for Major/Branch
  useEffect(() => {
    if (branchFocused || branch.trim()) return;
    const interval = setInterval(() => {
      setBranchBlurState("out");
      setTimeout(() => {
        setBranchPlaceholderIdx((prev) => (prev + 1) % branchPlaceholders.length);
        setBranchBlurState("in");
      }, 300);
    }, 1730);

    return () => clearInterval(interval);
  }, [branchFocused, branch]);

  // Dynamic skill recommendations
  const dynamicSkillSuggestions = useMemo(() => {
    const recommended = new Set<string>();
    selectedSkills.forEach((skill) => {
      const base = skillRecommendationsMap[skill];
      if (base) {
        base.forEach((rec) => {
          if (!selectedSkills.includes(rec)) {
            recommended.add(rec);
          }
        });
      }
    });
    // Add popular ones that aren't selected yet
    popularSkills.forEach((skill) => {
      if (!selectedSkills.includes(skill)) {
        recommended.add(skill);
      }
    });
    return Array.from(recommended).slice(0, 10);
  }, [selectedSkills]);

  // Compute final combined bio for database storage
  const combinedBio = useMemo(() => {
    if (selectedPrompt && promptAnswer.trim()) {
      return `[${selectedPrompt}] ${promptAnswer.trim()}`;
    }
    return promptAnswer.trim();
  }, [selectedPrompt, promptAnswer]);

  // Client-side completeness (9 wizard-fillable fields; looking_for_roles
  // excluded from wizard — DB trigger scores it separately from profile edit).
  const completeness = useMemo(() => {
    const hasPhone = phone.replace(/\D/g, "").length >= 10;
    const hasSocial = !!githubUrl.trim() || !!linkedinUrl.trim();
    const checks = [
      !!displayName.trim(),
      hasPhone,
      !!year,
      !!branch.trim(),
      selectedRoles.length > 0,
      selectedSkills.length > 0,
      !!commitment,
      !!combinedBio.trim(),
      hasSocial,
    ];
    const completed = checks.filter(Boolean).length;
    const score = Math.round((completed / checks.length) * 100);
    const strength: ProfileStrength = score >= 75 ? "strong" : score >= 45 ? "ready" : "starter";
    return { score, strength };
  }, [displayName, phone, year, branch, selectedRoles, selectedSkills, commitment, combinedBio, githubUrl, linkedinUrl]);

  useEffect(() => {
    async function loadInitialProfile() {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data: authData } = await supabase.auth.getUser();

        if (!authData?.user) {
          router.replace(`/login?next=${encodeURIComponent("/profile/setup")}`);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select(
            "id, display_name, phone, year, branch, primary_role, skills, availability, bio, avatar_url, github_url, linkedin_url, portfolio_url, onboarding_completed"
          )
          .eq("id", authData.user.id)
          .single();

        if (profile) {
          setDisplayName(profile.display_name ?? "");
          // Strip +91 prefix so the field only shows the local number
          const raw = profile.phone ?? "";
          setPhone(raw.startsWith("+91") ? raw.slice(3) : raw);
          setYear(profile.year ?? "");
          setBranch(profile.branch ?? "");
          setSelectedRoles(profile.primary_role ? [profile.primary_role] : []);
          setSelectedSkills(profile.skills ?? []);

          // Parse bio prompt if it exists
          const bioVal = profile.bio ?? "";
          const promptMatch = bioVal.match(/^\[(.*?)\]\s*(.*)$/);
          if (promptMatch) {
            setSelectedPrompt(promptMatch[1]);
            setPromptAnswer(promptMatch[2]);
          } else {
            setPromptAnswer(bioVal);
          }

          if (profile.availability) {
            const found = commitmentOptions.find(o => o.label.toLowerCase() === profile.availability?.toLowerCase() || o.value === profile.availability);
            if (found) setCommitment(found.value);
          }

          setGithubUrl(profile.github_url ?? "");
          setLinkedinUrl(profile.linkedin_url ?? "");
        }
      } catch (err) {
        console.error("Error fetching initial profile:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialProfile();
  }, [router]);

  // Save changes to database
  async function handleSave() {
    if (!displayName.trim()) {
      setError("Display name is required.");
      setStep(1);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient();
      const { data: authData } = await supabase.auth.getUser();

      if (!authData?.user) {
        router.replace("/login");
        return;
      }

      // Map commitment value back to human label for availability string
      const matchedOption = commitmentOptions.find(o => o.value === commitment);
      const availabilityLabel = matchedOption ? matchedOption.label : commitment;

      const phoneDigits = phone.replace(/\D/g, "");
      const payload = {
        display_name: displayName.trim(),
        phone: phoneDigits ? `+91${phoneDigits}` : null,
        year: year || null,
        branch: branch.trim() || null,
        primary_role: selectedRoles[0] || null,
        skills: selectedSkills,
        availability: availabilityLabel,
        bio: combinedBio || null,
        github_url: normalizeGithubUrl(githubUrl) || null,
        linkedin_url: normalizeLinkedinUrl(linkedinUrl) || null,
        onboarding_completed: true
      };

      const { error: saveError } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", authData.user.id);

      if (saveError) {
        setError(saveError.message);
      } else {
        router.push(safeNext);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  }

  // Skip: save whatever fields have been filled so far, then navigate away.
  // onboarding_completed intentionally stays false — user will be re-prompted
  // until their profile score reaches 50 or they complete the wizard.
  async function handleSkip() {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        const partial: Database["public"]["Tables"]["profiles"]["Update"] = {};
        if (displayName.trim()) partial.display_name = displayName.trim();
        const phoneDigits = phone.replace(/\D/g, "");
        if (phoneDigits) partial.phone = `+91${phoneDigits}`;
        if (year) partial.year = year;
        if (branch.trim()) partial.branch = branch.trim();
        if (selectedRoles.length > 0) partial.primary_role = selectedRoles[0];
        if (selectedSkills.length > 0) partial.skills = selectedSkills;
        if (commitment) {
          const label = commitmentOptions.find(o => o.value === commitment)?.label ?? commitment;
          partial.availability = label;
        }
        if (combinedBio.trim()) partial.bio = combinedBio.trim();
        const ghUrl = normalizeGithubUrl(githubUrl);
        const liUrl = normalizeLinkedinUrl(linkedinUrl);
        if (ghUrl) partial.github_url = ghUrl;
        if (liUrl) partial.linkedin_url = liUrl;
        if (Object.keys(partial).length > 0) {
          await supabase.from("profiles").update(partial).eq("id", authData.user.id);
        }
      }
    } catch (err) {
      console.error("Failed to save partial profile on skip:", err);
      // Never block the skip on a save error
    }
    router.push(safeNext);
  }

  // Next step handler with validation
  function handleNextStep() {
    if (step === 1) {
      if (!displayName.trim()) {
        setError("Display name is required.");
        return;
      }
    }
    setError(null);
    if (step < 7) {
      setStep((s) => s + 1);
    } else {
      handleSave();
    }
  }

  // Keyboard navigation for desktop: Pressing Enter moves forward
  function handleKeyDown(e: React.KeyboardEvent) {
    // Only advance on desktop (where pointer device hover is supported)
    const isDesktop = window.matchMedia("(hover: hover)").matches;
    if (e.key === "Enter" && isDesktop) {
      // Prevent form submit if within textarea or inputs
      e.preventDefault();
      handleNextStep();
    }
  }

  // Comma handler to turn current input text into a pill tag
  function handleCommaTrigger(
    val: string,
    setVal: React.Dispatch<React.SetStateAction<string>>,
    selectedList: string[],
    setSelectedList: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    if (val.endsWith(",")) {
      const cleanVal = val.slice(0, -1).trim();
      if (cleanVal && !selectedList.includes(cleanVal)) {
        setSelectedList([...selectedList, cleanVal]);
      }
      setVal("");
    } else {
      setVal(val);
    }
  }

  // Select/Unselect pill helper
  function togglePill(item: string, selectedList: string[], setSelectedList: React.Dispatch<React.SetStateAction<string[]>>) {
    if (selectedList.includes(item)) {
      setSelectedList(selectedList.filter((x) => x !== item));
    } else {
      setSelectedList([...selectedList, item]);
    }
  }

  if (isLoading) {
    return (
      <main className="page-stack" style={{ justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <div style={{ textAlign: "center" }}>
          <h3>Loading profile setup...</h3>
        </div>
      </main>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "linear-gradient(160deg, #fff8f6 0%, #faf5f4 40%, #f5ece9 100%)" }}>
      {/* Custom inline Styles for rich Hinge interactions */}
      <style>{`
        .hinge-container {
          max-width: 420px;
          margin: 0 auto;
          width: 100%;
          padding: 24px 24px 48px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .hinge-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .hinge-back-btn {
          color: var(--on-surface-variant);
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .hinge-skip-btn {
          color: var(--on-surface-variant);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: 1.5px solid var(--outline-variant);
          border-radius: var(--radius-full);
          padding: 6px 14px;
          transition: background-color 0.2s, border-color 0.2s;
          background: transparent;
        }
        .hinge-skip-btn:hover {
          background-color: var(--surface-container);
          border-color: var(--on-surface-variant);
        }
        .hinge-progress-bar {
          height: 5px;
          background: var(--surface-container);
          width: 100%;
          border-radius: var(--radius-full);
          margin-bottom: 40px;
          overflow: hidden;
        }
        .hinge-progress-fill {
          height: 100%;
          background: var(--primary);
          transition: width 0.3s ease;
        }
        .hinge-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--primary-container);
          color: var(--primary);
          display: grid;
          place-items: center;
          margin-bottom: 20px;
        }
        .hinge-question-title {
          font-size: 28px;
          font-weight: 800;
          color: var(--on-surface);
          line-height: 1.25;
          margin-bottom: 28px;
          font-family: var(--font-display);
          letter-spacing: -0.02em;
        }

        /* Animated Placeholder for Branch Input */
        .branch-input-container {
          position: relative;
          width: 100%;
          margin-bottom: 16px;
        }
        .branch-scrolling-placeholder {
          position: absolute;
          left: 0;
          top: 10px;
          font-size: 20px;
          color: var(--outline-variant);
          pointer-events: none;
          display: flex;
          flex-direction: column;
        }
        .placeholder-blur-in {
          transform: translateY(0);
          filter: blur(0px);
          opacity: 1;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), filter 0.35s ease, opacity 0.35s ease;
        }
        .placeholder-blur-out {
          transform: translateY(-12px);
          filter: blur(4px);
          opacity: 0;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), filter 0.35s ease, opacity 0.35s ease;
        }

        .hinge-input-field {
          border: none;
          border-bottom: 2px solid var(--outline-variant);
          border-radius: 0;
          background: transparent;
          width: 100%;
          padding: 10px 0;
          font-size: 22px;
          font-weight: 500;
          color: var(--on-surface);
          outline: none;
          transition: border-color 0.2s ease;
        }
        .hinge-input-field:focus {
          border-bottom-color: var(--primary);
        }
        .hinge-input-field::placeholder {
          color: var(--outline-variant);
          font-weight: 400;
        }

        /* Pill / Tag styles */
        .pill-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }
        .pill-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1.5px solid var(--outline-variant);
          background: var(--surface-lowest);
          color: var(--on-surface-variant);
        }
        .pill-tag.selected {
          background: var(--primary);
          border-color: var(--primary);
          color: #fff;
        }
        .pill-tag:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        .pill-tag.selected:hover {
          opacity: 0.9;
          color: #fff;
        }
        .pill-remove-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          width: 14px;
          height: 14px;
          background: rgba(255, 255, 255, 0.2);
          color: inherit;
        }

        .hinge-select-field {
          border: none;
          border-bottom: 2px solid var(--outline-variant);
          border-radius: 0;
          background: transparent;
          width: 100%;
          padding: 10px 0;
          font-size: 20px;
          font-weight: 500;
          color: var(--on-surface);
          outline: none;
          cursor: pointer;
        }
        .hinge-select-field:focus {
          border-bottom-color: var(--primary);
        }

        /* Commitment block styles */
        .commitment-grid {
          display: grid;
          gap: 12px;
          margin-bottom: 20px;
        }
        .commitment-card {
          padding: 16px;
          border: 1.5px solid var(--outline-variant);
          border-radius: var(--radius-sm);
          background: var(--surface-lowest);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: left;
        }
        .commitment-card.active {
          border-color: var(--primary);
          background: var(--primary-container);
        }
        .commitment-card:hover {
          border-color: var(--primary);
        }
        .commitment-card-title {
          font-size: 15px;
          font-weight: 800;
          color: var(--on-surface);
        }
        .commitment-card-desc {
          font-size: 12px;
          color: var(--on-surface-variant);
        }

        /* Prompt pitching block */
        .prompt-textbox-container {
          border: 1.5px solid var(--outline-variant);
          border-radius: var(--radius-sm);
          background: var(--surface-lowest);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: border-color 0.2s ease;
        }
        .prompt-textbox-container:focus-within {
          border-color: var(--primary);
        }
        .prompt-header-tag {
          align-self: flex-start;
          background: var(--primary-container);
          color: var(--primary);
          font-size: 13px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .prompt-textarea {
          border: none;
          outline: none;
          background: transparent;
          font-size: 16px;
          color: var(--on-surface);
          resize: none;
          min-height: 120px;
          width: 100%;
          line-height: 1.5;
        }
        .prompt-textarea::placeholder {
          color: var(--outline-variant);
        }

        .hinge-helper-text {
          font-size: 13px;
          color: var(--on-surface-variant);
          margin-top: 12px;
          line-height: 1.5;
        }
        .hinge-footer-nav {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-top: auto;
          padding-top: 48px;
        }
        .hinge-next-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--primary);
          color: #fff;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
          box-shadow: 0 4px 12px rgba(124, 29, 44, 0.15);
        }
        .hinge-next-btn:hover {
          opacity: 0.95;
          transform: scale(1.02);
        }
        .hinge-next-btn:active {
          transform: scale(0.98);
        }
        .hinge-next-btn.disabled {
          background: var(--surface-container);
          color: var(--on-surface-variant);
          cursor: not-allowed;
          box-shadow: none;
        }
        .hinge-benefit-box {
          margin-top: 32px;
          font-size: 12px;
          color: var(--on-surface-variant);
          text-align: center;
          line-height: 1.4;
        }
      `}</style>

      <div className="hinge-container">
        {/* Navigation Bar */}
        <div className="hinge-nav">
          {step > 1 ? (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="hinge-back-btn">
              <ArrowLeft size={16} />
              Back
            </button>
          ) : (
            <div />
          )}
          <button type="button" onClick={handleSkip} className="hinge-skip-btn">
            Skip for now
          </button>
        </div>

        {/* Progress Bar */}
        <div className="hinge-progress-bar">
          <div className="hinge-progress-fill" style={{ width: `${(step / 7) * 100}%` }} />
        </div>

        {error && <div className="profile-alert error" style={{ marginBottom: 24 }}>{error}</div>}

        {/* STEP 1: NAME + PHONE */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div className="hinge-icon-wrapper">
              <User size={20} />
            </div>
            <h1 className="hinge-question-title">Let&apos;s get started</h1>

            <input
              className="hinge-input-field"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Your name (required)"
              required
              autoFocus
            />

            {/* Phone number with +91 prefix */}
            <div style={{ marginTop: 32 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--on-surface-variant)", marginBottom: 8 }}>
                Mobile number
              </p>
              <div style={{
                display: "flex", alignItems: "stretch",
                borderBottom: "2px solid var(--outline-variant)",
                transition: "border-color 0.2s"
              }}>
                <span style={{
                  display: "flex", alignItems: "center", gap: 6,
                  fontSize: 20, fontWeight: 600, color: "var(--on-surface)",
                  paddingRight: 12, paddingBottom: 10, paddingTop: 10,
                  borderRight: "1.5px solid var(--outline-variant)",
                  marginRight: 12, whiteSpace: "nowrap", userSelect: "none"
                }}>
                  🇮🇳 +91
                </span>
                <input
                  className="hinge-input-field"
                  style={{ border: "none", paddingTop: 10, paddingBottom: 10 }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="Mobile number"
                  inputMode="numeric"
                  type="tel"
                  maxLength={10}
                />
              </div>
              {phone.replace(/\D/g, "").length > 0 && phone.replace(/\D/g, "").length < 10 && (
                <p style={{ fontSize: 12, color: "var(--error)", marginTop: 6 }}>
                  Enter a 10-digit mobile number
                </p>
              )}
            </div>

            <p className="hinge-helper-text" style={{ marginTop: 16 }}>
              Other builders can see your name. Your number stays private until you choose to share it.
            </p>
            <div className="hinge-footer-nav">
              <button
                type="button"
                onClick={handleNextStep}
                className={`hinge-next-btn ${!displayName.trim() ? "disabled" : ""}`}
                disabled={!displayName.trim()}
              aria-label="Next step"
              >
                <ArrowRight size={22} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: YEAR & BRANCH */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div className="hinge-icon-wrapper">
              <BookOpen size={20} />
            </div>
            <h1 className="hinge-question-title">What are you studying?</h1>
            <div style={{ display: "grid", gap: 32 }}>

              {/* Branch/Major Input with scrolling blur/fade placeholder */}
              <div className="branch-input-container">
                {!branch && !branchFocused && (
                  <span className={`branch-scrolling-placeholder placeholder-blur-${branchBlurState}`}>
                    {branchPlaceholders[branchPlaceholderIdx]}
                  </span>
                )}
                <input
                  ref={branchInputRef}
                  className="hinge-input-field"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  onFocus={() => setBranchFocused(true)}
                  onBlur={() => setBranchFocused(false)}
                  onKeyDown={handleKeyDown}
                  placeholder=""
                  autoFocus
                />
              </div>

              <select
                className="hinge-select-field"
                value={year}
                onChange={(e) => setYear(e.target.value as UserYear | "")}
                onKeyDown={handleKeyDown}
              >
                <option value="">Select your year</option>
                {yearOptions.map((yo) => (
                  <option key={yo} value={yo}>
                    {yo} Year
                  </option>
                ))}
              </select>
            </div>
            <p className="hinge-helper-text">
              This helps find teammates within your year or related branch of study.
            </p>
            <div className="hinge-footer-nav">
              <button type="button" onClick={handleNextStep} className="hinge-next-btn" aria-label="Next step">
                <ArrowRight size={22} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PRIMARY ROLE */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div className="hinge-icon-wrapper">
              <Sparkles size={20} />
            </div>
            <h1 className="hinge-question-title">What is your primary role?</h1>

            {/* Tag Selection Field */}
            <div className="pill-container">
              {selectedRoles.map((role) => (
                <span
                  key={role}
                  role="button"
                  tabIndex={0}
                  onClick={() => togglePill(role, selectedRoles, setSelectedRoles)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && togglePill(role, selectedRoles, setSelectedRoles)}
                  className="pill-tag selected"
                >
                  {role}
                  <span className="pill-remove-btn"><X size={10} /></span>
                </span>
              ))}
            </div>

            <input
              className="hinge-input-field"
              value={roleInput}
              onChange={(e) => handleCommaTrigger(e.target.value, setRoleInput, selectedRoles, setSelectedRoles)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && roleInput.trim()) {
                  e.preventDefault();
                  togglePill(roleInput.trim(), selectedRoles, setSelectedRoles);
                  setRoleInput("");
                } else {
                  handleKeyDown(e);
                }
              }}
              placeholder="Type custom role & press Comma..."
              autoFocus
            />

            {/* Popular Roles Grid */}
            <div style={{ marginTop: 24 }}>
              <span className="eyebrow" style={{ display: "block", marginBottom: 12, fontSize: 11, color: "var(--on-surface-variant)" }}>POPULAR ROLES</span>
              <div className="pill-container">
                {popularRoles.map((role) => {
                  const isSelected = selectedRoles.includes(role);
                  return (
                    <span
                      key={role}
                      role="button"
                      tabIndex={0}
                      onClick={() => togglePill(role, selectedRoles, setSelectedRoles)}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && togglePill(role, selectedRoles, setSelectedRoles)}
                      className={`pill-tag${isSelected ? " selected" : ""}`}
                    >
                      {role}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="hinge-footer-nav">
              <button type="button" onClick={handleNextStep} className="hinge-next-btn" aria-label="Next step">
                <ArrowRight size={22} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SKILLS */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div className="hinge-icon-wrapper">
              <Code size={20} />
            </div>
            <h1 className="hinge-question-title">What are your skills?</h1>

            {/* Selected Skills List */}
            <div className="pill-container">
              {selectedSkills.map((skill) => (
                <span
                  key={skill}
                  role="button"
                  tabIndex={0}
                  onClick={() => togglePill(skill, selectedSkills, setSelectedSkills)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && togglePill(skill, selectedSkills, setSelectedSkills)}
                  className="pill-tag selected"
                >
                  {skill}
                  <span className="pill-remove-btn"><X size={10} /></span>
                </span>
              ))}
            </div>

            <input
              className="hinge-input-field"
              value={skillInput}
              onChange={(e) => handleCommaTrigger(e.target.value, setSkillInput, selectedSkills, setSelectedSkills)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && skillInput.trim()) {
                  e.preventDefault();
                  togglePill(skillInput.trim(), selectedSkills, setSelectedSkills);
                  setSkillInput("");
                } else {
                  handleKeyDown(e);
                }
              }}
              placeholder="Type skill & press Comma..."
              autoFocus
            />

            {/* Dynamic Recommendations */}
            <div style={{ marginTop: 24 }}>
              <span className="eyebrow" style={{ display: "block", marginBottom: 12, fontSize: 11, color: "var(--on-surface-variant)" }}>RECOMMENDED FOR YOU</span>
              <div className="pill-container">
                {dynamicSkillSuggestions.map((skill) => (
                  <span
                    key={skill}
                    role="button"
                    tabIndex={0}
                    onClick={() => togglePill(skill, selectedSkills, setSelectedSkills)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && togglePill(skill, selectedSkills, setSelectedSkills)}
                    className="pill-tag"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="hinge-footer-nav">
              <button type="button" onClick={handleNextStep} className="hinge-next-btn" aria-label="Next step">
                <ArrowRight size={22} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: COMMITMENT SELECTOR */}
        {step === 5 && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div className="hinge-icon-wrapper">
              <Clock size={20} />
            </div>
            <h1 className="hinge-question-title">What is your commitment?</h1>

            <div className="commitment-grid">
              {commitmentOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => setCommitment(opt.value)}
                  className={`commitment-card${commitment === opt.value ? " active" : ""}`}
                >
                  <span className="commitment-card-title">{opt.label}</span>
                  <span className="commitment-card-desc">{opt.desc}</span>
                </div>
              ))}
            </div>

            <div className="hinge-footer-nav">
              <button type="button" onClick={handleNextStep} className="hinge-next-btn" aria-label="Next step">
                <ArrowRight size={22} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: BIO / PITCH */}
        {step === 6 && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div className="hinge-icon-wrapper">
              <FileText size={20} />
            </div>
            <h1 className="hinge-question-title">Pitch yourself to potential teammates</h1>

            {/* Hinge prompts selector */}
            <div style={{ marginBottom: 20 }}>
              <span className="eyebrow" style={{ display: "block", marginBottom: 12, fontSize: 11, color: "var(--on-surface-variant)" }}>CHOOSE A HINGE PROMPT</span>
              <div className="pill-container">
                {bioPrompts.map((prompt) => (
                  <span
                    key={prompt}
                    onClick={() => setSelectedPrompt(prompt)}
                    className={`pill-tag${selectedPrompt === prompt ? " selected" : ""}`}
                  >
                    {prompt}
                  </span>
                ))}
              </div>
            </div>

            {/* Prompt Box */}
            <div className="prompt-textbox-container">
              {selectedPrompt && (
                <div className="prompt-header-tag">
                  {selectedPrompt}
                  <button onClick={() => setSelectedPrompt("")} type="button" style={{ display: "flex", color: "inherit" }}>
                    <X size={12} />
                  </button>
                </div>
              )}
              <textarea
                className="prompt-textarea"
                value={promptAnswer}
                onChange={(e) => setPromptAnswer(e.target.value)}
                placeholder={selectedPrompt ? "Write your response..." : "Write a short bio or select a prompt above..."}
                autoFocus
              />
            </div>

            <div className="hinge-footer-nav">
              <button type="button" onClick={handleNextStep} className="hinge-next-btn" aria-label="Next step">
                <ArrowRight size={22} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: SOCIAL LINKS */}
        {step === 7 && (() => {
          const ghErr = githubUrl.trim() && !isValidGithubUrl(githubUrl)
            ? "Use a valid GitHub URL e.g. github.com/username" : null;
          const liErr = linkedinUrl.trim() && !isValidLinkedinUrl(linkedinUrl)
            ? "Use a valid LinkedIn URL e.g. linkedin.com/in/username" : null;
          const canSave = !isSaving && !ghErr && !liErr;
          return (
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div className="hinge-icon-wrapper">
                <LinkIcon size={20} />
              </div>
              <h1 className="hinge-question-title">Add your work profiles</h1>
              <div style={{ display: "grid", gap: 24 }}>
                <div>
                  <input
                    className="hinge-input-field"
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="github.com/username"
                    autoFocus
                  />
                  {ghErr && <p style={{ fontSize: 12, color: "var(--error)", marginTop: 6 }}>{ghErr}</p>}
                </div>
                <div>
                  <input
                    className="hinge-input-field"
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="linkedin.com/in/username"
                  />
                  {liErr && <p style={{ fontSize: 12, color: "var(--error)", marginTop: 6 }}>{liErr}</p>}
                </div>
              </div>
              <p className="hinge-helper-text">
                GitHub and LinkedIn make your profile more trustworthy to potential matches.
              </p>
              <div className="hinge-footer-nav">
                <button
                  type="button"
                  disabled={!canSave}
                  onClick={handleSave}
                  className={`hinge-next-btn${!canSave ? " disabled" : ""}`}
                  style={canSave ? { background: "var(--success)" } : {}}
                aria-label="Save profile"
                >
                  {isSaving ? (
                    <span style={{ fontSize: 13, fontWeight: "bold" }}>...</span>
                  ) : (
                    <Check size={22} />
                  )}
                </button>
              </div>
            </div>
          );
        })()}

        {/* Hinge Benefit Callout Footer */}
        <div className="hinge-benefit-box">
          Completed profiles are prioritized in discovery search and receive 3x more match requests.
        </div>
      </div>
    </div>
  );
}

import { Suspense } from "react";

export default function ProfileSetupPage() {
  return (
    <Suspense fallback={
      <main className="page-stack profile-page">
        <section className="surface-panel profile-empty-state" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 12 }}>
          <h1>Loading Setup</h1>
          <p>Preparing your onboarding flow...</p>
        </section>
      </main>
    }>
      <ProfileSetupPageContent />
    </Suspense>
  );
}
