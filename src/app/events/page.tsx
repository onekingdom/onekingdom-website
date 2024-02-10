// "use client";
import EventTimelineCard from "@/components/EventTimelineCard";
import { EventStorage } from "@/types/events";
import { database } from "@/utils/serverAppwrite";
import { Metadata } from "next";

async function getEvents() {
  const res = await database.listDocuments<EventStorage>("658fabb7b076a84d06d2", "658fabbcde4c0d2a25cd");
  // console.log(res);
  return res;
}

export const metadata: Metadata = {
  title: "Events | One Kingdom",
};

export default async function Page() {
  const events = await getEvents();

  return (
    <div className="neoh_fn_roadmappage">
      <div className="container">
        <div className="neoh_fn_roadmaplist">
          <ul className="roadlist">
            {events.documents.map((event) => {
              return <EventTimelineCard event={event} key={event.$id} />;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
