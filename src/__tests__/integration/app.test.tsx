/**
 * @jest-environment jsdom
 */

import React from 'react'
import { Axios } from '../../helpers/axios'
import { render, fireEvent, act, waitFor } from '@testing-library/react'
import { Provider as StoreProvider } from 'react-redux'
import { faker } from '@faker-js/faker'

import App from '../../components/App'
import { createStore } from '../../store'
import { FiltersWrapper } from '../../components/FiltersWrapper'

jest.mock('../../helpers/axios')

const mockAxios = Axios as jest.Mocked<typeof Axios>

const productBuilder = () => ({
  id: faker.datatype.number(),
  image: faker.image.imageUrl(),
  name: faker.lorem.words(),
  price: `from ${faker.commerce.price(1, 100, 2, '$')}`,
})

describe('The app ', () => {
  const setupApp = () =>
    render(
      <StoreProvider store={createStore()}>
        <FiltersWrapper>
          <App />
        </FiltersWrapper>
      </StoreProvider>,
    )

  afterEach(() => jest.clearAllMocks())

  test('it fetches and renders all products on the page', async () => {
    const data = [productBuilder(), productBuilder()]
    mockAxios.get.mockResolvedValue({ data })
    const { findAllByTestId } = setupApp()
    expect(await findAllByTestId('ProductTile')).toHaveLength(2)
  })

  test('it can open and close the filters panel', async () => {
    const { getByText, queryByText } = setupApp()
    expect(queryByText(/reset to defaults/i)).not.toBeInTheDocument()
    const filterButton = getByText(/filter/i)
    act(() => fireEvent.click(filterButton))
    expect(queryByText(/reset to defaults/i)).toBeInTheDocument()
    const viewResultsButton = getByText(/view results/i)
    act(() => fireEvent.click(viewResultsButton))
    expect(queryByText(/reset to defaults/i)).not.toBeInTheDocument()
    expect(queryByText(/view results/i)).not.toBeInTheDocument()
  })

  test('❌ it can search products as user types in the search field', async () => {
    jest.useFakeTimers()
    const data = [
      productBuilder(),
      productBuilder(),
      productBuilder(),
      productBuilder(),
      productBuilder(),
    ]
    const data2 = [productBuilder(), productBuilder()]
    mockAxios.get
      .mockResolvedValueOnce({ data })
      .mockResolvedValueOnce({ data: data2 })
    const { findAllByTestId, getByText, getByPlaceholderText } = setupApp()
    expect(await findAllByTestId('ProductTile')).toHaveLength(5)
    const filterButton = getByText(/filter/i)
    fireEvent.click(filterButton)
    const searchInput = getByPlaceholderText(/largo/i)
    fireEvent.change(searchInput, { target: { value: 'searching' } })
    act(() => jest.runAllTimers())
    await waitFor(() => expect(mockAxios.get).toHaveBeenCalledTimes(2))
    expect(await findAllByTestId('ProductTile')).toHaveLength(2)
  })
})
