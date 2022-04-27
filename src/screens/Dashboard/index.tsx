
import React, { useEffect, useState } from "react";
/* import { GestureHandlerRootView } from "react-native-gesture-handler"; */

import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard/index';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGretting,
    UserName,
    LogoutButton,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
} from "./styles";

export interface DataListProps extends TransactionCardProps {
    id: string
}

export function Dashboard() {

    const [data, setData] = useState<DataListProps[]>([])

    async function loadTransactions() {
        const dataKey = '@gofinances:transactions'
        const response = await AsyncStorage.getItem(dataKey)
        const transactions = response ? JSON.parse(response) : []

        const transactionsFormatted: DataListProps[] = transactions
        .map((item: DataListProps) => {
            const amount = Number(item.amount)
            .toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            })

            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
            }).format(new Date(item.date))

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                /*date, */
            }
        })

        console.log(transactionsFormatted)

        setData(transactionsFormatted)

    }

    useEffect(() => {
        loadTransactions();
    }, [])

    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/75041514?v=4' }} />
                        <User>
                            <UserGretting>Ola,</UserGretting>
                            <UserName>Joao</UserName>
                        </User>
                    </UserInfo>

                    <LogoutButton onPress={() => {}}>
                        <Icon name="power" />
                    </LogoutButton>
                </UserWrapper>
            </Header>

            <HighlightCards
                
            >
                <HighlightCard
                    type="up"
                    title='Entradas'
                    amount="R$ 17.400,00"
                    lastTransaction="Ultima entrada 13 de abril"
                />
                <HighlightCard
                    type="down"
                    title='Saidas'
                    amount="R$ 1.259,00"
                    lastTransaction="Ultima entrada 3 de abril"
                />
                <HighlightCard
                    type="total"
                    title='Total'
                    amount="R$ 16.141,00"
                    lastTransaction="01 a 06 de abril"
                />
            </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>

                <TransactionList
                    data={data}
                    keyExtractor={ item => item.id }
                    renderItem={({ item }) =>  <TransactionCard data={item} />}
                    showsVerticalScrollIndicator={false}
                />

            </Transactions>
        </Container>
    )
}

function useFocusedEffect(arg0: () => void, arg1: never[]) {
    throw new Error("Function not implemented.");
}
