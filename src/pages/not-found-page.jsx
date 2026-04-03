import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import MobileLayout from '../components/common/mobile-layout.jsx';

/**
 * NotFoundPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <NotFoundPage />
 */
function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <MobileLayout hasBottomNav={false}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          px: 3,
          py: 4,
          textAlign: 'center',
        }}
      >
        <SentimentDissatisfiedIcon
          sx={{
            fontSize: 120,
            color: '#EDAAC6',
            mb: 3,
          }}
        />

        <Typography
          sx={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#013D49',
            mb: 1.5,
          }}
        >
          페이지를 찾을 수 없습니다
        </Typography>

        <Typography
          sx={{
            fontSize: '0.9rem',
            color: '#999',
            lineHeight: 1.6,
            mb: 4,
          }}
        >
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate('/home')}
          sx={{
            py: 1.5,
            px: 4,
            borderRadius: 3,
            bgcolor: '#013D49',
            fontSize: '0.95rem',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': { bgcolor: '#025a6b' },
          }}
        >
          홈으로 돌아가기
        </Button>
      </Box>
    </MobileLayout>
  );
}

export default NotFoundPage;
