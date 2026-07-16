import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Dumbbell, ShoppingBag, Clock } from 'lucide-react';

const AdminNav = () => {
  const links = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/members', label: 'Members', icon: Users },
    { to: '/admin/plans', label: 'Plans', icon: CreditCard },
    { to: '/admin/equipment', label: 'Equipment', icon: Dumbbell },
    { to: '/admin/products', label: 'Products', icon: ShoppingBag },
    { to: '/admin/timings', label: 'Timings', icon: Clock },
  ];

  return (
    <div className="glass-card border border-gym-border rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8">
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="flex items-center gap-1 sm:gap-2 min-w-max">
          <span className="text-gym-neon font-display font-extrabold uppercase tracking-wider text-xs mr-2 border-r border-gym-border pr-3 hidden md:inline-block whitespace-nowrap shrink-0">
            Admin Portal
          </span>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? 'bg-gym-neon text-gym-dark shadow-md shadow-gym-neon/10'
                      : 'text-gray-400 hover:text-white hover:bg-gym-border'
                  }`
                }
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
