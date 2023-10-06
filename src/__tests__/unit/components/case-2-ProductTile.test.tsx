/**
 * @jest-environment jsdom 
 */

import React from 'react'
import { axe } from 'jest-axe'
import { render } from '@testing-library/react'
import ProductTile from '../../../components/ProductTile'

describe('The <ProductTile /> component', () => {
  const defaultProductProps = {
    id: 12,
    name: 'Example product name',
    image: '/image.png',
    price: 'from $12.99',
    brand: 'Adidas',
    createdAt: '2020-02-11 00:00:00',
    isActive: true,
  }

  const setupProductTile = (props = defaultProductProps) => render(<ProductTile {...props as any} />)

  it('renders a product tile with name, image and price', () => {
    const { getByText, getByAltText } = setupProductTile()
    expect(getByText(defaultProductProps.name)).toBeInTheDocument()
    expect(getByText(defaultProductProps.price)).toBeInTheDocument()
    expect(getByAltText(defaultProductProps.name)).toBeInTheDocument()
  })

  it('renders a product tile with name and price only', () => {
    const { queryByAltText } = setupProductTile({ ...defaultProductProps, image: undefined })
    expect(queryByAltText(defaultProductProps.name)).toBeNull()
  })

  it('has no accessibility violations', async () => {
    const { container } = setupProductTile()
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
