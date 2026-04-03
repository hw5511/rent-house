import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MobileLayout from '../components/common/mobile-layout.jsx';

/**
 * RegisterPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <RegisterPage />
 */
function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: '', severity: 'success' });

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (password.length < 4) {
      newErrors.password = '비밀번호는 4자 이상이어야 합니다.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!nickname) {
      newErrors.nickname = '닉네임을 입력해주세요.';
    }

    if (!isTermsChecked) {
      newErrors.terms = '이용약관에 동의해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setSnackbar({
      isOpen: true,
      message: '회원가입이 완료되었습니다! 로그인해주세요.',
      severity: 'success',
    });

    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <MobileLayout hasBottomNav={false}>
      <Box sx={{ px: 3, py: 4 }}>
        {/* 상단 네비게이션 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ color: '#013D49', ml: -1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h2"
            sx={{ fontSize: '1.3rem', fontWeight: 700, color: '#013D49' }}
          >
            회원가입
          </Typography>
        </Box>

        {/* 안내 문구 */}
        <Typography sx={{ fontSize: '0.95rem', color: '#666', mb: 4 }}>
          공간대여 서비스를 이용하려면 회원가입이 필요합니다.
        </Typography>

        {/* 입력 폼 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            fullWidth
            label="이메일"
            placeholder="example@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
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
              '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f9f9f9' },
            }}
          />

          <TextField
            fullWidth
            label="비밀번호"
            placeholder="4자 이상 입력"
            type={isPasswordVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
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
              '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f9f9f9' },
            }}
          />

          <TextField
            fullWidth
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력"
            type={isConfirmVisible ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
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
                      onClick={() => setIsConfirmVisible(!isConfirmVisible)}
                      edge="end"
                    >
                      {isConfirmVisible
                        ? <VisibilityOffIcon />
                        : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f9f9f9' },
            }}
          />

          <TextField
            fullWidth
            label="닉네임"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            error={!!errors.nickname}
            helperText={errors.nickname}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: '#A25987' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f9f9f9' },
            }}
          />

          {/* 이용약관 */}
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isTermsChecked}
                  onChange={(e) => setIsTermsChecked(e.target.checked)}
                  sx={{
                    color: '#A25987',
                    '&.Mui-checked': { color: '#A25987' },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: '0.9rem', color: '#333' }}>
                  이용약관 및 개인정보처리방침에 동의합니다
                </Typography>
              }
            />
            {errors.terms && (
              <Typography sx={{ fontSize: '0.75rem', color: '#d32f2f', ml: 4 }}>
                {errors.terms}
              </Typography>
            )}
          </Box>

          {/* 가입 버튼 */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{
              py: 1.5,
              borderRadius: 3,
              bgcolor: '#013D49',
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              mt: 1,
              '&:hover': { bgcolor: '#025a6b' },
            }}
          >
            가입하기
          </Button>

          {/* 로그인 링크 */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mt: 1 }}>
            <Typography sx={{ fontSize: '0.9rem', color: '#999' }}>
              이미 계정이 있으신가요?
            </Typography>
            <Typography
              component="span"
              onClick={() => navigate('/login')}
              sx={{
                fontSize: '0.9rem',
                color: '#A25987',
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              로그인
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 스낵바 */}
      <Snackbar
        open={snackbar.isOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MobileLayout>
  );
}

export default RegisterPage;
