import { Outlet } from "react-router-dom";
import { menuRoutes } from "../router/router";
import { SidebarMenuItem } from "../components";
import { useState } from "react";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/16/solid";

export const DashboardLayout = () => {

  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open)
  }

  return (
    <main>
      <div className="flex flex-col items-center">
        <h1>ReactGPT</h1>
        <p className="text-slate-400">Code by Sebas</p>
      </div>

      <div className="flex flex-row my-7">
        <nav className={`md:flex flex-col ml-10 w-[400px] min-h-[calc(100vh-3.0rem)] bg-white bg-opacity-10 p-5 rounded-3xl ${open ? 'flex ml-2 md:ml-10' :'hidden'}`}>

          <h1 className="font-bold text-lg lg:text-3xl bg-gradient-to-br from-white via-white/50 bg-clip-text text-transparent">
            ReactGPT<span className="text-indigo-500">.</span>
          </h1>
          <span className="text-xl">Menu</span>

          <div className="border-gray-700 border my-3" />

          {/* Menu Options */}
          {
            menuRoutes.map( opt => (
              <SidebarMenuItem key={opt.to} {...opt} open={open} setOpen={setOpen}/>
            ))
          }
        </nav>

        <section className={`mx-3 sm:mx-10 flex flex-col w-full h-[calc(100vh-50px)]  bg-white bg-opacity-10 p-5 rounded-3xl ${open ? 'hidden md:flex' :'flex'}`}>
          <div className="flex flex-row h-full">
            <div className="flex flex-col flex-auto h-full p-1">
              <Outlet />
            </div>
          </div>
        </section>
      </div>

      {/* Fixed Button */}
      <div className="flex md:hidden fixed top-10 left-5 z-10">
        {
          (open)
              ? (
                  <button
                      className="transform rotate-90 transition-all duration-300 bg-blue-500 rounded-full p-4"
                      onClick={handleToggle}
                  >
                  <XMarkIcon className="h-6 w-6" />
                  </button>
                )

              : (
                  <button
                      className="transform rotate-0 transition-all duration-300"
                      onClick={handleToggle}
                  >
                  <Bars2Icon className="h-6 w-6" />
                  </button>
                )
        }
        </div>
    </main>

  );
};