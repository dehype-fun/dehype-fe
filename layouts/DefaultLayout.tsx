import { FC, PropsWithChildren, useRef, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import Image from "next/image";
import dynamic from "next/dynamic";

import TopBar from "components/top-bar";
import Footer from "components/ui/Footer";
import NotificationCenter from "components/ui/NotificationCenter";
import GrillChat from "components/grillchat";
import { TradeItem, TradeItemContext } from "lib/hooks/trade";
import { useRouter } from "next/router";

import { Account } from "components/account/Account";
import { ConfirmationProvider } from "components/confirmation/ConfirmationProvider";
import { DisclaimerModal } from "components/onboarding/DisclaimerModal";

const NOTIFICATION_MESSAGE = process.env.NEXT_PUBLIC_NOTIFICATION_MESSAGE;

const Onboarding = dynamic(
  () => import("../components/onboarding/Onboarding"),
  {
    ssr: false,
  },
);

const greyBackgroundPageRoutes = [
  "/",
  "/markets",
  "/markets/favorites",
  "/create-account",
  "/deposit",
  "/topics",
];

const DefaultLayout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const [tradeItem, setTradeItem] = useState<TradeItem | null>(null);

  const {
    width,
    height,
    ref: mainRef,
  } = useResizeDetector({ refreshMode: "debounce", refreshRate: 50 });

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`relative min-h-screen justify-evenly bg-background-page text-white`}
    >
      <TradeItemContext.Provider value={{ data: tradeItem, set: setTradeItem }}>
        <div ref={contentRef} className={`flex-grow`}>
          <TopBar />
          <main
            className="container-fluid mb-12 mt-16 bg-background-page text-white"
            ref={mainRef}
            style={{ minHeight: "calc(100vh - 300px)" }}
          >
            <div
              className={`w-full ${
                ["/", "/markets"].includes(router.pathname) ? "pt-0" : "pt-2"
              }`}
            >
              {process.env.NEXT_PUBLIC_MIGRATION_IN_PROGRESS === "true" ? (
                <div className="flex h-[800px] w-full flex-col items-center justify-center ">
                  <div className="text-[24px] font-bold">
                    Migrating to Solana
                  </div>
                  <Image
                    src="/solana.png"
                    alt="Solana Logo"
                    width={300}
                    height={300}
                    style={{
                      animation: "rotation 2s infinite linear",
                    }}
                  />
                </div>
              ) : (
                children
              )}
            </div>
          </main>

          <Footer />
        </div>
        <NotificationCenter />
        <ConfirmationProvider />
        <DisclaimerModal />
      </TradeItemContext.Provider>
      <Account />
      <Onboarding />
      {process.env.NEXT_PUBLIC_GRILLCHAT_DISABLE !== "true" && <GrillChat />}
    </div>
  );
};

export default DefaultLayout;
