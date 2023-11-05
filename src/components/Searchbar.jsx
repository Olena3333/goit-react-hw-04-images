import React, { useState } from 'react';
import {
  SearchbarWrapper,
  SearchForm,
  StyledButton,
  SearchFormInput,
} from './ImageGallery.Styled';
import propTypes from 'prop-types';
export const Searchbar = props => {
  const [searchValue, setSearchValue] = useState('');
  const handleSubmit = event => {
    event.preventDefault();
    if (!searchValue) {
      return;
    }
    props.setQuery(searchValue);
  };
  const handleOnChange = e => {
    setSearchValue(e.target.value);
  };
  return (
    <SearchbarWrapper>
      <SearchForm onSubmit={handleSubmit} className="form">
        <SearchFormInput
          onChange={handleOnChange}
          value={searchValue}
          type="search"
          autoComplete="off"
          autoFocus
          placeholder="What are you looking for?"
        />
        <StyledButton disabled={!searchValue} type="submit" className="button">
          Search
        </StyledButton>
      </SearchForm>
    </SearchbarWrapper>
  );
};
Searchbar.propTypes = {
  setQuery: propTypes.func.isRequired,
};
