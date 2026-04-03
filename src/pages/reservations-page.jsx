import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MobileLayout from '../components/common/mobile-layout.jsx';
import PageHeader from '../components/common/page-header.jsx';
import { useAuth } from '../hooks/use-auth.jsx';
import { supabase } from '../utils/supabase.js';

/**
 * ReservationsPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <ReservationsPage />
 */
function ReservationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .select('*, spaces(title, location, price_per_night, space_images(image_url, display_order))')
        .eq('user_id', user.id);

      if (!error && data) {
        setReservations(data);
      }
      setIsLoading(false);
    };

    fetchReservations();
  }, [user]);

  const getFilteredReservations = () => {
    const now = new Date();
    if (tabIndex === 0) {
      return reservations.filter(
        (r) => r.status !== 'cancelled' && new Date(r.check_out) >= now
      );
    }
    if (tabIndex === 1) {
      return reservations.filter(
        (r) => r.status !== 'cancelled' && new Date(r.check_out) < now
      );
    }
    return reservations.filter((r) => r.status === 'cancelled');
  };

  const getStatusBadge = (reservation) => {
    const now = new Date();
    if (reservation.status === 'cancelled') {
      return <Chip label="취소됨" size="small" sx={{ bgcolor: '#fdecea', color: '#d32f2f', fontWeight: 600, fontSize: '0.75rem' }} />;
    }
    if (new Date(reservation.check_out) < now) {
      return <Chip label="이용완료" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600, fontSize: '0.75rem' }} />;
    }
    return <Chip label="예약확정" size="small" sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 600, fontSize: '0.75rem' }} />;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const getSpaceImage = (space) => {
    if (space?.space_images?.length > 0) {
      const sorted = [...space.space_images].sort((a, b) => a.display_order - b.display_order);
      return sorted[0].image_url;
    }
    return '';
  };

  const filtered = getFilteredReservations();

  return (
    <MobileLayout hasBottomNav={true}>
      <PageHeader title="내 예약" hasBack={false} />

      <Tabs
        value={tabIndex}
        onChange={(e, v) => setTabIndex(v)}
        variant="fullWidth"
        sx={{
          borderBottom: '1px solid #eee',
          '& .MuiTab-root': {
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#999',
            textTransform: 'none',
          },
          '& .Mui-selected': {
            color: '#013D49',
          },
          '& .MuiTabs-indicator': {
            bgcolor: '#013D49',
          },
        }}
      >
        <Tab label="예정된 예약" />
        <Tab label="지난 예약" />
        <Tab label="취소된 예약" />
      </Tabs>

      <Box sx={{ px: 2, py: 2 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#013D49' }} />
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CalendarTodayIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
            <Typography sx={{ fontSize: '0.95rem', color: '#999' }}>
              예약 내역이 없습니다
            </Typography>
          </Box>
        ) : (
          filtered.map((reservation) => (
            <Box
              key={reservation.id}
              onClick={() => navigate(`/reservation/${reservation.id}`)}
              sx={{
                display: 'flex',
                gap: 1.5,
                p: 2,
                mb: 1.5,
                borderRadius: 3,
                bgcolor: '#fff',
                border: '1px solid #f0f0f0',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#fafafa' },
              }}
            >
              <Box
                sx={{
                  width: 90,
                  height: 90,
                  borderRadius: 2,
                  overflow: 'hidden',
                  flexShrink: 0,
                  bgcolor: '#eee',
                }}
              >
                {getSpaceImage(reservation.spaces) && (
                  <Box
                    component="img"
                    src={getSpaceImage(reservation.spaces)}
                    alt={reservation.spaces?.title}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                  <Typography
                    sx={{
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: '#013D49',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                      mr: 1,
                    }}
                  >
                    {reservation.spaces?.title}
                  </Typography>
                  {getStatusBadge(reservation)}
                </Box>
                <Typography sx={{ fontSize: '0.8rem', color: '#999', mb: 0.5 }}>
                  {formatDate(reservation.check_in)} - {formatDate(reservation.check_out)}
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#A25987' }}>
                  {Number(reservation.total_price).toLocaleString()}원
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </MobileLayout>
  );
}

export default ReservationsPage;
