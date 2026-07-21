import { useEffect } from "react";

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} — Velour` : "Velour — Fashion Store";
  }, [title]);
};

export default usePageTitle;