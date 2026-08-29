import route0 from "../modules/k-character/route";
import route1 from "../modules/products/route";
import route2 from "../modules/b-passbank/route";
import route3 from "../modules/h-entertainment-tracker/route";
import route4 from "../modules/e-url-shortener/route";
import route5 from "../modules/h-entertainment-tracker-type/route";

export const routes = [
  {
    path: "/k-character",
    route: route0,
  },
  {
    path: "/products",
    route: route1,
  },
  {
    path: "/b-passbank",
    route: route2,
  },
  {
    path: "/h-entertainment-tracker",
    route: route3,
  },
  {
    path: "/e-url-shortener",
    route: route4,
  },
  {
    path: "/h-entertainment-tracker-type",
    route: route5,
  },
];
