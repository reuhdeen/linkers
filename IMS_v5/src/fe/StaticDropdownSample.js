import React, { useState } from 'react';
import { Container } from 'reactstrap';
import StaticDropdown from '../api/StaticDropdown';

const FilterBy = [
  { id: 1, name: 'Operator' },
  { id: 2, name: 'Clients' },
  { id: 3, name: 'Partners' },
  { id: 4, name: 'Provider' },
  { id: 5, name: 'Games' },
  { id: 6, name: 'Players' },
];

const Currencies = [
  { id: 21, name: 'Operator' },
  { id: 22, name: 'Clients' },
  { id: 23, name: 'Partners' },
  { id: 24, name: 'Provider' },
  { id: 25, name: 'Games' },
  { id: 26, name: 'Players' },
];

const SortBy = [
  { id: 31, name: 'Operator' },
  { id: 32, name: 'Clients' },
  { id: 33, name: 'Partners' },
  { id: 34, name: 'Provider' },
  { id: 35, name: 'Games' },
  { id: 36, name: 'Players' },
];

const StaticDropdownSample = () => {
  const [selectedFilterBy, setSelectedFilterBy] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [selectedSortBy, setSelectedSortBy] = useState(null);

  const handleFilterByChange = (option) => setSelectedFilterBy(option);
  const handleCurrencyChange = (option) => setSelectedCurrency(option);
  const handleSortByChange = (option) => setSelectedSortBy(option);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFilterBy?.id || !selectedCurrency?.id || !selectedSortBy?.id) {
      alert('Please make sure all dropdowns have a selection.');
      return;
    }
    try {
      alert(
        `Selected Filter By: ID = ${selectedFilterBy.id}, Name = ${selectedFilterBy.name}\n` +
        `Selected Currency: ID = ${selectedCurrency.id}, Name = ${selectedCurrency.name}\n` +
        `Selected Sort By: ID = ${selectedSortBy.id}, Name = ${selectedSortBy.name}`
      );
    } catch (error) {
      console.error('There was an error:', error.response ? error.response.data : error.message);
      alert(`Error: ${error.response ? error.response.data : error.message}`);
    }
  };

  const isFormValid = selectedFilterBy?.id && selectedCurrency?.id && selectedSortBy?.id;

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center bordered-container top-margin" style={{ height: '10vh', border: '1px solid black', marginTop: '5px' }}>
      <form className="form-group-inline" onSubmit={handleFormSubmit}>
        <StaticDropdown
          name="filterBy"
          value={selectedFilterBy}
          onChange={handleFilterByChange}
          label="Filter By"
          options={FilterBy}
          idField="id"
          nameField="name"
          direction="up"
        />
        <StaticDropdown
          name="currency"
          value={selectedCurrency}
          onChange={handleCurrencyChange}
          label="Currency"
          options={Currencies}
          idField="id"
          nameField="name"
          direction="down"
        />
        <StaticDropdown
          name="sortBy"
          value={selectedSortBy}
          onChange={handleSortByChange}
          label="Sort By"
          options={SortBy}
          idField="id"
          nameField="name"
          direction="end"
        />
        <div className="submit-button-container">
          <button type="submit" className="btn btn-primary custom-button" disabled={!isFormValid}>Submit</button>
        </div>
      </form>
    </Container>
  );
};

export default StaticDropdownSample;
