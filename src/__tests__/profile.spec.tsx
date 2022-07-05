import React from "react";
import { render } from '@testing-library/react-native'

import { Profile } from "../screens/Profile";

describe('Profile', () => {
    test('check if show correctly user input name placeholder', () => {
        const { getAllByPlaceholderText } = render(<Profile />);

        expect(getAllByPlaceholderText('Nome')).toBeTruthy()
    })

    test('checks if user data has been loaded', () => {
        const { getByTestId } = render(<Profile />)

        const inputName = getByTestId('input_name')
        const inputSobrenome = getByTestId('input_sobrenome')

        expect(inputName.props.value).toEqual('Joao')
        expect(inputSobrenome.props.value).toEqual('Lira')

    })

    test('checks if title render correctly', () => {
        const { getByTestId } = render(<Profile />)

        const textTitle = getByTestId('text_title')

        expect(textTitle.props.children).toContain('Perfil')
    })
})