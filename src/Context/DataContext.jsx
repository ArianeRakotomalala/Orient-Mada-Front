import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [institutions, setInstitutions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [institutionsRes, coursesRes] = await Promise.all([
          axios.get("/api/institutions"),
          axios.get("/api/courses"),
        ]);
        console.log("Institutions response:", institutionsRes.data);
        setInstitutions(institutionsRes.data);
        setCourses(coursesRes.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ institutions, courses, loading }}>
      {children}
    </DataContext.Provider>
  );
};