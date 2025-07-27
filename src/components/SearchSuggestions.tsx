import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import { Search, TrendingUp } from '@mui/icons-material';
import styles from './SearchSuggestions.module.css';

interface SearchSuggestionsProps {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  visible: boolean;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSelectSuggestion,
  visible,
}) => {
  if (!visible || suggestions.length === 0) {
    return null;
  }

  return (
    <Box className={styles.suggestionsContainer}>
      <List className={styles.suggestionsList}>
        <ListItem className={styles.suggestionsHeader}>
          <Typography variant="body2" color="text.secondary">
            <Search sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
            Gợi ý tìm kiếm
          </Typography>
        </ListItem>
        <Divider />
        {suggestions.map((suggestion, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              className={styles.suggestionItem}
              onClick={() => onSelectSuggestion(suggestion)}
            >
              <TrendingUp sx={{ fontSize: 16, mr: 1, color: '#666' }} />
              <ListItemText  sx={{ fontSize: 16, mr: 1, color: '#666' }}
                primary={suggestion}
                className={styles.suggestionText}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SearchSuggestions; 