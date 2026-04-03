import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MobileStepper from '@mui/material/MobileStepper';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CircularProgress from '@mui/material/CircularProgress';
import { supabase } from '../utils/supabase.js';

/**
 * PhotoGalleryPage 컴포넌트
 *
 * 숙소 사진을 전체 화면으로 보여주는 갤러리 페이지
 * 스와이프 및 좌우 버튼으로 사진을 넘길 수 있습니다.
 *
 * Example usage:
 * <Route path="/space/:id/photos" element={<PhotoGalleryPage />} />
 */
function PhotoGalleryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    fetchImages();
  }, [id]);

  const fetchImages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('space_images')
      .select('image_url, display_order')
      .eq('space_id', id)
      .order('display_order', { ascending: true });

    if (!error && data) {
      setImages(data);
    }
    setIsLoading(false);
  };

  const handleNext = useCallback(() => {
    setActiveStep((prev) => prev + 1);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep((prev) => prev - 1);
  }, []);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  if (isLoading) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          bgcolor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress sx={{ color: '#fff' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        bgcolor: '#000',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* 상단 컨트롤 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 1,
          py: 1,
          zIndex: 10,
        }}
      >
        <IconButton onClick={handleClose} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
        <Typography sx={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>
          {images.length > 0 ? `${activeStep + 1} / ${images.length}` : '0 / 0'}
        </Typography>
        <Box sx={{ width: 40 }} />
      </Box>

      {/* 사진 영역 */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {images.length > 0 ? (
          <>
            <Box
              component="img"
              src={images[activeStep]?.image_url}
              alt={`사진 ${activeStep + 1}`}
              sx={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
            />

            {/* 좌우 네비게이션 */}
            {activeStep > 0 && (
              <IconButton
                onClick={handleBack}
                sx={{
                  position: 'absolute',
                  left: 8,
                  color: '#fff',
                  bgcolor: 'rgba(0,0,0,0.3)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
            )}
            {activeStep < images.length - 1 && (
              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  right: 8,
                  color: '#fff',
                  bgcolor: 'rgba(0,0,0,0.3)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            )}
          </>
        ) : (
          <Typography sx={{ color: '#fff' }}>사진이 없습니다.</Typography>
        )}
      </Box>

      {/* 하단 도트 인디케이터 */}
      {images.length > 1 && (
        <MobileStepper
          steps={images.length}
          position="static"
          activeStep={activeStep}
          sx={{
            bgcolor: 'transparent',
            justifyContent: 'center',
            pb: 3,
            '& .MuiMobileStepper-dot': { bgcolor: 'rgba(255,255,255,0.4)' },
            '& .MuiMobileStepper-dotActive': { bgcolor: '#fff' },
          }}
          nextButton={<Box />}
          backButton={<Box />}
        />
      )}
    </Box>
  );
}

export default PhotoGalleryPage;
