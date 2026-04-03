import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CampaignIcon from '@mui/icons-material/Campaign';
import MobileLayout from '../components/common/mobile-layout.jsx';
import PageHeader from '../components/common/page-header.jsx';

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'reservation',
    title: '예약이 확정되었습니다',
    description: '서울 강남 모던 스튜디오 숙소 예약이 확정되었습니다. 상세 내용을 확인해주세요.',
    time: '2시간 전',
    icon: <EventAvailableIcon />,
    iconBgColor: '#e8f5e9',
    iconColor: '#2e7d32',
    route: '/reservations',
  },
  {
    id: 2,
    type: 'message',
    title: '호스트로부터 새 메시지가 도착했습니다',
    description: '김호스트님이 체크인 관련 안내 메시지를 보냈습니다.',
    time: '5시간 전',
    icon: <ChatBubbleOutlineIcon />,
    iconBgColor: '#e3f2fd',
    iconColor: '#1565c0',
    route: '/chat',
  },
  {
    id: 3,
    type: 'promo',
    title: '이번 주 인기 숙소를 확인해보세요',
    description: '제주도 해변 근처 인기 숙소가 새로 등록되었습니다. 지금 확인해보세요!',
    time: '1일 전',
    icon: <CampaignIcon />,
    iconBgColor: '#fce4ec',
    iconColor: '#c62828',
    route: '/home',
  },
];

/**
 * NotificationsPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <NotificationsPage />
 */
function NotificationsPage() {
  const navigate = useNavigate();

  return (
    <MobileLayout hasBottomNav={false}>
      <PageHeader title="알림" />

      {NOTIFICATIONS.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 300,
          }}
        >
          <Typography sx={{ fontSize: '0.9rem', color: '#999' }}>
            알림이 없습니다.
          </Typography>
        </Box>
      ) : (
        <List sx={{ px: 0, py: 1 }}>
          {NOTIFICATIONS.map((notification, index) => (
            <Box key={notification.id}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => navigate(notification.route)}
                  sx={{
                    py: 2,
                    px: 2.5,
                    '&:hover': { bgcolor: '#f9f9f9' },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: notification.iconBgColor,
                        color: notification.iconColor,
                        width: 44,
                        height: 44,
                      }}
                    >
                      {notification.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <Box component="span">
                        <Box
                          component="span"
                          sx={{
                            display: 'block',
                            fontSize: '0.8rem',
                            color: '#999',
                            mt: 0.3,
                            lineHeight: 1.4,
                          }}
                        >
                          {notification.description}
                        </Box>
                        <Box
                          component="span"
                          sx={{
                            display: 'block',
                            fontSize: '0.75rem',
                            color: '#bbb',
                            mt: 0.5,
                          }}
                        >
                          {notification.time}
                        </Box>
                      </Box>
                    }
                    slotProps={{
                      primary: {
                        sx: {
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#013D49',
                        },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
              {index < NOTIFICATIONS.length - 1 && (
                <Divider sx={{ mx: 2.5 }} />
              )}
            </Box>
          ))}
        </List>
      )}
    </MobileLayout>
  );
}

export default NotificationsPage;
