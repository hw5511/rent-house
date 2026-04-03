import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MessageIcon from '@mui/icons-material/Message';
import EventNoteIcon from '@mui/icons-material/EventNote';
import HomeIcon from '@mui/icons-material/Home';
import MobileLayout from '../components/common/mobile-layout.jsx';

/**
 * BookingCompletePage 컴포넌트
 *
 * 예약 완료 확인 페이지
 * 예약 정보를 표시하고 다음 액션 버튼을 제공합니다.
 * location.state에서 예약 정보를 받아옵니다.
 *
 * Example usage:
 * <Route path="/booking-complete/:reservationId" element={<BookingCompletePage />} />
 */
function BookingCompletePage() {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    spaceTitle = '숙소',
    checkIn = '-',
    checkOut = '-',
    guestCount = 1,
    totalPrice = 0,
  } = location.state || {};

  return (
    <MobileLayout hasBottomNav={false}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          py: 4,
        }}
      >
        {/* 체크마크 애니메이션 */}
        <Box
          sx={{
            '@keyframes scaleIn': {
              '0%': { transform: 'scale(0)', opacity: 0 },
              '50%': { transform: 'scale(1.2)' },
              '100%': { transform: 'scale(1)', opacity: 1 },
            },
            '@keyframes checkBounce': {
              '0%': { transform: 'scale(0) rotate(-45deg)', opacity: 0 },
              '60%': { transform: 'scale(1.1) rotate(0deg)' },
              '100%': { transform: 'scale(1) rotate(0deg)', opacity: 1 },
            },
            animation: 'scaleIn 0.6s ease-out',
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#EDAAC6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'checkBounce 0.8s ease-out 0.3s both',
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 48, color: '#A25987' }} />
          </Box>
        </Box>

        {/* 완료 메시지 */}
        <Typography
          sx={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#013D49',
            mb: 0.5,
            textAlign: 'center',
          }}
        >
          예약이 확정되었습니다!
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, textAlign: 'center' }}
        >
          즐거운 여행 되세요 🎉
        </Typography>

        {/* 예약 정보 카드 */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: '#fff',
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            p: 2.5,
            mb: 3,
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#013D49', mb: 1.5 }}>
            {spaceTitle}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              예약 번호
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              #{reservationId?.slice(0, 8) || '-'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              체크인
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {checkIn}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              체크아웃
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {checkOut}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              게스트 수
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {guestCount}명
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 700 }}>
              총 결제 금액
            </Typography>
            <Typography sx={{ fontWeight: 700, color: '#A25987' }}>
              ₩{totalPrice.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {/* 액션 버튼들 */}
        <Box sx={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<MessageIcon />}
            onClick={() => navigate('/chat')}
            sx={{
              bgcolor: '#A25987',
              color: '#fff',
              fontWeight: 600,
              py: 1.3,
              borderRadius: 2,
              '&:hover': { bgcolor: '#8a4a73' },
            }}
          >
            호스트에게 메시지 보내기
          </Button>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<EventNoteIcon />}
            onClick={() => navigate('/reservations')}
            sx={{
              borderColor: '#013D49',
              color: '#013D49',
              fontWeight: 600,
              py: 1.3,
              borderRadius: 2,
              '&:hover': { borderColor: '#015566', bgcolor: '#f0f7f8' },
            }}
          >
            내 예약 보기
          </Button>

          <Button
            variant="text"
            fullWidth
            startIcon={<HomeIcon />}
            onClick={() => navigate('/home')}
            sx={{
              color: '#666',
              fontWeight: 600,
              py: 1.3,
              '&:hover': { bgcolor: '#f5f5f5' },
            }}
          >
            홈으로
          </Button>
        </Box>
      </Box>
    </MobileLayout>
  );
}

export default BookingCompletePage;
