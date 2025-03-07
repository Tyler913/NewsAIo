import { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import { Save as SaveIcon, Api as ApiIcon } from '@mui/icons-material';

function SettingsPage() {
  const theme = useTheme();
  const [apiProvider, setApiProvider] = useState('openai');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [deepseekApiKey, setDeepseekApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Load API settings on startup
  useEffect(() => {
    loadApiSettings();
  }, []);
  
  const loadApiSettings = async () => {
    setLoading(true);
    try {
      // Placeholder for electron API call
      // const settings = await window.electronAPI.getApiSettings();
      // setApiProvider(settings.provider || 'openai');
      // setOpenaiApiKey(settings.openaiApiKey || '');
      // setDeepseekApiKey(settings.deepseekApiKey || '');
      
      // Sample data for development
      setApiProvider('openai');
      setOpenaiApiKey('');
      setDeepseekApiKey('');
    } catch (error) {
      console.error("Failed to load API settings:", error);
      setError("Failed to load API settings");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveSettings = async () => {
    // Validate API key based on selected provider
    if (apiProvider === 'openai' && !openaiApiKey) {
      setError("OpenAI API key is required");
      return;
    } else if (apiProvider === 'deepseek' && !deepseekApiKey) {
      setError("DeepSeek API key is required");
      return;
    }
    
    setLoading(true);
    setSuccess(false);
    setError('');
    
    try {
      // Placeholder for electron API call
      // const apiSettings = {
      //   provider: apiProvider,
      //   openaiApiKey,
      //   deepseekApiKey
      // };
      // await window.electronAPI.saveApiSettings(apiSettings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Failed to save API settings:", error);
      setError("Failed to save API settings");
    } finally {
      setLoading(false);
    }
  };
  
  const handleApiProviderChange = (event) => {
    setApiProvider(event.target.value);
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Settings saved successfully!</Alert>}
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ApiIcon sx={{ mr: 1 }} />
            <Typography variant="h6">AI Provider Settings</Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Configure your AI provider to generate summaries for RSS feed articles.
            You'll need to provide an API key for the selected provider.
          </Typography>
          
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Select AI Provider</Typography>
            <RadioGroup
              name="api-provider"
              value={apiProvider}
              onChange={handleApiProviderChange}
            >
              <FormControlLabel value="openai" control={<Radio />} label="OpenAI" />
              <FormControlLabel value="deepseek" control={<Radio />} label="DeepSeek" />
            </RadioGroup>
          </FormControl>
          
          <Divider sx={{ mb: 3 }} />
          
          {apiProvider === 'openai' ? (
            <TextField
              label="OpenAI API Key"
              variant="outlined"
              fullWidth
              value={openaiApiKey}
              onChange={(e) => setOpenaiApiKey(e.target.value)}
              placeholder="sk-..."
              helperText="Enter your OpenAI API key. You can find it in your OpenAI dashboard."
              type="password"
              autoComplete="off"
              sx={{ mb: 2 }}
            />
          ) : (
            <TextField
              label="DeepSeek API Key"
              variant="outlined"
              fullWidth
              value={deepseekApiKey}
              onChange={(e) => setDeepseekApiKey(e.target.value)}
              placeholder="sk-..."
              helperText="Enter your DeepSeek API key. You can find it in your DeepSeek account settings."
              type="password"
              autoComplete="off"
              sx={{ mb: 2 }}
            />
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleSaveSettings}
              disabled={loading}
            >
              Save Settings
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>About AI Summaries</Typography>
          <Typography variant="body2" paragraph>
            NewsAIo uses AI to automatically generate concise summaries of articles in your RSS feeds.
            This helps you quickly understand the content without reading the entire article.
          </Typography>
          
          <Typography variant="subtitle2" gutterBottom>How it works</Typography>
          <Typography variant="body2" paragraph>
            When you view an RSS feed, NewsAIo sends the article content to the selected AI provider's API.
            The AI then generates a concise summary that captures the key points of the article.
          </Typography>
          
          <Typography variant="subtitle2" gutterBottom>API Key Privacy</Typography>
          <Typography variant="body2" paragraph>
            Your API keys are stored securely on your device only and are never sent to our servers.
            All AI processing happens directly between your application and the AI provider's servers.
          </Typography>
          
          <Typography variant="subtitle2" gutterBottom>API Usage and Costs</Typography>
          <Typography variant="body2">
            Please be aware that using the AI summaries feature will consume tokens from your API account,
            which may incur charges according to the pricing model of your selected provider.
            Monitor your API usage in your provider's dashboard to manage costs.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SettingsPage; 