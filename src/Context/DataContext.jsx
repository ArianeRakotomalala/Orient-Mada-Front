import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [institutions, setInstitutions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [institutionsRes, coursesRes, eventsRes, eventRegistrationsRes] = await Promise.all([
          axios.get("/api/institutions"),
          axios.get("/api/courses"),
          axios.get("/api/events"),
          axios.get("/api/event_registrations"),
        ]);

        setInstitutions(institutionsRes.data);
        setCourses(coursesRes.data.member);
        setEvents(eventsRes.data.member);
        setEventRegistrations(eventRegistrationsRes.data.member);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ institutions, courses, loading, events, eventRegistrations }}>
      {children}
    </DataContext.Provider>
  );
};