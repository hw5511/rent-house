import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import MobileStepper from '@mui/material/MobileStepper';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import KitchenIcon from '@mui/icons-material/Kitchen';
import TvIcon from '@mui/icons-material/Tv';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import MobileLayout from '../components/common/mobile-layout.jsx';
import PageHeader from '../components/common/page-header.jsx';
import { supabase } from '../utils/supabase.js';

/** 어메니티 아이콘 매핑 */
const AMENITY_MAP = [
  { key: 'wifi', label: 'WiFi', icon: WifiIcon },
  { key: 'parking', label: '주차', icon: LocalParkingIcon },
  { key: 'aircon', label: '에어컨', icon: AcUnitIcon },
  { key: 'washer', label: '세탁기', icon: LocalLaundryServiceIcon },
  { key: 'kitchen', label: '주방', icon: KitchenIcon },
  { key: 'tv', label: 'TV', icon: TvIcon },
];

/**
 * SpaceDetailPage 컴포넌트
 *
 * 숙소 상세 정보를 표시하는 페이지
 * URL 파라미터에서 space ID를 가져와 데이터를 조회합니다.
 *
 * Example usage:
 * <Route path="/space/:id" element={<SpaceDetailPage />} />
 */
function SpaceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [space, setSpace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchSpace();
  }, [id]);

  const fetchSpace = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('spaces')
      .select('*, space_images(image_url, display_order), reviews(*, users(nickname, profile_image))')
      .eq('id', id)
      .single();

    if (!error && data) {
      if (data.space_images) {
        data.space_images.sort((a, b) => a.display_order - b.display_order);
      }
      setSpace(data);
    }
    setIsLoading(false);
  };

  const handleNext = useCallback(() => {
    setActiveStep((prev) => prev + 1);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep((prev) => prev - 1);
  }, []);

  const handleFavoriteToggle = useCallback(() => {
    setIsFavorite((prev) => !prev);
  }, []);

  const images = space?.space_images || [];
  const reviews = space?.reviews || [];
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const previewReviews = reviews.slice(0, 3);

  if (isLoading) {
    return (
      <MobileLayout hasBottomNav={false}>
        <PageHeader
          title="숙소 상세"
          rightAction={
            <IconButton disabled>
              <FavoriteBorderIcon />
            </IconButton>
          }
        />
        <Skeleton variant="rectangular" height={280} />
        <Box sx={{ p: 2 }}>
          <Skeleton variant="text" width="70%" height={32} />
          <Skeleton variant="text" width="50%" height={24} />
          <Skeleton variant="text" width="40%" height={24} />
        </Box>
      </MobileLayout>
    );
  }

  if (!space) {
    return (
      <MobileLayout hasBottomNav={false}>
        <PageHeader title="숙소 상세" />
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography>숙소 정보를 찾을 수 없습니다.</Typography>
        </Box>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout hasBottomNav={false}>
      <PageHeader
        title="숙소 상세"
        rightAction={
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton onClick={handleFavoriteToggle}>
              {isFavorite
                ? <FavoriteIcon sx={{ color: '#A25987' }} />
                : <FavoriteBorderIcon sx={{ color: '#013D49' }} />
              }
            </IconButton>
            <IconButton>
              <ShareIcon sx={{ color: '#013D49' }} />
            </IconButton>
          </Box>
        }
      />

      {/* 사진 갤러리 */}
      <Box sx={{ position: 'relative' }}>
        {images.length > 0 ? (
          <>
            <Box
              component="img"
              src={images[activeStep]?.image_url}
              alt={`${space.title} 사진 ${activeStep + 1}`}
              sx={{
                width: '100%',
                height: 280,
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <MobileStepper
              steps={images.length}
              position="static"
              activeStep={activeStep}
              sx={{
                bgcolor: 'transparent',
                position: 'absolute',
                bottom: 0,
                width: '100%',
                justifyContent: 'center',
                '& .MuiMobileStepper-dot': { bgcolor: 'rgba(255,255,255,0.5)' },
                '& .MuiMobileStepper-dotActive': { bgcolor: '#fff' },
              }}
              nextButton={
                <IconButton
                  size="small"
                  onClick={handleNext}
                  disabled={activeStep === images.length - 1}
                  sx={{ color: '#fff', position: 'absolute', right: 8 }}
                >
                  <ChevronRightIcon />
                </IconButton>
              }
              backButton={
                <IconButton
                  size="small"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  sx={{ color: '#fff', position: 'absolute', left: 8 }}
                >
                  <ChevronLeftIcon />
                </IconButton>
              }
            />
          </>
        ) : (
          <Box
            sx={{
              width: '100%',
              height: 280,
              bgcolor: '#eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography color="text.secondary">사진 없음</Typography>
          </Box>
        )}

        {/* 사진 전체보기 버튼 */}
        {images.length > 0 && (
          <Chip
            icon={<PhotoLibraryIcon sx={{ fontSize: 16 }} />}
            label="사진 전체보기"
            size="small"
            onClick={() => navigate(`/space/${id}/photos`)}
            sx={{
              position: 'absolute',
              bottom: 40,
              right: 12,
              bgcolor: 'rgba(0,0,0,0.6)',
              color: '#fff',
              '& .MuiChip-icon': { color: '#fff' },
              '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
            }}
          />
        )}
      </Box>

      {/* 숙소 기본 정보 */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h2" sx={{ fontSize: '1.4rem', fontWeight: 700, mb: 0.5 }}>
          {space.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <LocationOnIcon sx={{ fontSize: 18, color: '#A25987' }} />
          <Typography variant="body2" color="text.secondary">
            {space.location || '위치 정보 없음'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating value={Number(avgRating)} precision={0.1} readOnly size="small" />
          <Typography variant="body2" color="text.secondary">
            {avgRating} ({reviews.length}개 리뷰)
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* 호스트 정보 */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          src={space.host_profile_image}
          sx={{ width: 48, height: 48, bgcolor: '#EDAAC6' }}
        >
          {space.host_name?.[0]}
        </Avatar>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
            호스트: {space.host_name || '호스트'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            슈퍼호스트
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* 설명 */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h3" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 1 }}>
          숙소 소개
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.6, color: '#333' }}>
          {space.description || '숙소 설명이 없습니다.'}
        </Typography>
      </Box>

      <Divider />

      {/* 편의시설 */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h3" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 1.5 }}>
          편의시설
        </Typography>
        <Grid container spacing={1.5}>
          {AMENITY_MAP.map(({ key, label, icon: Icon }) => {
            const hasAmenity = space.amenities?.includes(key);
            return (
              <Grid key={key} size={{ xs: 4 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 1.5,
                    borderRadius: 2,
                    bgcolor: hasAmenity ? '#f0f7f8' : '#f5f5f5',
                    opacity: hasAmenity ? 1 : 0.4,
                  }}
                >
                  <Icon sx={{ fontSize: 28, color: hasAmenity ? '#013D49' : '#999', mb: 0.5 }} />
                  <Typography variant="caption" sx={{ color: hasAmenity ? '#013D49' : '#999' }}>
                    {label}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Divider />

      {/* 이용 규칙 */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h3" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 1 }}>
          이용 규칙
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.6, color: '#333', whiteSpace: 'pre-line' }}>
          {space.rules || '별도의 이용 규칙이 없습니다.'}
        </Typography>
      </Box>

      <Divider />

      {/* 리뷰 미리보기 */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="h3" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
            리뷰 ({reviews.length})
          </Typography>
          {reviews.length > 0 && (
            <Button
              size="small"
              onClick={() => navigate(`/space/${id}/reviews`)}
              sx={{ color: '#A25987', fontWeight: 600 }}
            >
              전체보기
            </Button>
          )}
        </Box>

        {previewReviews.length > 0 ? (
          previewReviews.map((review) => (
            <Box key={review.id} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Avatar
                  src={review.users?.profile_image}
                  sx={{ width: 32, height: 32, bgcolor: '#EDAAC6' }}
                >
                  {review.users?.nickname?.[0]}
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {review.users?.nickname || '익명'}
                  </Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.5 }}>
                {review.content}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            아직 리뷰가 없습니다.
          </Typography>
        )}
      </Box>

      {/* 하단 고정 예약 바 */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 430,
          bgcolor: '#fff',
          borderTop: '1px solid #eee',
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 1000,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#013D49' }}>
            ₩{space.price_per_night?.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            / 1박
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate(`/space/${id}/booking`)}
          sx={{
            bgcolor: '#A25987',
            color: '#fff',
            fontWeight: 600,
            px: 4,
            py: 1.2,
            borderRadius: 2,
            '&:hover': { bgcolor: '#8a4a73' },
          }}
        >
          예약하기
        </Button>
      </Box>

      {/* 하단 바 높이만큼 여백 */}
      <Box sx={{ height: 80 }} />
    </MobileLayout>
  );
}

export default SpaceDetailPage;
