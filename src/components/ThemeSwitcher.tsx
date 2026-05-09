import Link from "next/link";

export default function ThemeSwitcher({ current }: { current: "bold" | "clay" }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-black/80 backdrop-blur-md rounded-full px-2 py-2 shadow-xl border border-white/10">
      <Link
        href="/"
        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
          current === "bold"
            ? "bg-[#FF3D00] text-white"
            : "text-white/50 hover:text-white"
        }`}
      >
        Bold
      </Link>
      <Link
        href="/v2"
        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
          current === "clay"
            ? "bg-white text-black"
            : "text-white/50 hover:text-white"
        }`}
      >
        Clay
      </Link>
    </div>
  );
}
