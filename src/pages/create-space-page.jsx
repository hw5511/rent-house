import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import MobileLayout from '../components/common/mobile-layout.jsx';
import PageHeader from '../components/common/page-header.jsx';
import { useAuth } from '../hooks/use-auth.jsx';
import { supabase } from '../utils/supabase.js';

const SPACE_TYPES = ['원룸', '아파트', '빌라', '한옥', '펜션'];
const AMENITY_OPTIONS = ['WiFi', '에어컨', 'TV', '주방', '세탁기', '주차', '욕조', '건조기', '다리미', '헤어드라이어'];

/**
 * CreateSpacePage 컴포넌트
 *
 * 호스트 전용 매물 등록 페이지
 * 숙소 정보 입력, 이미지 업로드, Supabase에 저장
 *
 * Props: 없음
 *
 * Example usage:
 * <CreateSpacePage />
 */
function CreateSpacePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [spaceType, setSpaceType] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [location, setLocation] = useState('');
  const [maxGuests, setMaxGuests] = useState(2);
  const [rules, setRules] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      setSnackbar({ open: true, message: '이미지는 최대 5장까지 업로드 가능합니다.', severity: 'warning' });
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    if (!title.trim()) return '숙소 이름을 입력해주세요.';
    if (!spaceType) return '공간 유형을 선택해주세요.';
    if (!pricePerNight || Number(pricePerNight) <= 0) return '1박 가격을 입력해주세요.';
    if (!location.trim()) return '주소를 입력해주세요.';
    if (!description.trim()) return '숙소 설명을 입력해주세요.';
    if (images.length === 0) return '최소 1장의 이미지를 업로드해주세요.';
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      setSnackbar({ open: true, message: error, severity: 'warning' });
      return;
    }

    setIsSubmitting(true);

    try {
      /** 1. spaces 테이블에 숙소 정보 삽입 */
      const { data: spaceData, error: spaceError } = await supabase
        .from('spaces')
        .insert({
          host_id: user.id,
          title: title.trim(),
          description: description.trim(),
          price_per_night: Number(pricePerNight),
          location: location.trim(),
          max_guests: maxGuests,
          space_type: spaceType,
          amenities: selectedAmenities,
          rules: rules.trim(),
          rating_avg: 0,
          review_count: 0,
        })
        .select()
        .single();

      if (spaceError) throw spaceError;

      /** 2. 이미지 업로드 및 space_images 테이블에 삽입 */
      const imageInserts = [];

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${spaceData.id}/${Date.now()}_${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('space-images')
          .upload(fileName, file, { contentType: file.type, upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('space-images')
          .getPublicUrl(fileName);

        imageInserts.push({
          space_id: spaceData.id,
          image_url: urlData.publicUrl,
          display_order: i + 1,
        });
      }

      if (imageInserts.length > 0) {
        const { error: imgError } = await supabase
          .from('space_images')
          .insert(imageInserts);

        if (imgError) throw imgError;
      }

      setSnackbar({ open: true, message: '매물이 성공적으로 등록되었습니다!', severity: 'success' });

      setTimeout(() => {
        navigate(`/space/${spaceData.id}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: '등록 중 오류가 발생했습니다. 다시 시도해주세요.', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MobileLayout hasBottomNav={true}>
      <PageHeader title="매물 올리기" hasBack={false} />

      <Box sx={{ px: 2.5, py: 2, pb: 4 }}>
        {/* 이미지 업로드 */}
        <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#013D49', mb: 1 }}>
          숙소 사진 (최대 5장)
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, mb: 2 }}>
          {imagePreviews.map((preview, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                width: 100,
                height: 100,
                borderRadius: 2,
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={preview}
                alt={`preview-${index}`}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <IconButton
                size="small"
                onClick={() => handleRemoveImage(index)}
                sx={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: '#fff',
                  width: 24,
                  height: 24,
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                }}
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </IconButton>
              {index === 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(1,61,73,0.7)',
                    textAlign: 'center',
                    py: 0.2,
                  }}
                >
                  <Typography sx={{ fontSize: '0.65rem', color: '#fff' }}>
                    대표
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
          {images.length < 5 && (
            <Button
              component="label"
              sx={{
                width: 100,
                height: 100,
                minWidth: 100,
                borderRadius: 2,
                border: '2px dashed #ccc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999',
                flexShrink: 0,
                '&:hover': { borderColor: '#A25987', color: '#A25987' },
              }}
            >
              <AddPhotoAlternateIcon sx={{ fontSize: 28, mb: 0.3 }} />
              <Typography sx={{ fontSize: '0.7rem' }}>사진 추가</Typography>
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImageSelect}
              />
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* 기본 정보 */}
        <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#013D49', mb: 1.5 }}>
          기본 정보
        </Typography>

        <TextField
          fullWidth
          label="숙소 이름"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>공간 유형</InputLabel>
          <Select
            value={spaceType}
            label="공간 유형"
            onChange={(e) => setSpaceType(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            {SPACE_TYPES.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="1박 가격 (원)"
          type="number"
          value={pricePerNight}
          onChange={(e) => setPricePerNight(e.target.value)}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />

        <TextField
          fullWidth
          label="주소"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />

        {/* 최대 인원 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ fontSize: '0.95rem', color: '#333' }}>최대 인원</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton
              size="small"
              onClick={() => setMaxGuests((prev) => Math.max(1, prev - 1))}
              disabled={maxGuests <= 1}
              sx={{ border: '1px solid #ddd', width: 32, height: 32 }}
            >
              <RemoveIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Typography sx={{ fontWeight: 600, minWidth: 24, textAlign: 'center' }}>
              {maxGuests}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setMaxGuests((prev) => Math.min(20, prev + 1))}
              disabled={maxGuests >= 20}
              sx={{ border: '1px solid #ddd', width: 32, height: 32 }}
            >
              <AddIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* 숙소 설명 */}
        <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#013D49', mb: 1 }}>
          숙소 설명
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="숙소의 특징과 매력을 소개해주세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />

        <Divider sx={{ mb: 2 }} />

        {/* 편의시설 */}
        <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#013D49', mb: 1 }}>
          편의시설
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {AMENITY_OPTIONS.map((amenity) => (
            <Chip
              key={amenity}
              label={amenity}
              onClick={() => handleAmenityToggle(amenity)}
              sx={{
                bgcolor: selectedAmenities.includes(amenity) ? '#EDAAC6' : '#f5f5f5',
                color: selectedAmenities.includes(amenity) ? '#013D49' : '#666',
                fontWeight: selectedAmenities.includes(amenity) ? 600 : 400,
                border: selectedAmenities.includes(amenity) ? '1px solid #A25987' : '1px solid transparent',
                '&:hover': { bgcolor: selectedAmenities.includes(amenity) ? '#EDAAC6' : '#eee' },
              }}
            />
          ))}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* 이용 규칙 */}
        <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#013D49', mb: 1 }}>
          이용 규칙
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder="게스트가 지켜야 할 규칙을 입력해주세요"
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />

        {/* 등록 버튼 */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{
            py: 1.5,
            borderRadius: 3,
            bgcolor: '#A25987',
            fontWeight: 700,
            fontSize: '1rem',
            textTransform: 'none',
            '&:hover': { bgcolor: '#8a4a73' },
            '&.Mui-disabled': { bgcolor: '#ccc' },
          }}
        >
          {isSubmitting ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : '매물 등록하기'}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MobileLayout>
  );
}

export default CreateSpacePage;
