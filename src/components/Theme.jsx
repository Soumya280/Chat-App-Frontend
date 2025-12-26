import { useEffect, useState } from "react";

const Theme = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = document.documentElement;

    if (theme) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  return (
    <button
      className="px-3 py-1 bg-amber-800 
      hover:bg-amber-600
      dark:bg-gray-500 text-gray-100 dark:text-amber-100 
      dark:hover:bg-gray-400
      rounded-full font-bold "
      onClick={() => setTheme(!theme)}
    >
      {theme ? "Light" : "Dark"}
    </button>
  );
};
export default Theme;
