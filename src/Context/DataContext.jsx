import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [institutions, setInstitutions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [institutionsRes, coursesRes, eventsRes, eventRegistrationsRes, usersRes] = await Promise.all([
          axios.get("/api/institutions"),
          axios.get("/api/courses"),
          axios.get("/api/events"),
          axios.get("/api/event_registrations"),
          axios.get("/api/users"),
        ]);

        setInstitutions(institutionsRes.data);
        setCourses(coursesRes.data.member);
        console.log("coursesRes.data.member", coursesRes.data.member);
        setEvents(eventsRes.data.member);
        setEventRegistrations(eventRegistrationsRes.data.member);
        setUsers(usersRes.data['hydra:member'] || usersRes.data.member || []);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction pour rafraîchir uniquement les cours
  const fetchCourses = async () => {
    try {
      const coursesRes = await axios.get("/api/courses");
      setCourses(coursesRes.data.member);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des cours :", error);
    }
  };

  return (
    <DataContext.Provider value={{ institutions, courses, loading, events, eventRegistrations, users, refreshCourses: fetchCourses }}>
      {children}
    </DataContext.Provider>
  );
};