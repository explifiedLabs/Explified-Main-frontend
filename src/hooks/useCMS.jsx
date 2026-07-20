import React, { createContext, useContext, useState, useEffect } from "react";

const CMSContext = createContext();
const SITE_ID = "69c67e3f225219428111ab74";

export const CMSProvider = ({ children }) => {
  const [data, setData] = useState({ header: {}, footer: {} });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(
          "https://cmsapi-pf6diz22ka-uc.a.run.app/api/menus",
          {
            headers: { "x-site-id": SITE_ID },
          },
        );
        const json = await response.json();

        if (json?.success && json?.data) {
          setData(json.data);
        }
      } catch (error) {
        console.error("CMS API Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  return (
    <CMSContext.Provider value={{ data, isLoading }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => useContext(CMSContext);
