import React from "react";
import HeadingText from "./heading-text";

const WhyChooseUs = () => {
  const whys: { title: string; desc: string }[] = [
    {
      title: "Personal Training",
      desc: "Our gyms offer personalized training sessions with certified personal trainers who create customized workout plans based on individual goals",
    },
    {
      title: "Equipments and Facilities",
      desc: "Our gyms offer personalized training sessions with certified personal trainers who create customized workout plans based on individual goals",
    },
    {
      title: "Nutrition COunselling",
      desc: "Our gyms offer personalized training sessions with certified personal trainers who create customized workout plans based on individual goals",
    },
    {
      title: "Speciality Programs",
      desc: "Our gyms offer personalized training sessions with certified personal trainers who create customized workout plans based on individual goals",
    },
  ];
  return (
    <section className="bg-default-black py-[20px] px-4">
      <div className="mb-[30px]">
        <HeadingText centered>
          why <span className="text-default">choose us</span>
        </HeadingText>
        <p className="text-[12px] text-center text-muted-foreground">
          Gym workouts offer a versatile and customisable experience, allowing
          everyone to set specific fitness goals.
        </p>
      </div>
      <ul className="grid gap-4">
        {whys.map((why, id) => {
          return (
            <li key={id} className="border border-default p-4">
              <p className="mb-4 text-[20px] tracking-wide font-league">
                0{id + 1}
              </p>
              <h2 className="font-league text-[20px] tracking-wide uppercase text-default">
                {why?.title}
              </h2>
              <p className="text-[13px] font-light opacity-60">{why?.desc}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default WhyChooseUs;
