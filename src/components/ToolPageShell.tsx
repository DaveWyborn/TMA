import NavBar from "./NavBar";
import FooterSection from "./FooterSection";

type ToolPageShellProps = {
  eyebrow?: string;
  title: string;
  lede?: string;
  beta?: boolean;
  children: React.ReactNode;
};

export default function ToolPageShell({
  eyebrow = "SEO Tools",
  title,
  lede,
  beta = true,
  children,
}: ToolPageShellProps) {
  return (
    <>
      <NavBar />
      <main className="tool-page">
        <p className="tool-eyebrow">
          {eyebrow}
        </p>
        <h1 className="tool-title">{title}</h1>
        {lede && <p className="tool-lede">{lede}</p>}

        <div className="tool-meta">
          {beta && <span className="beta">Beta</span>}
          <span>Free to use</span>
          <span>Usage logged for product development</span>
        </div>

        {children}
      </main>
      <FooterSection />
    </>
  );
}
