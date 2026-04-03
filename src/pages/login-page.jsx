import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import MobileLayout from '../components/common/mobile-layout.jsx';
import { useAuth } from '../hooks/use-auth.jsx';

/**
 * LoginPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <LoginPage />
 */
function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      setIsSnackbarOpen(true);
      return;
    }

    if (email === 'demo@test.com' && password === '1234') {
      login({
        id: 2,
        email,
        nickname: '여행자',
        profile_image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
        bio: '여행을 좋아하는 자유로운 영혼',
        language: 'ko',
      });
      navigate('/home');
    } else {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      setIsSnackbarOpen(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <MobileLayout hasBottomNav={false}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          px: 3,
          py: 4,
        }}
      >
        {/* 로고 영역 */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#EDAAC6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <HomeWorkIcon sx={{ fontSize: 40, color: '#013D49' }} />
          </Box>
          <Typography
            variant="h1"
            sx={{
              fontSize: '1.8rem',
              fontWeight: 700,
              color: '#013D49',
              mb: 0.5,
            }}
          >
            공간대여
          </Typography>
          <Typography sx={{ fontSize: '0.9rem', color: '#999' }}>
            나만의 특별한 공간을 찾아보세요
          </Typography>
        </Box>

        {/* 입력 폼 */}
        <Box sx={{ width: '100%', mb: 3 }}>
          <TextField
            fullWidth
            placeholder="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#A25987' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: '#f9f9f9',
              },
            }}
          />
          <TextField
            fullWidth
            placeholder="비밀번호"
            type={isPasswordVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#A25987' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      edge="end"
                    >
                      {isPasswordVisible
                        ? <VisibilityOffIcon />
                        : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: '#f9f9f9',
              },
            }}
          />
        </Box>

        {/* 로그인 버튼 */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          sx={{
            py: 1.5,
            borderRadius: 3,
            bgcolor: '#013D49',
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            mb: 2,
            '&:hover': { bgcolor: '#025a6b' },
          }}
        >
          로그인
        </Button>

        {/* 데모 안내 */}
        <Box
          sx={{
            bgcolor: '#f0f8f4',
            borderRadius: 2,
            p: 2,
            width: '100%',
            mb: 3,
          }}
        >
          <Typography sx={{ fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
            데모 계정: demo@test.com / 1234
          </Typography>
        </Box>

        {/* 회원가입 링크 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography sx={{ fontSize: '0.9rem', color: '#999' }}>
            계정이 없으신가요?
          </Typography>
          <Typography
            component="span"
            onClick={() => navigate('/register')}
            sx={{
              fontSize: '0.9rem',
              color: '#A25987',
              fontWeight: 600,
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            회원가입
          </Typography>
        </Box>
      </Box>

      {/* 에러 스낵바 */}
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setIsSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setIsSnackbarOpen(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </MobileLayout>
  );
}

export default LoginPage;
