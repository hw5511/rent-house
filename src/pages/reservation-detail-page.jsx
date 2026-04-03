import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MobileLayout from '../components/common/mobile-layout.jsx';
import PageHeader from '../components/common/page-header.jsx';
import { supabase } from '../utils/supabase.js';

/**
 * ReservationDetailPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <ReservationDetailPage />
 */
function ReservationDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [host, setHost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReservation = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .select('*, spaces(title, location, price_per_night, host_id, space_images(image_url, display_order))')
        .eq('id', id)
        .single();

      if (!error && data) {
        setReservation(data);

        if (data.spaces?.host_id) {
          const { data: hostData } = await supabase
            .from('users')
            .select('id, nickname, profile_image')
            .eq('id', data.spaces.host_id)
            .single();

          if (hostData) {
            setHost(hostData);
          }
        }
      }
      setIsLoading(false);
    };

    fetchReservation();
  }, [id]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const getSpaceImage = (space) => {
    if (space?.space_images?.length > 0) {
      const sorted = [...space.space_images].sort((a, b) => a.display_order - b.display_order);
      return sorted[0].image_url;
    }
    return '';
  };

  const getStatus = () => {
    if (!reservation) return 'upcoming';
    if (reservation.status === 'cancelled') return 'cancelled';
    const now = new Date();
    if (new Date(reservation.check_out) < now) return 'completed';
    return 'upcoming';
  };

  const getStatusBadge = () => {
    const status = getStatus();
    if (status === 'cancelled') {
      return <Chip label="취소됨" size="small" sx={{ bgcolor: '#fdecea', color: '#d32f2f', fontWeight: 600 }} />;
    }
    if (status === 'completed') {
      return <Chip label="이용완료" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }} />;
    }
    return <Chip label="예약확정" size="small" sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 600 }} />;
  };

  if (isLoading) {
    return (
      <MobileLayout hasBottomNav={false}>
        <PageHeader title="예약 상세" />
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#013D49' }} />
        </Box>
      </MobileLayout>
    );
  }

  if (!reservation) {
    return (
      <MobileLayout hasBottomNav={false}>
        <PageHeader title="예약 상세" />
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{ color: '#999' }}>예약 정보를 찾을 수 없습니다</Typography>
        </Box>
      </MobileLayout>
    );
  }

  const status = getStatus();

  return (
    <MobileLayout hasBottomNav={false}>
      <PageHeader title="예약 상세" />

      {/* 숙소 이미지 */}
      <Box sx={{ width: '100%', height: 220, bgcolor: '#eee', overflow: 'hidden' }}>
        {getSpaceImage(reservation.spaces) && (
          <Box
            component="img"
            src={getSpaceImage(reservation.spaces)}
            alt={reservation.spaces?.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </Box>

      <Box sx={{ px: 2.5, py: 2 }}>
        {/* 숙소 정보 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: '#013D49', flex: 1, mr: 1 }}>
            {reservation.spaces?.title}
          </Typography>
          {getStatusBadge()}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
          <LocationOnIcon sx={{ fontSize: 16, color: '#999' }} />
          <Typography sx={{ fontSize: '0.85rem', color: '#999' }}>
            {reservation.spaces?.location}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* 예약 정보 */}
        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#013D49', mb: 1.5 }}>
          예약 정보
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <CalendarTodayIcon sx={{ fontSize: 18, color: '#A25987' }} />
          <Typography sx={{ fontSize: '0.9rem', color: '#333' }}>
            체크인: {formatDate(reservation.check_in)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <CalendarTodayIcon sx={{ fontSize: 18, color: '#A25987' }} />
          <Typography sx={{ fontSize: '0.9rem', color: '#333' }}>
            체크아웃: {formatDate(reservation.check_out)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <PersonIcon sx={{ fontSize: 18, color: '#A25987' }} />
          <Typography sx={{ fontSize: '0.9rem', color: '#333' }}>
            게스트 {reservation.guest_count || 1}명
          </Typography>
        </Box>

        {/* 총 금액 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: '#f9f5f7',
            borderRadius: 2,
            p: 2,
            mb: 2,
          }}
        >
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#333' }}>
            총 결제 금액
          </Typography>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#A25987' }}>
            {Number(reservation.total_price).toLocaleString()}원
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* 호스트 정보 */}
        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#013D49', mb: 1.5 }}>
          호스트 정보
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Avatar
            src={host?.profile_image || ''}
            sx={{ width: 48, height: 48, bgcolor: '#EDAAC6' }}
          >
            {host?.nickname?.[0] || 'H'}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#333' }}>
              {host?.nickname || '호스트'}
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#999' }}>
              호스트
            </Typography>
          </Box>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<ChatBubbleOutlineIcon />}
          onClick={() => navigate('/chat')}
          sx={{
            py: 1.2,
            borderRadius: 3,
            borderColor: '#013D49',
            color: '#013D49',
            fontWeight: 600,
            textTransform: 'none',
            mb: 2,
            '&:hover': { borderColor: '#013D49', bgcolor: '#f0f8f9' },
          }}
        >
          호스트에게 메시지
        </Button>

        <Divider sx={{ mb: 2 }} />

        {/* 상태별 액션 */}
        {status === 'upcoming' && (
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate(`/reservation/${id}/cancel`)}
            sx={{
              py: 1.3,
              borderRadius: 3,
              bgcolor: '#d32f2f',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { bgcolor: '#b71c1c' },
            }}
          >
            예약 취소
          </Button>
        )}

        {status === 'completed' && (
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate(`/reservation/${id}/review`)}
            sx={{
              py: 1.3,
              borderRadius: 3,
              bgcolor: '#A25987',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { bgcolor: '#8a4a73' },
            }}
          >
            리뷰 작성
          </Button>
        )}

        {status === 'cancelled' && (
          <Box
            sx={{
              bgcolor: '#fdecea',
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#d32f2f', mb: 0.5 }}>
              취소된 예약입니다
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#999' }}>
              취소 사유: {reservation.cancel_reason || '사유 없음'}
            </Typography>
          </Box>
        )}
      </Box>
    </MobileLayout>
  );
}

export default ReservationDetailPage;
