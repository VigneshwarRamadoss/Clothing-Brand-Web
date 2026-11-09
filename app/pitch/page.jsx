import { Hero, SiteHeader } from "../experience";

export const metadata = {
  title: "ASTRA — Built for the late shift (Pitch Cut)",
  description: "ASTRA Drop 001. 12-second concept intro cut by The Dot.",
};

export default function Pitch() {
  return (
    <>
      <SiteHeader pitch />
      <main id="main"><Hero pitch /></main>
    </>
  );
}
