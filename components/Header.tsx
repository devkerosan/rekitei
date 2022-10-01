import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="flex bg-black text-white text-2xl font-mono w-full h-12 px-[20%] items-center">
      <Link href="/list">
        <a>rekitei.</a>
      </Link>
    </header>
  );
};

export default Header;
