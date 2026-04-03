import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import LinearProgress from '@mui/material/LinearProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import StarIcon from '@mui/icons-material/Star';
import MobileLayout from '../components/common/mobile-layout.jsx';
import PageHeader from '../components/common/page-header.jsx';
import { supabase } from '../utils/supabase.js';

/**
 * ReviewsPage 컴포넌트
 *
 * 숙소의 전체 리뷰를 보여주는 페이지
 * 별점 분포, 평균 별점, 정렬 옵션을 포함합니다.
 *
 * Example usage:
 * <Route path="/space/:id/reviews" element={<ReviewsPage />} />
 */
function ReviewsPage() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState('latest');

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('*, users(nickname, profile_image)')
      .eq('space_id', id);

    if (!error && data) {
      setReviews(data);
    }
    setIsLoading(false);
  };

  /** 별점 분포 계산 */
  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      const idx = Math.min(Math.max(Math.round(r.rating), 1), 5) - 1;
      dist[idx]++;
    });
    return dist;
  }, [reviews]);

  /** 평균 별점 */
  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  }, [reviews]);

  /** 정렬된 리뷰 */
  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    switch (sortOption) {
    case 'latest':
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
    case 'high':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'low':
      sorted.sort((a, b) => a.rating - b.rating);
      break;
    default:
      break;
    }
    return sorted;
  }, [reviews, sortOption]);

  const handleSortChange = (event, newSort) => {
    if (newSort !== null) {
      setSortOption(newSort);
    }
  };

  /** 날짜 포맷 */
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <MobileLayout hasBottomNav={false}>
        <PageHeader title="리뷰" />
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#013D49' }} />
        </Box>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout hasBottomNav={false}>
      <PageHeader title="리뷰" />

      {/* 평균 별점 & 분포 */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
          {/* 평균 점수 */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '2.4rem', fontWeight: 700, color: '#013D49', lineHeight: 1 }}>
              {avgRating}
            </Typography>
            <Rating value={Number(avgRating)} precision={0.1} readOnly size="small" sx={{ mt: 0.5 }} />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {reviews.length}개 리뷰
            </Typography>
          </Box>

          {/* 별점 분포 차트 */}
          <Box sx={{ flex: 1 }}>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDistribution[star - 1];
              const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 24 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, mr: 0.3 }}>
                      {star}
                    </Typography>
                    <StarIcon sx={{ fontSize: 14, color: '#faaf00' }} />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    sx={{
                      flex: 1,
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#eee',
                      '& .MuiLinearProgress-bar': { bgcolor: '#013D49', borderRadius: 4 },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 20, textAlign: 'right' }}>
                    {count}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* 정렬 옵션 */}
        <ToggleButtonGroup
          value={sortOption}
          exclusive
          onChange={handleSortChange}
          size="small"
          sx={{ mb: 1 }}
        >
          <ToggleButton
            value="latest"
            sx={{
              fontSize: '0.75rem',
              px: 1.5,
              '&.Mui-selected': { bgcolor: '#013D49', color: '#fff' },
              '&.Mui-selected:hover': { bgcolor: '#015566' },
            }}
          >
            최신순
          </ToggleButton>
          <ToggleButton
            value="high"
            sx={{
              fontSize: '0.75rem',
              px: 1.5,
              '&.Mui-selected': { bgcolor: '#013D49', color: '#fff' },
              '&.Mui-selected:hover': { bgcolor: '#015566' },
            }}
          >
            별점 높은순
          </ToggleButton>
          <ToggleButton
            value="low"
            sx={{
              fontSize: '0.75rem',
              px: 1.5,
              '&.Mui-selected': { bgcolor: '#013D49', color: '#fff' },
              '&.Mui-selected:hover': { bgcolor: '#015566' },
            }}
          >
            별점 낮은순
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Divider />

      {/* 리뷰 목록 */}
      <Box sx={{ p: 2 }}>
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review, index) => (
            <Box key={review.id}>
              <Box sx={{ py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Avatar
                    src={review.users?.profile_image}
                    sx={{ width: 36, height: 36, bgcolor: '#EDAAC6' }}
                  >
                    {review.users?.nickname?.[0]}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      {review.users?.nickname || '익명'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={review.rating} readOnly size="small" />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(review.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.6 }}>
                  {review.content}
                </Typography>
              </Box>
              {index < sortedReviews.length - 1 && <Divider />}
            </Box>
          ))
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">아직 리뷰가 없습니다.</Typography>
          </Box>
        )}
      </Box>
    </MobileLayout>
  );
}

export default ReviewsPage;
