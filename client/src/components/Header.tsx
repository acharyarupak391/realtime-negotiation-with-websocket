import Image from "next/image";

const Header = () => {
  return (
    <header className="w-full bg-gray-900 text-gray-100 text-center px-4 py-8 flex justify-center gap-4 items-center">
      <Image
        src={"/favicon.ico"}
        alt="Logo"
        width={64}
        height={64}
        className="w-8 sm:w-16"
      />
      <h1 className="text-xl sm:text-2xl">Realtime Payment Settlement</h1>
    </header>
  );
};

export { Header };
