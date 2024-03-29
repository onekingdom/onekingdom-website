"use client";
import { EventsStorage } from "@/types/events";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import EventTimelineCard from "./EventTimelineCard";
import EventTimelineNav from "./EventTimelineNav";
import FadeIn from "./Framer/FadeIn";
import Image from "next/image";
import Divider from "@/components/svg/Divider.svg";
import { Controller } from "swiper/modules";

interface Props {
  title: string;
  events: EventsStorage;
}
const Timeline = ({ title, events }: Props) => {
  const [active, setActive] = useState(1);

  return (
    <FadeIn>
      <div className="relative py-40">
        <span className="fill-[#111111] absolute inset-x-0 w-full top-0 h-auto block z-50 text-black">
          <Divider />
        </span>
        <span className="fill-[#111111] absolute inset-x-0 bottom-[-1px] transform rotate-180">
          <Divider />
        </span>

        <div className="container">
          <div className="neoh_fn_title">
            <h3 className="fn_title">{title}</h3>
            <div className="line">
              <span />
            </div>
          </div>
          <div className="neoh_fn_timeline">
            <div className="timeline_content">
              <Swiper
                spaceBetween={50}
                slidesPerView={1}
                onSlideChange={(x) => setActive(x.activeIndex + 1)}
                className="timeline_list"
                style={{ width: "100%" }}
                modules={[Controller]}
              >
                <EventTimelineNav events={events} active={active} />
                {events.documents &&
                  events.documents.map((event) => {
                    return (
                      <SwiperSlide key={event.$id}>
                        <EventTimelineCard event={event} />
                      </SwiperSlide>
                    );
                  })}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};
export default Timeline;
