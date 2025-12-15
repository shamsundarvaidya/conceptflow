import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@xyflow/react/dist/style.css';
import '@mantine/core/styles.css';


import { MantineProvider } from "@mantine/core";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import Root from "./layout/Root";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";



import { ProtectedRoute } from "./components/ProtectedRoute";
import ProjectsPage from "./pages/projectsPage";
import CreateProjectPage from "./pages/CreateProjectPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "login",
        Component: LoginPage,
      },
      {
        path: "register",
        Component: RegisterPage,
      },
      // Protected Routes
      {
        path: "app",
        Component: ProtectedRoute,
        children: [
          {
            path: "projects",
            Component: ProjectsPage,
          },
          {
            path: "createproject",
            Component: CreateProjectPage,
          },
          // Future routes like /app/editor/:id can go here
        ]
      }
    ],
  },
]);

if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser");
  await worker.start({
    onUnhandledRequest: "bypass", // Avoid warnings
  });
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="light">
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>,
)
