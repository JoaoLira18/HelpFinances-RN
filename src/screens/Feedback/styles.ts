import styled from "styled-components/native";
import { RFValue } from 'react-native-responsive-fontsize';
import { FlatList, FlatListProps } from "react-native";
import { DataProps } from ".";

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
    background-color: ${({ theme }) => theme.colors.primary};

    width: 100%;
    height: ${RFValue(70)}px;

    align-items: center;
    justify-content: flex-end;
    padding-bottom: 15px;
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(18)}px;
    color: ${({ theme }) => theme.colors.shape};
`;

export const Form = styled.View`
    width: 100%;

    padding: 24px;
`;

export const Wrapper = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export const CheckBox = styled.TouchableOpacity`
    border-width: 1px;
    height: 20px;
    width: 20px;
    border-radius: 2px;
    margin: 14px;
`;

export const Text = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(18)}px;
    color: ${({ theme }) => theme.colors.text_dark};
`;

export const Icon = styled.Image`
    position: relative;
    width: 30px;
    height: 30px;
    bottom: 10px;
`;

export const QuestionWrapper = styled.View`
    flex: 1;
    padding: 10px;
`;

export const QuestionList = styled(FlatList as new (props: FlatListProps<DataProps>) =>
FlatList<DataProps>)``;
