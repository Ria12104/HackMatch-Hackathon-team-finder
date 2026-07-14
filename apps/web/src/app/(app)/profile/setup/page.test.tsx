import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProfileSetupPage from "./page";
import React from "react";

// Mock next/navigation
const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockGet = vi.fn(() => "/");
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

// Mock Supabase client
const mockGetUser = vi.fn().mockResolvedValue({
  data: { user: { id: "test-user-id", email: "test@example.com" } }
});
const mockSingle = vi.fn().mockResolvedValue({
  data: {
    display_name: "Alex",
    year: "1st",
    branch: "Computer Science",
    primary_role: "Frontend Developer",
    skills: ["React"],
    looking_for_roles: ["Backend Developer"],
    availability: "serious",
    bio: "[I'm looking to build...] a cool startup",
    github_url: "https://github.com/alex",
    linkedin_url: "https://linkedin.com/in/alex"
  },
  error: null
});
const mockUpdate = vi.fn().mockResolvedValue({ error: null });

vi.mock("@/lib/supabase/client", () => ({
  createBrowserSupabaseClient: () => ({
    auth: {
      getUser: mockGetUser,
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: mockSingle,
        }),
      }),
      update: () => ({
        eq: mockUpdate,
      }),
    }),
  }),
}));

// Mock window.matchMedia for desktop checks
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: query.includes("hover"), // mock hover matches for desktop
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("ProfileSetupPage Onboarding Wizard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders setup page loader initially, then renders first step name question", async () => {
    render(<ProfileSetupPage />);

    // Loader is rendered initially
    expect(screen.getByText(/Loading profile setup.../i)).toBeInTheDocument();

    // After async Supabase calls resolve, it should show Name step
    await waitFor(() => {
      expect(screen.getByText("Let's get started")).toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText("Your name (required)") as HTMLInputElement;
    expect(nameInput.value).toBe("Alex");
  });

  test("next button advances to step 2", async () => {
    render(<ProfileSetupPage />);

    await waitFor(() => {
      expect(screen.getByText("Let's get started")).toBeInTheDocument();
    });

    const nextBtn = screen.getByRole("button", { name: "Next step" }); // the round next button
    fireEvent.click(nextBtn);

    // Should show step 2: "What are you studying?"
    await waitFor(() => {
      expect(screen.getByText("What are you studying?")).toBeInTheDocument();
    });
  });

  test("comma trigger converts text into tags/pills", async () => {
    render(<ProfileSetupPage />);

    await waitFor(() => {
      expect(screen.getByText("Let's get started")).toBeInTheDocument();
    });

    // Go to step 3 (Primary Role)
    fireEvent.click(screen.getByRole("button", { name: "Next step" })); // Go to step 2
    await waitFor(() => expect(screen.getByText("What are you studying?")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "Next step" })); // Go to step 3
    await waitFor(() => expect(screen.getByText("What is your primary role?")).toBeInTheDocument());

    const roleInput = screen.getByPlaceholderText("Type custom role & press Comma...");

    // Type a role followed by comma
    fireEvent.change(roleInput, { target: { value: "Solidity Developer," } });

    // Custom tag Solidity Developer should be created and shown in selected list
    await waitFor(() => {
      expect(screen.getByText("Solidity Developer")).toBeInTheDocument();
    });
  });

  test("Enter key on desktop advances to the next step", async () => {
    render(<ProfileSetupPage />);

    await waitFor(() => {
      expect(screen.getByText("Let's get started")).toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText("Your name (required)");

    // Press Enter key on name input
    fireEvent.keyDown(nameInput, { key: "Enter", code: "Enter" });

    // Should advance to step 2
    await waitFor(() => {
      expect(screen.getByText("What are you studying?")).toBeInTheDocument();
    });
  });
});
