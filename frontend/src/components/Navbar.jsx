

import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Logo from "./Logo";
import Button from "./Button";

const linkClass = ({ isActive }) =>
  `relative font-body text-sm font-semibold transition-colors ${
    isActive ? "text-ink" : "text-ink/55 hover:text-ink"
  }`;

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Logout
  const handleLogout = () => {
    closeMobileMenu();
    logout();
    navigate("/login");
  };

  // Prevent background scrolling while mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close menu when pressing Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-white">
      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-6">
        {/* Logo */}
        <NavLink to="/" aria-label="EventraX home" onClick={closeMobileMenu}>
          <Logo />
        </NavLink>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================== */}
        <div className="hidden items-center gap-7 md:flex">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/events" className={linkClass}>
              Events
            </NavLink>
          )}

          {isAuthenticated && (
            <NavLink to="/my-bookings" className={linkClass}>
              My tickets
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}
        </div>

        {/* =================================================
            DESKTOP ACTIONS
        ================================================== */}
        <div className="hidden items-center gap-2.5 md:flex">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/profile"
                className="rounded-lg px-2 py-1.5 text-sm font-semibold text-ink/55 transition-colors hover:bg-paper hover:text-ink"
              >
                Profile
              </NavLink>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="!rounded-lg !px-3.5 !py-2"
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="px-2 py-2 text-sm font-semibold text-ink/55 transition-colors hover:text-ink"
              >
                Log in
              </NavLink>

              <Button
                variant="primary"
                onClick={() => navigate("/signup")}
                className="!rounded-lg !px-4 !py-2"
              >
                Sign up
              </Button>
            </>
          )}
        </div>

        {/* =================================================
            MOBILE HAMBURGER
        ================================================== */}
        <button
          type="button"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="relative z-[60] flex h-11 w-11 items-center justify-center rounded-xl text-ink transition-colors hover:bg-paper md:hidden"
        >
          <span className="sr-only">
            {isMobileMenuOpen ? "Close menu" : "Open menu"}
          </span>

          <div className="flex w-6 flex-col gap-[5px]">
            {/* Top line */}
            <span
              className={`block h-[3px] w-6 rounded-full bg-ink transition-all duration-300 ease-out ${
                isMobileMenuOpen ? "translate-y-[8px] rotate-45" : ""
              }`}
            />

            {/* Middle line */}
            <span
              className={`block h-[3px] w-6 rounded-full bg-ink transition-all duration-300 ease-out ${
                isMobileMenuOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
              }`}
            />

            {/* Bottom line */}
            <span
              className={`block h-[3px] w-6 rounded-full bg-ink transition-all duration-300 ease-out ${
                isMobileMenuOpen ? "-translate-y-[8px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* =====================================================
          FULL SCREEN MOBILE MENU
      ====================================================== */}
      <div
        className={`fixed inset-0 top-[65px] z-40 bg-white md:hidden ${
          isMobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        } transition-opacity duration-300`}
      >
        <div className="flex h-full min-h-[calc(100dvh-65px)] flex-col overflow-y-auto bg-white">
          <div className="flex flex-1 flex-col px-5 py-7 sm:px-6">
            <div className="flex flex-col gap-1">
              {/* HOME */}
              <NavLink
                to="/"
                end
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-2xl px-5 py-4 font-body text-base font-semibold transition-all ${
                    isActive
                      ? "bg-paper text-ink"
                      : "text-ink/60 hover:bg-paper hover:text-ink"
                  }`
                }
              >
                <span>Home</span>

                <span className="text-lg opacity-40 transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </NavLink>

              {/* EVENTS */}
              {isAuthenticated && (
                <NavLink
                  to="/events"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-2xl px-5 py-4 font-body text-base font-semibold transition-all ${
                      isActive
                        ? "bg-paper text-ink"
                        : "text-ink/60 hover:bg-paper hover:text-ink"
                    }`
                  }
                >
                  <span>Events</span>

                  <span className="text-lg opacity-40 transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </NavLink>
              )}

              {/* MY TICKETS */}
              {isAuthenticated && (
                <NavLink
                  to="/my-bookings"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-2xl px-5 py-4 font-body text-base font-semibold transition-all ${
                      isActive
                        ? "bg-paper text-ink"
                        : "text-ink/60 hover:bg-paper hover:text-ink"
                    }`
                  }
                >
                  <span>My tickets</span>

                  <span className="text-lg opacity-40 transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </NavLink>
              )}

              {/* ADMIN */}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-2xl px-5 py-4 font-body text-base font-semibold transition-all ${
                      isActive
                        ? "bg-paper text-ink"
                        : "text-ink/60 hover:bg-paper hover:text-ink"
                    }`
                  }
                >
                  <span>Admin</span>

                  <span className="text-lg opacity-40 transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </NavLink>
              )}

              {/* PROFILE */}
              {isAuthenticated && (
                <NavLink
                  to="/profile"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-2xl px-5 py-4 font-body text-base font-semibold transition-all ${
                      isActive
                        ? "bg-paper text-ink"
                        : "text-ink/60 hover:bg-paper hover:text-ink"
                    }`
                  }
                >
                  <span>profile</span>

                  <span className="text-lg opacity-40 transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </NavLink>
              )}

              {/* LOGIN */}
              {!isAuthenticated && (
                <NavLink
                  to="/login"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-2xl px-5 py-4 font-body text-base font-semibold transition-all ${
                      isActive
                        ? "bg-paper text-ink"
                        : "text-ink/60 hover:bg-paper hover:text-ink"
                    }`
                  }
                >
                  <span>Log in</span>

                  <span className="text-lg opacity-40 transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </NavLink>
              )}
            </div>

            {/* =================================================
                BOTTOM ACTION
            ================================================== */}
            <div className="mt-auto border-t border-ink/10 pt-6">
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full !rounded-2xl !py-3.5"
                >
                  Log out
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => {
                    closeMobileMenu();
                    navigate("/signup");
                  }}
                  className="w-full !rounded-2xl !py-3.5"
                >
                  Sign up
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
