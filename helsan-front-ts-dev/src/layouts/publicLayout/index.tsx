import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

const PublicLayout = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Change when scrolled 50px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="print:hidden">
        <Header isScrolled={isScrolled} />
      </div>
      <div
        // className={Style.container}
        className="xl:container xl:mx-auto mx-1 flex-1 !min-h-[80vh] !mt-18"
      >
        <Outlet />
      </div>
      <div
        // className={Style.footer}
        className="mt-auto b-0 w-full print:hidden"
      >
        <Footer />
      </div>
    </>
  );
};

export default PublicLayout;
