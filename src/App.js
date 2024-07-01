import {
  unstable_HistoryRouter as HistoryRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { history } from "./utils";
import "./App.css";
import { AuthComponent } from "@/components/AuthComponent";
import { lazy, Suspense } from "react";
// 按需导入组件
// const Login = lazy(() => import('./pages/Login'))
const Layout = lazy(() => import("./pages/Layout"));
const Home = lazy(() => import("./pages/Home"));
const Article = lazy(() => import("./pages/Article"));
const Publish = lazy(() => import("./pages/Publish"));
const About = lazy(() => import("./pages/About"));
const StartList = lazy(() => import("./pages/Start"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const TagArtList = lazy(() => import("./pages/TagArtList"));
const Success = lazy(() => import("./pages/Success"));
const Page404 = lazy(() => import("./pages/404"));
const Page500 = lazy(() => import("./pages/500"));
const Authorization = lazy(() => import("./pages/Authorization"));

function App() {
  return (
    // 路由配置
    <HistoryRouter history={history}>
      <div className="App">
        <Suspense
          fallback={
            <div
              style={{
                textAlign: "center",
                marginTop: 200,
              }}
            >
              loading...
            </div>
          }
        >
          <Routes>
            {/* 创建路由path和组件对应关系 */}
            {/* Layout需要鉴权处理的 */}
            {/* 这里的Layout不一定不能写死 要根据是否登录进行判断 */}
            <Route path="/" element={<Navigate to="/list" />}></Route>
            <Route path="/admin" element={<Layout />}>
              <Route path="/admin" index element={<Home />}></Route>
              <Route path="/admin/article" element={<Article />}></Route>
              <Route path="/admin/publish" element={<Publish />}></Route>
              <Route path="/admin/publish/:id" element={<Publish />}></Route>
            </Route>
            {/* 这个不需要 */}
            <Route
              path="/about"
              element={
                <AuthComponent>
                  <Layout />
                </AuthComponent>
              }
            >
              <Route path="/about" element={<About />}></Route>
            </Route>

            <Route
              path="/list"
              element={
                <AuthComponent>
                  <Layout />
                </AuthComponent>
              }
            >
              <Route path="/list" element={<StartList />}></Route>
              <Route path="/list/detail" element={<ArticleDetail />}></Route>
            </Route>
            <Route
              path="/tags"
              element={
                <AuthComponent>
                  <Layout />
                </AuthComponent>
              }
            >
              <Route path="/tags/:tag" element={<TagArtList />}></Route>
            </Route>
            <Route path="/handle" element={<Layout />}>
            <Route path="/handle/success" element={<Success />} />
            <Route path="/handle/404" element={<Page404 />} />
            <Route path="/handle/500" element={<Page500 />} />
            <Route path="/handle/NoAuthorization" element={<Authorization />} />
            {/* 当所有其他路由都不匹配时，显示404页面 */}
          </Route>
          <Route path="*" element={<Page404 />} />{" "}

          </Routes>

        </Suspense>
      </div>
    </HistoryRouter>
  );
}

export default App;
