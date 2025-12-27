"use client";
import React from "react";
import HeadingText from "./heading-text";
import { useGetPlansQuery } from "@/redux/api-slices/subscription.slice";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import FormatNumber from "@/utils/format-number";
import Button from "../button";
import Link from "next/link";
import { SIGNUP } from "@/constants/routes";

const OurPlans = () => {
  const { isLoading, isFetching, data, isError, refetch } =
    useGetPlansQuery(null);

  const plans = data?.data?.plans || [];

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <section className="bg-default-black py-[20px] md:py-[30px] lg:py-[40px] xl:py-[50px] 2xl:py-[60px] px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-[40px] md:mb-[50px] lg:mb-[60px] xl:mb-[70px] 2xl:mb-[100px]">
          <HeadingText centered>
            Our <span className="text-default"> plans</span>
          </HeadingText>
          <p className="text-[12px] text-center text-muted-foreground md:text-[14px] lg:text-[15px] xl:text-[16px] max-w-[350px] md:max-w-[400px] lg:max-w-[450px] mx-auto ">
            See our plans customized to your pocket and time
          </p>
        </div>

        <div className="overflow-hidden">
          <div className="flex overflow-x-auto scroll-con pb-4 snap-x gap-4 snap-mandatory">
            {(isLoading || isFetching) && (
              <>
                {[...Array(7)].map((_, id) => {
                  return (
                    <div
                      className="sm:w-[60%] md:w-[33.3%] h-[200px] border animate-pulse border-default-tertiary/50 shrink-0 snap-start p-4"
                      key={id}
                    >
                      <div className="bg-black/50 mb-2 h-[15px] w-[140px] rounded-[10px] animate-pulse" />
                      <div className="bg-black/50 mb-4 h-[10px] w-[90%] rounded-[10px] animate-pulse" />
                      <div className="bg-black/50 mb-5 h-[30px] w-[100px] rounded-[10px] animate-pulse" />
                      <div className="bg-default/50 h-[35px] w-[100px] animate-pulse" />
                    </div>
                  );
                })}
              </>
            )}
            {plans.map((plan, id) => {
              return (
                <div
                  key={id}
                  className="w-[80%] sm:w-[60%] md:w-[33.3%] shrink-0 snap-start  border border-default-tertiary  p-4"
                >
                  <div className="mb-4">
                    {" "}
                    <div className="font-bold">{plan.name}</div>
                    <p className="font-light text-[12px]">
                      {" "}
                      {plan?.description}
                    </p>
                    <p className="text-[25px] tracking-tight mt-2 font-bold">
                      {FormatNumber.ngnAmount(plan.price)}
                    </p>
                  </div>

                  <div className="">
                    {" "}
                    <Link href={SIGNUP}>
                      <Button label="Get started" brandedFont />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <HeadingText centered>opening hours & schedules</HeadingText>

          <div className="text-center">
            {days.map((day, id) => {
              return (
                <div key={id} className="mb-2">
                  <HeadingText className="text-default"> {day}</HeadingText>
                  {id === 6 ? (
                    <p>Closed</p>
                  ) : (
                    <p className="text-[12px]">
                      Morning: 8am - 12pm, Evening: 4pm - 9pm
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPlans;
