import { mainMenuItems } from "@/data/menu";
import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const { pathname } = useLocation();
  const isMenuActive = (href) =>
    href == "/" ? pathname == "/" : pathname.split("/")[1] == href.split("/")[1];

  return (
    <>
      {mainMenuItems.map((elm) => (
        <li key={elm.id} className="navigation__item">
          <Link
            to={elm.href}
            className={`navigation__link ${
              isMenuActive(elm.href) ? "menu-active" : ""
            }`}
          >
            {elm.title}
          </Link>
        </li>
      ))}
    </>
  );
}
