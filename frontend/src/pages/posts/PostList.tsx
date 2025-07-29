import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Post } from '../../types';
import { List, ListItem, ListItemButton, ListItemText, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/posts');
        setPosts(res.data.posts);
      } catch (err) {
        console.error('Failed to load posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <Typography>Loading posts...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Posts
      </Typography>
      <List>
        {posts.map((post) => (
          <ListItem key={post.id} disablePadding>
            <ListItemButton component={Link} to={`/posts/${post.slug}`}>
              <ListItemText
                primary={post.title}
                secondary={`By ${post.author.username} - ${new Date(post.createdAt).toLocaleDateString()}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default PostList;
