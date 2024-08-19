"use client";

// the dao home
import "@fileverse-dev/ddoc/styles";

import { useEffect, useState } from "react";

import { Button } from "../../components/ui/Button";
import DaoEvent from "../../components/DaoEvents";
import { DaoLink } from "../../../types/DaoLink";
import DaoLinks from "../../components/DaoLinks";
import { DdocEditor } from "@fileverse-dev/ddoc";
import Link from "next/link";
import PlatformLayout from "../../layouts/platformLayout";
import { getCalendar } from "../../../lib/calendar";
import { getDocument } from "../../../lib/firestore";
import { useAuth } from "../../components/contexts/AuthContext";
import { useParams } from "next/navigation";

// import "@fileverse-dev/ddoc/dist/style.css";

// import { Breadcrumb } from "@/components/ui/Breadcrumb";
// import Chip from "@/components/ui/Chip";

// import StyledIcon from "@/components/StyledIcon";
// import { usePrivy } from "@privy-io/react-auth";

export default function TokenPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const par = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [calendar, setCalendar] = useState([]);
  const { authenticated, user, ready } = useAuth();

  const [tokenB, setTokenB] = useState("No token");

  useEffect(() => {
    async function exe() {
      const events = await getCalendar();
      setCalendar(events);
    }

    if (!id) {
      return;
    }

    exe();
  }, [id]);

  const handleNewDraft = () => {
    setIsOpen(!isOpen);
    // console.log("user ", user, authenticated);
  };

  useEffect(() => {
    console.log("Auth state in component:", { authenticated, user, ready });
  }, [authenticated, ready, user]);

  const [daoLinks, setDaoLinks] = useState<DaoLink[]>([]);
  const [daoTemplates, setDaoTemplates] = useState<DaoLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const docs = await getDocument("DAOS", id);
        console.log("-----++++dao result ", docs);

        setDaoLinks(docs?.links as DaoLink[]);
        setDaoTemplates(docs?.templates as DaoLink[]);
        setLoading(false);
      } catch (err) {
        console.log("err ", err);
        setError("Error fetching documents ");
        setLoading(false);
      }
    }
    if (!id) return;
    fetchDocuments();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <PlatformLayout>
      <div className="flex flex-row  w-full  relative">
        {/* dashboard  */}
        <div className="flex flex-col w-full pt-16 px-8">
          {/* <div className="dark:text-stone-100 flex  items-center gap-2">
            <Link className="text-2xl" href={"/dao-manager"}>
              ←
            </Link>
          </div> */}
          <div
            id="sector1"
            className="flex my-6 flex-col sm:flex-row w-full gap-4"
          >
            <div className="w-full">
              <div
                className="flex flex-col rounded-t-lg border border-transparent px-5 py-4 transition-colors
                bg-stone-50 dark:bg-stone-700
                text-stone-600 dark:text-stone-300"
              >
                <h2 className="mb-3 text-xl font-semibold">
                  {id.charAt(0).toUpperCase() + id.slice(1).toLowerCase()}{" "}
                  resources
                </h2>
                <p className="m-0 max-w-[30ch] text-sm opacity-50">
                  Access important DAO resources and documents.
                </p>
                <button
                  onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                  className="justify-end self-end"
                >
                  {isResourcesOpen ? "↑" : "↓"}
                </button>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out
                    ${isResourcesOpen ? "max-h-96" : "max-h-0"}
                  `}
              >
                <div className="dark:bg-stone-600 bg-stone-100 rounded-b-lg p-4 text-xs">
                  <DaoLinks arrayLinks={daoLinks} />
                </div>
              </div>
            </div>

            <div className="w-full">
              <div
                className="flex flex-col rounded-t-lg border border-transparent px-5 py-4 transition-colors
                bg-stone-50 dark:bg-stone-700
                text-stone-600 dark:text-stone-300"
              >
                <h2 className="mb-3 text-xl font-semibold">Templates</h2>
                <p className="m-0 max-w-[30ch] text-sm opacity-50">
                  Use pre-built templates for common DAO tasks.
                </p>
                <button
                  onClick={() => setIsTemplatesOpen(!isTemplatesOpen)}
                  className="justify-end self-end"
                >
                  {isTemplatesOpen ? "↑" : "↓"}
                </button>
              </div>
              <div
                className={`
                  overflow-hidden transition-all duration-300 ease-in-out
                  ${isTemplatesOpen ? "max-h-96" : "max-h-0"}
                `}
              >
                <div className="dark:bg-stone-600 bg-stone-100 rounded-b-lg p-4 text-xs">
                  {/* <DaoLinks arrayLinks={daoTemplates} /> */}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div
              className="group rounded-t-lg border border-transparent px-5 py-4 
                transition-colors
              text-stone-600 dark:text-stone-300"
            >
              <h2 className="mb-3 text-xl font-semibold">Calendar</h2>
              <p className="m-0 max-w-[30ch] text-sm opacity-50">
                View upcoming DAO events and meetings.
              </p>
            </div>

            {/* das kalender  */}
            <div
              className="flex gap-4 pb-3 mb-6 overflow-x-hidden hover:overflow-x-scroll
           scrollbar-default"
            >
              {calendar.length > 0 ? (
                calendar.map((item: any, key) => (
                  <div key={key}>
                    <DaoEvent
                      id={item.id}
                      updated={item.updated}
                      summary={item.summary}
                      creatorEmail={item.creatorEmail}
                      htmlLink={item.htmlLink}
                      start={item.start}
                      startTimezone={item.startTimezone}
                      end={item.end}
                      endTimeZone={item.endTimeZone}
                      hangoutLink={item.hangoutLink}
                    />
                  </div>
                ))
              ) : (
                <>No events set for the next two weeks</>
              )}
            </div>
          </div>
          <div
            id="sector2"
            className="flex  flex-col sm:flex-row w-full gap-8 "
          >
            <div
              className="bg-transparent w-full border p-4 rounded-md
            text-stone-600 dark:text-stone-300
            border-stone-300 dark:border-stone-700"
            >
              <div className="flex justify-between">
                <p className="text-xl font-semibold">Projects</p>
                <Button variant={"ghost"} size={"sm"}>
                  + New project
                </Button>
              </div>
              <span className="text-xs">
                View and manage all active subprojects.
              </span>

              {/* the list  */}
              <div className="flex flex-col mt-2 gap-1 hidden">
                <Link href={"#"}>
                  <div
                    className="hover:bg-amber-100 dark:hover:bg-amber-400 hover:dark:text-stone-800
              px-2 py-1 rounded-md
              text-xs font-mono grid grid-cols-2"
                  >
                    <div>Project 1</div>
                    <div className="text-right">11 Collaborators</div>
                  </div>
                </Link>

                <Link href={"#"}>
                  <div
                    className="hover:bg-amber-100 dark:hover:bg-amber-400 hover:dark:text-stone-800
              px-2 py-1 rounded-md
              text-xs font-mono grid grid-cols-2"
                  >
                    <div>Project 2</div>
                    <div className="text-right">11 Collaborators</div>
                  </div>
                </Link>

                <Link href={"#"}>
                  <div
                    className="hover:bg-amber-100 dark:hover:bg-amber-400 hover:dark:text-stone-800
              px-2 py-1 rounded-md
              text-xs font-mono grid grid-cols-2"
                  >
                    <div>Project 3</div>
                    <div className="text-right">11 Collaborators</div>
                  </div>
                </Link>
              </div>
            </div>

            <div
              className="bg-transparent w-full border p-4 rounded-md
              text-stone-600 dark:text-stone-300
              border-stone-300 dark:border-stone-700"
            >
              <div className="flex items-baseline justify-between">
                <p className="text-xl font-semibold">Drafts</p>
                <Button onClick={handleNewDraft} variant={"ghost"} size={"sm"}>
                  + New draft
                </Button>
              </div>
              <span className="text-xs">
                Access work on your draft proposals. New project
              </span>

              {/* the list  */}
              <div className="flex flex-col mt-2 gap-1 ">
                <Link href={"#"}>
                  <div
                    className="hover:bg-amber-100 dark:hover:bg-amber-400 hover:dark:text-stone-800
              px-2 py-1 rounded-md
              text-xs font-mono grid grid-cols-2"
                  >
                    <div>Proposal 1</div>
                    <div className="text-right">11 Collaborators</div>
                  </div>
                </Link>

                <Link href={"#"}>
                  <div
                    className="hover:bg-amber-100 dark:hover:bg-amber-400 hover:dark:text-stone-800
              px-2 py-1 rounded-md
              text-xs font-mono grid grid-cols-2"
                  >
                    <div>Proposal 1</div>
                    <div className="text-right">11 Collaborators</div>
                  </div>
                </Link>

                <Link href={"#"}>
                  <div
                    className="hover:bg-amber-100 dark:hover:bg-amber-400 hover:dark:text-stone-800
              px-2 py-1 rounded-md
              text-xs font-mono grid grid-cols-2"
                  >
                    <div>Proposal 1</div>
                    <div className="text-right">11 Collaborators</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* sliding editor  */}
        {isOpen ? (
          <div
            className="
            bg-slate-200 dark:bg-stone-700 dark:text-stone-400
            bg-opacity-90 backdrop-blur-sm rounded-xl
            absolute z-50 w-2/3 h-screen right-0 shadow-lg 
            transition-opacity duration-300 ease-in-out
            opacity-100"
          >
            <div className="flex pb-4 justify-between">
              <Button variant={"ghost"} onClick={() => setIsOpen(false)}>
                <span className="text-lg mt-2 font-thin">✕</span>
              </Button>
              <span className="text-md mt-3 mr-6">Creating draft</span>
            </div>

            <DdocEditor
              walletAddress={user?.wallet?.address}
              disableBottomToolbar={false}
              isPreviewMode={false}
              showCommentButton={true}
            ></DdocEditor>
          </div>
        ) : (
          <div
            className="
            bg-slate-200 dark:bg-stone-700 dark:text-stone-400
            bg-opacity-90 backdrop-blur-sm rounded-xl
            absolute z-50 w-2/3 h-screen right-0 pt-10 shadow-lg
            transition-opacity duration-300 ease-in-out
            opacity-0 pointer-events-none"
          ></div>
        )}
      </div>
    </PlatformLayout>
  );
}
