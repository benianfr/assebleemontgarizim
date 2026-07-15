import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="Assemblée Mont Garizim"
      width={48}
      height={48}
      className="logo-mark"
      priority
    />
  );
}
