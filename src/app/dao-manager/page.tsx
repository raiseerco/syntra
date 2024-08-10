import DaoCard from "../components/DaoCard";
import Link from "next/link";
import PlatformLayout from "../layouts/platformLayout";

export default function DaoManager() {
  return (
    <PlatformLayout>
      <div className="py-16 m-6 gap-6 flex flex-wrap bg-gree content-start justify-right min-h-screen ">
        <DaoCard
          name={"Arbitrum"}
          colour={"bg-blue-600"}
          path={"/daos/arbitrum"}
          collabs={11}
          projects={10}
          disabled={false}
        />
        <DaoCard
          name={"Optimism"}
          colour={"bg-red-500"}
          path={"/daos/optimism"}
          collabs={22}
          projects={11}
          disabled={false}
        />
        <DaoCard
          name={"Web3 Dao"}
          colour={"bg-stone-300"}
          path={"/daos/web3"}
          collabs={10}
          projects={6}
          disabled={false}
        />
        {/* new ones  */}
        <DaoCard
          name={"Maker Dao"}
          colour={"bg-emerald-500"}
          path={"/daos/maker"}
          collabs={10}
          projects={6}
          disabled
        />
        <DaoCard
          name={"Nouns"}
          colour={"bg-orange-700"}
          path={"/daos/nouns"}
          collabs={10}
          projects={6}
          disabled
        />
        <DaoCard
          name={"Aave"}
          colour={"bg-pink-500"}
          path={"/daos/aave"}
          collabs={10}
          projects={6}
          disabled
        />
        <DaoCard
          name={"ENS"}
          colour={"bg-sky-600"}
          path={"/daos/ens"}
          collabs={10}
          projects={6}
          disabled
        />
        <DaoCard
          name={"Gnosis"}
          colour={"bg-green-600"}
          path={"/daos/gnosis"}
          collabs={10}
          projects={6}
          disabled
        />
        <DaoCard
          name={"Lido"}
          colour={"bg-sky-400"}
          path={"/daos/lido"}
          collabs={10}
          projects={6}
          disabled
        />
        <DaoCard
          name={"Safe"}
          colour={"bg-green-300"}
          path={"/daos/safe"}
          collabs={10}
          projects={6}
          disabled
        />
        <DaoCard
          name={"Uniswap"}
          colour={"bg-pink-600"}
          path={"/daos/uniswap"}
          collabs={10}
          projects={6}
          disabled
        />
      </div>
    </PlatformLayout>
  );
}
