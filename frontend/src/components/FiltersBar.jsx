import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

function FiltersBar({ values, onChange, onApply, onReset, rightActions }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...values, [name]: value });
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
      <TextField
        label="Search"
        name="search"
        value={values.search}
        onChange={handleChange}
        size="small"
        sx={{ minWidth: 220 }}
      />
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="language-label">Programming Language</InputLabel>
        <Select
          labelId="language-label"
          name="language"
          value={values.language}
          label="Programming Language"
          onChange={handleChange}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="javascript">JavaScript</MenuItem>
          <MenuItem value="typescript">TypeScript</MenuItem>
          <MenuItem value="python">Python</MenuItem>
          <MenuItem value="java">Java</MenuItem>
          <MenuItem value="csharp">C#</MenuItem>
          <MenuItem value="cpp">C++</MenuItem>
          <MenuItem value="go">Go</MenuItem>
          <MenuItem value="rust">Rust</MenuItem>
          <MenuItem value="html">HTML</MenuItem>
          <MenuItem value="css">CSS</MenuItem>
          <MenuItem value="sql">SQL</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="sort-label">Sort</InputLabel>
        <Select
          labelId="sort-label"
          name="sort"
          value={values.sort}
          label="Sort"
          onChange={handleChange}
        >
          <MenuItem value="-createdAt">Newest</MenuItem>
          <MenuItem value="createdAt">Oldest</MenuItem>
          <MenuItem value="title">Title (A-Z)</MenuItem>
          <MenuItem value="-title">Title (Z-A)</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" size="small" onClick={() => onApply(values)}>
        Apply Filters
      </Button>
      <Button variant="text" size="small" onClick={onReset}>
        Reset
      </Button>
      <Box sx={{ ml: 'auto' }}>{rightActions}</Box>
    </Box>
  );
}

export default FiltersBar;