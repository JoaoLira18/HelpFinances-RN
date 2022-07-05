import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { DataProps } from '../../screens/Feedback';

export function QuestionCard({data: {question, answer}}: DataProps) {
    const [show, setShow] = useState(false)

    const openResponse = () => {
        setShow(!show)
    }

    useEffect(() => {setShow(false)}, [])

    return (
        <Card onPress={openResponse}>
            {show
                ? <Text>{`${question}\n${answer}`}</Text>
                : <Text>{question}</Text>
            }
        </Card>
    );
}

export const Card = styled.TouchableOpacity`
    background-color: ${({ theme }) => theme.colors.shape};
    border-radius: 20px;
    padding: 15px;
    margin-bottom: 10px;
`;

export const Text = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: 15px;
    color: ${({ theme }) => theme.colors.text_dark};
`;