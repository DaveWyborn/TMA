import { SignIn } from "@clerk/nextjs";
import NavBar from "@/components/NavBar";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Sign in | Tailor Made Analytics",
};

export default function SignInPage() {
  return (
    <main style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <NavBar />
      <div className="px-6 md:px-12 py-16 flex justify-center">
        <SignIn
          appearance={{
            elements: {
              rootBox: { width: "100%", maxWidth: 420 },
              card: {
                background: "var(--paper)",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--radius)",
                boxShadow: "none",
              },
              headerTitle: { color: "var(--ink)" },
              headerSubtitle: { color: "var(--ink-soft)" },
              formButtonPrimary: {
                background: "var(--ink)",
                color: "var(--paper)",
                borderRadius: "var(--radius)",
              },
              footerActionLink: { color: "var(--signal)" },
            },
          }}
        />
      </div>
    </main>
  );
}
