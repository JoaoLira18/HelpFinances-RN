import React, { useState } from "react";
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import * as Yup from 'yup';
import { yupResolver } from '../../../node_modules/@hookform/resolvers/yup/src/yup';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";

import { Button } from "../../components/Form/Button";
import { InputForm } from "../../components/Form/InputForm";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { CategorySelect } from "../CategorySelect";
import uuid from 'react-native-uuid'

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes,
} from "./styles";

interface FormData {
    [name: string]: any;
    [amount: number]: any;
}

const schema = Yup.object().shape({
    name: Yup
    .string()
    .required('Nome e obrigatorio'),
    amount: Yup
    .number()
    .required("O preco e obrigatorio")
    .typeError('Informe um valor numerico')
    .positive('O valor nao pode ser negativo')
});

export function Register() {
    
    const [transactionType, setTransactionType] = useState('')
    const [categoryModalOpen, setcategoryModalOpen] = useState(false)

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    })

    const navigation = useNavigation()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    function handleTransactionTypeSelect(type: 'up' | 'down') {
        setTransactionType(type)
    }

    function handleOpenSelectCategoryModal() {
        setcategoryModalOpen(true);
    }

    function handleCloseSelectCategoryModal() {
        setcategoryModalOpen(false);
    }

    async function handleRegister(form: FormData) {

        if(!transactionType) {
            return Alert.alert("Selecione o tipo da transacao")
        }

        if(category.key === 'category') {
            return Alert.alert("Selecione a categoria")
        }

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key,
            date: new Date()
        }

        try {
            const dataKey = '@gofinances:transactions'

            const data = await AsyncStorage.getItem(dataKey)
            const currentData = data ? JSON.parse(data) : []

            const dataFormatted = [
                ...currentData,
                newTransaction
            ]

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))

            setTransactionType('')
            reset()
            setCategory({
                key: 'category',
                name: 'Categoria',
            })

            navigation.navigate("Listagem")

        } catch (error) {
            console.log(error)
            Alert.alert("Nao foi possivel salvar")
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
            <Container>
                
                <Header>
                    <Title>Cadastro</Title>
                </Header>

                <Form>
                    <Fields>
                        <InputForm
                            control={control}
                            placeholder="Nome"
                            name="name"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />

                        <InputForm
                            control={control}
                            placeholder="Preco"
                            name="amount"
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message}
                        />

                        <TransactionTypes>

                            <TransactionTypeButton
                                type="up"
                                title="Income"
                                onPress={() => handleTransactionTypeSelect('up')}
                                isActive={transactionType === 'up'}
                            />

                            <TransactionTypeButton
                                type="down"
                                title="Outcome"
                                onPress={() => handleTransactionTypeSelect('down')}
                                isActive={transactionType === 'down'}
                            />
                        </TransactionTypes>

                        <CategorySelectButton
                            title={category.name}
                            onPress={handleOpenSelectCategoryModal}
                        />

                    </Fields>

                    <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
                </Form>

                <Modal visible={categoryModalOpen} >
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>
                
            </Container>
        </TouchableWithoutFeedback>
    )
}