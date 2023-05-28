import LogInForm from "@/app/components/LogInForm";
import NavBar from "../components/NavBar";

export default function Page() {
    return(
        <div>
        {/* <NavBar /> */}
        <LogInForm reset={false} token={undefined} tokenId={undefined} />
        </div>

    )
}
