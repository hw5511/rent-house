import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import MobileLayout from '../components/common/mobile-layout.jsx';
import SpaceCard from '../components/ui/space-card.jsx';
import { useAuth } from '../hooks/use-auth.jsx';
import { supabase } from '../utils/supabase.js';

/** 카테고리 목록 */
const CATEGORIES = [
  { label: '전체', value: '전체' },
  { label: '원룸', value: '원룸' },
  { label: '아파트', value: '아파트' },
  { label: '빌라', value: '빌라' },
  { label: '한옥', value: '한옥' },
  { label: '펜션', value: '펜션' },
];

/**
 * HomePage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <HomePage />
 */
function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [isLoading, setIsLoading] = useState(true);

  /** 공간 목록 조회 */
  const fetchSpaces = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('spaces')
        .select('*, space_images(image_url, display_order)');

      if (selectedCategory !== '전체') {
        query = query.eq('space_type', selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error('공간 조회 오류:', error);
        return;
      }

      /** 첫 번째 이미지를 대표 이미지로 매핑 */
      const mapped = (data || []).map((item) => {
        const images = item.space_images || [];
        const sorted = [...images].sort(
          (a, b) => (a.display_order || 0) - (b.display_order || 0)
        );
        return {
          ...item,
          image: sorted.length > 0 ? sorted[0].image_url : '',
        };
      });

      setSpaces(mapped);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  /** 찜 목록 조회 */
  const fetchFavorites = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('favorites')
      .select('space_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('찜 목록 조회 오류:', error);
      return;
    }

    setFavoriteIds((data || []).map((item) => item.space_id));
  }, [user]);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  /** 찜 토글 */
  const handleToggleFavorite = async (spaceId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const isFav = favoriteIds.includes(spaceId);

    if (isFav) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('space_id', spaceId);

      if (!error) {
        setFavoriteIds((prev) => prev.filter((id) => id !== spaceId));
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, space_id: spaceId });

      if (!error) {
        setFavoriteIds((prev) => [...prev, spaceId]);
      }
    }
  };

  return (
    <MobileLayout hasBottomNav={true}>
      {/* 상단 바 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          position: 'sticky',
          top: 0,
          bgcolor: '#FDFFFB',
          zIndex: 10,
          borderBottom: '1px solid #eee',
        }}
      >
        <Typography
          variant="h2"
          sx={{ fontSize: '1.3rem', fontWeight: 700, color: '#013D49' }}
        >
          공간대여
        </Typography>
        <IconButton
          onClick={() => navigate('/notifications')}
          sx={{ color: '#013D49' }}
        >
          <NotificationsNoneIcon />
        </IconButton>
      </Box>

      {/* 검색 바 */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <Box
          onClick={() => navigate('/search')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: '#f5f5f5',
            borderRadius: 3,
            px: 2,
            py: 1.5,
            cursor: 'pointer',
            '&:active': { bgcolor: '#eee' },
          }}
        >
          <SearchIcon sx={{ color: '#999' }} />
          <Typography sx={{ fontSize: '0.95rem', color: '#999' }}>
            어떤 공간을 찾고 계신가요?
          </Typography>
        </Box>
      </Box>

      {/* 카테고리 필터 */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          px: 2,
          pb: 1.5,
          overflowX: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat.value}
            label={cat.label}
            onClick={() => setSelectedCategory(cat.value)}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '0.85rem',
              bgcolor: selectedCategory === cat.value ? '#013D49' : '#f5f5f5',
              color: selectedCategory === cat.value ? '#fff' : '#666',
              '&:hover': {
                bgcolor: selectedCategory === cat.value ? '#025a6b' : '#eee',
              },
              flexShrink: 0,
            }}
          />
        ))}
      </Box>

      {/* 공간 목록 */}
      <Box sx={{ px: 2, pb: 2 }}>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Skeleton
                variant="rounded"
                height={220}
                sx={{ borderRadius: 3, mb: 1 }}
              />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="80%" />
            </Box>
          ))
        ) : spaces.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ fontSize: '1rem', color: '#999' }}>
              등록된 공간이 없습니다.
            </Typography>
          </Box>
        ) : (
          spaces.map((space) => (
            <SpaceCard
              key={space.id}
              space={space}
              isFavorite={favoriteIds.includes(space.id)}
              onToggleFavorite={handleToggleFavorite}
              onClick={() => navigate(`/space/${space.id}`)}
            />
          ))
        )}
      </Box>
    </MobileLayout>
  );
}

export default HomePage;
