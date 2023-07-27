//Pages
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Login from "../pages/Login";

//Layout
// import { HeaderOnly } from '~/layouts';

//config
import routes from "../config";
import DefaultLayout from "../layouts/DefaultLayout";

//public routes:
const publicRoutes = [
  { path: routes.home, component: Home, layout: DefaultLayout },
  { path: routes.profile, component: Profile, layout: DefaultLayout },
  { path: routes.login, component: Login, layout: DefaultLayout },
];

export { publicRoutes };
