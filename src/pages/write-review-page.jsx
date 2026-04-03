import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import MobileLayout from '../components/common/mobile-layout.jsx';
import PageHeader from '../components/common/page-header.jsx';
import { useAuth } from '../hooks/use-auth.jsx';
import { supabase } from '../utils/supabase.js';

/**
 * WriteReviewPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <WriteReviewPage />
 */
function WriteReviewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [reservation, setReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchReservation = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .select('*, spaces(id, title, space_images(image_url, display_order))')
        .eq('id', id)
        .single();

      if (!error && data) {
        setReservation(data);
      }
      setIsLoading(false);
    };

    fetchReservation();
  }, [id]);

  const getSpaceImage = (space) => {
    if (space?.space_images?.length > 0) {
      const sorted = [...space.space_images].sort((a, b) => a.display_order - b.display_order);
      return sorted[0].image_url;
    }
    return '';
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setSnackbarMessage('별점을 선택해주세요.');
      setIsSnackbarOpen(true);
      return;
    }
    if (!reviewText.trim()) {
      setSnackbarMessage('리뷰 내용을 작성해주세요.');
      setIsSnackbarOpen(true);
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase
      .from('reviews')
      .insert({
        reservation_id: Number(id),
        user_id: user.id,
        space_id: reservation.spaces?.id,
        rating,
        content: reviewText.trim(),
      });

    setIsSubmitting(false);

    if (error) {
      setSnackbarMessage('리뷰 등록 중 오류가 발생했습니다.');
      setIsSnackbarOpen(true);
      return;
    }

    navigate('/reservations', { replace: true });
  };

  if (isLoading) {
    return (
      <MobileLayout hasBottomNav={false}>
        <PageHeader title="리뷰 작성" />
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#013D49' }} />
        </Box>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout hasBottomNav={false}>
      <PageHeader title="리뷰 작성" />

      <Box sx={{ px: 2.5, py: 3 }}>
        {/* 숙소 정보 */}
        {reservation?.spaces && (
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              p: 2,
              borderRadius: 2,
              bgcolor: '#f9f9f9',
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 1.5,
                overflow: 'hidden',
                flexShrink: 0,
                bgcolor: '#eee',
              }}
            >
              {getSpaceImage(reservation.spaces) && (
                <Box
                  component="img"
                  src={getSpaceImage(reservation.spaces)}
                  alt={reservation.spaces.title}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </Box>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#013D49' }}>
                {reservation.spaces.title}
              </Typography>
            </Box>
          </Box>
        )}

        {/* 별점 */}
        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#013D49', mb: 1 }}>
          별점
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mb: 3 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <IconButton
              key={star}
              onClick={() => setRating(star)}
              sx={{ p: 0.5 }}
            >
              {star <= rating ? (
                <StarIcon sx={{ fontSize: 40, color: '#f9a825' }} />
              ) : (
                <StarBorderIcon sx={{ fontSize: 40, color: '#ccc' }} />
              )}
            </IconButton>
          ))}
        </Box>
        <Typography sx={{ textAlign: 'center', fontSize: '0.85rem', color: '#999', mb: 3 }}>
          {rating === 0 && '별점을 선택해주세요'}
          {rating === 1 && '별로예요'}
          {rating === 2 && '그저 그래요'}
          {rating === 3 && '보통이에요'}
          {rating === 4 && '좋아요'}
          {rating === 5 && '최고예요'}
        </Typography>

        {/* 리뷰 텍스트 */}
        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#013D49', mb: 1 }}>
          리뷰 내용
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={5}
          placeholder="숙소 이용 경험을 자세히 알려주세요"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: '#f9f9f9',
            },
          }}
        />

        {/* 사진 첨부 */}
        <Button
          variant="outlined"
          startIcon={<AddPhotoAlternateIcon />}
          sx={{
            py: 1,
            borderRadius: 2,
            borderColor: '#ccc',
            color: '#666',
            textTransform: 'none',
            mb: 4,
            '&:hover': { borderColor: '#999', bgcolor: '#fafafa' },
          }}
        >
          사진 첨부
        </Button>

        {/* 등록 버튼 */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{
            py: 1.3,
            borderRadius: 3,
            bgcolor: '#013D49',
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'none',
            '&:hover': { bgcolor: '#025a6b' },
            '&.Mui-disabled': { bgcolor: '#e0e0e0' },
          }}
        >
          {isSubmitting ? '등록 중...' : '리뷰 등록'}
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

export default WriteReviewPage;
