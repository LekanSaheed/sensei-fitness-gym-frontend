import React from "react";
import { FaInstagram, FaTiktok, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { IconType } from "react-icons/lib";
import Link from "next/link";
import SectionHeader from "./section-header";
import { SIGNUP } from "@/constants/routes";

const ContactUs = () => {
  const social_links: {
    icon: IconType;
    url: string;
    label: string;
    handle: string;
  }[] = [
    {
      icon: FaWhatsapp,
      url: "https://wa.me/+2348120825084?text=Hello%20SEN-SEI Fitness",
      label: "WhatsApp",
      handle: "Chat with us",
    },
    {
      icon: FaInstagram,
      url: "https://www.instagram.com/sens.ei4fitness",
      label: "Instagram",
      handle: "@sens.ei4fitness",
    },
    {
      icon: FaXTwitter,
      url: "https://x.com/sensei4fitnesss",
      label: "X",
      handle: "@sensei4fitnesss",
    },
    {
      icon: FaTiktok,
      url: "https://www.tiktok.com/@sensei4fitness",
      label: "TikTok",
      handle: "@sensei4fitness",
    },
  ];

  return (
    <section className="bg-[#000] py-20 md:py-28 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Call to action */}
        <div className="relative overflow-hidden rounded-[32px] bg-default px-6 py-12 md:px-14 md:py-16 mb-20 md:mb-28 text-black">
          <span className="pointer-events-none absolute -right-6 -bottom-12 font-league uppercase text-[180px] md:text-[260px] leading-none text-black/10">
            Sensei
          </span>
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-[12px] uppercase tracking-[0.3em] font-semibold mb-2">
                Start today
              </p>
              <h2 className="font-league uppercase text-[44px] md:text-[64px] leading-[0.95] max-w-[560px]">
                Ready to transform your body?
              </h2>
            </div>
            <Link
              href={SIGNUP}
              className="shrink-0 self-start md:self-auto rounded-full bg-black px-8 py-4 font-league uppercase text-[22px] tracking-wide text-white transition hover:bg-black/85 active:scale-[0.97]"
            >
              Join us now
            </Link>
          </div>
        </div>

        <div id="contact-us" className="scroll-mt-28">
          <SectionHeader
            eyebrow="Get in touch"
            title={
              <>
                Contact <span className="text-default">Us</span>
              </>
            }
            description="You can reach us through any of the following channels"
          />

          <ul className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {social_links.map((link, id) => {
              return (
                <li key={id}>
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col items-center text-center gap-3 rounded-[24px] border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-default/60"
                  >
                    <span className="size-14 rounded-full bg-default/15 inline-flex items-center justify-center text-default transition group-hover:bg-default group-hover:text-white">
                      {React.createElement(link.icon, { size: 26 })}
                    </span>
                    <span>
                      <span className="block font-league uppercase text-[22px] leading-none">
                        {link.label}
                      </span>
                      <span className="block text-[12px] text-white/50 mt-1 break-all">
                        {link.handle}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="text-[13px] my-8 text-center text-white/40 uppercase tracking-[0.3em]">
            or via
          </p>

          <p className="text-center">
            <a
              href="mailto:sensei4fitness@gmail.com"
              className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-default/50 px-6 py-3 text-[15px] text-white transition hover:bg-default/10"
            >
              Email:
              <span className="text-default font-semibold">
                sensei4fitness@gmail.com
              </span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
