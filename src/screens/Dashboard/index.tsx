
import React, { useCallback, useEffect, useState } from "react";
/* import { GestureHandlerRootView } from "react-native-gesture-handler"; */
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard/index';
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { useTheme } from "styled-components";
 
import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    LogoutButton,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LoadContainer,
    EmptyList,
} from "./styles";
import { useAuth } from "../../hooks/auth";

export interface DataListProps extends TransactionCardProps {
    id: string
}

interface highLightProps {
    amount: string;
    lastTransaction: string,
}

interface highLightData {
    entries: highLightProps,
    spent: highLightProps,
    total: highLightProps
}

export function Dashboard() {

    const [isLoading, setIsLoading] = useState(true)
    const [transaction, setTransaction] = useState<DataListProps[]>([]);
    const [highLightData, setHighLightData] = useState<highLightData>({} as highLightData);

    const theme = useTheme()
    const { signOut, user } = useAuth()

    function getLastTransactionDate(
        collection: DataListProps[],
        type: 'positive' | 'negative'
    ) {
        const collectionFiltered = collection
        .filter(transaction => transaction.type === type)

        if(collectionFiltered.length === 0) {
            return 0
        }

        const lastTransaction = new Date(Math.max.apply(Math, collectionFiltered
            .map(transaction => new Date(transaction.date).getTime())))
            

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleDateString('pt-br', {month: 'long'})}`
    }

    async function loadTransactions() {
        const dataKey = `@gofinances:transactions_user:${user.id}`
        const response = await AsyncStorage.getItem(dataKey)
        const transactions = response ? JSON.parse(response) : []

        let entriesTotal = 0;
        let spentTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions
        .map((item: DataListProps) => {

            if(item.type === 'positive'){
                entriesTotal += Number(item.amount)
            } else {
                spentTotal += Number(item.amount)
            }

            const amount = Number(item.amount)
            .toLocaleString('pt-br',{
                style: 'currency',
                currency: 'BRL'
            });

            const date = moment(new Date(item.date)).format("DD/MM/YYYY")

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date,
            }
        })

        setTransaction(transactionsFormatted.slice(0). reverse());

        const lastTransactionEntries = getLastTransactionDate(transactions, 'positive')
        const lastTransactionSpent = getLastTransactionDate(transactions, 'negative')
        const totalInterval = lastTransactionSpent === 0
        ? 'Nao ha transacoes'
        : `01 a ${lastTransactionSpent}`

        const total = entriesTotal - spentTotal

        setHighLightData({
            entries: {
                amount: entriesTotal
                .toLocaleString('pt-br',{
                    style: 'currency',
                    currency: 'BRL',
                }),
                lastTransaction: lastTransactionEntries === 0
                ? 'Nao ha transacoes'
                : `Ultima entrada dia ${lastTransactionEntries}`,
            },
            spent: {
                amount: spentTotal
                .toLocaleString('pt-br',{
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionSpent === 0
                ? 'Nao ha transacoes'
                : `Ultima saida dia ${lastTransactionEntries}`,
            },
            total: {
                amount: total
                .toLocaleString('pt-br',{
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: totalInterval
            }
        });

        setIsLoading(false)

    }

    useEffect(() => {
        loadTransactions();
    }, [])

    useFocusEffect(useCallback(() => {
        loadTransactions();
    },[]));


    return (
        <Container>
        {
            isLoading ?
                <LoadContainer>
                    <ActivityIndicator color={theme.colors.primary} size="large" />
                </LoadContainer> :
            <>
                <ActivityIndicator />
                <Header>
                    <UserWrapper>
                        <UserInfo>
                            <Photo source={{ uri: user.photo }} />
                            <User>
                                <UserGreeting>Ola,</UserGreeting>
                                <UserName>{user.name}</UserName>
                            </User>
                        </UserInfo>

                        <LogoutButton onPress={signOut}>
                            <Icon name="power" />
                        </LogoutButton>
                    </UserWrapper>
                </Header>

                <HighlightCards>
                    <HighlightCard
                        type="up"
                        title='Entradas'
                        amount={highLightData?.entries?.amount}
                        lastTransaction={highLightData.entries.lastTransaction}
                    />
                    <HighlightCard
                        type="down"
                        title='Saidas'
                        amount={highLightData?.spent?.amount}
                        lastTransaction={highLightData.spent.lastTransaction}
                    />
                    <HighlightCard
                        type="total"
                        title='Total'
                        amount={highLightData.total.amount}
                        lastTransaction={highLightData.total.lastTransaction}
                    />
                </HighlightCards>

                <Transactions>
                    <Title>Extrato</Title>

                    <TransactionList
                        data={transaction}
                        keyExtractor={ item => item.id }
                        renderItem={({ item }) =>  <TransactionCard data={item} />}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={() =>
                            <EmptyList>Registre sua primeira transação</EmptyList>
                        }
                    />

                </Transactions>

            </> 
        }
        </Container>
    )
}
