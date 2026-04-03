import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MobileLayout from '../components/common/mobile-layout.jsx';
import PageHeader from '../components/common/page-header.jsx';
import { useAuth } from '../hooks/use-auth.jsx';

/**
 * EditProfilePage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <EditProfilePage />
 */
function EditProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const firstLetter = (nickname || '사용자').charAt(0).toUpperCase();

  const handleSave = () => {
    updateUser({ nickname, bio });
    setIsSnackbarOpen(true);
    setTimeout(() => {
      navigate(-1);
    }, 1000);
  };

  return (
    <MobileLayout hasBottomNav={false}>
      <PageHeader title="프로필 수정" />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: 3,
          py: 4,
        }}
      >
        {/* 아바타 영역 */}
        <Box sx={{ position: 'relative', mb: 4 }}>
          <Avatar
            src={user?.profile_image || ''}
            sx={{
              width: 96,
              height: 96,
              bgcolor: '#EDAAC6',
              color: '#013D49',
              fontSize: '2rem',
              fontWeight: 700,
            }}
          >
            {!user?.profile_image && firstLetter}
          </Avatar>
          <IconButton
            sx={{
              position: 'absolute',
              bottom: 0,
              right: -4,
              bgcolor: '#013D49',
              color: '#fff',
              width: 32,
              height: 32,
              '&:hover': { bgcolor: '#025a6b' },
            }}
          >
            <CameraAltIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* 닉네임 입력 */}
        <Box sx={{ width: '100%', mb: 3 }}>
          <Typography
            sx={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#013D49',
              mb: 1,
            }}
          >
            닉네임
          </Typography>
          <TextField
            fullWidth
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: '#f9f9f9',
              },
            }}
          />
        </Box>

        {/* 자기소개 입력 */}
        <Box sx={{ width: '100%', mb: 4 }}>
          <Typography
            sx={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#013D49',
              mb: 1,
            }}
          >
            자기소개
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="자기소개를 입력해주세요"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: '#f9f9f9',
              },
            }}
          />
        </Box>

        {/* 저장 버튼 */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleSave}
          sx={{
            py: 1.5,
            borderRadius: 3,
            bgcolor: '#013D49',
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': { bgcolor: '#025a6b' },
          }}
        >
          저장
        </Button>
      </Box>

      {/* 성공 스낵바 */}
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={2000}
        onClose={() => setIsSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setIsSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          프로필이 저장되었습니다.
        </Alert>
      </Snackbar>
    </MobileLayout>
  );
}

export default EditProfilePage;
