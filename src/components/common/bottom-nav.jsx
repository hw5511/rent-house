import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import EventNoteIcon from '@mui/icons-material/EventNote';
import HomeIcon from '@mui/icons-material/Home';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { useAuth } from '../../hooks/use-auth.jsx';

const guestTabs = [
  { label: '검색', icon: <SearchIcon />, path: '/search' },
  { label: '내 예약', icon: <EventNoteIcon />, path: '/reservations' },
  { label: '홈', icon: <HomeIcon />, path: '/home' },
  { label: '채팅', icon: <ChatBubbleOutlineIcon />, path: '/chat' },
  { label: '마이페이지', icon: <PersonOutlineIcon />, path: '/mypage' },
];

const hostTabs = [
  { label: '검색', icon: <SearchIcon />, path: '/search' },
  { label: '매물 올리기', icon: <AddBusinessIcon />, path: '/create-space' },
  { label: '홈', icon: <HomeIcon />, path: '/home' },
  { label: '채팅', icon: <ChatBubbleOutlineIcon />, path: '/chat' },
  { label: '마이페이지', icon: <PersonOutlineIcon />, path: '/mypage' },
];

/**
 * BottomNav 컴포넌트
 *
 * Props: 없음
 * 유저 role에 따라 게스트/호스트 탭을 분기합니다.
 *
 * Example usage:
 * <BottomNav />
 */
function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const tabs = useMemo(() => {
    return user?.role === 'host' ? hostTabs : guestTabs;
  }, [user?.role]);

  const currentTab = tabs.findIndex((tab) => location.pathname.startsWith(tab.path));

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        zIndex: 1200,
        borderTop: '1px solid #eee',
      }}
      elevation={3}
    >
      <BottomNavigation
        value={currentTab === -1 ? 2 : currentTab}
        onChange={(e, newValue) => navigate(tabs[newValue].path)}
        showLabels
        sx={{
          height: 64,
          bgcolor: '#FDFFFB',
          '& .Mui-selected': {
            color: '#013D49',
          },
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            py: 1,
            color: '#999',
          },
        }}
      >
        {tabs.map((tab, index) => (
          <BottomNavigationAction
            key={tab.path}
            label={tab.label}
            icon={tab.icon}
            sx={index === 2 ? {
              '& .MuiSvgIcon-root': {
                fontSize: 32,
                bgcolor: '#013D49',
                color: '#fff',
                borderRadius: '50%',
                p: 0.5,
              },
            } : {}}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;
