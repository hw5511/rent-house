import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TuneIcon from '@mui/icons-material/Tune';
import SortIcon from '@mui/icons-material/Sort';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import MobileLayout from '../components/common/mobile-layout.jsx';
import SpaceCard from '../components/ui/space-card.jsx';
import { useAuth } from '../hooks/use-auth.jsx';
import { supabase } from '../utils/supabase.js';

/** 정렬 옵션 */
const SORT_OPTIONS = [
  { label: '추천순', value: 'recommended' },
  { label: '가격순', value: 'price' },
  { label: '별점순', value: 'rating' },
];

/** 공간 타입 옵션 */
const SPACE_TYPE_OPTIONS = ['전체', '원룸', '아파트', '빌라', '한옥', '펜션'];

/**
 * SearchResultsPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <SearchResultsPage />
 */
function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const query = searchParams.get('q') || '';

  const [spaces, setSpaces] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');

  /** 필터 상태 */
  const [filters, setFilters] = useState({
    priceRange: [0, 500000],
    guestCount: 1,
    spaceType: '전체',
  });

  /** 임시 필터 (드로어 안에서만 사용) */
  const [tempFilters, setTempFilters] = useState(filters);

  /** 공간 목록 조회 */
  const fetchSpaces = useCallback(async () => {
    setIsLoading(true);
    try {
      let dbQuery = supabase
        .from('spaces')
        .select('*, space_images(image_url, display_order)');

      /** 검색어 필터 */
      if (query) {
        dbQuery = dbQuery.or(
          `title.ilike.%${query}%,location.ilike.%${query}%,description.ilike.%${query}%`
        );
      }

      /** 공간 타입 필터 */
      if (filters.spaceType !== '전체') {
        dbQuery = dbQuery.eq('space_type', filters.spaceType);
      }

      /** 가격 범위 필터 */
      dbQuery = dbQuery
        .gte('price_per_night', filters.priceRange[0])
        .lte('price_per_night', filters.priceRange[1]);

      /** 인원수 필터 */
      if (filters.guestCount > 1) {
        dbQuery = dbQuery.gte('max_guests', filters.guestCount);
      }

      /** 정렬 */
      if (sortBy === 'price') {
        dbQuery = dbQuery.order('price_per_night', { ascending: true });
      } else if (sortBy === 'rating') {
        dbQuery = dbQuery.order('rating_avg', { ascending: false });
      } else {
        dbQuery = dbQuery.order('created_at', { ascending: false });
      }

      const { data, error } = await dbQuery;

      if (error) {
        console.error('검색 오류:', error);
        return;
      }

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
  }, [query, filters, sortBy]);

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

  /** 필터 드로어 열기 */
  const handleOpenFilter = () => {
    setTempFilters({ ...filters });
    setIsFilterOpen(true);
  };

  /** 필터 적용 */
  const handleApplyFilters = () => {
    setFilters({ ...tempFilters });
    setIsFilterOpen(false);
  };

  /** 필터 초기화 */
  const handleResetFilters = () => {
    const defaultFilters = {
      priceRange: [0, 500000],
      guestCount: 1,
      spaceType: '전체',
    };
    setTempFilters(defaultFilters);
  };

  /** 가격 포맷 */
  const formatPrice = (value) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}만`;
    }
    return value.toLocaleString();
  };

  return (
    <MobileLayout hasBottomNav={true}>
      {/* 상단 바 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1,
          py: 1,
          position: 'sticky',
          top: 0,
          bgcolor: '#FDFFFB',
          zIndex: 10,
          borderBottom: '1px solid #eee',
        }}
      >
        <IconButton onClick={() => navigate(-1)} sx={{ color: '#013D49' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography
          sx={{
            flexGrow: 1,
            fontSize: '1rem',
            fontWeight: 600,
            color: '#013D49',
          }}
        >
          &lsquo;{query}&rsquo; 검색 결과
        </Typography>
      </Box>

      {/* 필터/정렬 바 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            icon={<TuneIcon sx={{ fontSize: '16px !important' }} />}
            label="필터"
            onClick={handleOpenFilter}
            sx={{
              borderRadius: 2,
              bgcolor: '#f5f5f5',
              fontWeight: 600,
              fontSize: '0.8rem',
            }}
          />
          {filters.spaceType !== '전체' && (
            <Chip
              label={filters.spaceType}
              onDelete={() => setFilters((prev) => ({ ...prev, spaceType: '전체' }))}
              sx={{
                borderRadius: 2,
                bgcolor: '#EDAAC6',
                color: '#013D49',
                fontWeight: 600,
                fontSize: '0.8rem',
              }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SortIcon sx={{ fontSize: 18, color: '#666' }} />
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            size="small"
            variant="standard"
            disableUnderline
            sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#013D49' }}
          >
            {SORT_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {/* 검색 결과 */}
      <Box sx={{ px: 2, py: 2 }}>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Skeleton variant="rounded" height={220} sx={{ borderRadius: 3, mb: 1 }} />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          ))
        ) : spaces.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#013D49', mb: 1 }}>
              검색 결과가 없습니다
            </Typography>
            <Typography sx={{ fontSize: '0.9rem', color: '#999' }}>
              다른 검색어나 필터를 사용해보세요.
            </Typography>
          </Box>
        ) : (
          <>
            <Typography sx={{ fontSize: '0.85rem', color: '#999', mb: 1.5 }}>
              검색 결과 {spaces.length}건
            </Typography>
            {spaces.map((space) => (
              <SpaceCard
                key={space.id}
                space={space}
                isFavorite={favoriteIds.includes(space.id)}
                onToggleFavorite={handleToggleFavorite}
                onClick={() => navigate(`/space/${space.id}`)}
              />
            ))}
          </>
        )}
      </Box>

      {/* 필터 바텀시트 */}
      <Drawer
        anchor="bottom"
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: '80vh',
            maxWidth: 430,
            mx: 'auto',
          },
        }}
      >
        <Box sx={{ px: 3, py: 2 }}>
          {/* 드로어 헤더 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3,
            }}
          >
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: '#013D49' }}>
              필터
            </Typography>
            <IconButton onClick={() => setIsFilterOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* 공간 유형 */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#013D49', mb: 1.5 }}>
              공간 유형
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {SPACE_TYPE_OPTIONS.map((type) => (
                <Chip
                  key={type}
                  label={type}
                  onClick={() => setTempFilters((prev) => ({ ...prev, spaceType: type }))}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    bgcolor: tempFilters.spaceType === type ? '#013D49' : '#f5f5f5',
                    color: tempFilters.spaceType === type ? '#fff' : '#666',
                  }}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* 가격 범위 */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#013D49', mb: 0.5 }}>
              가격 범위 (1박 기준)
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#A25987', mb: 2 }}>
              {formatPrice(tempFilters.priceRange[0])}원 ~ {formatPrice(tempFilters.priceRange[1])}원
            </Typography>
            <Slider
              value={tempFilters.priceRange}
              onChange={(_, val) => setTempFilters((prev) => ({ ...prev, priceRange: val }))}
              min={0}
              max={500000}
              step={10000}
              sx={{
                color: '#A25987',
                '& .MuiSlider-thumb': { bgcolor: '#A25987' },
                '& .MuiSlider-track': { bgcolor: '#A25987' },
              }}
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* 인원수 */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#013D49', mb: 1.5 }}>
              인원수
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={() =>
                  setTempFilters((prev) => ({
                    ...prev,
                    guestCount: Math.max(1, prev.guestCount - 1),
                  }))
                }
                sx={{
                  border: '1px solid #ddd',
                  width: 40,
                  height: 40,
                }}
              >
                <RemoveIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#013D49', minWidth: 30, textAlign: 'center' }}>
                {tempFilters.guestCount}
              </Typography>
              <IconButton
                onClick={() =>
                  setTempFilters((prev) => ({
                    ...prev,
                    guestCount: Math.min(20, prev.guestCount + 1),
                  }))
                }
                sx={{
                  border: '1px solid #ddd',
                  width: 40,
                  height: 40,
                }}
              >
                <AddIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <Typography sx={{ fontSize: '0.9rem', color: '#666' }}>명</Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* 버튼 영역 */}
          <Box sx={{ display: 'flex', gap: 1.5, pb: 2 }}>
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              sx={{
                flex: 1,
                py: 1.5,
                borderRadius: 3,
                borderColor: '#ddd',
                color: '#666',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              초기화
            </Button>
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              sx={{
                flex: 2,
                py: 1.5,
                borderRadius: 3,
                bgcolor: '#013D49',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { bgcolor: '#025a6b' },
              }}
            >
              필터 적용
            </Button>
          </Box>
        </Box>
      </Drawer>
    </MobileLayout>
  );
}

export default SearchResultsPage;
