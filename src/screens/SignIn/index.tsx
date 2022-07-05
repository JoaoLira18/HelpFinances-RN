import React, { useState } from "react";
import { ActivityIndicator, Alert, Platform } from "react-native";

import AppleSvg from '../../assets/apple.svg'
import GoogleSvg from '../../assets/google.svg'
import LogoSvg from '../../../src/assets/logo.svg'
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from "styled-components";

import { useAuth } from "../../hooks/auth"; 

import { SignInSocialButton } from '../../components/SignInSocialButton'

import {
    Container,
    Header,
    TitleWrapper,
    ProductName,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper,
} from './styles'

export function SignIn() {
    const { signInWithGoogle, signInWithApple } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const theme = useTheme()

    async function HandleSignInWithGoogle() {
        try {
            setIsLoading(true)
            return await signInWithGoogle();
        } catch (error) {
            console.log(error);
            Alert.alert('Nao foi possivel conectar a conta Google')
            setIsLoading(false)
        }
    }

    async function HandleSignInWithApple() {
        try {
            setIsLoading(true)
            return await signInWithApple();
        } catch (error) {
            console.log(error);
            Alert.alert('Nao foi possivel conectar a conta Apple')
            setIsLoading(false)
        }
    }

    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg
                        width={RFValue(100)}
                        height={RFValue(48)}
                    />

                    <ProductName>
                        HelpFinances
                    </ProductName>

                    <Title>
                        Controle suas {'\n'}
                        financas de forma {'\n'}
                        muito simples
                    </Title>
                </TitleWrapper>

                <SignInTitle>
                    Faca seu login com {'\n'}
                    uma das contas abaixo
                </SignInTitle>
            </Header>

            <Footer>
                <FooterWrapper>
                    <SignInSocialButton
                        title={"Entrar com Google"}
                        svg={GoogleSvg}
                        onPress={HandleSignInWithGoogle}
                    />

                    {
                        Platform.OS === 'ios' &&
                        <SignInSocialButton
                            title={"Entrar com Apple"}
                            svg={AppleSvg}
                            onPress={HandleSignInWithApple}
                        />
                    }
                </FooterWrapper>

                { isLoading &&
                    <ActivityIndicator
                        color={ theme.colors.shape }
                        style={{ marginTop: 18}}
                    />
                }
            </Footer>
        </Container>
    )
}