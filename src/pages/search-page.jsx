import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MobileLayout from '../components/common/mobile-layout.jsx';

/** 인기 검색어 목록 */
const POPULAR_SEARCHES = ['한옥', '강남', '해운대', '제주', '홍대', '부산'];

/** localStorage 키 */
const STORAGE_KEY = 'rent_house_recent_searches';

/**
 * SearchPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <SearchPage />
 */
function SearchPage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  /** 최근 검색어 로드 */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  /** 입력 필드 자동 포커스 */
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  /** 검색 실행 */
  const handleSearch = (searchQuery) => {
    const trimmed = (searchQuery || query).trim();
    if (!trimmed) return;

    /** 최근 검색어 업데이트 */
    const updated = [trimmed, ...recentSearches.filter((s) => s !== trimmed)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    navigate(`/search/results?q=${encodeURIComponent(trimmed)}`);
  };

  /** Enter 키 핸들러 */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  /** 최근 검색어 단건 삭제 */
  const handleRemoveRecent = (searchTerm) => {
    const updated = recentSearches.filter((s) => s !== searchTerm);
    setRecentSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  /** 최근 검색어 전체 삭제 */
  const handleClearAll = () => {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <MobileLayout hasBottomNav={true}>
      {/* 상단 검색 바 */}
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
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ color: '#013D49' }}
        >
          <ArrowBackIcon />
        </IconButton>
        <TextField
          inputRef={inputRef}
          fullWidth
          placeholder="지역, 숙소명으로 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#999' }} />
                </InputAdornment>
              ),
              endAdornment: query && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setQuery('')}
                  >
                    <CloseIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: '#f5f5f5',
            },
          }}
        />
      </Box>

      <Box sx={{ px: 2, py: 2 }}>
        {/* 최근 검색어 */}
        {recentSearches.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <HistoryIcon sx={{ fontSize: 20, color: '#013D49' }} />
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#013D49' }}>
                  최근 검색어
                </Typography>
              </Box>
              <Typography
                component="span"
                onClick={handleClearAll}
                sx={{
                  fontSize: '0.8rem',
                  color: '#999',
                  cursor: 'pointer',
                  '&:hover': { color: '#666' },
                }}
              >
                전체 삭제
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {recentSearches.map((term) => (
                <Chip
                  key={term}
                  label={term}
                  onClick={() => handleSearch(term)}
                  onDelete={() => handleRemoveRecent(term)}
                  deleteIcon={<CloseIcon sx={{ fontSize: '14px !important' }} />}
                  sx={{
                    borderRadius: 2,
                    bgcolor: '#f5f5f5',
                    color: '#333',
                    fontSize: '0.85rem',
                    '& .MuiChip-deleteIcon': { color: '#999' },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* 인기 검색어 */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
            <TrendingUpIcon sx={{ fontSize: 20, color: '#A25987' }} />
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#013D49' }}>
              인기 검색어
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {POPULAR_SEARCHES.map((term) => (
              <Chip
                key={term}
                label={term}
                onClick={() => handleSearch(term)}
                sx={{
                  borderRadius: 2,
                  bgcolor: '#EDAAC6',
                  color: '#013D49',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  '&:hover': { bgcolor: '#e09ab5' },
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </MobileLayout>
  );
}

export default SearchPage;
