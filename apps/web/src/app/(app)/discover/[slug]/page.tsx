import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getHackathon } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { DiscoverClient } from "./discover-client";

/** Shape of the non-PII columns we select from profiles for the discover deck. */
interface DiscoverProfile {
  id: string;
  display_name: string;
  year?: string;
  branch?: string;
  primary_role?: string;
  skills: string[];
  looking_for_roles: string[];
  availability?: string;
  bio?: string;
}

export default async function DiscoverPage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const hackathon = getHackathon(slug);
  if (!hackathon) notFound();

  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user ?? null;

  let dbProfiles: DiscoverProfile[] = [];
  if (user) {
    // Only public-safe columns. Never select phone/email or other contact/PII
    // fields here — profiles RLS is row-level, so `select("*")` would ship every
    // user's phone + email to the browser regardless of their visibility toggles.
    const { data } = await supabase
      .from("profiles")
      .select(
        "id, display_name, year, branch, primary_role, skills, looking_for_roles, availability, bio"
      )
      .neq("id", user.id)
      .limit(10);
    dbProfiles = (data as DiscoverProfile[]) ?? [];
  }

  // Fallback mock teammate profiles if database is empty
  const fallbackProfiles = [
    {
      id: "mock-1",
      display_name: "Rohan Sen",
      year: "3rd",
      branch: "Computer Science",
      primary_role: "Frontend Developer",
      skills: ["React", "TypeScript", "Tailwind", "Next.js"],
      looking_for_roles: ["Backend Dev", "Designer"],
      availability: "15-20 hours/week",
      bio: "Love building interactive UI animations and clean responsive layouts. Looking to build something crazy at this hackathon!"
    },
    {
      id: "mock-2",
      display_name: "Priya Patel",
      year: "4th",
      branch: "Artificial Intelligence",
      primary_role: "ML Engineer",
      skills: ["Python", "PyTorch", "Scikit-Learn", "FastAPI"],
      looking_for_roles: ["Frontend Dev", "Presenter"],
      availability: "Fully dedicated",
      bio: "Specializing in NLP and recommendation systems. I want to hook up some cool generative AI capabilities into our project."
    },
    {
      id: "mock-3",
      display_name: "Amit Verma",
      year: "2nd",
      branch: "Design & UX",
      primary_role: "UI/UX Designer",
      skills: ["Figma", "Adobe XD", "Wireframing", "Prototyping"],
      looking_for_roles: ["Frontend Dev", "Backend Dev"],
      availability: "Weekends mostly",
      bio: "Figma geek. Love playing with colors, typography and design systems. I'll make sure our hackathon submission is stunning."
    }
  ];

  const teammates = dbProfiles.length > 0 ? dbProfiles : fallbackProfiles;

  return (
    <DiscoverClient
      hackathon={hackathon}
      isAuthenticated={!!user}
      teammates={teammates}
      slug={slug}
    />
  );
}
