import InformationShop from "./InformationShop";
import DyariLogo from "../../components/DyariLogo";
const CreateShop = () => {
  return (
    <div className="flex justify-center items-center w-full min-h-screen sm:bg-[#f5f5f5] bg-white pt-16 pb-8">
      <DyariLogo />
      <div className="w-full sm:w-5/12 flex flex-col gap-y-3 bg-white px-2 sm:px-10 sm:py-6 sm:rounded-md sm:shadow-md border">
        <InformationShop />
      </div>
    </div>
  );
};

export default CreateShop;
