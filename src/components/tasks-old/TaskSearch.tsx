import { useState } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import '../../styles/task/_index.scss';

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
type KeyEvent = React.KeyboardEvent<HTMLInputElement>;

function TaskSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string>(searchParams.get('search') ?? '');

  const handleChange = (event: ChangeEvent) => {
    setSearch(event.target.value);
  }

  const handleKeyPress = (event: KeyEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }

  const handleSearch = () => {
    if (search) {
      setSearchParams({...searchParams, search});
    } else {
      setSearchParams({});
    }
  }

  return (
    <InputGroup className="task-search mb-3">
      <FormControl defaultValue={search} onChange={handleChange} onKeyPress={handleKeyPress}
        placeholder="Search tasks" aria-label="Search tasks" />
      <Button variant="primary" onClick={handleSearch}>
        <span className="icon-search"></span>
      </Button>
    </InputGroup>
  );
}

export default TaskSearch;