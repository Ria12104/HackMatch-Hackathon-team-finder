"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Database } from "@pairup/shared";
import {
  ArrowLeft,
  Shield,
  Bell,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  User as UserIcon
} from "lucide-react";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form states
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Privacy states
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [emailVisible, setEmailVisible] = useState(false);

  // Notifications states
  const [notifMatches, setNotifMatches] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifDeadlines, setNotifDeadlines] = useState(true);
  const [notifCreditReset, setNotifCreditReset] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);
  const [quietHoursStart, setQuietHoursStart] = useState("");
  const [quietHoursEnd, setQuietHoursEnd] = useState("");

  useEffect(() => {
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
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (profileError) {
          setError(profileError.message);
          return;
        }

        const p = data as Profile;
        setProfile(p);

        // Populate fields
        setDisplayName(p.display_name ?? "");
        setEmail(p.email ?? "");

        // Strip +91 prefix for visual editing
        const rawPhone = p.phone ?? "";
        setPhone(rawPhone.startsWith("+91") ? rawPhone.slice(3) : rawPhone);

        setPhoneVisible(p.phone_visible);
        setEmailVisible(p.email_visible);

        setNotifMatches(p.notification_matches_enabled);
        setNotifMessages(p.notification_messages_enabled);
        setNotifDeadlines(p.notification_deadlines_enabled);
        setNotifCreditReset(p.notification_credit_reset_enabled);
        setNotifMarketing(p.notification_marketing_enabled);

        // Format quiet hours (time type returns HH:MM:SS, slice to HH:MM)
        setQuietHoursStart(p.quiet_hours_start ? p.quiet_hours_start.slice(0, 5) : "");
        setQuietHoursEnd(p.quiet_hours_end ? p.quiet_hours_end.slice(0, 5) : "");

      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Could not load settings.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    setError(null);
    setStatus(null);

    const phoneDigits = phone.replace(/\D/g, "");

    // Validate phone if present
    if (phoneDigits && phoneDigits.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      setIsSaving(false);
      return;
    }

    const payload: Database["public"]["Tables"]["profiles"]["Update"] = {
      display_name: displayName.trim(),
      phone: phoneDigits ? `+91${phoneDigits}` : null,
      phone_visible: phoneVisible,
      email_visible: emailVisible,
      notification_matches_enabled: notifMatches,
      notification_messages_enabled: notifMessages,
      notification_deadlines_enabled: notifDeadlines,
      notification_credit_reset_enabled: notifCreditReset,
      notification_marketing_enabled: notifMarketing,
      quiet_hours_start: quietHoursStart ? `${quietHoursStart}:00` : null,
      quiet_hours_end: quietHoursEnd ? `${quietHoursEnd}:00` : null,
    };

    try {
      const supabase = createBrowserSupabaseClient();
      const { error: saveError } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", profile.id);

      if (saveError) {
        setError(saveError.message);
      } else {
        setStatus("Settings saved successfully.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSoftDelete() {
    if (!profile) return;

    setIsSaving(true);
    setError(null);

    try {
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

      await supabase.auth.signOut();
      router.replace("/login");
    } catch (err) {
      setIsSaving(false);
      setError(err instanceof Error ? err.message : "Failed to delete profile.");
    }
  }

  if (isLoading) {
    return (
      <main className="page-stack profile-page">
        <section className="surface-panel profile-empty-state">
          <h1>Loading Settings</h1>
          <p>Preparing settings dashboard...</p>
        </section>
      </main>
    );
  }

  return (
    <>
      <header className="top-bar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/profile" className="icon-button" style={{ display: "grid", placeItems: "center" }} aria-label="Go Back">
            <ArrowLeft size={18} />
          </Link>
          <span className="brand-name" style={{ fontSize: 20 }}>Settings</span>
        </div>
      </header>

      <main className="page-stack profile-page" style={{ paddingBottom: 40 }}>
        {status && (
          <div className="profile-alert success">
            <CheckCircle2 size={18} />
            {status}
          </div>
        )}

        {error && (
          <div className="profile-alert error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="profile-form">
          {/* ACCOUNT SECTION */}
          <section className="surface-panel" style={{ display: "grid", gap: 16 }}>
            <div className="section-header" style={{ borderBottom: "1px solid var(--outline-variant)", paddingBottom: 10 }}>
              <h3 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16 }}>
                <UserIcon size={18} style={{ color: "var(--primary)" }} />
                Account
              </h3>
            </div>

            <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
              <label className="field">
                <span>Display Name</span>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={80}
                  required
                />
              </label>

              <label className="field">
                <span>Email</span>
                <input
                  value={email}
                  disabled
                  style={{ opacity: 0.6, cursor: "not-allowed", backgroundColor: "var(--surface-container)" }}
                />
              </label>

              <div>
                <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "var(--on-surface-variant)", marginBottom: 8 }}>
                  Phone
                </p>
                <div style={{
                  display: "flex",
                  alignItems: "stretch",
                  background: "var(--surface-low)",
                  border: "1.5px solid transparent",
                  borderBottom: "2px solid var(--primary)",
                  borderRadius: "14px 14px 8px 8px",
                  padding: "0 14px",
                  minHeight: 48
                }}>
                  <span style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--on-surface)",
                    paddingRight: 10,
                    marginRight: 10,
                    borderRight: "1px solid var(--outline-variant)",
                    userSelect: "none"
                  }}>
                    🇮🇳 +91
                  </span>
                  <input
                    style={{
                      flex: 1,
                      border: "none",
                      background: "transparent",
                      outline: "none",
                      fontSize: 15,
                      color: "var(--on-surface)",
                      padding: "12px 0"
                    }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="Enter 10-digit number"
                    inputMode="numeric"
                    type="tel"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* PRIVACY SECTION */}
          <section className="surface-panel" style={{ display: "grid", gap: 16 }}>
            <div className="section-header" style={{ borderBottom: "1px solid var(--outline-variant)", paddingBottom: 10 }}>
              <h3 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16 }}>
                <Shield size={18} style={{ color: "var(--primary)" }} />
                Privacy
              </h3>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, display: "block" }}>Show Email Address</span>
                  <span style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Apart from when you choose to reveal it to a match</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailVisible}
                  onChange={(e) => setEmailVisible(e.target.checked)}
                  style={{ width: 44, height: 22, cursor: "pointer" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, display: "block" }}>Show Phone</span>
                  <span style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Apart from when you choose to reveal it to a match.</span>
                </div>
                <input
                  type="checkbox"
                  checked={phoneVisible}
                  onChange={(e) => setPhoneVisible(e.target.checked)}
                  style={{ width: 44, height: 22, cursor: "pointer" }}
                />
              </div>
            </div>
          </section>

          {/* NOTIFICATIONS SECTION */}
          <section className="surface-panel" style={{ display: "grid", gap: 16 }}>
            <div className="section-header" style={{ borderBottom: "1px solid var(--outline-variant)", paddingBottom: 10 }}>
              <h3 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16 }}>
                <Bell size={18} style={{ color: "var(--primary)" }} />
                Notification Preferences
              </h3>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, display: "block" }}>Match Invites</span>
                  <span style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Receive updates on new match requests.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifMatches}
                  onChange={(e) => setNotifMatches(e.target.checked)}
                  style={{ width: 20, height: 20 }}
                />
              </label>

              <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, display: "block" }}>Chat Messages</span>
                  <span style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Receive alerts when you get direct messages.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifMessages}
                  onChange={(e) => setNotifMessages(e.target.checked)}
                  style={{ width: 20, height: 20 }}
                />
              </label>

              <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, display: "block" }}>Hackathon Deadlines</span>
                  <span style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Alerts for registration and submission limits.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifDeadlines}
                  onChange={(e) => setNotifDeadlines(e.target.checked)}
                  style={{ width: 20, height: 20 }}
                />
              </label>

              <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, display: "block" }}>Credit Reset Alerts</span>
                  <span style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Receive alerts when your swipe credits reset.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifCreditReset}
                  onChange={(e) => setNotifCreditReset(e.target.checked)}
                  style={{ width: 20, height: 20 }}
                />
              </label>

              <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, display: "block" }}>Marketing Updates</span>
                  <span style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>News about product features, tips, and events.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifMarketing}
                  onChange={(e) => setNotifMarketing(e.target.checked)}
                  style={{ width: 20, height: 20 }}
                />
              </label>

              {/* QUIET HOURS */}
              <div style={{ borderTop: "1px solid var(--outline-variant)", paddingTop: 14, marginTop: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <Clock size={16} style={{ color: "var(--primary)" }} />
                  Quiet Hours (Optional)
                </span>
                <span style={{ fontSize: 12, color: "var(--on-surface-variant)", display: "block", marginBottom: 12 }}>
                  Mute all notification updates during this custom range.
                </span>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <label className="field">
                    <span style={{ fontSize: 11, fontWeight: 800 }}>Start Time</span>
                    <input
                      type="time"
                      value={quietHoursStart}
                      onChange={(e) => setQuietHoursStart(e.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span style={{ fontSize: 11, fontWeight: 800 }}>End Time</span>
                    <input
                      type="time"
                      value={quietHoursEnd}
                      onChange={(e) => setQuietHoursEnd(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* DANGER ZONE SECTION */}
          <section className="surface-panel" style={{ border: "1.5px solid var(--primary)", display: "grid", gap: 16 }}>
            <div className="section-header" style={{ borderBottom: "1px solid var(--primary)", paddingBottom: 10 }}>
              <h3 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, color: "var(--primary)" }}>
                <Trash2 size={18} />
                Danger Zone
              </h3>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <span style={{ fontSize: 14, fontWeight: 700, display: "block" }}>Delete Account</span>
                <span style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>
                  Temporarily hide profile from match decks and sign out.
                </span>
              </div>
              <button
                type="button"
                className="ghost-button danger"
                onClick={() => setShowDeleteConfirm(true)}
                style={{ borderColor: "var(--primary)" }}
              >
                Delete Profile
              </button>
            </div>
          </section>

          <div style={{ marginTop: 12 }}>
            <button
              type="submit"
              className="primary-button"
              disabled={isSaving}
              style={{ width: "100%", display: "flex", gap: 8, justifyContent: "center" }}
            >
              <Save size={18} />
              {isSaving ? "Saving Settings..." : "Save Settings"}
            </button>
          </div>
        </form>
      </main>

      {/* DELETE CONFIRMATION MODAL */}
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
                style={{ width: "100%", background: "var(--primary)", borderColor: "var(--primary)", color: "#fff" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
