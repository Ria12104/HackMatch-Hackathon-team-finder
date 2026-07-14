"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Database } from "@pairup/shared";
import {
  AlertCircle,
  CheckCircle2,
  Edit3,
  Github,
  Globe,
  Linkedin,
  LogOut,
  Save,
  Settings,
  Trash2,
  UserRound,
  Camera,
  Upload,
  X
} from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
type UserYear = Database["public"]["Enums"]["user_year"];
type ProfileStrength = Database["public"]["Enums"]["profile_strength"];

type ProfileForm = {
  display_name: string;
  phone: string;
  year: UserYear | "";
  branch: string;
  primary_role: string;
  skills: string;
  looking_for_roles: string;
  availability: string;
  bio: string;
  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
};

const yearOptions: UserYear[] = ["1st", "2nd", "3rd", "4th", "alumni"];

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function toForm(profile: Profile): ProfileForm {
  return {
    display_name: profile.display_name,
    phone: profile.phone ?? "",
    year: profile.year ?? "",
    branch: profile.branch ?? "",
    primary_role: profile.primary_role ?? "",
    skills: profile.skills.join(", "),
    looking_for_roles: profile.looking_for_roles.join(", "),
    availability: profile.availability ?? "",
    bio: profile.bio ?? "",
    github_url: profile.github_url ?? "",
    linkedin_url: profile.linkedin_url ?? "",
    portfolio_url: profile.portfolio_url ?? ""
  };
}

function nullable(value: string) {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function calculateStrength(form: ProfileForm) {
  // Matches the DB trigger formula: 10 checks, social links combined.
  const hasSocial = !!form.github_url.trim() || !!form.linkedin_url.trim();
  const checks = [
    form.display_name.trim(),
    form.year,
    form.branch.trim(),
    form.primary_role.trim(),
    splitList(form.skills).length > 0,
    splitList(form.looking_for_roles).length > 0,
    form.availability.trim(),
    form.bio.trim(),
    form.phone?.trim(),           // phone (new in formula)
    hasSocial                     // github OR linkedin = 1 point
  ];
  const completed = checks.filter(Boolean).length;
  const score = Math.round((completed / checks.length) * 100);
  const strength: ProfileStrength = score >= 75 ? "strong" : score >= 45 ? "ready" : "starter";

  return { score, strength };
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<ProfileForm | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const completion = useMemo(() => (form ? calculateStrength(form) : { score: 0, strength: "starter" as ProfileStrength }), [form]);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setIsLoading(true);
      setError(null);

      try {
        const supabase = createBrowserSupabaseClient();
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError || !authData.user) {
          router.replace("/login");
          return;
        }

        const { data, error: profileError } = await supabase
          .from("profiles")
          .select(
            "id, display_name, avatar_url, year, branch, primary_role, skills, looking_for_roles, availability, bio, github_url, linkedin_url, portfolio_url, profile_score, profile_strength"
          )
          .eq("id", authData.user.id)
          .single();

        if (!isMounted) {
          return;
        }

        if (profileError) {
          setError(profileError.message);
          return;
        }

        // The explicit select contains every column toForm() and the UI read.
        // Cast is safe — the DB will never return columns we didn't select.
        setProfile(data as Profile);
        setForm(toForm(data as Profile));
        setIsEditing(false);
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Could not load profile.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [router]);

  function updateField<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!profile || !form) {
      return;
    }

    const displayName = form.display_name.trim();
    if (!displayName) {
      setError("Display name is required.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setStatus(null);

    const payload: ProfileUpdate = {
      display_name: displayName,
      year: form.year || null,
      branch: nullable(form.branch),
      primary_role: nullable(form.primary_role),
      skills: splitList(form.skills),
      looking_for_roles: splitList(form.looking_for_roles),
      availability: nullable(form.availability),
      bio: nullable(form.bio),
      github_url: nullable(form.github_url),
      linkedin_url: nullable(form.linkedin_url),
      portfolio_url: nullable(form.portfolio_url)
    };

    const supabase = createBrowserSupabaseClient();
    const { data, error: saveError } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", profile.id)
      .select(
        "id, display_name, avatar_url, year, branch, primary_role, skills, looking_for_roles, availability, bio, github_url, linkedin_url, portfolio_url, profile_score, profile_strength"
      )
      .single();

    setIsSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    setProfile(data as Profile);
    setForm(toForm(data as Profile));
    setIsEditing(false);
    setStatus("Profile saved.");
  }

  async function handleSoftDelete() {
    if (!profile) {
      return;
    }

    setIsSaving(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();
    const { error: deleteError } = await supabase
      .from("profiles")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", profile.id);

    if (deleteError) {
      setIsSaving(false);
      setError(deleteError.message);
      return;
    }

    // IMPORTANT: soft-delete MUST come before signOut.
    // After signOut the session is gone and RLS will reject any further UPDATE on this row.
    await supabase.auth.signOut();
    router.replace("/login");
  }

  async function handleSignOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.replace("/login");
  }

  async function uploadAvatarFile(file: File) {
    if (!profile) return;
    const supabase = createBrowserSupabaseClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return;

    setIsSaving(true);
    setError(null);
    setStatus(null);

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${authData.user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });

    setIsSaving(false);

    if (uploadError) {
      console.error("Avatar upload failed:", uploadError.message);
      setError("Failed to upload avatar: " + uploadError.message);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = urlData.publicUrl;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", authData.user.id);

    if (updateError) {
      setError("Failed to update profile: " + updateError.message);
    } else {
      setProfile((prev) => prev ? { ...prev, avatar_url: publicUrl } : prev);
      setStatus("Avatar updated successfully.");
      setShowAvatarModal(false);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAvatarFile(file);
  }

  async function handleSelectDefaultAvatar(num: number) {
    try {
      setIsSaving(true);
      setError(null);
      setStatus(null);
      const response = await fetch(`/default-avatars/avatar_${num}.png`);
      const blob = await response.blob();
      const file = new File([blob], `avatar_default_${num}.png`, { type: "image/png" });
      await uploadAvatarFile(file);
    } catch (err) {
      setIsSaving(false);
      console.error("Failed to select default avatar:", err);
      setError("Failed to load default avatar.");
    }
  }

  if (isLoading) {
    return (
      <main className="page-stack profile-page">
        <section className="surface-panel profile-empty-state">
          <UserRound size={28} />
          <h1>Loading profile</h1>
          <p>Pulling your PairUp details from Supabase.</p>
        </section>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main className="page-stack profile-page">
        <section className="surface-panel profile-empty-state">
          <AlertCircle size={28} />
          <h1>Profile unavailable</h1>
          <p>{error}</p>
          <Link className="primary-button" href="/login">
            Back to sign in
          </Link>
        </section>
      </main>
    );
  }

  if (!profile || !form) {
    return null;
  }

  const initials = profile.display_name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const skills = splitList(form.skills);
  const lookingForRoles = splitList(form.looking_for_roles);

  return (
    <>
      <header className="top-bar">
        <span className="brand-name">PairUp</span>
        <div style={{ display: "flex", gap: 4 }}>
          <Link
            href="/profile/settings"
            className="icon-button"
            aria-label="Settings"
            title="Settings"
          >
            <Settings size={18} />
          </Link>
          <button className="icon-button" type="button" aria-label="Sign out" onClick={handleSignOut}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="page-stack profile-page">
        <section className="profile-hero">
          <div className="profile-avatar" style={{ position: "relative" }}>
            {profile.avatar_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={profile.avatar_url} alt="" />
            ) : (
              initials
            )}
            {/* Pencil overlay — triggers avatar modal */}
            <button
              onClick={() => setShowAvatarModal(true)}
              title="Change photo"
              style={{
                position: "absolute",
                bottom: -2,
                right: -2,
                background: "var(--primary)",
                border: "2.5px solid var(--surface-lowest)",
                color: "#fff",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "var(--shadow-sm)",
                cursor: "pointer",
                transition: "transform 0.15s, opacity 0.15s"
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
              type="button"
            >
              <Edit3 size={14} />
            </button>
          </div>
          <div className="profile-hero-copy">
            <p className="eyebrow">{profile.profile_strength} profile</p>
            <h1>{profile.display_name}</h1>
            <p>{profile.primary_role || "Add your role so teammates know where you shine."}</p>
          </div>
        </section>

        <section className="surface-panel profile-score-panel">
          <div>
            <p className="eyebrow">Completeness</p>
            <h2>{completion.score}% ready</h2>
          </div>
          <div className="profile-score-track" aria-label={`Profile ${completion.score}% complete`}>
            <span style={{ width: `${completion.score}%` }} />
          </div>
        </section>

        {(status || error) && (
          <div className={`profile-alert ${error ? "error" : "success"}`}>
            {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            {error || status}
          </div>
        )}

        <form className="profile-form" onSubmit={handleSave}>
          <section className="surface-panel">
            <div className="section-header">
              <h3>Profile basics</h3>
              <button className="ghost-button" type="button" onClick={() => setIsEditing((value) => !value)}>
                <Edit3 size={16} />
                {isEditing ? "Preview" : "Edit"}
              </button>
            </div>

            {isEditing ? (
              <div className="form-grid profile-form-grid">
                <label className="field">
                  <span>Display name</span>
                  <input value={form.display_name} onChange={(event) => updateField("display_name", event.target.value)} maxLength={80} required />
                </label>
                <label className="field">
                  <span>Year</span>
                  <select value={form.year} onChange={(event) => updateField("year", event.target.value as UserYear | "")}>
                    <option value="">Select year</option>
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Branch</span>
                  <input value={form.branch} onChange={(event) => updateField("branch", event.target.value)} maxLength={80} placeholder="Computer Science" />
                </label>
                <label className="field">
                  <span>Primary role</span>
                  <input value={form.primary_role} onChange={(event) => updateField("primary_role", event.target.value)} maxLength={80} placeholder="Frontend, ML, design..." />
                </label>
                <label className="field">
                  <span>Skills</span>
                  <input value={form.skills} onChange={(event) => updateField("skills", event.target.value)} placeholder="React, Python, Supabase" />
                </label>
                <label className="field">
                  <span>Looking for roles</span>
                  <input value={form.looking_for_roles} onChange={(event) => updateField("looking_for_roles", event.target.value)} placeholder="Backend, designer, pitch lead" />
                </label>
                <label className="field">
                  <span>Availability</span>
                  <input value={form.availability} onChange={(event) => updateField("availability", event.target.value)} maxLength={160} placeholder="Weekends, evenings, full event" />
                </label>
                <label className="field profile-span">
                  <span>Bio</span>
                  <textarea value={form.bio} onChange={(event) => updateField("bio", event.target.value)} maxLength={500} placeholder="What do you like building? What kind of team fits you?" />
                </label>
              </div>
            ) : (
              <div className="profile-read-grid">
                <ProfileFact label="Year" value={profile.year} />
                <ProfileFact label="Branch" value={profile.branch} />
                <ProfileFact label="Availability" value={profile.availability} />
                <ProfileFact label="Bio" value={profile.bio} wide />
              </div>
            )}
          </section>

          <section className="surface-panel">
            <div className="section-header">
              <h3>Team fit</h3>
            </div>
            <ProfileTags label="Skills" values={skills} empty="Add skills teammates can search for." />
            <ProfileTags label="Looking for" values={lookingForRoles} empty="Add roles you want beside you." />
          </section>

          <section className="surface-panel">
            <div className="section-header">
              <h3>Links</h3>
            </div>
            {isEditing ? (
              <div className="form-grid">
                <label className="field">
                  <span>GitHub</span>
                  <input value={form.github_url} onChange={(event) => updateField("github_url", event.target.value)} placeholder="https://github.com/you" />
                </label>
                <label className="field">
                  <span>LinkedIn</span>
                  <input value={form.linkedin_url} onChange={(event) => updateField("linkedin_url", event.target.value)} placeholder="https://linkedin.com/in/you" />
                </label>
                <label className="field">
                  <span>Portfolio</span>
                  <input value={form.portfolio_url} onChange={(event) => updateField("portfolio_url", event.target.value)} placeholder="https://your.site" />
                </label>
              </div>
            ) : (
              <div className="profile-link-list">
                <ProfileLink icon={<Github size={18} />} href={profile.github_url} label="GitHub" />
                <ProfileLink icon={<Linkedin size={18} />} href={profile.linkedin_url} label="LinkedIn" />
                <ProfileLink icon={<Globe size={18} />} href={profile.portfolio_url} label="Portfolio" />
              </div>
            )}
          </section>

          <div className="profile-actions">
            {isEditing && (
              <button className="primary-button" type="submit" disabled={isSaving}>
                <Save size={17} />
                {isSaving ? "Saving..." : "Save profile"}
              </button>
            )}
            <button className="ghost-button danger" type="button" onClick={() => setShowDeleteConfirm(true)} disabled={isSaving}>
              <Trash2 size={16} />
              Delete profile
            </button>
          </div>
        </form>
      </main>

      {showDeleteConfirm && (
        <div className="auth-modal-backdrop" style={{ position: "fixed", zIndex: 100 }}>
          <div className="auth-modal">
            <h3>Delete Profile?</h3>
            <p>Are you sure you want to delete your PairUp profile? You will be signed out immediately and your profile will be hidden from other matches.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
              <button
                className="ghost-button"
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                style={{ width: "100%" }}
              >
                Cancel
              </button>
              <button
                className="primary-button danger"
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  handleSoftDelete();
                }}
                style={{ width: "100%", background: "var(--error)", borderColor: "var(--error)", color: "#fff" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AVATAR SELECTOR MODAL */}
      {showAvatarModal && (
        <div className="auth-modal-backdrop" style={{ position: "fixed", zIndex: 100 }}>
          <div className="auth-modal" style={{ maxWidth: 420, padding: "24px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--outline-variant)", paddingBottom: 12, marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>Update Profile Photo</h3>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                style={{ color: "var(--on-surface-variant)", display: "flex", alignItems: "center" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Default Avatars Grid */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--on-surface-variant)", textAlign: "left", marginBottom: 12 }}>
                Choose a default avatar:
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSelectDefaultAvatar(num)}
                    disabled={isSaving}
                    style={{
                      border: "2px solid var(--outline-variant)",
                      borderRadius: 16,
                      overflow: "hidden",
                      aspectRatio: "1/1",
                      padding: 0,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      position: "relative"
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
                      (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--outline-variant)";
                      (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/default-avatars/avatar_${num}.png`}
                      alt={`Avatar ${num}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--outline-variant)", paddingTop: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--on-surface-variant)", textAlign: "left", marginBottom: 12 }}>
                Or upload from your device:
              </p>
              <label
                className="ghost-button"
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                  cursor: isSaving ? "not-allowed" : "pointer"
                }}
              >
                <Upload size={16} />
                {isSaving ? "Uploading..." : "Upload Custom Photo"}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleAvatarUpload}
                  disabled={isSaving}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProfileFact({ label, value, wide = false }: Readonly<{ label: string; value: string | null; wide?: boolean }>) {
  return (
    <div className={`profile-fact${wide ? " wide" : ""}`}>
      <span>{label}</span>
      <strong>{value || "Not added yet"}</strong>
    </div>
  );
}

function ProfileTags({ label, values, empty }: Readonly<{ label: string; values: string[]; empty: string }>) {
  return (
    <div className="profile-tag-section">
      <p>{label}</p>
      {values.length ? (
        <div className="tag-list">
          {values.map((value) => (
            <span className="tag" key={value}>
              {value}
            </span>
          ))}
        </div>
      ) : (
        <span className="profile-muted">{empty}</span>
      )}
    </div>
  );
}

function ProfileLink({ icon, href, label }: Readonly<{ icon: React.ReactNode; href: string | null; label: string }>) {
  if (!href) {
    return (
      <span className="profile-link disabled">
        {icon}
        {label}
      </span>
    );
  }

  return (
    <a className="profile-link" href={href} target="_blank" rel="noreferrer">
      {icon}
      {label}
    </a>
  );
}
