import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MobileLayout from '../components/common/mobile-layout.jsx';
import PageHeader from '../components/common/page-header.jsx';
import { supabase } from '../utils/supabase.js';
import { useAuth } from '../hooks/use-auth.jsx';

/** 요일 레이블 */
const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * SimpleCalendar 컴포넌트
 *
 * Props:
 * @param {Date|null} checkIn - 체크인 날짜 [Optional]
 * @param {Date|null} checkOut - 체크아웃 날짜 [Optional]
 * @param {function} onSelectDate - 날짜 선택 콜백 [Required]
 *
 * Example usage:
 * <SimpleCalendar checkIn={checkIn} checkOut={checkOut} onSelectDate={handleDate} />
 */
function SimpleCalendar({ checkIn, checkOut, onSelectDate }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(new Date(year, month - 1, 1));
  }, [year, month]);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(new Date(year, month + 1, 1));
  }, [year, month]);

  const isToday = (day) => {
    const now = new Date();
    return year === now.getFullYear() && month === now.getMonth() && day === now.getDate();
  };

  const isPast = (day) => {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isSelected = (day) => {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    if (checkIn) {
      const ci = new Date(checkIn);
      ci.setHours(0, 0, 0, 0);
      if (ci.getTime() === date.getTime()) return 'checkin';
    }
    if (checkOut) {
      const co = new Date(checkOut);
      co.setHours(0, 0, 0, 0);
      if (co.getTime() === date.getTime()) return 'checkout';
    }
    if (checkIn && checkOut) {
      const ci = new Date(checkIn);
      const co = new Date(checkOut);
      ci.setHours(0, 0, 0, 0);
      co.setHours(0, 0, 0, 0);
      if (date > ci && date < co) return 'between';
    }
    return null;
  };

  const handleDateClick = (day) => {
    if (isPast(day)) return;
    const selected = new Date(year, month, day);
    onSelectDate(selected);
  };

  /** 달력 그리드 셀 생성 */
  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(<Box key={`empty-${i}`} sx={{ width: '14.28%', height: 40 }} />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const sel = isSelected(day);
    const past = isPast(day);
    const today = isToday(day);

    let bgColor = 'transparent';
    let textColor = past ? '#ccc' : '#333';
    let fontWeight = 400;

    if (sel === 'checkin' || sel === 'checkout') {
      bgColor = '#A25987';
      textColor = '#fff';
      fontWeight = 700;
    } else if (sel === 'between') {
      bgColor = '#EDAAC6';
      textColor = '#fff';
    }

    if (today && !sel) {
      fontWeight = 700;
    }

    cells.push(
      <Box
        key={day}
        onClick={() => handleDateClick(day)}
        sx={{
          width: '14.28%',
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: past ? 'default' : 'pointer',
          borderRadius: sel === 'checkin' ? '50% 0 0 50%' : sel === 'checkout' ? '0 50% 50% 0' : sel === 'between' ? 0 : '50%',
          bgcolor: bgColor,
          '&:hover': past ? {} : { bgcolor: sel ? bgColor : '#f0f0f0' },
        }}
      >
        <Typography
          sx={{
            fontSize: '0.85rem',
            fontWeight,
            color: textColor,
          }}
        >
          {day}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* 월 네비게이션 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <IconButton size="small" onClick={handlePrevMonth}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
          {year}년 {month + 1}월
        </Typography>
        <IconButton size="small" onClick={handleNextMonth}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* 요일 헤더 */}
      <Box sx={{ display: 'flex', mb: 0.5 }}>
        {DAY_LABELS.map((label) => (
          <Box
            key={label}
            sx={{
              width: '14.28%',
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: '#999', fontWeight: 600 }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* 날짜 그리드 */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {cells}
      </Box>
    </Box>
  );
}

/**
 * BookingPage 컴포넌트
 *
 * 숙소 예약 페이지
 * 체크인/체크아웃 날짜, 게스트 수, 특별 요청사항을 입력합니다.
 *
 * Example usage:
 * <Route path="/space/:id/booking" element={<BookingPage />} />
 */
function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [space, setSpace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    fetchSpace();
  }, [id]);

  const fetchSpace = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('spaces')
      .select('id, title, price_per_night, max_guests')
      .eq('id', id)
      .single();

    if (!error && data) {
      setSpace(data);
    }
    setIsLoading(false);
  };

  /** 날짜 선택 핸들러 */
  const handleSelectDate = useCallback((date) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
    } else {
      if (date > checkIn) {
        setCheckOut(date);
      } else {
        setCheckIn(date);
        setCheckOut(null);
      }
    }
  }, [checkIn, checkOut]);

  /** 숙박 일수 계산 */
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  /** 총 가격 */
  const totalPrice = useMemo(() => {
    return nights * (space?.price_per_night || 0);
  }, [nights, space]);

  /** 날짜 포맷 */
  const formatDate = (date) => {
    if (!date) return '-';
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  /** 게스트 수 증감 */
  const handleIncrement = useCallback(() => {
    const max = space?.max_guests || 10;
    setGuestCount((prev) => Math.min(prev + 1, max));
  }, [space]);

  const handleDecrement = useCallback(() => {
    setGuestCount((prev) => Math.max(prev - 1, 1));
  }, []);

  /** 예약 확정 */
  const handleConfirm = async () => {
    if (!checkIn || !checkOut) return;
    if (!user) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    const { data, error } = await supabase
      .from('reservations')
      .insert({
        space_id: id,
        user_id: user.id,
        check_in: checkIn.toISOString().split('T')[0],
        check_out: checkOut.toISOString().split('T')[0],
        guest_count: guestCount,
        special_requests: specialRequests,
        total_price: totalPrice,
        status: 'confirmed',
      })
      .select()
      .single();

    setIsSubmitting(false);

    if (!error && data) {
      navigate(`/booking-complete/${data.id}`, {
        state: {
          spaceTitle: space.title,
          checkIn: formatDate(checkIn),
          checkOut: formatDate(checkOut),
          guestCount,
          totalPrice,
        },
      });
    }
  };

  if (isLoading) {
    return (
      <MobileLayout hasBottomNav={false}>
        <PageHeader title="예약하기" />
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#013D49' }} />
        </Box>
      </MobileLayout>
    );
  }

  if (!space) {
    return (
      <MobileLayout hasBottomNav={false}>
        <PageHeader title="예약하기" />
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography>숙소 정보를 찾을 수 없습니다.</Typography>
        </Box>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout hasBottomNav={false}>
      <PageHeader title="예약하기" />

      <Box sx={{ p: 2 }}>
        {/* 숙소 정보 요약 */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#013D49' }}>
            {space.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ₩{space.price_per_night?.toLocaleString()} / 1박
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* 캘린더 */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '1rem', mb: 1 }}>
            날짜 선택
          </Typography>
          <SimpleCalendar
            checkIn={checkIn}
            checkOut={checkOut}
            onSelectDate={handleSelectDate}
          />
        </Box>

        {/* 선택된 날짜 표시 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            bgcolor: '#f5f5f5',
            borderRadius: 2,
            py: 1.5,
            mb: 2,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              체크인
            </Typography>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
              {formatDate(checkIn)}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              체크아웃
            </Typography>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
              {formatDate(checkOut)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* 게스트 수 */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '1rem', mb: 1 }}>
            게스트 수
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={handleDecrement}
              disabled={guestCount <= 1}
              sx={{
                border: '1px solid #ddd',
                width: 36,
                height: 36,
              }}
            >
              <RemoveIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Typography sx={{ fontWeight: 600, fontSize: '1.1rem', minWidth: 30, textAlign: 'center' }}>
              {guestCount}
            </Typography>
            <IconButton
              onClick={handleIncrement}
              disabled={guestCount >= (space.max_guests || 10)}
              sx={{
                border: '1px solid #ddd',
                width: 36,
                height: 36,
              }}
            >
              <AddIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              최대 {space.max_guests || 10}명
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* 특별 요청 */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '1rem', mb: 1 }}>
            특별 요청사항
          </Typography>
          <TextField
            multiline
            rows={3}
            fullWidth
            placeholder="호스트에게 전달할 요청사항을 입력해주세요"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: '0.9rem',
              },
            }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* 요금 상세 */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '1rem', mb: 1 }}>
            요금 상세
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              ₩{space.price_per_night?.toLocaleString()} × {nights}박
            </Typography>
            <Typography variant="body2">
              ₩{totalPrice.toLocaleString()}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 700 }}>
              총 합계
            </Typography>
            <Typography sx={{ fontWeight: 700, color: '#A25987' }}>
              ₩{totalPrice.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {/* 예약 확정 버튼 */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleConfirm}
          disabled={!checkIn || !checkOut || isSubmitting}
          sx={{
            bgcolor: '#A25987',
            color: '#fff',
            fontWeight: 700,
            py: 1.5,
            fontSize: '1rem',
            borderRadius: 2,
            '&:hover': { bgcolor: '#8a4a73' },
            '&.Mui-disabled': { bgcolor: '#ccc' },
          }}
        >
          {isSubmitting ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : '예약 확정'}
        </Button>
      </Box>
    </MobileLayout>
  );
}

export default BookingPage;
