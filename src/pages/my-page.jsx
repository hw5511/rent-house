import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonIcon from '@mui/icons-material/Person';
import LanguageIcon from '@mui/icons-material/Language';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import DescriptionIcon from '@mui/icons-material/Description';
import LogoutIcon from '@mui/icons-material/Logout';
import MobileLayout from '../components/common/mobile-layout.jsx';
import PageHeader from '../components/common/page-header.jsx';
import { useAuth } from '../hooks/use-auth.jsx';

/**
 * MyPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <MyPage />
 */
function MyPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const [language, setLanguage] = useState(user?.language || 'ko');

  const languageLabel = {
    ko: '한국어',
    en: 'English',
    ja: '日本語',
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const menuItems = [
    {
      label: '프로필 수정',
      icon: <PersonIcon />,
      onClick: () => navigate('/mypage/profile'),
    },
    {
      label: '언어 설정',
      icon: <LanguageIcon />,
      secondary: languageLabel[language] || '한국어',
      onClick: () => setIsLanguageDialogOpen(true),
    },
    {
      label: '알림 설정',
      icon: <NotificationsIcon />,
      onClick: () => navigate('/mypage/notifications'),
    },
    {
      label: '고객센터',
      icon: <SupportAgentIcon />,
      onClick: () => navigate('/mypage/faq'),
    },
    {
      label: '이용약관',
      icon: <DescriptionIcon />,
      onClick: () => navigate('/mypage/terms'),
    },
    {
      label: '로그아웃',
      icon: <LogoutIcon />,
      onClick: () => setIsLogoutDialogOpen(true),
      isLogout: true,
    },
  ];

  const nickname = user?.nickname || '사용자';
  const email = user?.email || '';
  const firstLetter = nickname.charAt(0).toUpperCase();

  return (
    <MobileLayout hasBottomNav>
      <PageHeader title="마이페이지" hasBack={false} />

      {/* 프로필 요약 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 3,
          py: 3,
          borderBottom: '1px solid #eee',
        }}
      >
        <Avatar
          src={user?.profile_image || ''}
          sx={{
            width: 64,
            height: 64,
            bgcolor: '#EDAAC6',
            color: '#013D49',
            fontSize: '1.5rem',
            fontWeight: 700,
          }}
        >
          {!user?.profile_image && firstLetter}
        </Avatar>
        <Box>
          <Typography
            sx={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#013D49',
            }}
          >
            {nickname}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.85rem',
              color: '#999',
              mt: 0.3,
            }}
          >
            {email}
          </Typography>
        </Box>
      </Box>

      {/* 메뉴 리스트 */}
      <List sx={{ px: 1 }}>
        {menuItems.map((item, index) => (
          <Box key={item.label}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={item.onClick}
                sx={{
                  py: 1.8,
                  px: 2,
                  '&:hover': { bgcolor: '#f9f9f9' },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: item.isLogout ? '#d32f2f' : '#A25987',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  secondary={item.secondary || null}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: item.isLogout ? '#d32f2f' : '#013D49',
                      },
                    },
                    secondary: {
                      sx: {
                        fontSize: '0.8rem',
                        color: '#999',
                      },
                    },
                  }}
                />
                <ChevronRightIcon sx={{ color: '#ccc' }} />
              </ListItemButton>
            </ListItem>
            {index < menuItems.length - 1 && (
              <Divider sx={{ mx: 2 }} />
            )}
          </Box>
        ))}
      </List>

      {/* 로그아웃 확인 다이얼로그 */}
      <Dialog
        open={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: 600, color: '#013D49' }}>
          로그아웃
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '0.9rem', color: '#666' }}>
            정말 로그아웃 하시겠습니까?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setIsLogoutDialogOpen(false)}
            sx={{ color: '#999' }}
          >
            취소
          </Button>
          <Button
            onClick={handleLogout}
            sx={{ color: '#d32f2f', fontWeight: 600 }}
          >
            로그아웃
          </Button>
        </DialogActions>
      </Dialog>

      {/* 언어 설정 다이얼로그 */}
      <Dialog
        open={isLanguageDialogOpen}
        onClose={() => setIsLanguageDialogOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: 600, color: '#013D49' }}>
          언어 설정
        </DialogTitle>
        <DialogContent>
          <RadioGroup value={language} onChange={handleLanguageChange}>
            <FormControlLabel
              value="ko"
              control={<Radio sx={{ color: '#A25987', '&.Mui-checked': { color: '#A25987' } }} />}
              label="한국어"
            />
            <FormControlLabel
              value="en"
              control={<Radio sx={{ color: '#A25987', '&.Mui-checked': { color: '#A25987' } }} />}
              label="English"
            />
            <FormControlLabel
              value="ja"
              control={<Radio sx={{ color: '#A25987', '&.Mui-checked': { color: '#A25987' } }} />}
              label="日本語"
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setIsLanguageDialogOpen(false)}
            sx={{ color: '#999' }}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </MobileLayout>
  );
}

export default MyPage;
