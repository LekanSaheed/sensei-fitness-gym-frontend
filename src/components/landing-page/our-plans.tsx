"use client";
import React from "react";
import HeadingText from "./heading-text";
import { useGetPlansQuery } from "@/redux/api-slices/subscription.slice";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import FormatNumber from "@/utils/format-number";

const OurPlans = () => {
  const { isLoading, isFetching, data, isError, refetch } =
    useGetPlansQuery(null);

  const plans = data?.data?.plans || [];
  return (
    <section className="bg-default-black py-[20px] md:py-[30px] lg:py-[40px] xl:py-[50px] 2xl:py-[60px] px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-[40px] md:mb-[50px] lg:mb-[60px] xl:mb-[70px] 2xl:mb-[100px]">
          <HeadingText centered>
            Our <span className="text-default">plans</span>
          </HeadingText>
          <p className="text-[12px] text-center text-muted-foreground md:text-[14px] lg:text-[15px] xl:text-[16px] max-w-[350px] md:max-w-[400px] lg:max-w-[450px] mx-auto ">
            See our plans customized to your pocket and time
          </p>
        </div>
        <Carousel opts={{ align: "center" }}>
          <CarouselContent className="-ml-[30px]">
            {plans.map((plan, id) => {
              return (
                <CarouselItem
                  key={id}
                  className="basis-1/2 lg:basis-1/3  pl-[30px] bg-[#222] p-4"
                >
                  <div>{plan.name}</div>
                  <p className="text-[20px] font-bold">
                    {FormatNumber.ngnAmount(plan.price)}
                  </p>
                  <p className="font-light text-[12px]">
                    {" "}
                    {plan?.durationInDays} day
                    {plan?.durationInDays > 1 ? "s" : ""} access
                  </p>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default OurPlans;
