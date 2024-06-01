import React from 'react';
import { NavLink } from 'react-router-dom'

interface Props {
    to: string;
    icon: string;
    title: string;
    description: string;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SidebarMenuItem = ({to, icon, title, description, open, setOpen}:Props) => {

  const onSelectOpt = () => {
    setOpen(!open)
  }

  return (
    <NavLink
            to={ to }
            className={({ isActive }) =>
              isActive
              ? 'flex justify-center items-center bg-gray-800 rounded-md p-2 transition-colors'
              : 'flex justify-center items-center hover:bg-gray-800 rounded-md p-2 transition-colors'
            }
            onClick={onSelectOpt}
        >

        <i className={ `${ icon } text-2xl mr-4 text-indigo-500` }></i>
        <div className="flex flex-col flex-grow">
            <span className="text-lg">
            { title }
            </span>
            <span className="text-sm text-slate-400">
            { description }
            </span>
        </div>
    </NavLink>
  )
}
