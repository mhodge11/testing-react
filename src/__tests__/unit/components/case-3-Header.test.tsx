/**
 * @jest-environment jsdom 
 */

import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import Header from '../../../components/Header'
import { FiltersContext } from '../../../context/filters'

describe('The Header component', () => {
  const defaultContextValue = {
    toggleShowingFilters: jest.fn(),
  }

  const setupHeader = (contextValue = defaultContextValue) =>
    render(
      <FiltersContext.Provider value={contextValue as any}>
        <Header />
      </FiltersContext.Provider>,
    )

  it('renders header correctly', () => {
    const { asFragment } = setupHeader()
    expect(asFragment()).toMatchSnapshot()
  })

  it('toggles the filter open when the Filter button is clicked', () => {
    const { getByText } = setupHeader()
    const filterButton = getByText('Filter')
    fireEvent.click(filterButton)
    expect(defaultContextValue.toggleShowingFilters).toHaveBeenCalled()
  })
})
