import { useState, useEffect } from "react";
import Switch from "react-switch";

export const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [isDark]);

  return (
    <Switch
      onChange={setIsDark}
      checked={isDark}
      height={24}
      width={50}
      onColor="#4b5563"
      offColor="#ffd700"
      checkedIcon={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          🌙
        </div>
      }
      uncheckedIcon={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          🔆
        </div>
      }
      aria-label="Dark mode toggle"
    />
  );
};
