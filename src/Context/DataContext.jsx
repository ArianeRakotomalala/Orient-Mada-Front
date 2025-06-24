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
  const [domaines, setDomaines] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Début du chargement des données...");
        
        const [institutionsRes, coursesRes, eventsRes, eventRegistrationsRes, usersRes, domainesRes] = await Promise.all([
          axios.get("/api/institutions"),
          axios.get("/api/courses"),
          axios.get("/api/events"),
          axios.get("/api/event_registrations"),
          axios.get("/api/users"),
          axios.get("/api/domaines"),
        ]);

        console.log("Toutes les requêtes réussies");
        console.log("Domaines reçus:", domainesRes.data);

        setInstitutions(institutionsRes.data['hydra:member'] || institutionsRes.data.member || institutionsRes.data || []);
        setCourses(coursesRes.data.member);
        console.log("coursesRes.data.member", coursesRes.data.member);
        // Correction robuste pour supporter plusieurs formats de réponse
        let eventsArray = [];
        if (Array.isArray(eventsRes.data)) {
          eventsArray = eventsRes.data;
        } else if (Array.isArray(eventsRes.data['hydra:member'])) {
          eventsArray = eventsRes.data['hydra:member'];
        } else if (Array.isArray(eventsRes.data.member)) {
          eventsArray = eventsRes.data.member;
        } else {
          console.error("Format inattendu pour la réponse des événements :", eventsRes.data);
        }
        setEvents(eventsArray);
        console.log("Événements chargés initialement:", eventsArray);
        setEventRegistrations(eventRegistrationsRes.data.member);
        setUsers(usersRes.data['hydra:member'] || usersRes.data.member || []);
        setDomaines(domainesRes.data.member || domainesRes.data['hydra:member'] || []);
        console.log("Domainesssssssssss reçus:", domainesRes.data.member);
        
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        console.error("Détails de l'erreur:", error.response?.data);
        console.error("Status de l'erreur:", error.response?.status);
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

  // Fonction pour rafraîchir uniquement les événements
  const fetchEvents = async () => {
    try {
      console.log("Rafraîchissement des événements...");
      const eventsRes = await axios.get("/api/events");
      // Correction robuste pour supporter plusieurs formats de réponse
      let eventsArray = [];
      if (Array.isArray(eventsRes.data)) {
        eventsArray = eventsRes.data;
      } else if (Array.isArray(eventsRes.data['hydra:member'])) {
        eventsArray = eventsRes.data['hydra:member'];
      } else if (Array.isArray(eventsRes.data.member)) {
        eventsArray = eventsRes.data.member;
      } else {
        console.error("Format inattendu pour la réponse des événements (refresh) :", eventsRes.data);
      }
      setEvents(eventsArray);
      console.log("Événements mis à jour dans le state", eventsArray);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des événements :", error);
      console.error("Détails de l'erreur:", error.response?.data);
    }
  };

  return (
    <DataContext.Provider value={{ institutions, courses, loading, events, eventRegistrations, users, domaines, refreshCourses: fetchCourses, refreshEvents: fetchEvents }}>
      {children}
    </DataContext.Provider>
  );
};