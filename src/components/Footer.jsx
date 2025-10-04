export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-1 px-4 absolute bottom-0 w-full">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <p className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} <span className="font-semibold text-white">NASA Space Apps Challenge</span> — Equipa <span className="text-blue-400">AstroBoys 🌍</span>
        </p>

        
        <nav className="flex gap-4 text-sm">
          <a href="#" className="hover:text-white transition-colors">Sobre</a>
          <a href="#" className="hover:text-white transition-colors">Projetos</a>
          <a href="#" className="hover:text-white transition-colors">Contato</a>
        </nav>
      </div>
    </footer>
  );
}
