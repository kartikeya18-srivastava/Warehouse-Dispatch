import packageIcon from "../assets/icons/package.svg";
import dashboardIcon from "../assets/icons/dashboard.svg";
import truckIcon from "../assets/icons/truck.svg";

export const Icons = {
    Package: ({ className }: { className?: string }) => <img src={packageIcon} className={className} alt="Package" />,
    Dashboard: ({ className }: { className?: string }) => <img src={dashboardIcon} className={className} alt="Dashboard" />,
    Truck: ({ className }: { className?: string }) => <img src={truckIcon} className={className} alt="Truck" />,
};
