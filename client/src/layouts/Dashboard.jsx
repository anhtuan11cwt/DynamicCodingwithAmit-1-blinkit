import { MapPin, Package, User } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { icon: User, label: "Hồ sơ", to: "/dashboard/profile" },
  { icon: Package, label: "Đơn hàng", to: "/dashboard/myorders" },
  { icon: MapPin, label: "Địa chỉ", to: "/dashboard/address" },
];

const Dashboard = () => {
  return (
    <section className="mx-auto max-w-7xl px-3 py-6">
      <nav
        aria-label="Chuyển trang tài khoản"
        className="mb-5 flex gap-2 overflow-x-auto lg:hidden"
      >
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 font-medium text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary-200 ${
                isActive
                  ? "border-primary-200 bg-primary-100 text-secondary-100"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`
            }
            key={to}
            to={to}
          >
            <Icon aria-hidden="true" size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
            <p className="px-3 py-2 font-semibold text-gray-400 text-xs uppercase tracking-wide">
              Tài khoản
            </p>
            <nav aria-label="Menu tài khoản" className="flex flex-col">
              {navItems.map(({ icon: Icon, label, to }) => (
                <NavLink
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2.5 font-medium text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary-200 ${
                      isActive
                        ? "bg-primary-100 text-secondary-100"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                  key={to}
                  to={to}
                >
                  <Icon aria-hidden="true" size={18} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
