import Spinner from "../../../public/Spinner.svg";
import Image from "next/image";

export function Loader() {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-white/50 backdrop-blur-sm z-50">
            <Image src={Spinner} alt="Loading..." width={100} height={100} priority />
        </div>
    );
}
