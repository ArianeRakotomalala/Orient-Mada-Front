import React, { useContext, useMemo, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import { UserContext } from '../context/UserContext';
import { Box, Typography, Card, CardContent, Stack } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import EventIcon from '@mui/icons-material/Event';
import logouniv from '../assets/log.png';

dayjs.extend(relativeTime);
dayjs.locale('fr');

export default function Notifications() {
  const { institutions, events, eventRegistrations } = useContext(DataContext);
  const { favorisUtilisateur, user } = useContext(UserContext);

  const [readNotifIds, setReadNotifIds] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem('readNotifIds') || '[]');
    } catch {
      return [];
    }
  });

  const [showAll, setShowAll] = React.useState(false);

  // Génération des notifications (même logique que Slidebar)
  const notifications = useMemo(() => {
    const notifs = [];
    if (!user) return notifs;
    const now = dayjs();
    const troisJours = now.subtract(3, 'day');
    if (favorisUtilisateur && Array.isArray(favorisUtilisateur) && events && Array.isArray(events)) {
      favorisUtilisateur.forEach(fav => {
        const institutionId = fav.institution ? String(fav.institution).split('/').pop() : null;
        if (!institutionId) return;
        const nouveauxEvents = events.filter(ev => {
          const evInstitutionId = ev.institution ? String(ev.institution).split('/').pop() : null;
          const createdAt = ev.created_at ? dayjs(ev.created_at) : null;
          return evInstitutionId === institutionId && createdAt && createdAt.isAfter(troisJours);
        });
        nouveauxEvents.forEach(ev => {
          // Chercher le nom de l'université
          const institution = institutions && Array.isArray(institutions)
            ? institutions.find(inst => String(inst.id) === String(institutionId))
            : null;
          const institutionName = institution ? institution.institution_name : 'Votre université favorite';
          notifs.push({
            id: `new-event-${ev.id}`,
            message: `Votre université favorite  ${institutionName} organise un nouvel événement : "${ev.title || 'Sans nom'}".`,
            link: `/home/university/${institutionId}#events`,
            date: ev.created_at ? dayjs(ev.created_at) : null,
            rawDate: ev.created_at || null
          });
        });
      });
    }
    if (eventRegistrations && Array.isArray(eventRegistrations) && events && Array.isArray(events)) {
      const userEventIds = eventRegistrations
        .filter(reg => {
          const userId = reg.user?.id || String(reg.user).split('/').pop();
          return String(userId) === String(user.id);
        })
        .map(reg => reg.events ? String(reg.events).split('/').pop() : null)
        .filter(Boolean);
      events.forEach(ev => {
        if (userEventIds.includes(String(ev.id)) && ev.event_date_time) {
          const eventDate = dayjs(ev.event_date_time);
          if (eventDate.diff(now, 'day') === 2) {
            notifs.push({
              id: `event-soon-${ev.id}`,
              message: `L'événement "${ev.title || 'Sans nom'}" auquel vous êtes inscrit a lieu dans 2 jours.`,
              date: ev.event_date_time ? dayjs(ev.event_date_time) : null,
              rawDate: ev.event_date_time || null
            });
          }
        }
      });
    }
    return notifs;
  }, [favorisUtilisateur, institutions, events, eventRegistrations, user]);

  const unreadNotifications = notifications.filter(n => !readNotifIds.includes(n.id));

  const handleNotifClick = (notif) => {
    // Marquer comme lue
    const allIds = [notif.id];
    const merged = Array.from(new Set([...readNotifIds, ...allIds]));
    localStorage.setItem('readNotifIds', JSON.stringify(merged));
    setReadNotifIds(merged);
  };

  useEffect(() => {
    // Marquer toutes les notifications courantes comme lues
    const allIds = notifications.map(n => n.id);
    const prev = (() => { try { return JSON.parse(localStorage.getItem('readNotifIds') || '[]'); } catch { return []; } })();
    const merged = Array.from(new Set([...prev, ...allIds]));
    localStorage.setItem('readNotifIds', JSON.stringify(merged));
  }, [notifications]);

  // Trier les notifications par date décroissante (plus récentes en haut)
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return b.date.valueOf() - a.date.valueOf();
  });
  const notificationsToShow = showAll ? sortedNotifications : sortedNotifications.slice(0, 5);

  return (
    <Box sx={{ maxWidth: 1090, mx: 'auto', mt: 6, p: 2 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <NotificationsIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
        <Typography variant="h5" fontWeight={700}>Notifications</Typography>
      </Box>
      {notificationsToShow.length === 0 ? (
        <Typography color="text.secondary">Aucune notification pour le moment.</Typography>
      ) : (
        <>
        <Stack spacing={2}>
          {notificationsToShow.map(notif => {
            const isUnread = unreadNotifications.some(u => u.id === notif.id);
            // Chercher l'institution liée à la notif (si possible)
            let institutionLogo = logouniv;
            if (notif.link) {
              // Extraire l'id de l'université depuis le lien
              const match = notif.link.match(/\/home\/university\/(\d+)/);
              if (match && institutions && Array.isArray(institutions)) {
                const inst = institutions.find(inst => String(inst.id) === match[1]);
                if (inst && inst.logo) institutionLogo = inst.logo;
              }
            }
            return (
              <Card
                key={notif.id}
                variant="outlined"
                sx={{
                  background: isUnread ? 'rgb(244, 232, 232)' : 'transparent',
                  color:  'inherit',
                  boxShadow: isUnread ? '0 2px 8px #e3f2fd55' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  '&:hover': {
                    background: isUnread ? 'rgb(206, 223, 255)' : '#f5faff',
                    color: isUnread ? '#' : 'inherit',
                  },
                }}
                onClick={() => {
                  handleNotifClick(notif);
                  if (notif.link) window.location.href = notif.link;
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2, position: 'relative', minWidth: 60 }}>
                    <Avatar src={institutionLogo} alt="logo université" sx={{ width:60 , height: 60, mb: 0.5 }} />
                    <EventIcon sx={{
                      fontSize: 22,
                      position: 'absolute',
                      bottom: 2,
                      right: 6,
                      color: 'grey',
                      background: '#fff',
                      borderRadius: '50%',
                      boxShadow: 1,
                      p: '2px',
                    }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: isUnread ? 'bold' : 'normal', textAlign: 'justify', fontSize: 14, mb: 0.5, lineHeight: 1.3 }}>
                      {notif.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="#444"
                      sx={{ display: 'block', mt: 0.5, fontSize: 12, fontStyle: 'italic' }}
                      title={notif.date ? notif.date.format('YYYY-MM-DD HH:mm:ss') : ''}
                    >
                      {notif.date
                        ? (dayjs().diff(notif.date, 'minute') < 1
                            ? "à l'instant"
                            : dayjs(notif.date).fromNow())
                        : 'À l\'instant'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
        {notifications.length > 5 && (
          <Box mt={3} display="flex" justifyContent="center">
            <button
              style={{
                width: '100%',
                maxWidth: 800,
                background: 'inherit',
                color: '#fff',
                border: '2px solid #111',
                borderRadius: 12,
                padding: '12px 0',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: 17,
                marginTop: 8
              }}
              onClick={() => setShowAll(v => !v)}
            >
              {showAll ? 'Voir moins' : 'Voir plus'}
            </button>
          </Box>
        )}
        </>
      )}
    </Box>
  );
} 