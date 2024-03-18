// import React from 'react';

import { fireEvent, render, screen } from "@testing-library/react"
import SearchSelect, { SearchSelectOption } from "./SearchSelect";

describe("SearchSelect Component tests", () => {

  it("Should open a menu", () => {

    const options: SearchSelectOption[] = [
      {
        id: "1",
        onClick: jest.fn(),
        value: "Option 1"
      }
    ];

    render(<SearchSelect options={options} value={options[0]}/>);

    const component = screen.getByTestId(/search-select/);

    fireEvent.click(component);
    expect(screen.getByTestId(/search-select-content/)).toBeInTheDocument();
  })

})
