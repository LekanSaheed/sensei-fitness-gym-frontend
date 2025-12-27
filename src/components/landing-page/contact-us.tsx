import React from "react";
import HeadingText from "./heading-text";
import { FaInstagram, FaTiktok, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { IconType } from "react-icons/lib";
import Link from "next/link";

const ContactUs = () => {
  const social_links: { icon: IconType; url: string }[] = [
    {
      icon: FaWhatsapp,
      url: "https://wa.me/+2348120825084?text=Hello%20SEN-SEI Fitness",
    },
    {
      icon: FaInstagram,
      url: "https://www.instagram.com/sens.ei4fitness",
    },
    {
      icon: FaXTwitter,
      url: "https://x.com/sensei4fitnesss",
    },
    {
      icon: FaTiktok,
      url: "https://www.tiktok.com/@sensei4fitness",
    },
  ];
  return (
    <section
      id="contact-us"
      className="bg-[#000] py-[40px] md:py-[50px] lg:py-[60px] xl:py-[70px] 2xl:py-[80px] px-4"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="mb-[40px] md:mb-[50px] lg:mb-[60px] xl:mb-[70px] 2xl:mb-[100px]">
          <HeadingText centered>
            Contact <span className="text-default">Us</span>
          </HeadingText>
          <p className="text-[12px] text-center text-muted-foreground md:text-[14px] lg:text-[15px] xl:text-[16px] max-w-[350px] md:max-w-[400px] lg:max-w-[450px] mx-auto ">
            You can reach us through any of the following channels
          </p>
        </div>

        <ul className="flex justify-center gap-6 ">
          {social_links.map((link, id) => {
            return (
              <li key={id}>
                <Link href={link.url} target="_blank" rel="noreferrer">
                  {React.createElement(link.icon, { size: 40 })}
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="text-[12px] my-8 text-center text-muted-foreground md:text-[14px] lg:text-[15px] xl:text-[16px] max-w-[350px] md:max-w-[400px] lg:max-w-[450px] mx-auto ">
          or via
        </p>

        <p className="text-center text-[14px]">
          Email:{" "}
          <a href="mailto:sensei4fitness@gmail.com" className="text-default">
            sensei4fitness@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
};

export default ContactUs;
