import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import MobileLayout from '../components/common/mobile-layout.jsx';
import PageHeader from '../components/common/page-header.jsx';
import { supabase } from '../utils/supabase.js';

/**
 * CancelReservationPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <CancelReservationPage />
 */
function CancelReservationPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const cancelReasons = [
    '일정 변경',
    '다른 숙소 예약',
    '개인 사정',
    '기타',
  ];

  const handleCancel = async () => {
    if (!reason) {
      setSnackbarMessage('취소 사유를 선택해주세요.');
      setIsSnackbarOpen(true);
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase
      .from('reservations')
      .update({ status: 'cancelled', message: reason })
      .eq('id', id);

    setIsSubmitting(false);

    if (error) {
      setSnackbarMessage('취소 처리 중 오류가 발생했습니다.');
      setIsSnackbarOpen(true);
      return;
    }

    navigate('/reservations', { replace: true });
  };

  return (
    <MobileLayout hasBottomNav={false}>
      <PageHeader title="예약 취소" />

      <Box sx={{ px: 2.5, py: 3 }}>
        {/* 경고 안내 */}
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            bgcolor: '#fff8e1',
            borderRadius: 2,
            p: 2,
            mb: 3,
          }}
        >
          <WarningAmberIcon sx={{ color: '#f9a825', flexShrink: 0, mt: 0.2 }} />
          <Box>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#333', mb: 0.5 }}>
              취소 전 확인해주세요
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#666', lineHeight: 1.6 }}>
              예약 취소 시 환불 정책에 따라 수수료가 발생할 수 있습니다.
              체크인 7일 전 취소 시 전액 환불, 3일 전 취소 시 50% 환불,
              당일 취소 시 환불이 불가합니다.
            </Typography>
          </Box>
        </Box>

        {/* 취소 사유 선택 */}
        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#013D49', mb: 1.5 }}>
          취소 사유를 선택해주세요
        </Typography>

        <RadioGroup
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          {cancelReasons.map((item) => (
            <FormControlLabel
              key={item}
              value={item}
              control={
                <Radio
                  sx={{
                    color: '#ccc',
                    '&.Mui-checked': { color: '#A25987' },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: '0.9rem', color: '#333' }}>
                  {item}
                </Typography>
              }
              sx={{
                border: '1px solid',
                borderColor: reason === item ? '#A25987' : '#eee',
                borderRadius: 2,
                mx: 0,
                mb: 1,
                px: 1,
                py: 0.5,
                bgcolor: reason === item ? '#fdf5f9' : '#fff',
              }}
            />
          ))}
        </RadioGroup>

        {/* 취소 버튼 */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleCancel}
          disabled={isSubmitting}
          sx={{
            py: 1.3,
            borderRadius: 3,
            bgcolor: '#d32f2f',
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'none',
            mt: 3,
            '&:hover': { bgcolor: '#b71c1c' },
            '&.Mui-disabled': { bgcolor: '#e0e0e0' },
          }}
        >
          {isSubmitting ? '처리 중...' : '예약 취소'}
        </Button>
      </Box>

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setIsSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setIsSnackbarOpen(false)}
          severity="warning"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MobileLayout>
  );
}

export default CancelReservationPage;
