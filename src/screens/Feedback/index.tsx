import {
    Container,
    Header,
    Title,
    Form,
    Wrapper,
    CheckBox,
    Text,
    Icon,
    QuestionWrapper,
    QuestionList,
} from "./styles";

import React, { useState } from 'react';

import { Button } from '../../components/Form/Button';
import { Input } from "../../components/Form/Input";
import { Keyboard, ToastAndroid } from "react-native";
import { QuestionCard } from "../../components/QuestionCard";

export interface DataProps {
    id: string
    question: string
    answer: string
}

export function Feedback() {
    const [done, setDone] = useState(false)
    const [inputText, setInputText] = useState('')

    const questions: DataProps[] = [
        {
            id: "1",
            question: "Contabilidade falha no levantamento dos gastos e lucros ?",
            answer: "Registre no app de modo minuncioso todas as entradas e saídas de dinheiro de sua organização, você faz os dados e o HelpFinance gera as informações!"
        },
        {
            id: "2",
            question: "Acha que a postura de seu gerente/superior é ofensiva e denigre o ambiente de trabalho ? ",
            answer: "Compartilhe com os superiores dos mesmos sua opnião e explique a diferença entre patrão e líder! Se pessoas agirem de modo desagradável acabam sendo alvo de um `motin mental` por parte dos empregados. Isso é ação e reação!"
        },
        {
            id: "3",
            question: "Tem alguma sugestão de algo que possa melhorar a eficiencia e agradabilidade do amiente da sua organização ? ",
            answer: "Não guarde pra si! Além de possibilitar um upgrade para seu local de trabalho, será bem visto pela sua atitude, mesmo que sua sugestão seja algo `bobo`."
        },
        {
            id: "4",
            question: "Você foi vítima de algum assédio em seu ambiente de trabalho? ",
            answer: "Denuncie ao setor de recursos humanos da empresa o mais rápido possível"
        }
    ]

    const handleDone = () => {
        setDone(!done)
    }

    const handleSubmit = () => {
        if (inputText.length > 0) {
            Keyboard.dismiss()
            setInputText('')
            ToastAndroid.show('Enviado com sucesso', 1000)
        } else {
            ToastAndroid.show('Escreva um feedback', 1000)
        }
    }

    return (
        <Container>

            <Header>
                <Title>FeedBack</Title>
            </Header>

            <Form>
                <Input
                    placeholder="Feedback"
                    numberOfLines={5} multiline
                    value={inputText}
                    onChangeText={(text) => setInputText(text)}
                />

                <Wrapper>
                    <CheckBox
                        onPress={handleDone}
                    >
                        {
                            done ?
                                <Icon source={require('../../assets/check.png')} />
                                : <></>
                        }
                    </CheckBox>
                    <Text>Deseja mostrar seu nome</Text>
                </Wrapper>

                <Button title="Enviar" onPress={handleSubmit} />
            </Form>

            <QuestionWrapper>
                <QuestionList
                    data={questions}
                    keyExtractor={item => String(item.id)}
                    renderItem={({ item }) => <QuestionCard data={item} />}
                    showsVerticalScrollIndicator={false}
                />

            </QuestionWrapper>

        </Container>
    );
}