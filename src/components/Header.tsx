import { Menubar } from "primereact/menubar";

function Header() {
    return (
        <div className="flex text-black">
            <Menubar start="Weather App"></Menubar>
        </div>
    );
}

export default Header;
