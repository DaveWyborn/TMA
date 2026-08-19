import NavBar from "./NavBar";
import FooterSection from "./FooterSection";
import UsageIndicator from "./UsageIndicator";

type ToolName =
  | "meta-checker"
  | "keyword-analyser"
  | "page-speed"
  | "robots-checker";

type ToolPageShellProps = {
  eyebrow?: string;
  title: string;
  lede?: string;
  beta?: boolean;
  tool?: ToolName;
  children: React.ReactNode;
};

export default function ToolPageShell({
  eyebrow = "SEO Tools",
  title,
  lede,
  beta = true,
  tool,
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
          {tool ? <UsageIndicator tool={tool} /> : <span>Free to use</span>}
          <span>Usage logged for product development</span>
        </div>

        {children}
      </main>
      <FooterSection />
    </>
  );
}
