import { Hero, SiteHeader } from "../experience";

export const metadata = { title: "ASTRA — Drop 001 pitch" };

export default function Pitch() {
  return (
    <>
      <SiteHeader pitch />
      <main id="main"><Hero pitch /></main>
    </>
  );
}
