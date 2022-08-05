import { AddListing } from "./AddListing";
import {render, screen} from '@testing-library/react'

test('render the AddListing form component', () => {
    render(<AddListing></AddListing>)
    const AddListingDiv = screen.getByTestId('AddListing')
    expect(AddListingDiv).toBeInTheDocument()
})