import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import CircularProgress from '@mui/material/CircularProgress';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MobileLayout from '../components/common/mobile-layout.jsx';
import PageHeader from '../components/common/page-header.jsx';
import { useAuth } from '../hooks/use-auth.jsx';
import { supabase } from '../utils/supabase.js';

/**
 * ChatListPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <ChatListPage />
 */
function ChatListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChatRooms = async () => {
      if (!user) return;
      setIsLoading(true);

      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*, spaces(title, space_images(image_url, display_order)), users!chat_rooms_host_id_fkey(nickname, profile_image)')
        .eq('guest_id', user.id);

      if (!error && data) {
        /** 각 채팅방의 안 읽은 메시지 수 조회 */
        const roomsWithUnread = await Promise.all(
          data.map(async (room) => {
            const { count } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('chat_room_id', room.id)
              .eq('is_read', false)
              .neq('sender_id', user.id);

            /** 마지막 메시지 조회 */
            const { data: lastMsg } = await supabase
              .from('messages')
              .select('content, created_at')
              .eq('chat_room_id', room.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            return {
              ...room,
              unreadCount: count || 0,
              lastMessage: lastMsg?.content || '',
              lastMessageTime: lastMsg?.created_at || room.created_at,
            };
          })
        );

        /** 최신 메시지 순으로 정렬 */
        roomsWithUnread.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
        setChatRooms(roomsWithUnread);
      }
      setIsLoading(false);
    };

    fetchChatRooms();
  }, [user]);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <MobileLayout hasBottomNav={true}>
      <PageHeader title="채팅" hasBack={false} />

      <Box sx={{ px: 0, py: 0 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#013D49' }} />
          </Box>
        ) : chatRooms.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
            <Typography sx={{ fontSize: '0.95rem', color: '#999' }}>
              채팅 내역이 없습니다
            </Typography>
          </Box>
        ) : (
          chatRooms.map((room) => (
            <Box
              key={room.id}
              onClick={() => navigate(`/chat/${room.id}`)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2.5,
                py: 1.8,
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
                '&:hover': { bgcolor: '#fafafa' },
              }}
            >
              <Badge
                badgeContent={room.unreadCount}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.7rem',
                    minWidth: 18,
                    height: 18,
                  },
                }}
              >
                <Avatar
                  src={room.users?.profile_image || ''}
                  sx={{ width: 52, height: 52, bgcolor: '#EDAAC6' }}
                >
                  {room.users?.nickname?.[0] || 'H'}
                </Avatar>
              </Badge>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                  <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#013D49' }}>
                    {room.users?.nickname || '호스트'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#bbb', flexShrink: 0 }}>
                    {formatTime(room.lastMessageTime)}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.8rem',
                    color: '#A25987',
                    mb: 0.3,
                  }}
                >
                  {room.spaces?.title || ''}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.85rem',
                    color: '#999',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {room.lastMessage || '대화를 시작해보세요'}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </MobileLayout>
  );
}

export default ChatListPage;
