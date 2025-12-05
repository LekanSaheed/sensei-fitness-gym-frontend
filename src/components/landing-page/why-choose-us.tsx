import React from "react";
import HeadingText from "./heading-text";

const WhyChooseUs = () => {
  const whys: { title: string; desc: string }[] = [
    {
      title: "Personal Training",
      desc: "Our gyms offer personalized training sessions with certified personal trainers who create customized workout plans based on individual goals",
    },
    {
      title: "Equipment and Facilities",
      desc: "Our gyms offer personalized training sessions with certified personal trainers who create customized workout plans based on individual goals",
    },
    {
      title: "Nutrition Counselling",
      desc: "Our gyms offer personalized training sessions with certified personal trainers who create customized workout plans based on individual goals",
    },
    {
      title: "Speciality Programs",
      desc: "Our gyms offer personalized training sessions with certified personal trainers who create customized workout plans based on individual goals",
    },
  ];
  return (
    <section className="bg-default-black py-[20px] md:py-[30px] lg:py-[40px] xl:py-[50px] 2xl:py-[60px] px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-[40px] md:mb-[50px] lg:mb-[60px] xl:mb-[70px] 2xl:mb-[100px]">
          <HeadingText centered>
            why <span className="text-default">choose us</span>
          </HeadingText>
          <p className="text-[12px] text-center text-muted-foreground md:text-[14px] lg:text-[15px] xl:text-[16px] max-w-[350px] md:max-w-[400px] lg:max-w-[450px] mx-auto ">
            Gym workouts offer a versatile and customisable experience, allowing
            everyone to set specific fitness goals.
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {whys.map((why, id) => {
            return (
              <li
                key={id}
                className="border border-default p-4 md:p-6 xl:p-7 transition-all"
              >
                <p className="mb-4 text-[20px] tracking-wide font-league md:text-[24px] lg:text-[28px] xl:text-32px]">
                  0{id + 1}
                </p>
                <h2 className="font-league  text-[20px] tracking-tight uppercase text-default md:text-[24px] lg:text-[28px] xl:text-[32px]">
                  {why?.title}
                </h2>
                <p className="text-[13px] font-extralight opacity-60 lg:text-[15px] xl:text-[17px]">
                  {why?.desc}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default WhyChooseUs;
