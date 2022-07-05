import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native'
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useTheme } from "styled-components";
import { useAuth } from "../../hooks/auth";

import { HistoryCard } from "../../components/HistoryCard";

import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer,
    EmpityVictoryPie,
} from './styles';

import { categories } from '../../utils/categories';

interface TransactionData {
    type: 'positive' | 'negative';
    name: string;
    amount: number;
    category: string;
    date: string;
}

interface CategoryData {
    key: string
    name: string;
    color: string;
    total: number;
    totalFormatted: string;
    percent: string;
}

export function Resume() {

    const [isLoading, setIsLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])

    const { user } = useAuth()

    const theme = useTheme()

    function handleDateChange(action: 'next' | 'prev') {

        if (action === 'next') {
            const newDate = addMonths(selectedDate, 1)
            setSelectedDate(newDate)
        } else {
            const newDate = subMonths(selectedDate, 1)
            setSelectedDate(newDate)
        }
    }

    async function loadData() {
        setIsLoading(true)
        const dataKey = `@gofinances:transactions_user:${user.id}`
        const resopnse = await AsyncStorage.getItem(dataKey)
        const responseFormatted = resopnse ? JSON.parse(resopnse) : []

        const spent = responseFormatted
            .filter((spent: TransactionData) =>
                spent.type === 'negative' &&
                new Date(spent.date).getMonth() === selectedDate.getMonth() &&
                new Date(spent.date).getFullYear() === selectedDate.getFullYear()
            )

        const spentTotal = spent.reduce((acumulator: number, spent: TransactionData) => {
            return acumulator + Number(spent.amount);
        }, 0);

        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0;

            spent.forEach((spent: TransactionData) => {
                if (spent.category === category.key) {
                    categorySum += spent.amount
                }
            });

            if (categorySum > 0) {
                const totalFormatted = categorySum
                    .toLocaleString('pt-br', {
                        style: 'currency',
                        currency: 'BRL',
                    })

                const percent = `${(categorySum / spentTotal * 100).toFixed(0)}%`

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    total: categorySum,
                    totalFormatted,
                    percent,
                })
            }
        })

        setTotalByCategories(totalByCategory);
        setIsLoading(false)
    }

    useFocusEffect(useCallback(() => {
        loadData();
    }, [selectedDate]))

    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>

            {
                isLoading ?
                    <LoadContainer>
                        <ActivityIndicator color={theme.colors.primary} size="large" />
                    </LoadContainer> :

                    <Content>
                        <MonthSelect>
                            <MonthSelectButton onPress={() => handleDateChange('prev')} >
                                <MonthSelectIcon name="chevron-left" />
                            </MonthSelectButton>

                            <Month>
                                {format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}
                            </Month>

                            <MonthSelectButton onPress={() => handleDateChange('next')} >
                                <MonthSelectIcon name="chevron-right" />
                            </MonthSelectButton>
                        </MonthSelect>

                        <ChartContainer>
                            {totalByCategories.length <= 0
                                ? <EmpityVictoryPie>
                                    Nenhum registro nesse periodo
                                </EmpityVictoryPie>

                                : <VictoryPie
                                    data={totalByCategories}
                                    colorScale={totalByCategories.map(category => category.color)}
                                    style={{
                                        labels: {
                                            fontSize: RFValue(18),
                                            fontWeight: 'bold',
                                            fill: theme.colors.shape
                                        }
                                    }}
                                    labelRadius={50}
                                    x="percent"
                                    y="total"
                                />
                            }
                        </ChartContainer>

                        {
                            totalByCategories.map((item: any) => (
                                <HistoryCard
                                    key={item.key}
                                    title={item.name}
                                    amount={item.totalFormatted}
                                    color={item.color}
                                />
                            ))
                        }
                    </Content>
            }
        </Container>
    )
}