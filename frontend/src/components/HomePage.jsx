import { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Divider,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  useTheme
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

function HomePage() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [rssSources, setRssSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [addRssDialogOpen, setAddRssDialogOpen] = useState(false);
  const [newRssUrl, setNewRssUrl] = useState('');
  const [error, setError] = useState('');

  // Load RSS sources on startup
  useEffect(() => {
    loadRssSources();
  }, []);

  const loadRssSources = async () => {
    setLoading(true);
    try {
      // Placeholder for electron API call
      // const sources = await window.electronAPI.getRssSources();
      const sources = [
        { title: 'Sample Feed 1', url: 'https://example.com/feed1' },
        { title: 'Sample Feed 2', url: 'https://example.com/feed2' }
      ];
      setRssSources(sources);
    } catch (error) {
      console.error("Failed to load RSS sources:", error);
      setError("Failed to load RSS sources");
    } finally {
      setLoading(false);
    }
  };

  const handleSourceSelect = async (source) => {
    setSelectedSource(source);
    setSelectedArticle(null);
    setLoading(true);
    try {
      // Placeholder for electron API call
      // const feed = await window.electronAPI.fetchRss(source.url);
      const sampleArticles = [
        { 
          title: 'Sample Article 1', 
          content: '<p>This is sample content for article 1.</p>',
          link: 'https://example.com/article1',
          pubDate: new Date().toISOString(),
          summary: 'AI-generated summary for article 1.'
        },
        { 
          title: 'Sample Article 2', 
          content: '<p>This is sample content for article 2.</p>',
          link: 'https://example.com/article2',
          pubDate: new Date().toISOString(),
          summary: 'AI-generated summary for article 2.'
        }
      ];
      setArticles(sampleArticles);
    } catch (error) {
      console.error("Failed to fetch RSS:", error);
      setError("Failed to fetch RSS feed");
    } finally {
      setLoading(false);
    }
  };

  const handleArticleSelect = (article) => {
    setSelectedArticle(article);
  };

  const handleAddRssOpen = () => {
    setAddRssDialogOpen(true);
    setNewRssUrl('');
    setError('');
  };

  const handleAddRssClose = () => {
    setAddRssDialogOpen(false);
  };

  const handleAddRssSubmit = async () => {
    if (!newRssUrl) {
      setError("Please enter a URL");
      return;
    }
    
    setLoading(true);
    try {
      // Placeholder for electron API call
      // const feed = await window.electronAPI.fetchRss(newRssUrl);
      // const sources = await window.electronAPI.getRssSources();
      // sources.push({ title: feed.title || newRssUrl, url: newRssUrl });
      // await window.electronAPI.saveRssSources(sources);
      
      // For now, just add it to local state
      const newSource = { title: `Feed from ${newRssUrl}`, url: newRssUrl };
      setRssSources([...rssSources, newSource]);
      handleAddRssClose();
    } catch (error) {
      console.error("Failed to add RSS feed:", error);
      setError("Invalid RSS feed URL");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRss = async (source, event) => {
    event.stopPropagation();
    try {
      // Placeholder for electron API call
      // const sources = await window.electronAPI.getRssSources();
      // const updatedSources = sources.filter(s => s.url !== source.url);
      // await window.electronAPI.saveRssSources(updatedSources);
      
      // For now, just update local state
      const updatedSources = rssSources.filter(s => s.url !== source.url);
      setRssSources(updatedSources);
      
      if (selectedSource && selectedSource.url === source.url) {
        setSelectedSource(null);
        setArticles([]);
        setSelectedArticle(null);
      }
    } catch (error) {
      console.error("Failed to delete RSS source:", error);
      setError("Failed to delete RSS source");
    }
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Grid container spacing={2}>
        {/* RSS Sources Panel */}
        <Grid item xs={12} md={3}>
          <Paper 
            elevation={0} 
            sx={{ 
              height: '100%', 
              p: 2,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">RSS Sources</Typography>
              <Button 
                variant="contained" 
                size="small" 
                startIcon={<AddIcon />}
                onClick={handleAddRssOpen}
              >
                Add
              </Button>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            {loading && rssSources.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <List>
                {rssSources.map((source, index) => (
                  <ListItem 
                    key={index} 
                    button 
                    onClick={() => handleSourceSelect(source)}
                    selected={selectedSource && selectedSource.url === source.url}
                    secondaryAction={
                      <Button 
                        size="small" 
                        color="error" 
                        onClick={(e) => handleDeleteRss(source, e)}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    }
                  >
                    <ListItemText primary={source.title} />
                  </ListItem>
                ))}
                
                {rssSources.length === 0 && !loading && (
                  <ListItem>
                    <ListItemText 
                      primary="No RSS sources" 
                      secondary="Click 'Add' to add a new RSS feed"
                    />
                  </ListItem>
                )}
              </List>
            )}
          </Paper>
        </Grid>
        
        {/* Articles Panel */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              height: '100%', 
              p: 2,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {selectedSource ? selectedSource.title : 'Articles'}
              </Typography>
              {selectedSource && (
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<RefreshIcon />}
                  onClick={() => handleSourceSelect(selectedSource)}
                >
                  Refresh
                </Button>
              )}
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <List>
                {articles.map((article, index) => (
                  <ListItem 
                    key={index} 
                    button 
                    onClick={() => handleArticleSelect(article)}
                    selected={selectedArticle && selectedArticle.title === article.title}
                  >
                    <ListItemText 
                      primary={article.title} 
                      secondary={new Date(article.pubDate).toLocaleString()}
                    />
                  </ListItem>
                ))}
                
                {articles.length === 0 && (
                  <ListItem>
                    <ListItemText 
                      primary={selectedSource ? "No articles found" : "Select a source to view articles"} 
                    />
                  </ListItem>
                )}
              </List>
            )}
          </Paper>
        </Grid>
        
        {/* Article Content Panel */}
        <Grid item xs={12} md={5}>
          <Paper 
            elevation={0} 
            sx={{ 
              minHeight: '70vh', 
              p: 2,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1
            }}
          >
            <Typography variant="h6" gutterBottom>
              {selectedArticle ? selectedArticle.title : 'Article Content'}
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            {selectedArticle ? (
              <Box>
                {selectedArticle.pubDate && (
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                    {new Date(selectedArticle.pubDate).toLocaleString()}
                  </Typography>
                )}
                
                {selectedArticle.summary && (
                  <Paper 
                    variant="outlined"
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>AI Summary</Typography>
                    <Typography variant="body2">{selectedArticle.summary}</Typography>
                  </Paper>
                )}
                
                <Box 
                  sx={{ 
                    '& img': { maxWidth: '100%', height: 'auto' },
                    overflowX: 'hidden'
                  }}
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }} 
                />
                
                {selectedArticle.link && (
                  <Button 
                    variant="text" 
                    href={selectedArticle.link} 
                    target="_blank"
                    sx={{ mt: 2 }}
                  >
                    Read full article
                  </Button>
                )}
              </Box>
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  Select an article to view its content
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Add RSS Dialog */}
      <Dialog open={addRssDialogOpen} onClose={handleAddRssClose}>
        <DialogTitle>Add RSS Feed</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="rss-url"
            label="RSS URL"
            type="url"
            fullWidth
            variant="outlined"
            value={newRssUrl}
            onChange={(e) => setNewRssUrl(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddRssClose}>Cancel</Button>
          <Button onClick={handleAddRssSubmit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Add Feed"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default HomePage; 